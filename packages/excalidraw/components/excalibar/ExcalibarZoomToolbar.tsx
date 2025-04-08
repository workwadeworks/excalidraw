import Stack from "@excalidraw/excalidraw/components/Stack";
import { Island } from "@excalidraw/excalidraw/components/Island";

import type { ActionManager } from "@excalidraw/excalidraw/actions/manager";

type ExcalibarZoomToolbarProps = {
  actionManager: ActionManager;
};

export const ExcalibarZoomToolbar = ({
  actionManager,
}: ExcalibarZoomToolbarProps) => {
  return (
    <Island
      padding={0}
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
      }}
    >
      <Stack.Col align="center">
        {/* {actionManager.renderAction("zoomOut")} */}
        {actionManager.renderAction("resetZoom")}
        {/* {actionManager.renderAction("zoomIn")} */}
      </Stack.Col>
    </Island>
  );
};
