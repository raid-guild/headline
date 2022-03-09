import React from "react";
import { useRadioState, Radio, RadioGroup } from "reakit/Radio";
import styled from "styled-components";

import Button from "components/Button";
import ExternalLink from "components/ExternalLink";
import Icon from "components/Icon";
import FormTextArea from "components/FormTextArea";
import Text from "components/Text";
import Title from "components/Title";

import portrait from "assets/portrait.svg";

const ReceiverSettingContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SocialPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImagePreview = styled.div`
  border: ${({ theme }) => `.2rem dashed ${theme.colors.lightGrey}`};
  max-height: 11rem;
  max-width: 24rem;
  height: 100%;
  width: 100%;
`;

const SendingTestEmailContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2.4rem;
`;

export const ArticleSettings = () => {
  const radio = useRadioState({ state: "everyone" });

  return (
    <>
      <Text size="base">Post setting</Text>
      <ReceiverSettingContainer>
        <Title size="sm" color="helpText">
          This post is for
        </Title>
        <label>
          <Radio {...radio} value="free" /> Everyone
        </label>
        <label>
          <Radio {...radio} value="paid" disabled={true} /> Paid subscribers
        </label>
      </ReceiverSettingContainer>
      <SocialPreviewContainer>
        <Title size="sm" color="helpText">
          Social Preview
        </Title>
        <Text size="base" color="grey">
          Changing the preview text will only affect the social preview, not the
          post content itself
        </Text>
        <ImagePreview>
          <Icon size="lg" src={portrait} alt="portrait" />
        </ImagePreview>
        <FormTextArea title="Preview text" errorMsg="Description is too long" />
      </SocialPreviewContainer>
      <SendingTestEmailContainer>
        <Title size="sm" color="helpText">
          Sending a test email
        </Title>
        <Text size="base" color="grey">
          Please configure your SMTP credentials in the setting page in order to
          send out a test email
        </Text>
        <ExternalLink href="www.google.com">
          <Text size="base" color="primary" weight="semibold">
            Learn More
          </Text>
        </ExternalLink>
      </SendingTestEmailContainer>
      <ButtonContainer>
        <Button size="md" color="primary" variant="contained">
          Unpublish
        </Button>
        <Button size="md" color="error" variant="contained">
          Delete this post
        </Button>
      </ButtonContainer>
    </>
  );
};
