import { useEffect } from "react";
import { AppState } from "react-native";

import { recordDebugLogEvent } from "../../../services/debugLogCapture";

interface UseVoiceSessionAppStateParams {
  hasActiveVoiceCaptureNow: () => boolean;
  onBackgroundSubmitError: (error: unknown) => void;
  stopVoiceCapture: () => Promise<void>;
}

export function useVoiceSessionAppState({
  hasActiveVoiceCaptureNow,
  onBackgroundSubmitError,
  stopVoiceCapture,
}: UseVoiceSessionAppStateParams) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "background") {
        return;
      }

      if (!hasActiveVoiceCaptureNow()) {
        return;
      }

      recordDebugLogEvent({
        event: "voice-capture-background-submit-requested",
      });
      void stopVoiceCapture()
        .then(() => {
          recordDebugLogEvent({
            event: "voice-capture-background-submit-completed",
          });
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "voice-capture-background-submit-failed",
            level: "error",
            payload: {
              message: error instanceof Error ? error.message : String(error),
            },
          });
          onBackgroundSubmitError(error);
        });
    });

    return () => {
      subscription.remove();
    };
  }, [
    hasActiveVoiceCaptureNow,
    onBackgroundSubmitError,
    stopVoiceCapture,
  ]);
}
