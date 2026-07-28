import React, { createContext, useContext, useMemo } from "react";
import { AppLanguage } from "./types";
import {
  translations,
  type TranslationParams,
} from "./i18n/translations";

export type TranslationKey = keyof typeof translations.en;

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  params: TranslationParams = {},
) {
  const value = translations[language][key] ?? translations.en[key];
  return typeof value === "function" ? value(params) : value;
}

export function getLocaleForLanguage(language: AppLanguage) {
  if (language === "de") {
    return "de-DE";
  }
  if (language === "uk") {
    return "uk-UA";
  }
  if (language === "hi") {
    return "hi-IN";
  }
  if (language === "es") {
    return "es-ES";
  }
  if (language === "fr") {
    return "fr-FR";
  }
  if (language === "it") {
    return "it-IT";
  }
  if (language === "pt") {
    return "pt-PT";
  }
  if (language === "pt-BR") {
    return "pt-BR";
  }
  if (language === "ru") {
    return "ru-RU";
  }
  return "en-US";
}

interface LocalizationContextValue {
  language: AppLanguage;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  locale: string;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(
  null,
);

export function LocalizationProvider({
  language,
  children,
}: {
  language: AppLanguage;
  children: React.ReactNode;
}) {
  const value = useMemo<LocalizationContextValue>(
    () => ({
      language,
      locale: getLocaleForLanguage(language),
      t: (key, params) => translate(language, key, params),
    }),
    [language],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider",
    );
  }

  return context;
}
