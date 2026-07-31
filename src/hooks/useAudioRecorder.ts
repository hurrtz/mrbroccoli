import { useEffect, useRef, useCallback, useState } from "react";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder as useExpoAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useLocalization } from "../i18n";
import {
  cancelNativeWaveformRecording,
  isNativeAmbientMonitoringAvailable,
  isNativeWaveformAvailable,
  startNativeAmbientMonitoring,
  startNativeWaveformRecording,
  stopNativeAmbientMonitoring,
  stopNativeWaveformRecording,
  subscribeToNativeWaveform,
} from "../services/nativeWaveform";
import { recordDebugLogEvent } from "../services/debugLogCapture";

export interface RecorderState {
  ambientInputMetering: number | null;
  ambientMonitoring: boolean;
  audioRoute: string | null;
  isRecording: boolean;
  inputMetering: number | null;
  lastError: string | null;
  clearLastError: () => void;
}

// Speech-grade capture: mono at 16 kHz. STT models downsample to 16 kHz
// regardless, so this keeps uploads small without hurting transcription
// quality. (The native waveform recorder applies the same target itself.)
const SPEECH_SAMPLE_RATE = 16000;
const RECORDING_OPTIONS = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
  numberOfChannels: 1,
  sampleRate: SPEECH_SAMPLE_RATE,
};
const RECORDER_STATUS_INTERVAL_MS = 150;
const STOPPED_RECORDING_URI_ATTEMPTS = 12;
const STOPPED_RECORDING_URI_RETRY_MS = 50;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function useAudioRecorder() {
  const { t } = useLocalization();
  const usingNativeRecorder = isNativeWaveformAvailable();
  const recorder = useExpoAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(
    recorder,
    RECORDER_STATUS_INTERVAL_MS,
  );
  const startTimeRef = useRef<number>(0);
  const nativeSessionIdRef = useRef<string | null>(null);
  const ambientSessionIdRef = useRef<string | null>(null);
  const [nativeRecording, setNativeRecording] = useState(false);
  const [ambientMonitoring, setAmbientMonitoring] = useState(false);
  const [nativeInputMetering, setNativeInputMetering] = useState<number | null>(
    null,
  );
  const [ambientInputMetering, setAmbientInputMetering] = useState<
    number | null
  >(null);
  const [nativeAudioRoute, setNativeAudioRoute] = useState<string | null>(
    null,
  );
  const [lastError, setLastError] = useState<string | null>(null);

  const ensurePermissions = useCallback(async () => {
    let permission = await getRecordingPermissionsAsync();

    if (!permission.granted) {
      permission = await requestRecordingPermissionsAsync();
    }

    if (!permission.granted) {
      throw new Error(t("microphonePermissionNotGranted"));
    }
  }, [t]);

  const resolveStoppedRecordingUri = useCallback(async () => {
    for (
      let attempt = 0;
      attempt < STOPPED_RECORDING_URI_ATTEMPTS;
      attempt += 1
    ) {
      const status = recorder.getStatus();
      const resolvedUri = recorder.uri ?? status.url ?? recorderState.url;

      if (resolvedUri) {
        return resolvedUri;
      }

      if (attempt < STOPPED_RECORDING_URI_ATTEMPTS - 1) {
        await wait(STOPPED_RECORDING_URI_RETRY_MS);
      }
    }

    return null;
  }, [recorder, recorderState.url]);

  useEffect(() => {
    if (!usingNativeRecorder) {
      return;
    }

    return subscribeToNativeWaveform((event) => {
      if (
        event.type === "levels" &&
        nativeSessionIdRef.current &&
        event.sessionId === nativeSessionIdRef.current
      ) {
        setNativeInputMetering(event.metering);
        return;
      }

      if (
        event.type === "levels" &&
        ambientSessionIdRef.current &&
        event.sessionId === ambientSessionIdRef.current
      ) {
        setAmbientInputMetering(event.metering);
        return;
      }

      if (
        event.type === "started" ||
        event.type === "monitoringStarted"
      ) {
        if (event.audioRoute) {
          setNativeAudioRoute(event.audioRoute);
        }
        recordDebugLogEvent({
          event:
            event.type === "started"
              ? "native-recorder-route-selected"
              : "native-ambient-monitor-route-selected",
          payload: {
            audioRoute: event.audioRoute ?? "unknown",
            sessionId: event.sessionId,
          },
        });
        return;
      }

      if (event.type === "routeChanged") {
        if (
          event.sessionId === nativeSessionIdRef.current ||
          event.sessionId === ambientSessionIdRef.current
        ) {
          setNativeAudioRoute(event.audioRoute);
        }
        recordDebugLogEvent({
          event: "native-recorder-route-changed",
          payload: {
            audioRoute: event.audioRoute,
            reason: event.reason,
            sessionId: event.sessionId,
          },
        });
        return;
      }

      if (event.type === "interruption") {
        recordDebugLogEvent({
          event: "native-recorder-interruption",
          level: event.state === "began" ? "warn" : "info",
          payload: {
            resumed: event.resumed,
            sessionId: event.sessionId,
            state: event.state,
          },
        });
        return;
      }

      if (
        event.type === "error" &&
        nativeSessionIdRef.current &&
        event.sessionId === nativeSessionIdRef.current
      ) {
        const sessionId = nativeSessionIdRef.current;
        nativeSessionIdRef.current = null;
        setNativeRecording(false);
        setNativeInputMetering(null);
        setLastError(event.message);
        recordDebugLogEvent({
          event: "native-recorder-error",
          level: "error",
          payload: { message: event.message, sessionId },
        });
        void cancelNativeWaveformRecording(sessionId).catch(() => {
          // The native module may have already cleaned up after the failure.
        });
        return;
      }

      if (
        event.type === "error" &&
        ambientSessionIdRef.current &&
        event.sessionId === ambientSessionIdRef.current
      ) {
        const sessionId = ambientSessionIdRef.current;
        ambientSessionIdRef.current = null;
        setAmbientMonitoring(false);
        setAmbientInputMetering(null);
        recordDebugLogEvent({
          event: "native-ambient-monitor-error",
          level: "warn",
          payload: { message: event.message, sessionId },
        });
        void stopNativeAmbientMonitoring(sessionId).catch(() => {
          // The native module may have already cleaned up after the failure.
        });
      }
    });
  }, [usingNativeRecorder]);

  const stopAmbientMonitoring = useCallback(async () => {
    const sessionId = ambientSessionIdRef.current;
    if (!sessionId) {
      return false;
    }

    ambientSessionIdRef.current = null;
    setAmbientMonitoring(false);
    setAmbientInputMetering(null);

    try {
      const stopped = await stopNativeAmbientMonitoring(sessionId);
      recordDebugLogEvent({
        event: "native-ambient-monitor-stopped",
        payload: {
          sessionId,
          stopped,
        },
      });
      return stopped;
    } catch (error) {
      recordDebugLogEvent({
        event: "native-ambient-monitor-stop-failed",
        level: "warn",
        payload: {
          error,
          sessionId,
        },
      });
      return false;
    }
  }, []);

  const startAmbientMonitoring = useCallback(async () => {
    if (
      !usingNativeRecorder ||
      !isNativeAmbientMonitoringAvailable()
    ) {
      return false;
    }

    if (ambientSessionIdRef.current) {
      return true;
    }

    if (nativeSessionIdRef.current || nativeRecording) {
      return false;
    }

    await ensurePermissions();

    const sessionId = `native-ambient-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    ambientSessionIdRef.current = sessionId;
    setAmbientInputMetering(null);

    try {
      const result = await startNativeAmbientMonitoring(sessionId);
      if (ambientSessionIdRef.current !== sessionId) {
        await stopNativeAmbientMonitoring(sessionId).catch(() => false);
        return false;
      }

      setAmbientMonitoring(true);
      if (result.audioRoute) {
        setNativeAudioRoute(result.audioRoute);
      }
      recordDebugLogEvent({
        event: "native-ambient-monitor-started",
        payload: {
          audioRoute: result.audioRoute ?? "unknown",
          sessionId,
        },
      });
      return true;
    } catch (error) {
      if (ambientSessionIdRef.current === sessionId) {
        ambientSessionIdRef.current = null;
      }
      setAmbientMonitoring(false);
      setAmbientInputMetering(null);
      recordDebugLogEvent({
        event: "native-ambient-monitor-start-failed",
        level: "warn",
        payload: {
          error,
          sessionId,
        },
      });
      return false;
    }
  }, [ensurePermissions, nativeRecording, usingNativeRecorder]);

  useEffect(() => {
    return () => {
      const sessionId = ambientSessionIdRef.current;
      ambientSessionIdRef.current = null;
      if (sessionId) {
        void stopNativeAmbientMonitoring(sessionId).catch(() => false);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    recordDebugLogEvent({
      event: "recorder-start-requested",
      payload: {
        recorderRoute: usingNativeRecorder ? "native-waveform" : "expo-audio",
      },
    });

    if (usingNativeRecorder) {
      await stopAmbientMonitoring();

      if (nativeRecording) {
        recordDebugLogEvent({
          event: "recorder-start-skipped",
          payload: {
            reason: "native-recorder-already-active",
          },
        });
        return;
      }

      await ensurePermissions();

      setLastError(null);
      const sessionId = `native-recorder-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      nativeSessionIdRef.current = sessionId;
      setNativeInputMetering(null);

      try {
        await startNativeWaveformRecording({ sessionId });
        startTimeRef.current = Date.now();
        setNativeRecording(true);
        recordDebugLogEvent({
          event: "recorder-started",
          payload: {
            recorderRoute: "native-waveform",
            sessionId,
          },
        });
      } catch (error) {
        nativeSessionIdRef.current = null;
        setNativeRecording(false);
        setNativeInputMetering(null);
        recordDebugLogEvent({
          event: "recorder-start-failed",
          level: "error",
          payload: {
            error,
            recorderRoute: "native-waveform",
            sessionId,
          },
        });
        throw error;
      }
      return;
    }

    if (recorderState.isRecording) {
      recordDebugLogEvent({
        event: "recorder-start-skipped",
        payload: {
          reason: "expo-recorder-already-active",
        },
      });
      return;
    }

    await ensurePermissions();

    setLastError(null);
    await recorder.prepareToRecordAsync(RECORDING_OPTIONS);
    recorder.record();
    startTimeRef.current = Date.now();
    recordDebugLogEvent({
      event: "recorder-started",
      payload: {
        recorderRoute: "expo-audio",
      },
    });
  }, [
    ensurePermissions,
    nativeRecording,
    recorder,
    recorderState.isRecording,
    stopAmbientMonitoring,
    usingNativeRecorder,
  ]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    recordDebugLogEvent({
      event: "recorder-stop-requested",
      payload: {
        recorderRoute: usingNativeRecorder ? "native-waveform" : "expo-audio",
      },
    });

    if (usingNativeRecorder) {
      const sessionId = nativeSessionIdRef.current;
      if (!sessionId) {
        recordDebugLogEvent({
          event: "recorder-stop-skipped",
          payload: {
            reason: "missing-native-session-id",
          },
        });
        return null;
      }

      const duration = Date.now() - startTimeRef.current;
      nativeSessionIdRef.current = null;
      setNativeInputMetering(null);

      try {
        if (duration < 300) {
          await cancelNativeWaveformRecording(sessionId);
          setNativeRecording(false);
          startTimeRef.current = 0;
          recordDebugLogEvent({
            event: "recorder-stop-discarded",
            payload: {
              durationMs: duration,
              recorderRoute: "native-waveform",
              reason: "recording-too-short",
              sessionId,
            },
          });
          return null;
        }

        const result = await stopNativeWaveformRecording(sessionId);
        setNativeRecording(false);
        startTimeRef.current = 0;

        if (result.uri) {
          recordDebugLogEvent({
            event: "recorder-stop-succeeded",
            payload: {
              durationMs: duration,
              recorderRoute: "native-waveform",
              sessionId,
              uri: result.uri,
            },
          });
          return result.uri;
        }

        recordDebugLogEvent({
          event: "recorder-stop-missing-uri",
          level: "warn",
          payload: {
            durationMs: duration,
            recorderRoute: "native-waveform",
            sessionId,
          },
        });
        throw new Error(t("couldntProcessVoiceInput"));
      } catch (error) {
        setNativeRecording(false);
        startTimeRef.current = 0;
        recordDebugLogEvent({
          event: "recorder-stop-failed",
          level: "error",
          payload: {
            durationMs: duration,
            error,
            recorderRoute: "native-waveform",
            sessionId,
          },
        });
        throw error;
      }
    }

    const statusBeforeStop = recorder.getStatus();
    if (
      !recorderState.isRecording &&
      !statusBeforeStop.isRecording &&
      !recorderState.canRecord &&
      !statusBeforeStop.canRecord
    ) {
      recordDebugLogEvent({
        event: "recorder-stop-skipped",
        payload: {
          reason: "expo-recorder-not-ready",
        },
      });
      return null;
    }

    const duration = Date.now() - startTimeRef.current;
    await recorder.stop();
    startTimeRef.current = 0;

    if (duration < 300) {
      recordDebugLogEvent({
        event: "recorder-stop-discarded",
        payload: {
          durationMs: duration,
          recorderRoute: "expo-audio",
          reason: "recording-too-short",
        },
      });
      return null;
    }

    const resolvedUri = await resolveStoppedRecordingUri();

    if (resolvedUri) {
      recordDebugLogEvent({
        event: "recorder-stop-succeeded",
        payload: {
          durationMs: duration,
          recorderRoute: "expo-audio",
          uri: resolvedUri,
        },
      });
      return resolvedUri;
    }

    recordDebugLogEvent({
      event: "recorder-stop-missing-uri",
      level: "warn",
      payload: {
        durationMs: duration,
        recorderRoute: "expo-audio",
      },
    });
    throw new Error(t("couldntProcessVoiceInput"));
  }, [
    recorder,
    recorderState.canRecord,
    recorderState.isRecording,
    resolveStoppedRecordingUri,
    t,
    usingNativeRecorder,
  ]);

  const clearLastError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    ambientInputMetering,
    ambientMonitoring,
    audioRoute: nativeAudioRoute,
    isRecording: usingNativeRecorder
      ? nativeRecording
      : recorderState.isRecording,
    inputMetering: usingNativeRecorder
      ? nativeInputMetering
      : recorderState.metering ?? null,
    lastError,
    clearLastError,
    ensurePermissions,
    startAmbientMonitoring,
    startRecording,
    stopAmbientMonitoring,
    stopRecording,
  };
}
