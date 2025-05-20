import clsx from "clsx";

// import LibraryMenuBrowseButton from "./LibraryMenuBrowseButton";
import LibraryImportButton from "./excalibar/LibraryImportButton";

import type { UIAppState } from "../types";
import type Library from "../data/library";

export const LibraryMenuControlButtons = ({
  // @Excalibar
  // libraryReturnUrl,
  // theme,
  // id,
  setAppState,
  library,

  style,
  children,
  className,
}: {
  // @Excalibar
  // libraryReturnUrl: ExcalidrawProps["libraryReturnUrl"];
  // theme: UIAppState["theme"];
  // id: string;
  setAppState: React.Component<any, UIAppState>["setState"];
  library: Library;

  style: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx("library-menu-control-buttons", className)}
      style={style}
    >
      {/* @Excalibar
      <LibraryMenuBrowseButton
        id={id}
        libraryReturnUrl={libraryReturnUrl}
        theme={theme}
      /> */}
      <LibraryImportButton setAppState={setAppState} library={library} />
      {children}
    </div>
  );
};
