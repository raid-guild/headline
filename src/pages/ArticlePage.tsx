import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useToolbarState, Toolbar } from "reakit/Toolbar";
import ToolbarItem from "components/ToolbarItem";

import { useAppDispatch, useAppSelector } from "store";
import {
  fetchArticle,
  articleRegistrySelectors,
} from "services/articleRegistry/slice";
import { fetchPublicationByStream } from "services/publication/slice";

import Avatar from "components/Avatar";
import Button from "components/Button";
import Title from "components/Title";
import Text from "components/Text";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import profile from "assets/obsidian.png";

const StyledBodyContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 85rem;
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  max-width: 85rem;
  display: flex;
  justify-content: space-between;
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  align-items: center;
`;

const ToolbarContainer = styled.div`
  height: 7.2rem;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 1.6rem;
`;

const ArticlePage = () => {
  const { publicationId, streamId } = useParams();
  const [published, setPublished] = useState(false);
  const [active, setActive] = useState("content");
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );
  const toolbar = useToolbarState();
  const publication = useAppSelector((state) => state.publication);
  console.log(article);
  console.log(published);
  console.log(streamId);

  useEffect(() => {
    const f = async () => {
      if (!streamId) {
        return;
      }
      console.log("Fetching");
      await dispatch(
        fetchArticle({
          streamId,
          chainName: "",
        })
      );
      console.log("Fetched");
      setPublished(true);
    };
    f();
  }, [streamId]);

  useEffect(() => {
    const f = async () => {
      if (!publicationId) {
        return;
      }
      console.log("Fetching");
      await dispatch(
        fetchPublicationByStream({
          streamId: publicationId,
        })
      );
      console.log("Fetched");
    };
    f();
  }, [publicationId]);

  return (
    <Layout>
      <StyledHeaderContainer>
        <TitleContainer>
          <Avatar size="xl" src={profile} alt="newsletter profile picture" />
          <Text size="lg" weight="semibold" color="helpText">
            {publication?.name}
          </Text>
        </TitleContainer>
        <Button size="md" color="primary" variant="contained">
          Subscribe
        </Button>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ToolbarContainer>
          <Toolbar {...toolbar} aria-label="publish subnav">
            <ToolbarItem
              {...toolbar}
              active={active === "content"}
              onClick={() => setActive("content")}
            >
              <Text size="base">Content</Text>
            </ToolbarItem>
            <ToolbarItem
              {...toolbar}
              active={active === "about"}
              onClick={() => setActive("about")}
            >
              <Text size="base">About</Text>
            </ToolbarItem>
          </Toolbar>
        </ToolbarContainer>
        {active === "content" ? (
          <ReactMarkdown>{article?.text}</ReactMarkdown>
        ) : (
          <DescriptionContainer>
            <Title size="sm" weight="semibold" color="label">
              Description
            </Title>
            <Text size="base" color="label">
              {publication?.description}
            </Text>
          </DescriptionContainer>
        )}
      </StyledBodyContainer>
    </Layout>
  );
};

export default ArticlePage;
