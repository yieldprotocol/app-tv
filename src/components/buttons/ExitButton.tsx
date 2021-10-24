import { Box } from 'grommet';
import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  -webkit-transition: transform 0.3s ease-in-out;
  -moz-transition: transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out;
  :hover {
    transform: scale(1.5);
  }
  :active {
    transform: scale(1.0);
  }
`;

function ExitButton({ action }: { action: () => void }) {
  const [hover, setHover] = useState<boolean>();
  return (
    <StyledBox
      direction="row"
      onClick={() => action()}
      gap="small"
      align="center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FiLogOut color={hover ? '#333333' : 'grey'} />
    </StyledBox>
  );
}

// BackButton.defaultProps = { color: 'grey' };

export default ExitButton;