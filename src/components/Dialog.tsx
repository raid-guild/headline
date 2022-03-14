import React, { useEffect } from "react";
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
  hideModal?: boolean;
};

type Props = LocalProps & DialogProps;

const StyledDialog = styled(BaseDialog)`
  position: fixed;
  top: 5%;
  left: 50%;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  transform: translateX(-50%);
  border-radius: 0.8rem;
  padding: 1em;
  max-height: calc(100vh - 56px);
  outline: 0;
  z-index: 1000;
  padding: 3.2rem;
  @media (max-width: 768px) {
    width: 80%;
    height: 90%
    max-height: 100vh;
    padding: 1.6rem;
  }
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

export const Dialog = ({
  disclosure,
  backdrop,
  hideModal,
  ...props
}: Props) => {
  const dialog = useDialogState();

  useEffect(() => {
    if (hideModal) {
      dialog.hide();
    }
  }, [hideModal]);

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

export const DialogContainer = styled.div`
  width: 100%;
  height: 100%;
  gap: 3.2rem;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.almostWhite};
`;
