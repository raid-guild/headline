import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SidebarItem from "components/SidebarItem";
import FullLogo from "components/FullLogo";
import Icon from "components/Icon";

import discord from "assets/discord.svg";
import twitter from "assets/twitter.svg";
import { TWITTER_URL, DISCORD_URL } from "constants";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  height: 100%;
`;

const LogoContainer = styled.div`
  max-height: 18rem;
  height: 100%;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopContainer = styled.div`
  flex: 2 2 auto;
  display: flex;
  flex-direction: column;
`;

const BottomContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const SocialMediaContainer = styled.div`
  display: flex;
`;

const StyledIcon = styled(Icon)`
  padding: 1.6rem 0rem 1.6rem 1.6rem;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <TopContainer>
        <LogoContainer>
          <FullLogo />
        </LogoContainer>
        <MenuContainer>
          <Link to={"/dashboard"}>
            <SidebarItem text="Dashboard" />
          </Link>
          <Link to={"/inbox"}>
            <SidebarItem text="Inbox" />
          </Link>
          <Link to={"/publish"}>
            <SidebarItem text="Publish" />
          </Link>
          <Link to={"/profile"}>
            <SidebarItem text="My Profile" />
          </Link>
        </MenuContainer>
      </TopContainer>
      <BottomContainer>
        <Link to={"/guide"}>
          <SidebarItem text="Guide" />
        </Link>
        <SocialMediaContainer>
          <Link to={TWITTER_URL}>
            <StyledIcon src={twitter} alt="twitter logo" size="lg" />
          </Link>
          <Link to={DISCORD_URL}>
            <StyledIcon src={discord} alt="discord logo" size="lg" />
          </Link>
        </SocialMediaContainer>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
