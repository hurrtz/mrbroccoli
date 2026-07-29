import { NativeEventEmitter, NativeModules } from "react-native";

type NativeWaveformEvent =
  | {
      type: "started" | "stopped" | "cancelled";
      sessionId: string;
      uri?: string;
      audioRoute?: string;
    }
  | {
      type: "levels";
      sessionId: string;
      metering: number;
    }
  | {
      type: "error";
      sessionId: string;
      message: string;
    }
  | {
      type: "routeChanged";
      sessionId: string;
      audioRoute: string;
      reason?: number | string;
    }
  | {
      type: "interruption";
      sessionId: string;
      state: "began" | "ended";
      resumed?: boolean;
    };

type NativeWaveformModule = {
  startRecording(
    sessionId: string,
    outputUri?: string | null,
  ): Promise<{ uri: string }>;
  stopRecording(sessionId: string): Promise<{ uri: string }>;
  cancelRecording(sessionId: string): Promise<boolean>;
  playRecordingCue(uri: string): Promise<boolean>;
};

const nativeModule = NativeModules.MrBroccoliNativeWaveform as
  | NativeWaveformModule
  | undefined;

const nativeEmitter = nativeModule
  ? new NativeEventEmitter(nativeModule as any)
  : null;

export function isNativeWaveformAvailable() {
  return !!nativeModule;
}

export function subscribeToNativeWaveform(
  listener: (event: NativeWaveformEvent) => void,
) {
  if (!nativeEmitter) {
    return () => {};
  }

  const subscription = nativeEmitter.addListener(
    "MrBroccoliNativeWaveformEvent",
    listener,
  );

  return () => {
    subscription.remove();
  };
}

export async function startNativeWaveformRecording(params: {
  sessionId: string;
  outputUri?: string | null;
}) {
  if (!nativeModule) {
    throw new Error("The native waveform recorder is not available.");
  }

  return nativeModule.startRecording(params.sessionId, params.outputUri ?? null);
}

export async function stopNativeWaveformRecording(sessionId: string) {
  if (!nativeModule) {
    throw new Error("The native waveform recorder is not available.");
  }

  return nativeModule.stopRecording(sessionId);
}

export async function cancelNativeWaveformRecording(sessionId: string) {
  if (!nativeModule) {
    throw new Error("The native waveform recorder is not available.");
  }

  return nativeModule.cancelRecording(sessionId);
}

export async function playNativeRecordingCue(uri: string) {
  if (!nativeModule) {
    return false;
  }

  return nativeModule.playRecordingCue(uri);
}

export type { NativeWaveformEvent };
