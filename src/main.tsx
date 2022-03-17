import { WalletProvider } from "@raidguild/quiver";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Provider as ReakitProvider } from "reakit";
import { ThemeProvider } from "styled-components";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { IProviderOptions } from "web3modal";

import { CeramicProvider } from "context/CeramicContext";
import { LitProvider } from "context/LitContext";
import { UnlockProvider } from "context/UnlockContext";
import GlobalStyle from "GlobalStyle";
import { networks } from "lib/networks";
import Routes from "Routes";
import { store } from "store";
import theme from "theme";

import "./index.css";

// import Inter globally from fontsource
import "@fontsource/inter/latin.css";

const providerOptions: IProviderOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        "0x1": networks["0x1"].rpc,
        "0x4": networks["0x4"].rpc,
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
      <UnlockProvider>
        <LitProvider>
          <WalletProvider
            web3modalOptions={web3modalOptions}
            networks={networks}
            defaultChainId={"0x1"}
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
                <ReakitProvider>
                  <Routes />
                </ReakitProvider>
              </CeramicProvider>
            </ThemeProvider>
            <GlobalStyle />
          </WalletProvider>
        </LitProvider>
      </UnlockProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
