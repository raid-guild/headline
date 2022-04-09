import React, { useCallback, useState } from "react";
import { SubmitHandler, FieldValues } from "react-hook-form";
import { useWallet } from "@alexkeating/quiver";
import styled from "styled-components";

import { useCeramic } from "context/CeramicContext";
import { useLit } from "context/LitContext";
import Button from "components/Button";
import { Dialog, DialogContainer } from "components/Dialog";
import ExternalLink from "components/ExternalLink";
import Text from "components/Text";
import Title from "components/Title";
import EmailCrendentialsForm from "./EmailCredentialsForm";
import { updatePublication } from "services/publication/slice";
import { networks } from "lib/networks";
import { useAppDispatch, useAppSelector } from "store";

const EmailSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundGrey};
  padding: 3.2rem;
  gap: 1.6rem;
  width: 100%;
  border-radius: 0.8rem;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const ConfigureButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

const SettingsContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundGrey};
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const EmailSettings = () => {
  const dispatch = useAppDispatch();
  const [hide, setHide] = useState(false);
  const { chainId } = useWallet();
  const { client } = useCeramic();
  const { litClient } = useLit();
  const publicationLoading = useAppSelector(
    (state) => state.updatePublication.loading
  );
  const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
    if (!chainId || !client) {
      return;
    }
    await dispatch(
      updatePublication({
        publication: {
          emailSettings: {
            apiKey: data.apiKey || "",
            mailFrom: data.mailFrom || "",
            infra: data.region.toLowerCase() || "",
            domain: data.domain || "",
          },
        },
        chainName: networks[chainId].litName,
        client,
        litClient,
      })
    );
    setHide(true);
  }, []);

  return (
    <EmailSettingsContainer>
      <Title size="md" color="helpText">
        Email Service
      </Title>
      <Text size="base" color="label">
        Currently we support Mailgun to send emails and it&#39;s required to
        have a Mailgun account in order to start mailing to your subscribers.
      </Text>
      <ConfigureButtonContainer>
        <Dialog
          baseId="email-settings"
          backdrop={true}
          hideModal={hide}
          disclosure={
            <Button
              color="primary"
              variant="contained"
              size="md"
              onClick={() => setHide(false)}
            >
              Email Settings
            </Button>
          }
        >
          <DialogContainer>
            <Text size="base" color="helpText">
              Email Service
            </Text>
            <SettingsContainer>
              <Title size="sm" color="grey">
                Send out posts to your subscribers
              </Title>
              <Text size="sm" color="label" as="span">
                Having issues setting up?{" "}
                <ExternalLink href="https://docs.viaheadline.xyz/guides/connecting-your-email-service">
                  <Text size="sm" color="primary" as="span">
                    Read guide
                  </Text>
                </ExternalLink>
              </Text>
              <EmailCrendentialsForm onSubmit={onSubmit}>
                <Button
                  size="md"
                  color="primary"
                  variant="contained"
                  isLoading={publicationLoading}
                  loadingText="Saving..."
                  type="submit"
                >
                  Save
                </Button>
              </EmailCrendentialsForm>
            </SettingsContainer>
          </DialogContainer>
        </Dialog>
        <ExternalLink href="https://docs.viaheadline.xyz/guides/connecting-your-email-service">
          <Text size="md" color="primary">
            Learn more
          </Text>
        </ExternalLink>
      </ConfigureButtonContainer>
    </EmailSettingsContainer>
  );
};

export default EmailSettings;
