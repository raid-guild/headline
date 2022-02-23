import React, { HTMLAttributes, ReactNode } from "react";
import { Button as RButton, ButtonProps } from "reakit/Button";
import styled, { css } from "styled-components";
import { ThemeButtonSize } from "theme";

type LocalProps = {
  size: ThemeButtonSize;
  variant: "contained" | "outlined";
  color: "primary" | "secondary";
  loadingText?: string;
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
};

type Props = LocalProps & ButtonProps & HTMLAttributes<HTMLButtonElement>;

const customStyles = {
  primary: {
    contained: css<Props>`
      color: ${({ theme }) => theme.colors.almostWhite};
      background: ${({ theme, isLoading, color }) =>
        isLoading ? theme.colors.grey : theme.colors[color || "primary"]};
      border: none;

      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.primary};

      &:hover {
        background: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.grey : `none`};
        border: ${({ theme, isLoading }) =>
          isLoading ? `none` : `.2rem solid ${theme.colors.primary}`};
        color: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.almostWhite : theme.colors.primary};
      }
    `,
    outlined: css``,
  },
  secondary: {
    contained: css``,
    outlined: css<Props>`
      color: ${({ theme }) => theme.colors.grey};
      background: none;
      border: ${({ theme }) => `.2rem solid ${theme.colors.grey}`};

      &:hover {
        background: ${({ theme }) => theme.colors.grey};
        border: none;
        color: ${({ theme }) => theme.colors.almostWhite};
      }
    `,
  },
};

// Different variants can be added if needed
const StyledButton = styled(RButton)<Props>`
  border-radius: 0.8rem;
  padding: ${({ size, theme }) => theme.buttons.size[size].padding};
  height: ${({ size, theme }) => theme.buttons.size[size].height};
  font-size: ${({ size, theme }) =>
    size === "xl"
      ? theme.text.size.lg.fontSize
      : theme.text.size[size].fontSize};
  cursor: pointer;

  ${({ color, variant }) => {
    if (color !== undefined && variant !== undefined) {
      return customStyles[color][variant];
    }
  }}
`;

const Button = ({
  children,
  size,
  className,
  isLoading,
  loadingText,
  variant = "contained",
  color = "primary",
  ...rest
}: Props) => {
  const loadingChild = loadingText || children;
  return (
    <StyledButton
      className={className}
      size={size}
      isLoading={isLoading}
      variant={variant}
      color={color}
      {...rest}
    >
      {isLoading ? loadingChild : children}
    </StyledButton>
  );
};

export default Button;
