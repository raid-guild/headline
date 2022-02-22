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

import { networks } from "lib/networks";

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
