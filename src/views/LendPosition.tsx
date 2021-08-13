import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, ResponsiveContext, Select, Tab, Tabs, Text, TextInput } from 'grommet';
import { ethers } from 'ethers';
import { FiArrowRight, FiClock, FiLogOut, FiMinusCircle, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';

import ActionButtonGroup from '../components/wraps/ActionButtonWrap';
import InputWrap from '../components/wraps/InputWrap';
import SeriesSelector from '../components/selectors/SeriesSelector';
import { abbreviateHash, cleanValue, getTxCode, nFormatter } from '../utils/appUtils';
import SectionWrap from '../components/wraps/SectionWrap';

import { useLend, useLendActions } from '../hooks/lendHooks';
import { useTx } from '../hooks/useTx';
import { UserContext } from '../contexts/UserContext';
import { ActionCodes, ActionType, ISeries, IUserContext } from '../types';
import MaxButton from '../components/buttons/MaxButton';
import InfoBite from '../components/InfoBite';
import ActiveTransaction from '../components/ActiveTransaction';
import PositionAvatar from '../components/PositionAvatar';
import CenterPanelWrap from '../components/wraps/CenterPanelWrap';
import NextButton from '../components/buttons/NextButton';
import CancelButton from '../components/buttons/CancelButton';
import TransactButton from '../components/buttons/TransactButton';
import YieldHistory from '../components/YieldHistory';
import ExitButton from '../components/buttons/ExitButton';
import { useInputValidation } from '../hooks/inputValidationHook';
import EtherscanButton from '../components/buttons/EtherscanButton';

const LendPosition = ({ close }: { close: () => void }) => {
  const mobile: boolean = useContext<any>(ResponsiveContext) === 'small';

  /* STATE FROM CONTEXT */

  const { userState } = useContext(UserContext) as IUserContext;
  const { activeAccount, selectedSeriesId, selectedBaseId, seriesMap, assetMap } = userState;

  const selectedSeries = seriesMap.get(selectedSeriesId!);
  const selectedBase = assetMap.get(selectedBaseId!);

  /* LOCAL STATE */

  const [actionActive, setActionActive] = useState<any>({ text: 'Close Position', index: 0 });

  // stepper for stepping within multiple tabs
  const [stepPosition, setStepPosition] = useState<number[]>([0, 0, 0]);

  const [closeInput, setCloseInput] = useState<string>();
  const [rollInput, setRollInput] = useState<string>();
  const [rollToSeries, setRollToSeries] = useState<ISeries | null>(null);

  const [closeDisabled, setCloseDisabled] = useState<boolean>(true);
  const [rollDisabled, setRollDisabled] = useState<boolean>(true);
  // const [redeemDisabled, setRedeemDisabled] = useState<boolean>(true);

  /* HOOK FNS */
  const { currentValue } = useLend(selectedSeries!);
  const { closePosition, rollPosition, redeem } = useLendActions();

  /* TX data */
  const { tx: closeTx, resetTx: resetCloseTx } = useTx(ActionCodes.CLOSE_POSITION, selectedSeries?.id);
  const { tx: rollTx, resetTx: resetRollTx } = useTx(ActionCodes.ROLL_POSITION, selectedSeries?.id);

  /* input validation hoooks */
  const { inputError: closeError } = useInputValidation(closeInput, ActionCodes.CLOSE_POSITION, selectedSeries, [
    0,
    currentValue,
  ]);

  const { inputError: rollError } = useInputValidation(rollInput, ActionCodes.ROLL_POSITION, selectedSeries, [
    0,
    currentValue,
  ]);

  /* LOCAL FNS */
  const handleStepper = (back: boolean = false) => {
    const step = back ? -1 : 1;
    const newStepArray = stepPosition.map((x: any, i: number) => (i === actionActive.index ? x + step : x));
    setStepPosition(newStepArray);
  };

  const handleClosePosition = () => {
    !closeDisabled && closePosition(closeInput, selectedSeries!);
  };

  const handleRollPosition = () => {
    !rollDisabled && rollToSeries && rollPosition(rollInput, selectedSeries!, rollToSeries);
  };

  const handleRedeem = () => {
    redeem(selectedSeries!, undefined);
  };

  /* ACTION DISABLING LOGIC  - if ANY conditions are met: block action */
  useEffect(() => {
    !closeInput || closeError ? setCloseDisabled(true) : setCloseDisabled(false);
    !rollInput || !rollToSeries || rollError ? setRollDisabled(true) : setRollDisabled(false);
  }, [closeInput, closeError, rollInput, rollToSeries, rollError]);

  /* INTERNAL COMPONENTS */
  const CompletedTx = (props: any) =>(
      <>
      <NextButton
        // size="xsmall"
        label={<Text size={mobile ? 'xsmall' : undefined}>Go back</Text>}
        onClick={() => {
          props.resetTx();
          handleStepper(true);
        }}
      />
      {props.tx.failed &&
      <EtherscanButton txHash={props.tx.txHash} />
      }
    </>
  );

  return (
    <CenterPanelWrap>
      <Box fill pad="large" gap="medium">
        <Box height={{ min: '250px' }} gap="medium">
          <Box direction="row-responsive" justify="between" fill="horizontal" align="center">
            <Box direction="row" align="center" gap="medium">
              <PositionAvatar position={selectedSeries!} />
              <Box>
                <Text size={mobile ? 'medium' : 'large'}> {selectedSeries?.displayName} </Text>
                <Text size="small"> {abbreviateHash(selectedSeries?.fyTokenAddress!, 5)}</Text>
              </Box>
            </Box>
            <ExitButton action={() => close()} />
          </Box>

          <SectionWrap>
            <Box gap="small">
              {/* <InfoBite label="Vault debt + interest:" value={`${selectedVault?.art_} ${vaultBase?.symbol}`} icon={<FiTrendingUp />} /> */}
              <InfoBite
                label="Portfolio value at Maturity"
                value={`${cleanValue(
                  selectedSeries?.fyTokenBalance_!,
                  selectedBase?.digitFormat!
                )} ${selectedBase?.symbol!}`}
                icon={<FiTrendingUp />}
              />
              <InfoBite
                label="Current value"
                value={`${cleanValue(currentValue, selectedBase?.digitFormat!)} ${selectedBase?.symbol!}`}
                icon={selectedBase?.image}
              />
              <InfoBite
                label="Maturity date:"
                value={`${selectedSeries?.fullDate}`}
                icon={<FiClock color={selectedSeries?.color} />}
              />
            </Box>
          </SectionWrap>
        </Box>

        <Box height={{ min: '300px' }}>
          <SectionWrap title="Position Actions">
            <Box elevation="xsmall" round="xsmall">
              <Select
                plain
                dropProps={{ round: 'xsmall' }}
                options={[
                  { text: 'Close Position', index: 0 },
                  { text: 'Roll Position', index: 1 },
                  { text: 'View Transaction History', index: 2 },
                  { text: 'Redeem', index: 3 },
                ]}
                labelKey="text"
                valueKey="index"
                value={actionActive}
                onChange={({ option }) => setActionActive(option)}
                disabled={[3]}
              />
            </Box>
          </SectionWrap>

          {actionActive.index === 0 && (
            <>
              {stepPosition[0] === 0 && (
                <Box margin={{ top: 'medium' }} gap="medium">
                  <InputWrap action={() => console.log('maxAction')} isError={closeError} disabled={!selectedSeries}>
                    <TextInput
                      plain
                      type="number"
                      placeholder={`Amount of ${selectedBase?.symbol} to reclaim`}
                      value={closeInput || ''}
                      onChange={(event: any) => setCloseInput(cleanValue(event.target.value))}
                      disabled={!selectedSeries}
                    />
                    <MaxButton
                      action={() => setCloseInput(currentValue)}
                      disabled={currentValue === '0.0' || !selectedSeries}
                      clearAction={() => setCloseInput('')}
                      showingMax={!!closeInput && closeInput === currentValue}
                    />
                  </InputWrap>
                </Box>
              )}

              {stepPosition[0] !== 0 && (
                <ActiveTransaction pad tx={closeTx}>
                  <SectionWrap
                    title="Review your remove transaction"
                    rightAction={<CancelButton action={() => handleStepper(true)} />}
                  >
                    <Box margin={{ top: 'medium' }}>
                      <InfoBite
                        label="Close Position"
                        icon={<FiArrowRight />}
                        value={`${cleanValue(closeInput, selectedBase?.digitFormat!)} ${selectedBase?.symbol}`}
                      />
                    </Box>
                  </SectionWrap>
                </ActiveTransaction>
              )}
            </>
          )}

          {actionActive.index === 1 && (
            <>
              {stepPosition[actionActive.index] === 0 && (
                <Box margin={{ top: 'medium' }} gap="medium">
                  <InputWrap action={() => console.log('maxAction')} isError={closeError} disabled={!selectedSeries}>
                    <TextInput
                      plain
                      type="number"
                      placeholder={`Amount of ${selectedBase?.symbol} to roll`}
                      value={rollInput || ''}
                      onChange={(event: any) => setRollInput(cleanValue(event.target.value))}
                      disabled={!selectedSeries}
                    />
                    <MaxButton
                      action={() => setRollInput(currentValue)}
                      disabled={currentValue === '0.0' || !selectedSeries}
                      clearAction={() => setRollInput('')}
                      showingMax={!!rollInput && rollInput === currentValue}
                    />
                  </InputWrap>

                  <SeriesSelector
                    selectSeriesLocally={(series: ISeries) => setRollToSeries(series)}
                    actionType={ActionType.LEND}
                    cardLayout={false}
                  />
                </Box>
              )}

              {stepPosition[actionActive.index] !== 0 && (
                <ActiveTransaction pad tx={rollTx}>
                  <SectionWrap
                    title="Review your roll transaction"
                    rightAction={<CancelButton action={() => handleStepper(true)} />}
                  >
                    <Box margin={{ top: 'medium' }}>
                      <InfoBite
                        label="Roll To Series"
                        icon={<FiArrowRight />}
                        value={` Roll${rollTx.pending ? 'ing' : ''}  ${cleanValue(
                          rollInput,
                          selectedBase?.digitFormat!
                        )} ${selectedBase?.symbol} to ${rollToSeries?.displayName}`}
                      />
                    </Box>
                  </SectionWrap>
                </ActiveTransaction>
              )}
            </>
          )}

          {actionActive.index === 2 && <YieldHistory seriesOrVault={selectedSeries!} view={['TRADE']} />}
        </Box>
      </Box>

      <ActionButtonGroup pad>
        {stepPosition[actionActive.index] === 0 && actionActive.index !== 2 && (
          <NextButton
            label={<Text size={mobile ? 'small' : undefined}> Next Step</Text>}
            onClick={() => handleStepper()}
            key="next"
            disabled={(actionActive.index === 0 && closeDisabled) || (actionActive.index === 1 && rollDisabled)}
            errorLabel={(actionActive.index === 0 && closeError) || (actionActive.index === 1 && rollError)}
          />
        )}

        {actionActive.index === 0 && 
        stepPosition[actionActive.index] !== 0 &&
        !( closeTx.failed || closeTx.success) &&  
        (
          <TransactButton
            primary
            label={
              <Text size={mobile ? 'small' : undefined}>
                {`Clos${closeTx.processActive ? 'ing' : 'e'} ${
                  nFormatter(Number(closeInput), selectedBase?.digitFormat!) || ''
                } ${selectedBase?.symbol}`}
              </Text>
            }
            onClick={() => handleClosePosition()}
            disabled={closeDisabled || closeTx.processActive}
          />
        )}

        {actionActive.index === 1 && 
        stepPosition[actionActive.index] !== 0 &&
        !( rollTx.failed || rollTx.success) &&     
        (
          <TransactButton
            primary
            label={
              <Text size={mobile ? 'small' : undefined}>
                {`Roll${rollTx.processActive ? 'ing' : ''} ${
                  nFormatter(Number(rollInput), selectedBase?.digitFormat!) || ''
                } ${selectedBase?.symbol}`}
              </Text>
            }
            onClick={() => handleRollPosition()}
            disabled={rollDisabled || rollTx.processActive}
          />
        )}

        {stepPosition[actionActive.index] === 1 &&
          actionActive.index === 0 &&
          !closeTx.processActive &&
          ( closeTx.failed || closeTx.success) &&
          <CompletedTx tx={closeTx} resetTx={resetCloseTx} />}

        {stepPosition[actionActive.index] === 1 &&
          actionActive.index === 1 &&
          !rollTx.processActive &&
          (rollTx.failed || rollTx.success) &&
          <CompletedTx tx={rollTx} resetTx={()=>resetRollTx()} />}

      </ActionButtonGroup>
    </CenterPanelWrap>
  );
};

export default LendPosition;
