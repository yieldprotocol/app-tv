import { useContext, useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import { ThemeContext } from 'styled-components';
import { FiPlus, FiMinus } from 'react-icons/fi';
import Skeleton from './wraps/SkeletonWrap';
import { formatValue } from '../utils/appUtils';
import { UserContext } from '../contexts/UserContext';
import { IUserContext } from '../types';

interface IDashboardBalance {
  debt: string;
  collateral: string;
  lendBalance: string;
  poolBalance: string;
  digits?: number;
  symbol?: string;
}

const DashboardBalanceSummary = ({ debt, collateral, lendBalance, poolBalance, digits, symbol }: IDashboardBalance) => {
  const theme = useContext(ThemeContext);
  const { green, red } = theme.global.colors;
  const {
    userState: { vaultsLoading, seriesLoading, strategiesLoading },
  } = useContext(UserContext) as IUserContext;

  const [totalBalance, setTotalBalance] = useState<number>();

  useEffect(() => {
    setTotalBalance(Number(collateral) - Number(debt) + Number(lendBalance) + Number(poolBalance));
  }, [collateral, debt, lendBalance, poolBalance]);

  return (
    <Box>
      <Box gap="small">
        <Box direction="row-responsive" justify="between">
          <Text size="small">Total Lent:</Text>
          {seriesLoading ? (
            <Skeleton props={{width:50}} />
          ) : (
            <Box direction="row" gap="medium">
              <Text size="small">
                {symbol}
                {formatValue(lendBalance, digits!)}
              </Text>
              <FiPlus color={green} />
            </Box>
          )}
        </Box>

        <Box direction="row-responsive" justify="between">
          <Text size="small">Total Pooled:</Text>
          {strategiesLoading ? (
            <Skeleton props={{width:50}} />
          ) : (
            <Box direction="row" gap="medium">
              <Text size="small">
                {symbol}
                {formatValue(poolBalance, digits!)}
              </Text>
              <FiPlus color={green} />
            </Box>
          )}
        </Box>

        <Box direction="row-responsive" justify="between">
          <Text size="small">Total Collateral:</Text>
          {vaultsLoading ? (
            <Skeleton props={{width:50}} />
          ) : (
            <Box direction="row" gap="medium">
              <Text size="small">
                {symbol}
                {formatValue(collateral, digits!)}
              </Text>
              <FiPlus color={green} />
            </Box>
          )}
        </Box>

        <Box direction="row-responsive" justify="between">
          <Text size="small">Total Debt:</Text>
          {vaultsLoading ? (
            <Skeleton props={{width:50}}/>
          ) : (
            <Box direction="row" gap="medium">
              <Text size="small">
                {symbol}
                {formatValue(debt, digits!)}
              </Text>
              <FiMinus color={red} />
            </Box>
          )}
        </Box>
      </Box>

      <Box direction="row-responsive" justify="between" margin={{ top: 'medium' }} border={{ side: 'top' }}>
        <Text size="medium">Total:</Text>
        {vaultsLoading || seriesLoading || strategiesLoading || !totalBalance ? (
          <Skeleton props={{width:50}} />
        ) : (
          <Box direction="row" gap="medium">
            <Text size="medium">
              {symbol}
              {formatValue(totalBalance!, digits!)}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

DashboardBalanceSummary.defaultProps = { digits: 2, symbol: '$' };

export default DashboardBalanceSummary;
