import React from "react";

import { arrayToMap, isShallowEqual } from "@excalidraw/common";
import { mutateElement } from "@excalidraw/element/mutateElement";
import { ShapeCache } from "@excalidraw/element/ShapeCache";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import { actionToggleStats } from "../../actions";
import { UIAppStateContext } from "../../context/ui-appState";
import { useAtom } from "../../editor-jotai";

import { LoadingMessage } from "../LoadingMessage";
import { ActiveConfirmDialog } from "../ActiveConfirmDialog";
import { TTDDialog } from "../TTDDialog/TTDDialog";
import { Stats } from "../Stats";
import ElementLinkDialog from "../ElementLinkDialog";
import { ErrorDialog } from "../ErrorDialog";
import { EyeDropper, activeEyeDropperAtom } from "../EyeDropper";
import { HelpDialog } from "../HelpDialog";
import { ImageExportDialog } from "../ImageExportDialog";
import { JSONExportDialog } from "../JSONExportDialog";

import "../LayerUI.scss";
import "../Toolbar.scss";

import { ExcalibarSideToolbar } from "./ExcalibarSideToolbar";
import { ExcalibarMenu } from "./ExcalibarMenu";
import { ExcalibarZoomToolbar } from "./ExcalibarZoomToolbar";
import { ScrollBackButton } from "./ScrollBackButton";
import { ExcalibarSidebar } from "./ExcalibarSidebar";

import type { ActionManager } from "../../actions/manager";
import type {
  AppProps,
  AppState,
  BinaryFiles,
  UIAppState,
  AppClassProperties,
} from "../../types";

interface ExcalibarUIProps {
  actionManager: ActionManager;
  appState: UIAppState;
  files: BinaryFiles;
  canvas: HTMLCanvasElement;
  setAppState: React.Component<any, AppState>["setState"];
  elements: readonly NonDeletedExcalidrawElement[];
  onLockToggle: () => void;
  onHandToolToggle: () => void;
  UIOptions: AppProps["UIOptions"];
  onExportImage: AppClassProperties["onExportImage"];
  app: AppClassProperties;
  generateLinkForSelection?: AppProps["generateLinkForSelection"];
}

const ExcalibarUi = ({
  actionManager,
  appState,
  files,
  canvas,
  setAppState,
  elements,
  onLockToggle,
  onHandToolToggle,
  UIOptions,
  onExportImage,
  app,
  generateLinkForSelection,
}: ExcalibarUIProps) => {
  const [eyeDropperState, setEyeDropperState] = useAtom(activeEyeDropperAtom);

  const ExcalibarUiJsx = (
    <>
      {appState.isLoading && <LoadingMessage delay={250} />}
      {appState.errorMessage && (
        <ErrorDialog onClose={() => setAppState({ errorMessage: null })}>
          {appState.errorMessage}
        </ErrorDialog>
      )}

      <ExcalibarSidebar />

      {eyeDropperState && (
        <EyeDropper
          colorPickerType={eyeDropperState.colorPickerType}
          onCancel={() => {
            setEyeDropperState(null);
          }}
          onChange={(colorPickerType, color, selectedElements, { altKey }) => {
            if (
              colorPickerType !== "elementBackground" &&
              colorPickerType !== "elementStroke"
            ) {
              return;
            }

            if (selectedElements.length) {
              for (const element of selectedElements) {
                mutateElement(element, arrayToMap(elements), {
                  [altKey && eyeDropperState.swapPreviewOnAlt
                    ? colorPickerType === "elementBackground"
                      ? "strokeColor"
                      : "backgroundColor"
                    : colorPickerType === "elementBackground"
                    ? "backgroundColor"
                    : "strokeColor"]: color,
                });
                ShapeCache.delete(element);
              }
              app.scene.triggerUpdate();
            } else if (colorPickerType === "elementBackground") {
              setAppState({
                currentItemBackgroundColor: color,
              });
            } else {
              setAppState({ currentItemStrokeColor: color });
            }
          }}
          onSelect={(color, event) => {
            setEyeDropperState((state) => {
              return state?.keepOpenOnAlt && event.altKey ? state : null;
            });
            eyeDropperState?.onSelect?.(color, event);
          }}
        />
      )}
      {appState.stats.open &&
        !appState.zenModeEnabled &&
        !appState.viewModeEnabled &&
        appState.openDialog?.name !== "elementLinkSelector" && (
          <Stats
            app={app}
            onClose={() => {
              actionManager.executeAction(actionToggleStats);
            }}
            renderCustomStats={undefined}
          />
        )}

      {appState.openDialog?.name === "ttd" && <TTDDialog __fallback />}
      {appState.openDialog?.name === "help" && (
        <HelpDialog
          onClose={() => {
            setAppState({ openDialog: null });
          }}
        />
      )}
      {appState.openDialog?.name === "elementLinkSelector" && (
        <ElementLinkDialog
          sourceElementId={appState.openDialog.sourceElementId}
          onClose={() => {
            setAppState({
              openDialog: null,
            });
          }}
          scene={app.scene}
          appState={appState}
          generateLinkForSelection={generateLinkForSelection}
        />
      )}
      {appState.openDialog?.name === "jsonExport" && (
        <JSONExportDialog
          elements={elements}
          appState={appState}
          files={files}
          actionManager={actionManager}
          exportOpts={UIOptions.canvasActions.export}
          canvas={canvas}
          setAppState={setAppState}
        />
      )}
      {appState.openDialog?.name === "imageExport" && (
        <ImageExportDialog
          elements={elements}
          appState={appState}
          files={files}
          actionManager={actionManager}
          onExportImage={onExportImage}
          onCloseRequest={() => setAppState({ openDialog: null })}
          name={app.getName()}
        />
      )}
      <ActiveConfirmDialog />

      <ExcalibarSideToolbar
        appState={appState}
        actionManager={actionManager}
        onLockToggle={onLockToggle}
        onHandToolToggle={onHandToolToggle}
      ></ExcalibarSideToolbar>

      <footer role="contentinfo" className="App-bottom-bar">
        <ExcalibarMenu
          appState={appState}
          actionManager={actionManager}
          elements={elements}
          app={app}
        ></ExcalibarMenu>

        <ExcalibarZoomToolbar
          actionManager={actionManager}
        ></ExcalibarZoomToolbar>

        <ScrollBackButton
          appState={appState}
          setAppState={setAppState}
          elements={elements}
        ></ScrollBackButton>
      </footer>
    </>
  );

  return (
    <UIAppStateContext.Provider value={appState}>
      {ExcalibarUiJsx}
    </UIAppStateContext.Provider>
  );
};

const stripIrrelevantAppStateProps = (appState: AppState): UIAppState => {
  const {
    suggestedBindings,
    startBoundElement,
    cursorButton,
    scrollX,
    scrollY,
    ...ret
  } = appState;
  return ret;
};

const areEqual = (prevProps: ExcalibarUIProps, nextProps: ExcalibarUIProps) => {
  // short-circuit early
  // if (prevProps.children !== nextProps.children) {
  //   return false;
  // }

  const { canvas: _pC, appState: prevAppState, ...prev } = prevProps;
  const { canvas: _nC, appState: nextAppState, ...next } = nextProps;

  return (
    isShallowEqual(
      // asserting AppState because we're being passed the whole AppState
      // but resolve to only the UI-relevant props
      stripIrrelevantAppStateProps(prevAppState as AppState),
      stripIrrelevantAppStateProps(nextAppState as AppState),
      {
        selectedElementIds: isShallowEqual,
        selectedGroupIds: isShallowEqual,
      },
    ) && isShallowEqual(prev, next)
  );
};

export default React.memo(ExcalibarUi, areEqual);
