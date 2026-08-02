import { useCallback } from "react";

import type { Provider, Settings } from "../../../types";

import type { ShowToastFn, TranslateFn } from "../shared";

interface UseVoiceSessionGuardsParams {
  availableSttProviders: Provider[];
  availableTtsProviders: Provider[];
  nativeSttAvailable: boolean;
  promptSubmissionBlockMessage?: string | null;
  providerApiKey: string;
  providerLabel: string;
  settings: Pick<
    Settings,
    | "activeResponseMode"
    | "localSttModelId"
    | "localTtsModelId"
    | "responseModes"
    | "spokenRepliesEnabled"
    | "sttMode"
    | "ttsMode"
  >;
  showToast: ShowToastFn;
  sttApiKey: string;
  sttProvider: Provider | null;
  t: TranslateFn;
  ttsApiKey: string;
  ttsProvider: Provider | null;
}

export function useVoiceSessionGuards({
  availableSttProviders,
  availableTtsProviders,
  nativeSttAvailable,
  promptSubmissionBlockMessage,
  providerApiKey,
  providerLabel,
  settings,
  showToast,
  sttApiKey,
  sttProvider,
  t,
  ttsApiKey,
  ttsProvider,
}: UseVoiceSessionGuardsParams) {
  return useCallback(() => {
    const responseRoute = settings.responseModes?.find(
      (route) => route.id === settings.activeResponseMode,
    );
    if (responseRoute?.route.runtime !== "local" && !providerApiKey) {
      showToast(
        t("addProviderKeyToUseProvider", { provider: providerLabel }),
        undefined,
        "danger",
      );
      return false;
    }

    if (promptSubmissionBlockMessage) {
      showToast(promptSubmissionBlockMessage, undefined, "danger");
      return false;
    }

    if (settings.sttMode === "native" && !nativeSttAvailable) {
      showToast(t("speechRecognitionUnavailableOnDevice"), undefined, "danger");
      return false;
    }

    if (
      settings.sttMode === "provider" &&
      (!sttProvider ||
        !availableSttProviders.includes(sttProvider) ||
        !sttApiKey)
    ) {
      showToast(t("chooseSttBeforeVoiceSession"), undefined, "danger");
      return false;
    }

    if (settings.sttMode === "local" && !settings.localSttModelId) {
      showToast(t("chooseSttBeforeVoiceSession"), undefined, "danger");
      return false;
    }

    if (
      settings.spokenRepliesEnabled &&
      settings.ttsMode === "provider" &&
      (!ttsProvider ||
        !availableTtsProviders.includes(ttsProvider) ||
        !ttsApiKey)
    ) {
      showToast(t("chooseTtsBeforeSpokenReplies"), undefined, "danger");
      return false;
    }

    if (
      settings.spokenRepliesEnabled &&
      settings.ttsMode === "local" &&
      !settings.localTtsModelId
    ) {
      showToast(t("chooseTtsBeforeSpokenReplies"), undefined, "danger");
      return false;
    }

    return true;
  }, [
    availableSttProviders,
    availableTtsProviders,
    nativeSttAvailable,
    promptSubmissionBlockMessage,
    providerApiKey,
    providerLabel,
    settings,
    showToast,
    sttApiKey,
    sttProvider,
    t,
    ttsApiKey,
    ttsProvider,
  ]);
}
