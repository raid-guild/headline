import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import styled from "styled-components";
import { MobileNavContainer } from "./Layout";
import MobileNavItem from "components/MobileNavItem";

type Props = {
  text: string;
  icon?: "dashboard" | "create" | "mail" | "profile" | "library_book";
  active?: boolean;
};

const MobileNavMenuContainer = styled.div<Pick<Props, "active">>`
  display: flex;
  flex-direction: row;
  background: ${({ theme }) => theme.colors.almostWhite};
  gap: 4.8rem;
  height: 100%;
`;

const MobileNav = () => {
  const location = useLocation();
  return (
    <MobileNavContainer>
      <MobileNavMenuContainer>
        <Link to={"/dashboard"}>
          <MobileNavItem
            icon="dashboard"
            active={location.pathname.includes("dashboard")}
          />
        </Link>
        <Link to={"/publish"}>
          <MobileNavItem
            icon="mail"
            active={location.pathname.includes("publish")}
          />
        </Link>
        <Link to={"/profile"}>
          <MobileNavItem
            icon="profile"
            active={location.pathname.includes("profile")}
          />
        </Link>
      </MobileNavMenuContainer>
    </MobileNavContainer>
  );
};

export default MobileNav;
