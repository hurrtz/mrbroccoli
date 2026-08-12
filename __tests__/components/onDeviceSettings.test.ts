import { getLocalModel } from "../../src/constants/localModels";
import {
  getLocalLanguageSettingsUpdate,
  getLocalModelRemovalSettingsUpdate,
} from "../../src/features/settings-core/onDevice";
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

  it("replaces the language when Free setup uses a single choice", () => {
    expect(
      getLocalLanguageSettingsUpdate(
        settings({ localLanguages: ["en", "de"] }),
        "it",
        true,
      ),
    ).toMatchObject({
      localLanguages: ["it"],
      sttLanguage: "it",
      ttsListenLanguages: ["it"],
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

describe("on-device model removal settings", () => {
  it("returns to the system voice after removing selected Kokoro", () => {
    expect(
      getLocalModelRemovalSettingsUpdate(
        settings({ ttsMode: "kokoro" }),
        getLocalModel("kokoro-multilingual"),
      ),
    ).toMatchObject({
      localTtsModelId: null,
      ttsMode: "native",
    });
  });

  it("removes a selected local response route and activates its fallback", () => {
    const localMode = {
      id: "mode-2",
      route: {
        runtime: "local" as const,
        localModelId: "qwen3-0.6b-q8" as const,
        provider: "openai" as const,
        model: "Qwen3 0.6B",
      },
    };
    const providerMode = DEFAULT_SETTINGS.responseModes[0];

    expect(
      getLocalModelRemovalSettingsUpdate(
        settings({
          activeResponseMode: localMode.id,
          responseModes: [providerMode, localMode],
        }),
        getLocalModel("qwen3-0.6b-q8"),
      ),
    ).toMatchObject({
      activeResponseMode: providerMode.id,
      responseModes: [providerMode],
    });
  });
});
