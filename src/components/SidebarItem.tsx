import React from "react";
import styled from "styled-components";

import CircleOutline from "components/CircleOutline";
import Text from "components/Text";

type Props = {
  text: string;
};

const SidebarItemContainer = styled.div`
  display: flex;
  padding: 1.6rem;
  margin-bottom: 0.8rem;
`;

const StyledCircleOutline = styled(CircleOutline)`
  margin-right: 1.8rem;
`;

const SidebarItem = ({ text }: Props) => {
  return (
    <SidebarItemContainer>
      <StyledCircleOutline size="sm" alt="circle outline with cross" />
      <Text size="md" weight="semibold">
        {text}
      </Text>
    </SidebarItemContainer>
  );
};

export default SidebarItem;
