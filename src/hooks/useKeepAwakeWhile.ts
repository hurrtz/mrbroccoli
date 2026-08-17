import { useEffect } from "react";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

import { recordDebugLogEvent } from "../services/debugLogCapture";

/**
 * Holds the screen wake lock while `active` is true.
 *
 * Voice sessions and optional speech-model downloads can run longer than the
 * default screen timeout. The release deliberately waits for an in-flight
 * activation to settle, so a fast unmount cannot strand a wake lock; keeping
 * that behavior in one place stops callers from drifting apart.
 */
export function useKeepAwakeWhile(active: boolean, tag: string) {
  useEffect(() => {
    if (!active) {
      return;
    }

    let mounted = true;
    const activation = activateKeepAwakeAsync(tag)
      .then(() => {
        if (!mounted) {
          return;
        }
        recordDebugLogEvent({
          event: "keep-awake-activated",
          payload: { tag },
        });
      })
      .catch((error) => {
        recordDebugLogEvent({
          event: "keep-awake-failed",
          level: "warn",
          payload: { error, tag },
        });
      });

    return () => {
      mounted = false;
      // If native activation is still in flight, release after it settles so
      // a fast pause/unmount cannot leave a late wake lock behind.
      void activation
        .finally(() => deactivateKeepAwake(tag))
        .then(() => {
          recordDebugLogEvent({
            event: "keep-awake-deactivated",
            payload: { tag },
          });
        })
        .catch((error) => {
          recordDebugLogEvent({
            event: "keep-awake-release-failed",
            level: "warn",
            payload: { error, tag },
          });
        });
    };
  }, [active, tag]);
}
