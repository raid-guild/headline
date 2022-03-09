import React, { useCallback } from "react";
import { useWallet } from "@raidguild/quiver";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Button from "components/Button";
import ExternalLink from "components/ExternalLink";
import {
  Layout,
  BodyContainer,
  HeaderContainer,
  HeaderText,
  SidebarContainer,
} from "components/Layout";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";

import { fetchPublication } from "services/publication/slice";
import { fetchBasicProfile } from "services/profile/slice";
import { useAppDispatch, useAppSelector } from "store";

import { useCermaic, CeramicContextType } from "context/CeramicContext";
import { useUnlock } from "context/UnlockContext";
import { CREATE_PUBLICATION_URI } from "../constants";

const DashboardContainer = styled.div`
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

const LoggedOutBody = ({
  connect,
  isConnecting,
}: Pick<CeramicContextType, "connect"> & { isConnecting: boolean }) => {
  return (
    <DashboardContainer>
      <BodyTitleContainer>
        <Title size="md">Your content, your reader.</Title>
        <Text size="md" color="label">
          Writing & sending content right from here.
        </Text>
      </BodyTitleContainer>
      <BodyButtonContainer>
        <Text size="base">
          Please connect your wallet to access the dashboard
        </Text>
        <div>
          <Button
            color="primary"
            variant="contained"
            size="xl"
            onClick={connect}
            isLoading={isConnecting}
            loadingText="Connecting..."
          >
            Connect wallet
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
    </DashboardContainer>
  );
};

const LoggedInContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 3.2rem;
  padding: 6.4rem;
`;

const PublicationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3.2rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
`;

const SubscriptionContainer = styled.div`
  display: flex;
  flex: 2 2 auto;
  flex-direction: column;
`;

const WelcomeContainer = styled.div`
  display: flex;
  max-height: 6.4rem;
  flex: 1 1 6.4rem;
  align-items: center;
`;

const PublicationCopyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
`;

const LearnMoreContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  padding: 4rem;
`;

// in publication container
const LoggedInBody = () => {
  const navigate = useNavigate();
  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );

  const goToCreatePublication = () => {
    navigate(CREATE_PUBLICATION_URI);
  };
  const noPublication = (
    <>
      <PublicationCopyContainer>
        <Text size="md" weight="semibold">
          Your content, your reader.
        </Text>
        <Title size="sm">Start writing on webs3substack</Title>
        <ExternalLink href="www.google.com">
          <Text size="sm" weight="semibold" color="primary">
            Dismiss
          </Text>
        </ExternalLink>
      </PublicationCopyContainer>
      <Button
        color="primary"
        variant="contained"
        size="xl"
        onClick={goToCreatePublication}
      >
        Create my publication
      </Button>
    </>
  );
  const hasPublication = (
    <PublicationCopyContainer>
      <Text size="md" weight="semibold">
        Something very cool is coming here, join us to craft HEADLINE better.
      </Text>
      <ExternalLink href="https://www.google.com">
        <Text size="sm" color="primary" weight="semibold">
          Send feedback
        </Text>
      </ExternalLink>
    </PublicationCopyContainer>
  );

  return (
    <LoggedInContainer>
      <WelcomeContainer>
        <Title size="md">Hello there,</Title>
      </WelcomeContainer>
      <PublicationContainer>
        {Object.keys(publication).length > 0 ? hasPublication : noPublication}
      </PublicationContainer>
      <SubscriptionContainer>
        <LearnMoreContainer>
          <div>
            <Text size="md" weight="semibold">
              Learn more from the pro
            </Text>
            <Title size="sm">Tips for you from the Unlock team</Title>
          </div>
          <Button size="xl" color="primary" variant="contained">
            Subscribe
          </Button>
        </LearnMoreContainer>
      </SubscriptionContainer>
    </LoggedInContainer>
  );
};

const DashboardPage = () => {
  const { connect, did, isCeramicConnecting } = useCermaic();
  const { web3Service } = useUnlock();
  const { connectWallet, isConnecting, provider, address } = useWallet();
  const dispatch = useAppDispatch();

  const connectToServices = useCallback(async () => {
    await connectWallet();
    await connect();

    // fetch key pieces of data
    if (web3Service && provider) {
      dispatch(fetchPublication({ provider, web3Service }));
    }
    dispatch(fetchBasicProfile(address || ""));
  }, [provider]);
  return (
    <Layout>
      <HeaderContainer>
        <HeaderText size="md" weight="semibold" color="helpText">
          Dashboard
        </HeaderText>
      </HeaderContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <BodyContainer background={did ? "almostWhite" : "backgroundGrey"}>
        {did ? (
          <LoggedInBody />
        ) : (
          <LoggedOutBody
            connect={connectToServices}
            isConnecting={isConnecting || isCeramicConnecting}
          />
        )}
      </BodyContainer>
    </Layout>
  );
};

export default DashboardPage;
