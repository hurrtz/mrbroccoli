import { useCallback } from "react";
import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import type { TranslationKey } from "../../i18n";
import {
  cancelNativeWaveformRecording,
  startNativeWaveformRecording,
  stopNativeWaveformRecording,
} from "../../services/nativeWaveform";
import {
  getRecognitionLocale,
  MIN_RECOGNITION_DURATION_MS,
  RECOGNITION_METER_INTERVAL_MS,
  RECOGNITION_STOP_TIMEOUT_MS,
} from "./shared";
import { transcribeRecordedFile } from "./transcribeRecordedFile";
import type { RecognitionSession } from "./useRecognitionSession";
import type { SttLanguage } from "../../types";

interface UseRecognitionControlsParams {
  session: RecognitionSession;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
  usingNativeRecorder: boolean;
  sttLanguage: SttLanguage;
  requiresOnDeviceRecognition: boolean;
}

export function useRecognitionControls({
  session,
  t,
  usingNativeRecorder,
  sttLanguage,
  requiresOnDeviceRecognition,
}: UseRecognitionControlsParams) {
  const {
    abortRequestedRef,
    clearPendingResolution,
    finalTranscriptRef,
    isRecordingRef,
    latestTranscriptRef,
    nativeSessionIdRef,
    resolvePendingStop,
    setIsRecording,
    setInputMetering,
    setLastError,
    startedAtRef,
    stopRejectRef,
    stopRequestedRef,
    stopResolverRef,
  } = session;

  const ensurePermissions = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      throw new Error(t("speechRecognitionUnavailableOnDevice"));
    }

    let permissions = await ExpoSpeechRecognitionModule.getPermissionsAsync();

    if (!permissions.granted) {
      permissions = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    }

    if (!permissions.granted) {
      throw new Error(t("speechRecognitionPermissionNotGranted"));
    }
  }, [t]);

  const startRecognition = useCallback(async () => {
    if (isRecordingRef.current) {
      return;
    }

    await ensurePermissions();

    setLastError(null);
    setInputMetering(null);
    latestTranscriptRef.current = "";
    finalTranscriptRef.current = "";
    clearPendingResolution();
    startedAtRef.current = Date.now();
    isRecordingRef.current = true;
    setIsRecording(true);

    if (usingNativeRecorder) {
      const sessionId = `native-stt-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      nativeSessionIdRef.current = sessionId;

      try {
        await startNativeWaveformRecording({ sessionId });
      } catch (error) {
        nativeSessionIdRef.current = null;
        isRecordingRef.current = false;
        setIsRecording(false);
        setInputMetering(null);
        throw error instanceof Error
          ? error
          : new Error(t("couldntStartNativeSpeechRecognition"));
      }
      return;
    }

    try {
      ExpoSpeechRecognitionModule.start({
        lang: getRecognitionLocale(sttLanguage),
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
        requiresOnDeviceRecognition,
        iosTaskHint: "dictation",
        iosVoiceProcessingEnabled: true,
        volumeChangeEventOptions: {
          enabled: true,
          intervalMillis: RECOGNITION_METER_INTERVAL_MS,
        },
      });
    } catch (error) {
      isRecordingRef.current = false;
      setIsRecording(false);
      setInputMetering(null);
      throw error instanceof Error
        ? error
        : new Error(t("couldntStartNativeSpeechRecognition"));
    }
  }, [
    clearPendingResolution,
    ensurePermissions,
    finalTranscriptRef,
    isRecordingRef,
    latestTranscriptRef,
    nativeSessionIdRef,
    setIsRecording,
    setInputMetering,
    setLastError,
    startedAtRef,
    sttLanguage,
    requiresOnDeviceRecognition,
    t,
    usingNativeRecorder,
  ]);

  const abortRecognition = useCallback(async () => {
    if (!isRecordingRef.current) {
      clearPendingResolution();
      return;
    }

    if (usingNativeRecorder) {
      const sessionId = nativeSessionIdRef.current;
      nativeSessionIdRef.current = null;
      isRecordingRef.current = false;
      setIsRecording(false);
      setInputMetering(null);
      clearPendingResolution();

      if (sessionId) {
        await cancelNativeWaveformRecording(sessionId);
      }
      return;
    }

    abortRequestedRef.current = true;
    stopRequestedRef.current = false;

    await new Promise<void>((resolve) => {
      let watchdog: ReturnType<typeof setTimeout> | null = null;
      const settle = () => {
        if (watchdog) {
          clearTimeout(watchdog);
        }
        resolve();
      };
      stopResolverRef.current = settle;
      stopRejectRef.current = settle;
      // The module's terminal event can be dropped by the platform; never
      // wait on it forever.
      watchdog = setTimeout(() => {
        if (stopResolverRef.current !== settle) {
          return;
        }
        resolvePendingStop(null);
      }, RECOGNITION_STOP_TIMEOUT_MS);
      ExpoSpeechRecognitionModule.abort();
    });
  }, [
    abortRequestedRef,
    clearPendingResolution,
    isRecordingRef,
    nativeSessionIdRef,
    resolvePendingStop,
    setIsRecording,
    setInputMetering,
    stopRejectRef,
    stopRequestedRef,
    stopResolverRef,
    usingNativeRecorder,
  ]);

  const stopRecognition = useCallback(async (): Promise<string | null> => {
    if (!isRecordingRef.current) {
      return null;
    }

    if (Date.now() - startedAtRef.current < MIN_RECOGNITION_DURATION_MS) {
      await abortRecognition();
      return null;
    }

    if (usingNativeRecorder) {
      const sessionId = nativeSessionIdRef.current;
      if (!sessionId) {
        isRecordingRef.current = false;
        setIsRecording(false);
        setInputMetering(null);
        return null;
      }

      nativeSessionIdRef.current = null;
      isRecordingRef.current = false;
      setIsRecording(false);
      setInputMetering(null);

      const recording = await stopNativeWaveformRecording(sessionId);
      const fileUri = recording.uri ?? null;

      if (!fileUri) {
        throw new Error(t("couldntProcessVoiceInput"));
      }

      const transcription = await transcribeRecordedFile({
        fileUri,
        finalTranscriptRef,
        latestTranscriptRef,
        sttLanguage,
        requiresOnDeviceRecognition,
        t,
      });

      if (!transcription) {
        throw new Error(t("couldntCatchThatTryAgain"));
      }

      return transcription;
    }

    stopRequestedRef.current = true;
    abortRequestedRef.current = false;

    return new Promise<string | null>((resolve, reject) => {
      let watchdog: ReturnType<typeof setTimeout> | null = null;
      const settle = (value: string | null) => {
        if (watchdog) {
          clearTimeout(watchdog);
        }
        resolve(value);
      };
      const fail = (error: Error) => {
        if (watchdog) {
          clearTimeout(watchdog);
        }
        reject(error);
      };
      stopResolverRef.current = settle;
      stopRejectRef.current = fail;
      // If the platform drops the end/error event, settle with whatever
      // transcript arrived and force the recognizer down instead of wedging
      // the capture lifecycle for the rest of the session.
      watchdog = setTimeout(() => {
        if (stopResolverRef.current !== settle) {
          return;
        }
        const transcript =
          finalTranscriptRef.current.trim() ||
          latestTranscriptRef.current.trim() ||
          null;
        resolvePendingStop(transcript);
        try {
          ExpoSpeechRecognitionModule.abort();
        } catch {
          // The recognizer may already be gone; the session state is reset.
        }
      }, RECOGNITION_STOP_TIMEOUT_MS);
      ExpoSpeechRecognitionModule.stop();
    });
  }, [
    abortRecognition,
    abortRequestedRef,
    finalTranscriptRef,
    isRecordingRef,
    latestTranscriptRef,
    nativeSessionIdRef,
    resolvePendingStop,
    setIsRecording,
    setInputMetering,
    startedAtRef,
    stopRejectRef,
    stopRequestedRef,
    stopResolverRef,
    sttLanguage,
    requiresOnDeviceRecognition,
    t,
    usingNativeRecorder,
  ]);

  return {
    ensurePermissions,
    startRecognition,
    abortRecognition,
    stopRecognition,
  };
}
