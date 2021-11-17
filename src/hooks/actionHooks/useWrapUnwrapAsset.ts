import { BigNumber, Contract } from 'ethers';
import { useContext } from 'react';
import { ChainContext } from '../../contexts/ChainContext';
import { SettingsContext } from '../../contexts/SettingsContext';

import {
  ICallData,
  LadleActions,
  IAsset,
  RoutedActions,
} from '../../types';
import { MAX_256 } from '../../utils/constants';

import { useChain } from '../useChain';

export const useWrapUnwrapAsset = () => {
  
  const {
    chainState: {
      connection: { account, provider },
      contractMap,
      assetRootMap,
    },
  } = useContext(ChainContext);

  const {
    settingsState: { unwrapTokens },
  } = useContext(SettingsContext);

  const signer = account ? provider?.getSigner(account) : provider?.getSigner(0);
  const { sign } = useChain();

  const wrapHandlerAbi = ['function wrap(address to)', 'function unwrap(address to)'];
  
  const wrapAssetToJoin = async (value: BigNumber, asset: IAsset, txCode: string) : Promise<ICallData[]> => {

    const ladleAddress = contractMap.get('Ladle').address;
    
    if (asset.useWrappedVersion) {
      const wraphandlerContract: Contract = new Contract(
        asset.wrapHandlerAddress,
        wrapHandlerAbi,
        signer
      );
      const unwrappedAssetContract = assetRootMap.get(asset.id)
      console.log('asset Contract to be signed for wrapping:', unwrappedAssetContract  )

      /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
      const permit: ICallData[] = await sign(
        [
          {
            target: unwrappedAssetContract, // full target contract
            spender: ladleAddress,
            amount: MAX_256,
            ignoreIf: false,
          },
        ],
        txCode
      );

      return [
        ...permit,
        {
          operation: LadleActions.Fn.TRANSFER,
          args: [asset.address, asset.wrapHandlerAddress, value] as LadleActions.Args.TRANSFER,
          ignoreIf: false,
        },
        {
          operation: LadleActions.Fn.ROUTE,
          args: [asset.joinAddress] as RoutedActions.Args.WRAP,
          fnName: RoutedActions.Fn.WRAP,
          targetContract: wraphandlerContract,
          ignoreIf: false,
        },
      ];
    }
    /* else  if not a wrapped asset simply return empty array */
    return [];
  };

  const unwrapAsset = async (
    asset: IAsset,
    receiver: string
  ) : Promise<ICallData[]> => {

    const wraphandlerContract: Contract = new Contract(
      asset.unwrapHandlerAddress,
      wrapHandlerAbi,
      signer
    );
    
    if (asset.unwrapHandlerAddress && unwrapTokens) {
      console.log('Unwrapping token');
      /* Gather all the required signatures - sign() processes them and returns them as ICallData types */
      return [
        {
          operation: LadleActions.Fn.ROUTE,
          args: [receiver] as RoutedActions.Args.UNWRAP,
          fnName: RoutedActions.Fn.UNWRAP,
          targetContract: wraphandlerContract,
          ignoreIf: false,
        },
      ];
    }
    /* else return empty array */
    console.log('No token unwrapping.')
    return [];
  };

  return { wrapAssetToJoin, unwrapAsset };
};
