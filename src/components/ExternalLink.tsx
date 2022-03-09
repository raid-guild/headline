import React, { HTMLAttributes } from "react";

type LocalProps = {
  href: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
};

type Props = LocalProps & HTMLAttributes<HTMLAnchorElement>;

const ExternalLink = ({ children, href, target, rel, ...rest }: Props) => {
  return (
    <a
      href={href}
      target={target || "_blank"}
      rel={rel || "noopener noreferrer"}
      {...rest}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
