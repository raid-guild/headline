import React from "react";
import styled from "styled-components";
import { ToolbarItem as ToolbarItemR, ToolbarItemProps } from "reakit/Toolbar";

type Props = {
  active?: boolean;
  children?: string | React.ReactNode;
} & ToolbarItemProps;

const StyledToolbarItem = styled(ToolbarItemR)<Props>`
  border: none;
  background: transparent;
  padding: 2.3rem;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? `1px solid black` : "none")};
`;

const ToolbarItem = ({ active, children, ...rest }: Props) => {
  return (
    <StyledToolbarItem active={active} {...rest}>
      {children}
    </StyledToolbarItem>
  );
};

export default ToolbarItem;
