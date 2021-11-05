import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Grid, Text, TextInput } from 'grommet';
import { FiPercent } from 'react-icons/fi';
import { cleanValue } from '../../utils/appUtils';
import { SettingsContext } from '../../contexts/SettingsContext';
import BoxWrap from '../wraps/BoxWrap';

const SlippageSetting = () => {
  const {
    settingsState: { slippageTolerance },
    settingsActions: { updateSetting },
  } = useContext(SettingsContext);

  const tolerances: number[] = [0.001, 0.005, 0.01];
  const customTolerance = !tolerances.includes(slippageTolerance);

  const [input, setInput] = useState(
    !tolerances.includes(slippageTolerance) ? (slippageTolerance * 100).toString() : ''
  );

  const validateInput = useCallback(
    (tolerance: number): number => (tolerance > 0 && tolerance < 1 ? tolerance : slippageTolerance),
    [slippageTolerance]
  );

  /* Sets the slippage tolerance on input */
  useEffect(() => {
    const _slippageTolerance = validateInput(Number(cleanValue(input, 4)) / 100);
    updateSetting('slippageTolerance', _slippageTolerance);
  }, [input]); // purppose ignore updateSetting

  /* handle slection - clear input on slection of preset */
  const handlePresetChange = (slippage: number) => {
    setInput('');
    updateSetting('slippageTolerance', slippage);
  };

  return (
    // <Box gap="small" pad={{ vertical: 'small' }} border={{ side: 'bottom', color: 'text-xweak' }}>
    <Box gap="small" pad={{ vertical: 'small' }}>
      <Text size="small">Slippage Tolerance</Text>
      <Box direction="row" justify="between">
        <Grid
          gap="xsmall"
          align="center"
          columns={{
            count: tolerances.length + 1,
            size: 'auto',
          }}
        >
          {tolerances.map((tolerance) => (
            <BoxWrap
              background={tolerance === slippageTolerance ? 'gradient-transparent' : 'lightBackground'}
              elevation={tolerance === slippageTolerance ? 'small' : undefined}
              round="xsmall"
              key={tolerance}
              onClick={() => handlePresetChange(tolerance)}
              align="center"
              justify="center"
              pad="xsmall"
            >
              <Text size="small">{`${tolerance * 100} %`}</Text>
            </BoxWrap>
          ))}
          <Box>
            <Box
              direction="row"
              round="xsmall"
              border={{ color: 'lightgrey' }}
              background={customTolerance ? 'gradient-transparent' : 'lightBackground'}
              pad="0.25em"
            >
              <TextInput
                textAlign="center"
                style={{ fontSize: '0.75em', padding: '0px' }}
                reverse
                plain
                type="number"
                value={input || ''}
                onChange={(event: any) => setInput(event.target.value)}
              />
              <Box align="center" justify="center" pad={{ horizontal: 'xsmall' }}>
                <FiPercent size="0.75em" />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default SlippageSetting;
