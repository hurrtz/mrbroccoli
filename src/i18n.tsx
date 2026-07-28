import React, { createContext, useContext, useMemo } from "react";
import type { AppLanguage, AppTextDirection } from "./i18n/localeRegistry";
import { getAppLocale } from "./i18n/localeRegistry";
import {
  translations,
  type TranslationParams,
} from "./i18n/translations";
import type { TranslationKey } from "./i18n/types";

export type { TranslationKey } from "./i18n/types";

export function translate(
  language: AppLanguage,
  key: TranslationKey,
  params: TranslationParams = {},
) {
  const value = translations[language][key] ?? translations.en[key];
  return typeof value === "function" ? value(params) : value;
}

export function getLocaleForLanguage(language: AppLanguage) {
  return getAppLocale(language).intlLocale;
}

interface LocalizationContextValue {
  language: AppLanguage;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  locale: string;
  direction: AppTextDirection;
  isRtl: boolean;
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
    () => {
      const locale = getAppLocale(language);

      return {
        language,
        locale: locale.intlLocale,
        direction: locale.direction,
        isRtl: locale.direction === "rtl",
        t: (key, params) => translate(language, key, params),
      };
    },
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
