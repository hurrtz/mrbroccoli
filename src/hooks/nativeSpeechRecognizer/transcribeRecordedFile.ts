import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import type { TranslationKey } from "../../i18n";
import {
  buildErrorMessage,
  getRecognitionLocale,
  RECOGNIZED_FILE_TIMEOUT_MS,
} from "./shared";
import type { SttLanguage } from "../../types";

interface TranscribeRecordedFileParams {
  abortSignal?: AbortSignal;
  fileUri: string;
  finalTranscriptRef: React.MutableRefObject<string>;
  latestTranscriptRef: React.MutableRefObject<string>;
  sttLanguage: SttLanguage;
  requiresOnDeviceRecognition: boolean;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
}

export function transcribeRecordedFile({
  abortSignal,
  fileUri,
  finalTranscriptRef,
  latestTranscriptRef,
  sttLanguage,
  requiresOnDeviceRecognition,
  t,
}: TranscribeRecordedFileParams) {
  return new Promise<string | null>((resolve, reject) => {
    if (abortSignal?.aborted) {
      resolve(null);
      return;
    }

    latestTranscriptRef.current = "";
    finalTranscriptRef.current = "";

    let settled = false;
    let watchdog: ReturnType<typeof setTimeout> | null = null;
    let resultSubscription: { remove: () => void } | null = null;
    let errorSubscription: { remove: () => void } | null = null;
    let endSubscription: { remove: () => void } | null = null;

    const cleanup = () => {
      if (watchdog) {
        clearTimeout(watchdog);
        watchdog = null;
      }
      resultSubscription?.remove();
      errorSubscription?.remove();
      endSubscription?.remove();
      resultSubscription = null;
      errorSubscription = null;
      endSubscription = null;
      abortSignal?.removeEventListener("abort", abortRecognition);
    };

    const finish = (value: string | null) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      resolve(value);
    };

    const fail = (error: Error) => {
      if (settled) {
        return;
      }
      settled = true;
      cleanup();
      reject(error);
    };

    function abortRecognition() {
      if (settled) {
        return;
      }
      finish(null);
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // The recognizer may already be gone; listeners are removed.
      }
    }

    // A dropped end/error event must not hang file transcription forever;
    // settle with whatever transcript arrived and release the recognizer.
    watchdog = setTimeout(() => {
      const transcript =
        finalTranscriptRef.current.trim() ||
        latestTranscriptRef.current.trim() ||
        null;
      finish(transcript);
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // The recognizer may already be gone; listeners are removed.
      }
    }, RECOGNIZED_FILE_TIMEOUT_MS);

    resultSubscription = ExpoSpeechRecognitionModule.addListener(
      "result",
      (event) => {
        const transcript = event.results[0]?.transcript?.trim() ?? "";
        if (!transcript) {
          return;
        }

        latestTranscriptRef.current = transcript;
        if (event.isFinal) {
          finalTranscriptRef.current = transcript;
        }
      },
    );

    errorSubscription = ExpoSpeechRecognitionModule.addListener(
      "error",
      (event) => {
        if (event.error === "aborted" || event.error === "no-speech") {
          finish(null);
          return;
        }

        fail(new Error(buildErrorMessage(event, t)));
      },
    );

    endSubscription = ExpoSpeechRecognitionModule.addListener(
      "end",
      () => {
        const transcript =
          finalTranscriptRef.current.trim() ||
          latestTranscriptRef.current.trim() ||
          null;
        finish(transcript);
      },
    );

    abortSignal?.addEventListener("abort", abortRecognition, { once: true });
    if (abortSignal?.aborted) {
      abortRecognition();
      return;
    }

    try {
      ExpoSpeechRecognitionModule.start({
        lang: getRecognitionLocale(sttLanguage),
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
        requiresOnDeviceRecognition,
        audioSource: {
          uri: fileUri,
        },
      });
    } catch (error) {
      fail(
        error instanceof Error
          ? error
          : new Error(t("nativeSpeechRecognitionFailed")),
      );
    }
  });
}
