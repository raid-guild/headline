import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "components/Button";
import Text from "components/Text";
import { AppWrapper, Layout, BodyContainer } from "components/Layout";
import LogoWordmark from "components/LogoWordmark";
import FullLogo from "components/FullLogo";
import HomeNav from "components/HomeNav";
import FAQSection from "components/FAQSection";
import MobileNav from "components/MobileNav";
import { DASHBOARD_URI } from "../constants";

const StyledLayout = styled(Layout)`
  grid-template:
    "header"
    "body"
    "footer";
  @media (max-width: 768px) {
    grid-template:
      "header"
      "body"
      "mobileNav";
  }
`;

const StyledMainWrapper = styled(AppWrapper)`
  padding: 4.8rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const StyledBodyContainer = styled(BodyContainer)`
  grid-area: body;
`;

const HomeHeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: column;
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
width:100%;
  padding:0;
  margin: 0;
  @media (max-width: 768px) {
p
  }
`;

const InternalLink = styled.a`
  font-size: 16px;
  line-height: 22px;
  align: center;
  background: transparent;
  color: #000000;
`;

const HomeFooterContainer = styled.div`
  grid-area: footer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-bewteen;
  margin: 4rem 0;
  padding: 0 4.8rem 4.8rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const FooterActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2.4rem;
  flex-basis: 32%;
  flex-grow: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLink = styled.a`
  display: block;
  width: 100%;
`;
const FooterButton = styled(Button)`
  border-radius: 0.8rem;
  width: 100%;
`;

const HomePage = () => {
  return (
    <>
      <StyledMainWrapper>
        <HomeHeaderContainer>
          <LogoContainer>
            <LogoWordmark />
          </LogoContainer>
          <HomeNav />
        </HomeHeaderContainer>
        <StyledBodyContainer>
          {/* <HeroContainer>
          <HeroCTAContainer>
            <HeroHeading>The Decentralized Newsletter.</HeroHeading>
            <HeroTagline>Your Content, Your Readers.</HeroTagline>
            <Link to={DASHBOARD_URI}>
              <HeroButton color="primary" variant="contained" size="xl">
                Get Started
              </HeroButton>
            </Link>
          </HeroCTAContainer>
        </HeroContainer> */}
        </StyledBodyContainer>
      </StyledMainWrapper>
      <FAQSection />
      <HomeFooterContainer>
        <LogoContainer>
          <FullLogo />
        </LogoContainer>
        <FooterActionContainer>
          <Text size="md" color="primary">
            The Decentralized Publishing Platform
          </Text>
          <StyledLink to={DASHBOARD_URI}>
            <FooterButton color="primary" variant="contained" size="md">
              Get Started
            </FooterButton>
          </StyledLink>
        </FooterActionContainer>
      </HomeFooterContainer>
    </>
  );
};

export default HomePage;
