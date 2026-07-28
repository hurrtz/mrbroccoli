import { translations } from "../../src/i18n/translations";
import { getLocaleForLanguage, translate } from "../../src/i18n";

describe("translations", () => {
  it("keeps all translation keys in sync", () => {
    expect(Object.keys(translations.de).sort()).toEqual(
      Object.keys(translations.en).sort(),
    );
    expect(Object.keys(translations.uk).sort()).toEqual(
      Object.keys(translations.en).sort(),
    );
  });

  it("uses the current app name in localized UI copy", () => {
    expect(translations.en.appName).toBe("Mr Broccoli");
    expect(translations.de.appName).toBe("Mr. Brokkoli");
    expect(translations.uk.appName).toBe("Пан Броколі");
    expect(JSON.stringify(translations.de)).not.toContain("Mr Broccoli");
    expect(JSON.stringify(translations.uk)).not.toContain("Mr Broccoli");
  });

  it("resolves Ukrainian UI copy and regional formatting", () => {
    expect(translate("uk", "settings")).toBe("Налаштування");
    expect(getLocaleForLanguage("uk")).toBe("uk-UA");
  });

  describe("home-screen style chip keys", () => {
    it.each(["en", "de", "uk"] as const)(
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

    it.each(["en", "de", "uk"] as const)(
      "%s defines styleSheetTitle as a non-empty string",
      (lang) => {
        const value = translations[lang].styleSheetTitle;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );

    it.each(["en", "de", "uk"] as const)(
      "%s defines styleSheetSubtitle as a non-empty string",
      (lang) => {
        const value = translations[lang].styleSheetSubtitle;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );

    it.each(["en", "de", "uk"] as const)(
      "%s defines openStyleSheet as a non-empty string",
      (lang) => {
        const value = translations[lang].openStyleSheet;
        expect(typeof value).toBe("string");
        expect((value as string).length).toBeGreaterThan(0);
      },
    );
  });
});
