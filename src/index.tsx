import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { ethers } from 'ethers';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import { Grommet, base } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { yieldTheme } from './themes';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainProvider } from './contexts/ChainContext';
import { TxProvider } from './contexts/TxContext';
import { UserProvider } from './contexts/UserContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { SettingsProvider } from './contexts/SettingsContext';

/* Init the signing web3 environment */
function getLibrary(provider: ethers.providers.ExternalProvider, connector: any) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 6000;
  return library;
}

/* Init the calling web3 environment */
const Web3FallbackProvider = createWeb3ReactRoot('fallback');

function getFallbackLibrary(provider: any, connector: any) {
  // library = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_1 as string);
  if (provider.chainId === (421611 || 42161)) {
    return new ethers.providers.JsonRpcProvider('http://ArbNodeUrl.com');
  }
  if (provider.chainId === 69) {
    return new ethers.providers.JsonRpcProvider('https://kovan.optimism.io');
  }
  if (provider.chainId === 10) {
    return new ethers.providers.JsonRpcProvider('https://optimism.io');
  }
  const library: ethers.providers.JsonRpcProvider = new ethers.providers.InfuraProvider(
    provider.chainId,
    '2af222f674024a0f84b5f0aad0da72a2'
  );
  library.pollingInterval = 6000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
    <Router>
      <Web3FallbackProvider getLibrary={getFallbackLibrary}>
        <Web3ReactProvider getLibrary={getLibrary}> 
          <ChainProvider>
            <UserProvider>
              <TxProvider>
                <HistoryProvider>
                  <Grommet theme={deepMerge(base, yieldTheme)} full>
                    <App />
                  </Grommet>
                </HistoryProvider>
              </TxProvider>
            </UserProvider> 
          </ChainProvider>
        </Web3ReactProvider>
      </Web3FallbackProvider>
    </Router>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
