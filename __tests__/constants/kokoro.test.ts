import {
  DEFAULT_KOKORO_VOICES,
  getKokoroVoiceConfig,
  normalizeKokoroVoiceSelections,
  resolveKokoroLanguage,
} from "../../src/constants/kokoro";

describe("Kokoro configuration", () => {
  it("selects English and Chinese from supported reply languages", () => {
    expect(
      resolveKokoroLanguage({
        text: "A natural local voice.",
        listenLanguages: ["en", "zh"],
      }),
    ).toBe("en");
    expect(
      resolveKokoroLanguage({
        text: "你好，欢迎回来。",
        listenLanguages: ["en", "zh"],
      }),
    ).toBe("zh");
  });

  it("requires the system fallback when an unsupported language is selected", () => {
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
});
