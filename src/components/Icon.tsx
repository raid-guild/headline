import React from "react";
import styled from "styled-components";
import { ThemeIconSize } from "theme";

type Props = {
  size: ThemeIconSize;
  alt: string;
  src: string;
  className?: string;
};

const StyledImg = styled.img<Props>`
  height: ${({ size, theme }) => theme.icons[size]};
`;

const Icon = ({ size, alt, src, className }: Props) => {
  return <StyledImg src={src} alt={alt} className={className} size={size} />;
};

export default Icon;
