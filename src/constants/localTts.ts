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
  en: { en: "English", de: "Englisch", uk: "Англійська", hi: "अंग्रेज़ी" },
  de: { en: "German", de: "Deutsch", uk: "Німецька", hi: "जर्मन" },
  zh: {
    en: "Simplified Chinese",
    de: "Vereinfachtes Chinesisch",
    uk: "Спрощена китайська",
    hi: "सरलीकृत चीनी",
  },
  es: { en: "Spanish", de: "Spanisch", uk: "Іспанська", hi: "स्पेनिश" },
  pt: { en: "Portuguese", de: "Portugiesisch", uk: "Португальська", hi: "पुर्तगाली" },
  hi: { en: "Hindi", de: "Hindi", uk: "Гінді", hi: "हिन्दी" },
  fr: { en: "French", de: "Französisch", uk: "Французька", hi: "फ़्रेंच" },
  it: { en: "Italian", de: "Italienisch", uk: "Італійська", hi: "इतालवी" },
  ja: { en: "Japanese", de: "Japanisch", uk: "Японська", hi: "जापानी" },
};

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return LANGUAGE_LABELS[code][language];
}
