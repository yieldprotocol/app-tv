import React, { useContext, useEffect, useState } from 'react';
import { Box, ResponsiveContext, Select, Text, ThemeContext } from 'grommet';

import { ChainContext } from '../contexts/ChainContext';
import { IYieldSeries } from '../types';

function SeriesSelector() {
  const mobile:boolean = (useContext<any>(ResponsiveContext) === 'small');
  const { chainState: { seriesMap, activeSeries }, chainActions } = useContext(ChainContext);

  const [options, setOptions] = useState<IYieldSeries[]>([]);
  const optionText = (series: IYieldSeries) => `${mobile ? series?.displayNameMobile : series?.displayName}  ● APR: ${series?.apr}%` || '';

  useEffect(() => {
    const opts = Array.from(seriesMap.values()) as IYieldSeries[];
    setOptions(opts);
  }, [activeSeries, seriesMap]);

  return (
    <Box fill>
      <Select
        id="seriesSelect"
        name="assetSelect"
        placeholder="Select Series"
        options={options}
        // defaultValue={activeSeries}
        value={activeSeries}
        labelKey={(x:any) => optionText(x)}
        valueLabel={<Box pad={mobile ? 'medium' : 'small'}><Text size="small" color="text"> {optionText(activeSeries)} </Text></Box>}
        onChange={({ option }: any) => chainActions.setActiveSeries(option)}
        // eslint-disable-next-line react/no-children-prop
        children={(x:any) => <Box pad={mobile ? 'medium' : 'small'} gap="small" direction="row"> <Text color="text" size="small"> { optionText(x) } </Text> </Box>}
      />
    </Box>
  );
}

export default SeriesSelector;
