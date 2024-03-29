import { ethers } from 'ethers';
import { useCallback, useContext, useEffect, useState } from 'react';
import { sellFYToken, strategyTokenValue } from '@yield-protocol/ui-math';

import { SettingsContext } from '../../contexts/SettingsContext';
import { UserContext } from '../../contexts/UserContext';
import {
  IPriceContext,
  ISeries,
  ISettingsContext,
  IStrategy,
  IUserContext,
  IUserContextActions,
  IUserContextState,
  IVault,
} from '../../types';
import { cleanValue } from '../../utils/appUtils';
import { USDC, WETH } from '../../config/assets';
import { ZERO_BN } from '../../utils/constants';
import { PriceContext } from '../../contexts/PriceContext';

interface ILendPosition extends ISeries {
  currentValue_: string | undefined;
}

interface IStrategyPosition extends IStrategy {
  currentValue_: string | undefined;
}

export const useDashboardHelpers = () => {
  /* STATE FROM CONTEXT */
  const {
    settingsState: { dashHideEmptyVaults, dashHideInactiveVaults, dashCurrency },
  } = useContext(SettingsContext) as ISettingsContext;

  const {
    userState: { vaultMap, seriesMap, strategyMap },
  }: { userState: IUserContextState; userActions: IUserContextActions } = useContext(UserContext) as IUserContext;

  const { priceState, priceActions } = useContext(PriceContext) as IPriceContext;

  const { pairMap } = priceState;
  const { updateAssetPair } = priceActions;

  const currencySettingAssetId = dashCurrency === 'ETH' ? WETH : USDC;
  const currencySettingDigits = 2;
  const currencySettingSymbol = dashCurrency === 'ETH' ? 'Ξ' : '$';

  const [vaultPositions, setVaultPositions] = useState<IVault[]>([]);
  const [lendPositions, setLendPositions] = useState<ILendPosition[]>([]);
  const [strategyPositions, setStrategyPositions] = useState<IStrategyPosition[]>([]);

  const [totalDebt, setTotalDebt] = useState<string | null>(null);
  const [totalCollateral, setTotalCollateral] = useState<string | null>(null);
  const [totalLendBalance, setTotalLendBalance] = useState<string | null>(null);
  const [totalStrategyBalance, setTotalStrategyBalance] = useState<string | null>(null);

  /* set vault positions */
  useEffect(() => {
    const _vaultPositions = Array.from(vaultMap.values())
      .filter((vault) => (dashHideInactiveVaults ? vault.isActive : true))
      .filter((vault) => (dashHideEmptyVaults ? vault.ink.gt(ZERO_BN) || vault.accruedArt.gt(ZERO_BN) : true))
      .filter((vault) => vault.baseId !== vault.ilkId)
      .sort((vaultA, vaultB) => (vaultA.art.lt(vaultB.art) ? 1 : -1));
    setVaultPositions(_vaultPositions);
  }, [vaultMap, dashHideInactiveVaults, dashHideEmptyVaults]);

  /* set lend positions */
  useEffect(() => {
    const _lendPositions: ILendPosition[] = Array.from(seriesMap.values())
      .map((_series) => {
        const currentValue = sellFYToken(
          _series.sharesReserves,
          _series.fyTokenReserves,
          _series.fyTokenBalance || ethers.constants.Zero,
          _series.getTimeTillMaturity(),
          _series.ts,
          _series.g2,
          _series.decimals,
          _series.c,
          _series.mu
        );
        const currentValue_ =
          currentValue.lte(ethers.constants.Zero) && _series.fyTokenBalance?.gt(ethers.constants.Zero)
            ? _series.fyTokenBalance_
            : ethers.utils.formatUnits(currentValue, _series.decimals);
        return { ..._series, currentValue_ };
      })
      .filter((_series: ILendPosition) => _series.fyTokenBalance?.gt(ZERO_BN))
      .sort((_seriesA: ILendPosition, _seriesB: ILendPosition) =>
        _seriesA.fyTokenBalance?.gt(_seriesB.fyTokenBalance!) ? 1 : -1
      );
    setLendPositions(_lendPositions);
  }, [seriesMap]);

  /* set strategy positions */
  useEffect(() => {
    const _strategyPositions: IStrategyPosition[] = Array.from(strategyMap.values())
      .map((_strategy) => {
        const currentStrategySeries = seriesMap.get(_strategy.currentSeriesId);
        const [, currentValue] = strategyTokenValue(
          _strategy?.accountBalance || ethers.constants.Zero,
          _strategy?.strategyTotalSupply || ethers.constants.Zero,
          _strategy?.strategyPoolBalance || ethers.constants.Zero,
          currentStrategySeries?.sharesReserves!,
          currentStrategySeries?.fyTokenRealReserves!,
          currentStrategySeries?.totalSupply!,
          currentStrategySeries?.getTimeTillMaturity()!,
          currentStrategySeries?.ts!,
          currentStrategySeries?.g1!,
          currentStrategySeries?.decimals!
        );
        const currentValue_ = currentValue.eq(ethers.constants.Zero)
          ? _strategy.accountBalance_
          : ethers.utils.formatUnits(currentValue, _strategy.decimals!);
        return { ..._strategy, currentValue_ };
      })
      .filter((_strategy) => _strategy.accountBalance?.gt(ZERO_BN))
      .sort((_strategyA, _strategyB) => (_strategyA.accountBalance?.lt(_strategyB.accountBalance!) ? 1 : -1));
    setStrategyPositions(_strategyPositions);
  }, [strategyMap, seriesMap]);

  /* get a single position's ink or art in dai or eth (input the asset id): value can be art, ink, fyToken, or pooToken balances */
  const convertValue = useCallback(
    (toAssetId: string = USDC, fromAssetId: string, value: string) => {
      const pair = pairMap.get(toAssetId + fromAssetId);
      return (
        Number(ethers.utils.formatUnits(pair?.pairPrice || ethers.constants.Zero, pair?.baseDecimals)) * Number(value)
      );
    },
    [pairMap]
  );

  /* get pairInfo */
  useEffect(() => {
    /* get list of unique assets used */
    const assetsUsedList = [
      ...new Set([
        ...vaultPositions.map((v) => v.baseId),
        ...vaultPositions.map((v) => v.ilkId),
        ...lendPositions.map((p) => p.baseId),
        ...strategyPositions.map((p) => p.baseId),
      ]),
    ];
    /* update asset pair if they don't exist already */
    assetsUsedList.forEach(async (asset: string) => {
      !pairMap.has(USDC + asset) && updateAssetPair(USDC, asset);
      !pairMap.has(WETH + asset) && updateAssetPair(WETH, asset);
    });
  }, [lendPositions, strategyPositions, vaultPositions]);

  /* everytime the pairmap changes, get the  new values / totals */
  useEffect(() => {
    /* calc total debt */
    const _debts = vaultPositions.map((position) =>
      pairMap.has(currencySettingAssetId + position.baseId)
        ? convertValue(currencySettingAssetId, position.baseId, position.accruedArt_)
        : 0
    );
    setTotalDebt(cleanValue(_debts.reduce((sum, debt) => sum + debt, 0).toString(), currencySettingDigits));

    /* calc total collateral */
    const _collateral = vaultPositions.map((position) =>
      pairMap.has(currencySettingAssetId + position.ilkId)
        ? convertValue(currencySettingAssetId, position.ilkId, position.ink_)
        : 0
    );
    setTotalCollateral(
      cleanValue(_collateral.reduce((sum, collateral) => sum + collateral, 0).toString(), currencySettingDigits)
    );

    /* calc total collateral */
    const _lendBalances = lendPositions.map((position) =>
      pairMap.has(currencySettingAssetId + position.baseId)
        ? convertValue(currencySettingAssetId, position.baseId, position.currentValue_!)
        : 0
    );
    setTotalLendBalance(
      cleanValue(_lendBalances.reduce((sum, lent) => sum + lent, 0).toString(), currencySettingDigits)
    );

    /* calc total collateral */
    const _strategyBalances = strategyPositions.map((position) =>
      pairMap.has(currencySettingAssetId + position.baseId)
        ? convertValue(currencySettingAssetId, position.baseId, position.currentValue_!)
        : 0
    );
    setTotalStrategyBalance(
      cleanValue(_strategyBalances.reduce((sum, loaned) => sum + loaned, 0).toString(), currencySettingDigits)
    );
  }, [convertValue, currencySettingAssetId, lendPositions, pairMap, strategyPositions, vaultPositions]);

  return {
    vaultPositions,
    lendPositions,
    strategyPositions,
    totalDebt,
    totalCollateral,
    totalLendBalance,
    totalStrategyBalance,
    currencySettingDigits,
    currencySettingSymbol,
  };
};
