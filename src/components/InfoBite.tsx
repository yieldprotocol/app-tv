import { FC, ReactNode } from 'react';
import { Box, Text } from 'grommet';
import Skeleton from './wraps/SkeletonWrap';

interface IInfoBite {
  label: string;
  value: string;
  icon?: any;
  loading?: boolean;
  children?: ReactNode;
}

const InfoBite: FC<IInfoBite> = (props) => (
  <Box direction="row" align="center" pad={{ left: 'small', vertical: 'none' }} gap="medium">
    {props.icon && <Box>{props.icon}</Box>}
    <Box>
      <Text size="xsmall" color="text" weight='lighter'>
        {props.label}
      </Text>
      <Box direction="row" gap="xsmall">
        <Text size="small"> {props.loading ? <Skeleton props={{ width:80, height:20}} /> : props.value} </Text>
        {props.children}
      </Box>
    </Box>
  </Box>
);

InfoBite.defaultProps = { icon: undefined, loading: false };

export default InfoBite;
