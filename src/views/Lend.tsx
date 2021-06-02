import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, ResponsiveContext, Text, TextInput } from 'grommet';
import { ethers } from 'ethers';

import ActionButtonGroup from '../components/ActionButtonGroup';
import AssetSelector from '../components/selectors/AssetSelector';
import InputWrap from '../components/wraps/InputWrap';
import MainViewWrap from '../components/wraps/MainViewWrap';
import SeriesSelector from '../components/selectors/SeriesSelector';
import { cleanValue } from '../utils/displayUtils';
import SectionWrap from '../components/wraps/SectionWrap';

import { useLendActions } from '../hooks/lendActions';
import { UserContext } from '../contexts/UserContext';
import { IUserContext } from '../types';
import MaxButton from '../components/MaxButton';
import PanelWrap from '../components/wraps/PanelWrap';
import CenterPanelWrap from '../components/wraps/CenterPanelWrap';
import YieldApr from '../components/YieldApr';
import StepperText from '../components/StepperText';
import PositionSelector from '../components/selectors/PositionSelector';

const Lend = () => {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';

  /* STATE FROM CONTEXT */
  const { userState } = useContext(UserContext) as IUserContext;
  const { activeAccount, selectedSeriesId, selectedBaseId, seriesMap, assetMap } = userState;
  const selectedSeries = seriesMap.get(selectedSeriesId!);
  const selectedBase = assetMap.get(selectedBaseId!);

  /* LOCAL STATE */
  const [lendInput, setLendInput] = useState<string>();
  const [maxLend, setMaxLend] = useState<string|undefined>();
  const [lendError, setLendError] = useState<string|null>(null);
  const [lendDisabled, setLendDisabled] = useState<boolean>(true);
  const [stepPosition, setStepPosition] = useState<number>(0);

  /* HOOK FNS */
  const { lend, redeem } = useLendActions();

  /* LOCAL FNS */
  const handleLend = () => {
    !lendDisabled &&
    lend(lendInput, selectedSeries!);
    setLendInput('');
  };
  const handleRedeem = () => {
    redeem(selectedSeries!, undefined);
  };

  /* SET MAX VALUES */
  useEffect(() => {
    /* Check max available lend (only if activeAccount to save call) */
    if (activeAccount) {
      (async () => {
        const max = await selectedBase?.getBalance(activeAccount);
        if (max) setMaxLend(ethers.utils.formatEther(max).toString());
      })();
    }
  }, [activeAccount, lendInput, selectedBase, setMaxLend]);

  /* WATCH FOR WARNINGS AND ERRORS */
  useEffect(() => {
    /* lendInput errors */
    if (activeAccount && (lendInput || lendInput === '')) {
      /* 1. Check if input exceeds balance */
      if (maxLend && parseFloat(lendInput) > parseFloat(maxLend)) setLendError('Amount exceeds balance');
      /* 2. Check if input is above zero */
      else if (parseFloat(lendInput) < 0) setLendError('Amount should be expressed as a positive value');
      /* 2. next Check */
      else if (false) setLendError('Insufficient');
      /* if all checks pass, set null error message */
      else {
        setLendError(null);
      }
    }
  }, [activeAccount, lendInput, maxLend, setLendError]);

  /* ACTION DISABLING LOGIC  - if conditions are met: allow action */
  useEffect(() => {
    (
      activeAccount &&
      lendInput &&
      selectedSeries &&
      !lendError
    ) ? setLendDisabled(false) : setLendDisabled(true);
  }, [lendInput, activeAccount, lendError, selectedSeries]);

  return (
    <MainViewWrap>

      <PanelWrap>

        <StepperText
          position={stepPosition}
          values={[['Choose an asset to', 'lend', ''], ['', 'Review', 'and transact']]}
        />

        <Box gap="small">
          <Text weight="bold">Information</Text>
          <Text size="small"> Some information </Text>
        </Box>

      </PanelWrap>

      <CenterPanelWrap>
        {
          stepPosition === 0 &&
          <Box gap="large">
            <SectionWrap title="Select an asset and amount to lend">
              <Box direction="row" gap="small" fill="horizontal" align="start">
                <Box basis={mobile ? '50%' : '65%'}>
                  <InputWrap action={() => console.log('maxAction')} isError={lendError} disabled={selectedSeries?.seriesIsMature}>
                    <TextInput
                      plain
                      type="number"
                      placeholder="Enter amount"
                      value={lendInput || ''}
                      onChange={(event:any) => setLendInput(cleanValue(event.target.value))}
                      disabled={selectedSeries?.seriesIsMature}
                    />
                    <MaxButton
                      action={() => setLendInput(maxLend)}
                      disabled={maxLend === '0' || selectedSeries?.seriesIsMature}
                    />
                  </InputWrap>
                </Box>
                <Box basis={mobile ? '50%' : '35%'}>
                  <AssetSelector />
                </Box>
              </Box>
            </SectionWrap>

            <SectionWrap title="Choose a series to lend to">
              <SeriesSelector />
            </SectionWrap>

            {selectedSeries?.seriesIsMature && <Text color="pink" size="small">This series has matured.</Text>}

          </Box>
          }

        {
          stepPosition === 1 &&
          <Box gap="large">
            <Box onClick={() => setStepPosition(0)}>
              <Text>Back</Text>
            </Box>
            <SectionWrap title="Review your transaction">
              some transaction info
            </SectionWrap>
          </Box>
          }

        <ActionButtonGroup>
          {
            stepPosition !== 1 &&
            !selectedSeries?.seriesIsMature &&
            <Button
              primary
              label={<Text size={mobile ? 'small' : undefined}> continue to Review </Text>}
              key="ONE"
              onClick={() => setStepPosition(stepPosition + 1)}
            />
            }
          {
            stepPosition === 1 &&
            !selectedSeries?.seriesIsMature &&
              <Button
                primary
                label={<Text size={mobile ? 'small' : undefined}> {`Supply ${lendInput || ''} ${selectedBase?.symbol || ''}`} </Text>}
                key="primary"
                onClick={() => handleLend()}
                disabled={lendDisabled}
              />
            }
          {selectedSeries?.seriesIsMature &&
            <Button
              primary
              label={<Text size={mobile ? 'small' : undefined}> Redeem </Text>}
              key="primary"
              onClick={() => handleRedeem()}
            />}
        </ActionButtonGroup>

      </CenterPanelWrap>

      <PanelWrap right>
        <YieldApr input={lendInput} type="LEND" />
        <PositionSelector type="LEND" />
      </PanelWrap>

    </MainViewWrap>
  );
};

export default Lend;
