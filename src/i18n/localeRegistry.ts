import { ar } from "./locales/ar";
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
import type { TranslationDictionary } from "./types";

export type AppTextDirection = "ltr" | "rtl";

export interface AntDesignLocaleCopy {
  modal: {
    ok: string;
    cancel: string;
    button: string;
  };
  picker: {
    ok: string;
    cancel: string;
    select: string;
  };
  search: {
    cancel: string;
  };
}

export interface AppLocaleDefinition {
  nativeName: string;
  intlLocale: string;
  direction: AppTextDirection;
  messages: TranslationDictionary;
  antDesign: AntDesignLocaleCopy;
  defaultContentLanguage: "en" | "de";
  defaultAssistantInstructions: string;
  defaultTtsListenLanguage: "en" | "de";
}

const DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS =
  "You are a voice assistant. The user is speaking to you and will hear your response read aloud. Respond naturally and conversationally as if talking. Never use markdown, bullet points, numbered lists, headers, or any formatting. Keep responses concise and spoken-friendly.";

const DEFAULT_GERMAN_ASSISTANT_INSTRUCTIONS =
  "Du bist ein Sprachassistent. Die Nutzerin oder der Nutzer spricht mit dir und wird deine Antwort vorgelesen bekommen. Antworte natürlich und gesprächsnah, als wärest du in einem echten Gespräch. Verwende niemals Markdown, Aufzählungen, nummerierte Listen, Überschriften oder sonstige Formatierung. Halte Antworten knapp und gut vorlesbar.";

function defineAppLocale(
  definition: Omit<
    AppLocaleDefinition,
    | "direction"
    | "defaultContentLanguage"
    | "defaultAssistantInstructions"
    | "defaultTtsListenLanguage"
  > &
    Partial<
      Pick<
        AppLocaleDefinition,
        | "direction"
        | "defaultContentLanguage"
        | "defaultAssistantInstructions"
        | "defaultTtsListenLanguage"
      >
    >,
): AppLocaleDefinition {
  return {
    direction: "ltr",
    defaultContentLanguage: "en",
    defaultAssistantInstructions: DEFAULT_ENGLISH_ASSISTANT_INSTRUCTIONS,
    defaultTtsListenLanguage: "en",
    ...definition,
  };
}

/**
 * The single registration point for app-interface locales.
 *
 * Adding a locale requires one dictionary and one entry here. Language
 * persistence, formatting, direction, picker options, and Ant Design copy are
 * all derived from this registry.
 */
export const APP_LOCALES = {
  en: defineAppLocale({
    nativeName: "English",
    intlLocale: "en-US",
    messages: en,
    antDesign: {
      modal: { ok: "OK", cancel: "Cancel", button: "Button" },
      picker: { ok: "OK", cancel: "Cancel", select: "Select" },
      search: { cancel: "Cancel" },
    },
  }),
  de: defineAppLocale({
    nativeName: "Deutsch",
    intlLocale: "de-DE",
    messages: de,
    antDesign: {
      modal: { ok: "OK", cancel: "Abbrechen", button: "Schaltfläche" },
      picker: { ok: "OK", cancel: "Abbrechen", select: "Auswählen" },
      search: { cancel: "Abbrechen" },
    },
    defaultContentLanguage: "de",
    defaultAssistantInstructions: DEFAULT_GERMAN_ASSISTANT_INSTRUCTIONS,
    defaultTtsListenLanguage: "de",
  }),
  uk: defineAppLocale({
    nativeName: "Українська",
    intlLocale: "uk-UA",
    messages: uk,
    antDesign: {
      modal: { ok: "Гаразд", cancel: "Скасувати", button: "Кнопка" },
      picker: { ok: "Гаразд", cancel: "Скасувати", select: "Вибрати" },
      search: { cancel: "Скасувати" },
    },
  }),
  hi: defineAppLocale({
    nativeName: "हिन्दी",
    intlLocale: "hi-IN",
    messages: hi,
    antDesign: {
      modal: { ok: "ठीक है", cancel: "रद्द करें", button: "बटन" },
      picker: { ok: "ठीक है", cancel: "रद्द करें", select: "चुनें" },
      search: { cancel: "रद्द करें" },
    },
  }),
  es: defineAppLocale({
    nativeName: "Español",
    intlLocale: "es-ES",
    messages: es,
    antDesign: {
      modal: { ok: "Aceptar", cancel: "Cancelar", button: "Botón" },
      picker: { ok: "Aceptar", cancel: "Cancelar", select: "Seleccionar" },
      search: { cancel: "Cancelar" },
    },
  }),
  fr: defineAppLocale({
    nativeName: "Français",
    intlLocale: "fr-FR",
    messages: fr,
    antDesign: {
      modal: { ok: "OK", cancel: "Annuler", button: "Bouton" },
      picker: { ok: "OK", cancel: "Annuler", select: "Sélectionner" },
      search: { cancel: "Annuler" },
    },
  }),
  it: defineAppLocale({
    nativeName: "Italiano",
    intlLocale: "it-IT",
    messages: it,
    antDesign: {
      modal: { ok: "OK", cancel: "Annulla", button: "Pulsante" },
      picker: { ok: "OK", cancel: "Annulla", select: "Seleziona" },
      search: { cancel: "Annulla" },
    },
  }),
  pt: defineAppLocale({
    nativeName: "Português",
    intlLocale: "pt-PT",
    messages: pt,
    antDesign: {
      modal: { ok: "OK", cancel: "Cancelar", button: "Botão" },
      picker: { ok: "OK", cancel: "Cancelar", select: "Selecionar" },
      search: { cancel: "Cancelar" },
    },
  }),
  "pt-BR": defineAppLocale({
    nativeName: "Português (Brasil)",
    intlLocale: "pt-BR",
    messages: ptBR,
    antDesign: {
      modal: { ok: "OK", cancel: "Cancelar", button: "Botão" },
      picker: { ok: "OK", cancel: "Cancelar", select: "Selecionar" },
      search: { cancel: "Cancelar" },
    },
  }),
  ru: defineAppLocale({
    nativeName: "Русский",
    intlLocale: "ru-RU",
    messages: ru,
    antDesign: {
      modal: { ok: "ОК", cancel: "Отмена", button: "Кнопка" },
      picker: { ok: "ОК", cancel: "Отмена", select: "Выбрать" },
      search: { cancel: "Отмена" },
    },
  }),
  "zh-CN": defineAppLocale({
    nativeName: "简体中文",
    intlLocale: "zh-CN",
    messages: zhCN,
    antDesign: {
      modal: { ok: "确定", cancel: "取消", button: "按钮" },
      picker: { ok: "确定", cancel: "取消", select: "请选择" },
      search: { cancel: "取消" },
    },
  }),
  ar: defineAppLocale({
    nativeName: "العربية",
    intlLocale: "ar",
    direction: "rtl",
    messages: ar,
    antDesign: {
      modal: { ok: "موافق", cancel: "إلغاء", button: "زر" },
      picker: { ok: "موافق", cancel: "إلغاء", select: "اختر" },
      search: { cancel: "إلغاء" },
    },
  }),
} as const;

export type AppLanguage = keyof typeof APP_LOCALES;
export type LocalizedResource<T> = Readonly<
  { en: T } & Partial<Record<AppLanguage, T>>
>;

export const APP_LANGUAGES = Object.freeze(
  Object.keys(APP_LOCALES) as AppLanguage[],
);

export const APP_LANGUAGE_OPTIONS = Object.freeze(
  APP_LANGUAGES.map((value) => ({
    value,
    label: APP_LOCALES[value].nativeName,
  })),
);

export const translations = Object.freeze(
  Object.fromEntries(
    APP_LANGUAGES.map((language) => [
      language,
      APP_LOCALES[language].messages,
    ]),
  ) as Record<AppLanguage, TranslationDictionary>,
);

export function isAppLanguage(value: unknown): value is AppLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(APP_LOCALES, value)
  );
}

export function getAppLocale(language: AppLanguage): AppLocaleDefinition {
  return APP_LOCALES[language];
}

export function getLocalizedResource<T>(
  resource: LocalizedResource<T>,
  language: AppLanguage,
): T {
  return resource[language] ?? resource.en;
}

export function getDefaultAssistantInstructionsForLocale(
  language: AppLanguage,
) {
  return getAppLocale(language).defaultAssistantInstructions;
}

export function getDefaultContentLanguageForLocale(language: AppLanguage) {
  return getAppLocale(language).defaultContentLanguage;
}

export function getDefaultTtsListenLanguageForLocale(language: AppLanguage) {
  return getAppLocale(language).defaultTtsListenLanguage;
}
