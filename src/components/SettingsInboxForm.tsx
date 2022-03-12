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
  gap: 2rem;
  align-items: flex-end;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.6rem;
  }
`;

const EmailInput = styled(Input)`
  @media (max-width: 768px) {
    width: 100%;
  }
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
          <EmailInput title="Email" errorMsg={errors?.email} {...field} />
        )}
      />
      {children}
    </InboxContainer>
  );
};

export default SettingsInboxForm;
