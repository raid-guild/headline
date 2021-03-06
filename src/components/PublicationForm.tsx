import React, { ReactNode, useEffect } from "react";
import { useWallet } from "@alexkeating/quiver";
import styled from "styled-components";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import { useCeramic } from "context/CeramicContext";
import { useLit } from "context/LitContext";
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
  const { litClient } = useLit();
  const { did } = useCeramic();
  const dispatch = useAppDispatch();
  const publication = useAppSelector(
    (state) => state.publication // Name is required in the schema
  );

  useEffect(() => {
    if (!publication.name && chainId && did) {
      dispatch(
        fetchArticleRegistry({
          chainName: networks[chainId]?.litName,
          litClient,
          did: did.id,
        })
      );
    }
  }, []);

  return (
    <CreateFormContainer onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{ required: true }}
        defaultValue={publication.name}
        render={({ field }) => (
          <Input title="Publication Name" errorMsg={errors?.name} {...field} />
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue={publication.description}
        render={({ field }) => (
          <FormTextArea
            title="Description"
            errorMsg={errors?.description}
            {...field}
          />
        )}
      />
      {children}
    </CreateFormContainer>
  );
};

export default PublicationForm;
