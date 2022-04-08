import React, { useCallback, useRef } from "react";
import { useWallet } from "@alexkeating/quiver";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

import { useLit } from "context/LitContext";
import { useCeramic } from "context/CeramicContext";
import Avatar from "components/Avatar";
import Button from "components/Button";
import PublicationForm from "components/PublicationForm";
import Separator from "components/Separator";
import Title from "components/Title";

import usePubImg from "hooks/usePubImg";
import { networks } from "lib/networks";
import { updatePublication } from "services/publication/slice";
import { useAppSelector, useAppDispatch } from "store";

const PublicationInfoContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundGrey};
  width: 100%;
`;

const PublicationInputsContainer = styled.div`
  display: flex;
  max-width: 60rem;
  width: 100%;
`;

const PublicationSettingsContainer = styled.div`
  display: flex;
  gap: 2.4rem;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  width: 100%;
  padding: 2.4rem;
  border-radius: 0.8rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledAvatar = styled(Avatar)`
  &:hover {
	  opacity: 0.5;
		cursor: pointer;
	}

	}
`;

const PublicationSettings = () => {
  const { chainId, address, provider } = useWallet();
  const { client } = useCeramic();
  const { litClient } = useLit();
  const hiddenImageInput = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const publicationLoading = useAppSelector(
    (state) => state.updatePublication.loading
  );
  const clickImageInput = () => {
    hiddenImageInput?.current?.click();
  };

  const [pubImg, setPubImg] = usePubImg();
  const uploadImage = useCallback(() => {
    const input = hiddenImageInput.current || { files: null };
    // const validImage = false;
    if (input.files) {
      const file = input.files[0];
      if (!file) {
        return;
      }
      // validImage =
      //   file.type === "image/jpeg" ||
      //   file.type === "image/png" ||
      //   file.type === "image/svg+xml";
      setPubImg(file);
    }
  }, [hiddenImageInput.current]);

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      if (!chainId || !client || !provider) {
        console.error("Chain Id is falsey");
        return;
      }
      dispatch(
        updatePublication({
          publication: {
            name: data.name || "",
            description: data.description || "",
            imgFile: pubImg,
          },
          chainName: networks[chainId]?.litName,
          client,
          litClient,
        })
      );
    },
    [provider, address, pubImg]
  );

  return (
    <PublicationSettingsContainer>
      <StyledAvatar
        alt={"Publication profile picture"}
        size="xxl"
        src={pubImg ? URL.createObjectURL(pubImg) : ""}
        onClick={clickImageInput}
      />
      <input
        type="file"
        ref={hiddenImageInput}
        style={{ display: "none" }}
        onClick={uploadImage}
        onChange={uploadImage}
      />
      <Separator orientation="vertical" />
      <PublicationInfoContainer>
        <Title size="md" color="helpText">
          Publication Info
        </Title>
        <PublicationInputsContainer>
          <PublicationForm onSubmit={onSubmit}>
            <StyledButton
              size="lg"
              type="submit"
              color="primary"
              variant="contained"
              isLoading={publicationLoading}
              loadingText="Updating..."
              onClick={() => console.log("Clicking")}
            >
              Save
            </StyledButton>
          </PublicationForm>
        </PublicationInputsContainer>
      </PublicationInfoContainer>
    </PublicationSettingsContainer>
  );
};

export default PublicationSettings;
