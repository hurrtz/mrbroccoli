import { useEffect } from "react";
import { AppState } from "react-native";

import { recordDebugLogEvent } from "../../../services/debugLogCapture";

interface UseVoiceSessionAppStateParams {
  allowBackgroundCapture?: boolean;
  hasActiveVoiceCaptureNow: () => boolean;
  onBackground?: () => void;
  onBackgroundSubmitError: (error: unknown) => void;
  stopVoiceCapture: () => Promise<void>;
}

export function useVoiceSessionAppState({
  allowBackgroundCapture = false,
  hasActiveVoiceCaptureNow,
  onBackground,
  onBackgroundSubmitError,
  stopVoiceCapture,
}: UseVoiceSessionAppStateParams) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState !== "background") {
        return;
      }

      if (allowBackgroundCapture) {
        recordDebugLogEvent({
          event: "voice-session-background-continuing",
        });
        return;
      }

      onBackground?.();

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
    allowBackgroundCapture,
    hasActiveVoiceCaptureNow,
    onBackground,
    onBackgroundSubmitError,
    stopVoiceCapture,
  ]);
}
