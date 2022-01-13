import React from "react";
import { HashRouter, Route, Routes as RouteContainer } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

const Routes = () => {
  return (
    <HashRouter>
      <RouteContainer>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </RouteContainer>
    </HashRouter>
  );
};

export default Routes;
