import React from "react";
import styled from "styled-components";
import { Button } from "reakit/Button";

import Icon from "components/Icon";
import arrow from "assets/arrow_back.svg";
import { ThemeIconSize } from "theme";
import { useNavigate } from "react-router-dom";

type Props = {
  size: ThemeIconSize;
  onClick?: () => void;
};

const StyledButton = styled(Button)`
  border: none;
  padding: 0rem;
  background: none;
  cursor: pointer;
`;

const BackButton = ({ size, onClick }: Props) => {
  const navigate = useNavigate();
  const fallback = () => navigate(-1);
  const click = onClick && fallback;
  return (
    <StyledButton onClick={click}>
      <Icon size={size} src={arrow} alt="back button" />
    </StyledButton>
  );
};

export default BackButton;
