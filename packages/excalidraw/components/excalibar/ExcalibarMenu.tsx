import { Island } from "@excalidraw/excalidraw/components/Island";
import DropdownMenu from "@excalidraw/excalidraw/components/dropdownMenu/DropdownMenu";
import { useExcalidrawSetAppState } from "@excalidraw/excalidraw/components/App";
import {
  HamburgerMenuIcon,
  settingsIcon,
} from "@excalidraw/excalidraw/components/icons";
import MainMenu from "@excalidraw/excalidraw/components/main-menu/MainMenu";
import { getShortcutFromShortcutName } from "@excalidraw/excalidraw/actions/shortcuts";
import { showSelectedShapeActions } from "@excalidraw/element/showSelectedShapeActions";
import { SelectedShapeActions } from "@excalidraw/excalidraw/components/Actions";

import type {
  AppClassProperties,
  UIAppState,
} from "@excalidraw/excalidraw/types";
import type { ActionManager } from "@excalidraw/excalidraw/actions/manager";
import type { NonDeletedExcalidrawElement } from "@excalidraw/element/types";

type ExcalibarMenuProps = {
  appState: UIAppState;
  actionManager: ActionManager;
  elements: readonly NonDeletedExcalidrawElement[];
  app: AppClassProperties;
};

export const ExcalibarMenu = ({
  appState,
  actionManager,
  elements,
  app,
}: ExcalibarMenuProps) => {
  const setAppState = useExcalidrawSetAppState();

  return (
    <Island padding={0}>
      <DropdownMenu open={appState.openMenu === "canvas"}>
        <DropdownMenu.Trigger
          onToggle={() => {
            setAppState({
              openMenu: appState.openMenu === "canvas" ? null : "canvas",
            });
          }}
          data-testid="main-menu-trigger"
          className="main-menu-trigger"
        >
          {HamburgerMenuIcon}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          onClickOutside={() => setAppState({ openMenu: null })}
          onSelect={() => {
            setAppState({ openMenu: null });
          }}
        >
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SaveToActiveFile />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          {/* <MainMenu.Separator />
          <MainMenu.Group title="Excalidraw links">
            <MainMenu.DefaultItems.Socials />
          </MainMenu.Group> */}
          <MainMenu.Separator />
          <MainMenu.Item
            icon={settingsIcon}
            onSelect={() => {}}
            data-testid="load-button"
            shortcut={getShortcutFromShortcutName("settings")}
            aria-label="Settings..."
          >
            Settings...
          </MainMenu.Item>
          <MainMenu.DefaultItems.ToggleTheme
            allowSystemTheme
            theme={appState.theme}
            onSelect={() => {}} // @Excalibar TODO
          />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
        </DropdownMenu.Content>
      </DropdownMenu>
      {actionManager.renderAction("toggleEditMenu")}
      {appState.openMenu === "shape" &&
        showSelectedShapeActions(appState, elements) && (
          <SelectedShapeActions
            appState={appState}
            elementsMap={app.scene.getNonDeletedElementsMap()}
            renderAction={actionManager.renderAction}
            app={app}
          />
        )}
      {actionManager.renderAction(
        appState.multiElement ? "finalize" : "duplicateSelection",
      )}
      {actionManager.renderAction("deleteSelectedElements")}
    </Island>
  );
};
