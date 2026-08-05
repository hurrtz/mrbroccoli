import type { ExpoSpeechRecognitionErrorEvent } from "expo-speech-recognition";
import type { useLocalization } from "../../i18n";
import type { SttLanguage } from "../../types";
import { getSpeechRecognitionLocale } from "../../utils/speechLanguage";

export const MIN_RECOGNITION_DURATION_MS = 300;
export const RECOGNITION_METER_INTERVAL_MS = 150;
// Platform recognizers can drop their terminal end/error callback (a known
// Android speech-service failure mode). Stop and abort must never wait on
// that event forever, or voice capture and Drive re-arm wedge for the rest
// of the session. Mirrors the playback-side watchdog pattern.
export const RECOGNITION_STOP_TIMEOUT_MS = 8_000;
// File recognition processes a bounded recording; generous ceiling for slow
// devices and long captures before the session is forcibly released.
export const RECOGNIZED_FILE_TIMEOUT_MS = 120_000;

export function getRecognitionLocale(language: SttLanguage = "auto") {
  return getSpeechRecognitionLocale(language);
}

export function volumeToMetering(value: number) {
  if (value < 0) {
    return -160;
  }

  const clamped = Math.max(0, Math.min(10, value));
  return -56 + (clamped / 10) * 56;
}

export function buildErrorMessage(
  event: ExpoSpeechRecognitionErrorEvent,
  t: ReturnType<typeof useLocalization>["t"],
) {
  switch (event.error) {
    case "not-allowed":
      return t("speechRecognitionPermissionNotGranted");
    case "service-not-allowed":
      return t("speechRecognitionUnavailableOnDevice");
    case "language-not-supported":
      return t("speechRecognitionUnavailableForDeviceLanguage");
    case "network":
      return t("nativeSpeechRecognitionNeedsNetwork");
    case "no-speech":
      return t("noSpeechDetected");
    default:
      return event.message || t("nativeSpeechRecognitionFailed");
  }
}
