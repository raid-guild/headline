import React, { ReactNode } from "react";
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

const StyledTooltip = styled(ReakitTooltip)``;

const Tooltip = ({ title, children, ...rest }: Props) => {
  const tooltip = useTooltipState();
  return (
    <>
      <TooltipReference {...tooltip} ref={children.ref} {...children.props}>
        {(referenceProps) => React.cloneElement(children, referenceProps)}
      </TooltipReference>
      <StyledTooltip {...tooltip} {...rest}>
        {title}
      </StyledTooltip>
    </>
  );
};

export default Tooltip;
