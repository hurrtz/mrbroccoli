import fs from "node:fs";
import path from "node:path";

import { translations } from "../../src/i18n/translations";
import { getLocaleForLanguage, translate } from "../../src/i18n";
import {
  APP_LANGUAGE_OPTIONS,
  APP_LANGUAGES,
  APP_LOCALES,
  getAppLocale,
  getLocalizedResource,
  isAppLanguage,
} from "../../src/i18n/localeRegistry";

describe("translations", () => {
  it("derives every public language collection from the locale registry", () => {
    expect(Object.keys(APP_LOCALES)).toEqual(APP_LANGUAGES);
    expect(Object.keys(translations)).toEqual(APP_LANGUAGES);
    expect(APP_LANGUAGE_OPTIONS).toEqual(
      APP_LANGUAGES.map((language) => ({
        value: language,
        label: APP_LOCALES[language].nativeName,
      })),
    );
  });

  it("registers every locale dictionary exactly once", () => {
    const localeFiles = fs
      .readdirSync(path.resolve(__dirname, "../../src/i18n/locales"))
      .filter((fileName) => fileName.endsWith(".ts"));
    const registeredDictionaries = APP_LANGUAGES.map(
      (language) => APP_LOCALES[language].messages,
    );

    expect(localeFiles).toHaveLength(APP_LANGUAGES.length);
    expect(new Set(registeredDictionaries).size).toBe(APP_LANGUAGES.length);
  });

  it("keeps all translation keys and value kinds in sync", () => {
    Object.values(translations).forEach((dictionary) => {
      expect(Object.keys(dictionary).sort()).toEqual(
        Object.keys(translations.en).sort(),
      );

      Object.entries(translations.en).forEach(([key, baseValue]) => {
        const localizedValue =
          dictionary[key as keyof typeof translations.en];
        expect(typeof localizedValue).toBe(typeof baseValue);

        if (typeof localizedValue === "string") {
          expect(localizedValue.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });

  it("does not silently ship known English phrases in other locales", () => {
    const englishInterfacePhrases = [
      "push to talk",
      "toggle to talk",
      "drive session",
      "native voice preview",
      "download kokoro",
    ];

    APP_LANGUAGES.filter((language) => language !== "en").forEach(
      (language) => {
        const serializedDictionary = JSON.stringify(
          translations[language],
        ).toLocaleLowerCase("en");

        englishInterfacePhrases.forEach((phrase) => {
          expect(serializedDictionary).not.toContain(phrase);
        });
      },
    );
  });

  it("uses localized Uber Mode naming in every interface language", () => {
    Object.values(translations).forEach((dictionary) => {
      expect(dictionary.ulraMode).not.toContain("Ulra");
      expect(JSON.stringify(dictionary)).not.toContain("Ulra");
      expect(JSON.stringify(dictionary)).not.toContain("Ultra");
    });
    expect(translations.en.ulraMode).toBe("Uber Mode");
    expect(translations.de.ulraMode).toBe("Übermodus");
  });

  it("validates language IDs and falls back only for optional resources", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(isAppLanguage(language)).toBe(true);
      expect(getLocaleForLanguage(language)).toBe(
        getAppLocale(language).intlLocale,
      );
    });
    expect(isAppLanguage("not-a-language")).toBe(false);
    expect(isAppLanguage(null)).toBe(false);
    expect(getLocalizedResource({ en: "English", de: "Deutsch" }, "ar")).toBe(
      "English",
    );
  });

  it("renders formatter keys through the same exact dictionary contract", () => {
    expect(
      translate("en", "catalogProviderPricingSummary", {
        summary: "$1 per request",
      }),
    ).toBe("Pricing: $1 per request");
  });

  it("keeps text direction in locale metadata", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(getAppLocale(language).direction).toBe(
        language === "ar" || language === "ur" ? "rtl" : "ltr",
      );
    });
  });

  it("provides a localized default assistant prompt for every interface language", () => {
    APP_LANGUAGES.filter((language) => language !== "en").forEach(
      (language) => {
        expect(getAppLocale(language).defaultAssistantInstructions).not.toBe(
          getAppLocale("en").defaultAssistantInstructions,
        );
      },
    );
  });

  it("keeps the exact Mr Broccoli brand in every interface language", () => {
    Object.values(translations).forEach((dictionary) => {
      expect(dictionary.appName).toBe("Mr Broccoli");
    });

    const retiredLocalizedNames = [
      "Mr. Brokkoli",
      "Пан Броколі",
      "Мистер Брокколи",
      "ミスター・ブロッコリー",
      "मिस्टर ब्रोकली",
      "السيد بروكلي",
      "مسٹر بروکلی",
      "西兰花先生",
      "Sr. Brócoli",
      "Sr. Brócolo",
      "Sr. Brócolis",
      "Sig. Broccoli",
      "M. Brocoli",
      "Brokkoli úr",
      "Pan Brokolice",
      "Pan Brokuł",
      "Bay Brokoli",
      "Herr Broccoli",
    ];
    const serializedTranslations = JSON.stringify(translations);
    retiredLocalizedNames.forEach((name) => {
      expect(serializedTranslations).not.toContain(name);
    });
  });

  it("resolves Ukrainian UI copy and regional formatting", () => {
    expect(translate("uk", "settings")).toBe("Налаштування");
    expect(getLocaleForLanguage("uk")).toBe("uk-UA");
  });

  it("resolves Hindi UI copy and regional formatting", () => {
    expect(translate("hi", "settings")).toBe("सेटिंग्स");
    expect(getLocaleForLanguage("hi")).toBe("hi-IN");
  });

  it("resolves Spanish UI copy and regional formatting", () => {
    expect(translate("es", "settings")).toBe("Ajustes");
    expect(getLocaleForLanguage("es")).toBe("es-ES");
  });

  it("resolves French UI copy and regional formatting", () => {
    expect(translate("fr", "settings")).toBe("Paramètres");
    expect(getLocaleForLanguage("fr")).toBe("fr-FR");
  });

  it("resolves Italian UI copy and regional formatting", () => {
    expect(translate("it", "settings")).toBe("Impostazioni");
    expect(getLocaleForLanguage("it")).toBe("it-IT");
  });

  it("resolves Portuguese UI copy and regional formatting", () => {
    expect(translate("pt", "settings")).toBe("Definições");
    expect(getLocaleForLanguage("pt")).toBe("pt-PT");
  });

  it("resolves Brazilian Portuguese UI copy and regional formatting", () => {
    expect(translate("pt-BR", "settings")).toBe("Configurações");
    expect(getLocaleForLanguage("pt-BR")).toBe("pt-BR");
  });

  it("resolves Russian UI copy and regional formatting", () => {
    expect(translate("ru", "settings")).toBe("Настройки");
    expect(getLocaleForLanguage("ru")).toBe("ru-RU");
  });

  it("resolves Simplified Chinese UI copy and regional formatting", () => {
    expect(translate("zh-CN", "settings")).toBe("设置");
    expect(getLocaleForLanguage("zh-CN")).toBe("zh-CN");
  });

  it("resolves Arabic UI copy and regional formatting", () => {
    expect(translate("ar", "settings")).toBe("الإعدادات");
    expect(getLocaleForLanguage("ar")).toBe("ar");
  });

  it("resolves Japanese UI copy and regional formatting", () => {
    expect(translate("ja", "settings")).toBe("設定");
    expect(getLocaleForLanguage("ja")).toBe("ja-JP");
  });

  it("resolves Hungarian UI copy and regional formatting", () => {
    expect(translate("hu", "settings")).toBe("Beállítások");
    expect(getLocaleForLanguage("hu")).toBe("hu-HU");
  });

  it("resolves Czech UI copy and regional formatting", () => {
    expect(translate("cs", "settings")).toBe("Nastavení");
    expect(getLocaleForLanguage("cs")).toBe("cs-CZ");
  });

  it("resolves Polish UI copy and regional formatting", () => {
    expect(translate("pl", "settings")).toBe("Ustawienia");
    expect(getLocaleForLanguage("pl")).toBe("pl-PL");
  });

  it("resolves Turkish UI copy and regional formatting", () => {
    expect(translate("tr", "settings")).toBe("Ayarlar");
    expect(getLocaleForLanguage("tr")).toBe("tr-TR");
  });

  it("resolves Swedish UI copy and regional formatting", () => {
    expect(translate("sv", "settings")).toBe("Inställningar");
    expect(getLocaleForLanguage("sv")).toBe("sv-SE");
  });

  it("resolves Urdu UI copy and regional formatting", () => {
    expect(translate("ur", "settings")).toBe("ترتیبات");
    expect(getLocaleForLanguage("ur")).toBe("ur-PK");
  });

  describe("home-screen style chip keys", () => {
    it.each(Object.keys(translations) as (keyof typeof translations)[])(
      "%s defines homeStyleChipLabel as a formatter",
      (lang) => {
        const value = translations[lang].homeStyleChipLabel;
        expect(typeof value).toBe("function");
        const rendered = (value as (params: { tone: string; length: string }) => string)({
          tone: "Casual",
          length: "Brief",
        });
        expect(rendered).toContain("Casual");
        expect(rendered).toContain("Brief");
      },
    );

    it.each(Object.keys(translations) as (keyof typeof translations)[])(
      "%s defines styleSheetTitle as a non-empty string",
      (lang) => {
        const value = translations[lang].styleSheetTitle;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );

    it.each(Object.keys(translations) as (keyof typeof translations)[])(
      "%s defines styleSheetSubtitle as a non-empty string",
      (lang) => {
        const value = translations[lang].styleSheetSubtitle;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );

    it.each(Object.keys(translations) as (keyof typeof translations)[])(
      "%s defines openStyleSheet as a non-empty string",
      (lang) => {
        const value = translations[lang].openStyleSheet;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );
  });
});
