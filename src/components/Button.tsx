import React, { HTMLAttributes, ReactNode } from "react";
import { Button as RButton, ButtonProps } from "reakit/Button";
import styled, { css } from "styled-components";
import { ThemeButtonSize } from "theme";

import open_link from "assets/open_in_new.svg";
import Icon from "components/Icon";

type LocalProps = {
  size: ThemeButtonSize;
  variant: "contained" | "outlined";
  color: "primary" | "secondary" | "success" | "error";
  icon?: "link";
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
      border: ${({ theme, isLoading }) =>
        isLoading ? `none` : `.2rem solid ${theme.colors.primary}`};

      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.primary};

      &:hover {
        background: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.grey : `none`};
        color: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.almostWhite : theme.colors.primary};
      }
    `,
    outlined: css`
      color: ${({ theme }) => theme.colors.primary};
      background: none;
      border: ${({ theme }) => `.2rem solid ${theme.colors.primary}`};
    `,
  },
  secondary: {
    contained: css``,
    outlined: css<Props>`
      color: ${({ theme }) => theme.colors.grey};
      background: none;
      border: ${({ theme }) => `.2rem solid ${theme.colors.grey}`};

      &:hover {
        background: ${({ theme }) => theme.colors.grey};
        color: ${({ theme }) => theme.colors.almostWhite};
      }
    `,
  },
  success: {
    contained: css<Props>`
      color: ${({ theme }) => theme.colors.almostWhite};
      background: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.success};
      border: ${({ theme, isLoading }) =>
        isLoading ? `none` : `.2rem solid ${theme.colors.success}`};

      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.success};

      &:hover {
        background: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.grey : `none`};
        color: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.almostWhite : theme.colors.primary};
      }
    `,
    outlined: css`
      color: ${({ theme }) => theme.colors.success};
      background: none;
      border: ${({ theme }) => `.2rem solid ${theme.colors.success}`};
    `,
  },
  error: {
    contained: css<Props>`
      color: ${({ theme }) => theme.colors.almostWhite};
      background: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.error};
      border: ${({ theme, isLoading }) =>
        isLoading ? `none` : `.2rem solid ${theme.colors.error}`};

      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme, isLoading }) =>
        isLoading ? theme.colors.grey : theme.colors.error};

      &:hover {
        background: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.grey : `none`};
        color: ${({ theme, isLoading }) =>
          isLoading ? theme.colors.almostWhite : theme.colors.error};
      }
    `,
    outlined: css`
      color: ${({ theme }) => theme.colors.error};
      background: none;
      border: ${({ theme }) => `.2rem solid ${theme.colors.error}`};
    `,
  },
};

// Different variants can be added if needed
const StyledButton = styled(RButton)<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
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
  icon,
  variant = "contained",
  color = "primary",
  ...rest
}: Props) => {
  const loadingChild = loadingText || children;
  const getIcon = (iconVal: string) => {
    switch (iconVal) {
      case "link":
        return <Icon size={size} src={open_link} alt="link to another page" />;
      default:
        return <></>;
    }
  };
  const iconComponent = getIcon(icon || "");
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
      {iconComponent}
    </StyledButton>
  );
};

export default Button;
