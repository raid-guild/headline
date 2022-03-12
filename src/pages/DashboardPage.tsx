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
import MobileNav from "components/MobileNav";
import MobileHeader from "components/MobileHeader";
import { fetchPublication } from "services/publication/slice";
import { fetchBasicProfile } from "services/profile/slice";
import { networks } from "lib/networks";
import { useAppDispatch, useAppSelector } from "store";

import { useCermaic, CeramicContextType } from "context/CeramicContext";
import { useUnlock } from "context/UnlockContext";
import { CREATE_PUBLICATION_URI } from "../constants";

const MobileHeaderContainer = styled(HeaderContainer)`
  display: none;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 2.4rem;
    max-width: 100%;
    border-bottom: 1px solid;
    border-color: ${({ theme }) => theme.colors.mediumGrey};
  }
`;

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 44.5rem;
  max-height: 38rem;
  height: 100%;
  width: 100%;
  margin-bottom: 9.6rem;
  padding: 6.4rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const BodyTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  @media (max-width: 768px) {
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
  gap: 4rem;
  padding: 4rem;
  border: 1px solid #f0efef;
  @media (max-width: 768px) {
    padding: 2.4rem;
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
  gap: 2.4rem;
  padding: 6.4rem;
  @media (max-width: 768px) {
    padding: 2.4rem;
  }
`;

const LoggedOutContainer = styled.div`
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

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 720px) {
    width: 100%;
    padding: 2.4rem 2.4rem 1.6rem;
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
  @media (min-width: 720px) {
    margin-bottom: 0;
    gap: 0.8rem;
  }
`;

// const LearnMoreContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   justify-content: space-between;
//   background: ${({ theme }) => theme.colors.backgroundGrey};
//   margin-bottom: 4.8rem;
//   padding: 2.4rem;
//   @media (min-width: 720px) {
//     flex-direction: row;
//     padding: 4rem;
//     margin-bottom: 0;
//   }
// `;

const LogoContainer = styled.div`
  direction: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: 1.2rem 0rem;
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
  min-width: 295px;
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
          <LearnMoreCopyContainer>
            <Text size="md" weight="semibold">
              Learn more from the pro
            </Text>
            <Title size="sm">Tips for you from the Unlock team</Title>
          </LearnMoreCopyContainer>
          <StyledButton size="xl" color="primary" variant="contained">
            Subscribe
          </StyledButton>
        </LearnMoreContainer>
      </SubscriptionContainer>
    </LoggedInContainer>
  );
};

const DashboardPage = () => {
  const { connect, did, isCeramicConnecting } = useCermaic();
  const { web3Service } = useUnlock();
  const { connectWallet, isConnecting, provider, address, chainId } =
    useWallet();
  const dispatch = useAppDispatch();

  const connectToServices = useCallback(async () => {
    await connectWallet();
    await connect();

    // fetch key pieces of data
    if (web3Service && provider && chainId) {
      dispatch(
        fetchPublication({
          provider,
          web3Service,

          chainName: networks[chainId].litName,
        })
      );
    }
    dispatch(fetchBasicProfile(address || ""));
  }, [provider]);
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
