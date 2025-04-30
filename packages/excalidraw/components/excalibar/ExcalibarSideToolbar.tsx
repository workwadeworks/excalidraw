import { HandButton } from "@excalidraw/excalidraw/components/HandButton";
import { LockButton } from "@excalidraw/excalidraw/components/LockButton";
import { Island } from "@excalidraw/excalidraw/components/Island";

import type { UIAppState } from "@excalidraw/excalidraw/types";
import type { ActionManager } from "@excalidraw/excalidraw/actions/manager";

import { t } from "../../i18n";

import { ExcalibarSidebarTrigger } from "./ExcalibarSidebar";

type ExcalibarSideToolbarProps = {
  appState: UIAppState;
  actionManager: ActionManager;
  onLockToggle: () => void;
  onHandToolToggle: () => void;
  // onPenModeToggle: AppClassProperties["togglePenMode"];
};

export const ExcalibarSideToolbar = ({
  appState,
  actionManager,
  onLockToggle,
  onHandToolToggle,
}: ExcalibarSideToolbarProps) => {
  return (
    <Island className="mobile-misc-tools-container">
      {!appState.viewModeEnabled &&
        appState.openDialog?.name !== "elementLinkSelector" && (
          <ExcalibarSidebarTrigger />
        )}

      {/* <PenModeButton
        checked={appState.penMode}
        onChange={() => onPenModeToggle(null)}
        title={t("toolBar.penMode")}
        isMobile
        penDetected={appState.penDetected}
      /> */}
      <LockButton
        checked={appState.activeTool.locked}
        onChange={onLockToggle}
        title={t("toolBar.lock")}
        isMobile
      />
      <HandButton
        checked={appState.activeTool.type === "hand"}
        onChange={onHandToolToggle}
        title={t("toolBar.hand")}
        isMobile
      />
      {actionManager.renderAction("undo")}
      {actionManager.renderAction("redo")}
    </Island>
  );
};
