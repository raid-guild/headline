import React from "react";
import styled from "styled-components";
import { ThemeIconSize } from "theme";

type AvatarProps = {
  size: ThemeIconSize;
  alt: string;
  src: string;
  className?: string;
};

type WrapperProps = {
  size: ThemeIconSize;
  className?: string;
};

/* components */
const Image = styled.img`
  display: block;
  border-radius: 50%;
  width: 100%;
  height: auto;
  overflow: hidden;
`;

const Wrapper = styled.div<WrapperProps>`
  box-sizing: border-box;
  border-radius: 50%;
  border: 0.2rem solid #ddd;
  padding: 0.2rem;
  height: ${({ theme, size }) => theme.icons.size[size]};
  width: ${({ theme, size }) => theme.icons.size[size]};
  background-color: white;
`;

const Avatar = ({ size, alt, src, className }: AvatarProps) => {
  return (
    <Wrapper size={size} className={className}>
      <Image src={src} alt={alt} />
    </Wrapper>
  );
};

export default Avatar;
