import React from "react";
import styled from "styled-components";

import { ThemeTextSize, ThemeTextWeight, ThemeColors } from "theme";

type Props = {
  children: React.ReactNode;
  size: ThemeTextSize;
  weight?: ThemeTextWeight;
  color?: ThemeColors;
  className?: string;
  as?: "span" | "p";
};

const StyledText = styled.p<Props>`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ color, theme }) =>
    color ? theme.colors[color] : theme.colors.text};
  margin: 0;
  font-size: ${({ size, theme }) => theme.text.size[size].fontSize};
  font-weight: ${({ weight, theme }) => theme.text.weight[weight]};
  line-height: ${({ size, theme }) => theme.text.size[size].lineHeight};
`;

const Text = ({ children, as, weight = "normal", ...rest }: Props) => {
  return (
    <StyledText as={as} weight={weight} {...rest}>
      {children}
    </StyledText>
  );
};

export default Text;
