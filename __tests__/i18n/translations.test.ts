import { translations } from "../../src/i18n/translations";
import { getLocaleForLanguage, translate } from "../../src/i18n";

describe("translations", () => {
  it("keeps all translation keys in sync", () => {
    Object.values(translations).forEach((dictionary) => {
      expect(Object.keys(dictionary).sort()).toEqual(
        Object.keys(translations.en).sort(),
      );
    });
  });

  it("uses the current app name in localized UI copy", () => {
    expect(translations.en.appName).toBe("Mr Broccoli");
    expect(translations.de.appName).toBe("Mr. Brokkoli");
    expect(translations.uk.appName).toBe("Пан Броколі");
    expect(translations.hi.appName).toBe("मिस्टर ब्रोकली");
    expect(translations.es.appName).toBe("Sr. Brócoli");
    expect(translations.fr.appName).toBe("M. Brocoli");
    expect(translations.it.appName).toBe("Sig. Broccoli");
    expect(JSON.stringify(translations.de)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.uk)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.hi)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.es)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.fr)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.it)).not.toContain("Mr Broccoli");
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
