import React, { MouseEvent } from "react";
import { useSnackbar } from "notistack";
import { DOMAIN } from "../constants";
import share from "assets/share.svg";

type Props = {
  to: string;
};

const Share = ({ to }: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    enqueueSnackbar("Copied", { variant: "success" });
    navigator.clipboard.writeText(`${DOMAIN}/#${to}`);
  };

  return (
    <div onClick={handleClick}>
      <img src={share} alt="share link" />
    </div>
  );
};

export default Share;
