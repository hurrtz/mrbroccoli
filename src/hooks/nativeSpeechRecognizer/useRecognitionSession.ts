import { useCallback, useRef, useState } from "react";
import type {
  ExpoSpeechRecognitionErrorEvent,
  ExpoSpeechRecognitionResultEvent,
} from "expo-speech-recognition";
import type { TranslationKey } from "../../i18n";
import { buildErrorMessage } from "./shared";

type StopResolver = (value: string | null) => void;
type StopRejecter = (error: Error) => void;

export interface RecognitionSession {
  isRecording: boolean;
  inputMetering: number | null;
  inputMeteringSampleId: number;
  lastError: string | null;
  isRecordingRef: React.MutableRefObject<boolean>;
  startedAtRef: React.MutableRefObject<number>;
  latestTranscriptRef: React.MutableRefObject<string>;
  finalTranscriptRef: React.MutableRefObject<string>;
  stopResolverRef: React.MutableRefObject<StopResolver | null>;
  stopRejectRef: React.MutableRefObject<StopRejecter | null>;
  stopRequestedRef: React.MutableRefObject<boolean>;
  abortRequestedRef: React.MutableRefObject<boolean>;
  nativeSessionIdRef: React.MutableRefObject<string | null>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  setInputMetering: React.Dispatch<React.SetStateAction<number | null>>;
  setInputMeteringSampleId: React.Dispatch<React.SetStateAction<number>>;
  setLastError: React.Dispatch<React.SetStateAction<string | null>>;
  clearPendingResolution: () => void;
  resolvePendingStop: (value: string | null) => void;
  rejectPendingStop: (error: Error) => void;
  handleResult: (event: ExpoSpeechRecognitionResultEvent) => void;
  handleError: (event: ExpoSpeechRecognitionErrorEvent) => void;
  clearLastError: () => void;
}

interface UseRecognitionSessionParams {
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
}

export function useRecognitionSession({
  t,
}: UseRecognitionSessionParams): RecognitionSession {
  const [isRecording, setIsRecording] = useState(false);
  const [inputMetering, setInputMetering] = useState<number | null>(null);
  const [inputMeteringSampleId, setInputMeteringSampleId] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const isRecordingRef = useRef(false);
  const startedAtRef = useRef(0);
  const latestTranscriptRef = useRef("");
  const finalTranscriptRef = useRef("");
  const stopResolverRef = useRef<StopResolver | null>(null);
  const stopRejectRef = useRef<StopRejecter | null>(null);
  const stopRequestedRef = useRef(false);
  const abortRequestedRef = useRef(false);
  const nativeSessionIdRef = useRef<string | null>(null);

  const clearPendingResolution = useCallback(() => {
    stopResolverRef.current = null;
    stopRejectRef.current = null;
    stopRequestedRef.current = false;
    abortRequestedRef.current = false;
  }, []);

  const resolvePendingStop = useCallback(
    (value: string | null) => {
      const resolve = stopResolverRef.current;
      clearPendingResolution();
      isRecordingRef.current = false;
      setIsRecording(false);
      setInputMetering(null);
      resolve?.(value);
    },
    [clearPendingResolution],
  );

  const rejectPendingStop = useCallback(
    (error: Error) => {
      const reject = stopRejectRef.current;
      clearPendingResolution();
      isRecordingRef.current = false;
      setIsRecording(false);
      setInputMetering(null);
      if (reject) {
        reject(error);
        return;
      }

      setLastError(error.message);
    },
    [clearPendingResolution],
  );

  const handleResult = useCallback((event: ExpoSpeechRecognitionResultEvent) => {
    const transcript = event.results[0]?.transcript?.trim() ?? "";

    if (!transcript) {
      return;
    }

    latestTranscriptRef.current = transcript;

    if (event.isFinal) {
      finalTranscriptRef.current = transcript;
    }
  }, []);

  const handleError = useCallback(
    (event: ExpoSpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" && abortRequestedRef.current) {
        resolvePendingStop(null);
        return;
      }

      if (event.error === "no-speech" && stopRequestedRef.current) {
        resolvePendingStop(null);
        return;
      }

      rejectPendingStop(new Error(buildErrorMessage(event, t)));
    },
    [rejectPendingStop, resolvePendingStop, t],
  );

  const clearLastError = useCallback(() => {
    setLastError(null);
  }, []);

  return {
    isRecording,
    inputMetering,
    inputMeteringSampleId,
    lastError,
    isRecordingRef,
    startedAtRef,
    latestTranscriptRef,
    finalTranscriptRef,
    stopResolverRef,
    stopRejectRef,
    stopRequestedRef,
    abortRequestedRef,
    nativeSessionIdRef,
    setIsRecording,
    setInputMetering,
    setInputMeteringSampleId,
    setLastError,
    clearPendingResolution,
    resolvePendingStop,
    rejectPendingStop,
    handleResult,
    handleError,
    clearLastError,
  };
}
