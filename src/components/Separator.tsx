import React from "react";
import styled from "styled-components";
import { Separator as RSeparator, SeparatorProps } from "reakit/Separator";

type Props = SeparatorProps;

const StyledSeparator = styled(RSeparator)`
  border: ${({ theme }) => `.1rem solid ${theme.colors.lightGrey}`};
  margin: 0;
`;

const Separator = ({ ...rest }: Props) => {
  return <StyledSeparator {...rest} />;
};

export default Separator;
