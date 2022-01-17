import React from "react";
import styled from "styled-components";

import { ThemeTitleSize } from "theme";

type Props = {
  children: string | React.ReactNode;
  size: ThemeTitleSize;
};

const StyledH1 = styled.h1<Props>`
  font-size: ${({ size, theme }) => theme.title[size].fontSize};
  line-height: ${({ size, theme }) => theme.title[size].lineHeight};
  font-weight: ${({ size, theme }) => theme.title[size].fontWeight};
  margin: 0;
`;

const StyledH2 = styled.h2<Props>`
  font-size: ${({ theme }) => theme.title.lg.fontSize};
  line-height: ${({ theme }) => theme.title.lg.lineHeight};
  font-weight: ${({ size, theme }) => theme.title[size].fontWeight};
  margin: 0;
`;

const StyledH3 = styled.h3<Props>`
  font-size: ${({ theme }) => theme.title.lg.fontSize};
  line-height: ${({ theme }) => theme.title.lg.lineHeight};
  font-weight: ${({ size, theme }) => theme.title[size].fontWeight};
  margin: 0;
`;

const StyledH4 = styled.h4<Props>`
  font-size: ${({ theme }) => theme.title.md.fontSize};
  line-height: ${({ theme }) => theme.title.md.lineHeight};
  font-weight: ${({ size, theme }) => theme.title[size].fontWeight};
  margin: 0;
`;

const StyledH5 = styled.h5<Props>`
  font-size: ${({ theme }) => theme.title.sm.fontSize};
  line-height: ${({ theme }) => theme.title.sm.lineHeight};
  font-weight: ${({ size, theme }) => theme.title[size].fontWeight};
  margin: 0;
`;

const Title = ({ children, size, ...rest }: Props) => {
  switch (size) {
    case "xl": {
      return (
        <StyledH2 size={size} {...rest}>
          {children}
        </StyledH2>
      );
    }
    case "lg": {
      return (
        <StyledH3 size={size} {...rest}>
          {children}
        </StyledH3>
      );
    }
    case "md": {
      return (
        <StyledH4 size={size} {...rest}>
          {children}
        </StyledH4>
      );
    }
    case "sm": {
      return (
        <StyledH5 size={size} {...rest}>
          {children}
        </StyledH5>
      );
    }
    default: {
      return (
        <StyledH1 size={size} {...rest}>
          {children}
        </StyledH1>
      );
    }
  }
};

export default Title;
