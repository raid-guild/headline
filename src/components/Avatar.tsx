import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { ThemeIconSize } from "theme";
import avatarStock from "assets/avatar.svg";

type AvatarProps = {
  size: ThemeIconSize;
  alt: string;
  src?: string;
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
  min-width: ${({ theme, size }) => theme.icons.size[size]};
  background-color: white;
`;

const Avatar = ({ size, alt, src, className }: AvatarProps) => {
  return (
    <Wrapper size={size} className={className}>
      <Image
        src={src || avatarStock}
        alt={alt}
        onError={(e: ChangeEvent<HTMLImageElement>) => {
          e.target.src = avatarStock; // some replacement image
        }}
      />
    </Wrapper>
  );
};

export default Avatar;
