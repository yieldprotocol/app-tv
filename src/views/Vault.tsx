import React, { useContext, useState, useRef, useEffect } from 'react';
import { Box, Button, Collapsible, Menu, ResponsiveContext, Text, TextInput } from 'grommet';

import { useHistory } from 'react-router-dom';
import { cleanValue } from '../utils/displayUtils';

import { VaultContext } from '../contexts/VaultContext';

import AssetSelector from '../components/AssetSelector';
import MainViewWrap from '../components/wraps/MainViewWrap';
import SeriesSelector from '../components/SeriesSelector';
import InputWrap from '../components/wraps/InputWrap';
import InfoBite from '../components/InfoBite';
import { IYieldSeries } from '../types';
import { borrowingPower } from '../utils/yieldMath';
import Borrow from './Borrow';
import ActionButtonGroup from '../components/ActionButtonGroup';
import PlaceholderWrap from '../components/wraps/PlaceholderWrap';
import SectionWrap from '../components/wraps/SectionWrap';

const Vault = () => {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';
  const routerHistory = useHistory();

  /* state from context */
  const { vaultState } = useContext(VaultContext);
  const { seriesMap } = vaultState;

  /* local state */
  const [inputValue, setInputValue] = useState<any>(undefined);
  const [expanded, setExpanded] = useState<any>(undefined);

  const [availableSeries, setAvailableSeries] = useState<IYieldSeries[]>([]);

  /* init effects */
  useEffect(() => {
    setAvailableSeries(Array.from(seriesMap.values())); // add some filtering here
  }, [seriesMap]);

  return (
    <MainViewWrap fullWidth>

      <Box gap="medium">

        <Box direction="row-responsive" gap="medium" justify="between" fill="horizontal">

          <Box direction="row" align="center" justify="between">
            <Text size={mobile ? 'small' : 'medium'}> Vault 0x14...9b7  </Text>
            <Menu
              label={<Box pad="xsmall" alignSelf="end" fill><Text size="xsmall" color="brand"> Change Vault </Text></Box>}
              dropProps={{
                align: { top: 'bottom', left: 'left' },
                elevation: 'xlarge',
              }}
              icon={false}
              items={
                availableSeries.map((x:any) => ({ label: <Text size="small"> - {x.displayName} • APR: {x.apr}% </Text> }))
            }
            />
          </Box>

          <Box direction="row" justify="between" gap="small">
            <Text size="small"> Maturity date: </Text>
            <Text size="small"> April 2021 </Text>
          </Box>
        </Box>

        <InfoBite label="Total value in $DOGE" value="2345.23" />
        <InfoBite label="Total value in USD" value="293.23" />

      </Box>

      <MainViewWrap>
        <SectionWrap>
          <Box direction="row" justify="between" fill="horizontal">
            <Text size={mobile ? 'small' : 'medium'}> Debt: 332 $DOGE </Text> <Text size={mobile ? 'small' : 'medium'}> ($2343,00 USD) </Text>
          </Box>

          <Box gap="small" fill="horizontal">
            <InputWrap basis="65%" action={() => console.log('maxAction')}>
              <TextInput
                plain
                type="number"
                placeholder={<PlaceholderWrap label="Enter amount" />}
              // ref={(el:any) => { el && !repayOpen && !rateLockOpen && !mobile && el.focus(); setInputRef(el); }}
                value={inputValue || ''}
                onChange={(event:any) => setInputValue(cleanValue(event.target.value))}
              />
              <Box onClick={() => console.log('max clicked ')} pad="xsmall">
                <Text size="xsmall" color="text">MAX</Text>
              </Box>
            </InputWrap>
          </Box>
        </SectionWrap>

        <ActionButtonGroup buttonList={[
          <Button
            primary
            label={<Text size={mobile ? 'small' : undefined}> {`Repay ${inputValue || ''} Dai`} </Text>}
            key="primary"
          />,

          <Button
            secondary
            label={<Text size={mobile ? 'small' : undefined}> Roll Debt </Text>}
            key="secondary"
          />,

          <Button
            label={mobile ? <Text size="xsmall"> Borrow more </Text> : <Text>Borrow more & add additional collateral</Text>}
            style={{ border: 0 }}
            onClick={() => routerHistory.push('/borrow/', { from: 'vault' })}
            key="tertiary"
          />,
        ]}
        />

      </MainViewWrap>

    </MainViewWrap>
  );
};

export default Vault;