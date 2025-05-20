import { t } from "../../i18n";
import { fileOpen } from "../../data/filesystem";

import type Library from "../../data/library";
import type { UIAppState } from "../../types";

const LibraryImportButton: React.FC<{
  setAppState: React.Component<any, UIAppState>["setState"];
  library: Library;
}> = ({ setAppState, library }) => {
  const onLibraryImport = async () => {
    try {
      await library.updateLibrary({
        libraryItems: fileOpen({
          description: "Excalidraw library files",
          extensions: ["excalidrawlib"],
        }),
        merge: true,
        openLibraryMenu: true,
      });
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.warn(error);
        return;
      }
      setAppState({ errorMessage: t("errors.importLibraryError") });
    }
  };

  return (
    <button
      className="library-menu-browse-button"
      onClick={onLibraryImport}
      data-testid="lib-dropdown--load"
    >
      {t("buttons.importLibrary")}
    </button>
  );
};

export default LibraryImportButton;
