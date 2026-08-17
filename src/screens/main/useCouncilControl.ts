import { useCallback, useEffect, useState } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { Settings } from "../../types";

export const COUNCIL_MAX_TOTAL_ROUNDS = 5;

export function useCouncilControl({
  activeResponseMode,
  availableModeIds,
  settings,
  updateSettings,
}: {
  activeResponseMode: string;
  availableModeIds: string[];
  settings: Pick<
    Settings,
    "ulraModeActive" | "ulraModeEnabled" | "ulraModeRounds"
  >;
  updateSettings: (partial: Partial<Settings>) => void;
}) {
  const [selectedModeIds, setSelectedModeIds] = useState<string[]>(() =>
    settings.ulraModeActive
      ? availableModeIds
      : availableModeIds.includes(activeResponseMode)
        ? [activeResponseMode]
        : availableModeIds.slice(0, 1),
  );
  const available = settings.ulraModeEnabled && availableModeIds.length > 1;
  const active = available && selectedModeIds.length > 1;
  const totalRounds = Math.max(
    1,
    Math.min(COUNCIL_MAX_TOTAL_ROUNDS, settings.ulraModeRounds + 1),
  );

  useEffect(() => {
    setSelectedModeIds((current) => {
      const ready = current.filter((id) => availableModeIds.includes(id));
      if (ready.length > 0 || availableModeIds.length === 0) {
        return ready.length === current.length &&
          ready.every((id, index) => id === current[index])
          ? current
          : ready;
      }
      return availableModeIds.includes(activeResponseMode)
        ? [activeResponseMode]
        : availableModeIds.slice(0, 1);
    });
  }, [activeResponseMode, availableModeIds]);

  useEffect(() => {
    if (settings.ulraModeActive && !active) {
      updateSettings({ ulraModeActive: false });
    }
  }, [active, settings.ulraModeActive, updateSettings]);

  const toggleMode = useCallback(
    (modeId: string) => {
      if (!availableModeIds.includes(modeId) || !settings.ulraModeEnabled) {
        return;
      }
      setSelectedModeIds((current) => {
        const next = current.includes(modeId)
          ? current.filter((id) => id !== modeId)
          : [...current, modeId];
        const nextActive = next.length > 1;
        recordDebugLogEvent({
          event: "council-membership-changed-from-home",
          payload: { active: nextActive, members: next.length },
        });
        updateSettings({
          ulraModeActive: nextActive,
          ulraModeWarningAcknowledged: true,
        });
        return next;
      });
    },
    [availableModeIds, settings.ulraModeEnabled, updateSettings],
  );

  const setTotalRounds = useCallback(
    (rounds: number) => {
      const next = Math.max(
        1,
        Math.min(COUNCIL_MAX_TOTAL_ROUNDS, Math.round(rounds)),
      );
      recordDebugLogEvent({
        event: "council-rounds-changed-from-home",
        payload: { rounds: next },
      });
      // Persistence counts review passes after the initial answer round. The
      // approved workspace names the truthful total number of rounds instead.
      updateSettings({ ulraModeRounds: next - 1 });
    },
    [updateSettings],
  );

  return {
    active,
    available,
    selectedModeIds,
    setTotalRounds,
    toggleMode,
    totalRounds,
  };
}
