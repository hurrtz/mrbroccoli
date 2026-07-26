import { DEFAULT_SETTINGS } from "../../src/types";
import {
  getNormalizedProviderSttModels,
  getNormalizedProviderTtsVoices,
  getNormalizedResponseModes,
  getNormalizedSttProvider,
  getNormalizedTtsProvider,
} from "../../src/features/settings-core/settingsRules";

describe("settingsRules", () => {
  it("repairs an invalid provider STT selection", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "provider" as const,
      sttProvider: "openai" as const,
    };

    expect(getNormalizedSttProvider(settings, ["xai"])).toBe("xai");
  });

  it("repairs the provider selection when provider speech is a Kokoro fallback", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      ttsMode: "kokoro" as const,
      ttsProvider: "openai" as const,
      ttsFallbackPolicy: {
        provider: [],
        kokoro: ["provider" as const],
      },
    };

    expect(getNormalizedTtsProvider(settings, ["xai"])).toBe("xai");
  });

  it("repairs response modes that point to disabled providers", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "openai" as const, model: "gpt-5.4" },
        },
        {
          id: "mode-2",
          route: { provider: "openai" as const, model: "gpt-5.4" },
        },
        {
          id: "mode-3",
          route: { provider: "openai" as const, model: "gpt-5.4" },
        },
      ],
      providerModels: {
        ...DEFAULT_SETTINGS.providerModels,
        deepseek: "deepseek-v4-flash",
      },
    };

    const next = getNormalizedResponseModes(settings, ["deepseek"]);

    expect(next).toEqual([
      {
        id: "mode-1",
        route: {
          provider: "deepseek",
          model: "deepseek-v4-flash",
          effort: "high",
        },
      },
      {
        id: "mode-2",
        route: {
          provider: "deepseek",
          model: "deepseek-v4-flash",
          effort: "high",
        },
      },
      {
        id: "mode-3",
        route: {
          provider: "deepseek",
          model: "deepseek-v4-flash",
          effort: "high",
        },
      },
    ]);
  });

  it("repairs invalid provider voice selections", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        openai: "not-a-real-voice",
      },
      ttsListenLanguages: ["en"] as const,
    };

    const nextProviderVoices = getNormalizedProviderTtsVoices(
      settings,
      ["openai"],
      "en",
    );

    expect(nextProviderVoices?.openai).toBe("alloy");
  });

  it("repairs stored xAI voice-agent STT selections to standalone Grok STT", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      sttMode: "provider" as const,
      sttProvider: "xai" as const,
      providerSttModels: {
        ...DEFAULT_SETTINGS.providerSttModels,
        xai: "voice-agent-api",
      },
    };

    const nextProviderSttModels = getNormalizedProviderSttModels(settings, [
      "xai",
    ]);

    expect(nextProviderSttModels?.xai).toBe("grok-stt");
  });

  it("leaves a valid provider voice selection untouched", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        openai: "alloy",
      },
      ttsListenLanguages: ["en"] as const,
    };

    const nextProviderVoices = getNormalizedProviderTtsVoices(
      settings,
      ["openai"],
      "en",
    );

    expect(nextProviderVoices).toBeNull();
  });

  it("preserves an account voice selected from a dynamic provider directory", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "account-voice-id",
      },
    };

    const nextProviderVoices = getNormalizedProviderTtsVoices(
      settings,
      ["elevenlabs"],
      "en",
    );

    expect(nextProviderVoices).toBeNull();
  });

  it("repairs an empty dynamic voice selection to its built-in fallback", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "",
      },
    };

    const nextProviderVoices = getNormalizedProviderTtsVoices(
      settings,
      ["elevenlabs"],
      "en",
    );

    expect(nextProviderVoices?.elevenlabs).toBe("21m00Tcm4TlvDq8ikWAM");
  });

  it("repairs a Qwen voice that is unavailable on the selected TTS model", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        "alibaba-qwen-dashscope": "qwen3-tts-instruct-flash",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        "alibaba-qwen-dashscope": "Jennifer",
      },
    };

    const nextProviderVoices = getNormalizedProviderTtsVoices(
      settings,
      ["alibaba-qwen-dashscope"],
      "en",
    );

    expect(nextProviderVoices?.["alibaba-qwen-dashscope"]).toBe("Cherry");
  });
});
