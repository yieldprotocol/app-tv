import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import { ActionType, ISeries, IVault } from '../types';
import DashboardPositionListItem from './DashboardPositionListItem';
import DashboardPositionSummary from './DashboardPositionSummary';

const StyledBox = styled(Box)`
  max-height: 1000px;
`;

interface IDashPosition {
  debt?: string | null;
  collateral?: string | null;
  lendBalance?: string | null;
  poolBalance?: string | null;
  actionType: ActionType;
  positions: (ISeries | IVault)[];
}

const DashboardPositionList = ({
  debt,
  collateral,
  lendBalance,
  poolBalance,
  positions,
  actionType,
}: IDashPosition) => (
  <DashboardPositionSummary debt={debt!} collateral={collateral!} lendBalance={lendBalance!} poolBalance={poolBalance!}>
    <StyledBox>
      {positions.length === 0 && (
        <Text weight={450} size="small">
          No suggested positions
        </Text>
      )}
      {positions.map((seriesOrVault: ISeries | IVault, i: number) => (
        <DashboardPositionListItem
          seriesOrVault={seriesOrVault}
          index={i}
          actionType={actionType}
          key={seriesOrVault.id}
        />
      ))}
    </StyledBox>
  </DashboardPositionSummary>
);

DashboardPositionList.defaultProps = { debt: null, collateral: null, lendBalance: null, poolBalance: null };

export default DashboardPositionList;
