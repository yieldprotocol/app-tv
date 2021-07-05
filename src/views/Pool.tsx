import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, RadioButtonGroup, ResponsiveContext, Text, TextInput } from 'grommet';

import { ethers } from 'ethers';

import { cleanValue, getTxCode } from '../utils/appUtils';
import AssetSelector from '../components/selectors/AssetSelector';
import MainViewWrap from '../components/wraps/MainViewWrap';
import SeriesSelector from '../components/selectors/SeriesSelector';
import InputWrap from '../components/wraps/InputWrap';
import InfoBite from '../components/InfoBite';
import ActionButtonGroup from '../components/wraps/ActionButtonWrap';
import SectionWrap from '../components/wraps/SectionWrap';
import { UserContext } from '../contexts/UserContext';
import { ActionCodes, ActionType, ISeries, IUserContext } from '../types';
import { usePool, usePoolActions } from '../hooks/poolHooks';
import MaxButton from '../components/buttons/MaxButton';
import PanelWrap from '../components/wraps/PanelWrap';
import CenterPanelWrap from '../components/wraps/CenterPanelWrap';
import StepperText from '../components/StepperText';
import PositionSelector from '../components/selectors/PositionSelector';
import ActiveTransaction from '../components/ActiveTransaction';
import YieldInfo from '../components/YieldInfo';
import YieldLiquidity from '../components/YieldLiquidity';
import BackButton from '../components/buttons/BackButton';
import YieldMark from '../components/logos/YieldMark';

function Pool() {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';

  /* STATE FROM CONTEXT */
  const { userState } = useContext(UserContext) as IUserContext;
  const { activeAccount, assetMap, seriesMap, selectedSeriesId, selectedBaseId } = userState;

  const selectedSeries = seriesMap.get(selectedSeriesId!);
  const selectedBase = assetMap.get(selectedBaseId!);

  /* LOCAL STATE */
  const [poolInput, setPoolInput] = useState<string>();
  const [maxPool, setMaxPool] = useState<string|undefined>();

  const [poolError, setPoolError] = useState<string|null>(null);

  const [poolDisabled, setPoolDisabled] = useState<boolean>(true);

  const [strategy, setStrategy] = useState<'BUY'|'MINT'>('BUY');

  const [stepPosition, setStepPosition] = useState<number>(0);

  /* HOOK FNS */
  const { addLiquidity } = usePoolActions();

  const { poolMax } = usePool(poolInput);

  /* LOCAL ACTION FNS */
  const handleAdd = () => {
    // !poolDisabled &&
    selectedSeries && addLiquidity(poolInput!, selectedSeries, strategy);
  };

  /* SET MAX VALUES */
  useEffect(() => {
    if (activeAccount) {
      /* Checks asset selection and sets the max available value */
      (async () => {
        const max = await selectedBase?.getBalance(activeAccount);
        if (max) setMaxPool(ethers.utils.formatEther(max).toString());
      })();
    }
  }, [activeAccount, poolInput, selectedBase, setMaxPool]);

  /* WATCH FOR WARNINGS AND ERRORS */
  useEffect(() => {
    /* CHECK for any lendInput errors */
    if (activeAccount && (poolInput || poolInput === '')) {
      /* 1. Check if input exceeds balance */
      if (maxPool && parseFloat(poolInput) > parseFloat(maxPool)) setPoolError('Amount exceeds balance');
      /* 2. Check if input is above zero */
      else if (parseFloat(poolInput) < 0) setPoolError('Amount should be expressed as a positive value');
      /* 2. next Check */
      else if (false) setPoolError('Insufficient');
      /* if all checks pass, set null error message */
      else {
        setPoolError(null);
      }
    }
  }, [activeAccount, poolInput, maxPool]);

  /* ACTION DISABLING LOGIC  - if ANY conditions are met: block action */
  useEffect(() => {
    (!activeAccount || !poolInput || !selectedSeries || poolError) ? setPoolDisabled(true) : setPoolDisabled(false);
  }, [poolInput, activeAccount, poolError, selectedSeries]);

  return (

    <MainViewWrap>

      {!mobile &&
      <PanelWrap>
        <StepperText
          position={stepPosition}
          values={[['Choose an asset to', 'pool', ''], ['', 'Review', 'and transact']]}
        />
        <YieldInfo />
      </PanelWrap>}

      <CenterPanelWrap series={selectedSeries}>

        {
          stepPosition === 0 &&
          <Box gap="medium">
            <Box direction="row" gap="small" align="center" margin={{ bottom: 'medium' }}>
              <YieldMark />
              <Text>POOL</Text>
            </Box>

            <SectionWrap title="Select an asset to Pool">
              <Box direction="row" gap="small" fill="horizontal" align="start">
                <Box basis={mobile ? '50%' : '60%'}>
                  <InputWrap action={() => console.log('maxAction')} isError={poolError}>
                    <TextInput
                      plain
                      type="number"
                      placeholder="Enter Amount"
                      value={poolInput || ''}
                      onChange={(event:any) => setPoolInput(cleanValue(event.target.value))}
                    />
                    <MaxButton
                      action={() => setPoolInput(maxPool)}
                      disabled={maxPool === '0'}
                    />
                  </InputWrap>
                </Box>

                <Box basis={mobile ? '50%' : '40%'}>
                  <AssetSelector />
                </Box>

              </Box>
            </SectionWrap>

            <SectionWrap title="Select a series to Pool to">
              <SeriesSelector actionType={ActionType.POOL} />
            </SectionWrap>

            {selectedSeries?.seriesIsMature && <Text color="pink" size="small">This series has matured.</Text>}

          </Box>
          }

        {
          stepPosition === 1 &&
          <Box gap="large">
            <BackButton action={() => setStepPosition(0)} />

            <ActiveTransaction txCode={getTxCode(ActionCodes.ADD_LIQUIDITY, selectedSeriesId)}>
              <Box gap="large">
                {!selectedSeries?.seriesIsMature &&
                <SectionWrap>
                  <Box direction="row" justify="between" fill align="center">
                    {!mobile && <Text size="small"> Pooling strategy: </Text>}
                    <RadioButtonGroup
                      name="strategy"
                      options={[
                        { label: <Text size="small"> Buy & Pool </Text>, value: 'BUY' },
                        { label: <Text size="small"> Mint & Pool </Text>, value: 'MINT', disabled: true },
                      ]}
                      value={strategy}
                      onChange={(event:any) => setStrategy(event.target.value)}
                      direction="row"
                      justify="between"
                    />
                  </Box>
                </SectionWrap>}
                <SectionWrap title="Review your transaction">
                  <Text>Add {poolInput} {selectedBase?.symbol} to the {selectedSeries?.displayName} pool. </Text>
                </SectionWrap>
              </Box>
            </ActiveTransaction>

          </Box>
          }

        <ActionButtonGroup>
          {
            stepPosition !== 1 &&
            !selectedSeries?.seriesIsMature &&
            <Button
              secondary
              label={<Text size={mobile ? 'small' : undefined}> Next step </Text>}
              onClick={() => setStepPosition(stepPosition + 1)}
            />
            }
          {
            stepPosition === 1 &&
            !selectedSeries?.seriesIsMature &&
              <Button
                primary
                label={<Text size={mobile ? 'small' : undefined}> {`Pool ${poolInput || ''} ${selectedBase?.symbol || ''}`} </Text>}
                onClick={() => handleAdd()}
                disabled={poolDisabled}
              />
            }
        </ActionButtonGroup>

      </CenterPanelWrap>

      <PanelWrap right basis="40%">
        <YieldLiquidity input={poolInput} />
        {!mobile && <PositionSelector actionType={ActionType.POOL} />}
      </PanelWrap>

    </MainViewWrap>
  );
}

export default Pool;
