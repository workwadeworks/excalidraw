import {
  CANVAS_SEARCH_TAB,
  capitalizeString,
  DEFAULT_SIDEBAR,
  LIBRARY_SIDEBAR_TAB,
} from "@excalidraw/common";

import { trackEvent } from "../../analytics";
import { t } from "../../i18n";

import { useDevice } from "../App";
import { LibraryMenu } from "../LibraryMenu";
import { LibraryIcon, searchIcon } from "../icons";
import { Sidebar } from "../Sidebar/Sidebar";
import { SearchMenu } from "../SearchMenu";

export const ExcalibarSidebarTrigger = () => {
  const device = useDevice();

  return (
    <Sidebar.Trigger
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
      className="ToolIcon__icon"
      name={DEFAULT_SIDEBAR.name}
    />
  );
};

export const ExcalibarSidebar = () => {
  return (
    <Sidebar name="default" key="default" className="default-sidebar">
      <Sidebar.Tabs>
        <Sidebar.Header>
          <Sidebar.TabTriggers>
            <Sidebar.TabTrigger tab={CANVAS_SEARCH_TAB}>
              {searchIcon}
            </Sidebar.TabTrigger>
            <Sidebar.TabTrigger tab={LIBRARY_SIDEBAR_TAB}>
              {LibraryIcon}
            </Sidebar.TabTrigger>
          </Sidebar.TabTriggers>
        </Sidebar.Header>

        <Sidebar.Tab tab={LIBRARY_SIDEBAR_TAB}>
          <LibraryMenu />
        </Sidebar.Tab>
        <Sidebar.Tab tab={CANVAS_SEARCH_TAB}>
          <SearchMenu />
        </Sidebar.Tab>
      </Sidebar.Tabs>
    </Sidebar>
  );
};
