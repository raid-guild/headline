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

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
`;
const StyledBodyContainer = styled(BodyContainer)`
  align-items: flex-start;
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  border-bottom: ${({ theme }) => `0.1rem solid ${theme.colors.lightGrey}`};
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

const LeftHeaderContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 6rem;
  align-items: center;
`;

const BodyHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const HomePage = () => {
  return (
    <StyledLayout>
      <StyledHeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" />
          <Icon size="xl" src={small_logo} alt="Unlock logo" />
          <Text size="md" weight="semibold" color="helpText">
            Create Publication
          </Text>
        </LeftHeaderContainer>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ContentContainer>Content</ContentContainer>
      </StyledBodyContainer>
    </StyledLayout>
  );
};

export default HomePage;
