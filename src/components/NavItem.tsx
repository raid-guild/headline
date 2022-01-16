import React from "react";

type NavItemProps = {
  title: string;
};

const NavItem = ({ title }: NavItemProps) => {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
};

export default NavItem;
