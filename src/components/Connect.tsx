import { useContext } from 'react';
import { Box, ResponsiveContext, Text } from 'grommet';
import { ChainContext } from '../contexts/ChainContext';
import BackButton from './buttons/BackButton';
import Disclaimer from './Disclaimer';
import { Settings, SettingsContext } from '../contexts/SettingsContext';
import { ISettingsContext } from '../types';
import GeneralButton from './buttons/GeneralButton';
import YieldMark from './logos/YieldMark';

const Connect = ({ setSettingsOpen, setConnectOpen }: any) => {
  const mobile: boolean = useContext<any>(ResponsiveContext) === 'small';

  const {
    settingsState: { disclaimerChecked, darkMode },
    settingsActions: { updateSetting },
  } = useContext(SettingsContext) as ISettingsContext;

  const {
    chainState: {
      connection: { account, activatingConnector, CONNECTORS, CONNECTOR_INFO, connectionName, connector },
    },
    chainActions: { connect },
  } = useContext(ChainContext);

  const handleConnect = (connectorName: string) => {
    connect(connectorName);
    setConnectOpen(false);
    setSettingsOpen(false);
  };

  return (
    <Box
      fill="vertical"
      width={mobile ? undefined : '400px'}
      gap="small"
      elevation={darkMode ? 'large' : 'small'}
      background="lightBackground"
      round="small"
    >
      <Box
        justify="between"
        align="center"
        direction="row"
        background="gradient-transparent"
        pad="medium"
        round={{ corner: 'top', size: 'small' }}
      >
        {account && CONNECTORS ? (
          <BackButton
            action={() => {
              setSettingsOpen(true);
              setConnectOpen(false);
            }}
          />
        ) : (
          <Box fill="horizontal" direction="row" gap="small" align="center">
            <Box height="1.5em">
              {' '}
              <YieldMark />{' '}
            </Box>
            <Text size="medium" weight="lighter" color="text">
              Connect a wallet
            </Text>
          </Box>
        )}

        {/* <Button icon={<FiX size="1.5rem" color="text" />} onClick={() => setConnectOpen(false)} plain /> */}
      </Box>

      {disclaimerChecked === false && (
        <Box border={{ color: 'brand' }} round="small" pad="medium">
          <Disclaimer
            checked={disclaimerChecked}
            onChange={(event: any) => updateSetting(Settings.DISCLAIMER_CHECKED, event.target.checked)}
          />
        </Box>
      )}
      <Box pad="medium" gap={mobile ? 'large' : 'small'}>
        {[...CONNECTORS.keys()].map((name: string) => {
          const { displayName, image } = CONNECTOR_INFO.get(name);
          const currentConnector = CONNECTORS.get(name);
          const activating = currentConnector === activatingConnector;
          const connected = connector && name === connectionName;

          return (
            <GeneralButton
              key={name}
              action={() => !connected && handleConnect(name)}
              background={connected ? 'gradient' : 'gradient-transparent'}
              disabled={disclaimerChecked === false}
            >
              <Box direction="row" gap="xsmall">
                {activating ? (
                  <Text size="small" color={connected ? 'white' : 'text'}>
                    'Connecting'
                  </Text>
                ) : (
                  <Box direction="row" gap="small" align="center">
                    <Text size="small" color={connected ? 'white' : 'text'} textAlign="center">
                      {displayName}
                    </Text>
                    <Box height="24px" width="24px">
                      {image()}
                    </Box>
                  </Box>
                )}
              </Box>
            </GeneralButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default Connect;
