import React from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "store";

import Input from "components/Input";

type Props = {
  onSubmit: SubmitHandler<FieldValues>;
  children?: React.ReactNode;
};

const CreateFormContainer = styled.form`
  max-width: 48rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const EmailCrendentialsForm = ({ onSubmit, children }: Props) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const publication = useAppSelector((state) => state.publication);
  console.log("Publication");
  console.log(publication);

  return (
    <CreateFormContainer onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="apiKey"
        control={control}
        rules={{ required: true }}
        defaultValue={publication.apiKey}
        render={({ field }) => (
          <Input title="Api Key" errorMsg={errors?.apiKey} {...field} />
        )}
      />
      <Controller
        name="mailFrom"
        control={control}
        defaultValue={publication.mailTo}
        render={({ field }) => (
          <Input title="Mail from" errorMsg={errors?.mailFrom} {...field} />
        )}
      />
      {children}
    </CreateFormContainer>
  );
};

export default EmailCrendentialsForm;
