import { NativeModules, PermissionsAndroid, Platform } from "react-native";

import { recordDebugLogEvent } from "./debugLogCapture";

export type VoiceLiveActivityPhase =
  "listening" | "transcribing" | "searching" | "thinking" | "synthesizing";

export interface VoiceLiveActivityState {
  phase: VoiceLiveActivityPhase;
  expectedSpeechAtMs: number | null;
  phaseLabel: string;
  statusLabel: string;
}

type VoiceLiveActivityModule = {
  setState(
    phase: VoiceLiveActivityPhase,
    expectedSpeechAtMs: number | null,
    phaseLabel: string,
    statusLabel: string,
  ): Promise<boolean>;
  endActivity(): Promise<boolean>;
};

interface VoiceLiveActivityDependencies {
  nativeModule?: VoiceLiveActivityModule;
  platform?: string;
  platformVersion?: number;
  requestNotificationPermission?: () => Promise<boolean>;
}

const HEARTBEAT_INTERVAL_MS = 20_000;

const nativeModule = NativeModules.MrBroccoliVoiceLiveActivity as
  VoiceLiveActivityModule | undefined;

let currentState: VoiceLiveActivityState | null = null;
let lastSentSignature: string | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let scheduledEndTimer: ReturnType<typeof setTimeout> | null = null;
let androidNotificationPermissionRequest: Promise<boolean> | null = null;

function clearHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function clearScheduledEnd() {
  if (scheduledEndTimer) {
    clearTimeout(scheduledEndTimer);
    scheduledEndTimer = null;
  }
}

function getRuntime(dependencies: VoiceLiveActivityDependencies) {
  return {
    module: dependencies.nativeModule ?? nativeModule,
    platform: dependencies.platform ?? Platform.OS,
    platformVersion:
      dependencies.platformVersion ??
      (typeof Platform.Version === "number" ? Platform.Version : 0),
    requestNotificationPermission:
      dependencies.requestNotificationPermission ??
      requestAndroidNotificationPermission,
  };
}

async function requestAndroidNotificationPermission() {
  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

  if (await PermissionsAndroid.check(permission)) {
    return true;
  }

  return (
    (await PermissionsAndroid.request(permission)) ===
    PermissionsAndroid.RESULTS.GRANTED
  );
}

function ensureAndroidNotificationPermission(
  runtime: ReturnType<typeof getRuntime>,
  phase: VoiceLiveActivityPhase,
) {
  if (
    runtime.platform !== "android" ||
    runtime.platformVersion < 33 ||
    phase === "listening" ||
    androidNotificationPermissionRequest
  ) {
    return;
  }

  androidNotificationPermissionRequest = runtime
    .requestNotificationPermission()
    .then((granted) => {
      recordDebugLogEvent({
        event: "voice-live-activity-notification-permission",
        payload: { granted },
      });
      if (granted && currentState && runtime.module) {
        // Re-publish immediately so a notification that was created before
        // Android showed its permission dialog becomes visible without
        // waiting for the next heartbeat.
        sendState(currentState, runtime.module);
      }
      return granted;
    })
    .catch((error) => {
      androidNotificationPermissionRequest = null;
      recordDebugLogEvent({
        event: "voice-live-activity-notification-permission-failed",
        level: "warn",
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      });
      return false;
    });
}

function sendState(
  state: VoiceLiveActivityState,
  module: VoiceLiveActivityModule,
) {
  void module
    .setState(
      state.phase,
      state.expectedSpeechAtMs,
      state.phaseLabel,
      state.statusLabel,
    )
    .catch((error) => {
      recordDebugLogEvent({
        event: "voice-live-activity-update-failed",
        level: "warn",
        payload: {
          message: error instanceof Error ? error.message : String(error),
          phase: state.phase,
        },
      });
    });
}

function ensureHeartbeat(module: VoiceLiveActivityModule) {
  if (heartbeatTimer) {
    return;
  }

  heartbeatTimer = setInterval(() => {
    if (currentState) {
      // iOS uses this to refresh the native stale date. Android already keeps
      // the same process active through its foreground service, and the quiet
      // refresh also recovers a notification removed by an OEM.
      sendState(currentState, module);
    }
  }, HEARTBEAT_INTERVAL_MS);
}

export function setVoiceLiveActivityState(
  state: VoiceLiveActivityState,
  dependencies: VoiceLiveActivityDependencies = {},
) {
  const runtime = getRuntime(dependencies);

  if (
    (runtime.platform !== "ios" && runtime.platform !== "android") ||
    !runtime.module ||
    typeof runtime.module.setState !== "function"
  ) {
    return false;
  }

  clearScheduledEnd();
  ensureAndroidNotificationPermission(runtime, state.phase);
  currentState = {
    phase: state.phase,
    expectedSpeechAtMs:
      state.expectedSpeechAtMs !== null &&
      Number.isFinite(state.expectedSpeechAtMs)
        ? state.expectedSpeechAtMs
        : null,
    phaseLabel: state.phaseLabel.trim(),
    statusLabel: state.statusLabel.trim(),
  };

  const signature = [
    currentState.phase,
    currentState.expectedSpeechAtMs ?? "unknown",
    currentState.phaseLabel,
    currentState.statusLabel,
  ].join(":");

  if (signature !== lastSentSignature) {
    lastSentSignature = signature;
    sendState(currentState, runtime.module);
  }

  ensureHeartbeat(runtime.module);
  return true;
}

export function endVoiceLiveActivity(
  dependencies: VoiceLiveActivityDependencies = {},
) {
  const runtime = getRuntime(dependencies);

  clearScheduledEnd();
  clearHeartbeat();
  currentState = null;
  lastSentSignature = null;

  if (
    (runtime.platform !== "ios" && runtime.platform !== "android") ||
    !runtime.module ||
    typeof runtime.module.endActivity !== "function"
  ) {
    return false;
  }

  void runtime.module.endActivity().catch((error) => {
    recordDebugLogEvent({
      event: "voice-live-activity-end-failed",
      level: "warn",
      payload: {
        message: error instanceof Error ? error.message : String(error),
      },
    });
  });
  return true;
}

export function scheduleVoiceLiveActivityEnd(
  delayMs = 750,
  dependencies: VoiceLiveActivityDependencies = {},
) {
  clearScheduledEnd();
  scheduledEndTimer = setTimeout(() => {
    scheduledEndTimer = null;
    endVoiceLiveActivity(dependencies);
  }, delayMs);
}

export const VOICE_LIVE_ACTIVITY_HEARTBEAT_MS = HEARTBEAT_INTERVAL_MS;
