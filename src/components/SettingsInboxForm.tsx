import React, { ReactNode } from "react";
import styled from "styled-components";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import Input from "components/Input";

type Props = {
  onSubmit: SubmitHandler<FieldValues>;
  children?: ReactNode;
};

const InboxContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SettingsInboxForm = ({ onSubmit, children }: Props) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();

  return (
    <InboxContainer onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        // defaultValue={publication.email}
        render={({ field }) => (
          <Input title="Email" errorMsg={errors?.email} {...field} />
        )}
      />
      {children}
    </InboxContainer>
  );
};

export default SettingsInboxForm;
