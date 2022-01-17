import React from "react";
import styled from "styled-components";

import Icon from "components/Icon";
import Text from "components/Text";
import circle from "assets/add_circle_outline.svg";

type Props = {
  text: string;
};

const SidebarItemContainer = styled.div`
  display: flex;
  padding: 2.4rem 1.6rem;
`;

const StyledCircleOutline = styled(Icon)`
  margin-right: 1.8rem;
`;

const SidebarItem = ({ text }: Props) => {
  return (
    <SidebarItemContainer>
      <StyledCircleOutline
        size="sm"
        src={circle}
        alt="circle outline with cross"
      />
      <Text size="md" weight="semibold">
        {text}
      </Text>
    </SidebarItemContainer>
  );
};

export default SidebarItem;
