import { ethers } from 'ethers';
import { useContext } from 'react';
import { buyBase, calculateSlippage } from '@yield-protocol/ui-math';

import { ETH_BASED_ASSETS } from '../../config/assets';
import { ChainContext } from '../../contexts/ChainContext';
import { HistoryContext } from '../../contexts/HistoryContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import { UserContext } from '../../contexts/UserContext';
import {
  ICallData,
  ISeries,
  ActionCodes,
  LadleActions,
  RoutedActions,
  IUserContextState,
  IUserContext,
  IUserContextActions,
} from '../../types';
import { cleanValue, getTxCode } from '../../utils/appUtils';
import { ONE_BN } from '../../utils/constants';
import { useChain } from '../useChain';
import { useAddRemoveEth } from './useAddRemoveEth';

/* Lend Actions Hook */
export const useClosePosition = () => {
  const {
    settingsState: { slippageTolerance },
  } = useContext(SettingsContext);

  const {
    chainState: { contractMap },
  } = useContext(ChainContext);

  const { userState, userActions }: { userState: IUserContextState; userActions: IUserContextActions } = useContext(
    UserContext
  ) as IUserContext;
  const { activeAccount: account, assetMap } = userState;
  const { updateSeries, updateAssets } = userActions;
  const {
    historyActions: { updateTradeHistory },
  } = useContext(HistoryContext);

  const { sign, transact } = useChain();

  const { removeEth } = useAddRemoveEth();

  const closePosition = async (
    input: string | undefined,
    series: ISeries,
    getValuesFromNetwork: boolean = true // get market values by network call or offline calc (default: NETWORK)
  ) => {
    const txCode = getTxCode(ActionCodes.CLOSE_POSITION, series.id);
    const base = assetMap.get(series.baseId)!;
    const cleanedInput = cleanValue(input, base.decimals);
    const _input = input ? ethers.utils.parseUnits(cleanedInput, base.decimals) : ethers.constants.Zero;

    const { fyTokenAddress, poolAddress, seriesIsMature } = series;
    const ladleAddress = contractMap.get('Ladle').address;

    /* assess how much fyToken is needed to buy base amount (input) */
    /* after maturity, fytoken === base (input) value */
    const _fyTokenValueOfInput = seriesIsMature
      ? _input
      : buyBase(
          series.sharesReserves,
          series.fyTokenReserves,
          series.getShares(_input),
          series.getTimeTillMaturity(),
          series.ts,
          series.g2,
          series.decimals,
          series.c,
          series.mu
        );

    /* calculate slippage on the base token expected to recieve ie. input */
    const _inputWithSlippage = calculateSlippage(_input, slippageTolerance.toString(), true);

    /* if ethBase */
    const isEthBase = ETH_BASED_ASSETS.includes(series.baseId);

    /* if approveMAx, check if signature is required */
    const alreadyApproved = (await series.fyTokenContract.allowance(account!, ladleAddress)).gte(_fyTokenValueOfInput);

    const permitCallData: ICallData[] = await sign(
      [
        {
          target: series,
          spender: 'LADLE',
          amount: _fyTokenValueOfInput,
          ignoreIf: alreadyApproved === true,
        },
      ],
      txCode
    );

    const removeEthCallData = isEthBase ? removeEth(ONE_BN) : [];

    /* Set the transferTo address based on series maturity */
    const transferToAddress = () => {
      if (seriesIsMature) return fyTokenAddress;
      return poolAddress;
    };

    /* receiver based on whether base is ETH (- or wrapped Base) */
    const receiverAddress = () => {
      if (isEthBase) return ladleAddress;
      // if ( unwrapping) return unwrapHandlerAddress;
      return account;
    };

    const calls: ICallData[] = [
      ...permitCallData,
      {
        operation: LadleActions.Fn.TRANSFER,
        args: [
          fyTokenAddress,
          transferToAddress(), // select destination based on maturity
          _fyTokenValueOfInput,
        ] as LadleActions.Args.TRANSFER,
        ignoreIf: false, // never ignore, even after maturity because we go through the ladle.
      },

      /* BEFORE MATURITY */
      {
        operation: LadleActions.Fn.ROUTE,
        args: [receiverAddress(), _inputWithSlippage] as RoutedActions.Args.SELL_FYTOKEN,
        fnName: RoutedActions.Fn.SELL_FYTOKEN,
        targetContract: series.poolContract,
        ignoreIf: seriesIsMature,
      },

      /* AFTER MATURITY */
      {
        operation: LadleActions.Fn.REDEEM,
        args: [series.id, receiverAddress(), _fyTokenValueOfInput] as LadleActions.Args.REDEEM,
        ignoreIf: !seriesIsMature,
      },

      ...removeEthCallData, // (exit_ether sweeps all the eth out the ladle, so exact amount is not importnat -> just greater than zero)
    ];
    await transact(calls, txCode);
    updateSeries([series]);
    updateAssets([base]);
    updateTradeHistory([series]);
  };

  return closePosition;
};
