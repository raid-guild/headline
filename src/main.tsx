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

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CeramicProvider>
          <Routes />
        </CeramicProvider>
      </ThemeProvider>
      <GlobalStyle />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
