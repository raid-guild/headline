import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useWallet } from "@raidguild/quiver";
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

const CreateFormContainer = styled.form`
  max-width: 48rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
      <StyledButton size="xl" onClick={goToPublish}>
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
      <CreateFormContainer onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input
              title="Publication Name"
              errorMsg={errors?.publicationName}
              {...field}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <FormTextArea
              title="Description"
              errorMsg={errors?.publicationName}
              {...field}
            />
          )}
        />
        <StyledButton
          type="submit"
          size="xl"
          color="primary"
          isLoading={publicationLoading}
          loadingText="Creating..."
        >
          Looks good, lets do it
        </StyledButton>
      </CreateFormContainer>
    </>
  );
};

const CreatePublicationPage = () => {
  const dispatch = useAppDispatch();
  const publication = useAppSelector(
    (state) => state.publication.name // Name is required in the schema
  );
  useEffect(() => {
    dispatch(fetchPublication());
    const x = async () => {
      const y = new Blob(["testing string conversion"]);
      const z = await y.text();
      console.log(`TYest ${z}`);
    };
    x();
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
