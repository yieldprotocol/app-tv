import { Anchor, Box, Text } from 'grommet';

import React, { useContext, } from 'react';
import { FiGithub as Github, FiBookOpen as Docs, FiFileText as Terms, FiKey as Privacy } from 'react-icons/fi';
import { FaDiscord as Discord } from 'react-icons/fa';

import { ChainContext } from '../contexts/ChainContext';
import BoxWrap from './wraps/BoxWrap';

const IconSize = '1.15rem';
const IconGap = 'small';

const YieldInfo = () => {

  const {
    chainState: {
      connection: { CHAIN_INFO, fallbackChainId },
      appVersion,
    },
  } = useContext(ChainContext);

  const connectedChain = CHAIN_INFO?.get(fallbackChainId!);

  const handleExternal = (destination: string) => {
    // analyticsLogEvent('external_link', {
    //   action: destination
    // });
  };

  return (
    <Box gap="small">
      <Box>
        <Text size="xsmall" color="grey">
          App version: v{appVersion}
        </Text>
      </Box>

      <Box direction="row" gap={IconGap}>
        <BoxWrap>
          <Anchor
            color="grey"
            href="https://github.com/yieldprotocol"
            target="_blank"
            onClick={() => handleExternal('Github')}
          >
            <Github size={IconSize} />
          </Anchor>
        </BoxWrap>

        <BoxWrap>
          <Anchor color="grey" href="http://docs.yieldprotocol.com" target="_blank" onClick={() => handleExternal('Docs')}>
            <Docs size={IconSize} />
          </Anchor>
        </BoxWrap>

        <BoxWrap>
          <Anchor
            color="grey"
            href="https://discord.gg/JAFfDj5"
            target="_blank"
            onClick={() => handleExternal('Discord')}
          >
            <Discord size={IconSize} />
          </Anchor>
        </BoxWrap>

        <BoxWrap>
          <Anchor
            color="grey"
            href="https://yieldprotocol.com/terms/"
            target="_blank"
            onClick={() => handleExternal('Terms')}
          >
            <Terms size={IconSize} />
          </Anchor>
        </BoxWrap>

        <BoxWrap>
          <Anchor
            color="grey"
            href="https://yieldprotocol.com/privacy/"
            target="_blank"
            onClick={() => handleExternal('Privacy')}
          >
            <Privacy size={IconSize} />
          </Anchor>
        </BoxWrap>
      </Box>

      {connectedChain && (
        <Box direction="row-responsive" gap="small">
          <Text size="xsmall">
            {`Connected to: `}
            <Text size="xsmall" color={CHAIN_INFO.get(fallbackChainId)?.color}>
              {CHAIN_INFO.get(fallbackChainId)?.name}
            </Text>
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default YieldInfo;
