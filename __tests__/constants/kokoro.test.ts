import {
  DEFAULT_KOKORO_VOICES,
  getKokoroVoiceConfig,
  getKokoroVoiceOptions,
  normalizeKokoroVoiceSelections,
  resolveKokoroLanguage,
} from "../../src/constants/kokoro";
import { APP_LANGUAGES } from "../../src/i18n/localeRegistry";

describe("Kokoro configuration", () => {
  it("selects English and Chinese from supported reply languages", () => {
    expect(
      resolveKokoroLanguage({
        text: "A natural local voice.",
        listenLanguages: ["en", "zh-CN"],
      }),
    ).toBe("en");
    expect(
      resolveKokoroLanguage({
        text: "你好，欢迎回来。",
        listenLanguages: ["en", "zh-CN"],
      }),
    ).toBe("zh");
  });

  it("reports unsupported selected languages without choosing a fallback", () => {
    expect(
      resolveKokoroLanguage({
        text: "Guten Morgen.",
        listenLanguages: ["de"],
      }),
    ).toBeNull();
    expect(
      resolveKokoroLanguage({
        text: "Hello.",
        listenLanguages: ["en", "de"],
      }),
    ).toBeNull();
  });

  it("normalizes unknown stored voices to stable defaults", () => {
    expect(
      normalizeKokoroVoiceSelections({
        en: "missing",
        zh: "zm_050",
      }),
    ).toEqual({
      en: DEFAULT_KOKORO_VOICES.en,
      zh: "zm_050",
    });
  });

  it("maps curated voice IDs to the model speaker IDs", () => {
    expect(getKokoroVoiceConfig("en", "af_sol").sid).toBe(1);
    expect(getKokoroVoiceConfig("zh", "zm_100").sid).toBe(102);
  });

  it.each(APP_LANGUAGES)(
    "provides localized voice labels for registered app language %s",
    (appLanguage) => {
      (["en", "zh"] as const).forEach((voiceLanguage) => {
        const options = getKokoroVoiceOptions(voiceLanguage, appLanguage);

        expect(options.length).toBeGreaterThan(0);
        options.forEach((option) => {
          expect(option.label.trim().length).toBeGreaterThan(0);
        });
      });
    },
  );
});
