import React from "react";
import styled from "styled-components";
import {
  useToolbarState,
  Toolbar,
  ToolbarItem as ToolbarItemR,
} from "reakit/Toolbar";

type Props = {
  active?: string;
  children?: string | React.ReactNode;
};

const StyledToolbarItem = styled(ToolbarItemR)<Props>`
  border: none;
  background: transparent;
  padding: 2.3rem;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? `1px solid black` : "none")};
`;

const ToolbarItem = ({ active, children, ...rest }) => {
  return (
    <StyledToolbarItem active={active} {...rest}>
      {children}
    </StyledToolbarItem>
  );
};

export default ToolbarItem;
