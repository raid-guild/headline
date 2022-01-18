import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SidebarItem from "components/SidebarItem";
import FullLogo from "components/FullLogo";
import Icon from "components/Icon";

import discord from "assets/discord.svg";
import twitter from "assets/twitter.svg";
import { TWITTER_URL, DISCORD_URL } from "../constants";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  margin-right: 2rem;
  height: 100%;
`;

const LogoContainer = styled.div`
  max-height: 18rem;
  height: 100%;
  margin-top: 2rem;
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
  padding-bottom: 2rem;
`;

const SocialMediaContainer = styled.div`
  display: flex;
  margin: 1rem;
`;

const StyledIcon = styled(Icon)`
  padding: 0.4rem 0.6rem;
`;

const StyledLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
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
          <StyledLink
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledIcon src={twitter} alt="twitter logo" size="lg" />
          </StyledLink>
          <StyledLink
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledIcon src={discord} alt="discord logo" size="lg" />
          </StyledLink>
        </SocialMediaContainer>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
