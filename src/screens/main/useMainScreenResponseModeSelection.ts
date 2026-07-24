import { useCallback } from "react";

import { PROVIDER_LABELS } from "../../constants/models";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import type { ResponseMode, Settings } from "../../types";
import { hasProviderCredentialForCapability } from "../../utils/providerCredentials";
import { getResponseModeRoute } from "../../utils/responseModes";
import type { ShowToastFn, TranslateFn } from "./shared";

interface MainScreenResponseModeSelectionParams {
  activeResponseMode: ResponseMode;
  settings: Settings;
  showToast: ShowToastFn;
  t: TranslateFn;
  updateActiveResponseMode: (mode: ResponseMode) => void;
}

export function useMainScreenResponseModeSelection({
  activeResponseMode,
  settings,
  showToast,
  t,
  updateActiveResponseMode,
}: MainScreenResponseModeSelectionParams) {
  return useCallback(
    (nextMode: ResponseMode) => {
      const nextRoute = getResponseModeRoute(settings, nextMode);
      const nextProvider = nextRoute.provider;

      recordDebugLogEvent({
        event: "response-mode-change-requested",
        payload: {
          currentMode: activeResponseMode,
          nextMode,
          nextProvider,
        },
      });

      if (
        !hasProviderCredentialForCapability(
          nextProvider,
          settings.apiKeys[nextProvider],
          "llm",
        )
      ) {
        recordDebugLogEvent({
          event: "response-mode-change-blocked",
          level: "warn",
          payload: {
            missingProviderKey: nextProvider,
            nextMode,
          },
        });
        showToast(
          t("addProviderKeyToEnableProvider", {
            provider: PROVIDER_LABELS[nextProvider],
          }),
        );
        return;
      }

      recordDebugLogEvent({
        event: "response-mode-change-applied",
        payload: {
          nextMode,
          nextProvider,
        },
      });
      updateActiveResponseMode(nextMode);
    },
    [
      activeResponseMode,
      settings,
      showToast,
      t,
      updateActiveResponseMode,
    ],
  );
}
