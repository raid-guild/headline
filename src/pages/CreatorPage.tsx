import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import profile from "assets/obsidian.png";

import { fetchPublicationByStream } from "services/publication/slice";
import { useAppDispatch, useAppSelector } from "store";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Avatar from "components/Avatar";
import { CardContainer, ArticleEntries } from "components/ArticleCard";
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

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 1.6rem;
`;

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
      await dispatch(
        fetchPublicationByStream({
          streamId: publicationId,
        })
      );
    };
    f();
  }, [publicationId]);

  useEffect(() => {
    const f = async () => {
      if (!publicationId) {
        return;
      }
      console.log("PUblication");
      console.log(publication);
      await dispatch(
        fetchArticleRegistry({
          registry: "publishRegistry",
          registryId: publication?.registryId,
        })
      );
    };
    f();
  }, [publicationId, publication?.registryId]);
  console.log(articleRegistry);

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
          {active === "content" ? (
            Object.keys(articleRegistry).length ? (
              <ArticleEntries
                articleRegistry={articleRegistry}
                publicationId={publication?.streamId || ""}
              />
            ) : (
              <>Nothing to see here</>
            )
          ) : (
            <DescriptionContainer>
              <Title size="sm" color="label">
                Description
              </Title>
              <Text size="base" color="label">
                {publication?.description || "No description"}
              </Text>
            </DescriptionContainer>
          )}
        </CardContainer>
      </StyledBodyContainer>
    </Layout>
  );
};

export default CreatorPage;
