import React from "react";

const MenuSeparator = () => (
  <div
    style={{
      height: "1px",
      backgroundColor: "var(--default-border-color)",
      margin: "var(--space-factor) 0",
    }}
  />
);

export default MenuSeparator;
MenuSeparator.displayName = "DropdownMenuSeparator";
