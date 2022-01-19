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

const LoggedOutBody = ({ connect }: Pick<CeramicContextType, "connect">) => {
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
          <Button size="xl" onClick={connect}>
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

const DashboardPage = () => {
  const { connect, did } = useCermaic();
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
      <BodyContainer>
        {did ? <p>hi</p> : <LoggedOutBody connect={connect} />}
      </BodyContainer>
    </Layout>
  );
};

export default DashboardPage;
