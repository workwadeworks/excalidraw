import clsx from "clsx";
// @Excalibar
// import { useDevice } from "../App";

const MenuTrigger = ({
  className = "",
  children,
  onToggle,
  title,
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  onToggle: () => void;
  title?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onSelect">) => {
  // @Excalibar
  // const device = useDevice();
  const classNames = clsx(
    `dropdown-menu-button ${className}`,
    "zen-mode-transition",
    {
      // @Excalibar
      // "dropdown-menu-button--mobile": device.editor.isMobile,
    },
  ).trim();
  return (
    <button
      data-prevent-outside-click
      className={classNames}
      onClick={onToggle}
      type="button"
      data-testid="dropdown-menu-button"
      title={title}
      {...rest}
    >
      {children}
    </button>
  );
};

export default MenuTrigger;
MenuTrigger.displayName = "DropdownMenuTrigger";
