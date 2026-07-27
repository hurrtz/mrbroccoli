import React from "react";
import {
  ResponseMode,
  ResponseModeSelections,
} from "../types";
import { getResponseModeIds } from "../utils/responseModes";
import { ResponseModeCardList } from "./responseModeToggle/ResponseModeCardList";
import { ResponseModeOverflowSelector } from "./responseModeToggle/ResponseModeOverflowSelector";

interface ResponseModeToggleProps {
  compact?: boolean;
  selected: ResponseMode;
  onSelect: (mode: ResponseMode) => void;
  modes: ResponseModeSelections;
  readyModes?: ResponseMode[];
}

export { getResponseModeCardModelLabels } from "./responseModeToggle/modelLabels";

export function ResponseModeToggle({
  compact = false,
  selected,
  onSelect,
  modes,
  readyModes = getResponseModeIds(modes),
}: ResponseModeToggleProps) {
  if (modes.length >= 4) {
    return (
      <ResponseModeOverflowSelector
        compact={compact}
        modes={modes}
        onSelect={onSelect}
        readyModes={readyModes}
        selected={selected}
      />
    );
  }

  return (
    <ResponseModeCardList
      compact={compact}
      modes={modes}
      onSelect={onSelect}
      readyModes={readyModes}
      selected={selected}
    />
  );
}
