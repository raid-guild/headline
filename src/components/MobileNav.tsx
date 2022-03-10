import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MobileNavContainer } from "./Layout";
import MobileNavItem from "components/MobileNavItem";

const MobileNavMenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  background: ${({ theme }) => theme.colors.almostWhite};
`;

const MobileNav = () => {
  return (
    <MobileNavContainer>
      <MobileNavMenuContainer>
        <Link to={"/dashboard"}>
          <MobileNavItem
            text="Dashboard"
            icon="dashboard"
            active={location.pathname.includes("dashboard")}
          />
        </Link>
        <Link to={"/publish"}>
          <MobileNavItem
            text="Publish"
            icon="mail"
            active={location.pathname.includes("publish")}
          />
        </Link>
        <Link to={"/profile"}>
          <MobileNavItem
            text="My Profile"
            icon="profile"
            active={location.pathname.includes("profile")}
          />
        </Link>
      </MobileNavMenuContainer>
    </MobileNavContainer>
  );
};

export default MobileNav;
