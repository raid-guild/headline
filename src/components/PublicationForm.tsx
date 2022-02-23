import React, { ReactNode, useEffect } from "react";
import { useWallet } from "@raidguild/quiver";
import styled from "styled-components";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import Input from "components/Input";
import FormTextArea from "components/FormTextArea";
import { useAppDispatch, useAppSelector } from "store";
import { fetchArticleRegistry } from "services/articleRegistry/slice";
import { networks } from "lib/networks";

type Props = {
  onSubmit: SubmitHandler<FieldValues>;
  children?: ReactNode;
};

const CreateFormContainer = styled.form`
  max-width: 48rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PublicationForm = ({ onSubmit, children }: Props) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const { chainId } = useWallet();
  const dispatch = useAppDispatch();
  const publication = useAppSelector(
    (state) => state.publication // Name is required in the schema
  );

  useEffect(() => {
    if (!publication.name && chainId) {
      dispatch(fetchArticleRegistry({ chainName: networks[chainId]?.litName }));
    }
  }, []);

  // fetch publication
  // set as default

  return (
    <CreateFormContainer onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            title="Publication Name"
            defaultValue={publication.name}
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
            defaultValue={publication.description}
            errorMsg={errors?.publicationName}
            {...field}
          />
        )}
      />
      {children}
    </CreateFormContainer>
  );
};

export default PublicationForm;
