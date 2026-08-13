import { useCallback, useState } from "react";

import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { Settings } from "../../types";
import type { TranslateFn } from "./shared";

export const ULRA_MODE_MODEL_WARNING_THRESHOLD = 4;
export const ULRA_MODE_ROUND_WARNING_THRESHOLD = 3;

export function getUlraModeCallCount(modelCount: number, rounds: number) {
  return modelCount * (rounds + 1) + 1;
}

export function useUlraModeControl({
  availableModelCount,
  settings,
  t,
  updateSettings,
}: {
  availableModelCount: number;
  settings: Pick<
    Settings,
    | "ulraModeActive"
    | "ulraModeEnabled"
    | "ulraModeRounds"
    | "ulraModeWarningAcknowledged"
  >;
  t: TranslateFn;
  updateSettings: (partial: Partial<Settings>) => void;
}) {
  const [confirmation, setConfirmation] = useState<{
    calls: number;
    message: string;
    models: number;
    rounds: number;
    title: string;
  } | null>(null);
  const available =
    settings.ulraModeEnabled && availableModelCount > 1;
  const active = available && settings.ulraModeActive;

  const handleToggle = useCallback(() => {
    if (active) {
      recordDebugLogEvent({ event: "ulra-mode-disabled-from-home" });
      updateSettings({ ulraModeActive: false });
      return;
    }
    if (!available) {
      return;
    }

    const calls = getUlraModeCallCount(
      availableModelCount,
      settings.ulraModeRounds,
    );
    const exceedsWarningThreshold =
      availableModelCount > ULRA_MODE_MODEL_WARNING_THRESHOLD ||
      settings.ulraModeRounds > ULRA_MODE_ROUND_WARNING_THRESHOLD;
    const acknowledgeAndEnable = () => {
      recordDebugLogEvent({
        event: "ulra-mode-enabled-from-home",
        payload: {
          calls,
          models: availableModelCount,
          rounds: settings.ulraModeRounds,
        },
      });
      updateSettings({
        ulraModeActive: true,
        ulraModeWarningAcknowledged: true,
      });
    };

    if (
      !settings.ulraModeWarningAcknowledged ||
      exceedsWarningThreshold
    ) {
      setConfirmation({
        calls,
        message: t(
          exceedsWarningThreshold
            ? "ulraModeHighRiskMessage"
            : "ulraModeFirstUseMessage",
          {
            calls,
            models: availableModelCount,
            rounds: settings.ulraModeRounds,
          },
        ),
        models: availableModelCount,
        rounds: settings.ulraModeRounds,
        title: exceedsWarningThreshold
          ? t("ulraModeHighRiskTitle")
          : t("ulraModeFirstUseTitle"),
      });
      return;
    }

    acknowledgeAndEnable();
  }, [
    active,
    available,
    availableModelCount,
    settings.ulraModeRounds,
    settings.ulraModeWarningAcknowledged,
    t,
    updateSettings,
  ]);

  const cancelConfirmation = useCallback(() => setConfirmation(null), []);
  const confirmEnable = useCallback(() => {
    if (!confirmation) {
      return;
    }
    recordDebugLogEvent({
      event: "ulra-mode-enabled-from-home",
      payload: {
        calls: confirmation.calls,
        models: confirmation.models,
        rounds: confirmation.rounds,
      },
    });
    updateSettings({
      ulraModeActive: true,
      ulraModeWarningAcknowledged: true,
    });
    setConfirmation(null);
  }, [confirmation, updateSettings]);

  return {
    active,
    available,
    cancelConfirmation,
    confirmation,
    confirmEnable,
    handleToggle,
  };
}
