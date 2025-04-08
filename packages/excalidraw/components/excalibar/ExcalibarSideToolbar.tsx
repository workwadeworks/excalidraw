import { HandButton } from "@excalidraw/excalidraw/components/HandButton";
import { LockButton } from "@excalidraw/excalidraw/components/LockButton";
import { Island } from "@excalidraw/excalidraw/components/Island";

import type { UIAppState } from "@excalidraw/excalidraw/types";
import type { ActionManager } from "@excalidraw/excalidraw/actions/manager";

import { useTunnels } from "../../context/tunnels";
import { t } from "../../i18n";

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
  const { DefaultSidebarTriggerTunnel } = useTunnels();

  return (
    <Island className="mobile-misc-tools-container">
      {/* @Excalibar TODO: 터널 풀기 */}
      {!appState.viewModeEnabled &&
        appState.openDialog?.name !== "elementLinkSelector" && (
          <DefaultSidebarTriggerTunnel.Out />
        )}

      {/* @Excalibar TODO: Toggle View Mode 버튼 추가 */}
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
