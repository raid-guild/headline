import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HeaderContainer } from "components/Layout";
import FullLogo from "components/FullLogo";

const MobileHeaderContainer = styled(HeaderContainer)`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    width: 100%;
    height: auto;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 0 2.4rem;
    max-width: none;
    border-bottom: 1px solid;
    border-color: #f0efef;
  }
`;

const LogoContainer = styled.div`
  direction: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    justify-content: flex-start;
    padding-bottom: 1.6rem;
  }
`;

const MobileHeader = () => {
  return (
    <MobileHeaderContainer>
      <LogoContainer>
        <FullLogo />
      </LogoContainer>
    </MobileHeaderContainer>
  );
};

export default MobileHeader;
