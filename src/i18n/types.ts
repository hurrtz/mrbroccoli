import type { en } from "./locales/en";

export type TranslationParams = Record<string, string | number | undefined>;
export type TranslationValue = string | ((params: TranslationParams) => string);
export type TranslationKey = keyof typeof en;
export type TranslationDictionary = {
  readonly [Key in TranslationKey]: (typeof en)[Key] extends (
    params: TranslationParams,
  ) => string
    ? (params: TranslationParams) => string
    : string;
};
