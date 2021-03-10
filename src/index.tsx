import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ethers } from 'ethers';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import { Grommet, base } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { yieldTheme } from './themes';

// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainProvider } from './contexts/ChainContext';
import { VaultProvider } from './contexts/VaultContext';

/* Init the signing web3 environment */
function getLibrary(provider: ethers.providers.ExternalProvider, connector: any) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

/* Init the calling web3 environment */
const Web3FallbackProvider = createWeb3ReactRoot('fallback');
function getCallLibrary(provider: any, connector: any) {
  const library = new ethers.providers.InfuraProvider(provider.chainId, '646dc0f33d2449878b28e0afa25267f6');
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Web3FallbackProvider getLibrary={getCallLibrary}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ChainProvider>
            <VaultProvider>
              <Grommet theme={deepMerge(base, yieldTheme)} full>
                <App />
              </Grommet>
            </VaultProvider>
          </ChainProvider>
        </Web3ReactProvider>
      </Web3FallbackProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
