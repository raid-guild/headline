import React, { HTMLAttributes, ReactNode } from "react";
import { Button as RButton, ButtonProps } from "reakit/Button";
import styled from "styled-components";
import { ThemeButtonSize } from "theme";

type LocalProps = {
  size: ThemeButtonSize;
  loadingText?: string;
  isLoading?: boolean;
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
  background: ${({ theme, isLoading }) =>
    isLoading ? theme.colors.grey : theme.colors.primary};
  border: none;
  cursor: pointer;

  &:hover {
    background: ${({ theme, isLoading }) =>
      isLoading ? theme.colors.grey : `none`};
    border: ${({ theme, isLoading }) =>
      isLoading ? `none` : `.2rem solid ${theme.colors.primary}`};
    color: ${({ theme, isLoading }) =>
      isLoading ? theme.colors.almostWhite : theme.colors.primary};
  }
`;

const Button = ({ children, size, className, ...rest }: Props) => {
  const loadingChild = rest?.loadingText || children;
  return (
    <StyledButton className={className} size={size} {...rest}>
      {rest.isLoading ? loadingChild : children}
    </StyledButton>
  );
};

export default Button;
