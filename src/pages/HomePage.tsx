import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Button from "components/Button";
import BackButton from "components/BackButton";
import Icon from "components/Icon";
import Input from "components/Input";
import { Layout, HeaderContainer, BodyContainer } from "components/Layout";
import Title from "components/Title";
import Text from "components/Text";
import small_logo from "assets/small_logo.svg";
import celebrateIcon from "assets/celebrate.svg";
import FullLogo from "components/FullLogo";

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
  background-color: red;
`;
const StyledBodyContainer = styled(BodyContainer)`
  grid-area: body;
  background-color: red;
`;

const HomeHeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 3.2rem;
`;

const StyledIcon = styled(Icon)`
  height: 8rem;
`;

const HeroContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* max-width: 48rem; */

  background-color: blue;
`;

const HeroCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0rem 15rem;
  justify-content: center;
  align-items: center;
  background-color: green;
`;

const HeroHeading = styled.h2`
  font-size: 96px;
  line-height: 102px;
  font-weight: 900;
  text-align: center;
  color: black;
  margin-bottom: 3.2rem;
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
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 12rem;
  height: 100%;
  margin-top: 2rem;
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
`;

const HomePage = () => {
  return (
    <StyledLayout>
      <HomeHeaderContainer>
        <LogoContainer>
          <FullLogo />
        </LogoContainer>
        <ActionContainer>
          <InternalLink as="a" href="#">
            How it works
          </InternalLink>
          <Button color="primary" variant="contained" size="md">
            Get Started
          </Button>
        </ActionContainer>
      </HomeHeaderContainer>
      <StyledBodyContainer>
        <HeroContainer>
          <HeroCTAContainer>
            <HeroHeading>The Decentralized Newsletter.</HeroHeading>
            <HeroTagline>Your Content, Your Readers.</HeroTagline>
            <HeroButton color="primary" variant="contained" size="lg">
              Get Started
            </HeroButton>
          </HeroCTAContainer>
        </HeroContainer>
      </StyledBodyContainer>
    </StyledLayout>
  );
};

export default HomePage;
