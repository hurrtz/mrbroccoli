import type { TranslationKey } from "../i18n/types";

export interface SpeechLanguageDefinition {
  labelKey: TranslationKey;
  nativeLocale: string;
  providerCode: string;
  googleCloudLocale: string;
  xaiTtsLocale: string | null;
  qwenTtsLanguage: string | null;
}

/**
 * Every language Mr Broccoli can intentionally recognize or speak.
 *
 * App-interface locales must be represented here. Provider capability
 * declarations decide which configured route can handle each language.
 */
export const SPEECH_LANGUAGE_REGISTRY = {
  en: {
    labelKey: "english",
    nativeLocale: "en-US",
    providerCode: "en",
    googleCloudLocale: "en-US",
    xaiTtsLocale: "en",
    qwenTtsLanguage: "English",
  },
  de: {
    labelKey: "german",
    nativeLocale: "de-DE",
    providerCode: "de",
    googleCloudLocale: "de-DE",
    xaiTtsLocale: "de",
    qwenTtsLanguage: "German",
  },
  uk: {
    labelKey: "ukrainian",
    nativeLocale: "uk-UA",
    providerCode: "uk",
    googleCloudLocale: "uk-UA",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
  hi: {
    labelKey: "hindi",
    nativeLocale: "hi-IN",
    providerCode: "hi",
    googleCloudLocale: "hi-IN",
    xaiTtsLocale: "hi",
    qwenTtsLanguage: null,
  },
  es: {
    labelKey: "spanish",
    nativeLocale: "es-ES",
    providerCode: "es",
    googleCloudLocale: "es-ES",
    xaiTtsLocale: "es-ES",
    qwenTtsLanguage: "Spanish",
  },
  fr: {
    labelKey: "french",
    nativeLocale: "fr-FR",
    providerCode: "fr",
    googleCloudLocale: "fr-FR",
    xaiTtsLocale: "fr",
    qwenTtsLanguage: "French",
  },
  it: {
    labelKey: "italian",
    nativeLocale: "it-IT",
    providerCode: "it",
    googleCloudLocale: "it-IT",
    xaiTtsLocale: "it",
    qwenTtsLanguage: "Italian",
  },
  pt: {
    labelKey: "portuguese",
    nativeLocale: "pt-PT",
    providerCode: "pt",
    googleCloudLocale: "pt-PT",
    xaiTtsLocale: "pt-PT",
    qwenTtsLanguage: "Portuguese",
  },
  "pt-BR": {
    labelKey: "portugueseBrazil",
    nativeLocale: "pt-BR",
    providerCode: "pt",
    googleCloudLocale: "pt-BR",
    xaiTtsLocale: "pt-BR",
    qwenTtsLanguage: "Portuguese",
  },
  ru: {
    labelKey: "russian",
    nativeLocale: "ru-RU",
    providerCode: "ru",
    googleCloudLocale: "ru-RU",
    xaiTtsLocale: "ru",
    qwenTtsLanguage: "Russian",
  },
  "zh-CN": {
    labelKey: "simplifiedChinese",
    nativeLocale: "zh-CN",
    providerCode: "zh",
    googleCloudLocale: "cmn-Hans-CN",
    xaiTtsLocale: "zh",
    qwenTtsLanguage: "Chinese",
  },
  ar: {
    labelKey: "arabic",
    nativeLocale: "ar-SA",
    providerCode: "ar",
    googleCloudLocale: "ar-XA",
    xaiTtsLocale: "ar-SA",
    qwenTtsLanguage: null,
  },
  ja: {
    labelKey: "japanese",
    nativeLocale: "ja-JP",
    providerCode: "ja",
    googleCloudLocale: "ja-JP",
    xaiTtsLocale: "ja",
    qwenTtsLanguage: "Japanese",
  },
  hu: {
    labelKey: "hungarian",
    nativeLocale: "hu-HU",
    providerCode: "hu",
    googleCloudLocale: "hu-HU",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
  cs: {
    labelKey: "czech",
    nativeLocale: "cs-CZ",
    providerCode: "cs",
    googleCloudLocale: "cs-CZ",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
  pl: {
    labelKey: "polish",
    nativeLocale: "pl-PL",
    providerCode: "pl",
    googleCloudLocale: "pl-PL",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
  tr: {
    labelKey: "turkish",
    nativeLocale: "tr-TR",
    providerCode: "tr",
    googleCloudLocale: "tr-TR",
    xaiTtsLocale: "tr-TR",
    qwenTtsLanguage: null,
  },
} as const satisfies Record<string, SpeechLanguageDefinition>;

export type SpeechLanguage = keyof typeof SPEECH_LANGUAGE_REGISTRY;
export type SttLanguage = "auto" | SpeechLanguage;

export const SPEECH_LANGUAGE_OPTIONS = Object.freeze(
  Object.keys(SPEECH_LANGUAGE_REGISTRY) as SpeechLanguage[],
);

export function isSpeechLanguage(value: unknown): value is SpeechLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SPEECH_LANGUAGE_REGISTRY, value)
  );
}

export function normalizeSpeechLanguage(
  value: unknown,
): SpeechLanguage | null {
  if (value === "zh") {
    return "zh-CN";
  }

  return isSpeechLanguage(value) ? value : null;
}

export function isSttLanguage(value: unknown): value is SttLanguage {
  return value === "auto" || normalizeSpeechLanguage(value) !== null;
}

export function normalizeSttLanguage(
  value: unknown,
  fallback: SttLanguage = "auto",
): SttLanguage {
  if (value === "auto") {
    return value;
  }

  return normalizeSpeechLanguage(value) ?? fallback;
}

export function getSpeechLanguageDefinition(language: SpeechLanguage) {
  return SPEECH_LANGUAGE_REGISTRY[language];
}
