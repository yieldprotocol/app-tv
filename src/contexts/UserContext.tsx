import React, { useContext, useEffect, useReducer, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BigNumber, ethers } from 'ethers';

import {
  IAssetRoot,
  ISeriesRoot,
  IVaultRoot,
  ISeries,
  IAsset,
  IVault,
  IUserContextState,
  IUserContext,
  IStrategyRoot,
  IStrategy,
} from '../types';

import { ChainContext } from './ChainContext';
import { cleanValue, generateVaultName } from '../utils/appUtils';
import {
  calculateAPR,
  divDecimal,
  bytesToBytes32,
  floorDecimal,
  mulDecimal,
  secondsToFrom,
  sellFYToken,
  decimal18ToDecimalN,
} from '../utils/yieldMath';

import { WAD_BN, ZERO_BN } from '../utils/constants';

const UserContext = React.createContext<any>({});

const initState: IUserContextState = {
  userLoading: false,
  /* activeAccount */
  activeAccount: null,

  /* Item maps */
  assetMap: new Map<string, IAsset>(),
  seriesMap: new Map<string, ISeries>(),
  vaultMap: new Map<string, IVault>(),
  strategyMap: new Map<string, IStrategy>(),

  /* map of asset prices/limits  */
  priceMap: new Map<string, Map<string, any>>(),
  limitMap: new Map<string, Map<string, any>>(),

  vaultsLoading: true as boolean,
  seriesLoading: true as boolean,
  assetsLoading: true as boolean,
  strategiesLoading: true as boolean,
  pricesLoading: true as boolean,
  limitsLoading: true as boolean,

  /* Current User selections */
  selectedSeriesId: null,
  selectedIlkId: null, // initial ilk
  selectedBaseId: null, // initial base
  selectedVaultId: null,
  selectedStrategyAddr: null,
};

function userReducer(state: any, action: any) {
  /* Helper: only change the state if different from existing */ // TODO if even reqd.?
  const onlyIfChanged = (_action: any) =>
    state[action.type] === _action.payload ? state[action.type] : _action.payload;

  /* Reducer switch */
  switch (action.type) {
    case 'userLoading':
      return { ...state, userLoading: onlyIfChanged(action) };

    case 'activeAccount':
      return { ...state, activeAccount: onlyIfChanged(action) };

    case 'selectedVaultId':
      return { ...state, selectedVaultId: onlyIfChanged(action) };
    case 'selectedSeriesId':
      return { ...state, selectedSeriesId: onlyIfChanged(action) };
    case 'selectedIlkId':
      return { ...state, selectedIlkId: onlyIfChanged(action) };
    case 'selectedBaseId':
      return { ...state, selectedBaseId: onlyIfChanged(action) };
    case 'selectedStrategyAddr':
      return { ...state, selectedStrategyAddr: onlyIfChanged(action) };

    case 'assetMap':
      return { ...state, assetMap: onlyIfChanged(action) };
    case 'seriesMap':
      return { ...state, seriesMap: onlyIfChanged(action) };
    case 'vaultMap':
      return { ...state, vaultMap: onlyIfChanged(action) };
    case 'strategyMap':
      return { ...state, strategyMap: onlyIfChanged(action) };
    case 'priceMap':
      return { ...state, priceMap: onlyIfChanged(action) };

    case 'pricesLoading':
      return { ...state, pricesLoading: onlyIfChanged(action) };
    case 'vaultsLoading':
      return { ...state, vaultsLoading: onlyIfChanged(action) };
    case 'seriesLoading':
      return { ...state, seriesLoading: onlyIfChanged(action) };
    case 'assetsLoading':
      return { ...state, assetsLoading: onlyIfChanged(action) };
    case 'strategiesLoading':
      return { ...state, strategiesLoading: onlyIfChanged(action) };

    default:
      return state;
  }
}

const UserProvider = ({ children }: any) => {
  /* STATE FROM CONTEXT */
  const { chainState } = useContext(ChainContext);
  const {
    contractMap,
    connection: { account },
    chainLoading,
    seriesRootMap,
    assetRootMap,
    strategyRootMap,
  } = chainState;

  /* LOCAL STATE */
  const [userState, updateState] = useReducer(userReducer, initState);
  const [vaultFromUrl, setVaultFromUrl] = useState<string | null>(null);

  /* HOOKS */
  const { pathname } = useLocation();

  /* If the url references a series/vault...set that one as active */
  useEffect(() => {
    pathname && setVaultFromUrl(pathname.split('/')[2]);
  }, [pathname]);

  /* internal function for getting the users vaults */
  const _getVaults = useCallback(
    // async (fromBlock: number = 27096000) => {
    async (fromBlock: number = 1) => {
      const Cauldron = contractMap.get('Cauldron');
      const vaultsBuiltFilter = Cauldron.filters.VaultBuilt(null, account);
      const vaultsReceivedfilter = Cauldron.filters.VaultGiven(null, account);
      const vaultsDestroyedfilter = Cauldron.filters.VaultDestroyed(null);

      const [vaultsBuilt, vaultsReceived, vaultsDestroyed] = await Promise.all([
        Cauldron.queryFilter(vaultsBuiltFilter, fromBlock),
        Cauldron.queryFilter(vaultsReceivedfilter, fromBlock),
        Cauldron.queryFilter(vaultsDestroyedfilter, fromBlock),
      ]);

      const buildEventList: IVaultRoot[] = vaultsBuilt.map((x: any): IVaultRoot => {
        const { vaultId: id, ilkId, seriesId } = Cauldron.interface.parseLog(x).args;
        const series = seriesRootMap.get(seriesId);
        return {
          id,
          seriesId,
          baseId: series?.baseId!,
          ilkId,
          displayName: generateVaultName(id),
          decimals: series?.decimals!,
        };
      });

      const recievedEventsList: IVaultRoot[] = await Promise.all(
        vaultsReceived.map(async (x: any): Promise<IVaultRoot> => {
          const { vaultId: id } = Cauldron.interface.parseLog(x).args;
          const { ilkId, seriesId } = await Cauldron.vaults(id);
          const series = seriesRootMap.get(seriesId);
          return {
            id,
            seriesId,
            baseId: series?.baseId!,
            ilkId,
            displayName: generateVaultName(id),
            decimals: series?.decimals!,
          };
        })
      );

      const destroyedEventsList: string[] = vaultsDestroyed.map((x: any) => Cauldron.interface.parseLog(x).args[0]);
      console.log('DESTROYED VAULTS: ', destroyedEventsList);

      /* all vault excluing deleted vaults */
      const vaultList: IVaultRoot[] = [...buildEventList, ...recievedEventsList].filter(
        (x: IVaultRoot) => !destroyedEventsList.includes(x.id)
      );

      const newVaultMap = vaultList.reduce((acc: any, item: any) => {
        const _map = acc;
        _map.set(item.id, item);
        return _map;
      }, new Map()) as Map<string, IVaultRoot>;

      return newVaultMap;
      /* Update the local cache storage */
      // TODO setCachedVaults({ data: Array.from(newVaultMap.values()), lastBlock: await fallbackProvider.getBlockNumber() });
    },
    [account, contractMap, seriesRootMap]
  );

  /* Updates the assets with relevant *user* data */
  const updateAssets = useCallback(
    async (assetList: IAssetRoot[]) => {
      updateState({ type: 'assetsLoading', payload: true });
      let _publicData: IAssetRoot[] = [];
      let _accountData: IAsset[] = [];

      _publicData = await Promise.all(
        assetList.map(async (asset: IAssetRoot): Promise<IAssetRoot> => {
          const isYieldBase = !!Array.from(seriesRootMap.values()).find((x: any) => x.baseId === asset.id);

          const hasActiveJoin =
            ethers.utils.isAddress(asset.joinAddress) && asset.joinAddress !== ethers.constants.AddressZero;

          return {
            ...asset,
            isYieldBase,
            hasActiveJoin,
          };
        })
      );

      console.log('PUBLIC DATA', _publicData);

      /* add in the dynamic asset data of the assets in the list */
      if (account) {
        try {
          _accountData = await Promise.all(
            _publicData.map(async (asset: IAssetRoot): Promise<IAsset> => {
              const balance = await asset.getBalance(account);
              return {
                ...asset,
                balance: balance || ethers.constants.Zero,
                balance_: balance
                  ? cleanValue(ethers.utils.formatUnits(balance, asset.decimals), 2)
                  : cleanValue(ethers.utils.formatUnits(ethers.constants.Zero, asset.decimals)), // for display purposes only
              };
            })
          );
        } catch (e) {
          console.log(e);
        }
      }
      const _combinedData = _accountData.length ? _accountData : _publicData;

      /* get the previous version (Map) of the vaultMap and update it */
      const newAssetMap = new Map(
        _combinedData
          .filter((asset: IAssetRoot) => asset.showToken)
          .reduce((acc: any, item: any) => {
            const _map = acc;
            _map.set(item.id, item);
            return _map;
          }, userState.assetMap)
      );

      updateState({ type: 'assetMap', payload: newAssetMap });
      console.log('ASSETS updated (with dynamic data): ', newAssetMap);
      updateState({ type: 'assetsLoading', payload: false });
    },
    [account]
  );

  /* Updates the prices from the oracle with latest data */
  const updatePrice = useCallback(
    async (priceBase: string, quote: string, decimals: number = 18): Promise<BigNumber> => {
      updateState({ type: 'pricesLoading', payload: true });

      const Oracle =
        priceBase === '0x303400000000' || quote === '0x303400000000'
          ? contractMap.get('CompositeMultiOracle')
          : contractMap.get('ChainlinkMultiOracle');

      try {
        const _quoteMap = userState.priceMap;
        const _basePriceMap = _quoteMap.get(priceBase) || new Map<string, any>();
        // const Oracle = oracleSwitch();
        const [price] = await Oracle.peek(
          bytesToBytes32(priceBase, 6),
          bytesToBytes32(quote, 6),
          decimal18ToDecimalN(WAD_BN, decimals)
        );
        _basePriceMap.set(quote, price);
        _quoteMap.set(priceBase, _basePriceMap);

        updateState({ type: 'priceMap', payload: _quoteMap });
        console.log('Price Updated: ', priceBase, ' (', decimals, ') ->', quote, ':', price.toString());
        updateState({ type: 'pricesLoading', payload: false });

        return price;
      } catch (error) {
        console.log('Error getting pricing', error);
        updateState({ type: 'pricesLoading', payload: false });
        return ethers.constants.Zero;
      }
    },
    [contractMap, userState.priceMap]
  );

  /* Updates the prices from the oracle with latest data */
  const updateLimit = useCallback(
    async (ilk: string, base: string): Promise<[BigNumber, BigNumber, BigNumber, BigNumber]> => {
      const Cauldron = contractMap.get('Cauldron');
      try {
        const _limitMap = userState.limitMap;
        const _baseLimitMap = _limitMap.get(ilk) || new Map<string, any>();
        const [min, max, digits, sum] = await Cauldron.debt(ilk, base);

        _baseLimitMap.set(base, [min, max, digits, sum]);
        _limitMap.set(ilk, _baseLimitMap);

        updateState({ type: 'priceMap', payload: _limitMap });
        console.log(
          'Limit checked: ',
          ilk,
          ' ->',
          base,
          ':',
          min.toString(),
          max.toString(),
          digits.toString(),
          sum.toString()
        );
        return [min, max, digits, sum];
      } catch (error) {
        console.log('Error getting limits', error);
        return [ethers.constants.Zero, ethers.constants.Zero, ethers.constants.Zero, ethers.constants.Zero];
      }
    },
    [contractMap, userState.limitMap]
  );

  /* Updates the series with relevant *user* data */
  const updateSeries = useCallback(
    async (seriesList: ISeriesRoot[]) => {
      updateState({ type: 'seriesLoading', payload: true });
      let _publicData: ISeries[] = [];
      let _accountData: ISeries[] = [];

      /* Add in the dynamic series data of the series in the list */
      _publicData = await Promise.all(
        seriesList.map(async (series: ISeriesRoot): Promise<ISeries> => {
          /* Get all the data simultanenously in a promise.all */
          const [baseReserves, fyTokenReserves, totalSupply, fyTokenRealReserves, mature] = await Promise.all([
            series.poolContract.getBaseBalance(),
            series.poolContract.getFYTokenBalance(),
            series.poolContract.totalSupply(),
            series.fyTokenContract.balanceOf(series.poolAddress),
            series.isMature(),
          ]);

          /* Calculates the base/fyToken unit selling price */
          const _sellRate = sellFYToken(
            baseReserves,
            fyTokenReserves,
            ethers.utils.parseUnits('1', series.decimals),
            secondsToFrom(series.maturity.toString()),
            series.decimals
          );

          const apr =
            calculateAPR(floorDecimal(_sellRate), ethers.utils.parseUnits('1', series.decimals), series.maturity) ||
            '0';

          return {
            ...series,
            baseReserves,
            baseReserves_: ethers.utils.formatUnits(baseReserves, series.decimals),
            fyTokenReserves,
            fyTokenRealReserves,
            totalSupply,
            totalSupply_: ethers.utils.formatUnits(totalSupply, series.decimals),
            apr: `${Number(apr).toFixed(2)}`,
            seriesIsMature: mature,
          };
        })
      );

      if (account) {
        _accountData = await Promise.all(
          _publicData.map(async (series: ISeries): Promise<ISeries> => {
            /* Get all the data simultanenously in a promise.all */
            const [poolTokens, fyTokenBalance] = await Promise.all([
              series.poolContract.balanceOf(account),
              series.fyTokenContract.balanceOf(account),
            ]);
            const poolPercent = mulDecimal(divDecimal(poolTokens, series.totalSupply), '100');
            return {
              ...series,
              poolTokens,
              fyTokenBalance,
              poolTokens_: ethers.utils.formatUnits(poolTokens, series.decimals),
              fyTokenBalance_: ethers.utils.formatUnits(fyTokenBalance, series.decimals),
              poolPercent,
            };
          })
        );
      }

      const _combinedData = _accountData.length ? _accountData : _publicData;

      /* combined account and public series data reduced into a single Map */
      const newSeriesMap = new Map(
        _combinedData.reduce((acc: any, item: any) => {
          const _map = acc;
          _map.set(item.id, item);
          return _map;
        }, userState.seriesMap)
      );

      // const combinedSeriesMap = new Map([...userState.seriesMap, ...newSeriesMap ])

      updateState({ type: 'seriesMap', payload: newSeriesMap });
      console.log('SERIES updated (with dynamic data): ', newSeriesMap);
      updateState({ type: 'seriesLoading', payload: false });

      return newSeriesMap;
    },
    [account]
  );

  /* Updates the vaults with *user* data */
  const updateVaults = useCallback(
    async (vaultList: IVaultRoot[]) => {
      updateState({ type: 'vaultsLoading', payload: true });
      let _vaultList: IVaultRoot[] = vaultList;
      const Cauldron = contractMap.get('Cauldron');
      const Witch = contractMap.get('Witch');

      /* if vaultList is empty, fetch complete Vaultlist from chain via _getVaults */
      if (vaultList.length === 0) _vaultList = Array.from((await _getVaults()).values());

      /* Add in the dynamic vault data by mapping the vaults list */
      const vaultListMod = await Promise.all(
        _vaultList.map(async (vault: IVaultRoot): Promise<IVault> => {
          /* update balance and series  ( series - because a vault can have been rolled to another series) */
          const [{ ink, art }, { owner, seriesId, ilkId }, { min: minDebt, max: maxDebt, sum: totalDebt }] =
            await Promise.all([
              await Cauldron.balances(vault.id),
              await Cauldron.vaults(vault.id),
              await Cauldron.debt(vault.baseId, vault.ilkId),
            ]);

          const baseRoot: IAssetRoot = assetRootMap.get(vault.baseId);
          const ilkRoot: IAssetRoot = assetRootMap.get(ilkId);

          return {
            ...vault,
            owner, // refreshed in case owner has been updated
            isWitchOwner: Witch.address === owner, // check if witch is the owner (in liquidation process)
            isActive: owner === account, // refreshed in case owner has been updated
            seriesId, // refreshed in case seriesId has been updated
            ilkId, // refreshed in case ilkId has been updated
            ink,
            art,
            ink_: cleanValue(ethers.utils.formatUnits(ink, ilkRoot?.decimals), ilkRoot?.digitFormat), // for display purposes only
            art_: cleanValue(ethers.utils.formatUnits(art, baseRoot?.decimals), baseRoot?.digitFormat), // for display purposes only
            minDebt,
            maxDebt,
          };
        })
      );

      /* Get the previous version (Map) of the vaultMap and update it */
      const newVaultMap = new Map(
        vaultListMod.reduce((acc: any, item: any) => {
          const _map = acc;
          _map.set(item.id, item);
          return _map;
        }, new Map())
      );

      /* if there are no vaults provided - assume a forced refresh of all vaults : */
      const combinedVaultMap = vaultList.length > 0 ? new Map([...userState.vaultMap, ...newVaultMap]) : newVaultMap;

      /* update state */
      updateState({ type: 'vaultMap', payload: combinedVaultMap });
      vaultFromUrl && updateState({ type: 'selectedVaultId', payload: vaultFromUrl });
      updateState({ type: 'vaultsLoading', payload: false });

      console.log('VAULTS: ', combinedVaultMap);
    },
    [contractMap, _getVaults, userState.vaultMap, vaultFromUrl, assetRootMap, account]
  );

  /* Updates the assets with relevant *user* data */
  const updateStrategies = useCallback(
    async (strategyList: IStrategyRoot[]) => {
      updateState({ type: 'strategiesLoading', payload: true });
      let _publicData: IStrategy[] = [];
      let _accountData: IStrategy[] = [];

      _publicData = await Promise.all(
        strategyList.map(async (_strategy: IStrategyRoot): Promise<IStrategy> => {
          /* Get all the data simultanenously in a promise.all */
          const [strategyTotalSupply, currentSeriesId, currentPoolAddr, nextSeriesId] = await Promise.all([
            _strategy.strategyContract.totalSupply(),
            _strategy.strategyContract.seriesId(),
            _strategy.strategyContract.pool(),
            _strategy.strategyContract.nextSeriesId(),
          ]);
          const currentSeries: ISeries = userState.seriesMap.get(currentSeriesId);
          const nextSeries: ISeries = userState.seriesMap.get(nextSeriesId);

          if (currentSeries) {
            const [poolTotalSupply, strategyPoolBalance] = await Promise.all([
              currentSeries.poolContract.totalSupply(),
              currentSeries.poolContract.balanceOf(_strategy.address),
            ]);

            const [currentInvariant, initInvariant] = currentSeries.seriesIsMature
              ? [ZERO_BN, ZERO_BN]
              : [ZERO_BN, ZERO_BN];
            // TODO Re-include invariant
            // : await Promise.all([
            //     currentSeries.poolContract.invariant(),
            //     _strategy.strategyContract.invariants(currentPoolAddr),
            //   ]);

            const strategyPoolPercent = mulDecimal(divDecimal(strategyPoolBalance, poolTotalSupply), '100');
            const returnRate = currentInvariant && currentInvariant.sub(initInvariant)!;

            return {
              ..._strategy,
              strategyTotalSupply,
              strategyTotalSupply_: ethers.utils.formatUnits(strategyTotalSupply, _strategy.decimals),
              poolTotalSupply,
              poolTotalSupply_: ethers.utils.formatUnits(poolTotalSupply, _strategy.decimals),
              strategyPoolBalance,
              strategyPoolBalance_: ethers.utils.formatUnits(strategyPoolBalance, _strategy.decimals),
              strategyPoolPercent,
              currentSeriesId,
              currentPoolAddr,
              nextSeriesId,
              currentSeries,
              nextSeries,
              initInvariant: initInvariant || BigNumber.from('0'),
              currentInvariant: currentInvariant || BigNumber.from('0'),
              returnRate,
              returnRate_: returnRate.toString(),
              active: true,
            };
          }

          /* else return an 'EMPTY' strategy */
          return {
            ..._strategy,
            currentSeriesId,
            currentPoolAddr,
            nextSeriesId,
            currentSeries: undefined,
            nextSeries: undefined,
            active: false,
          };
        })
      );

      /* add in account specific data */
      if (account) {
        _accountData = await Promise.all(
          _publicData
            // .filter( (s:IStrategy) => s.active) // filter out strategies with no current series
            .map(async (_strategy: IStrategy): Promise<IStrategy> => {
              const [accountBalance, accountPoolBalance] = await Promise.all([
                _strategy.strategyContract.balanceOf(account),
                _strategy.currentSeries?.poolContract.balanceOf(account),
              ]);

              const accountStrategyPercent = mulDecimal(
                divDecimal(accountBalance, _strategy.strategyTotalSupply || '0'),
                '100'
              );

              return {
                ..._strategy,
                accountBalance,
                accountBalance_: ethers.utils.formatUnits(accountBalance, _strategy.decimals),
                accountPoolBalance,
                accountStrategyPercent,
              };
            })
        );
      }

      const _combinedData = _accountData.length ? _accountData : _publicData; // .filter( (s:IStrategy) => s.active) ; // filter out strategies with no current series

      /* combined account and public series data reduced into a single Map */
      const newStrategyMap = new Map(
        _combinedData.reduce((acc: any, item: any) => {
          const _map = acc;
          _map.set(item.address, item);
          return _map;
        }, userState.strategyMap)
      );

      const combinedMap = newStrategyMap;

      updateState({ type: 'strategyMap', payload: combinedMap });
      updateState({ type: 'strategiesLoading', payload: false });

      console.log('STRATEGIES updated (with dynamic data): ', combinedMap);

      return combinedMap;
    },
    [account, userState.seriesMap] // userState.strategyMap excluded on purpose
  );

  useEffect(() => {
    /* When the chainContext is finished loading get the dynamic series, asset and strategies data */
    if (!chainLoading) {
      seriesRootMap.size && updateSeries(Array.from(seriesRootMap.values()));
      assetRootMap.size && updateAssets(Array.from(assetRootMap.values()));
    }
  }, [account, chainLoading, assetRootMap, seriesRootMap, updateSeries, updateAssets]);

  useEffect(() => {
    /* When seriesContext is finished loading get the strategies data */
    !userState.seriesLoading && strategyRootMap.size && updateStrategies(Array.from(strategyRootMap.values()));
  }, [strategyRootMap, updateStrategies, userState.seriesLoading]);

  useEffect(() => {
    /* When the chainContext is finished loading get the users vault data */
    if (!chainLoading && account !== null) {
      console.log('Checking User Vaults');
      /* trigger update of update all vaults by passing empty array */
      updateVaults([]);
    }
    /* keep checking the active account when it changes/ chainlaoding */
    updateState({ type: 'activeAccount', payload: account });
  }, [account, chainLoading]); // updateVaults ignored here on purpose

  /* Exposed userActions */
  const userActions = {
    updateSeries,
    updateAssets,
    updateVaults,
    updateStrategies,
    updatePrice,
    updateLimit,

    setSelectedVault: (vaultId: string | null) => updateState({ type: 'selectedVaultId', payload: vaultId }),
    setSelectedIlk: (assetId: string | null) => updateState({ type: 'selectedIlkId', payload: assetId }),
    setSelectedSeries: (seriesId: string | null) => updateState({ type: 'selectedSeriesId', payload: seriesId }),
    setSelectedBase: (assetId: string | null) => updateState({ type: 'selectedBaseId', payload: assetId }),
    setSelectedStrategy: (strategyAddr: string | null) =>
      updateState({ type: 'selectedStrategyAddr', payload: strategyAddr }),
  };

  return <UserContext.Provider value={{ userState, userActions } as IUserContext}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
