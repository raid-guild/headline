import React from "react";
import styled from "styled-components";
import { Button } from "reakit/Button";

import Icon from "components/Icon";
import arrow from "assets/arrow_back.svg";
import { ThemeIconSize } from "theme";
import { useNavigate } from "react-router-dom";

type Props = {
  size: ThemeIconSize;
};

const StyledButton = styled(Button)`
  border: none;
  padding: 0rem;
`;

const BackButton = ({ size }: Props) => {
  const navigate = useNavigate();
  return (
    <StyledButton onClick={() => navigate(-1)}>
      <Icon size={size} src={arrow} alt="back button" />
    </StyledButton>
  );
};

export default BackButton;
