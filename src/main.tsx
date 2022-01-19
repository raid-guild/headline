import React from "react";
import { ThemeProvider } from "styled-components";
import ReactDOM from "react-dom";
import "./index.css";
import Routes from "Routes";
import GlobalStyle from "GlobalStyle";
import theme from "theme";
import { CeramicProvider } from "context/CeramicContext";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CeramicProvider>
        <Routes />
      </CeramicProvider>
    </ThemeProvider>
    <GlobalStyle />
  </React.StrictMode>,
  document.getElementById("root")
);
