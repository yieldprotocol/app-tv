import React, { useContext } from 'react';
import { Box, Header, Layer, ResponsiveContext } from 'grommet';
import { CSSProperties, ThemeContext } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { UserContext } from '../contexts/UserContext';

import YieldMark from './logos/YieldMark';
import YieldNavigation from './YieldNavigation';

interface ILayerProps {
  toggleMenu: () => void;
  callback?: () => void;
}

const YieldMobileMenu = ({ toggleMenu, callback }: ILayerProps) => {
  const mobile: boolean = useContext<any>(ResponsiveContext) === 'small';

  return mobile ? (
    <Layer position="right" full="vertical" responsive modal animation="none">
      <Box
        flex
        fill
        style={mobile ? { minWidth: undefined, maxWidth: undefined } : { minWidth: '400px', maxWidth: '400px' }}
        background="background"
      >
        <Box justify="between" fill>
          <Header pad="medium" justify="between">
            <YieldMark
              height="1.5rem"
              colors={['#f79533', '#f37055', '#ef4e7b', '#a166ab', '#5073b8', '#1098ad', '#07b39b', '#6fba82']}
            />
            <Box onClick={() => toggleMenu()} pad="small">
              <Box>
                <FiX size="1.5rem" />
              </Box>
            </Box>
          </Header>
          <YieldNavigation callbackFn={() => toggleMenu()} />
        </Box>
      </Box>
    </Layer>
  ) : null;
};

YieldMobileMenu.defaultProps = { callback: () => null };

export default YieldMobileMenu;
