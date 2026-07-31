import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from "react-native";

import { recordDebugLogEvent } from "./debugLogCapture";

export type VoiceRemoteAction = "continue" | "pause" | "repeat" | "stop";
export type VoiceRemoteControlMode =
  | "drive-active"
  | "drive-paused"
  | "inactive"
  | "playback-active"
  | "playback-paused"
  | "recording";

export interface VoiceRemoteControlState {
  canRepeat: boolean;
  continueLabel: string;
  mode: VoiceRemoteControlMode;
  pauseLabel: string;
  phaseLabel: string;
  repeatLabel: string;
  stopLabel: string;
}

type VoiceRemoteControlsModule = {
  addListener?(eventName: string): void;
  clearControls(): Promise<boolean>;
  consumePendingAction(): Promise<string | null>;
  removeListeners?(count: number): void;
  setControls(
    mode: VoiceRemoteControlMode,
    canRepeat: boolean,
    phaseLabel: string,
    pauseLabel: string,
    continueLabel: string,
    stopLabel: string,
    repeatLabel: string,
  ): Promise<boolean>;
};

interface VoiceRemoteControlsDependencies {
  nativeModule?: VoiceRemoteControlsModule;
  platform?: string;
}

const ACTION_EVENT = "MrBroccoliVoiceRemoteAction";
const ACTION_URL_PREFIX = "mrbroccoli://voice-action/";
const nativeModule = NativeModules.MrBroccoliVoiceLiveActivity as
  | VoiceRemoteControlsModule
  | undefined;
const nativeEmitter =
  nativeModule && typeof nativeModule.addListener === "function"
    ? new NativeEventEmitter(nativeModule as any)
    : null;

let currentSignature: string | null = null;
let initialUrlConsumed = false;

function normalizeAction(value: unknown): VoiceRemoteAction | null {
  return value === "continue" ||
    value === "pause" ||
    value === "repeat" ||
    value === "stop"
    ? value
    : null;
}

export function getVoiceRemoteActionFromUrl(url: string) {
  if (!url.startsWith(ACTION_URL_PREFIX)) {
    return null;
  }

  return normalizeAction(
    url.slice(ACTION_URL_PREFIX.length).split(/[/?#]/, 1)[0],
  );
}

function getRuntime(dependencies: VoiceRemoteControlsDependencies) {
  return {
    module: dependencies.nativeModule ?? nativeModule,
    platform: dependencies.platform ?? Platform.OS,
  };
}

export function setVoiceRemoteControlState(
  state: VoiceRemoteControlState,
  dependencies: VoiceRemoteControlsDependencies = {},
) {
  const runtime = getRuntime(dependencies);
  if (
    (runtime.platform !== "ios" && runtime.platform !== "android") ||
    !runtime.module
  ) {
    return false;
  }

  const signature = JSON.stringify(state);
  if (signature === currentSignature) {
    return true;
  }
  currentSignature = signature;

  const operation =
    state.mode === "inactive"
      ? runtime.module.clearControls()
      : runtime.module.setControls(
          state.mode,
          state.canRepeat,
          state.phaseLabel,
          state.pauseLabel,
          state.continueLabel,
          state.stopLabel,
          state.repeatLabel,
        );

  void operation.catch((error) => {
    currentSignature = null;
    recordDebugLogEvent({
      event: "voice-remote-controls-update-failed",
      level: "warn",
      payload: { error, mode: state.mode },
    });
  });
  return true;
}

export function clearVoiceRemoteControls(
  dependencies: VoiceRemoteControlsDependencies = {},
) {
  const runtime = getRuntime(dependencies);
  currentSignature = null;
  if (!runtime.module) {
    return false;
  }

  void runtime.module.clearControls().catch(() => undefined);
  return true;
}

export function subscribeToVoiceRemoteActions(
  listener: (action: VoiceRemoteAction) => void,
  dependencies: VoiceRemoteControlsDependencies = {},
) {
  const runtime = getRuntime(dependencies);
  const emit = (value: unknown, source: "link" | "native") => {
    const action =
      typeof value === "object" && value !== null && "action" in value
        ? normalizeAction((value as { action?: unknown }).action)
        : normalizeAction(value);
    if (!action) {
      return;
    }

    recordDebugLogEvent({
      event: "voice-remote-action-received",
      payload: { action, source },
    });
    listener(action);
  };

  const nativeSubscription =
    nativeEmitter && runtime.module === nativeModule
      ? nativeEmitter.addListener(ACTION_EVENT, (event) =>
          emit(event, "native"),
        )
      : null;
  const linkSubscription = Linking.addEventListener("url", ({ url }) => {
    const action = getVoiceRemoteActionFromUrl(url);
    if (action) {
      emit(action, "link");
    }
  });

  if (runtime.module) {
    void runtime.module
      .consumePendingAction()
      .then((action) => emit(action, "native"))
      .catch(() => undefined);
  }

  if (!initialUrlConsumed) {
    initialUrlConsumed = true;
    void Linking.getInitialURL()
      .then((url) => {
        const action = url ? getVoiceRemoteActionFromUrl(url) : null;
        if (action) {
          emit(action, "link");
        }
      })
      .catch(() => undefined);
  }

  return () => {
    nativeSubscription?.remove();
    linkSubscription.remove();
  };
}

export function resetVoiceRemoteControlsForTests() {
  currentSignature = null;
  initialUrlConsumed = false;
}
