import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import profile from "assets/obsidian.png";

import { fetchPublicationByStream } from "services/publication/slice";
import { useAppDispatch, useAppSelector } from "store";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Avatar from "components/Avatar";
import ArticleCard from "components/ArticleCard";
import Button from "components/Button";
import PublicToolbar from "components/PublicToolbar";
import Title from "components/Title";
import Text from "components/Text";
import { checkoutRedirect } from "lib/unlock";
import { fetchArticleRegistry } from "services/articleRegistry/slice";

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

const CardContainer = styled.div`
  margin-top: 1.6rem;
  gap: 1.2rem;
  display: flex;
  flex-direction: column;
`;
const ArticleEntries = ({
  articleRegistry,
}: {
  articleRegistry: { [key: string]: Article };
}) => {
  return (
    <>
      {Object.values(articleRegistry).map((value) => {
        return <ArticleCard key={value.streamId} article={value} />;
      })}
    </>
  );
};

const CreatorPage = () => {
  const { publicationId } = useParams();
  const articleRegistry = useAppSelector(
    (state) => state.articleRegistry // Name is required in the schema
  );

  const [active, setActive] = useState("content");
  const dispatch = useAppDispatch();
  const publication = useAppSelector((state) => state.publication);

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

  useEffect(() => {
    const f = async () => {
      if (!publicationId) {
        return;
      }
      console.log("Fetching");
      await dispatch(
        fetchArticleRegistry({
          chainName: "",
          registry: "publishRegistry",
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
        <a href={checkoutRedirect(publication?.name, publication?.locks)}>
          <Button size="md" color="primary" variant="contained">
            Subscribe
          </Button>
        </a>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ToolbarContainer>
          <PublicToolbar active={active} setActive={setActive} />
        </ToolbarContainer>
        <CardContainer>
          {Object.keys(articleRegistry).length ? (
            <ArticleEntries articleRegistry={articleRegistry} />
          ) : (
            <>Nothing to see here</>
          )}
        </CardContainer>
      </StyledBodyContainer>
    </Layout>
  );
};

export default CreatorPage;
