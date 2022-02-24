import React, { useCallback } from "react";
import { SubmitHandler, FieldValues } from "react-hook-form";
import styled from "styled-components";

import Button from "components/Button";
import Dialog from "components/Dialog";
import Text from "components/Text";
import Title from "components/Title";
import EmailCrendentialsForm from "./EmailCredentialsForm";

const EmailSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundGrey};
  padding: 3.2rem;
  gap: 1.6rem;
  width: 100%;
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

const EmailDialogContainer = styled.div`
  width: 100%;
  height: 100%;
  gap: 3.2rem;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.almostWhite};
`;

const EmailSettings = () => {
  const onSubmit: SubmitHandler<FieldValues> = useCallback((data) => {
    console.log("To do");
  }, []);

  return (
    <EmailSettingsContainer>
      <Title size="md" color="helpText">
        Email Service
      </Title>
      <Text size="base" color="label">
        Currently we support sengrid to send emails and it&#39;s required to
        have a sendgrid account in order to start mailing to your subscribers.
      </Text>
      <ConfigureButtonContainer>
        <Dialog
          baseId="email-settings"
          backdrop={true}
          disclosure={
            <Button color="primary" variant="contained" size="base">
              Email Settings
            </Button>
          }
        >
          <EmailDialogContainer>
            <Text size="base" color="helpText">
              Email Service
            </Text>
            <SettingsContainer>
              <Title size="sm" color="grey">
                Setting to send out a post to your subscribers
              </Title>
              <Text size="sm" color="label" as="span">
                Having issues setting up?{" "}
                <a
                  href="www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text size="sm" color="primary" as="span">
                    Read guide
                  </Text>
                </a>
              </Text>
              <EmailCrendentialsForm onSubmit={onSubmit}>
                <Button size="base" color="primary" variant="contained">
                  Save
                </Button>
              </EmailCrendentialsForm>
            </SettingsContainer>
          </EmailDialogContainer>
        </Dialog>
        <a href="www.google.com" target="_blank" rel="noopener noreferrer">
          <Text size="md" color="primary">
            Learn more
          </Text>
        </a>
      </ConfigureButtonContainer>
    </EmailSettingsContainer>
  );
};

export default EmailSettings;
