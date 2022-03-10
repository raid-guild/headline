import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

import { Article } from "services/article/slice";
import Text from "components/Text";
import Title from "components/Title";
import { fetchIPFS } from "lib/ipfs";

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

const ArticleCard = ({ article }: { article: Article }) => {
  const date = new Date(article.createdAt);
  const [previewImg, setPreviewImg] = useState("");
  useEffect(() => {
    const x = async () => {
      if (article?.previewImg) {
        const b = await fetchIPFS(article.previewImg);
        if (b) {
          setPreviewImg(URL.createObjectURL(b));
        }
      }
    };
    x();
  }, [article?.previewImg]);

  return (
    <Link key={article.streamId} to={`/publish/write/${article.streamId}`}>
      <Container>
        {article?.previewImg ? (
          <img
            style={{ height: "16rem", objectFit: "contain", width: "18rem" }}
            src={previewImg}
          />
        ) : (
          <MissingImg />
        )}
        <DetailsContainer>
          <Title size="md">{article.title}</Title>
          <Text size="md">{article?.description || "None"}</Text>
          <Text size="md">{`${date.toDateString()}`}</Text>
        </DetailsContainer>
      </Container>
    </Link>
  );
};

export default ArticleCard;
