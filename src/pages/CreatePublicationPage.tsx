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

import Button from "components/Button";
import BackButton from "components/BackButton";
import Icon from "components/Icon";
import Input from "components/Input";
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
`;

const BodyHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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
  const publicationLoading = useAppSelector(
    (state) => state.createPublication.loading
  );
  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    if (!chainId) {
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
        chainName: networks[chainId]?.litName,
      })
    );
  }, []);

  return (
    <>
      <BodyHeaderContainer>
        <Title size="md" color="label">
          Start writing & publishing
        </Title>
        <Text size="md" color="label">
          Create the publication that is truly owned by you
        </Text>
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
  const { provider } = useWallet();
  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );
  useEffect(() => {
    if (provider && web3Service) {
      dispatch(fetchPublication({ provider, web3Service }));
    }
  }, []);

  return (
    <StyledLayout>
      <StyledHeaderContainer>
        <LeftHeaderContainer>
          <BackButton size="md" />
          <Icon size="xl" src={small_logo} alt="Unlock logo" />
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
    </StyledLayout>
  );
};

export default CreatePublicationPage;
