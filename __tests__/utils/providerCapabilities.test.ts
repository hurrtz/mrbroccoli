import {
  getEnabledProviders,
  getEnabledSttProviders,
  getEnabledTtsProviders,
} from "../../src/utils/providerCapabilities";
import { DEFAULT_SETTINGS } from "../../src/types";

describe("provider capability selectors", () => {
  it("filters enabled providers by configured API keys", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "gemini-test-key",
        deepseek: "sk-deepseek",
        mistral: "mistral_test",
        xai: "xai-test",
      },
    };

    expect(getEnabledProviders(settings)).toEqual([
      "gemini",
      "xai",
      "deepseek",
      "mistral",
    ]);
    expect(getEnabledSttProviders(settings)).toEqual([
      "gemini",
      "xai",
      "mistral",
    ]);
    expect(getEnabledTtsProviders(settings)).toEqual([
      "gemini",
      "xai",
      "mistral",
    ]);
  });

  it("keeps OpenAI available for both STT and TTS when configured", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "sk-test",
        anthropic: "sk-ant-test",
      },
    };

    expect(getEnabledSttProviders(settings)).toEqual(["openai"]);
    expect(getEnabledTtsProviders(settings)).toEqual(["openai"]);
  });

  it("exposes ElevenLabs in both speech provider flows", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "elevenlabs-test-key",
      },
    };

    expect(getEnabledProviders(settings)).toEqual([]);
    expect(getEnabledSttProviders(settings)).toEqual(["elevenlabs"]);
    expect(getEnabledTtsProviders(settings)).toEqual(["elevenlabs"]);
  });

  it.each([
    "my-project|ya29.test-token|us",
    "opaque-test-key|my-project|ya29.test-token|us",
  ])("rejects retired Gemini credential format %s", (gemini) => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini,
      },
    };

    expect(getEnabledProviders(settings)).toEqual([]);
    expect(getEnabledSttProviders(settings)).toEqual([]);
    expect(getEnabledTtsProviders(settings)).toEqual([]);
  });

  it("treats a Gemini API key as ready for llm, stt, and tts validation", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "not-a-google-key",
      },
    };

    expect(getEnabledProviders(settings)).toEqual(["gemini"]);
    expect(getEnabledSttProviders(settings)).toEqual(["gemini"]);
    expect(getEnabledTtsProviders(settings)).toEqual(["gemini"]);
  });
});
