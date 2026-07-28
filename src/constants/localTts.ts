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
  en: { en: "English", de: "Englisch", uk: "Англійська", hi: "अंग्रेज़ी", es: "Inglés", fr: "Anglais", it: "Inglese", pt: "Inglês" },
  de: { en: "German", de: "Deutsch", uk: "Німецька", hi: "जर्मन", es: "Alemán", fr: "Allemand", it: "Tedesco", pt: "Alemão" },
  zh: {
    en: "Simplified Chinese",
    de: "Vereinfachtes Chinesisch",
    uk: "Спрощена китайська",
    hi: "सरलीकृत चीनी",
    es: "Chino simplificado",
    fr: "Chinois simplifié",
    it: "Cinese semplificato",
    pt: "Chinês simplificado",
  },
  es: { en: "Spanish", de: "Spanisch", uk: "Іспанська", hi: "स्पेनिश", es: "Español", fr: "Espagnol", it: "Spagnolo", pt: "Espanhol" },
  pt: { en: "Portuguese", de: "Portugiesisch", uk: "Португальська", hi: "पुर्तगाली", es: "Portugués", fr: "Portugais", it: "Portoghese", pt: "Português" },
  hi: { en: "Hindi", de: "Hindi", uk: "Гінді", hi: "हिन्दी", es: "Hindi", fr: "Hindi", it: "Hindi", pt: "Hindi" },
  fr: { en: "French", de: "Französisch", uk: "Французька", hi: "फ़्रेंच", es: "Francés", fr: "Français", it: "Francese", pt: "Francês" },
  it: { en: "Italian", de: "Italienisch", uk: "Італійська", hi: "इतालवी", es: "Italiano", fr: "Italien", it: "Italiano", pt: "Italiano" },
  ja: { en: "Japanese", de: "Japanisch", uk: "Японська", hi: "जापानी", es: "Japonés", fr: "Japonais", it: "Giapponese", pt: "Japonês" },
};

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return LANGUAGE_LABELS[code][language];
}
