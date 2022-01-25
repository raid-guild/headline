import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

import { CREATE_PUBLICATION_URI } from "constants";

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

const PublishPage = () => {
  const navigate = useNavigate();
  const goToCreatePublication = () => {
    navigate(CREATE_PUBLICATION_URI);
  };

  return (
    <Layout>
      <HeaderContainer>
        <HeaderText size="md" weight="semibold" color="helpText">
          Write
        </HeaderText>
      </HeaderContainer>

      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <BodyContainer>
        <PublishContainer>
          <BodyTitleContainer>
            <Title size="md">Publishing your content is easy.</Title>
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
              <Button size="xl" onClick={goToCreatePublication}>
                Create my publication
              </Button>
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
        </PublishContainer>
      </BodyContainer>
    </Layout>
  );
};

export default PublishPage;
