import React from "react";
import styled from "styled-components";

import Icon from "components/Icon";
import Text from "components/Text";
import circle from "assets/add_circle_outline.svg";
import dashboard from "assets/dashboard.svg";
import create from "assets/create.svg";
import mail from "assets/mail.svg";
import account_circle from "assets/account_circle.svg";
import library_book from "assets/library_books.svg";

type Props = {
  text: string;
  icon?: "dashboard" | "create" | "mail" | "profile" | "library_book";
  active?: boolean;
};

const SidebarItemContainer = styled.div<Pick<Props, "active">>`
  display: flex;
  padding: 2.4rem 1.6rem;
  background: ${({ theme, active }) =>
    active ? theme.colors.backgroundGrey : "none"};

  & > p {
    color: ${({ theme, active }) =>
      active ? theme.colors.primary : "#000000"};
  }
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundGrey};
  }
`;

const StyledCircleOutline = styled(Icon)`
  margin-right: 1.8rem;
`;

const SidebarItem = ({ text, icon, active }: Props) => {
  const getIcon = () => {
    switch (icon) {
      case "dashboard":
        return dashboard;
      case "create":
        return create;
      case "mail":
        return mail;
      case "profile":
        return account_circle;
      case "library_book":
        return library_book;
      default:
        return circle;
    }
  };
  return (
    <SidebarItemContainer active={active}>
      <StyledCircleOutline
        size="sm"
        src={getIcon()}
        alt="circle outline with cross"
      />
      <Text size="md" weight="semibold">
        {text}
      </Text>
    </SidebarItemContainer>
  );
};

export default SidebarItem;
