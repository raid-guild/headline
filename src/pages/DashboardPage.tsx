import styled from "styled-components";

import React from "react";
import Button from "components/Button";
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

import { useCermaic, CeramicContextType } from "context/CeramicContext";

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
}: Pick<CeramicContextType, "connect" | "isConnecting">) => {
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
          <a href="www.google.com" target="_blank" rel="noopener noreferrer">
            <Text as="span" size="base" weight="bold" color="primary">
              Guide
            </Text>
          </a>
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

  padding: 6.4rem;
`;

const PublicationContainer = styled.div`
  display: flex;
  flex: 2 2 auto;
  align-items: center;
  justify-content: space-between;
  padding: 4rem;
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

const SubscriptionContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 4rem;
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
  return (
    <LoggedInContainer>
      <WelcomeContainer>
        <Title size="md">Welcome</Title>
      </WelcomeContainer>
      <PublicationContainer>
        <PublicationCopyContainer>
          <Text size="md" weight="semibold">
            Your content, your reader.
          </Text>
          <Title size="sm">Start writing on webs3substack</Title>
          <a href="www.google.com" target="_blank" rel="noopener noreferrer">
            <Text size="sm" weight="semibold" color="primary">
              Dismiss
            </Text>
          </a>
        </PublicationCopyContainer>
        <Button size="xl">Create my publication</Button>
      </PublicationContainer>
      <SubscriptionContainer>
        <SubscriptionContentContainer>
          <Text size="md" color="helpText" weight="semibold">
            You have no subscriptions yet
          </Text>
          <Text size="sm" color="helpText">
            Subscribe now
          </Text>
          <a href="www.google.com" target="_blank" rel="noopener noreferrer">
            <Text size="sm" weight="semibold" color="primary">
              Discover now
            </Text>
          </a>
        </SubscriptionContentContainer>
        <LearnMoreContainer>
          <div>
            <Text size="md" weight="semibold">
              Learn more from the pro
            </Text>
            <Title size="sm">Tips for you from the Unlock team</Title>
          </div>
          <Button size="xl">Subscribe</Button>
        </LearnMoreContainer>
      </SubscriptionContainer>
    </LoggedInContainer>
  );
};

// Add first time view for dashboard
// Fetch first time
// Build first time view
// Add loading to button

const DashboardPage = () => {
  const { connect, did, isConnecting } = useCermaic();
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
          <LoggedOutBody connect={connect} isConnecting={isConnecting} />
        )}
      </BodyContainer>
    </Layout>
  );
};

export default DashboardPage;
