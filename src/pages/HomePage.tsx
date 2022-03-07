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
`;
const StyledBodyContainer = styled(BodyContainer)`
  align-items: flex-start;
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

const ContentContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  max-width: 48rem;
  width: 100%;
  height: 100%;
  max-height: 40rem;
  justify-content: space-evenly;
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
        <ContentContainer>Content</ContentContainer>
      </StyledBodyContainer>
    </StyledLayout>
  );
};

export default HomePage;
