import React from "react";
import styled from "styled-components";

import logo from "assets/logo-full-new.svg";

type Props = {
  className?: string;
};

const Logo = styled.img`
  height: 4.8rem;
`;

const FullLogo = ({ className }: Props) => {
  return <Logo className={className} src={logo} alt="Web3 newsletter Logo" />;
};

export default FullLogo;
