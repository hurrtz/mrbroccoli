import { useEffect } from "react";
import { NativeModules, Platform } from "react-native";

import { recordDebugLogEvent } from "../services/debugLogCapture";

interface ModelDownloadNativeModule {
  beginDownload: (title: string, body: string) => Promise<boolean>;
  endDownload: () => Promise<boolean>;
}

function getNativeModule(): ModelDownloadNativeModule | null {
  if (Platform.OS !== "android") {
    return null;
  }
  const nativeModule = (
    NativeModules as Record<string, ModelDownloadNativeModule | undefined>
  ).MrBroccoliModelDownload;
  return nativeModule ?? null;
}

/**
 * Keeps a model download running when the user leaves the app.
 *
 * Downloads happen inside the app process, so Doze, battery saver, and an app
 * switch all cut them off within about a minute. A wake lock only answers the
 * screen-off case while the app is still in front. Android's answer to work
 * the user started and is waiting on is a foreground service, which this
 * promotes for the duration of the transfer.
 *
 * iOS needs nothing here: its long transfers already run on a background URL
 * session.
 */
export function useModelDownloadService(
  active: boolean,
  copy: { body: string; title: string },
) {
  const { body, title } = copy;

  useEffect(() => {
    const nativeModule = getNativeModule();
    if (!nativeModule || !active) {
      return;
    }

    let released = false;
    void nativeModule
      .beginDownload(title, body)
      .then((promoted) => {
        recordDebugLogEvent({
          event: "model-download-service-started",
          payload: { promoted },
        });
      })
      .catch((error) => {
        recordDebugLogEvent({
          event: "model-download-service-failed",
          level: "warn",
          payload: { error },
        });
      });

    return () => {
      if (released) {
        return;
      }
      released = true;
      void nativeModule.endDownload().catch((error) => {
        recordDebugLogEvent({
          event: "model-download-service-release-failed",
          level: "warn",
          payload: { error },
        });
      });
    };
  }, [active, body, title]);
}
