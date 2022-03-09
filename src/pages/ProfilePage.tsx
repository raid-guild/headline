import React, { useEffect, useState } from "react";
import { BasicProfile } from "@datamodels/identity-profile-basic";
import { useWallet } from "@raidguild/quiver";
import styled from "styled-components";

import github from "assets/github.svg";
import twitter from "assets/twitter.svg";
import Avatar from "components/Avatar";
import Button from "components/Button";
import ExternalLink from "components/ExternalLink";
import Icon from "components/Icon";
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
import { fetchBasicProfile } from "services/profile/slice";
import { useAppSelector, useAppDispatch } from "store";

import { getProfileImg } from "lib/ipfs";

const ProfilePageBodyContainer = styled(BodyContainer)`
  display: flex;
  flex-direction: column;
  max-width: 100rem;
  align-items: flex-start;
  justify-content: flex-start;
  margin-right: 2rem;
  gap: 3.2rem;
`;

const BasicProfileCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.backgroundGrey};
  gap: 3.2rem;
  padding: 4rem;
  width: 100%;
  max-length: 90rem;
`;

const GetStartedButton = styled(Button)`
  max-width: 20rem;
`;

const ProfileTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const InboxContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyProfileCard = () => {
  return (
    <>
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
      <ExternalLink href="https://self.id/">
        <GetStartedButton
          size="md"
          color="primary"
          variant="outlined"
          icon="link"
        >
          Get started
        </GetStartedButton>
      </ExternalLink>
    </>
  );
};

const UrlContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SocialMediaContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProfileContentContainer = styled.div`
  display: flex;
  gap: 3.2rem;
`;

const FilledProfileCard = ({ profile }: { profile: BasicProfile }) => {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (profile?.image) {
      const img = getProfileImg(profile.image);
      setSrc(img);
    }
  }, []);
  return (
    <>
      <Title size="sm" color="helpText">
        Basic
      </Title>
      <ProfileContentContainer>
        <Avatar src={src || ""} alt="Profile picture" size="xxl" />
        <ProfileTextContainer>
          <Title size="md">{profile?.name || ""}</Title>
          <Text size="base">{profile?.description || ""}</Text>
          <UrlContainer>
            {profile.url && (
              <ExternalLink href={profile.url}>
                <Text as="span" size="base" weight="bold" color="primary">
                  {profile?.url}
                </Text>
              </ExternalLink>
            )}
            <SocialMediaContainer>
              {profile.twitter && (
                <ExternalLink href={profile.twitter as string}>
                  <Icon src={twitter} alt="twitter logo" size="lg" />
                </ExternalLink>
              )}
              {profile.github && (
                <ExternalLink href={profile.github as string}>
                  <Icon src={github} alt="github logo" size="lg" />
                </ExternalLink>
              )}
            </SocialMediaContainer>
          </UrlContainer>
        </ProfileTextContainer>
      </ProfileContentContainer>
      <ExternalLink href="https://self.id/">
        <GetStartedButton
          size="md"
          color="primary"
          variant="outlined"
          icon="link"
        >
          Edit
        </GetStartedButton>
      </ExternalLink>
    </>
  );
};

const BasicProfileCard = () => {
  const dispatch = useAppDispatch();
  const { address } = useWallet();
  const profile = useAppSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchBasicProfile(address || ""));
  }, [address]);
  console.log("Basic card");
  console.log(profile);
  return (
    <BasicProfileCardContainer>
      {Object.keys(profile).length > 0 ? (
        <FilledProfileCard profile={profile} />
      ) : (
        <EmptyProfileCard />
      )}
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
