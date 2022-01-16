import styled from "styled-components";

import React from "react";
import Sidebar from "components/Sidebar";

const Layout = styled.div`
  width: 100%;
  height: 100%;
  gap: 0rem 0rem;
  display: grid;
  grid-template:
    "sidebar header" 6rem
    "sidebar body" 1fr
    / 40rem 1fr;
`;

const SidebarContainer = styled.div`
  grid-area: sidebar;
`;

const HeaderContainer = styled.div`
  grid-area: header;
`;

const BodyContainer = styled.div`
  grid-area: body;
`;

const DashboardPage = () => {
  return (
    <Layout>
      <HeaderContainer>Write</HeaderContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <BodyContainer>Body</BodyContainer>
    </Layout>
  );
};

export default DashboardPage;
