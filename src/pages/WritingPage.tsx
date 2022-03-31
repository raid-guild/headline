import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "@remirror/styles/all.css";
import debounce from "lodash/fp/debounce";
import { useWallet } from "@alexkeating/quiver";
import { useRemirror, useHelpers } from "@remirror/react";
import { useAppSelector, useAppDispatch } from "store";

import { useCeramic } from "context/CeramicContext";
import { useLit } from "context/LitContext";
import { ArticleSettings, PublishModal } from "components/ArticleSettings";
import Avatar from "components/Avatar";
import BackButton from "components/BackButton";
import Input from "components/Input";
import { MarkdownEditor } from "components/MarkdownEditor";
import MobileNav from "components/MobileNav";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Text from "components/Text";
import usePubImg from "hooks/usePubImg";
import { networks } from "lib/networks";
import { updateArticle } from "services/article/slice";
import { articleRegistrySelectors } from "services/articleRegistry/slice";

import { storeIpfs } from "lib/ipfs";

const AvatarContainer = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
`;

const StyledBody = styled(BodyContainer)`
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 21.6rem;
  margin-right: 21.6rem;
  display: flex;
  flex-direction: column;
  margin-bottom: 7rem;
  @media (max-width: 990px) {
    margin: 2.4rem;
    min-width: 0;
    padding-bottom: 4rem;
    & #id-2.remirror-toolbar {
      align-items: flex-start;
      flex-wrap: wrap;
      flex-basis: 40%;
      background: #f8f8f8;
      & .remirror-group {
        margin: 0;
      }
    }
    & .remirror-editor-wrapper {
      padding-bottom: 4rem;
    }
  }
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  margin-left: 7rem;
  margin-right: 7rem;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 990px) {
    margin: 0;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    padding: 2.4rem 2.4rem 0;
    border-bottom: 1px solid;
    border-color: #f0efef;
  }
`;

const LeftHeaderContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  @media (max-width: 990px) {
  }
`;

const RightHeaderContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  align-items: center;
  @media (max-width: 990px) {
    justify-content: space-between;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 990px) {
    display: none;
  }
`;

const StyledInput = styled(Input)`
  border: none;
  font-size: ${({ theme }) => theme.title.md.fontSize};
  line-height: ${({ theme }) => theme.title.md.lineHeight};
  font-weight: ${({ theme }) => theme.title.md.fontWeight};
  color: ${({ theme }) => theme.colors.grey};
  @media (max-width: 990px) {
    width: 80%;
    min-width: 0;
  }
`;

const StyledMarkdownEditor = styled(MarkdownEditor)`
  width: 100%;
  display: flex;
  margin-top: 3.2rem;
  height: 100%;
  @media (max-width: 990px) {
  }
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
  const helpers = useHelpers(true);

  const m = JSON.stringify(helpers.getJSON()) || "";
  const debouncedSaveArticle = useCallback(debounce(1000, saveArticle), []);
  useEffect(() => {
    debouncedSaveArticle(m, title, description, previewImg || "", paid);
  }, [m, title]);

  return <></>;
};

const WritingPage = () => {
  const { streamId } = useParams();
  const { chainId } = useWallet();
  const { client } = useCeramic();
  const { litClient } = useLit();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { state, onChange } = useRemirror({});
  const [pubImg] = usePubImg();
  const articleLoading = useAppSelector((state) => state.updateArticle.loading);
  const addRegistryLoading = useAppSelector(
    (state) => state.addArticle.loading
  );
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );
  const publicationName = useAppSelector((state) => state.publication.name);

  console.log("Article");
  console.log(article);
  const [title, setTitle] = useState(article?.title || "Untitled");
  const saving = articleLoading || addRegistryLoading;
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };
  const onClick = () => {
    if (saving) {
      const answer = confirm(
        "Are you sure you want to leave the page while saving?"
      );
      if (!answer) {
        return;
      }
      navigate(-1);
    } else {
      navigate(-1);
    }
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
    if (description) {
      otherParams["description"] = description;
    }
    if (previewImg) {
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
    if (streamId && client) {
      await dispatch(
        updateArticle({
          article: {
            title: title,
            text: markdown,
            status: article?.status || "draft",
            ...otherParams,
          },
          client,
          streamId: streamId,
          encrypt: article?.status !== "published" || article?.paid === true,
          litClient,
          chainName: networks[chainId].litName,
        })
      );
    }
  };

  return (
    <StyledLayout>
      <StyledHeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" onClick={onClick} />
          <AvatarContainer>
            <Avatar
              size="xl"
              src={pubImg ? URL.createObjectURL(pubImg) : ""}
              alt="newsletter profile picture"
            />
          </AvatarContainer>
          <TitleContainer>
            <Text size="md" weight="semibold" color="helpText">
              {publicationName}
            </Text>
            <Text size="sm" color="helpText">
              Dashboard
            </Text>
          </TitleContainer>
        </LeftHeaderContainer>
        <RightHeaderContainer>
          <Text size="sm" color="helpText">
            {saving ? "Saving..." : "Saved"}
          </Text>
          <ArticleSettings streamId={streamId} saveArticle={saveArticle} />
          <PublishModal streamId={streamId || ""} />
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
          initialContent={JSON.parse(article?.text || "")}
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
      <MobileNav />
    </StyledLayout>
  );
};

export default WritingPage;
