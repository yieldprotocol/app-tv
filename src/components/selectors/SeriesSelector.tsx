import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Box, ResponsiveContext, Select, Text, ThemeContext } from 'grommet';

import { ethers } from 'ethers';
import styled from 'styled-components';
import { ActionType, ISeries } from '../../types';
import { UserContext } from '../../contexts/UserContext';
import { calculateAPR } from '../../utils/yieldMath';
import { useApr } from '../../hooks/aprHook';
import YieldMark from '../logos/YieldMark';

const StyledBox = styled(Box)`
-webkit-transition: transform 0.3s ease-in-out;
-moz-transition: transform 0.3s ease-in-out;
transition: transform 0.3s ease-in-out;

:hover {
  transform: scale(1.05);
}
`;

interface ISeriesSelectorProps {
  actionType: ActionType;
  selectSeriesLocally?: (series: ISeries) => void; /* select series locally filters out the global selection from the list and returns the selected ISeries */
  inputValue?: string|undefined; /* accepts an inpout value for dynamic APR calculations */
  cardLayout?: boolean
}

const AprText = (
  { inputValue, series, actionType }:{ inputValue: string|undefined, series:ISeries, actionType:ActionType },
) => {
  const { apr } = useApr(inputValue, actionType, series);
  const [limitHit, setLimitHit] = useState<boolean>(false);

  useEffect(() => {
    if (
      !series?.seriesIsMature &&
      inputValue &&
      ethers.utils.parseEther(inputValue).gt(series.baseReserves)
    ) { setLimitHit(true); } else {
      setLimitHit(false);
    }
  }, [inputValue, series.baseReserves, series?.seriesIsMature, setLimitHit]);

  return (
    <>
      { !series?.seriesIsMature && !inputValue && <Text size="large">{series?.apr}% <Text size="xsmall">APR</Text></Text>}
      { !limitHit && !series?.seriesIsMature && inputValue && <Text> <Text size="large"> </Text>{apr}% <Text size="xsmall">APR</Text></Text>}
      { limitHit && <Text size="xsmall" color="pink"> Not enough liquidity</Text>}
    </>
  );
};

function SeriesSelector({ selectSeriesLocally, inputValue, actionType, cardLayout }: ISeriesSelectorProps) {
  const mobile:boolean = (useContext<any>(ResponsiveContext) === 'small');

  const { userState, userActions } = useContext(UserContext);
  const { selectedSeriesId, selectedBaseId, seriesMap, assetMap } = userState;
  const [localSeries, setLocalSeries] = useState<ISeries|null>();
  const [options, setOptions] = useState<ISeries[]>([]);

  const selectedSeries = selectSeriesLocally ? localSeries : seriesMap.get(selectedSeriesId!);
  const selectedBase = assetMap.get(selectedBaseId!);

  // const { apr } = useApr(inputValue, 'BORROW', selectedSeries);

  const optionText = (_series: ISeries|undefined) => {
    if (_series) {
      return `${mobile ? _series.displayNameMobile : _series.displayName}`;
    }
    return 'Select a series';
  };

  const optionExtended = (_series: ISeries|undefined) => (
    <Box fill="horizontal" direction="row" justify="between" gap="small">
      {_series?.seriesMark}
      {optionText(_series)}
      { _series?.seriesIsMature &&
        <Box round="large" border pad={{ horizontal: 'small' }}>
          <Text size="xsmall"> Mature </Text>
        </Box>}
      {_series && actionType !== 'POOL' && <AprText inputValue={inputValue} series={_series} actionType={actionType} />}
    </Box>
  );

  /* Keeping options/selection fresh and valid: */
  useEffect(() => {
    const opts = Array.from(seriesMap.values()) as ISeries[];

    /* filter out options based on base Id */
    let filteredOpts = opts.filter((_series:ISeries) => (
      _series.baseId === selectedBaseId
      // !ignoredSeries?.includes(_series.baseId)
    ));

    /* if required, filter out the globally selected asset  and */
    if (selectSeriesLocally) filteredOpts = filteredOpts.filter((_series:ISeries) => _series.id !== selectedSeriesId);

    /* if current selected series is NOT in the list of available series (for a particular base), or bases don't match:
    set the selected series to null. */
    if (
      selectedSeries &&
      (filteredOpts.findIndex((_series:ISeries) => _series.id !== selectedSeriesId) < 0 ||
      selectedSeries.baseId !== selectedBaseId)
    ) userActions.setSelectedSeries(null);

    setOptions(filteredOpts);
  }, [seriesMap, selectedBase, selectSeriesLocally, selectedSeries, userActions]);

  const handleSelect = (_series:ISeries) => {
    if (!selectSeriesLocally) {
      console.log('Series selected globally: ', _series.id);
      userActions.setSelectedSeries(_series.id);
    } else {
      /* used for passing a selected series to the parent component */
      console.log('Series set locally: ', _series.id);
      selectSeriesLocally(_series);
      setLocalSeries(_series);
    }
  };

  return (
    <>
      {!cardLayout &&
      <Box fill="horizontal" border round="xsmall">
        <Select
          plain
          id="seriesSelect"
          name="assetSelect"
          placeholder="Select Series"
          options={options}
          value={selectedSeries}
          labelKey={(x:any) => optionText(x)}
          valueLabel={
          options.length ?
            <Box pad={mobile ? 'medium' : '0.55em'}><Text color="text"> {optionExtended(selectedSeries)}</Text></Box>
            : <Box pad={mobile ? 'medium' : '0.55em'}><Text color="text-weak"> No available series yet.</Text></Box>
        }
          disabled={options.length === 0}
          onChange={({ option }: any) => handleSelect(option)}
        // eslint-disable-next-line react/no-children-prop
          children={(x:any) => <Box pad={mobile ? 'medium' : 'small'} gap="small" direction="row"> <Text color="text"> { optionExtended(x) }</Text> </Box>}
        />
      </Box>}

      {cardLayout &&
      <Box direction="row-responsive" gap="small" fill justify="evenly" pad={{ vertical: 'small' }}>
        {options.map((series:ISeries) => (
          <StyledBox
            // border={series.id === selectedSeriesId}
            key={series.id}
            pad="xsmall"
            round="xsmall"
            onClick={() => handleSelect(series)}
            background={series.id === selectedSeriesId ? series?.color : undefined}
            elevation="xsmall"
            align="center"
          >
            <Box pad="small" width="small" direction="row" align="center" gap="small">
              <Avatar background="#FFF"> {series.seriesMark} </Avatar>
              <Box>
                <Text>{series.displayNameMobile}</Text>
                <Text size="large"><AprText inputValue={inputValue} series={series} actionType={actionType} /></Text>
              </Box>
            </Box>

          </StyledBox>
        ))}
      </Box>}
    </>
  );
}

SeriesSelector.defaultProps = { selectSeriesLocally: null, inputValue: undefined, cardLayout: true };

export default SeriesSelector;
