import type { AppLanguage, TtsListenLanguage } from "../types";
import { translate, type TranslationKey } from "../i18n";
import {
  SPEECH_LANGUAGE_OPTIONS,
  SPEECH_LANGUAGE_REGISTRY,
} from "./speechLanguages";

export const TTS_LISTEN_LANGUAGE_OPTIONS: TtsListenLanguage[] = [
  ...SPEECH_LANGUAGE_OPTIONS,
];

export function getTtsListenLanguageLabel(
  code: TtsListenLanguage,
  language: AppLanguage
) {
  return translate(
    language,
    SPEECH_LANGUAGE_REGISTRY[code].labelKey as TranslationKey,
  );
}
