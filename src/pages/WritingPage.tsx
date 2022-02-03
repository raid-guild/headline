import React, { useState } from "react";
import styled from "styled-components";
import "@remirror/styles/all.css";
import debounce from "lodash/fp/debounce";

import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Button from "components/Button";
import Icon from "components/Icon";
import Input from "components/Input";
import MarkdownEditor from "components/MarkdownEditor";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
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
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 21.6rem;
  margin-right: 21.6rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 7rem;
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

const StyledInput = styled(Input)`
  border: none;
  font-size: ${({ theme }) => theme.title.md.fontSize};
  line-height: ${({ theme }) => theme.title.md.lineHeight};
  font-weight: ${({ theme }) => theme.title.md.fontWeight};
  color: ${({ theme }) => theme.colors.grey};
`;

const StyledMarkdownEditor = styled(MarkdownEditor)`
  width: 100%;
  display: flex;
  margin-top: 3.2rem;
  height: 100%;
`;

// auto save
// Change saved to saving while saving
// encrypt and store as a draft
// should trigger save to publication
const WritingPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const saveArticle = () => {
    console.log("here");
  };

  const debouncedSaveArticle = () => {
    debounce(500, saveArticle);
  };
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
        <StyledInput title="" errorMsg="" placeholder="Enter title..." />
        <StyledMarkdownEditor placeholder="Start typing..."></StyledMarkdownEditor>
      </StyledBody>
    </StyledLayout>
  );
};

export default WritingPage;
