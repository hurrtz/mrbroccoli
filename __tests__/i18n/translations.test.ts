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
  it.each(APP_LANGUAGES)(
    "%s does not promise downloading or connecting answer models in Thinking",
    (language) => {
      // Thinking adds routes from ready providers. Installation belongs only
      // to speech settings; provider credentials belong to Connections.
      const retiredPromises: Record<keyof typeof translations, RegExp> = {
        en: /download|connect/i,
        de: /heruntergeladen|verbunden/i,
        uk: /завантаж|підключ/i,
        hi: /डाउनलोड|कनेक्ट/,
        es: /descarg|conect/i,
        fr: /télécharg|connect/i,
        it: /scaricat|collegat/i,
        pt: /transferid|ligad/i,
        "pt-BR": /baixad|conectad/i,
        ru: /скачать|подключ/i,
        "zh-CN": /下载|连接/,
        ar: /يُنزّل|يُوصل/,
        ja: /ダウンロード|接続/,
        hu: /tölthető|kapcsolható/i,
        cs: /stáhne|připojí/i,
        pl: /pobrać|połączyć/i,
        tr: /indirilir|bağlanır/i,
        sv: /hämtas|ansluts/i,
        ur: /ڈاؤن لوڈ|مربوط/,
      };
      expect(translations[language].answeringModelsFooter).not.toMatch(
        retiredPromises[language],
      );
    },
  );

  it.each(APP_LANGUAGES)(
    "%s does not send speech-model downloads to Thinking",
    (language) => {
      const retiredDestinations: Record<keyof typeof translations, RegExp> = {
        en: /Thinking/,
        de: /Denken/,
        uk: /Мислення|Міркування/,
        hi: /सोच/,
        es: /Pensamiento/,
        fr: /Réflexion|Pensée/,
        it: /Pensiero/,
        pt: /Pensar|Pensamento/,
        "pt-BR": /Pensar|Pensamento/,
        ru: /Мышление/,
        "zh-CN": /思考/,
        ar: /التفكير/,
        ja: /思考/,
        hu: /Gondolkodás/,
        cs: /Myšlení|Přemýšlení/,
        pl: /Myślenie/,
        tr: /Düşünme/,
        sv: /Tänkande/,
        ur: /سوچ/,
      };
      expect(translations[language].modelStorageFooter).not.toMatch(
        retiredDestinations[language],
      );
    },
  );

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
        const localizedValue = dictionary[key as keyof typeof translations.en];
        expect(typeof localizedValue).toBe(typeof baseValue);

        if (typeof localizedValue === "string") {
          expect(localizedValue.trim().length).toBeGreaterThan(0);
        }
      });
    });
  });

  it("interpolates the same parameters as English in every locale", () => {
    const collectParameters = (formatter: (input: never) => string) => {
      const accessed = new Set<string>();
      const probe = new Proxy(
        {},
        {
          get: (_target, property) => {
            if (typeof property === "string") {
              accessed.add(property);
            }

            return `«${String(property)}»`;
          },
        },
      );

      formatter(probe as never);

      return [...accessed].sort();
    };

    Object.entries(translations).forEach(([language, dictionary]) => {
      Object.entries(translations.en).forEach(([key, baseValue]) => {
        if (typeof baseValue !== "function") {
          return;
        }

        const localizedValue = dictionary[key as keyof typeof translations.en];

        expect({
          language,
          key,
          parameters: collectParameters(
            localizedValue as (input: never) => string,
          ),
        }).toEqual({
          language,
          key,
          parameters: collectParameters(baseValue as (input: never) => string),
        });
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

  it("uses localized Model Council naming in every interface language", () => {
    const legacyCouncilNames = [
      "Übermodus",
      "Суперрежим",
      "सर्वोच्च मोड",
      "Modo supremo",
      "Mode suprême",
      "Modalità suprema",
      "Modo Supremo",
      "终极模式",
      "الوضع الفائق",
      "究極モード",
      "Szuper mód",
      "Superrežim",
      "Supertryb",
      "Süper Mod",
      "Superläge",
      "اعلیٰ موڈ",
    ];
    Object.values(translations).forEach((dictionary) => {
      expect(dictionary.ulraMode).not.toContain("Ulra");
      expect(JSON.stringify(dictionary)).not.toContain("Ulra");
      expect(JSON.stringify(dictionary)).not.toContain("Ultra");
      legacyCouncilNames.forEach((name) => {
        expect(JSON.stringify(dictionary)).not.toContain(name);
      });
    });
    expect(translations.en.ulraMode).toBe("Model Council");
    expect(translations.de.ulraMode).toBe("Modellrat");
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

  it("adds the session-scoped Hands free state only while it is enabled", () => {
    expect(
      translate("en", "conversationSettingsSummary", {
        handsFree: "",
        length: "Thorough",
        tone: "Nerdy",
        voice: "Eve",
      }),
    ).toBe("Thorough · Nerdy · Eve");
    expect(
      translate("en", "conversationSettingsSummary", {
        handsFree: "Enabled",
        length: "Thorough",
        tone: "Nerdy",
        voice: "Eve",
      }),
    ).toBe("Hands free: Enabled · Thorough · Nerdy · Eve");
  });

  it("omits conversation parameter labels in every locale", () => {
    APP_LANGUAGES.forEach((language) => {
      expect(
        translate(language, "conversationSettingsSummary", {
          handsFree: "",
          length: "L",
          tone: "T",
          voice: "V",
        }),
      ).toBe("L · T · V");
    });
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

  it("localizes the visible wordmark with the interface language", () => {
    expect(
      Object.fromEntries(
        APP_LANGUAGES.map((language) => [
          language,
          translations[language].appName,
        ]),
      ),
    ).toEqual({
      en: "Mr Broccoli",
      de: "Mr. Brokkoli",
      uk: "Пан Броколі",
      hi: "मिस्टर ब्रोकली",
      es: "Sr. Brócoli",
      fr: "M. Brocoli",
      it: "Sig. Broccoli",
      pt: "Sr. Brócolo",
      "pt-BR": "Sr. Brócolis",
      ru: "Мистер Брокколи",
      "zh-CN": "西兰花先生",
      ar: "السيد بروكلي",
      ja: "ミスター・ブロッコリー",
      hu: "Brokkoli úr",
      cs: "Pan Brokolice",
      pl: "Pan Brokuł",
      tr: "Bay Brokoli",
      sv: "Herr Broccoli",
      ur: "مسٹر بروکلی",
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
        const rendered = (
          value as (params: { tone: string; length: string }) => string
        )({
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
