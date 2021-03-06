import styled from "styled-components";
import Text from "components/Text";
import { ThemeColors } from "theme";

type BodyContainerProps = {
  background?: ThemeColors;
};

export const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const Layout = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100%;
  min-width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  gap: 0rem 0rem;
  display: grid;
  grid-template:
    "sidebar header" 9.6rem
    "sidebar body" 1fr
    / 40rem 1fr;
  @media (max-width: 990px) {
    padding-bottom: 10rem;
    grid-template:
      "header"
      "body"
      "mobileNav";
  }
`;

export const MobileNavContainer = styled.div`
  grid-area: mobileNav;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  position: fixed;
  bottom: 0;
  z-index: 10;
  height: 5.6rem;
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.colors.mediumGrey};
  background: ${({ theme }) => theme.colors.almostWhite};
  @media (min-width: 1200px) {
    display: none;
  }
`;

export const SidebarContainer = styled.div`
  grid-area: sidebar;

  @media (min-width: 300px) {
    display: none;
  }
  @media (min-width: 992px) {
    display: block;
  }
`;

export const HeaderContainer = styled.div`
  grid-area: header;
  display: flex;
  align-items: center;
  @media (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 2.4rem 0 0;
  }
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

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
    padding: 2.4rem 2.4rem 1.6rem;
  }
  @media (max-width: 990px) {
    align-items: flex-start;
    padding: 2.4rem 2.4rem; 1.6rem;
  }
`;

export const HeaderText = styled(Text)`
  margin-left: 0px;
  @media (min-width: 720px) {
    margin-left: 6.4rem;
  }
`;
