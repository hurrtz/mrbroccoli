import type { AppLanguage } from "../types";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { hi } from "./locales/hi";
import { uk } from "./locales/uk";
import type { TranslationDictionary, TranslationParams, TranslationValue } from "./types";

export type { TranslationDictionary, TranslationParams, TranslationValue } from "./types";

export const translations = {
  en,
  de,
  uk,
  hi,
} satisfies Record<AppLanguage, TranslationDictionary>;
