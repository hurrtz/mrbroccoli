import { getLocalLanguageSettingsUpdate } from "../../src/features/settings-core/onDevice";
import { DEFAULT_SETTINGS, type Settings } from "../../src/types";

function settings(overrides: Partial<Settings> = {}): Settings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

describe("on-device language settings", () => {
  it("keeps at least one language selected", () => {
    expect(
      getLocalLanguageSettingsUpdate(
        settings({ localLanguages: ["en"] }),
        "en",
      ),
    ).toBeNull();
  });

  it("updates listening and speech from the shared language choice", () => {
    expect(
      getLocalLanguageSettingsUpdate(
        settings({ localLanguages: ["en"] }),
        "de",
      ),
    ).toMatchObject({
      localLanguages: ["en", "de"],
      sttLanguage: "auto",
      ttsListenLanguages: ["en", "de"],
    });
  });

  it("disables a selected local voice that cannot cover the new languages", () => {
    expect(
      getLocalLanguageSettingsUpdate(
        settings({
          localLanguages: ["en"],
          localTtsModelId: "piper-en-us-kristin",
          ttsMode: "local",
        }),
        "de",
      ),
    ).toMatchObject({
      localLanguages: ["en", "de"],
      localTtsModelId: null,
      ttsMode: "native",
    });
  });

  it("returns Kokoro to the system voice when a selected language is unsupported", () => {
    expect(
      getLocalLanguageSettingsUpdate(
        settings({ localLanguages: ["en"], ttsMode: "kokoro" }),
        "de",
      ),
    ).toMatchObject({
      localLanguages: ["en", "de"],
      ttsMode: "native",
    });
  });
});
