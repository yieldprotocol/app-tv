import React, { useContext } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ThemeContext } from 'styled-components';

const SkeletonWrap = ({ props }) => {
  const theme = useContext(ThemeContext);
  return (
    <SkeletonTheme width={50} baseColor={theme.dark ? '#202A30' : undefined} highlightColor={theme.dark ? '#313c42' : undefined}>
      <Skeleton  {...props} />
    </SkeletonTheme>
  );
};

export default SkeletonWrap;
