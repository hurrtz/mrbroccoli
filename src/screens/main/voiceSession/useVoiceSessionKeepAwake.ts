import { useEffect } from "react";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";

import { recordDebugLogEvent } from "../../../services/debugLogCapture";

const VOICE_SESSION_KEEP_AWAKE_TAG = "mrbroccoli-voice-session";

export function useVoiceSessionKeepAwake(active: boolean) {
  useEffect(() => {
    if (!active) {
      return;
    }

    let mounted = true;
    const activation = activateKeepAwakeAsync(VOICE_SESSION_KEEP_AWAKE_TAG)
      .then(() => {
        if (!mounted) {
          return;
        }
        recordDebugLogEvent({
          event: "voice-session-keep-awake-activated",
        });
      })
      .catch((error) => {
        recordDebugLogEvent({
          event: "voice-session-keep-awake-failed",
          level: "warn",
          payload: { error },
        });
      });

    return () => {
      mounted = false;
      // If native activation is still in flight, release after it settles so
      // a fast pause/unmount cannot leave a late wake lock behind.
      void activation.finally(() =>
        deactivateKeepAwake(VOICE_SESSION_KEEP_AWAKE_TAG),
      )
        .then(() => {
          recordDebugLogEvent({
            event: "voice-session-keep-awake-deactivated",
          });
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "voice-session-keep-awake-release-failed",
            level: "warn",
            payload: { error },
          });
        });
    };
  }, [active]);
}
