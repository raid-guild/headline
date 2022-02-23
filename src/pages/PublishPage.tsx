import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@raidguild/quiver";
import { useToolbarState, Toolbar } from "reakit/Toolbar";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { fetchPublication } from "services/publication/slice";
import { fetchArticleRegistry } from "services/articleRegistry/slice";
import ArticleCard from "components/ArticleCard";
import Button from "components/Button";
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
import { Article } from "services/article/slice";
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
  margin-top: 2.5rem;
`;

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const CardContainer = styled.div`
  margin-top: 1.6rem;
  gap: 1.2rem;
  display: flex;
  flex-direction: column;
`;

const EmtptyEntriesMessage = () => {
  return (
    <div>
      <Text size="base" color="helpText">
        You havent written any posts yet
      </Text>
    </div>
  );
};

const ArticleEntries = ({
  articleRegistry,
}: {
  articleRegistry: { [key: string]: Article };
}) => {
  return (
    <>
      {Object.values(articleRegistry).map((value) => {
        return <ArticleCard key={value.streamId} article={value} />;
      })}
    </>
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
        <Text size="md" color="label">
          Entries
        </Text>
        <Button size="lg" color="primary" onClick={goToWritingPage}>
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
      case "settings":
        return <PublicationSettings />;
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
