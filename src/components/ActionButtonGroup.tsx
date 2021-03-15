import React, { useContext } from 'react';
import { Box, Layer, ResponsiveContext } from 'grommet';

function ActionButtonGroup({ ...props }:any) {
  const mobile:boolean = (useContext<any>(ResponsiveContext) === 'small');

  return (
    mobile ? (
      <Layer
        position="bottom"
        modal={false}
        responsive={false}
        full="horizontal"
        animate={false}
      >
        <Box gap="small" fill="horizontal" pad="small">
          { props.buttonList.map((x:any) => x) }
        </Box>
      </Layer>)
      :
      <Box gap="small" fill="horizontal">
        { props.buttonList.map((x:any) => x)}
      </Box>
  );
}

export default ActionButtonGroup;