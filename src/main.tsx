import React from "react";
import { ThemeProvider } from "styled-components";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "Routes";
import GlobalStyle from "GlobalStyle";
import theme from "theme";
import { CeramicProvider } from "context/CeramicContext";
import { store } from "store";
import { Provider } from "react-redux";

import { WalletProvider } from "@raidguild/quiver";

// If using Portis provider
// If using Frame provider
// If using wallet connect
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { IProviderOptions } from "web3modal";

const networks = {
  1: {
    chainId: 1,
    name: "Mainnet",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    rpc: "https://mainnet.infura.io/v3/<your infura project id>",
  },
  4: {
    chainId: 4,
    name: "Rinkeby",
    symbol: "ETH",
    explorer: "https://rinkeby.etherscan.io",
    rpc: "https://rinkeby.infura.io/v3/<your infura project id>",
  },
};

const providerOptions: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: networks[1].rpc,
        4: networks[4].rpc,
      },
    },
  },
};
const web3modalOptions = {
  cacheProvider: true,
  providerOptions,
  theme: "dark",
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WalletProvider
        web3modalOptions={web3modalOptions}
        networks={networks}
        defaultNetwork={1}
        // Optional but useful to handle events.
        handleModalEvents={(eventName, error) => {
          if (error) {
            console.error(error.message);
          }

          console.log(eventName);
        }}
      >
        <ThemeProvider theme={theme}>
          <CeramicProvider>
            <Routes />
          </CeramicProvider>
        </ThemeProvider>
        <GlobalStyle />
      </WalletProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
