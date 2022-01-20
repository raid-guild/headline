import React from "react";
import styled from "styled-components";
import BackButton from "components/BackButton";
import Icon from "components/Icon";
import { Layout, HeaderContainer, BodyContainer } from "components/Layout";
import Text from "components/Text";

import small_logo from "assets/small_logo.svg";

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
`;

const LeftHeaderContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 6rem;
  align-items: center;
`;

const CreatePublicationPage = () => {
  return (
    <StyledLayout>
      <HeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" />
          <Icon size="xl" src={small_logo} alt="Unlock logo" />
          <Text size="md" weight="semibold" color="helpText">
            Create Publication
          </Text>
        </LeftHeaderContainer>
      </HeaderContainer>
      <BodyContainer>Hi</BodyContainer>
    </StyledLayout>
  );
};

export default CreatePublicationPage;
