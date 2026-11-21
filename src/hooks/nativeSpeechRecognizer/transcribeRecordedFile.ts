import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import type { TranslationKey } from "../../i18n";
import {
  applyRecognitionResult,
  buildErrorMessage,
  RECOGNIZED_FILE_TIMEOUT_MS,
} from "./shared";
import type { RecognitionGrant } from "./useRecognitionPrivacy";

interface TranscribeRecordedFileParams {
  abortSignal?: AbortSignal;
  durationMs?: number;
  fileUri: string;
  finalTranscriptRef: React.MutableRefObject<string>;
  latestTranscriptRef: React.MutableRefObject<string>;
  grant: RecognitionGrant;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
}

export function transcribeRecordedFile({
  abortSignal,
  durationMs = 0,
  fileUri,
  finalTranscriptRef,
  latestTranscriptRef,
  grant,
  t,
}: TranscribeRecordedFileParams) {
  return new Promise<string | null>((resolve, reject) => {
    if (abortSignal?.aborted || !grant.allowed()) {
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

    // The recognizer feeds PCM in paced chunks. Allow time for the full capture
    // plus final processing and surface a failure if only a fragment arrived.
    watchdog = setTimeout(() => {
      fail(new Error(t("nativeSpeechRecognitionFailed")));
      try {
        ExpoSpeechRecognitionModule.abort();
      } catch {
        // The recognizer may already be gone; listeners are removed.
      }
    }, durationMs + RECOGNIZED_FILE_TIMEOUT_MS);

    resultSubscription = ExpoSpeechRecognitionModule.addListener(
      "result",
      (event) => {
        applyRecognitionResult(
          event,
          finalTranscriptRef,
          latestTranscriptRef,
        );
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
        ...grant.options,
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
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
