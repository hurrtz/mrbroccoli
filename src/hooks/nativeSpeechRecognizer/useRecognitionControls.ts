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
} from "./shared";
import { transcribeRecordedFile } from "./transcribeRecordedFile";
import type { RecognitionSession } from "./useRecognitionSession";

interface UseRecognitionControlsParams {
  session: RecognitionSession;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
  usingNativeRecorder: boolean;
}

export function useRecognitionControls({
  session,
  t,
  usingNativeRecorder,
}: UseRecognitionControlsParams) {
  const {
    abortRequestedRef,
    clearPendingResolution,
    finalTranscriptRef,
    isRecordingRef,
    latestTranscriptRef,
    nativeSessionIdRef,
    setIsRecording,
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

    let permissions =
      await ExpoSpeechRecognitionModule.getPermissionsAsync();

    if (!permissions.granted) {
      permissions =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
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
        throw error instanceof Error
          ? error
          : new Error(t("couldntStartNativeSpeechRecognition"));
      }
      return;
    }

    try {
      ExpoSpeechRecognitionModule.start({
        lang: getRecognitionLocale(),
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
        requiresOnDeviceRecognition: false,
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
    setLastError,
    startedAtRef,
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
      clearPendingResolution();

      if (sessionId) {
        await cancelNativeWaveformRecording(sessionId);
      }
      return;
    }

    abortRequestedRef.current = true;
    stopRequestedRef.current = false;

    await new Promise<void>((resolve) => {
      stopResolverRef.current = () => resolve();
      stopRejectRef.current = () => resolve();
      ExpoSpeechRecognitionModule.abort();
    });
  }, [
    abortRequestedRef,
    clearPendingResolution,
    isRecordingRef,
    nativeSessionIdRef,
    setIsRecording,
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
        return null;
      }

      nativeSessionIdRef.current = null;
      isRecordingRef.current = false;
      setIsRecording(false);

      const recording = await stopNativeWaveformRecording(sessionId);
      const fileUri = recording.uri ?? null;

      if (!fileUri) {
        throw new Error(t("couldntProcessVoiceInput"));
      }

      const transcription = await transcribeRecordedFile({
        fileUri,
        finalTranscriptRef,
        latestTranscriptRef,
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
      stopResolverRef.current = resolve;
      stopRejectRef.current = reject;
      ExpoSpeechRecognitionModule.stop();
    });
  }, [
    abortRecognition,
    abortRequestedRef,
    finalTranscriptRef,
    isRecordingRef,
    latestTranscriptRef,
    nativeSessionIdRef,
    setIsRecording,
    startedAtRef,
    stopRejectRef,
    stopRequestedRef,
    stopResolverRef,
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
