import React from "react";
import { Link } from "react-router-dom";
import Text from "components/Text";
import styled from "styled-components";

const FAQContainer = styled.div`
  display: flex;
  background: ${({ theme }) => `${theme.colors.primary}`};
  min-height: 80vh;
  height: 80vh;
  width: 100%;
  @media (max-width: 768px) {

width: 100vw;
`;

// const NavText = styled(Text)`
//   font-weight: 600;
//   color: ${({ theme }) => `${theme.colors.primary}`};
// `;

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

const FAQSection = () => <FAQContainer></FAQContainer>;

export default FAQSection;
