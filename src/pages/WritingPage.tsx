import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "@remirror/styles/all.css";
import debounce from "lodash/fp/debounce";
import { useWallet } from "@raidguild/quiver";
import { useRemirror, useHelpers } from "@remirror/react";
import { useAppSelector, useAppDispatch } from "store";

import { ArticleSettings } from "components/ArticleSettings";
import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Button from "components/Button";
import Input from "components/Input";
import MarkdownEditor from "components/MarkdownEditor";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Text from "components/Text";
import { networks } from "lib/networks";
import { createArticle, updateArticle } from "services/article/slice";
import { articleRegistrySelectors } from "services/articleRegistry/slice";

import profile from "assets/obsidian.png";
import { storeIpfs } from "lib/ipfs";

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

const MarkdownSave = ({
  title,
  description,
  previewImg,
  paid,
  saveArticle,
}: {
  title: string;
  description: string;
  paid: boolean;
  previewImg: string | null;
  saveArticle: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: File | string | undefined,
    arg4: boolean
  ) => void;
}) => {
  const { getMarkdown } = useHelpers(true);

  const m = getMarkdown() || "";
  const debouncedSaveArticle = useCallback(debounce(1000, saveArticle), []);
  useEffect(() => {
    debouncedSaveArticle(m, title, description, previewImg || "", paid);
  }, [m, title]);

  return <></>;
};

// auto save
// Change saved to saving while saving
// encrypt and store as a draft
// should trigger save to publication
const WritingPage = () => {
  const { streamId } = useParams();
  const { chainId } = useWallet();
  const dispatch = useAppDispatch();
  const [localStreamId, setLocalStreamId] = useState(streamId);
  const { state, onChange } = useRemirror({});
  const articleLoading = useAppSelector((state) => state.createArticle.loading);
  const addRegistryLoading = useAppSelector(
    (state) => state.addArticle.loading
  );
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );
  const [title, setTitle] = useState(article?.title || "Untitled");

  console.log(article);

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const saveArticle = async (
    markdown: string,
    title: string,
    description = "",
    previewImg: File | string | undefined = undefined,
    paid = false
  ) => {
    if (!chainId) {
      return;
    }
    const otherParams = {} as {
      description?: string;
      previewImg?: string | undefined;
      paid?: boolean;
    };
    console.log("In save");
    console.log(description);
    if (description) {
      otherParams["description"] = description;
    }
    if (previewImg) {
      console.log("preview img");
      console.log(previewImg);
      if (typeof previewImg === "string") {
        otherParams["previewImg"] = previewImg;
      } else {
        otherParams["previewImg"] = await storeIpfs(
          await previewImg.arrayBuffer()
        );
      }
    }
    if (paid) {
      otherParams["paid"] = paid;
    }
    console.log(otherParams);
    if (localStreamId) {
      dispatch(
        updateArticle({
          article: {
            title: title,
            text: markdown,
            status: "draft",
            ...otherParams,
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
              ...otherParams,
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
          <ArticleSettings streamId={localStreamId} saveArticle={saveArticle} />
          <Button size="md" color="primary" variant="contained">
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
          <MarkdownSave
            title={title}
            description={article?.description || ""}
            previewImg={article?.previewImg || ""}
            paid={article?.paid || false}
            saveArticle={saveArticle}
          />
        </StyledMarkdownEditor>
      </StyledBody>
    </StyledLayout>
  );
};

export default WritingPage;
