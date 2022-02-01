import "@remirror/styles/all.css";

import React from "react";
import styled from "styled-components";

import { MarkdownEditor } from "@remirror/react-editors/markdown";

import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Button from "components/Button";
import Icon from "components/Icon";
import {
  Layout,
  BodyContainer,
  HeaderContainer,
  HeaderText,
} from "components/Layout";
import Text from "components/Text";

import profile from "assets/obsidian.png";
import settings from "assets/settings.svg";

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  margin-left: 7rem;
  margin-right: 7rem;
  justify-content: space-between;
  align-items: center;
`;

const StyledBody = styled(BodyContainer)`
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 21.6rem;
  margin-right: 21.6rem;
`;

const LeftHeaderContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

const RightHeaderContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledIconButton = styled(Button)`
  padding: 0rem;
  height: auto;
`;

const StyledIcon = styled(Icon)`
  padding: 1rem;
  height: auto;
`;

const WritingPage = () => {
  return (
    <StyledLayout>
      <StyledHeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" />
          <Avatar size="xl" src={profile} alt="newsletter profile picture" />
          <TitleContainer>
            <Text size="md" weight="semibold" color="helpText">
              Name
            </Text>
            <Text size="sm" color="helpText">
              Dashboard
            </Text>
          </TitleContainer>
        </LeftHeaderContainer>
        <RightHeaderContainer>
          <Text size="sm" color="helpText">
            Saved
          </Text>
          <StyledIconButton size="sm" color="almostWhite" borderColor="primary">
            <StyledIcon size="md" src={settings} alt="settings button" />
          </StyledIconButton>
          <Button size="base">Published</Button>
        </RightHeaderContainer>
      </StyledHeaderContainer>
      <StyledBody>
        <MarkdownEditor placeholder="Start typing..."></MarkdownEditor>
      </StyledBody>
    </StyledLayout>
  );
};

export default WritingPage;
