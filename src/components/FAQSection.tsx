import React from "react";
import AccordionSection from "./AccordionSection";

import styled from "styled-components";

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rem 0;
  background: ${({ theme }) => `${theme.colors.primary}`};
  @media (max-width: 990px) {
    width: 100vw;
    padding: 0 2.4rem 6.4rem;
  }
`;

const FAQTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => `${theme.colors.mediumGrey}`};
`;

const FAQText = styled.p`
  font-size: 2.4rem;
  line-height: 2.8rem;
  font-weight: 600;
  color: ${({ theme }) => `${theme.colors.mediumGrey}`};
  @media (max-width: 990px) {
    font-size: 2.2rem;
    line-height: 2.6rem;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  & hover {
    cursor: pointer;
  }
`;

const FAQItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 40%;
  @media (max-width: 768px) {
    max-width: none;
  }
  @media (max-width: 990px) {
    max-width: 80%;
  }
`;

const FAQSection = () => (
  <FAQContainer id="#faq">
    <FAQItemsContainer>
      <FAQTitle>FAQ</FAQTitle>
      <AccordionSection />
      <StyledLink href="https://discord.gg/R4ppmsC6bv" target="_blank">
        <FAQText>More questions? Visit us on Discord</FAQText>
      </StyledLink>
    </FAQItemsContainer>
  </FAQContainer>
);

export default FAQSection;
