import { BigNumber, Contract, ethers, PayableOverrides } from 'ethers';
import { signDaiPermit, signERC2612Permit } from 'eth-permit';
import { useContext } from 'react';
import { ChainContext } from '../contexts/ChainContext';
import { TxContext } from '../contexts/TxContext';

import { ApprovalType, ICallData, ISettingsContext, ISignData, LadleActions, TokenType } from '../types';
import { MAX_256, ZERO_BN } from '../utils/constants';

import { ERC1155__factory, ERC20Permit__factory, Ladle } from '../contracts';
import { useApprovalMethod } from './useApprovalMethod';
import { SettingsContext } from '../contexts/SettingsContext';

/* Get the sum of the value of all calls */
const _getCallValue = (calls: ICallData[]): BigNumber =>
  calls.reduce((sum: BigNumber, call: ICallData) => {
    if (call.ignoreIf) return sum.add(ZERO_BN);
    return sum.add(call.overrides?.value ? BigNumber.from(call?.overrides?.value) : ZERO_BN);
  }, ZERO_BN);

/* Generic hook for chain transactions */
export const useChain = () => {
  const {
    settingsState: { approveMax, forceTransactions, diagnostics },
  } = useContext(SettingsContext) as ISettingsContext;

  const {
    chainState: {
      connection: { account, provider, chainId },
      contractMap,
    },
  } = useContext(ChainContext);

  const {
    txActions: { handleTx, handleSign, handleTxWillFail },
  } = useContext(TxContext);

  const approvalMethod = useApprovalMethod();

  /**
   * TRANSACTING
   * @param { ICallsData[] } calls list of callData as ICallData
   * @param { string } txCode internal transaction code
   *
   * * @returns { Promise<void> }
   */
  const transact = async (calls: ICallData[], txCode: string): Promise<void> => {
    const signer = account ? provider.getSigner(account) : provider.getSigner(0);

    /* Set the router contract instance, ladle by default */
    const _contract: Contract = contractMap.get('Ladle').connect(signer) as Ladle;

    /* First, filter out any ignored calls */
    const _calls = calls.filter((call: ICallData) => !call.ignoreIf);
    console.log('Batch multicalls: ', _calls);

    /* Encode each of the calls OR preEncoded route calls */
    const encodedCalls = _calls.map((call: ICallData) => {
      /* 'pre-encode' routed calls if required */
      if (call.operation === LadleActions.Fn.ROUTE || call.operation === LadleActions.Fn.MODULE) {
        if (call.fnName && call.targetContract) {
          const encodedFn = (call.targetContract as any).interface.encodeFunctionData(call.fnName, call.args);

          if (call.operation === LadleActions.Fn.ROUTE)
            return _contract.interface.encodeFunctionData(LadleActions.Fn.ROUTE, [
              call.targetContract.address,
              encodedFn,
            ]);

          if (call.operation === LadleActions.Fn.MODULE)
            return _contract.interface.encodeFunctionData(LadleActions.Fn.MODULE, [
              call.targetContract.address,
              encodedFn,
            ]);
        }
        throw new Error('Function name and contract target required for routing/ module interaction');
      }
      /* else */
      return _contract.interface.encodeFunctionData(call.operation as string, call.args);
    });

    // const calldata = wrapEtherModule.interface.encodeFunctionData('wrap', [other, WAD])
    // await ladle.ladle.moduleCall(wrapEtherModule.address, calldata, { value: WAD })
    // expect(await weth.balanceOf(other)).to.equal(WAD)

    /* calculate the value sent */
    const batchValue = _getCallValue(_calls);
    console.log('Batch value sent:', batchValue.toString());

    /* calculate the gas required */
    let gasEst: BigNumber;
    // let gasEstFail: boolean = false;
    try {
      gasEst = await _contract.estimateGas.batch(encodedCalls, { value: batchValue } as PayableOverrides);
      console.log('Auto gas estimate:', gasEst.mul(120).div(100).toString());
    } catch (e: any) {
      gasEst = BigNumber.from(500000);
      /* handle if the tx if going to fail and transactions aren't forced */
      if (!forceTransactions) return handleTxWillFail(e.error, txCode, e.transaction);
    }

    /* Finally, send out the transaction */
    return handleTx(
      () =>
        _contract.batch(encodedCalls, { value: batchValue, gasLimit: gasEst.mul(120).div(100) } as PayableOverrides),
      txCode
    );
  };

  /**
   * SIGNING
   * 1. Build the signatures of provided by ISignData[], returns ICallData for multicall.
   * 2. Sends off the approval tx, on completion of all txs, returns an empty array.
   * @param { ISignData[] } requestedSignatures
   * @param { string } txCode
   *
   * @returns { Promise<ICallData[]> }
   */
  const sign = async (requestedSignatures: ISignData[], txCode: string): Promise<ICallData[]> => {
    const signer = account ? provider.getSigner(account) : provider.getSigner(0);

    /* Get the spender if not provided, defaults to ladle */
    const getSpender = (spender: 'LADLE' | string) => {
      const _ladleAddr = contractMap.get('Ladle').address;
      if (ethers.utils.isAddress(spender)) {
        return spender;
      }
      return _ladleAddr;
    };

    /* First, filter out any ignored calls */
    const _requestedSigs = requestedSignatures.filter((_rs: ISignData) => !_rs.ignoreIf);

    const signedList = await Promise.all(
      _requestedSigs.map(async (reqSig: ISignData) => {
        const _spender = getSpender(reqSig.spender);
        /* set as MAX if apporve max is selected */
        const _amount = approveMax ? MAX_256 : reqSig.amount?.toString();

        diagnostics && console.log('Sign: Target', reqSig.target.symbol);
        diagnostics && console.log('Sign: Spender', _spender);
        diagnostics && console.log('Sign: Amount', _amount?.toString());

        /* Request the signature if using DaiType permit style */
        if (reqSig.target.tokenType === TokenType.ERC20_DaiPermit && chainId !== 42161) {
          // dai in arbitrum uses regular permits
          const { v, r, s, nonce, expiry, allowed } = await handleSign(
            /* We are pass over the generated signFn and sigData to the signatureHandler for tracking/tracing/fallback handling */
            () =>
              signDaiPermit(
                provider,
                /* build domain */
                {
                  name: reqSig.target.name,
                  version: reqSig.target.version,
                  chainId,
                  verifyingContract: reqSig.target.address,
                },
                account,
                _spender
              ),
            /* This is the function  to call if using fallback Dai approvals */
            () =>
              handleTx(
                /* get an ERC20 contract instance. This is only used in the case of fallback tx (when signing is not available) */
                () => ERC20Permit__factory.connect(reqSig.target.address, signer).approve(_spender, _amount as string),
                txCode,
                true
              ),
            txCode,
            approvalMethod
          );

          const args = [
            reqSig.target.address,
            _spender,
            nonce,
            expiry,
            allowed, // TODO check use amount if provided, else defaults to MAX.
            v,
            r,
            s,
          ] as LadleActions.Args.FORWARD_DAI_PERMIT;

          return {
            operation: LadleActions.Fn.FORWARD_DAI_PERMIT,
            args,
            ignoreIf: !(v && r && s), // set ignore flag if signature returned is null (ie. fallbackTx was used)
          };
        }

        /*
          Or else - if not DAI-BASED, request the signature using ERC2612 Permit style
          (handleSignature() wraps the sign function for in app tracking and tracing )
        */
        const { v, r, s, value, deadline } = await handleSign(
          () =>
            signERC2612Permit(
              provider,
              /* build domain */
              reqSig.domain || {
                // uses custom domain if provided, else use created Domain
                name: reqSig.target.name,
                version: reqSig.target.version,
                chainId,
                verifyingContract: reqSig.target.address,
              },
              account,
              _spender,
              _amount
            ),
          /* this is the function for if using fallback approvals */
          () =>
            handleTx(
              /* get an ERC20 or ERC1155 contract instance. Used in the case of fallback tx (when signing is not available) or token is ERC1155 */
              (reqSig.target as any).setAllowance
                ? () => ERC1155__factory.connect(reqSig.target.address, signer).setApprovalForAll(_spender, true)
                : () =>
                    ERC20Permit__factory.connect(reqSig.target.address, signer).approve(_spender, _amount as string),
              txCode,
              true
            ),
          txCode,

          reqSig.target.tokenType === TokenType.ERC20_DaiPermit ||
            reqSig.target.tokenType === TokenType.ERC20_Permit ||
            !reqSig.target.tokenType // handle fyTokens (don't have an explicit tokenType in the asset config)
            ? approvalMethod
            : ApprovalType.TX
        );

        const args = [
          reqSig.target.address, // the asset id OR the seriesId (if signing fyToken)
          _spender,
          value,
          deadline,
          v,
          r,
          s,
        ] as LadleActions.Args.FORWARD_PERMIT;

        return {
          operation: LadleActions.Fn.FORWARD_PERMIT,
          args,
          ignoreIf: !(v && r && s), // set ignore flag if signature returned is null (ie. fallbackTx was used)
        };
      })
    );

    /* Returns the processed list of txs required as ICallData[] */
    return signedList.filter((x: ICallData) => !x.ignoreIf);
  };

  return { sign, transact };
};
