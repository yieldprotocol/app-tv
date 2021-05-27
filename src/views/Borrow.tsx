import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, CheckBox, Keyboard, ResponsiveContext, Text, TextInput } from 'grommet';
import { useHistory, useParams } from 'react-router-dom';
import { ethers } from 'ethers';

import SeriesSelector from '../components/selectors/SeriesSelector';
import MainViewWrap from '../components/wraps/MainViewWrap';
import AssetSelector from '../components/selectors/AssetSelector';
import InputWrap from '../components/wraps/InputWrap';
import ActionButtonGroup from '../components/ActionButtonGroup';
import SectionWrap from '../components/wraps/SectionWrap';

import MaxButton from '../components/MaxButton';

import { useBorrowActions } from '../hooks/borrowActions';
import { UserContext } from '../contexts/UserContext';
import { IUserContext, IVault } from '../types';
import { collateralizationRatio } from '../utils/yieldMath';
import PanelWrap from '../components/wraps/PanelWrap';
import SeriesPanel from '../components/SeriesPanel';
import CenterPanelWrap from '../components/wraps/CenterPanelWrap';
import StepSelector from '../components/selectors/StepSelector';

const Borrow = () => {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';
  const routerHistory = useHistory();

  /* STATE FROM CONTEXT */

  const { userState } = useContext(UserContext) as IUserContext;
  const { activeAccount, assetMap, vaultMap, seriesMap, selectedSeriesId, selectedIlkId, selectedBaseId } = userState;

  const selectedBase = assetMap.get(selectedBaseId!);
  const selectedIlk = assetMap.get(selectedIlkId!);
  const selectedSeries = seriesMap.get(selectedSeriesId!);

  /* LOCAL STATE */
  const [stepPosition, setStepPosition] = useState<number>(0);

  const [borrowInput, setBorrowInput] = useState<string>('');
  const [collatInput, setCollatInput] = useState<string>('');
  const [maxCollat, setMaxCollat] = useState<string|undefined>();

  const [borrowDisabled, setBorrowDisabled] = useState<boolean>(true);
  const [collatDisabled, setCollatDisabled] = useState<boolean>(true);

  const [borrowError, setBorrowError] = useState<string|null>(null);
  const [collatError, setCollatError] = useState<string|null>(null);

  const [vaultIdToUse, setVaultIdToUse] = useState<string|undefined>(undefined);
  const [matchingVaults, setMatchingVaults] = useState<IVault[]>([]);

  const { borrow } = useBorrowActions();

  /** LOCAL ACTION FNS */

  const handleBorrow = () => {
    !borrowDisabled &&
    borrow(
      vaultIdToUse ? vaultMap.get(vaultIdToUse) : undefined,
      borrowInput,
      collatInput,
    );
  };

  /* SET MAX VALUES */

  useEffect(() => {
    /* CHECK collateral selection and sets the max available collateral */
    activeAccount &&
    (async () => {
      const _max = await selectedIlk?.getBalance(activeAccount);
      _max && setMaxCollat(ethers.utils.formatEther(_max)?.toString());
    })();
  }, [activeAccount, selectedIlk, setMaxCollat]);

  /* WATCH FOR WARNINGS AND ERRORS */

  /* CHECK for any borrow input errors/warnings */
  useEffect(() => {
    if (activeAccount && (borrowInput || borrowInput === '')) {
      /* 1. Check if input exceeds amount available in pools */
      if (false) setCollatError('Amount exceeds amount available in pool');
      /* 2. Check if input is above zero */
      else if (parseFloat(borrowInput) < 0) setBorrowError('Amount should be expressed as a positive value');
      /* if all checks pass, set null error message */
      else {
        setBorrowError(null);
      }
    }
  }, [activeAccount, borrowInput, setBorrowError]);

  /* CHECK for any collateral input errors/warnings */
  useEffect(() => {
    if (activeAccount && (collatInput || collatInput === '')) {
      /* 1. Check if input exceeds balance */
      if (maxCollat && parseFloat(collatInput) > parseFloat(maxCollat)) setCollatError('Amount exceeds balance');
      /* 2. Check if input is above zero */
      else if (parseFloat(collatInput) < 0) setCollatError('Amount should be expressed as a positive value');
      /* 3. next check */
      else if (false) setCollatError('Undercollateralised');
      /* if all checks pass, set null error message */
      else {
        setCollatError(null);
      }
    }
  }, [activeAccount, collatInput, maxCollat, setCollatError]);

  /* ACTION DISABLING LOGIC */

  useEffect(() => {
    /* if ANY of the following conditions are met: block action */
    (
      !activeAccount ||
      !borrowInput ||
      !collatInput ||
      !selectedSeries ||
      !selectedIlk ||
      selectedSeries?.seriesIsMature
    )
      ? setBorrowDisabled(true)
    /* else if all pass, then unlock borrowing */
      : setBorrowDisabled(false);
  },
  [borrowInput, collatInput, selectedSeries, selectedIlk, activeAccount]);

  useEffect(() => {
    (!activeAccount || !collatInput || collatError) ? setCollatDisabled(true) : setCollatDisabled(false);
  }, [collatInput, activeAccount, collatError]);

  /**
   * EXTRAS
   * */

  /* CHECK the list of current vaults which match the current series/ilk selection */
  useEffect(() => {
    if (selectedBase && selectedSeries && selectedIlk) {
      const arr: IVault[] = Array.from(vaultMap.values()) as IVault[];
      const _matchingVaults = arr.filter((v:IVault) => (
        v.ilkId === selectedIlk.id &&
          v.baseId === selectedBase.id &&
          v.seriesId === selectedSeries.id
      ));
      setMatchingVaults(_matchingVaults);
    }
  }, [vaultMap, selectedBase, selectedIlk, selectedSeries]);

  return (

    <Keyboard
      onEsc={() => setCollatInput('')}
      onEnter={() => console.log('ENTER smashed')}
      target="document"
    >

      <MainViewWrap>

        <PanelWrap basis="30%">
          <Box justify="between" fill pad="xlarge">
            <Box>
              <Text size={stepPosition === 0 ? 'xxlarge' : 'xlarge'} color={stepPosition === 0 ? 'text' : 'text-xweak'}>Choose a asset to borrow</Text>
              <Text size={stepPosition === 1 ? 'xxlarge' : 'xlarge'} color={stepPosition === 1 ? 'text' : 'text-xweak'}>Add collateral</Text>
              <Text size={stepPosition === 2 ? 'xxlarge' : 'xlarge'} color={stepPosition === 2 ? 'text' : 'text-xweak'}>Review and transact</Text>
            </Box>

            <Box gap="small">
              <Text weight="bold">Information</Text>
              <Text size="small"> Some information </Text>
            </Box>
          </Box>
        </PanelWrap>

        <CenterPanelWrap>

          <Box pad="medium" />

          <Box
            gap="small"
            // background="pink"
          >
            {
          stepPosition === 0 &&
          <Box gap="large">
            <SectionWrap title="Select an asset and amount: ">
              <Box>
                <AssetSelector />
              </Box>
              <InputWrap action={() => console.log('maxAction')} isError={borrowError}>
                <TextInput
                  plain
                  type="number"
                  placeholder="Enter amount"
                  value={borrowInput}
                  onChange={(event:any) => setBorrowInput(event.target.value)}
                  autoFocus={!mobile}
                />
              </InputWrap>
            </SectionWrap>

            <SectionWrap title="Choose an series to borrow against">
              <Box>
                <SeriesSelector />
                {selectedSeries?.seriesIsMature && <Text color="pink" size="small">This series has seriesIsMatured.</Text>}
              </Box>
            </SectionWrap>
          </Box>
          }

            {
            stepPosition === 1 &&
            <SectionWrap>

              <Box onClick={() => setStepPosition(0)}> Back </Box>

              <Box direction="row" gap="small" fill="horizontal" align="start">
                <Box basis={mobile ? '50%' : '65%'}>
                  <InputWrap action={() => console.log('maxAction')} disabled={!selectedSeries} isError={collatError}>
                    <TextInput
                      plain
                      type="number"
                      placeholder="Enter amount"
                // ref={(el:any) => { el && el.focus(); }}
                      value={collatInput}
                      onChange={(event:any) => setCollatInput(event.target.value)}
                      disabled={!selectedSeries || selectedSeries.seriesIsMature}
                    />
                    <MaxButton
                      action={() => maxCollat && setCollatInput(maxCollat)}
                      disabled={!selectedSeries || collatInput === maxCollat || selectedSeries.seriesIsMature}
                    />
                  </InputWrap>
                </Box>
                <Box basis={mobile ? '50%' : '35%'}>
                  <AssetSelector selectCollateral />
                </Box>
              </Box>
            </SectionWrap>
        }

            {
            stepPosition === 2 &&
            <SectionWrap>

              <Box onClick={() => setStepPosition(1)}> Back </Box>

              <Box direction="row" gap="small" fill="horizontal" align="start">
                REview transaction

                buy x DAi at rate using x as collateral
              </Box>
            </SectionWrap>
        }

            {/* {
        !selectedSeries?.seriesIsMature &&
        <SectionWrap>
          <Box gap="small" fill="horizontal">
            <Box direction="row" justify="end">
              <CheckBox
                reverse
                disabled={matchingVaults.length < 1}
                checked={!vaultIdToUse || !matchingVaults.find((v:IVault) => v.id === vaultIdToUse)}
                label={<Text size="small">Create new vault</Text>}
                onChange={() => setVaultIdToUse(undefined)}
              />
            </Box>
            {
              matchingVaults.length > 0 &&
              <Box alignSelf="center">
                <Text size="xsmall"> -------- or borrow from an existing vault ----------</Text>
              </Box>
            }

            {
              matchingVaults.map((x:IVault) => (
                <Box direction="row" justify="end" key={x.id}>
                  <CheckBox
                    reverse
                    // disabled={!selectedVaultId}
                    checked={vaultIdToUse === x.id}
                    label={<Text size="small">{x.id}</Text>}
                    onChange={(event:any) => setVaultIdToUse(x.id)}
                  />
                </Box>
              ))
            }
          </Box>
        </SectionWrap>
        } */}

            {/* {
        selectedSeries?.seriesIsMature &&
        matchingVaults.length > 0 &&
        <SectionWrap>
          <Box gap="small" fill="horizontal">
            <Text size="xsmall">Go to exisiting vault:</Text>
            {
              matchingVaults.map((x:IVault) => (
                <Box
                  direction="row"
                  justify="end"
                  key={x.id}
                  onClick={() => routerHistory.push(`/vault/${x.id}`)}
                >
                  <Text size="xsmall"> {x.id} </Text>
                </Box>
              ))
            }
          </Box>
        </SectionWrap>
        } */}

          </Box>

          <Box
            gap="small"
          >
            <ActionButtonGroup>
              {
            stepPosition !== 2 &&
            <Button
              primary
              label={<Text size={mobile ? 'small' : undefined}> {stepPosition === 0 ? 'continue to Add collateral' : 'continue to Review'} </Text>}
              key="ONE"
              onClick={() => setStepPosition(stepPosition + 1)}
            />
            }
              {
            stepPosition === 2 &&
            <Button
              primary
              label={<Text size={mobile ? 'small' : undefined}> {`Borrow  ${borrowInput || ''} ${selectedBase?.symbol || ''}`}</Text>}
              key="FINAL"
              onClick={() => handleBorrow()}
              disabled={borrowDisabled}
            />
            }

            </ActionButtonGroup>

            {/* <StepSelector
              selected={stepPosition}
              options={['1. choose asset', '2. add collateral', '3. review']}
              action={(x:number) => setStepPosition(x)}
            /> */}
          </Box>

        </CenterPanelWrap>

        <PanelWrap basis="30%">
          <SeriesPanel>

            <Box gap="small" fill="horizontal" align="end">
              {
              matchingVaults.map((x:IVault) => (
                <Box
                  direction="row"
                  justify="end"
                  key={x.id}
                  onClick={() => routerHistory.push(`/vault/${x.id}`)}
                >
                  <Text size="xsmall"> {x.id} </Text>
                </Box>
              ))
            }
            </Box>

          </SeriesPanel>
        </PanelWrap>

      </MainViewWrap>

    </Keyboard>

  );
};

export default Borrow;
