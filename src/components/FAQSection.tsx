import React from "react";
import { Link } from "react-router-dom";
import Text from "components/Text";
import Title from "components/Text";

import styled from "styled-components";

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: ${({ theme }) => `${theme.colors.primary}`};
  min-height: 80vh;
  height: 80vh;
  width: 100%;
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

const FAQTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => `${theme.colors.mediumGrey}`};
`;

const FAQItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FAQSection = () => (
  <FAQContainer id="#faq">
    <FAQTitle>FAQ</FAQTitle>
    <FAQItemsContainer></FAQItemsContainer>
  </FAQContainer>
);

export default FAQSection;
