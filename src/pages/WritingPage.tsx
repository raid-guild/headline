import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "@remirror/styles/all.css";
import debounce from "lodash/fp/debounce";
import { useWallet } from "@raidguild/quiver";
import { useRemirror, useHelpers } from "@remirror/react";
import { useAppSelector, useAppDispatch } from "store";

import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Button from "components/Button";
import Icon from "components/Icon";
import Input from "components/Input";
import MarkdownEditor from "components/MarkdownEditor";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Text from "components/Text";
import { networks } from "lib/networks";
import { Article, createArticle, updateArticle } from "services/article/slice";
import { articleRegistrySelectors } from "services/articleRegistry/slice";

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

const MarkdownSave = ({ title }: { title: string }) => {
  const { getMarkdown } = useHelpers(true);
  const { chainId } = useWallet();
  const { streamId } = useParams();
  const [localStreamId, setLocalStreamId] = useState(streamId);
  const dispatch = useAppDispatch();

  const saveArticle = (markdown: string, title: string) => {
    if (!chainId) {
      return;
    }
    if (localStreamId) {
      dispatch(
        updateArticle({
          article: {
            title: title,
            text: markdown,
            status: "draft",
          },
          streamId: localStreamId,
          encrypt: true, // TODO change to true
          chainName: networks[chainId].litName,
        })
      );
    } else {
      const create = async () => {
        const createdArticle = await dispatch(
          createArticle({
            article: {
              title: title,
              text: markdown,
              createdAt: new Date().toISOString(),
              status: "draft",
            },
            encrypt: true, // TODO change to true
            chainName: networks[chainId].litName,
          })
        );
        if (
          createdArticle &&
          createdArticle.payload &&
          "streamId" in createdArticle.payload
        ) {
          setLocalStreamId(createdArticle.payload.streamId);
        }
      };
      create();
    }
  };
  const m = getMarkdown() || "";
  const debouncedSaveArticle = useCallback(debounce(1000, saveArticle), []);
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
  const { streamId } = useParams();
  const { state, onChange } = useRemirror({});
  const articleLoading = useAppSelector((state) => state.createArticle.loading);
  const addRegistryLoading = useAppSelector(
    (state) => state.addArticle.loading
  );
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );

  console.log(article);

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
            {articleLoading || addRegistryLoading ? "Saving..." : "Saved"}
          </Text>
          <StyledIconButton size="sm" color="primary" variant="contained">
            <StyledIcon size="md" src={settings} alt="settings button" />
          </StyledIconButton>
          <Button size="base" color="primary" variant="contained">
            Published
          </Button>
        </RightHeaderContainer>
      </StyledHeaderContainer>
      <StyledBody>
        <StyledInput
          title=""
          defaultValue={article?.title || "Untitled"}
          placeholder="Enter title..."
          onChange={onTitleChange}
        />
        <StyledMarkdownEditor
          placeholder="Start typing..."
          initialContent={article?.text || ""}
          state={state}
          onChange={onChange}
        >
          <MarkdownSave title={title} />
        </StyledMarkdownEditor>
      </StyledBody>
    </StyledLayout>
  );
};

export default WritingPage;
