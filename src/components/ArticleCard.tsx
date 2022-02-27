import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import { Article } from "services/article/slice";
import Text from "components/Text";
import Title from "components/Title";

const Container = styled.div`
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  padding: 2.4rem;
  display: flex;
  gap: 2.4rem;
`;

const MissingImg = styled.div`
  min-width: 18rem;
  height: 16rem;
  background: grey;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

// TODO: Renders markdown, but should preview a description of the
// text
const ArticleCard = ({ article }: { article: Article }) => {
  const date = new Date(article.createdAt);
  return (
    <Link key={article.streamId} to={`/publish/write/${article.streamId}`}>
      <Container>
        <MissingImg />
        <DetailsContainer>
          <Title size="md">{article.title}</Title>
          <Text size="md">
            <ReactMarkdown>{article.text}</ReactMarkdown>
          </Text>
          <Text size="md">{`${date.toDateString()}`}</Text>
        </DetailsContainer>
      </Container>
    </Link>
  );
};

export default ArticleCard;
