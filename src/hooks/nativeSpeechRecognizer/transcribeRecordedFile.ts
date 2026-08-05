import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import type { TranslationKey } from "../../i18n";
import {
  buildErrorMessage,
  getRecognitionLocale,
  RECOGNIZED_FILE_TIMEOUT_MS,
} from "./shared";
import type { SttLanguage } from "../../types";

interface TranscribeRecordedFileParams {
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
  fileUri,
  finalTranscriptRef,
  latestTranscriptRef,
  sttLanguage,
  requiresOnDeviceRecognition,
  t,
}: TranscribeRecordedFileParams) {
  return new Promise<string | null>((resolve, reject) => {
    latestTranscriptRef.current = "";
    finalTranscriptRef.current = "";

    // A dropped end/error event must not hang file transcription forever;
    // settle with whatever transcript arrived and release the recognizer.
    const watchdog = setTimeout(() => {
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

    const cleanup = () => {
      clearTimeout(watchdog);
      resultSubscription.remove();
      errorSubscription.remove();
      endSubscription.remove();
    };

    const finish = (value: string | null) => {
      cleanup();
      resolve(value);
    };

    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };

    const resultSubscription = ExpoSpeechRecognitionModule.addListener(
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

    const errorSubscription = ExpoSpeechRecognitionModule.addListener(
      "error",
      (event) => {
        if (event.error === "aborted" || event.error === "no-speech") {
          finish(null);
          return;
        }

        fail(new Error(buildErrorMessage(event, t)));
      },
    );

    const endSubscription = ExpoSpeechRecognitionModule.addListener(
      "end",
      () => {
        const transcript =
          finalTranscriptRef.current.trim() ||
          latestTranscriptRef.current.trim() ||
          null;
        finish(transcript);
      },
    );

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
