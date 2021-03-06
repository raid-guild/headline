import React, { useCallback } from "react";
import { useWallet } from "@alexkeating/quiver";
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
  TitleContainer,
} from "components/Layout";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";
import MobileHeader from "components/MobileHeader";
import MobileNav from "components/MobileNav";
import { fetchPublication } from "services/publication/slice";
import { fetchBasicProfile } from "services/profile/slice";
import { networks } from "lib/networks";
import { useAppDispatch, useAppSelector } from "store";
import { useCeramic } from "context/CeramicContext";
import { useUnlock } from "context/UnlockContext";
import { useLit } from "context/LitContext";
import { CREATE_PUBLICATION_URI } from "../constants";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 55rem;
  max-height: 38rem;
  height: 100%;
  width: 100%;
  margin-bottom: 9.6rem;
  /* padding: 6.4rem; */
  @media (max-width: 990px) {
    padding: 2.4rem;
  }
`;

const BodyTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  padding: 0 1.6rem;
  @media (max-width: 990px) {
    padding: 0;
    text-align: center;
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
  padding-top: 4rem;
  padding-bottom: 4rem;
  padding-left: 4rem;
  padding-right: 4rem;
  gap: 4rem;
  @media (max-width: 990px) {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 1.6rem;
    margin-bottom: 1.6rem;
    gap: 4rem;
  }
`;

const BodyTextContainer = styled.div`
  @media (max-width: 990px) {
    padding: 2.4rem 2.4rem 0;
    text-align: center;
  }
`;

const BodyFooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  max-height: 4rem;
  height: 100%;
  margin-top: 4rem;
`;

const LoggedOutBody = ({
  connect,
  isConnecting,
}: {
  connect: () => void;
  isConnecting: boolean;
}) => {
  return (
    <DashboardContainer>
      <BodyTitleContainer>
        <Title size="md">Your Content, Your Community</Title>
        <Text size="md" color="label">
          Publish web content and send out newsletters on HEADLINE
        </Text>
      </BodyTitleContainer>
      <BodyButtonContainer>
        <BodyTextContainer>
          <Text size="base">
            Please connect your wallet to access the dashboard
          </Text>
        </BodyTextContainer>
        <div>
          <StyledButton
            color="primary"
            variant="contained"
            size="xl"
            onClick={connect}
            isLoading={isConnecting}
            loadingText="Connecting..."
          >
            Connect wallet
          </StyledButton>
        </div>
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
    </DashboardContainer>
  );
};

const LoggedInContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 2.4rem;
  padding: 6.4rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const PublicationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3.2rem;
  margin-bottom: 0.8rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  border-radius: 0.8rem;
  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 2.4rem 1.6rem;
  }
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
  margin-bottom: 4.8rem;
  @media (min-width: 768px) {
    margin-bottom: 0;
    gap: 0.8rem;
  }
`;

const LearnMoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3.2rem;
  margin-bottom: 0.8rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 2.4rem 1.6rem;
  }
`;

const LearnMoreCopyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 4.8rem;
  @media (min-width: 720px) {
    margin-bottom: 0;
  }
`;

const StyledButton = styled(Button)`
  /* max-width: 24rem; */
  @media (max-width: 768px) {
    margin-bottom: 1.6rem;
  }
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
          Your Content, Your Community.
        </Text>
        <Title size="sm">Publish web content and send out newsletters.</Title>
      </PublicationCopyContainer>
      <StyledButton
        color="primary"
        variant="contained"
        size="xl"
        onClick={goToCreatePublication}
      >
        Create my publication
      </StyledButton>
    </>
  );
  const hasPublication = (
    <PublicationCopyContainer>
      <Text size="md" weight="semibold">
        Something very cool is coming here, join us to craft HEADLINE better.
      </Text>
      <ExternalLink href="https://airtable.com/shr0fxAjKsDwTRfjd">
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
          <LearnMoreCopyContainer>
            <Text size="md" weight="semibold">
              Learn more from the pro
            </Text>
            <Title size="sm">Tips for you from the Unlock team</Title>
          </LearnMoreCopyContainer>
          <StyledButton
            size="xl"
            color="primary"
            variant="contained"
            onClick={() =>
              window.open("https://unlock-protocol.com/blog", "_blank")
            }
          >
            View blog
          </StyledButton>
        </LearnMoreContainer>
      </SubscriptionContainer>
    </LoggedInContainer>
  );
};

const DashboardPage = () => {
  const { connect, did, isCeramicConnecting } = useCeramic();
  const { web3Service } = useUnlock();
  const { litClient } = useLit();
  const { connectWallet, isConnecting, provider, chainId } = useWallet();
  const dispatch = useAppDispatch();

  const connectToServices = useCallback(async () => {
    const state = await connectWallet();
    if (!state) {
      console.error("Failed to connect wallet");
      return;
    }
    const client = await connect(state.address || "");

    // fetch key pieces of data'
    if (
      web3Service &&
      state?.provider &&
      state?.chainId &&
      client &&
      litClient
    ) {
      await dispatch(
        fetchPublication({
          provider: state.provider,
          web3Service,
          client,
          chainName: networks[state.chainId].litName,
          litClient,
        })
      );
    }
    if (state?.address) {
      await dispatch(fetchBasicProfile(state?.address));
    }
  }, [chainId, web3Service, provider, litClient]);
  return (
    <Layout>
      <HeaderContainer>
        <MobileHeader />
        <TitleContainer>
          <HeaderText size="md" weight="semibold" color="helpText">
            Dashboard
          </HeaderText>
        </TitleContainer>
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
      <MobileNav />
    </Layout>
  );
};

export default DashboardPage;
