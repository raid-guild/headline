import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@raidguild/quiver";
import { useToolbarState, Toolbar } from "reakit/Toolbar";
import { useNavigate, useParams, Link } from "react-router-dom";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

import lock_example from "assets/lock_example.svg";
import checkmark from "assets/checkmark.svg";
import { useUnlock } from "context/UnlockContext";
import { CardContainer, ArticleEntries } from "components/ArticleCard";
import Button from "components/Button";
import { Dialog, DialogContainer } from "components/Dialog";
import ExternalLink from "components/ExternalLink";
import EmailSettings from "components/EmailSettings";
import { LockCards, LockData } from "components/LockCard";
import LockVerificationForm from "components/LockVerificationForm";
import PublicationSettings from "components/PublicationSettings";
import {
  Layout,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  SidebarContainer,
} from "components/Layout";
import ToolbarItem from "components/ToolbarItem";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";
import { fetchArticleRegistry } from "services/articleRegistry/slice";
import { Article } from "services/article/slice";
import { verifyLock, lockSelectors } from "services/lock/slice";
import { networks } from "lib/networks";

import { useAppDispatch, useAppSelector } from "store";
import { CREATE_PUBLICATION_URI, WRITING_URI } from "../constants";

const PublishContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 44.5rem;
  max-height: 38rem;
  height: 100%;
  width: 100%;
  margin-bottom: 9.6rem;
`;

const BodyTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BodyButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background: ${({ theme }) => theme.colors.almostWhite};
  max-height: 20rem;
  height: 100%;
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
            Publishing your content is easy.
          </Title>
          <Text size="md" color="label">
            Engage your community & fans.
          </Text>
        </BodyTitleContainer>
        <BodyButtonContainer>
          <Text size="base">
            Write as a blog or send it out as a newsletter, Websubstack covers
            all.
          </Text>
          <div>
            <Button
              size="xl"
              color="primary"
              variant="contained"
              onClick={goToCreatePublication}
            >
              Create my publication
            </Button>
          </div>
        </BodyButtonContainer>
        <BodyFooterContainer>
          <Text size="base">
            How does web3substack work? Check out our{" "}
            <ExternalLink href="www.google.com">
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
`;

const StyledBodyContainer = styled(BodyContainer)`
  justify-content: flex-start;
  flex-direction: column;
  display: flex;
  align-items: flex-start;
  margin-right: 6.4rem;
  margin-left: 4.4rem;
`;

const EntriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 2.5rem;
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const EmtptyCardContainer = styled.div`
  padding: 4rem;
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  gap: 1.6rem;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EmtptyEntriesMessage = () => {
  return (
    <EmtptyCardContainer>
      <Text size="base" color="helpText" weight="semibold">
        You havent written any posts yet
      </Text>
      <Link to="/publish/write">
        <Text size="sm" color="primary" weight="semibold">
          Write a new post
        </Text>
      </Link>
    </EmtptyCardContainer>
  );
};

const EmtptyLocksMessage = () => {
  return (
    <EmtptyCardContainer>
      <Text size="base" color="helpText" weight="semibold">
        You havent written any posts yet
      </Text>
      <Text size="sm" color="helpText">
        Create different membership options for your readers
      </Text>
      <Link to="/publish/write">
        <Text size="sm" color="primary" weight="semibold">
          Create Now
        </Text>
      </Link>
    </EmtptyCardContainer>
  );
};

const Articles = () => {
  const articleRegistry = useAppSelector(
    (state) => state.articleRegistry // Name is required in the schema
  );
  const navigate = useNavigate();
  const goToWritingPage = () => {
    navigate(WRITING_URI);
  };
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
          onClick={goToWritingPage}
        >
          Write a Post
        </Button>
      </EntriesHeader>
      <CardContainer>
        {Object.keys(articleRegistry).length ? (
          <ArticleEntries articleRegistry={articleRegistry} />
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
  const { provider } = useWallet();
  const [submitted, setSubmitted] = useState(false);
  const [lockAddress, setLockAddress] = useState("");
  const [hideModal, setHideModal] = useState(false);

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
  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    if (web3Service && provider) {
      dispatch(
        verifyLock({
          address: data.lockAddress,
          chainId: data.lockChain,
          web3Service,
          provider,
        })
      );
      setSubmitted(true);
      setLockAddress(data.lockAddress);
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
            {(!verifyLoading && submitted ? successModal : verificationModal)()}
          </DialogContainer>
        </Dialog>
      </EntriesHeader>
      <CardContainer style={{ flexDirection: "row" }}>
        {Object.values(locks || {}).length ? (
          <LockCards locks={locks} />
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
  padding: 3.2rem;
  max-width: 90rem;
`;

const PublishBody = () => {
  const dispatch = useAppDispatch();
  const { chainId } = useWallet();
  const toolbar = useToolbarState();
  const params = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState("content");

  useEffect(() => {
    setActive(params.menu || "content");
  }, [params.menu]);

  // fetch registry display top 5
  useEffect(() => {
    if (!chainId) {
      return;
    }
    dispatch(fetchArticleRegistry({ chainName: networks[chainId]?.litName }));
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
        <HeaderText size="md" weight="semibold" color="helpText">
          {publication ? publication : "Write"}
        </HeaderText>
      </HeaderContainer>

      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      {publication ? <PublishBody /> : <CreatePublicationView />}
    </Layout>
  );
};
export default PublishPage;
