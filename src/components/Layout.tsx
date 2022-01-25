import React from "react";
import styled from "styled-components";
import Text from "components/Text";
import { ThemeColors } from "theme";

type BodyContainerProps = {
  background?: ThemeColors;
};

export const Layout = styled.div`
  width: 100%;
  height: 100%;
  gap: 0rem 0rem;
  display: grid;
  grid-template:
    "sidebar header" 9.6rem
    "sidebar body" 1fr
    / 40rem 1fr;
`;

export const SidebarContainer = styled.div`
  grid-area: sidebar;
`;

export const HeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
`;

// override flex ddirection
export const BodyContainer = styled.div<BodyContainerProps>`
  grid-area: body;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme, background }) =>
    background ? theme.colors[background] : theme.colors.almostWhite};
`;

export const HeaderText = styled(Text)`
  margin-left: 6.4rem;
`;
