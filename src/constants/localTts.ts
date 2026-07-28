import type { AppLanguage, TtsListenLanguage } from "../types";
import { translate, type TranslationKey } from "../i18n";

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

const LANGUAGE_LABEL_KEYS: Record<TtsListenLanguage, TranslationKey> = {
  en: "english",
  de: "german",
  zh: "simplifiedChinese",
  es: "spanish",
  pt: "portuguese",
  hi: "hindi",
  fr: "french",
  it: "italian",
  ja: "japanese",
};

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return translate(language, LANGUAGE_LABEL_KEYS[code]);
}
