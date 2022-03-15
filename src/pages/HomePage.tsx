import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "components/Button";
import { AppWrapper, Layout, BodyContainer } from "components/Layout";
import FullLogo from "components/FullLogo";
import MobileNav from "components/MobileNav";
import { DASHBOARD_URI } from "../constants";

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
  @media (max-width: 768px) {
    grid-template:
      "header"
      "body"
      "mobileNav";
  }
`;
const StyledBodyContainer = styled(BodyContainer)`
  grid-area: body;
`;

const HomeHeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 2rem;
`;

const HeroContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0rem 15rem;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const HeroHeading = styled.h2`
  font-size: 96px;
  line-height: 102px;
  font-weight: 900;
  text-align: center;
  color: black;
  margin-bottom: 3.2rem;
  margin-top: 0px;
  @media (max-width: 768px) {
    font-size: 48px;
    line-height: 60px;
  }
`;

const HeroTagline = styled.span`
  font-size: 32px;
  line-height: 38px;
  font-weight: 600;
  text-align: center;
  color: black;
  margin-bottom: 5.6rem;
`;

const HeroButton = styled(Button)`
  border-radius: 8px;
  width: 26.5rem;
  height: 6.2rem;
`;

const LogoContainer = styled.div`
  direction: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
   padding: 2rem; 0
  }
`;

const InternalLink = styled.a`
  font-size: 16px;
  line-height: 22px;
  align: center;
  background: transparent;
  color: #000000;
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2.4rem;
  @media (max-width: 768px) {
    display: none;
  }
`;

const HomePage = () => {
  return (
    <AppWrapper>
      <StyledLayout>
        <HomeHeaderContainer>
          <LogoContainer>
            <FullLogo />
          </LogoContainer>
          <ActionContainer>
            <InternalLink as="a" href="#">
              How it works
            </InternalLink>
            <Link to={DASHBOARD_URI}>
              <Button color="primary" variant="contained" size="md">
                Get Started
              </Button>
            </Link>
          </ActionContainer>
        </HomeHeaderContainer>
        <StyledBodyContainer>
          <HeroContainer>
            <HeroCTAContainer>
              <HeroHeading>The Decentralized Newsletter.</HeroHeading>
              <HeroTagline>Your Content, Your Readers.</HeroTagline>
              <Link to={DASHBOARD_URI}>
                <HeroButton color="primary" variant="contained" size="xl">
                  Get Started
                </HeroButton>
              </Link>
            </HeroCTAContainer>
          </HeroContainer>
        </StyledBodyContainer>
      </StyledLayout>
    </AppWrapper>
  );
};

export default HomePage;
