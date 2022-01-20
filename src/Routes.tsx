import React from "react";
import {
  HashRouter,
  Route,
  Routes as RouteContainer,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PublishPage from "./pages/PublishPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";

const Routes = () => {
  return (
    <HashRouter>
      <RouteContainer>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/publish/create" element={<CreatePublicationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </RouteContainer>
    </HashRouter>
  );
};

export default Routes;
