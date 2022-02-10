import React, { HTMLAttributes } from "react";
import styled from "styled-components";
import Text from "components/Text";

type LocalProps = {
  title: string;
  errorMsg: string;
  className?: string;
};

const StyledTextArea = styled.textarea`
  border: none;
  flex-grow: 2;
  padding: 1rem;
  margin: 0.3rem;
  background: ${({ theme }) => theme.colors.almostWhite};
  font-size: 1.6rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 10rem;
  border: ${({ theme }) => `solid 0.1rem ${theme.colors.lightGrey}`};
  border-radius: 0.8rem;
  height: 100%;
`;

const StyledLabel = styled.label`
  margin: 0.5rem 1rem;
  font-size: 1.2rem;
`;

type Props = LocalProps & HTMLAttributes<HTMLTextAreaElement>;

// Might need to rename to Form input
const FormTextArea = ({ className, title, errorMsg, ...rest }: Props) => {
  return (
    <>
      <InputContainer>
        <StyledLabel>{title}</StyledLabel>
        <StyledTextArea className={className} {...rest} />
      </InputContainer>
      {errorMsg && <Text size="sm">{errorMsg}</Text>}
    </>
  );
};

export default FormTextArea;
