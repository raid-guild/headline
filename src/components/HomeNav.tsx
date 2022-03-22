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
  & a {
    text-decoration: none;
  }
`;

const NavText = styled(Text)`
  font-weight: 600;
  color: ${({ theme }) => `${theme.colors.primary}`};
`;

const navItems = [
  {
    text: "How it works",
    link: "/##howitworks",
  },
  {
    text: "FAQ",
    link: "/##faq",
  },
];

const HomeNav = () => (
  <NavContainer>
    {navItems.map((navItem, idx) => (
      <a href={navItem.link} key={idx}>
        <NavText size="md">{navItem.text}</NavText>
      </a>
    ))}
    <Link to="/dashboard">
      <NavText size="md">Get Started</NavText>
    </Link>
  </NavContainer>
);

export default HomeNav;
