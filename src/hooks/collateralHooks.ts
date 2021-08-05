import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { ChainContext } from '../contexts/ChainContext';
import { UserContext } from '../contexts/UserContext';
import { ICallData, IVault, SignType, ISeries, ActionCodes, IUserContext, LadleActions } from '../types';
import { getTxCode, cleanValue } from '../utils/appUtils';
import { DAI_BASED_ASSETS, ETH_BASED_ASSETS } from '../utils/constants';
import { useChain } from './chainHooks';

import { calculateCollateralizationRatio, calculateMinCollateral } from '../utils/yieldMath';

/* Collateralisation hook calculates collateralisation metrics */
export const useCollateralization = (
  debtInput: string | undefined,
  collInput: string | undefined,
  vault: IVault | undefined
) => {
  /* STATE FROM CONTEXT */
  const {
    userState: { selectedBaseId, selectedIlkId, priceMap },
    userActions: { updatePrice },
  } = useContext(UserContext);

  /* LOCAL STATE */
  const [collateralizationRatio, setCollateralizationRatio] = useState<string | undefined>();
  const [collateralizationPercent, setCollateralizationPercent] = useState<string | undefined>();

  const [undercollateralized, setUndercollateralized] = useState<boolean>(true);
  const [oraclePrice, setOraclePrice] = useState<ethers.BigNumber>(ethers.constants.Zero);

  // todo:
  const [collateralizationWarning, setCollateralizationWarning] = useState<string | undefined>();
  const [borrowingPower, setBorrowingPower] = useState<string | undefined>();
  const [minCollateral, setMinCollateral] = useState<string | undefined>();

  /* update the prices if anything changes */
  useEffect(() => {
    if (priceMap.get(selectedBaseId)?.has(selectedIlkId) ) {
      setOraclePrice(priceMap.get(selectedBaseId).get(selectedIlkId))
    } else {
      (async () => {
        selectedBaseId && selectedIlkId && setOraclePrice( await updatePrice(selectedBaseId, selectedIlkId) )
      })();
    }
  }, [priceMap, selectedBaseId, selectedIlkId, updatePrice]);

  useEffect(() => {
    const existingCollateral = vault?.ink || ethers.constants.Zero;
    const existingDebt = vault?.art || ethers.constants.Zero;

    const dInput = debtInput ? ethers.utils.parseEther(debtInput) : ethers.constants.Zero;
    const cInput = collInput ? ethers.utils.parseEther(collInput) : ethers.constants.Zero;

    const totalCollateral = existingCollateral.add(cInput);
    const totalDebt = existingDebt.add(dInput);

    /* set the collateral ratio when collateral is entered */
    if (oraclePrice?.gt(ethers.constants.Zero) && totalCollateral.gt(ethers.constants.Zero)) {
      const ratio = calculateCollateralizationRatio(totalCollateral, oraclePrice, totalDebt, false);
      const percent = calculateCollateralizationRatio(totalCollateral, oraclePrice, totalDebt, true);
      setCollateralizationRatio(ratio);
      setCollateralizationPercent(cleanValue(percent, 2));
    } else {
      setCollateralizationRatio('0.0');
      setCollateralizationPercent(cleanValue('0.0', 2));
    }

    /* check for undercollateralisation */
    if (collateralizationPercent && parseFloat(collateralizationPercent) <= 150) {
      setUndercollateralized(true);
    } else {
      setUndercollateralized(false);
    }

    /* check minimum collateral required base on debt */
    if (oraclePrice?.gt(ethers.constants.Zero)) {
      console.log(oraclePrice.toString(), totalDebt.toString(), existingCollateral.toString())


      const min = calculateMinCollateral(oraclePrice, totalDebt, '1.5', existingCollateral)
      setMinCollateral(min);
    } else {
      setMinCollateral('0');
    }

  }, [collInput, collateralizationPercent, debtInput, oraclePrice, vault]);

  // TODO marco add in collateralisation warning at about 150% - 200% " warning: vulnerable to liquidation"

  return {
    collateralizationRatio,
    collateralizationPercent,
    borrowingPower,
    collateralizationWarning,
    undercollateralized,
    minCollateral,
  };
};

export const useCollateralActions = () => {
  const {
    chainState: { account, contractMap },
  } = useContext(ChainContext);
  const { userState, userActions } = useContext(UserContext);
  const { selectedBaseId, selectedIlkId, selectedSeriesId, seriesMap, assetMap } = userState;
  const { updateAssets, updateVaults } = userActions;

  const { sign, transact } = useChain();

  // TODO MARCO > look at possibly refactoring to remove addEth and removeEth

  const addEth = (value: BigNumber, series: ISeries): ICallData[] => {
    const isPositive = value.gte(ethers.constants.Zero);
    /* Check if the selected Ilk is, in fact, an ETH variety */
    if (ETH_BASED_ASSETS.includes(selectedIlkId) && isPositive) {
      /* return the add ETH OP */
      return [
        {
          operation: LadleActions.Fn.JOIN_ETHER,
          args: [selectedIlkId] as LadleActions.Args.JOIN_ETHER,
          ignore: false,
          overrides: { value },
          series,
        },
      ];
    }
    /* else return empty array */
    return [];
  };

  const removeEth = (value: BigNumber, series: ISeries): ICallData[] => {
    /* First check if the selected Ilk is, in fact, an ETH variety */
    if (ETH_BASED_ASSETS.includes(selectedIlkId)) {
      /* return the remove ETH OP */
      return [
        {
          operation: LadleActions.Fn.EXIT_ETHER,
          args: [account] as LadleActions.Args.EXIT_ETHER,
          ignore: value.gte(ethers.constants.Zero),
          series,
        },
      ];
    }
    /* else return empty array */
    return [];
  };

  const addCollateral = async (vault: IVault | undefined, input: string) => {
    /* use the vault id provided OR Get a random vault number ready if reqd. */
    const vaultId = vault?.id || ethers.utils.hexlify(ethers.utils.randomBytes(12));
    /* set the series and ilk based on if a vault has been selected or it's a new vault */
    const series = vault ? seriesMap.get(vault.seriesId) : seriesMap.get(selectedSeriesId);
    const ilk = vault ? assetMap.get(vault.ilkId) : assetMap.get(selectedIlkId);
    const base = vault ? assetMap.get(vault.baseId) : assetMap.get(selectedBaseId);
    /* generate the reproducible txCode for tx tracking and tracing */
    const txCode = getTxCode(ActionCodes.ADD_COLLATERAL, vaultId);

    /* parse inputs to BigNumber in Wei */
    const _input = ethers.utils.parseEther(input);

    /* check if the ilk/asset is an eth asset variety, if so pour to Ladle */
    const _isEthBased = ETH_BASED_ASSETS.includes(ilk.id);
    const _isDaiBased = DAI_BASED_ASSETS.includes(base.id);

    const _pourTo = _isEthBased ? contractMap.get('Ladle').address : account;

    /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
    const permits: ICallData[] = await sign(
      [
        {
          target: ilk,
          type: _isDaiBased ? SignType.DAI : SignType.ERC2612,
          spender: ilk.joinAddress,
          series,
          ignore: _isEthBased,
        },
      ],
      txCode
    );

    const calls: ICallData[] = [
      /* If vault is null, build a new vault, else ignore */
      {
        operation: LadleActions.Fn.BUILD,
        args: [selectedSeriesId, selectedIlkId, '0'] as LadleActions.Args.BUILD,
        series,
        ignore: !!vault,
      },
      // ladle.joinEtherAction(ethId),
      ...addEth(_input, series),
      // ladle.forwardPermitAction(ilkId, true, ilkJoin.address, posted, deadline, v, r, s)
      ...permits,
      // ladle.pourAction(vaultId, ignored, posted, 0)
      {
        operation: LadleActions.Fn.POUR,
        args: [
          vaultId,
          _pourTo /* pour destination based on ilk/asset is an eth asset variety */,
          _input,
          ethers.constants.Zero,
        ] as LadleActions.Args.POUR,
        series,
        ignore: false,
      },
    ];

    await transact('Ladle', calls, txCode);
    updateVaults([vault]);
    updateAssets([base, ilk]);
  };

  const removeCollateral = async (vault: IVault, input: string) => {
    /* generate the txCode for tx tracking and tracing */
    const txCode = getTxCode(ActionCodes.REMOVE_COLLATERAL, vault.id);

    /* get associated series and ilk */
    const series = seriesMap.get(vault.seriesId);
    const ilk = assetMap.get(vault.ilkId);

    /* parse inputs to BigNumber in Wei, and NEGATE */
    const _input = ethers.utils.parseEther(input).mul(-1);

    /* check if the ilk/asset is an eth asset variety, if so pour to Ladle */
    const _pourTo = ETH_BASED_ASSETS.includes(ilk.id) ? contractMap.get('Ladle').address : account;

    const calls: ICallData[] = [
      // ladle.pourAction(vaultId, ignored, -posted, 0)
      {
        operation: LadleActions.Fn.POUR,
        args: [
          vault.id,
          _pourTo /* pour destination based on ilk/asset is an eth asset variety */,
          _input,
          ethers.constants.Zero,
        ] as LadleActions.Args.POUR,
        series,
        ignore: false,
      },
      ...removeEth(_input, series),
    ];

    await transact('Ladle', calls, txCode);
    updateVaults([vault]);
    updateAssets([ilk]);
  };

  return {
    addCollateral,
    removeCollateral,
    addEth,
    removeEth,
  };
};
