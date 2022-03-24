import React, { useCallback } from "react";
import { useWallet } from "@raidguild/quiver";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

import { useLit } from "context/LitContext";
import { useCeramic } from "context/CeramicContext";
import Avatar from "components/Avatar";
import Button from "components/Button";
import PublicationForm from "components/PublicationForm";
import Separator from "components/Separator";
import Title from "components/Title";

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

const PublicationSettings = () => {
  const { chainId, address, provider } = useWallet();
  const { client } = useCeramic();
  const { litClient } = useLit();
  const dispatch = useAppDispatch();
  const publicationLoading = useAppSelector(
    (state) => state.updatePublication.loading
  );
  const publication = useAppSelector((state) => state.publication);

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
          },
          chainName: networks[chainId]?.litName,
          client,
          litClient,
        })
      );
    },
    [provider, address]
  );

  return (
    <PublicationSettingsContainer>
      <Avatar alt={"Publication profile picture"} size="xxl" />
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
