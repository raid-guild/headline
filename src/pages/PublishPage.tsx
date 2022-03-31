import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@alexkeating/quiver";
import { useToolbarState, Toolbar } from "reakit/Toolbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

import lock_example from "assets/lock_example.svg";
import checkmark from "assets/checkmark.svg";
import { useCeramic } from "context/CeramicContext";
import { useLit } from "context/LitContext";
import { useUnlock } from "context/UnlockContext";
import { CardContainer, ArticleEntries } from "components/ArticleCard";
import Button from "components/Button";
import { Dialog, DialogContainer } from "components/Dialog";
import ExternalLink from "components/ExternalLink";
import EmailSettings from "components/EmailSettings";
import { LockCards, LockData } from "components/LockCard";
import MobileHeader from "components/MobileHeader";
import MobileNav from "components/MobileNav";
import LockVerificationForm from "components/LockVerificationForm";
import PublicationSettings from "components/PublicationSettings";
import {
  Layout,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  SidebarContainer,
  TitleContainer,
} from "components/Layout";
import ToolbarItem from "components/ToolbarItem";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";
import { createArticle } from "services/article/slice";
import {
  fetchArticleRegistry,
  articleRegistrySelectors,
} from "services/articleRegistry/slice";
import { verifyLock, lockSelectors } from "services/lock/slice";
import { networks } from "lib/networks";

import { useAppDispatch, useAppSelector } from "store";
import { CREATE_PUBLICATION_URI } from "../constants";

const PublishContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 44.5rem;
  max-height: 38rem;
  height: 100%;
  width: 100%;
  margin-bottom: 9.6rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const BodyTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const BodyTextContainer = styled.div`
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const BodyButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background: ${({ theme }) => theme.colors.almostWhite};
  max-height: 20rem;
  height: 100%;
  border-radius: 8px;
  margin-top: 4rem;
  border: 1px solid #f0efef;
  @media (max-width: 768px) {
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
  }
`;

const StyledButton = styled(Button)`
  min-width: 295px;
`;

const BodyFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  max-height: 4rem;
  height: 100%;
`;

const CreatePublicationView = () => {
  const navigate = useNavigate();
  const goToCreatePublication = () => {
    navigate(CREATE_PUBLICATION_URI);
  };

  return (
    <BodyContainer>
      <PublishContainer>
        <BodyTitleContainer>
          <Title size="md" color="label">
            Your Content, Your Community
          </Title>
          <Text size="md" color="label">
            Publish web content and send out newsletters on HEADLINE.
          </Text>
        </BodyTitleContainer>
        <BodyButtonContainer>
          <BodyTextContainer>
            <Text size="base">
              HEADLINE is a decentralized publishing platform where a creator’s
              content is always their own. There’s no service fee, no long form
              privacy agreement and your unpublished and token gated content is
              encrypted, enabling access control.
            </Text>
          </BodyTextContainer>
          <StyledButton
            size="xl"
            color="primary"
            variant="contained"
            onClick={goToCreatePublication}
          >
            Create my publication
          </StyledButton>
        </BodyButtonContainer>
        <BodyFooterContainer>
          <Text size="base">
            How does HEADLINE work? Check out our{" "}
            <ExternalLink href="https://docs.viaheadline.xyz/">
              <Text as="span" size="base" weight="bold" color="primary">
                Guide
              </Text>
            </ExternalLink>
            .
          </Text>
        </BodyFooterContainer>
      </PublishContainer>
    </BodyContainer>
  );
};

const ToolbarContainer = styled.div`
  height: 7.2rem;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledBodyContainer = styled(BodyContainer)`
  justify-content: flex-start;
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  margin-right: 6.4rem;
  margin-left: 4.4rem;
  @media (max-width: 768px) {
    margin: 0 2.4rem;
  }
`;

const EntriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2.5rem;
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  @media (max-width: 768px) {
    min-height: 30rem;
  }
`;

const EmptyCardContainer = styled.div`
  padding: 4rem;
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  gap: 1.6rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0.8rem;
  @media (max-width: 990px) {
    gap: 2.4rem;
    padding: 2.4rem 1.6rem;
  }
`;

const EmtptyEntriesMessage = () => {
  return (
    <EmptyCardContainer>
      <Text size="base" color="helpText" weight="semibold">
        You haven&apos;t written any posts yet
      </Text>
    </EmptyCardContainer>
  );
};

const EmtptyLocksMessage = () => {
  return (
    <EmptyCardContainer>
      <Text size="base" color="helpText" weight="semibold">
        You haven’t created any membership tiers yet.
      </Text>
      <Text size="sm" color="helpText">
        Create different membership options for your readers
      </Text>
    </EmptyCardContainer>
  );
};

const Articles = () => {
  const articleRegistry = useAppSelector(
    (state) => articleRegistrySelectors.getSortedCreate(state) // Name is required in the schema
  );
  const articleCreating = useAppSelector(
    (state) => state.createArticle.loading // Name is required in the schema
  );
  const dispatch = useAppDispatch();
  const { chainId } = useWallet();
  const { client } = useCeramic();
  const { litClient } = useLit();
  const navigate = useNavigate();
  const createAndRedirect = useCallback(async () => {
    if (!chainId || !client) {
      return;
    }
    const createdArticle = await dispatch(
      createArticle({
        article: {
          title: "Untitled",
          text: "",
          createdAt: new Date().toISOString(),
          status: "draft",
        },
        client,
        encrypt: true,
        litClient,
        chainName: networks[chainId].litName,
      })
    );
    if (
      createdArticle &&
      createdArticle.payload &&
      "streamId" in createdArticle.payload
    ) {
      navigate(`/publish/write/${createdArticle.payload.streamId}`);
    }
  }, [chainId]);

  return (
    <EntriesContainer>
      <EntriesHeader>
        <Text size="md" color="label" weight="semibold">
          Entries
        </Text>
        <Button
          size="lg"
          color="primary"
          variant="contained"
          onClick={createAndRedirect}
          isLoading={articleCreating}
          loadingText="Creating..."
        >
          Write a Post
        </Button>
      </EntriesHeader>
      <CardContainer>
        {Object.keys(articleRegistry).length ? (
          <ArticleEntries
            articleRegistry={articleRegistry}
            publicationId={null}
          />
        ) : (
          <EmtptyEntriesMessage />
        )}
      </CardContainer>
    </EntriesContainer>
  );
};

const SuccessMsgContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const SuccessCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const Locks = () => {
  const dispatch = useAppDispatch();
  const { provider, address } = useWallet();
  const { client } = useCeramic();
  const [submitted, setSubmitted] = useState(false);
  const [lockAddress, setLockAddress] = useState("");
  const [hideModal, setHideModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const verifyLoading = useAppSelector((state) => state.verifyLock.loading);
  const updatePublicationLoading = useAppSelector(
    (state) => state.updatePublication.loading
  );
  const verifyError = useAppSelector((state) => state.verifyLock.error);

  const lock = useAppSelector((state) =>
    lockSelectors.getLockByAddress(state, lockAddress)
  );

  const locks = useAppSelector((state) => lockSelectors.listLocks(state));
  const { web3Service } = useUnlock();
  const { litClient } = useLit();
  const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
    if (web3Service && provider && client) {
      const newLock = await dispatch(
        verifyLock({
          address: data.lockAddress,
          chainId: data.lockChain,
          web3Service,
          provider,
          client,
          litClient,
          ownerAddress: address || "",
        })
      );

      if (newLock?.meta?.requestStatus === "rejected") {
        enqueueSnackbar(newLock?.payload, { variant: "error" });
        return;
      }
      if (newLock !== undefined) {
        console.log(newLock);
        console.log("Submitted");
        enqueueSnackbar("Added!", { variant: "success" });
        setSubmitted(true);
        setLockAddress(data.lockAddress);
      }
    }
  }, []);

  const verificationModal = () => {
    return (
      <>
        <Text size="base" color="label">
          We are powered by Unlock Protocol, please head over to the{" "}
          <ExternalLink href="https://app.unlock-protocol.com/dashboard">
            <Text as="span" size="base" color="primary" weight="semibold">
              dashboard
            </Text>
          </ExternalLink>{" "}
          & create a membership first.
        </Text>
        <img
          src={lock_example}
          alt="tutorial on how to create a lock in Unlock"
        />
        <LockVerificationForm onSubmit={onSubmit}>
          {verifyError && (
            <Text size="sm" color="success">
              {verifyError}
            </Text>
          )}
          <Button
            type="submit"
            size="lg"
            color="primary"
            variant="contained"
            isLoading={verifyLoading || updatePublicationLoading}
            loadingText="Verifying..."
          >
            Submit
          </Button>
        </LockVerificationForm>
      </>
    );
  };

  const successModal = useCallback(() => {
    console.log("Lock");
    console.log(lock);
    return (
      <>
        <SuccessMsgContainer>
          <img src={checkmark} alt="success checkmark" />
          <Text size="base" color="label">
            Membership key has been successfully imported
          </Text>
        </SuccessMsgContainer>
        <SuccessCardContainer>
          <LockData lock={lock} />
        </SuccessCardContainer>
        <Button
          size="lg"
          color="success"
          variant="contained"
          onClick={() => setHideModal(true)}
        >
          All Done
        </Button>
      </>
    );
  }, [lock]);

  return (
    <EntriesContainer>
      <EntriesHeader>
        <Text size="md" color="label" weight="semibold">
          Membership Options
        </Text>
        <Dialog
          baseId="lock-verification"
          backdrop={true}
          hideOnEsc={true}
          hideOnClickOutside={true}
          hideModal={hideModal}
          disclosure={
            <Button
              size="lg"
              color="primary"
              variant="contained"
              onClick={() => {
                setHideModal(false);
                setSubmitted(false);
              }}
            >
              Create
            </Button>
          }
        >
          <DialogContainer>
            <Text size="base" color="helpText">
              Create membership
            </Text>
            {(!verifyLoading && submitted && lock
              ? successModal
              : verificationModal)()}
          </DialogContainer>
        </Dialog>
      </EntriesHeader>
      <CardContainer style={{ flexDirection: "row" }}>
        {Object.values(locks || {}).length ? (
          <LockCards locks={locks} showSubscribe={false} />
        ) : (
          <EmtptyLocksMessage />
        )}
      </CardContainer>
    </EntriesContainer>
  );
};

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  width: 100%;
  height: 100%;
  padding: 3.2rem 0 0;
  max-width: 90rem;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const PublishBody = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useWallet();
  const { litClient } = useLit();
  const { did } = useCeramic();
  const toolbar = useToolbarState();
  const params = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("content");

  useEffect(() => {
    setActive(params.menu || "content");
  }, [params.menu]);

  // fetch registry display top 5
  useEffect(() => {
    if (!chainId || !did) {
      return;
    }
    dispatch(
      fetchArticleRegistry({
        chainName: networks[chainId]?.litName,
        litClient,
        did: did.id,
      })
    );
  }, []);

  const handleClick = useCallback(
    (toolItem) => {
      if (params.menu !== toolItem) {
        navigate(`/publish/${toolItem}`);
      }
    },
    [params.menu]
  );

  const selectBody = () => {
    switch (active) {
      case "content":
        return <Articles />;
      case "membership":
        return <Locks />;
      case "settings":
        return (
          <SettingsContainer>
            <PublicationSettings />
            <EmailSettings />
          </SettingsContainer>
        );
      default:
        return <Articles />;
    }
  };

  return (
    <StyledBodyContainer>
      <ToolbarContainer>
        <Toolbar {...toolbar} aria-label="publish subnav">
          <ToolbarItem
            {...toolbar}
            onClick={() => handleClick("content")}
            active={active === "content" || !active}
          >
            <Text size="base">Content</Text>
          </ToolbarItem>
          <ToolbarItem
            {...toolbar}
            onClick={() => handleClick("membership")}
            active={active === "membership"}
          >
            <Text size="base">Membership</Text>
          </ToolbarItem>
          <ToolbarItem
            {...toolbar}
            onClick={() => handleClick("settings")}
            active={active === "settings"}
          >
            <Text size="base">Settings</Text>
          </ToolbarItem>
        </Toolbar>
      </ToolbarContainer>
      {selectBody()}
    </StyledBodyContainer>
  );
};

// If there is a publication show
// If not then show writing view
const PublishPage = () => {
  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );

  return (
    <Layout>
      <HeaderContainer>
        <MobileHeader />
        <TitleContainer>
          <HeaderText size="md" weight="semibold" color="helpText">
            {publication ? publication : "Write"}
          </HeaderText>
        </TitleContainer>
      </HeaderContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      {publication ? <PublishBody /> : <CreatePublicationView />}
      <MobileNav />
    </Layout>
  );
};
export default PublishPage;
