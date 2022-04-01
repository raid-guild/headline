import React, { useState } from "react";
import { useLocation } from "react-router";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SidebarItem from "components/SidebarItem";
import FullLogo from "components/FullLogo";
import Icon from "components/Icon";
import ExternalLink from "components/ExternalLink";
import discord from "assets/discord.svg";
import twitter from "assets/twitter.svg";
import { TWITTER_URL, DISCORD_URL } from "../constants";

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  margin-right: 2rem;
  min-height: 100vh;
  height: 100%;
`;

const LogoContainer = styled.div`
  max-height: 12rem;
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
  gap: 10rem;
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
  const location = useLocation();
  return (
    <SidebarContainer>
      <TopContainer>
        <Link to="/">
          <LogoContainer>
            <FullLogo />
          </LogoContainer>
        </Link>
        <MenuContainer>
          <Link to={"/dashboard"}>
            <SidebarItem
              text="Dashboard"
              icon="dashboard"
              active={location.pathname.includes("dashboard")}
            />
          </Link>
          <Link to={"/publish"}>
            <SidebarItem
              text="Publish"
              icon="mail"
              active={location.pathname.includes("publish")}
            />
          </Link>
          <Link to={"/profile"}>
            <SidebarItem
              text="My Profile"
              icon="profile"
              active={location.pathname.includes("profile")}
            />
          </Link>
        </MenuContainer>
      </TopContainer>
      <BottomContainer>
        <ExternalLink href={"https://docs.viaheadline.xyz/"}>
          <SidebarItem text="Guide" icon="library_book" />
        </ExternalLink>
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
