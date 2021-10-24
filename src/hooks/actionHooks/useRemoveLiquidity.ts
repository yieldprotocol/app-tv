import { BigNumber, ethers } from 'ethers';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ICallData, ISeries, ActionCodes, LadleActions, RoutedActions, IVault } from '../../types';
import { getTxCode } from '../../utils/appUtils';
import { useChain } from '../useChain';
import { ChainContext } from '../../contexts/ChainContext';
import { HistoryContext } from '../../contexts/HistoryContext';
import { burn, burnFromStrategy, calcPoolRatios, sellFYToken } from '../../utils/yieldMath';
import { ZERO_BN } from '../../utils/constants';

export const usePool = (input: string | undefined) => {
  const poolMax = input;
  return { poolMax };
};

/* Hook for chain transactions */
export const useRemoveLiquidity = () => {
  const {
    chainState: { contractMap },
  } = useContext(ChainContext);
  const ladleAddress = contractMap?.get('Ladle')?.address;

  const { userState, userActions } = useContext(UserContext);
  const { activeAccount: account, assetMap, selectedStrategyAddr, strategyMap } = userState;
  const { updateSeries, updateAssets, updateStrategies } = userActions;
  const { sign, transact } = useChain();

  const {
    historyActions: { updateStrategyHistory },
  } = useContext(HistoryContext);

  const removeLiquidity = async (
    input: string,
    series: ISeries,
    matchingVault: IVault | undefined,
    tradeFyToken: boolean = true
  ) => {
    /* generate the reproducible txCode for tx tracking and tracing */
    const txCode = getTxCode(ActionCodes.REMOVE_LIQUIDITY, series.id);

    const _base = assetMap.get(series.baseId);
    const _strategy = strategyMap.get(selectedStrategyAddr);
    const _input = ethers.utils.parseUnits(input, _base.decimals);

    const [cachedBaseReserves, cachedFyTokenReserves] = await series.poolContract.getCache();
    const cachedRealReserves = cachedFyTokenReserves.sub(series.totalSupply);

    const lpReceived = burnFromStrategy(_strategy.poolTotalSupply!, _strategy.strategyTotalSupply!, _input);
    const [, _fyTokenReceived] = burn(series.baseReserves, series.fyTokenReserves, series.totalSupply, lpReceived);

    const matchingVaultId: string | undefined = matchingVault?.id;
    const matchingVaultDebt: BigNumber = matchingVault?.art || ZERO_BN;
    // Choose use use matching vault or not : matchign vaults is undefined or debt less than required fyToken
    const useMatchingVault: boolean = !!matchingVault && _fyTokenReceived.lte(matchingVaultDebt);

    const [minRatio, maxRatio] = calcPoolRatios(cachedBaseReserves, cachedRealReserves);
    const fyTokenReceivedGreaterThanDebt: boolean = _fyTokenReceived.gt(matchingVaultDebt);
    const fyTokenTrade: BigNumber = sellFYToken(
      series.baseReserves,
      series.fyTokenReserves,
      _fyTokenReceived,
      series.getTimeTillMaturity(),
      series.decimals
    );
    const fyTokenTradePossible = fyTokenTrade.gt(ethers.constants.Zero) && tradeFyToken;

    console.log('Strategy: ', _strategy);
    console.log('Vault to use for removal: ', matchingVaultId);
    console.log(useMatchingVault);
    console.log('input', _input.toString());
    console.log('lpTokens recieved from strategy token burn:', lpReceived.toString());
    console.log('fyToken recieved from lpTokenburn: ', _fyTokenReceived.toString());
    console.log('Debt: ', matchingVaultDebt?.toString());
    console.log('Is FyToken Recieved Greater Than Debt: ', fyTokenReceivedGreaterThanDebt);
    console.log('Is FyToken tradable?: ', fyTokenTradePossible);
    console.log('fyTokentrade value: ', fyTokenTrade);

    const permits: ICallData[] = await sign(
      [
        /* give strategy permission to sell tokens to pool */
        {
          target: _strategy!,
          spender: 'LADLE',
          amount: _input,
          ignoreIf: !_strategy,
        },

        /* give pool permission to sell tokens */
        {
          target: {
            address: series.poolAddress,
            name: series.poolName,
            version: series.poolVersion,
            symbol: series.poolSymbol,
          },
          spender: 'LADLE',
          amount: _input,
          ignoreIf: !!_strategy,
        },
      ],
      txCode
    );

    const calls: ICallData[] = [
      ...permits,

      /* FOR ALL REMOVES (when using a strategy) > move tokens from strategy to pool tokens  */
      {
        operation: LadleActions.Fn.TRANSFER,
        args: [selectedStrategyAddr, selectedStrategyAddr, _input] as LadleActions.Args.TRANSFER,
        ignoreIf: !_strategy,
      },
      {
        operation: LadleActions.Fn.ROUTE,
        args: [series.poolAddress] as RoutedActions.Args.BURN_STRATEGY_TOKENS,
        fnName: RoutedActions.Fn.BURN_STRATEGY_TOKENS,
        targetContract: _strategy ? _strategy.strategyContract : undefined,
        ignoreIf: !_strategy,
      },

      /* FOR ALL REMOVES NOT USING STRATEGY >  move tokens to poolAddress  : */
      {
        operation: LadleActions.Fn.TRANSFER,
        args: [series.poolAddress, series.poolAddress, _input] as LadleActions.Args.TRANSFER,
        ignoreIf: _strategy || series.seriesIsMature,
      },

      /**
       *
       * BEFORE MATURITY
       *
       * */

      /* OPTION 1. Remove liquidity and repay - BEFORE MATURITY  */ // If fytokenRecieved > debt
      // (ladle.transferAction(pool, pool, lpTokensBurnt),  ^^^^ DONE ABOVE^^^^)
      // ladle.routeAction(pool, ['burn', [ladle, ladle, minBaseReceived, minFYTokenReceived]),
      // ladle.repayFromLadleAction(vaultId, receiver),
      // ladle.closeFromLadleAction(vaultId, receiver),
      {
        operation: LadleActions.Fn.ROUTE,
        args: [ladleAddress, ladleAddress, minRatio, maxRatio] as RoutedActions.Args.BURN_POOL_TOKENS,
        fnName: RoutedActions.Fn.BURN_POOL_TOKENS,
        targetContract: series.poolContract,
        ignoreIf: !fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },
      {
        operation: LadleActions.Fn.REPAY_FROM_LADLE,
        args: [matchingVaultId, account] as LadleActions.Args.REPAY_FROM_LADLE,
        ignoreIf: !fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },
      {
        operation: LadleActions.Fn.CLOSE_FROM_LADLE,
        args: [matchingVaultId, account] as LadleActions.Args.CLOSE_FROM_LADLE,
        ignoreIf: !fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },

      /* OPTION 2.Remove liquidity, repay and sell - BEFORE MATURITY */
      // (ladle.transferAction(pool, pool, lpTokensBurnt),  ^^^^ DONE ABOVE^^^^)
      // ladle.routeAction(pool, ['burn', [receiver, ladle, 0, 0]),
      // ladle.repayFromLadleAction(vaultId, pool),
      // ladle.routeAction(pool, ['sellBase', [receiver, minBaseReceived]),
      {
        operation: LadleActions.Fn.ROUTE,
        args: [account, ladleAddress, minRatio, maxRatio] as RoutedActions.Args.BURN_POOL_TOKENS,
        fnName: RoutedActions.Fn.BURN_POOL_TOKENS,
        targetContract: series.poolContract,
        ignoreIf: fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },
      {
        operation: LadleActions.Fn.REPAY_FROM_LADLE,
        args: [
          matchingVaultId,
          fyTokenTradePossible ? series.poolAddress : account,
        ] as LadleActions.Args.REPAY_FROM_LADLE,
        ignoreIf: fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },
      {
        operation: LadleActions.Fn.ROUTE,
        args: [account, ethers.constants.Zero] as RoutedActions.Args.SELL_FYTOKEN, // TODO slippage
        fnName: RoutedActions.Fn.SELL_FYTOKEN,
        targetContract: series.poolContract,
        ignoreIf: !fyTokenTradePossible || fyTokenReceivedGreaterThanDebt || series.seriesIsMature || !useMatchingVault,
      },

      /* OPTION 4. Remove Liquidity and sell  - BEFORE MATURITY */
      // (ladle.transferAction(pool, pool, lpTokensBurnt),  ^^^^ DONE ABOVE^^^^)
      // ladle.routeAction(pool, ['burnForBase', [receiver, minBaseReceived]),
      {
        operation: LadleActions.Fn.ROUTE,
        args: [account, minRatio, maxRatio] as RoutedActions.Args.BURN_FOR_BASE,
        fnName: RoutedActions.Fn.BURN_FOR_BASE,
        targetContract: series.poolContract,
        ignoreIf: series.seriesIsMature || useMatchingVault,
      },

      /**
       *
       * AFTER MATURITY  ( DIRECT POOL REMOVES ONLY )
       *
       * */

      /* OPTION 3. remove Liquidity and redeem  - AFTER MATURITY */ // FIRST CHOICE after maturity
      // (ladle.transferAction(pool, pool, lpTokensBurnt),  ^^^^ DONE ABOVE^^^^)
      // ladle.routeAction(pool, ['burn', [receiver, fyToken, minBaseReceived, minFYTokenReceived]),
      // ladle.redeemAction(seriesId, receiver, 0),
      {
        operation: LadleActions.Fn.ROUTE,
        args: [account, series.fyTokenAddress, minRatio, maxRatio] as RoutedActions.Args.BURN_POOL_TOKENS, // TODO slippages
        fnName: RoutedActions.Fn.BURN_POOL_TOKENS,
        targetContract: series.poolContract,
        ignoreIf: !series.seriesIsMature,
      },
      {
        operation: LadleActions.Fn.REDEEM,
        args: [series.id, account, '0'] as LadleActions.Args.REDEEM, // TODO slippage
        ignoreIf: !series.seriesIsMature,
      },

      /* OPTION 5. NOT USED FOR NOW  remove Liquidity, redeem and Close - AFTER MATURITY */
      // (ladle.transferAction(pool, pool, lpTokensBurnt),  ^^^^ DONE ABOVE^^^^)
      // ladle.routeAction(pool, ['burn', [ladle, fyToken, minBaseReceived, minFYTokenReceived]),
      // ladle.redeemAction(seriesId, ladle, 0),
      // ladle.closeFromLadleAction(vaultId, receiver),
      {
        operation: LadleActions.Fn.ROUTE,
        args: [
          ladleAddress,
          series.fyTokenAddress,
          ethers.constants.Zero,
          ethers.constants.Zero,
        ] as RoutedActions.Args.BURN_POOL_TOKENS,
        fnName: RoutedActions.Fn.BURN_POOL_TOKENS,
        targetContract: series.poolContract,
        ignoreIf: true || _strategy || !series.seriesIsMature,
      },
      {
        operation: LadleActions.Fn.ROUTE,
        args: [account, minRatio, maxRatio] as RoutedActions.Args.BURN_FOR_BASE,
        fnName: RoutedActions.Fn.BURN_FOR_BASE,
        targetContract: series.poolContract,
        ignoreIf: true || _strategy || !series.seriesIsMature,
      },
      {
        operation: LadleActions.Fn.REDEEM,
        args: [series.id, ladleAddress, '0'] as LadleActions.Args.REDEEM,
        ignoreIf: true || _strategy || !series.seriesIsMature,
      },
      {
        operation: LadleActions.Fn.CLOSE_FROM_LADLE,
        args: [matchingVaultId, account] as LadleActions.Args.CLOSE_FROM_LADLE,
        ignoreIf: true || _strategy || !series.seriesIsMature,
      },
    ];

    await transact(calls, txCode);
    updateSeries([series]);
    updateAssets([_base]);
    updateStrategies([_strategy]);
    updateStrategyHistory([_strategy]);
  };

  return removeLiquidity;
};