import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import profile from "assets/obsidian.png";

import { useLit } from "context/LitContext";
import { fetchPublicationByStream } from "services/publication/slice";
import { useAppDispatch, useAppSelector } from "store";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import Avatar from "components/Avatar";
import { CardContainer, ArticleEntries } from "components/ArticleCard";
import Button from "components/Button";
import PublicToolbar from "components/PublicToolbar";
import Title from "components/Title";
import Text from "components/Text";
import MobileHeader from "components/MobileHeader";
import MobileNav from "components/MobileNav";
import { checkoutRedirect } from "lib/unlock";
import { fetchArticleRegistry } from "services/articleRegistry/slice";

const StyledBodyContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 85rem;
  @media (max-width: 990px) {
    margin: 0 2.4rem;
  }
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  max-width: 85rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    grid-area: header;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  @media (max-width: 990px) {
    grid-area: header;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
`;

const PublicationInfoContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  align-items: center;
  @media (max-width: 990px) {
    flex-direction: column;
    width: 100%;
    padding: 2.4rem 2.4rem 1.6rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 1.6rem;
  justify-content: center;
  align-items: center;
  @media (max-width: 990px) {
    flex-direction: column;
    width: 100%;
    margin-top: 2.4rem;
  }
  @media (max-width: 990px) {
    flex-direction: row;
    margin-top: 2.4rem;
  }
`;

export const HeaderText = styled(Text)`
  margin-left: 0px;
  @media (max-width: 990px) {
    margin-left: 6.4rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 295px;
  @media (max-width: 990px) {
    width: 100%;
    margin-top: 1.6rem;
    min-width: 327px;
  }
`;

const ToolbarContainer = styled.div`
  height: 7.2rem;
  @media (max-width: 990px) {
    width: 100%;
  }
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-top: 1.6rem;
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media (max-width: 990px) {
    min-height: 30rem;
  }
`;

const CreatorPage = () => {
  const { publicationId } = useParams();
  const articleRegistry = useAppSelector(
    (state) => state.articleRegistry // Name is required in the schema
  );

  const [active, setActive] = useState("content");
  const { litClient } = useLit();
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
          litClient,
        })
      );
    };
    f();
  }, [publicationId, publication?.registryId]);
  console.log(`Registry page${JSON.stringify(articleRegistry)}`);

  return (
    <Layout>
      <StyledHeaderContainer>
        <MobileHeader />
        <TitleContainer>
          <Avatar size="xl" src={profile} alt="newsletter profile picture" />
          <Text size="lg" weight="semibold" color="helpText">
            {publication?.name}
          </Text>
        </TitleContainer>
        <a href={checkoutRedirect(publication?.name, publication?.locks)}>
          <StyledButton size="md" color="primary" variant="contained">
            Subscribe
          </StyledButton>
        </a>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ToolbarContainer>
          <PublicToolbar active={active} setActive={setActive} />
        </ToolbarContainer>
        <EntriesContainer>
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
        </EntriesContainer>
      </StyledBodyContainer>
      <MobileNav />
    </Layout>
  );
};

export default CreatorPage;
