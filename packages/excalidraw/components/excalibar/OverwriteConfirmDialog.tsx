import React from "react";

import { useAtom } from "../../editor-jotai";
import { Dialog } from "../Dialog";
import { FilledButton } from "../FilledButton";
import { alertTriangleIcon } from "../icons";

import { Actions } from "../OverwriteConfirm/OverwriteConfirmActions";
import { overwriteConfirmStateAtom } from "../OverwriteConfirm/OverwriteConfirmState";
import { useExcalidrawSetAppState } from "../App";

import "../OverwriteConfirm/OverwriteConfirm.scss";

export const OverwriteConfirmDialog = () => {
  const [overwriteConfirmState, setState] = useAtom(overwriteConfirmStateAtom);
  const setAppState = useExcalidrawSetAppState();

  if (!overwriteConfirmState.active) {
    return null;
  }

  const handleClose = () => {
    overwriteConfirmState.onClose();
    setState((state) => ({ ...state, active: false }));
    setAppState({ openDialog: null });
  };

  const handleConfirm = () => {
    overwriteConfirmState.onConfirm();
    setState((state) => ({ ...state, active: false }));
    setAppState({ openDialog: null });
  };

  return (
    <Dialog onCloseRequest={handleClose} title={false} size={916}>
      <div className="OverwriteConfirm">
        <h3>{overwriteConfirmState.title}</h3>
        <div
          className={`OverwriteConfirm__Description OverwriteConfirm__Description--color-${overwriteConfirmState.color}`}
        >
          <div className="OverwriteConfirm__Description__icon">
            {alertTriangleIcon}
          </div>
          <div>{overwriteConfirmState.description}</div>
          <div className="OverwriteConfirm__Description__spacer"></div>
          <FilledButton
            color={overwriteConfirmState.color}
            size="large"
            label={overwriteConfirmState.actionLabel}
            onClick={handleConfirm}
          />
        </div>
        <Actions.SaveToDisk />
        <Actions.ExportToImage />
      </div>
    </Dialog>
  );
};
