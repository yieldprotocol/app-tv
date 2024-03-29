import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Box, Text } from 'grommet';
import { ActionType, IAsset, ISeries, IUserContext, IUserContextActions, IUserContextState } from '../../types';
import { UserContext } from '../../contexts/UserContext';
import { cleanValue } from '../../utils/appUtils';
import PositionAvatar from '../PositionAvatar';
import ItemWrap from '../wraps/ItemWrap';
import { useLendHelpers } from '../../hooks/viewHelperHooks/useLendHelpers';
import SkeletonWrap from '../wraps/SkeletonWrap';

function LendItem({
  series,
  index,
  actionType,
  condensed,
}: {
  series: ISeries;
  index: number;
  actionType: ActionType;
  condensed?: boolean;
}) {
  const router = useRouter();

  const {
    userState: { assetMap, seriesLoading, selectedSeries, selectedBase },
    userActions,
  }: { userState: IUserContextState; userActions: IUserContextActions } = useContext(UserContext) as IUserContext;
  const { fyTokenMarketValue } = useLendHelpers(series!, '0');
  const seriesBase: IAsset = assetMap.get(series.baseId)!;
  const isSelectedBaseAndSeries = series.baseId === seriesBase.proxyId && series.id === selectedSeries?.id;

  const handleSelect = (_series: ISeries) => {
    userActions.setSelectedBase(selectedBase);
    userActions.setSelectedSeries(_series);
    router.push(`/${actionType.toLowerCase()}position/${_series.id}`);
  };

  return (
    <ItemWrap action={() => handleSelect(series)} index={index}>
      <Box direction="row" gap="small" align="center" pad="small" height={condensed ? '3rem' : undefined}>
        <PositionAvatar position={series} condensed={condensed} actionType={ActionType.LEND} />
        <Box
          fill={condensed ? 'horizontal' : undefined}
          justify={condensed ? 'between' : undefined}
          direction={condensed ? 'row' : undefined}
        >
          <Text weight={900} size="small">
            {series.displayName}
          </Text>
          <Box direction="row" gap="xsmall">
            {fyTokenMarketValue !== 'Low liquidity' && (
              <Box direction="row" gap="xsmall">
                <Text weight={450} size="xsmall">
                  Balance:
                </Text>
                <Text weight={450} size="xsmall">
                  {seriesLoading && isSelectedBaseAndSeries ? (
                    <SkeletonWrap props={{ width:30}} />
                  ) : (
                    cleanValue(fyTokenMarketValue, seriesBase?.digitFormat!)
                  )}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ItemWrap>
  );
}

LendItem.defaultProps = { condensed: false };

export default LendItem;
