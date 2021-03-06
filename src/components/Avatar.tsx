import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { ThemeIconSize } from "theme";
import avatarStock from "assets/avatar.svg";

type AvatarProps = {
  size: ThemeIconSize;
  alt: string;
  src?: string;
  className?: string;
  onClick?: () => void;
};

type WrapperProps = {
  size: ThemeIconSize;
  className?: string;
};

/* components */
const Image = styled.img<WrapperProps>`
  display: block;
  border-radius: 50%;
  width: 100%;
  height: ${({ theme, size }) => theme.icons.size[size]};
  width: ${({ theme, size }) => theme.icons.size[size]};
  overflow: hidden;
`;

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: ${({ theme, size }) => theme.icons.size[size]};
  width: ${({ theme, size }) => theme.icons.size[size]};
  background-color: white;
`;

const Avatar = ({ size, alt, src, className, onClick }: AvatarProps) => {
  return (
    <Wrapper size={size} className={className} onClick={onClick}>
      <Image
        src={src || avatarStock}
        size={size}
        alt={alt}
        onError={(e: ChangeEvent<HTMLImageElement>) => {
          e.target.src = avatarStock; // some replacement image
        }}
      />
    </Wrapper>
  );
};

export default Avatar;
