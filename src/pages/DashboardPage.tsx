import styled from "styled-components";

import React from "react";
import Button from "components/Button";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";

const Layout = styled.div`
  width: 100%;
  height: 100%;
  gap: 0rem 0rem;
  display: grid;
  grid-template:
    "sidebar header" 9.6rem
    "sidebar body" 1fr
    / 40rem 1fr;
`;

const SidebarContainer = styled.div`
  grid-area: sidebar;
`;

const HeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
`;

const BodyContainer = styled.div`
  grid-area: body;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundGrey};
`;

const StyledText = styled(Text)`
  margin-left: 6.4rem;
`;

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

const DashboardPage = () => {
  return (
    <Layout>
      <HeaderContainer>
        <StyledText size="md" weight="semibold" color="helpText">
          Dashboard
        </StyledText>
      </HeaderContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <BodyContainer>
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
              <Button size="xl">Connect wallet</Button>
            </div>
          </BodyButtonContainer>
          <BodyFooterContainer>
            <Text size="base">
              How does web3substack work? Check out our{" "}
              <a
                href="www.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Text as="span" size="base" weight="bold" color="primary">
                  Guide
                </Text>
              </a>
              .
            </Text>
          </BodyFooterContainer>
        </DashboardContainer>
      </BodyContainer>
    </Layout>
  );
};

export default DashboardPage;
