import { t } from "@excalidraw/excalidraw/i18n";
import { calculateScrollCenter } from "@excalidraw/excalidraw/scene";

import type { AppState, UIAppState } from "@excalidraw/excalidraw/types";
import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

export const ScrollBackButton = ({
  appState,
  setAppState,
  elements,
}: {
  appState: UIAppState;
  setAppState: React.Component<any, AppState>["setState"];
  elements: readonly NonDeletedExcalidrawElement[];
}) => {
  // @Excalibar TODO: Device에 따라 조건식 처리 확인 후 추가
  if (!appState.scrolledOutside || appState.openMenu || appState.openSidebar) {
    return null;
  }

  return (
    <button
      type="button"
      className="scroll-back-to-content"
      onClick={() => {
        setAppState((appState) => ({
          ...calculateScrollCenter(elements, appState),
        }));
      }}
    >
      {t("buttons.scrollBackToContent")}
    </button>
  );
};
