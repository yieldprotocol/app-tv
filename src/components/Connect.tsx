import React, { useContext } from 'react';
import { Box, Button, ResponsiveContext, Text } from 'grommet';
import { FiCheckCircle, FiCheckSquare, FiX } from 'react-icons/fi';
import { ChainContext } from '../contexts/ChainContext';
import BackButton from './buttons/BackButton';
import Disclaimer from './Disclaimer';
import { SettingsContext } from '../contexts/SettingsContext';
import { ISettingsContext } from '../types';
import GeneralButton from './buttons/GeneralButton';

const Connect = ({ setSettingsOpen, setConnectOpen }: any) => {
  const mobile: boolean = useContext<any>(ResponsiveContext) === 'small';

  const {
    settingsState: { disclaimerChecked, darkMode },
    settingsActions: { updateSetting },
  } = useContext(SettingsContext) as ISettingsContext;

  const {
    chainState: {
      connection: { account, activatingConnector, CONNECTORS, CONNECTOR_NAMES, connectionName, connector },
    },
    chainActions: { connect, setConnectionName },
  } = useContext(ChainContext);

  const handleConnect = (connectorName: string) => {
    setConnectionName(connectorName);
    connect(connectorName);
    setConnectOpen(false);
    setSettingsOpen(false);
  };

  return (
    <Box
      fill="vertical"
      basis="auto"
      width={mobile ? undefined : '400px'}
      pad="medium"
      gap="small"
      elevation={darkMode ? undefined : 'small'}
      background="lightBackground"
    >
      <Box justify="between" align="center" direction="row">
        {account && CONNECTORS ? (
          <BackButton
            action={() => {
              setSettingsOpen(true);
              setConnectOpen(false);
            }}
          />
        ) : (
          <Text>Connect</Text>
        )}
        <Button icon={<FiX size="1.5rem" />} onClick={() => setConnectOpen(false)} plain />
      </Box>
      {disclaimerChecked === false && (
        <Box border={{ color: 'brand' }} round="xsmall">
          <Disclaimer
            checked={disclaimerChecked}
            onChange={(event: any) => updateSetting('disclaimerChecked', event.target.checked)}
          />
        </Box>
      )}
      <Box gap="xsmall" pad={{ vertical: 'large' }}>
        {[...CONNECTORS.keys()].map((name: string) => {
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
                {connected && <FiCheckCircle color="#34D399" />}
                {activating ? (
                  <Text size="small" color={connected ? 'white' : 'text'}>
                    'Connecting'
                  </Text>
                ) : (
                  <Text size="small" color={connected ? 'white' : 'text'}>
                    {CONNECTOR_NAMES.get(name)}
                  </Text>
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
