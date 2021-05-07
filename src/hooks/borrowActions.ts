import { BigNumber, ethers } from 'ethers';
import { useContext } from 'react';
import { ChainContext } from '../contexts/ChainContext';
import { UserContext } from '../contexts/UserContext';
import { ICallData, IVault, SignType, ISeries } from '../types';
import { getTxCode } from '../utils/appUtils';
import { ETH_BASED_ASSETS, DAI_BASED_ASSETS, MAX_128, MAX_256 } from '../utils/constants';
import { useChain } from './chainHooks';

import { VAULT_OPS } from '../utils/operations';

/* Generic hook for chain transactions */
export const useBorrowActions = () => {
  const { chainState: { account, contractMap } } = useContext(ChainContext);
  const { userState, userActions } = useContext(UserContext);
  const { selectedIlkId, selectedSeriesId, seriesMap, assetMap } = userState;
  const { updateVaults } = userActions;

  const { sign, transact } = useChain();

  const _addEth = (value: BigNumber, series:ISeries): ICallData[] => {
    const isPositive = value.gte(ethers.constants.Zero);
    /* Check if the selected Ilk is, in fact, an ETH variety */
    if (ETH_BASED_ASSETS.includes(selectedIlkId) && isPositive) {
      /* return the add ETH OP */
      return [{
        operation: VAULT_OPS.JOIN_ETHER,
        args: [selectedIlkId],
        ignore: false,
        overrides: { value },
        series,
      }];
    }
    /* else return empty array */
    return [];
  };

  const _removeEth = (value: BigNumber, series:ISeries): ICallData[] => {
    /* First check if the selected Ilk is, in fact, an ETH variety */
    if (ETH_BASED_ASSETS.includes(selectedIlkId)) {
      /* return the remove ETH OP */
      return [{
        operation: VAULT_OPS.EXIT_ETHER,
        args: [selectedIlkId, account],
        ignore: value.gte(ethers.constants.Zero),
        series,
      }];
    }
    /* else return empty array */
    return [];
  };

  const borrow = async (
    vault: IVault|undefined,
    input: string|undefined,
    collInput: string|undefined,
  ) => {
    /* use the vault id provided OR Get a random vault number ready if reqd. */
    const vaultId = vault?.id || ethers.utils.hexlify(ethers.utils.randomBytes(12));
    /* set the series and ilk based on if a vault has been selected or it's a new vault */
    const series = vault ? seriesMap.get(vault.seriesId) : seriesMap.get(selectedSeriesId);
    const ilk = vault ? assetMap.get(vault.ilkId) : assetMap.get(selectedIlkId);
    /* generate the reproducible txCode for tx tracking and tracing */
    const txCode = getTxCode('020_', vaultId);

    /* parse inputs */
    const _input = input ? ethers.utils.parseEther(input) : ethers.constants.Zero;
    const _collInput = collInput ? ethers.utils.parseEther(collInput) : ethers.constants.Zero;

    /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
    const permits: ICallData[] = await sign([
      {
        targetAddress: ilk.address,
        targetId: ilk.id,
        spender: ilk.joinAddress,
        series,
        type: SignType.ERC2612,
        fallbackCall: { fn: 'approve', args: [], ignore: false, opCode: null },
        ignore: ETH_BASED_ASSETS.includes(selectedIlkId), /* Ignore if Eth varietal */
      },
    ], txCode);

    /* Collate all the calls required for the process (including depositing ETH, signing permits, and building vault if needed) */
    const calls: ICallData[] = [
      /* If vault is null, build a new vault, else ignore */
      {
        operation: VAULT_OPS.BUILD,
        args: [vaultId, selectedSeriesId, selectedIlkId],
        series,
        ignore: !!vault,
      },
      /* handle ETH deposit, if required */
      ..._addEth(_collInput, series),
      /* Include all the signatures gathered, if required  */
      ...permits,
      {
        operation: VAULT_OPS.SERVE,
        args: [vaultId, account, _collInput, _input, MAX_128],
        ignore: false,
        series,
      },
    ];

    /* handle the transaction */
    await transact('Ladle', calls, txCode);
    /* when complete, then update the changed elements */
    vault && updateVaults([vault]);
  };

  const repay = async (
    vault: IVault,
    input:string|undefined,
    collInput: string|undefined = '0', // optional - add(+) / remove(-) collateral in same tx.
  ) => {
    const txCode = getTxCode('030_', vault.id);
    const _input = input ? ethers.utils.parseEther(input) : ethers.constants.Zero;
    const _collInput = ethers.utils.parseEther(collInput);
    const series = seriesMap.get(vault.seriesId);
    const base = assetMap.get(vault.baseId);
    const _isDaiBased = DAI_BASED_ASSETS.includes(vault.baseId);

    const permits: ICallData[] = await sign([
      {
        // before maturity
        targetAddress: base.address,
        targetId: base.id,
        spender: 'LADLE',
        series,
        type: _isDaiBased ? SignType.DAI : SignType.ERC2612, // Type based on whether a DAI-TyPE base asset or not.
        fallbackCall: { fn: 'approve', args: [contractMap.get('Ladle'), MAX_256], ignore: false, opCode: null },
        message: 'Signing Dai Approval',
        ignore: false,
      },
      {
        // after maturity
        targetAddress: base.address,
        targetId: base.id,
        spender: base.joinAddress,
        series,
        type: _isDaiBased ? SignType.DAI : SignType.ERC2612, // Type based on whether a DAI-TyPE base asset or not.
        fallbackCall: { fn: 'approve', args: [contractMap.get('Ladle'), MAX_256], ignore: false, opCode: null },
        message: 'Signing Dai Approval',
        ignore: true,
      },
    ], txCode);

    const calls: ICallData[] = [
      ...permits,
      {
        operation: VAULT_OPS.TRANSFER_TO_POOL,
        args: [series.id, true, _input],
        series,
        ignore: false,
      },
      /* ladle.repay(vaultId, owner, inkRetrieved, 0) */
      {
        operation: VAULT_OPS.REPAY,
        args: [vault.id, account, _collInput, ethers.constants.Zero],
        series,
        ignore: false,
      },
      /* ladle.repayVault(vaultId, owner, inkRetrieved, MAX) */
      {
        operation: VAULT_OPS.REPAY_VAULT,
        args: [vault.id, account, BigNumber.from('1'), MAX_128],
        series,
        ignore: true, // TODO add in repay all logic
      },
      ..._removeEth(_collInput, series),
    ];
    await transact('Ladle', calls, txCode);
    updateVaults([vault]);
  };

  const rollDebt = async (
    vault: IVault,
    toSeries: ISeries,
    input: string | undefined,
  ) => {
    const txCode = getTxCode('040_', vault.seriesId);
    const _input = input ? ethers.utils.parseEther(input) : ethers.constants.Zero;
    const series = seriesMap.get(vault.seriesId);
    const calls: ICallData[] = [
      { // ladle.rollAction(vaultId: string, newSeriesId: string, max: BigNumberish)
        operation: VAULT_OPS.ROLL,
        args: [vault.id, toSeries.id, MAX_128],
        ignore: false,
        series,
      },
    ];
    await transact('Ladle', calls, txCode);
    updateVaults([vault]);
  };

  return {
    borrow,
    repay,
    rollDebt,
  };
};