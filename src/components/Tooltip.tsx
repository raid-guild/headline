import React from "react";
import styled from "styled-components";
import {
  useTooltipState,
  Tooltip as ReakitTooltip,
  TooltipReference,
  TooltipProps,
} from "reakit/Tooltip";

type LocalProps = {
  title: string;
  children: React.FunctionComponentElement<unknown>;
};

type Props = LocalProps & TooltipProps;

const StyledTooltip = styled(ReakitTooltip)`
  border: ${({ theme }) => `solid 0.1rem ${theme.colors.lightGrey}`};
  border-radius: 0.8rem;
  background: ${({ theme }) => theme.colors.lightGrey};
  padding: 0.6rem;
  font-size: 1rem;
`;

const Tooltip = ({ title, children, ...rest }: Props) => {
  const tooltip = useTooltipState();
  return (
    <>
      <TooltipReference {...tooltip} ref={children.ref} {...children.props}>
        {(referenceProps) => React.cloneElement(children, referenceProps)}
      </TooltipReference>
      <StyledTooltip {...tooltip} {...rest} unstable_portal={false}>
        {title}
      </StyledTooltip>
    </>
  );
};

export default Tooltip;
