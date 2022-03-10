import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { HeaderContainer } from "components/Layout";
import FullLogo from "components/FullLogo";

const MobileHeaderContainer = styled(HeaderContainer)`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    width: 100%;
    align-items: flex-start;
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
    padding: 1.2rem 2.4rem;
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
