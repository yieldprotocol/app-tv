import { BigNumber, ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { IVault, ISeries, IAsset } from '../../types';

import { maxBaseToSpend } from '../../utils/yieldMath';

/* Collateralization hook calculates collateralization metrics */
export const useBorrowHelpers = (
  input: string | undefined,
  collateralInput: string | undefined,
  vault: IVault | undefined,
  rollToSeries: ISeries | undefined = undefined
) => {
  /* STATE FROM CONTEXT */
  const {
    userState: { activeAccount, selectedBaseId, selectedIlkId, assetMap, seriesMap, limitMap },
    userActions: { updateLimit },
  } = useContext(UserContext);

  const vaultBase: IAsset | undefined = assetMap.get(vault?.baseId!);

  /* LOCAL STATE */
  const [minAllowedBorrow, setMinAllowedBorrow] = useState<string | undefined>();
  const [maxAllowedBorrow, setMaxAllowedBorrow] = useState<string | undefined>();

  const [maxRepay, setMaxRepay] = useState<BigNumber>(ethers.constants.Zero);
  const [maxRepay_, setMaxRepay_] = useState<string | undefined>();
  const [maxRepayDustLimit, setMaxRepayDustLimit] = useState<string | undefined>();

  const [maxRoll, setMaxRoll] = useState<BigNumber>(ethers.constants.Zero);
  const [maxRoll_, setMaxRoll_] = useState<string | undefined>();
  const [rollPossible, setRollPossible] = useState<boolean>(false);

  const [userBaseAvailable, setUserBaseAvailable] = useState<BigNumber>(ethers.constants.Zero);
  const [userBaseAvailable_, setUserBaseAvailable_] = useState<string | undefined>();
  const [protocolBaseAvailable, setProtocolBaseAvailable] = useState<BigNumber>(ethers.constants.Zero);

  const [maxDebt_, setMaxDebt_] = useState<string | undefined>();

  /* Update the borrow limits if ilk or base changes */
  useEffect(() => {
    if (limitMap.get(selectedBaseId)?.has(selectedIlkId)) {
      const _limit = limitMap.get(selectedBaseId).get(selectedIlkId); // get the limit from the map
      setMinAllowedBorrow(_limit[1].toString());
      setMaxAllowedBorrow(_limit[0].toString());
      console.log('Cached:', 'MIN LIMIT:', _limit[1].toString(), 'MAX LIMIT:', _limit[0].toString());
    } else {
      (async () => {
        if (selectedIlkId && selectedBaseId) {
          /* Update Price before setting */
          const _limit = await updateLimit(selectedBaseId, selectedIlkId);
          setMinAllowedBorrow(_limit[1].toString());
          setMaxAllowedBorrow(_limit[0].toString());
          console.log('External call:', 'MIN LIMIT:', _limit[1].toString(), 'MAX LIMIT:', _limit[0].toString());
        }
      })();
    }
  }, [limitMap, selectedBaseId, selectedIlkId, updateLimit]);

  /* Check if the rollToSeries have sufficient base value */
  useEffect(() => {
    if (rollToSeries && vault) {
      setMaxRoll(rollToSeries.baseReserves);
      setMaxRoll_(ethers.utils.formatUnits(rollToSeries.baseReserves, rollToSeries.decimals).toString());
      setRollPossible(vault.art.lt(rollToSeries.baseReserves));
    }
  }, [rollToSeries, vault]);

  /* Update the min max repayable amounts */
  useEffect(() => {
    if (activeAccount && vault && vaultBase) {
      const vaultSeries: ISeries = seriesMap.get(vault?.seriesId!);
      const minDebt = ethers.utils.parseUnits('0.5', vaultBase?.decimals);

      (async () => {
        const _maxToken = await vaultBase?.getBalance(activeAccount);
        const _maxDebt = vault.art;
        setMaxDebt_(ethers.utils.formatUnits(vault.art, vaultBase.decimals));

        /* max user is either the max tokens they have or max debt */
        const _maxUser = _maxToken && _maxDebt?.gt(_maxToken) ? _maxToken : _maxDebt;
        const _maxDust = _maxUser.sub(minDebt);
        const _maxProtocol = maxBaseToSpend(
          vaultSeries.baseReserves,
          vaultSeries.fyTokenReserves,
          vaultSeries.getTimeTillMaturity(),
          vaultSeries.decimals
        );

        /* set the dust limit */
        _maxDust && setMaxRepayDustLimit(ethers.utils.formatUnits(_maxDust, vaultBase?.decimals)?.toString());
        _maxProtocol && setProtocolBaseAvailable(_maxProtocol);

        /* set the maxBase available for both user and protocol */
        if (_maxUser) {
          setUserBaseAvailable(_maxUser);
          setUserBaseAvailable_(ethers.utils.formatUnits(_maxUser, vaultBase.decimals!).toString());
        }

        /* set the maxRepay as the biggest of the two, human readbale and BN */
        if (_maxUser && _maxProtocol && _maxUser.gt(_maxProtocol)) {
          setMaxRepay_(ethers.utils.formatUnits(_maxProtocol, vaultBase?.decimals)?.toString());
          setMaxRepay(_maxProtocol);
        } else {
          setMaxRepay_(ethers.utils.formatUnits(_maxUser, vaultBase?.decimals)?.toString());
          setMaxRepay(_maxUser);
        }
      })();
    }
  }, [activeAccount, seriesMap, vault, vaultBase]);

  return {
    minAllowedBorrow,
    maxAllowedBorrow,

    maxRepay_,
    maxRepay,

    maxRoll,
    maxRoll_,
    rollPossible,

    maxRepayDustLimit,

    userBaseAvailable,
    protocolBaseAvailable,
    userBaseAvailable_,
    maxDebt_,
  };
};
