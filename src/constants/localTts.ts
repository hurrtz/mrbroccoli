import type { AppLanguage, TtsListenLanguage } from "../types";

export const TTS_LISTEN_LANGUAGE_OPTIONS: TtsListenLanguage[] = [
  "en",
  "de",
  "zh",
  "es",
  "pt",
  "hi",
  "fr",
  "it",
  "ja",
];

const LANGUAGE_LABELS: Record<
  TtsListenLanguage,
  { en: string; de: string }
> = {
  en: { en: "English", de: "Englisch" },
  de: { en: "German", de: "Deutsch" },
  zh: { en: "Simplified Chinese", de: "Vereinfachtes Chinesisch" },
  es: { en: "Spanish", de: "Spanisch" },
  pt: { en: "Portuguese", de: "Portugiesisch" },
  hi: { en: "Hindi", de: "Hindi" },
  fr: { en: "French", de: "Französisch" },
  it: { en: "Italian", de: "Italienisch" },
  ja: { en: "Japanese", de: "Japanisch" },
};

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return LANGUAGE_LABELS[code][language];
}
