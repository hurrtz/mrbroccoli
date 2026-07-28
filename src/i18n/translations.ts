import type { AppLanguage } from "../types";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { it } from "./locales/it";
import { uk } from "./locales/uk";
import type { TranslationDictionary, TranslationParams, TranslationValue } from "./types";

export type { TranslationDictionary, TranslationParams, TranslationValue } from "./types";

export const translations = {
  en,
  de,
  uk,
  hi,
  es,
  fr,
  it,
} satisfies Record<AppLanguage, TranslationDictionary>;
