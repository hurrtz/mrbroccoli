/**
 * Regression coverage for App Review guideline 2.3.10: the iOS bundle must not
 * reference Google Play, and the Android bundle must not reference the App
 * Store. The restore hint therefore resolves per platform via Platform.select,
 * which babel-preset-expo platform shaking strips down to a single store name
 * in each release bundle.
 */

const APP_STORE_PATTERN = /App[\s -]?Store/;
const PLAY_STORE_PATTERN = /Play[\s -]?Store/;

type PremiumDictionary = { premiumRestoreHint: string };

function loadPremiumTranslations(
  os: "ios" | "android",
): Record<string, PremiumDictionary> {
  let dictionaries: Record<string, PremiumDictionary> | null = null;
  jest.isolateModules(() => {
    jest.doMock("react-native", () => ({
      Platform: {
        OS: os,
        select: (spec: Record<string, string>) =>
          spec[os] ?? spec.default,
      },
    }));
    dictionaries = (
      require("../../src/i18n/premiumTranslations") as {
        premiumTranslations: Record<string, PremiumDictionary>;
      }
    ).premiumTranslations;
  });
  jest.dontMock("react-native");
  expect(dictionaries).not.toBeNull();
  return dictionaries!;
}

describe("premiumRestoreHint store references", () => {
  it("references only the App Store in every locale on iOS", () => {
    const dictionaries = loadPremiumTranslations("ios");
    expect(Object.keys(dictionaries).length).toBeGreaterThanOrEqual(19);
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      const hint = dictionary.premiumRestoreHint;
      expect(typeof hint).toBe("string");
      expect(`${locale}: ${hint}`).toMatch(APP_STORE_PATTERN);
      expect(`${locale}: ${hint}`).not.toMatch(/Play/);
      expect(`${locale}: ${hint}`).not.toMatch(/Google/);
    }
  });

  it("references only the Play Store in every locale on Android", () => {
    const dictionaries = loadPremiumTranslations("android");
    expect(Object.keys(dictionaries).length).toBeGreaterThanOrEqual(19);
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      const hint = dictionary.premiumRestoreHint;
      expect(typeof hint).toBe("string");
      expect(`${locale}: ${hint}`).toMatch(PLAY_STORE_PATTERN);
      expect(`${locale}: ${hint}`).not.toMatch(APP_STORE_PATTERN);
    }
  });
});
