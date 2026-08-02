import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { cleanupCapturedAudio } from "../../../services/voicePipeline/cleanup";
import type { SttBackendMode } from "../../../types";

import type { ShowToastFn, TranslateFn } from "../shared";
import type {
  AudioPlayerController,
  AudioRecorderController,
  NativeSpeechRecognizerController,
} from "./types";

// Default hard cap on a single spoken turn, used when the caller does not pass a
// derived limit. When reached we auto-stop through the same path the user's stop
// tap uses, so the captured audio is still transcribed and answered rather than
// discarded. Callers normally pass `maxRecordingMs` derived from the active STT
// model's upload size limit (see getMaxRecordingMs).
export const MAX_RECORDING_MS = 150000;

interface UseVoiceCaptureLifecycleParams {
  allowBackgroundStart?: boolean;
  isRecording?: boolean;
  maxRecordingMs?: number;
  nativeStt: NativeSpeechRecognizerController;
  onCaptureStopAbandoned?: () => void;
  onCaptureStopStarted?: () => void;
  player: AudioPlayerController;
  processCapturedVoiceTurn: (params: {
    audioUri?: string;
    transcriptionOverride?: string;
  }) => Promise<void>;
  recorder: AudioRecorderController;
  showToast: ShowToastFn;
  sttMode: SttBackendMode;
  t: TranslateFn;
}

export function useVoiceCaptureLifecycle({
  allowBackgroundStart = false,
  isRecording = false,
  maxRecordingMs = MAX_RECORDING_MS,
  nativeStt,
  onCaptureStopAbandoned,
  onCaptureStopStarted,
  player,
  processCapturedVoiceTurn,
  recorder,
  showToast,
  sttMode,
  t,
}: UseVoiceCaptureLifecycleParams) {
  const capturePreparationRef = useRef<Promise<boolean> | null>(null);
  const recordingStartedRef = useRef<Promise<boolean> | null>(null);
  const captureActiveRef = useRef(false);
  const captureGenerationRef = useRef(0);
  const cancelInFlightRef = useRef<Promise<void> | null>(null);
  const stopInFlightRef = useRef<Promise<void> | null>(null);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  // The auto-stop timer fires the latest stopVoiceCapture; keep a ref so the
  // timer callback never closes over a stale handler.
  const stopVoiceCaptureRef = useRef<() => Promise<void>>(async () => {});

  const clearMaxDurationTimer = useCallback(() => {
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
  }, []);

  const startVoiceCapture = useCallback(async () => {
    const existingPreparation = capturePreparationRef.current;
    if (existingPreparation) {
      await existingPreparation;
      return;
    }
    if (
      recordingStartedRef.current ||
      captureActiveRef.current ||
      isRecording
    ) {
      return;
    }

    const captureGeneration = captureGenerationRef.current + 1;
    captureGenerationRef.current = captureGeneration;
    recordDebugLogEvent({
      event: "voice-capture-start-requested",
      payload: {
        sttMode,
      },
    });

    const preparationPromise = (async () => {
      if (sttMode === "native") {
        await nativeStt.ensurePermissions();
      } else {
        await recorder.ensurePermissions();
      }
      return captureGenerationRef.current === captureGeneration;
    })();
    capturePreparationRef.current = preparationPromise;

    try {
      const prepared = await preparationPromise;
      const currentAppState = AppState.currentState;
      const appIsKnownInactive =
        !allowBackgroundStart &&
        typeof currentAppState === "string" &&
        currentAppState !== "active";
      if (!prepared || appIsKnownInactive) {
        recordDebugLogEvent({
          event: "voice-capture-start-superseded",
          payload: {
            reason: prepared ? "app-not-active" : "preparation-cancelled",
            sttMode,
          },
        });
        return;
      }
    } finally {
      if (capturePreparationRef.current === preparationPromise) {
        capturePreparationRef.current = null;
      }
    }

    const startPromise = (async () => {
      await player.waitForPlaybackRouteSettle();
      if (captureGenerationRef.current !== captureGeneration) {
        return false;
      }
      recordDebugLogEvent({
        event: "voice-capture-route-settled",
        payload: {
          sttMode,
        },
      });

      if (sttMode === "native") {
        await nativeStt.startRecognition();
      } else {
        await recorder.startRecording();
      }
      return true;
    })();
    recordingStartedRef.current = startPromise;

    try {
      const started = await startPromise;
      if (!started || captureGenerationRef.current !== captureGeneration) {
        recordDebugLogEvent({
          event: "voice-capture-start-superseded",
          payload: {
            sttMode,
          },
        });
        return;
      }
      captureActiveRef.current = true;
      recordDebugLogEvent({
        event: "voice-capture-started",
        payload: {
          sttMode,
        },
      });

      // Arm the auto-stop only after recording is actually running.
      clearMaxDurationTimer();
      maxDurationTimerRef.current = setTimeout(() => {
        maxDurationTimerRef.current = null;
        recordDebugLogEvent({
          event: "voice-capture-max-duration-reached",
          level: "warn",
          payload: {
            maxDurationMs: maxRecordingMs,
            sttMode,
          },
        });
        showToast(t("maxRecordingLengthReached"));
        void stopVoiceCaptureRef.current();
      }, maxRecordingMs);
    } finally {
      if (recordingStartedRef.current === startPromise) {
        recordingStartedRef.current = null;
      }
    }
  }, [
    clearMaxDurationTimer,
    allowBackgroundStart,
    isRecording,
    maxRecordingMs,
    nativeStt,
    player,
    recorder,
    showToast,
    sttMode,
    t,
  ]);

  const performStopVoiceCapture = useCallback(async () => {
    const captureGeneration = captureGenerationRef.current;
    const captureWasCancelled = () =>
      captureGenerationRef.current !== captureGeneration;
    clearMaxDurationTimer();

    recordDebugLogEvent({
      event: "voice-capture-stop-requested",
      payload: {
        sttMode,
      },
    });

    const preparationPromise = capturePreparationRef.current;

    if (preparationPromise) {
      try {
        const prepared = await preparationPromise;
        if (!prepared) {
          return;
        }
        // Let startVoiceCapture publish the recorder-start promise before a
        // press-out stop tries to consume it.
        await Promise.resolve();
      } catch {
        return;
      }
    }

    const startPromise = recordingStartedRef.current;

    if (startPromise) {
      try {
        const started = await startPromise;
        if (!started) {
          return;
        }
      } catch {
        recordDebugLogEvent({
          event: "voice-capture-stop-aborted",
          level: "warn",
          payload: {
            reason: "start-promise-rejected",
            sttMode,
          },
        });
        return;
      } finally {
        if (recordingStartedRef.current === startPromise) {
          recordingStartedRef.current = null;
        }
      }
    }

    if (!captureActiveRef.current && !isRecording && !captureWasCancelled()) {
      recordDebugLogEvent({
        event: "voice-capture-stop-ignored",
        payload: {
          reason: "capture-not-active",
          sttMode,
        },
      });
      return;
    }

    captureActiveRef.current = false;
    if (!captureWasCancelled()) {
      onCaptureStopStarted?.();
    }

    try {
      if (sttMode === "native") {
        const transcription = await nativeStt.stopRecognition();

        if (captureWasCancelled()) {
          recordDebugLogEvent({
            event: "voice-capture-stop-superseded",
            payload: {
              sttMode,
            },
          });
          return;
        }

        if (transcription) {
          recordDebugLogEvent({
            event: "voice-capture-transcription-ready",
            payload: {
              sttMode,
              textLength: transcription.trim().length,
            },
          });
          void processCapturedVoiceTurn({
            transcriptionOverride: transcription,
          });
        } else {
          onCaptureStopAbandoned?.();
          recordDebugLogEvent({
            event: "voice-capture-transcription-missing",
            level: "warn",
            payload: {
              sttMode,
            },
          });
          showToast(t("couldntCatchThatTryAgain"));
        }

        return;
      }

      const uri = await recorder.stopRecording();

      if (captureWasCancelled()) {
        await cleanupCapturedAudio(uri ?? undefined);
        recordDebugLogEvent({
          event: "voice-capture-stop-superseded",
          payload: {
            hadAudioUri: Boolean(uri),
            sttMode,
          },
        });
        return;
      }

      if (uri) {
        recordDebugLogEvent({
          event: "voice-capture-audio-ready",
          payload: {
            sttMode,
            uri,
          },
        });
        void processCapturedVoiceTurn({ audioUri: uri });
      } else {
        onCaptureStopAbandoned?.();
        recordDebugLogEvent({
          event: "voice-capture-audio-missing",
          level: "warn",
          payload: {
            sttMode,
          },
        });
        showToast(t("couldntCatchThatTryAgain"));
      }
    } catch (error) {
      if (captureWasCancelled()) {
        return;
      }
      onCaptureStopAbandoned?.();
      throw error;
    }
  }, [
    clearMaxDurationTimer,
    isRecording,
    nativeStt,
    onCaptureStopAbandoned,
    onCaptureStopStarted,
    processCapturedVoiceTurn,
    recorder,
    showToast,
    sttMode,
    t,
  ]);

  const stopVoiceCapture = useCallback(() => {
    if (stopInFlightRef.current) {
      return stopInFlightRef.current;
    }

    const stopPromise = performStopVoiceCapture().finally(() => {
      if (stopInFlightRef.current === stopPromise) {
        stopInFlightRef.current = null;
      }
    });
    stopInFlightRef.current = stopPromise;

    return stopPromise;
  }, [performStopVoiceCapture]);

  const hasActiveVoiceCaptureNow = useCallback(
    () =>
      Boolean(recordingStartedRef.current) ||
      captureActiveRef.current ||
      isRecording ||
      Boolean(stopInFlightRef.current),
    [isRecording],
  );

  const cancelVoiceCapture = useCallback(() => {
    if (cancelInFlightRef.current) {
      return cancelInFlightRef.current;
    }

    const preparationPromise = capturePreparationRef.current;
    const startPromise = recordingStartedRef.current;
    const shouldCancel =
      Boolean(preparationPromise) ||
      Boolean(startPromise) ||
      captureActiveRef.current ||
      isRecording ||
      Boolean(stopInFlightRef.current);

    clearMaxDurationTimer();
    if (!shouldCancel) {
      return Promise.resolve();
    }

    captureGenerationRef.current += 1;
    const cancelPromise = (async () => {
      recordDebugLogEvent({
        event: "voice-capture-cancel-requested",
        payload: {
          sttMode,
        },
      });

      if (preparationPromise) {
        try {
          await preparationPromise;
        } catch {
          captureActiveRef.current = false;
          return;
        }
      }

      if (startPromise) {
        try {
          const started = await startPromise;
          if (!started) {
            captureActiveRef.current = false;
            return;
          }
        } catch {
          captureActiveRef.current = false;
          return;
        }
      }

      const stopPromise = stopInFlightRef.current;
      if (stopPromise) {
        await stopPromise.catch(() => undefined);
        captureActiveRef.current = false;
        return;
      }

      captureActiveRef.current = false;
      if (sttMode === "native") {
        await nativeStt.abortRecognition();
      } else {
        const uri = await recorder.stopRecording();
        await cleanupCapturedAudio(uri ?? undefined);
      }

      recordDebugLogEvent({
        event: "voice-capture-cancelled",
        payload: {
          sttMode,
        },
      });
    })().finally(() => {
      if (cancelInFlightRef.current === cancelPromise) {
        cancelInFlightRef.current = null;
      }
    });

    cancelInFlightRef.current = cancelPromise;
    return cancelPromise;
  }, [clearMaxDurationTimer, isRecording, nativeStt, recorder, sttMode]);

  stopVoiceCaptureRef.current = stopVoiceCapture;

  // Defensively clear the timer if the component unmounts mid-recording.
  useEffect(() => clearMaxDurationTimer, [clearMaxDurationTimer]);

  return {
    cancelVoiceCapture,
    hasActiveVoiceCaptureNow,
    startVoiceCapture,
    stopVoiceCapture,
  };
}
