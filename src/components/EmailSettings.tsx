import React from "react";
import styled from "styled-components";

import Button from "components/Button";
import Text from "components/Text";
import Title from "components/Title";

const EmailSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  padding: 3.2rem;
  gap: 1.6rem;
  width: 100%;
`;

const ConfigureButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

const EmailSettings = () => {
  return (
    <EmailSettingsContainer>
      <Title size="md" color="helpText">
        Email Service
      </Title>
      <Text size="base" color="label">
        Currently we support sengrud ti sebd iyt enauksm it's required to have a
        sendgrid account in order to start mailing to your subscribers.
      </Text>
      <ConfigureButtonContainer>
        <Button color="primary" variant="contained" size="base">
          Configure setting
        </Button>

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
