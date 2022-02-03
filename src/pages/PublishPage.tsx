import React, { useEffect } from "react";
import { useToolbarState, Toolbar, ToolbarItem } from "reakit/Toolbar";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { fetchPublication } from "services/publication/slice";
import Button from "components/Button";
import { Button as RButton } from "reakit/Button";
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
            <Button size="xl" onClick={goToCreatePublication}>
              Create my publication
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
`;

const EntriesContainer = styled.div`
  display: flex;
  height: 100%;
`;

const PublishBody = () => {
  const toolbar = useToolbarState();
  const navigate = useNavigate();
  const goToWritingPage = () => {
    navigate(WRITING_URI);
  };

  return (
    <StyledBodyContainer>
      <ToolbarContainer>
        <Toolbar {...toolbar} aria-label="publish subnav">
          <ToolbarItem {...toolbar} as={RButton}>
            Here
          </ToolbarItem>
          <ToolbarItem {...toolbar} as={RButton}>
            Stats
          </ToolbarItem>
          <ToolbarItem {...toolbar} as={RButton}>
            Membership
          </ToolbarItem>
          <ToolbarItem {...toolbar} as={RButton}>
            Settings
          </ToolbarItem>
        </Toolbar>
      </ToolbarContainer>
      <EntriesHeader>
        <Text size="md" color="label">
          Entries
        </Text>
        <Button size="lg" color="primary" onClick={goToWritingPage}>
          Write a Post
        </Button>
      </EntriesHeader>
      <EntriesContainer></EntriesContainer>
    </StyledBodyContainer>
  );
};

// If there is a publication show
// If not then show writing view
const PublishPage = () => {
  const dispatch = useAppDispatch();

  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );
  console.log("publication");
  console.log(publication);
  useEffect(() => {
    dispatch(fetchPublication());
  }, []);

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
