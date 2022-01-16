import React from "react";
import styled from "styled-components";
import circle from "assets/add_circle_outline.svg";
import { ThemeIconSize } from "theme";

type Props = {
  size: ThemeIconSize;
  alt: string;
  className?: string;
};

const StyledImg = styled.img<Props>`
  height: ${({ size, theme }) => theme.icons[size]};
`;

const CircleOutline = ({ size, alt, className }: Props) => {
  return <StyledImg className={className} src={circle} alt={alt} size={size} />;
};

export default CircleOutline;

// Write icon component
