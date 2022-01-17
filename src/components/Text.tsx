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
  font-weight: ${({ weight, theme }) =>
    weight ? theme.text.weight[weight] : theme.text.weight.normal};
  line-height: ${({ size, theme }) => theme.text.size[size].lineHeight};
`;

const Text = ({ children, as, ...rest }: Props) => {
  return (
    <StyledText as={as} {...rest}>
      {children}
    </StyledText>
  );
};

export default Text;
