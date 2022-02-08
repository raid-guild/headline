import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import "@remirror/styles/all.css";
import debounce from "lodash/fp/debounce";
import { useRemirror, useHelpers } from "@remirror/react";
import { useAppDispatch } from "store";

import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Button from "components/Button";
import Icon from "components/Icon";
import Input from "components/Input";
import MarkdownEditor from "components/MarkdownEditor";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Text from "components/Text";
import { createArticle } from "services/article/slice";

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

const MarkdownSave = (title: string) => {
  const { getMarkdown } = useHelpers(true);
  const dispatch = useAppDispatch();
  const saveArticle = (markdown: string, title: string) => {
    console.log("here");
    console.log("markdown");
    console.log(markdown);
    console.log(title);
    dispatch(
      createArticle({
        article: {
          title: title,
          text: markdown,
          createdAt: new Date(),
          status: "draft",
        },
        encrypt: false, // TODO change to true
      })
    );
  };
  const m = getMarkdown();
  const debouncedSaveArticle = useCallback(debounce(500, saveArticle), []);
  useEffect(() => {
    debouncedSaveArticle(m, title);
  }, [m, title]);

  return <></>;
};

// auto save
// Change saved to saving while saving
// encrypt and store as a draft
// should trigger save to publication
const WritingPage = () => {
  const [title, setTitle] = useState("");
  const { state, onChange } = useRemirror({});

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
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
        <StyledInput
          title=""
          errorMsg=""
          placeholder="Enter title..."
          onChange={onTitleChange}
        />
        <StyledMarkdownEditor
          placeholder="Start typing..."
          state={state}
          onChange={onChange}
        >
          <MarkdownSave {...title} />
        </StyledMarkdownEditor>
      </StyledBody>
    </StyledLayout>
  );
};

export default WritingPage;
