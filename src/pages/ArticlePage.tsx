import React, { useEffect, useState } from "react";
import { Remirror, useRemirror, useHelpers } from "@remirror/react";
import { useSnackbar } from "notistack";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import MobileHeader from "components/MobileHeader";
import MobileNav from "components/MobileNav";
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
import { remirrorExtensions } from "components/MarkdownEditor";
import Title from "components/Title";
import Text from "components/Text";
import { Layout, BodyContainer, HeaderContainer } from "components/Layout";
import { getKeyAndDecrypt, getClient } from "lib/lit";
import { parseMarkdown } from "lib/markdown";
import usePubImg from "hooks/usePubImg";
import { checkoutRedirect } from "lib/unlock";

const StyledBodyContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 85rem;
  margin-bottom: 4rem;
  & h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1.6rem 0;
  }
  & p {
    margin: 0.8rem 0;
    font-size: 1.8rem;
    line-height: 2.4rem;
    &:nth-child(3) {
      margin-top: 0;
    }
  }
  & img {
    width: 100%;
    object-fit: cover;
  }
  @media (max-width: 990px) {
    margin: 0 2.4rem;
    min-width: 0;
  }
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  max-width: 85rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 990px) {
    grid-area: header;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
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

const StyledGatedModal = styled.div<{ hidden: boolean }>`
  z-index: 1000;
  left: 10%;
  bottom: 5%;
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
  gap: 3.2rem;
  align-items: center;
  justify-content: center;
`;

const Markdown = ({}) => {
  const helpers = useHelpers(true);
  return (
    <>
      <ReactMarkdown>{helpers.getMarkdown()}</ReactMarkdown>
    </>
  );
};

const DecryptedText = ({
  paid,
  decryptedText,
  freeText,
}: {
  paid: boolean;
  decryptedText: string;
  freeText: string;
}) => {
  const { manager } = useRemirror({
    extensions: remirrorExtensions,
    stringHandler: "markdown",
  });

  const txt = !paid || decryptedText;

  return (
    <>
      {(!paid || decryptedText) && (decryptedText || freeText) ? (
        <>
          <Remirror
            autoFocus
            editable={false}
            manager={manager}
            initialContent={JSON.parse(decryptedText || freeText)}
          >
            <Markdown />
          </Remirror>
        </>
      ) : txt ? (
        ""
      ) : (
        "This content is locked"
      )}
    </>
  );
};

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
  const [pubImg] = usePubImg();
  const { enqueueSnackbar } = useSnackbar();
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
      if (!article?.paid && article?.status !== "draft") {
        return;
      }
      const access =
        article?.status === "draft"
          ? publication.draftAccess
          : publication.publishAccess;
      const litClient = await getClient();
      console.log("Decrypting");
      try {
        const txt = await getKeyAndDecrypt(
          "ethereum",
          access.encryptedSymmetricKey,
          access.accessControlConditions,
          article?.text,
          litClient
        );
        console.log("Text");
        console.log(txt);
        setDecryptedText(txt);
      } catch (e) {
        console.error(e);
        enqueueSnackbar("Failed to decrypt text!", { variant: "error" });
      }
    };
    f();
  }, [article?.paid]);

  const freeText =
    !article?.paid && article?.status === "published" ? article?.text : "";

  return (
    <Layout>
      <StyledHeaderContainer>
        <MobileHeader />
        <TitleContainer>
          <Avatar
            size="xl"
            src={pubImg ? URL.createObjectURL(pubImg) : ""}
            alt="newsletter profile picture"
          />
          <Text size="lg" weight="semibold" color="helpText">
            {publication?.name}
          </Text>
        </TitleContainer>
        {!!publication?.locks?.length && (
          <a href={checkoutRedirect(publication?.name, publication?.locks)}>
            <StyledButton size="md" color="primary" variant="contained">
              Subscribe
            </StyledButton>
          </a>
        )}
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ToolbarContainer>
          <PublicToolbar active={active} setActive={setActive} />
        </ToolbarContainer>
        {active === "content" ? (
          <div>
            <DecryptedText
              paid={article?.paid || false}
              decryptedText={decryptedText}
              freeText={freeText}
            />
          </div>
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
      <MobileNav />
    </Layout>
  );
};

export default ArticlePage;
