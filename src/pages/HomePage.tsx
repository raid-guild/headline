import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Button from "components/Button";
import Title from "components/Title";
import Text from "components/Text";
import { AppWrapper, Layout, BodyContainer } from "components/Layout";
import LogoWordmark from "components/LogoWordmark";
import FullLogo from "components/FullLogo";
import HomeNav from "components/HomeNav";
import FAQSection from "components/FAQSection";
import MobileNav from "components/MobileNav";
import { DASHBOARD_URI } from "../constants";
import heroImage from "assets/img-hero.svg";
import heroImageMobile from "assets/img-hero-sm.svg";

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
  background: ${({ theme }) => `${theme.colors.almostWhite}`};
`;

const StyledBodyContainer = styled(BodyContainer)`
  grid-area: body;
  align-self: flex-start;
  width: 100%;
`;

const HomeHeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: column;
  padding: 4.8rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const HeroContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.6rem;
  padding: 4.8rem;
  width: 100%;
  min-height: 80vh;
  background-image: url(${heroImage});
  background-position: "top left";
  background-size: contain;
  background-repeat: no-repeat;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const HeroCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  @media (max-width: 768px) {
    margin: 0;
    flex-basis: 80%;
  }
`;

const HeroHeading = styled(Title)`
  font-size: 3.2rem;
  line-height: 3.8rem;
  @media (max-width: 768px) {
    font-size: 2.8rem;
    line-height: 3.2rem;
  }
`;

const HeroTagline = styled(Title)`
  font-size: 9.6rem;
  line-height: 10.2rem;
  @media (max-width: 768px) {
    font-size: 6.4rem;
    line-height: 7rem;
  }
`;

const HeroButton = styled(Button)`
  margin-top: 3.2rem;
`;

const LogoContainer = styled.div`
  direction: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
  @media (max-width: 768px) {
  }
`;

const FooterLogoContainer = styled.div`
  direction: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
  @media (max-width: 768px) {
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
  background: ${({ theme }) => `${theme.colors.almostWhite}`};
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
    margin-top: 8rem;
  }
`;

const HeadlineTickerContainer = styled.div`
  width: 100%;
  height: 14rem;
  background: ${({ theme }) => `${theme.colors.primary}`};
  display: flex;
  align-items: center;
  gap: 4.8rem;
`;

const TickerItem = styled(Title)`
  color: ${({ theme }) => `${theme.colors.almostWhite}`};
  font-weight: 900;
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;
const FooterButton = styled(Button)`
  border-radius: 0.8rem;
  width: 100%;
`;

const HomePage = () => {
  return (
    <StyledMainWrapper>
      <HomeHeaderContainer>
        <LogoContainer>
          <LogoWordmark />
        </LogoContainer>
        <HomeNav />
      </HomeHeaderContainer>
      <StyledBodyContainer>
        <HeroContainer>
          <HeroCTAContainer>
            <HeroHeading size="md" color="primary">
              The Decentralized Publishing Platform.
            </HeroHeading>
            <HeroTagline size="xxxl" color="primary">
              Your Content,
            </HeroTagline>
            <HeroTagline size="xxxl" color="primary">
              Your Community.
            </HeroTagline>
            <Link to={DASHBOARD_URI}>
              <HeroButton color="primary" variant="outlined" size="xl">
                Get Started
              </HeroButton>
            </Link>
          </HeroCTAContainer>
        </HeroContainer>
      </StyledBodyContainer>
      {/* <HeadlineTickerContainer>
        <TickerItem size="xxl">ADLINE</TickerItem>
        <TickerItem size="xxl">HEADLINE</TickerItem>
        <TickerItem size="xxl">HEADLINE</TickerItem>
        <TickerItem size="xxl">HEADLINE</TickerItem>
        <TickerItem size="xxl">HEA</TickerItem>
      </HeadlineTickerContainer> */}
      <FAQSection />
      <HomeFooterContainer>
        <FooterLogoContainer>
          <FullLogo />
        </FooterLogoContainer>
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
    </StyledMainWrapper>
  );
};

export default HomePage;
