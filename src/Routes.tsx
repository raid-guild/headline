import React from "react";
import {
  HashRouter,
  Route,
  Routes as RouteContainer,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useCeramic } from "context/CeramicContext";
import ArticlePage from "./pages/ArticlePage";
import CreatorPage from "./pages/CreatorPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import PublishPage from "./pages/PublishPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePublicationPage from "./pages/CreatePublicationPage";
import WritingPage from "pages/WritingPage";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { did } = useCeramic();
  const location = useLocation();

  if (!did) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

const Routes = () => {
  return (
    <HashRouter>
      <RouteContainer>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/" element={<DashboardPage />} /> */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/publish"
          element={
            <RequireAuth>
              <PublishPage />
            </RequireAuth>
          }
        />
        <Route
          path="/publish/:menu"
          element={
            <RequireAuth>
              <PublishPage />
            </RequireAuth>
          }
        />
        <Route
          path="/publish/create"
          element={
            <RequireAuth>
              <CreatePublicationPage />
            </RequireAuth>
          }
        />
        <Route
          path="/publish/write/:streamId"
          element={
            <RequireAuth>
              <WritingPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route path="/pub/:publicationId/" element={<CreatorPage />} />
        <Route
          path="/pub/:publicationId/article/:streamId"
          element={<ArticlePage />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </RouteContainer>
    </HashRouter>
  );
};

export default Routes;
