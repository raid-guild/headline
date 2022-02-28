import React from "react";
import styled from "styled-components";

import Button from "components/Button";
import {
  Layout,
  HeaderContainer,
  HeaderText,
  SidebarContainer,
  BodyContainer,
} from "components/Layout";
import SettingsInboxForm from "components/SettingsInboxForm";
import Sidebar from "components/Sidebar";
import Text from "components/Text";
import Title from "components/Title";

// Two views
// Has no self.id page
//
// Has a self.id page

const ProfilePageBodyContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  max-width: 100rem;
  align-items: flex-start;
  justify-content: flex-start;
`;

const BasicProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  gap: 3.2rem;
  padding: 4rem;
`;

const GetStartedButton = styled(Button)`
  max-width: 20rem;
`;

const ProfileTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InboxContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BasicProfileCard = () => {
  return (
    <BasicProfileCardContainer>
      <Title size="sm" color="helpText">
        Basic
      </Title>
      <ProfileTextContainer>
        <Title size="md">Your profile, the decentralized way.</Title>
        <Text size="base">
          HEADLINE doesn&apos;t store any of your information, we will direct
          you to set up decentralized profile, click Get started to fill out
          your profile on self.id
        </Text>
      </ProfileTextContainer>
      <a href="https://self.id/" target="_blank" rel="noopener noreferrer">
        <GetStartedButton
          size="md"
          color="primary"
          variant="outlined"
          icon="link"
        >
          Get started
        </GetStartedButton>
      </a>
    </BasicProfileCardContainer>
  );
};

const SubscriptionInbox = () => {
  return (
    <BasicProfileCardContainer>
      <Title size="sm" color="helpText">
        Subscription inbox
      </Title>
      <InboxContainer>
        <Text size="base">To receive the subscription right to your inbox</Text>
        <SettingsInboxForm
          onSubmit={() => {
            console.log("Being implemented");
          }}
        >
          <Button size="md" color="primary" variant="contained">
            Update
          </Button>
        </SettingsInboxForm>
      </InboxContainer>
    </BasicProfileCardContainer>
  );
};

const ProfilePage = () => {
  return (
    <Layout>
      <HeaderContainer>
        <HeaderText size="md" weight="semibold" color="helpText">
          My Profile
        </HeaderText>
      </HeaderContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <ProfilePageBodyContainer>
        <BasicProfileCard />
        <SubscriptionInbox />
      </ProfilePageBodyContainer>
    </Layout>
  );
};

export default ProfilePage;
