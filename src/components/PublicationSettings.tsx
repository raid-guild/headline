import React, { useCallback } from "react";
import { useWallet } from "@raidguild/quiver";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

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
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const PublicationSettings = () => {
  const { address, chainId } = useWallet();
  const dispatch = useAppDispatch();
  const publicationLoading = useAppSelector(
    (state) => state.updatePublication.loading
  );
  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    if (!chainId) {
      console.error("Chain Id is falsey");
      return;
    }
    dispatch(
      updatePublication({
        publication: {
          name: data.name || "",
          description: data.description || "",
        },
        address: address || "",
        chainName: networks[chainId]?.litName,
      })
    );
  }, []);

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
            <ButtonContainer>
              <StyledButton size="lg">Cancel</StyledButton>
              <StyledButton
                size="lg"
                type="submit"
                color="primary"
                isLoading={publicationLoading}
                loadingText="Updating..."
              >
                Submit
              </StyledButton>
            </ButtonContainer>
          </PublicationForm>
        </PublicationInputsContainer>
      </PublicationInfoContainer>
    </PublicationSettingsContainer>
  );
};

export default PublicationSettings;
