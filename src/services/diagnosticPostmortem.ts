import { AppState, NativeModules } from "react-native";

import { recordDebugLogEvent } from "./debugLogCapture";

type NativePostmortemRecord = Record<string, unknown> & { source?: string };
type DiagnosticsNativeModule = {
  consumePostmortemRecords(): Promise<NativePostmortemRecord[]>;
};

type GlobalErrorUtils = {
  getGlobalHandler(): (error: Error, isFatal?: boolean) => void;
  setGlobalHandler(handler: (error: Error, isFatal?: boolean) => void): void;
};

const nativeModule = NativeModules.MrBroccoliDiagnostics as
  | DiagnosticsNativeModule
  | undefined;
let installed = false;

export function initializeDiagnosticPostmortem() {
  if (installed) return;
  installed = true;

  void nativeModule
    ?.consumePostmortemRecords()
    .then((records) => {
      records.slice(0, 8).forEach((record) => {
        recordDebugLogEvent({
          event: "previous-process-diagnostic",
          level: "warn",
          payload: record,
        });
      });
    })
    .catch((error) => {
      recordDebugLogEvent({
        event: "postmortem-read-failed",
        level: "warn",
        payload: { error },
      });
    });

  let previousState = AppState.currentState;
  AppState.addEventListener("change", (nextState) => {
    recordDebugLogEvent({
      event: "app-state-changed",
      payload: { from: previousState, to: nextState },
    });
    previousState = nextState;
  });

  const errorUtils = (globalThis as typeof globalThis & {
    ErrorUtils?: GlobalErrorUtils;
  }).ErrorUtils;
  if (errorUtils) {
    const previousHandler = errorUtils.getGlobalHandler();
    errorUtils.setGlobalHandler((error, isFatal) => {
      recordDebugLogEvent({
        event: isFatal ? "javascript-fatal-error" : "javascript-global-error",
        level: "error",
        payload: { error, fatal: Boolean(isFatal) },
      });
      previousHandler(error, isFatal);
    });
  }

  const eventTarget = globalThis as typeof globalThis & {
    addEventListener?: (
      type: string,
      listener: (event: { reason?: unknown }) => void,
    ) => void;
  };
  eventTarget.addEventListener?.("unhandledrejection", (event) => {
    recordDebugLogEvent({
      event: "javascript-unhandled-rejection",
      level: "error",
      payload: { error: event.reason },
    });
  });
}
