import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useAppDispatch, useAppSelector } from "store";
import {
  fetchArticle,
  articleRegistrySelectors,
} from "services/articleRegistry/slice";
import { fetchLocks, lockSelectors } from "services/lock/slice";
import { fetchPublicationByStream } from "services/publication/slice";

import { useUnlock } from "context/UnlockContext";
import Avatar from "components/Avatar";
import Button from "components/Button";
import PublicToolbar from "components/PublicToolbar";
import { LockCards } from "components/LockCard";
import Title from "components/Title";
import Text from "components/Text";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import profile from "assets/obsidian.png";
import { getKeyAndDecrypt, getClient, addNftAccessControl } from "lib/lit";
import { checkoutRedirect } from "lib/unlock";

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

const StyledGatedModal = styled.div<{ hidden: boolean }>`
  z-index: 1000;
	left: 10%;
	bottom 5%;
	padding: 3.2rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
	position: absolute;
	gap: 1rem;
	display: flex;
	flex-direction: column;
	visibility: ${({ hidden }) => (hidden ? `hidden` : `visible`)};
`;

const CardContainer = styled.div`
  display: flex;
`;

const GatedModal = ({ visible }: { visible: boolean | string }) => {
  const locks = useAppSelector((state) => lockSelectors.paidLocks(state));
  return (
    <StyledGatedModal hidden={!visible}>
      <Title size="md" color="helpText">
        Subscribe to Read
      </Title>
      <CardContainer>
        <LockCards locks={locks} showSubscribe={true} />
      </CardContainer>
    </StyledGatedModal>
  );
};

const ArticlePage = () => {
  const { publicationId, streamId } = useParams();
  const [published, setPublished] = useState(false);
  const [active, setActive] = useState("content");
  const { web3Service } = useUnlock();
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) =>
    articleRegistrySelectors.getArticleByStreamId(state, streamId || "")
  );
  const [decryptedText, setDecryptedText] = useState("");
  const publication = useAppSelector((state) => state.publication);
  console.log(article);
  console.log(published);
  console.log(streamId);
  console.log(publication);
  useEffect(() => {
    if (!web3Service) {
      return;
    }
    dispatch(fetchLocks({ web3Service, publication }));
  }, [publication]);

  useEffect(() => {
    const f = async () => {
      if (!streamId) {
        return;
      }
      await dispatch(
        fetchArticle({
          streamId,
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

  useEffect(() => {
    const f = async () => {
      if (!article?.paid) {
        return;
      }
      const litClient = await getClient();
      console.log("Decrypting");
      const txt = await getKeyAndDecrypt(
        "ethereum",
        publication.publishAccess.encryptedSymmetricKey,
        publication.publishAccess.accessControlConditions,
        article?.text,
        litClient
      );
      console.log("Text");
      console.log(txt);
      setDecryptedText(txt);
    };
    f();
  }, [article?.paid]);

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
        {active === "content" ? (
          <ReactMarkdown>
            {!article?.paid || decryptedText
              ? decryptedText || article?.text
              : "This content is locked"}
          </ReactMarkdown>
        ) : (
          <DescriptionContainer>
            <Title size="sm" color="label">
              Description
            </Title>
            <Text size="base" color="label">
              {publication?.description}
            </Text>
          </DescriptionContainer>
        )}
        <GatedModal
          visible={
            !!article?.paid && !decryptedText && publication?.locks?.length > 0
          }
        />
      </StyledBodyContainer>
    </Layout>
  );
};

export default ArticlePage;
