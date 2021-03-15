import React, { useContext, useRef, useState } from 'react';
import { Box, Button, Heading, Keyboard, ResponsiveContext, Select, Text, TextInput } from 'grommet';
import { Router, useHistory } from 'react-router-dom';

import { FiArrowLeftCircle } from 'react-icons/fi';
import { cleanValue } from '../utils/displayUtils';

import SeriesSelector from '../components/SeriesSelector';
import MainViewWrap from '../components/wraps/MainViewWrap';
import AssetSelector from '../components/AssetSelector';
import InputWrap from '../components/wraps/InputWrap';
import InfoBite from '../components/InfoBite';
import ActionButtonGroup from '../components/ActionButtonGroup';
import PlaceholderWrap from '../components/wraps/PlaceholderWrap';
import { useDebounce } from '../hooks';
import SectionWrap from '../components/wraps/SectionWrap';

const Borrow = () => {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';
  const routerHistory = useHistory();
  const routerState = routerHistory.location.state as { from: string };

  const [inputValue, setInputValue] = useState<string|undefined>(undefined);
  // const [inputRef, setInputRef] = useState<any>(null);
  const debouncedInput = useDebounce(inputValue, 300);
  const [collInputValue, setCollInputValue] = useState<string>();

  return (

    <Keyboard
      onEsc={() => setInputValue(undefined)}
      onEnter={() => console.log('ENTER smashed')}
      target="document"
    >
      <MainViewWrap>

        <SectionWrap title="1. Asset to Borrow" subtitle="Choose an asset and period to borrow for">

          <Box direction="row" gap="small" fill="horizontal">
            <InputWrap basis="65%" action={() => console.log('maxAction')}>
              <TextInput
                plain
                type="number"
                placeholder={<PlaceholderWrap label="Enter amount" />}
                value={inputValue || ''}
                onChange={(event:any) => setInputValue(event.target.value)}
                autoFocus={!mobile}
              />
            </InputWrap>
            <Box basis="35%" fill>
              <AssetSelector />
            </Box>
          </Box>

          <Box justify="evenly" gap="small" fill="horizontal" direction="row-responsive">
            <InfoBite label="Borrowing Power:" value="100Dai" />
            <InfoBite label="Collateralization:" value="200%" />
          </Box>

        </SectionWrap>

        <SectionWrap title={`2. Select a series ${mobile ? '' : '(maturity date)'} `}>
          <SeriesSelector />
        </SectionWrap>

        <SectionWrap title="3. Add Collateral">
          <Box direction="row" gap="small" fill="horizontal" align="center">
            <InputWrap basis="75%" action={() => console.log('maxAction')}>
              <TextInput
                plain
                type="number"
                placeholder={<PlaceholderWrap label="Enter amount" />}
                // ref={(el:any) => { el && el.focus(); }}
                value={collInputValue || ''}
                onChange={(event:any) => setCollInputValue(cleanValue(event.target.value))}
              />
            </InputWrap>
            <Box round="xsmall" pad="xsmall">
              <Text color="text" size="small"> ETH </Text>
            </Box>
          </Box>
        </SectionWrap>

        <ActionButtonGroup buttonList={[
          <Button
            primary
            label={<Text size={mobile ? 'small' : undefined}> {`Borrow  ${inputValue || ''} Dai`}</Text>}
            key="primary"
          />,

          (!routerState && <Button
            secondary
            label={<Text size={mobile ? 'small' : undefined}> Migrate Maker Vault</Text>}
            key="secondary"
          />),

          (routerState && (
          <Box
            onClick={() => routerHistory.push(`/vault/${routerState.from}`)}
            gap="medium"
            direction="row"
            alignSelf="center"
            key="tertiary"
          >
            <FiArrowLeftCircle />
            <Text size="small"> back to vault: {routerState.from} </Text>
          </Box>)
          ),
        ]}
        />

      </MainViewWrap>

    </Keyboard>

  );
};

export default Borrow;
