import { resolveFreeLanguageFromStorefront } from "../../src/services/freeOnboardingLanguage";

describe("Free onboarding storefront language", () => {
  it.each([
    ["DE", "en-US", "de"],
    ["ES", "de-DE", "es"],
    ["BR", "en-US", "pt-BR"],
    ["PT", "pt-PT", "pt"],
    ["RU", "en-US", "ru"],
    ["IT", "en-US", "it"],
  ] as const)("maps %s to %s", (storefront, locale, expected) => {
    expect(resolveFreeLanguageFromStorefront(storefront, locale)).toBe(
      expected,
    );
  });

  it("uses the phone locale to disambiguate multilingual storefronts", () => {
    expect(resolveFreeLanguageFromStorefront("CH", "it-CH")).toBe("it");
    expect(resolveFreeLanguageFromStorefront("CA", "fr-CA")).toBe("fr");
  });

  it("falls back to English without a supported storefront", () => {
    expect(resolveFreeLanguageFromStorefront(undefined, "de-DE")).toBe("en");
    expect(resolveFreeLanguageFromStorefront("JP", "ja-JP")).toBe("en");
  });
});
