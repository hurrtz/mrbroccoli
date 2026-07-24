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

  it("exposes ElevenLabs only in the TTS provider flow", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "elevenlabs-test-key",
      },
    };

    expect(getEnabledProviders(settings)).toEqual([]);
    expect(getEnabledSttProviders(settings)).toEqual([]);
    expect(getEnabledTtsProviders(settings)).toEqual(["elevenlabs"]);
  });

  it("does not treat ByteDance speech-only credentials as runtime readiness", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        "bytedance-doubao-seed": "speech-app-key|speech-access-key",
      },
    };

    expect(getEnabledProviders(settings)).toEqual([]);
    expect(getEnabledSttProviders(settings)).toEqual([]);
    expect(getEnabledTtsProviders(settings)).toEqual([]);
  });

  it("treats ByteDance Ark credentials as LLM-only readiness", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        "bytedance-doubao-seed": "ark-api-key",
      },
    };

    expect(getEnabledProviders(settings)).toEqual(["bytedance-doubao-seed"]);
    expect(getEnabledSttProviders(settings)).toEqual([]);
    expect(getEnabledTtsProviders(settings)).toEqual([]);
  });

  it("treats Gemini Cloud Speech-only credentials as STT-only readiness", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "my-project|ya29.test-token|us",
      },
    };

    expect(getEnabledProviders(settings)).toEqual([]);
    expect(getEnabledSttProviders(settings)).toEqual(["gemini"]);
    expect(getEnabledTtsProviders(settings)).toEqual([]);
  });

  it("treats combined Gemini AI Studio and Cloud Speech credentials as ready for llm, stt, and tts", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "opaque-test-key|my-project|ya29.test-token|us",
      },
    };

    expect(getEnabledProviders(settings)).toEqual(["gemini"]);
    expect(getEnabledSttProviders(settings)).toEqual(["gemini"]);
    expect(getEnabledTtsProviders(settings)).toEqual(["gemini"]);
  });

  it("treats any non-empty Gemini key as ready for llm, stt, and tts validation", () => {
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
