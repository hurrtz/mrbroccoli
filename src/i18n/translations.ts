import type { AppLanguage } from "../types";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { it } from "./locales/it";
import { pt } from "./locales/pt";
import { ptBR } from "./locales/ptBR";
import { ru } from "./locales/ru";
import { uk } from "./locales/uk";
import { zhCN } from "./locales/zhCN";
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
  pt,
  "pt-BR": ptBR,
  ru,
  "zh-CN": zhCN,
} satisfies Record<AppLanguage, TranslationDictionary>;
