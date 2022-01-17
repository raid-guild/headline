import React from "react";
import {
  HashRouter,
  Route,
  Routes as RouteContainer,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

const Routes = () => {
  return (
    <HashRouter>
      <RouteContainer>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </RouteContainer>
    </HashRouter>
  );
};

export default Routes;
