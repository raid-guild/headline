import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SidebarItem from "components/SidebarItem";
import FullLogo from "components/FullLogo";

const SidebarContainer = styled.div`
  margin-left: 2rem;
  height: 100%;
`;

const LogoContainer = styled.div`
  height: 100%;
  max-height: 18rem;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopContainer = styled.div`
  height: 67%;
`;

const BottomContainer = styled.div`
  height: 33%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <TopContainer>
        <LogoContainer>
          <FullLogo />
        </LogoContainer>
        <MenuContainer>
          <Link to={"/dashboard"}>
            <SidebarItem text="Dashboard" />
          </Link>
          <Link to={"/inbox"}>
            <SidebarItem text="Inbox" />
          </Link>
          <Link to={"/publish"}>
            <SidebarItem text="Publish" />
          </Link>
          <Link to={"/profile"}>
            <SidebarItem text="My Profile" />
          </Link>
        </MenuContainer>
      </TopContainer>
      <BottomContainer>
        <Link to={"/guide"}>
          <SidebarItem text="Guide" />
        </Link>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
