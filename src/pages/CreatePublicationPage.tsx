import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useWallet } from "@raidguild/quiver";
import { useUnlock } from "context/UnlockContext";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store";
import {
  createPublication,
  fetchPublication,
} from "services/publication/slice";

import { useCeramic } from "context/CeramicContext";
import { useLit } from "context/LitContext";
import Button from "components/Button";
import BackButton from "components/BackButton";
import Icon from "components/Icon";
import Input from "components/Input";
import MobileNav from "components/MobileNav";
import { Layout, HeaderContainer, BodyContainer } from "components/Layout";
import PublicationForm from "components/PublicationForm";
import Title from "components/Title";
import Text from "components/Text";
import FormTextArea from "components/FormTextArea";
import { networks } from "lib/networks";

import small_logo from "assets/small_logo.svg";
import celebrateIcon from "assets/celebrate.svg";

const StyledLayout = styled(Layout)`
  grid-template:
    "header" 9.6rem
    "body" 1fr
    / 1fr;
`;
const StyledBodyContainer = styled(BodyContainer)`
  align-items: flex-start;
  @media (max-width: 768px) {
    padding: 0 2.4rem;
  }
`;

const StyledTitle = styled(Title)`
  @media (max-width: 768px) {
    font-size: 2.8rem;
    font-weight: 600;
    line-height: 3.2rem;
    text-align: center;
    padding: 0 2.4rem 0.8rem;
  }
`;

const StyledText = styled(Text)`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const WritingActionsContainer = styled.div`
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
  }
`;

const StyledHeaderContainer = styled(HeaderContainer)`
  border-bottom: ${({ theme }) => `0.1rem solid ${theme.colors.lightGrey}`};
`;

const StyledIcon = styled(Icon)`
  height: 8rem;
`;

const ContentContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  max-width: 48rem;
  width: 100%;
  height: 100%;
  max-height: 40rem;
  justify-content: space-evenly;
`;

const LeftHeaderContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: 6rem;
  align-items: center;
  @media (max-width: 768px) {
    align-items: flex-start;
    margin-left: 2.4rem;
  }
`;

const BodyHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  @media (max-width: 768px) {
    margin-top: 3.2rem;
    margin-bottom: 4rem;
    padding: 0 2.4rem;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const SuccessfullyCreatedPublication = ({ name }: { name: string }) => {
  const navigate = useNavigate();
  const goToPublish = () => {
    navigate("/publish");
  };
  return (
    <>
      <BodyHeaderContainer>
        <Title size="md" color="label">
          You are all set!
        </Title>
        <Text size="md" color="label">
          The {name} was successfully created.
        </Text>
      </BodyHeaderContainer>
      <WritingActionsContainer>
        <StyledIcon size="xl" src={celebrateIcon} alt="A celebration icon" />
        <StyledButton
          color="primary"
          variant="contained"
          size="xl"
          onClick={goToPublish}
        >
          Start Writing
        </StyledButton>
        <Link to={"/dashboard"}>
          <Text size="md" color="primary">
            Return to dashboard
          </Text>
        </Link>
      </WritingActionsContainer>
    </>
  );
};

const CreatePublicationForm = () => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const dispatch = useAppDispatch();
  const { address, chainId } = useWallet();
  const { client } = useCeramic();
  const publicationLoading = useAppSelector(
    (state) => state.createPublication.loading
  );
  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    if (!chainId || !client) {
      console.error("Chain Id is falsey");
      return;
    }
    dispatch(
      createPublication({
        publication: {
          name: data.name || "",
          description: data.description || "",
        },
        address: address || "",
        client,
        chainName: networks[chainId]?.litName,
      })
    );
  }, []);

  return (
    <>
      <BodyHeaderContainer>
        <StyledTitle size="md" color="label">
          Start writing & publishing
        </StyledTitle>
        <StyledText size="md" color="label">
          Create the publication that is truly owned by you
        </StyledText>
      </BodyHeaderContainer>
      <PublicationForm onSubmit={onSubmit}>
        <StyledButton
          type="submit"
          size="xl"
          color="primary"
          variant="contained"
          isLoading={publicationLoading}
          loadingText="Creating..."
        >
          Looks good, lets do it
        </StyledButton>
      </PublicationForm>
    </>
  );
};

const CreatePublicationPage = () => {
  const dispatch = useAppDispatch();
  const { web3Service } = useUnlock();
  const { client } = useCeramic();
  const { provider, chainId } = useWallet();
  const { litClient } = useLit();
  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );
  useEffect(() => {
    if (provider && web3Service && chainId && client) {
      dispatch(
        fetchPublication({
          provider,
          web3Service,
          client,
          chainName: networks[chainId].litName,
          litClient,
        })
      );
    }
  }, []);

  return (
    <StyledLayout>
      <StyledHeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" />
          {/* <Icon size="xl" src={small_logo} alt="Unlock logo" /> */}
          <Text size="md" weight="semibold" color="helpText">
            Create Publication
          </Text>
        </LeftHeaderContainer>
      </StyledHeaderContainer>
      <StyledBodyContainer>
        <ContentContainer>
          {publication ? (
            <SuccessfullyCreatedPublication name={publication} />
          ) : (
            <CreatePublicationForm />
          )}
        </ContentContainer>
      </StyledBodyContainer>
      <MobileNav />
    </StyledLayout>
  );
};

export default CreatePublicationPage;
