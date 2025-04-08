import clsx from "clsx";
import React from "react";

import {
  CLASSES,
  DEFAULT_SIDEBAR,
  TOOL_TYPE,
  capitalizeString,
  isShallowEqual,
} from "@excalidraw/common";

import { mutateElement } from "@excalidraw/element/mutateElement";

import { showSelectedShapeActions } from "@excalidraw/element/showSelectedShapeActions";

import { ShapeCache } from "@excalidraw/element/ShapeCache";

import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

import Scene from "../../scene/Scene";
import { actionToggleStats } from "../../actions";
import { trackEvent } from "../../analytics";
import { isHandToolActive } from "../../appState";
import { TunnelsContext, useInitializeTunnels } from "../../context/tunnels";
import { UIAppStateContext } from "../../context/ui-appState";
import { useAtom, useAtomValue } from "../../editor-jotai";

import { t } from "../../i18n";
import { calculateScrollCenter } from "../../scene";

import {
  CommandPalette,
  DEFAULT_CATEGORIES,
} from "../CommandPalette/CommandPalette";
import { SelectedShapeActions, ShapesSwitcher } from "../Actions";
import { LoadingMessage } from "../LoadingMessage";
import { LockButton } from "../LockButton";
import { MobileMenu } from "../MobileMenu";
import { PasteChartDialog } from "../PasteChartDialog";
import { Section } from "../Section";
import Stack from "../Stack";
import { UserList } from "../UserList";
import { PenModeButton } from "../PenModeButton";
import Footer from "../footer/Footer";
import { isSidebarDockedAtom } from "../Sidebar/Sidebar";
import MainMenu from "../main-menu/MainMenu";
import { ActiveConfirmDialog } from "../ActiveConfirmDialog";
import { useDevice } from "../App";
import { OverwriteConfirmDialog } from "../OverwriteConfirm/OverwriteConfirm";
import { LibraryIcon } from "../icons";
import { DefaultSidebar } from "../DefaultSidebar";
import { TTDDialog } from "../TTDDialog/TTDDialog";
import ElementLinkDialog from "../ElementLinkDialog";
import { ErrorDialog } from "../ErrorDialog";
import { EyeDropper, activeEyeDropperAtom } from "../EyeDropper";
import { HelpDialog } from "../HelpDialog";
import { ImageExportDialog } from "../ImageExportDialog";
import { JSONExportDialog } from "../JSONExportDialog";

import "../LayerUI.scss";
import "../Toolbar.scss";

import type { ActionManager } from "../../actions/manager";
import type {
  AppProps,
  AppState,
  BinaryFiles,
  UIAppState,
  AppClassProperties,
} from "../../types";

import { ExcalibarSideToolbar } from "./ExcalibarSideToolbar";
import { ExcalibarMenu } from "./ExcalibarMenu";
import { ExcalibarZoomToolbar } from "@excalidraw/excalidraw/components/excalibar/ExcalibarZoomToolbar";
import { ScrollBackButton } from "@excalidraw/excalidraw/components/excalibar/ScrollBackButton";

interface ExcalibarUIProps {
  actionManager: ActionManager;
  appState: UIAppState;
  files: BinaryFiles;
  canvas: HTMLCanvasElement;
  setAppState: React.Component<any, AppState>["setState"];
  elements: readonly NonDeletedExcalidrawElement[];
  onLockToggle: () => void;
  onHandToolToggle: () => void;
  // onPenModeToggle: AppClassProperties["togglePenMode"];
  // showExitZenModeBtn: boolean;
  // langCode: Language["code"];
  // renderTopRightUI?: ExcalidrawProps["renderTopRightUI"];
  // renderCustomStats?: ExcalidrawProps["renderCustomStats"];
  UIOptions: AppProps["UIOptions"];
  onExportImage: AppClassProperties["onExportImage"];
  // renderWelcomeScreen: boolean;
  // children?: React.ReactNode;
  app: AppClassProperties;
  // isCollaborating: boolean;
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
  const device = useDevice();
  const tunnels = useInitializeTunnels();

  const TunnelsJotaiProvider = tunnels.tunnelsJotai.Provider;

  const [eyeDropperState, setEyeDropperState] = useAtom(activeEyeDropperAtom);

  const renderSidebars = () => {
    return (
      <DefaultSidebar
        __fallback
        onDock={(docked) => {
          trackEvent(
            "sidebar",
            `toggleDock (${docked ? "dock" : "undock"})`,
            `(${device.editor.isMobile ? "mobile" : "desktop"})`,
          );
        }}
      />
    );
  };

  const isSidebarDocked = useAtomValue(isSidebarDockedAtom);

  const ExcalibarUiJsx = (
    <>
      {/* ------------------------- tunneled UI ---------------------------- */}
      <DefaultSidebar.Trigger
        __fallback
        icon={LibraryIcon}
        title={capitalizeString(t("toolBar.library"))}
        onToggle={(open) => {
          if (open) {
            trackEvent(
              "sidebar",
              `${DEFAULT_SIDEBAR.name} (open)`,
              `button (${device.editor.isMobile ? "mobile" : "desktop"})`,
            );
          }
        }}
        tab={DEFAULT_SIDEBAR.defaultTab}
      >
        {/*t("toolBar.library") //zsviczian */}
      </DefaultSidebar.Trigger>
      {appState.openDialog?.name === "ttd" && <TTDDialog __fallback />}
      {/* ------------------------------------------------------------------ */}

      {appState.isLoading && <LoadingMessage delay={250} />}
      {appState.errorMessage && (
        <ErrorDialog onClose={() => setAppState({ errorMessage: null })}>
          {appState.errorMessage}
        </ErrorDialog>
      )}

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
                mutateElement(
                  element,
                  {
                    [altKey && eyeDropperState.swapPreviewOnAlt
                      ? colorPickerType === "elementBackground"
                        ? "strokeColor"
                        : "backgroundColor"
                      : colorPickerType === "elementBackground"
                      ? "backgroundColor"
                      : "strokeColor"]: color,
                  },
                  false,
                );
                ShapeCache.delete(element);
              }
              Scene.getScene(selectedElements[0])?.triggerUpdate();
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
          elementsMap={app.scene.getNonDeletedElementsMap()}
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
      <TunnelsJotaiProvider>
        <TunnelsContext.Provider value={tunnels}>
          {ExcalibarUiJsx}
        </TunnelsContext.Provider>
      </TunnelsJotaiProvider>
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
