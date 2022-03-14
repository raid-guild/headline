import React from "react";
import styled from "styled-components";
import { useToolbarState, Toolbar } from "reakit/Toolbar";
import Text from "components/Text";
import ToolbarItem from "components/ToolbarItem";

type Props = {
  active: string;
  setActive: (arg0: string) => void;
};

const ToolbarContainer = styled.div`
  height: 7.2rem;
`;

const PublicToolbar = ({ active, setActive }: Props) => {
  const toolbar = useToolbarState();
  return (
    <ToolbarContainer>
      <Toolbar {...toolbar} aria-label="publish subnav">
        <ToolbarItem
          {...toolbar}
          active={active === "content"}
          onClick={() => setActive("content")}
        >
          <Text size="base">Content</Text>
        </ToolbarItem>
        <ToolbarItem
          {...toolbar}
          active={active === "about"}
          onClick={() => setActive("about")}
        >
          <Text size="base">About</Text>
        </ToolbarItem>
      </Toolbar>
    </ToolbarContainer>
  );
};
export default PublicToolbar;
