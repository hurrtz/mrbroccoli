import {
  getSpeechLanguageDefinition,
  type SpeechLanguage,
  type SttLanguage,
} from "../constants/speechLanguages";

function getResolvedLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale || "en-US";
}

export function getDeviceLocale() {
  return getResolvedLocale();
}

export function getSpeechRecognitionLocale(language: SttLanguage) {
  return language === "auto"
    ? getDeviceLocale()
    : getSpeechLanguageDefinition(language).nativeLocale;
}

export function getProviderSpeechLanguageCode(
  language: SpeechLanguage,
) {
  return getSpeechLanguageDefinition(language).providerCode;
}

export function getFileAudioMimeType(fileUri: string) {
  const normalized = fileUri.toLowerCase();

  if (normalized.endsWith(".wav")) {
    return "audio/wav";
  }
  if (normalized.endsWith(".mp3")) {
    return "audio/mp3";
  }
  if (normalized.endsWith(".aac")) {
    return "audio/aac";
  }
  if (normalized.endsWith(".ogg")) {
    return "audio/ogg";
  }
  if (normalized.endsWith(".flac")) {
    return "audio/flac";
  }
  if (normalized.endsWith(".aiff") || normalized.endsWith(".aif")) {
    return "audio/aiff";
  }
  if (normalized.endsWith(".m4a")) {
    return "audio/m4a";
  }

  return "application/octet-stream";
}
