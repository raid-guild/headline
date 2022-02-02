import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import { InputProps, Input as RInput } from "reakit/Input";
import Text from "components/Text";

type LocalProps = {
  title: string;
  errorMsg: string;
  className?: string;
};

const StyledInput = styled(RInput)`
  border: none;
  flex-grow: 2;
  padding: 1rem;
  margin: 0.3rem;
  background: ${({ theme }) => theme.colors.almostWhite};
  font-size: 1.6rem;
  border: ${({ theme }) => `solid 0.1rem ${theme.colors.lightGrey}`};
  border-radius: 0.8rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 7rem;
  height: 100%;
`;

const StyledLabel = styled.label`
  margin: 0.5rem 1rem;
  font-size: 1.2rem;
`;

type Props = LocalProps & InputProps & HTMLAttributes<HTMLInputElement>;

// Might need to rename to Form input
const Input = ({ className, title, errorMsg, ...rest }: Props) => {
  return (
    <InputContainer>
      <StyledLabel>{title}</StyledLabel>
      <StyledInput className={className} {...rest} />
      {errorMsg && <Text size="sm">{errorMsg}</Text>}
    </InputContainer>
  );
};

export default Input;
