import React from "react";
import { Link } from "react-router-dom";
import Text from "components/Text";
import styled from "styled-components";
import { DASHBOARD_URI } from "../constants";

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: transparent;
  margin-top: 2.4rem;
  padding: 1.6rem 0;
  border-top: 0.4rem solid ${({ theme }) => `${theme.colors.primary}`};
  border-bottom: 0.4rem solid ${({ theme }) => `${theme.colors.primary}`};
`;

const NavText = styled(Text)`
  font-weight: 600;
  color: ${({ theme }) => `${theme.colors.primary}`};
`;

const navItems = [
  {
    text: "How it works",
    link: "/#",
  },
  {
    text: "FAQ",
    link: "/#",
  },
  {
    text: "Get started",
    link: "/#",
  },
];

const HomeNav = () => (
  <NavContainer>
    {navItems.map((navItem) => (
      <Link to={navItem.link}>
        <NavText size="md">{navItem.text}</NavText>
      </Link>
    ))}
  </NavContainer>
);

export default HomeNav;
