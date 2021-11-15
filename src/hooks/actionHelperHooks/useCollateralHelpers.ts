import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { ChainContext } from '../../contexts/ChainContext';
import { UserContext } from '../../contexts/UserContext';
import { IVault } from '../../types';
import { cleanValue } from '../../utils/appUtils';
import { ZERO_BN } from '../../utils/constants';

import { calculateCollateralizationRatio, calculateMinCollateral, decimalNToDecimal18 } from '../../utils/yieldMath';

/* Collateralization hook calculates collateralization metrics */
export const useCollateralHelpers = (
  debtInput: string | undefined,
  collInput: string | undefined,
  vault: IVault | undefined
) => {
  /* STATE FROM CONTEXT */
  const {
    userState: { activeAccount, selectedBase, selectedIlk, priceMap },
    userActions: { updatePrice },
  } = useContext(UserContext);
  const {
    chainState: { contractMap },
  } = useContext(ChainContext);

  /* LOCAL STATE */
  const [collateralizationRatio, setCollateralizationRatio] = useState<string | undefined>();
  const [collateralizationPercent, setCollateralizationPercent] = useState<string | undefined>();
  const [undercollateralized, setUndercollateralized] = useState<boolean>(true);
  const [unhealthyCollatRatio, setUnhealthyCollatRatio] = useState<boolean>(false);

  const [oraclePrice, setOraclePrice] = useState<ethers.BigNumber>(ethers.constants.Zero);

  const [minCollateral, setMinCollateral] = useState<BigNumber>();
  const [minCollateral_, setMinCollateral_] = useState<string | undefined>();

  const [minCollatRatio, setMinCollatRatio] = useState<number | undefined>();
  const [minCollatRatioPct, setMinCollatRatioPct] = useState<string | undefined>();
  const [minSafeCollatRatio, setMinSafeCollatRatio] = useState<number | undefined>();
  const [minSafeCollatRatioPct, setMinSafeCollatRatioPct] = useState<string | undefined>();
  const [minSafeCollateral, setMinSafeCollateral] = useState<string | undefined>();
  const [maxRemovableCollateral, setMaxRemovableCollateral] = useState<string | undefined>();
  const [maxCollateral, setMaxCollateral] = useState<string | undefined>();

  /* update the prices if anything changes */
  useEffect(() => {
    if (selectedBase && selectedIlk && priceMap.get(selectedIlk.assetIdToUse)?.has(selectedBase.assetIdToUse)) {
      const _price = priceMap.get(selectedIlk.assetIdToUse).get(selectedBase.assetIdToUse); // get the price
      console.log('price: ', _price[0], 'decimals:', _price[3]);
      setOraclePrice(decimalNToDecimal18(_price[0], _price[2])); // make sure the price is 18decimals based
    } else {
      (async () => {
        if (selectedBase && selectedIlk) {
          /* Update Price before setting */
          const _price = await updatePrice(selectedIlk.assetIdToUse, selectedBase.assetIdToUse, selectedIlk.decimals);
          setOraclePrice(decimalNToDecimal18(_price, selectedBase.decimals)); // make sure the price is 18decimals based
        }
      })();
    }
  }, [priceMap, updatePrice, selectedBase?.decimals, selectedIlk?.decimals]);

  /* CHECK collateral selection and sets the max available collateral a user can add */
  useEffect(() => {
    activeAccount &&
      (async () => {
        const _max = await selectedIlk?.getBalance(activeAccount);
        _max && setMaxCollateral(ethers.utils.formatUnits(_max, selectedIlk.decimals)?.toString());
      })();
  }, [activeAccount, selectedIlk, setMaxCollateral]);

  /* handle changes to input values */
  useEffect(() => {
    /* NOTE: this whole function ONLY deals with decimal18, existing values are converted to decimal18 */
    const existingCollateral_ = vault?.ink ? vault.ink : ethers.constants.Zero;
    const existingCollateralAsWei = decimalNToDecimal18(existingCollateral_, selectedIlk?.decimals);

    const existingDebt_ = vault?.art ? vault.art : ethers.constants.Zero;
    const existingDebtAsWei = decimalNToDecimal18(existingDebt_, selectedBase?.decimals);

    const dInput =
      debtInput && Math.abs(parseFloat(debtInput)) > 0 ? ethers.utils.parseUnits(debtInput, 18) : ethers.constants.Zero;
    const cInput =
      collInput && Math.abs(parseFloat(collInput)) > 0 ? ethers.utils.parseUnits(collInput, 18) : ethers.constants.Zero;

    const totalCollateral = existingCollateralAsWei.add(cInput);
    const totalDebt = existingDebtAsWei.add(dInput);

    /* set the collateral ratio when collateral is entered */
    if (oraclePrice.gt(ethers.constants.Zero) && totalCollateral.gt(ethers.constants.Zero)) {
      const ratio = calculateCollateralizationRatio(totalCollateral, oraclePrice, totalDebt, false);
      const percent = calculateCollateralizationRatio(totalCollateral, oraclePrice, totalDebt, true);
      setCollateralizationRatio(ratio);
      setCollateralizationPercent(parseFloat(percent! || '0').toFixed(2));
    } else {
      setCollateralizationRatio('0.0');
      setCollateralizationPercent(cleanValue('0.0', 2));
    }

    /* check minimum collateral required base on debt */
    if (oraclePrice.gt(ethers.constants.Zero)) {
      const min = calculateMinCollateral(oraclePrice, totalDebt, minCollatRatio?.toString(), existingCollateralAsWei);
      const minSafeCalc = calculateMinCollateral(
        oraclePrice,
        totalDebt,
        (minSafeCollatRatio || 2.5).toString(),
        existingCollateralAsWei
      );

      /* Check max collateral that is removable (based on exisiting debt) */
      const _max = existingCollateralAsWei.sub(min);
      setMaxRemovableCollateral(ethers.utils.formatUnits(_max, 18).toString());

      // factor in the current collateral input if there is a valid chosen vault
      const minSafeWithCollat = BigNumber.from(minSafeCalc).sub(existingCollateralAsWei);

      // check for valid min safe scenarios
      const minSafe = minSafeWithCollat.gt(ethers.constants.Zero)
        ? ethers.utils.formatUnits(minSafeWithCollat, 18).toString()
        : undefined;
      setMinCollateral(min as BigNumber);
      setMinCollateral_(ethers.utils.formatUnits(min, 18).toString());
      setMinSafeCollateral(minSafe);
    } else {
      setMinCollateral(ZERO_BN);
      setMinCollateral_('0');
    }
  }, [
    priceMap,
    collInput,
    debtInput,
    selectedIlk,
    oraclePrice,
    vault,
    collateralizationRatio,
    selectedBase,
    minCollatRatio,
    minSafeCollatRatio,
  ]);

  /* Monitor for undercollaterization */
  useEffect(() => {
    parseFloat(collateralizationRatio!) >= minCollatRatio!
      ? setUndercollateralized(false)
      : setUndercollateralized(true);

    parseFloat(collateralizationRatio!) < minCollatRatio! + 0.2 && vault?.art.gt(ethers.constants.Zero)
      ? setUnhealthyCollatRatio(true)
      : setUnhealthyCollatRatio(false);
  }, [collateralizationRatio, minCollatRatio, vault?.art]);

  /* Get and set the min (and safe min) collateral ratio for this base/ilk pair */
  useEffect(() => {
    if (selectedBase && selectedIlk && contractMap.has('Cauldron')) {
      (async () => {
        const { ratio } = await contractMap.get('Cauldron').spotOracles(selectedBase.assetIdToUse, selectedIlk.assetIdToUse);
        if (ratio) {
          const _minCollatRatio = parseFloat(ethers.utils.formatUnits(ratio, 6));
          setMinCollatRatio(_minCollatRatio);
          setMinCollatRatioPct(`${parseFloat(ethers.utils.formatUnits(ratio * 100, 6)).toFixed(0)}`);

          const _minSafeCollatRatio = _minCollatRatio < 1.4 ? 1.5 : _minCollatRatio + 1;
          setMinSafeCollatRatio(_minSafeCollatRatio);
          setMinSafeCollatRatioPct((_minSafeCollatRatio * 100).toString());
        }
      })();
    }
  }, [selectedBase, selectedIlk, contractMap]);

  return {
    collateralizationRatio,
    collateralizationPercent,
    undercollateralized,
    minCollateral,
    minCollateral_,
    minCollatRatioPct,
    minSafeCollatRatioPct,
    minSafeCollateral,
    maxCollateral,
    maxRemovableCollateral,
    unhealthyCollatRatio,
  };
};
