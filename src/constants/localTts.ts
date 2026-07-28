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
  Record<AppLanguage, string>
> = {
  en: { en: "English", de: "Englisch", uk: "Англійська" },
  de: { en: "German", de: "Deutsch", uk: "Німецька" },
  zh: {
    en: "Simplified Chinese",
    de: "Vereinfachtes Chinesisch",
    uk: "Спрощена китайська",
  },
  es: { en: "Spanish", de: "Spanisch", uk: "Іспанська" },
  pt: { en: "Portuguese", de: "Portugiesisch", uk: "Португальська" },
  hi: { en: "Hindi", de: "Hindi", uk: "Гінді" },
  fr: { en: "French", de: "Französisch", uk: "Французька" },
  it: { en: "Italian", de: "Italienisch", uk: "Італійська" },
  ja: { en: "Japanese", de: "Japanisch", uk: "Японська" },
};

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return LANGUAGE_LABELS[code][language];
}
