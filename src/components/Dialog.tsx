import React from "react";
import styled from "styled-components";
import {
  useDialogState,
  Dialog as BaseDialog,
  DialogDisclosure,
  DialogProps,
  DialogBackdrop,
} from "reakit/Dialog";

type LocalProps = {
  disclosure: React.FunctionComponentElement<unknown>;
  backdrop?: boolean;
};

type Props = LocalProps & DialogProps;

const StyledDialog = styled(BaseDialog)`
  position: fixed;
  top: 25%;
  left: 50%;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  transform: translateX(-50%);
  border-radius: 0.8rem;
  padding: 1em;
  max-height: calc(100vh - 56px);
  outline: 0;
  z-index: 1000;
  padding: 3.2rem;
`;

const StyledDialogBackdrop = styled(DialogBackdrop)`
  background-color: rgba(222, 222, 222, 0.6);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  backdrop-filter: blur(0.5rem);
  z-index: 1000;
`;

const Dialog = ({ disclosure, backdrop, ...props }: Props) => {
  const dialog = useDialogState();
  return (
    <>
      <DialogDisclosure {...dialog} ref={disclosure.ref} {...disclosure.props}>
        {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
      </DialogDisclosure>
      {backdrop ? (
        <StyledDialogBackdrop {...dialog}>
          <StyledDialog {...dialog} {...props} />
        </StyledDialogBackdrop>
      ) : (
        <StyledDialog {...dialog} {...props} />
      )}
    </>
  );
};

export default Dialog;
