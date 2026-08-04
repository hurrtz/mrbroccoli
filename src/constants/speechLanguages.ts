import type { TranslationKey } from "../i18n/types";
import type { AppLanguage } from "../i18n/localeRegistry";

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
  sv: {
    labelKey: "swedish",
    nativeLocale: "sv-SE",
    providerCode: "sv",
    googleCloudLocale: "sv-SE",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
  ur: {
    labelKey: "urdu",
    nativeLocale: "ur-PK",
    providerCode: "ur",
    googleCloudLocale: "ur-PK",
    xaiTtsLocale: null,
    qwenTtsLanguage: null,
  },
} as const satisfies Record<string, SpeechLanguageDefinition>;

export type SpeechLanguage = keyof typeof SPEECH_LANGUAGE_REGISTRY;
export type SttLanguage = "auto" | SpeechLanguage;

export const FREE_SPEECH_LANGUAGE_OPTIONS = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ru",
  "it",
] as const satisfies readonly SpeechLanguage[];
export type FreeSpeechLanguage = (typeof FREE_SPEECH_LANGUAGE_OPTIONS)[number];

export function normalizeFreeSpeechLanguage(
  value: SpeechLanguage,
): FreeSpeechLanguage | null {
  const normalized = value === "pt-BR" ? "pt" : value;
  return FREE_SPEECH_LANGUAGE_OPTIONS.includes(normalized as FreeSpeechLanguage)
    ? (normalized as FreeSpeechLanguage)
    : null;
}

export function resolveFreeSpeechLanguage(
  language: FreeSpeechLanguage,
  preferredLocale: string,
): SpeechLanguage {
  if (language !== "pt") {
    return language;
  }

  return /^pt[-_]br\b/i.test(preferredLocale) ? "pt-BR" : "pt";
}

export function getAppLanguageForFreeSpeechLanguage(
  language: SpeechLanguage,
): AppLanguage {
  if (language === "pt-BR") {
    return "pt-BR";
  }

  return normalizeFreeSpeechLanguage(language) ?? "en";
}

export const SPEECH_LANGUAGE_OPTIONS = Object.freeze(
  Object.keys(SPEECH_LANGUAGE_REGISTRY) as SpeechLanguage[],
);

export function isSpeechLanguage(value: unknown): value is SpeechLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(SPEECH_LANGUAGE_REGISTRY, value)
  );
}

export function normalizeSpeechLanguage(value: unknown): SpeechLanguage | null {
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
