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

const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const StyledSelect = styled.select`
  border: none;
  flex-grow: 2;
  padding: 1rem;
  margin: 0.3rem;
  background: ${({ theme }) => theme.colors.almostWhite};
  font-size: 1.6rem;
  border: ${({ theme }) => `solid 0.1rem ${theme.colors.lightGrey}`};
  border-radius: 0.8rem;
`;

const StyledOption = styled.option`
  color: ${({ theme }) => theme.colors.helpText};
  border: none;
  flex-grow: 2;
  padding: 1rem;
  margin: 0.3rem;
  background: ${({ theme }) => theme.colors.almostWhite};
  font-size: 1.6rem;
  border: ${({ theme }) => `solid 0.1rem ${theme.colors.lightGrey}`};
  border-radius: 0.8rem;
`;

const StyledLabel = styled.label`
  margin: 0.5rem 1rem;
  font-size: 1.2rem;
`;
const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LockVerificationForm = ({ onSubmit, children }: Props) => {
  const {
    formState: { errors },
    handleSubmit,
    control,
    register,
  } = useForm();

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <SelectContainer>
        <StyledLabel>Select the Chain where your lock exists</StyledLabel>
        <StyledSelect {...register("lockChain")}>
          <StyledOption value="0x1">Mainnet</StyledOption>
          <StyledOption value="0x64">Gnosis Chain</StyledOption>
          <StyledOption value="0x89">Polygon</StyledOption>
          <StyledOption value="0x38">Binance Smart Chain</StyledOption>
        </StyledSelect>
        {errors?.lockChain && <p>{errors?.lockChain?.message}</p>}
      </SelectContainer>
      <Controller
        name="lockAddress"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            title="Enter your Lock address"
            errorMsg={errors?.lockAddress}
            {...field}
          />
        )}
      />
      {children}
    </FormContainer>
  );
};

export default LockVerificationForm;
