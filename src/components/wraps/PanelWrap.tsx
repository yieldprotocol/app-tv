import React, { useContext } from 'react';
import { Box, Heading, ResponsiveContext, Text } from 'grommet';
import { BorderType } from 'grommet/utils';

interface IPanelWrap {
  basis?: string
  right?: boolean
  children: any;
}
function PanelWrap({ basis, right, children }: IPanelWrap) {
  const mobile:boolean = useContext<any>(ResponsiveContext) === 'small';
  return (
    <Box
      basis={basis || '33%'}
      fill
      align={right ? 'end' : 'start'}
      pad="large"
      justify="between"
    >
      {children}
    </Box>
  );
}

PanelWrap.defaultProps = { basis: undefined, right: false };
export default PanelWrap;
