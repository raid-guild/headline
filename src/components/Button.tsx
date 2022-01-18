import React, { HTMLAttributes, ReactNode } from "react";
import { Button as RButton, ButtonProps } from "reakit/Button";
import styled from "styled-components";
import { ThemeButtonSize } from "theme";

type LocalProps = {
  size: ThemeButtonSize;
  children?: ReactNode;
  className?: string;
};

type Props = LocalProps & ButtonProps & HTMLAttributes<HTMLButtonElement>;

// Different variants can be added if needed
const StyledButton = styled(RButton)<Props>`
  border-radius: 0.8rem;
  padding: ${({ size, theme }) => theme.buttons.size[size].padding};
  height: ${({ size, theme }) => theme.buttons.size[size].height};
  font-size: ${({ size, theme }) =>
    size === "xl"
      ? theme.text.size.lg.fontSize
      : theme.text.size[size].fontSize};
  color: ${({ theme }) => theme.colors.almostWhite};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  cursor: pointer;

  &:hover {
    background: none;
    border: ${({ theme }) => `.2rem solid ${theme.colors.primary}`};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = ({ children, size, className, ...rest }: Props) => {
  return (
    <StyledButton className={className} size={size} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;
