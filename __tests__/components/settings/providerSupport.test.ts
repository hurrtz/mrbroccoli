import { DEFAULT_SETTINGS } from "../../../src/types";
import {
  getConfiguredProvidersForCapability,
  getProviderCapabilityHealthState,
  getProviderHealthState,
  getProviderValidationTarget,
} from "../../../src/features/settings-core/providerSupport";

describe("getProviderValidationTarget", () => {
  it("prefers llm validation for xAI once a key unlocks chat plus voice", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        xai: "xai-test",
      },
    };

    expect(getProviderValidationTarget(settings, "xai", "llm")).toEqual({
      kind: "llm",
      model: expect.any(String),
      configKey: undefined,
    });
  });

  it("uses llm validation for providers with configured chat credentials", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      providerModels: {
        ...DEFAULT_SETTINGS.providerModels,
        gemini: "gemini-2.5-flash",
      },
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        gemini: "not-a-google-key",
      },
    };

    expect(getProviderValidationTarget(settings, "gemini", "llm")).toEqual({
      kind: "llm",
      model: "gemini-3.6-flash",
      configKey: undefined,
    });
  });

  it("uses the selected ElevenLabs model and voice for TTS validation", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "elevenlabs-test-key",
      },
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        elevenlabs: "eleven_multilingual_v2",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "voice-123",
      },
    };

    expect(getProviderValidationTarget(settings, "elevenlabs", "tts")).toEqual({
      kind: "tts",
      model: "eleven_multilingual_v2",
      configKey: JSON.stringify({ voice: "voice-123" }),
    });
  });

  it("validates ElevenLabs TTS with its built-in voice when voice discovery is restricted", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "restricted-elevenlabs-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "",
      },
    };

    expect(getProviderValidationTarget(settings, "elevenlabs", "tts")).toEqual({
      kind: "tts",
      model: "eleven_flash_v2_5",
      configKey: JSON.stringify({ voice: "21m00Tcm4TlvDq8ikWAM" }),
    });
  });
});

describe("getProviderHealthState", () => {
  const settings = {
    ...DEFAULT_SETTINGS,
    apiKeys: {
      ...DEFAULT_SETTINGS.apiKeys,
      openai: "stored-openai-key",
    },
  };

  it("treats an untested stored key as configured but not healthy", () => {
    expect(
      getProviderHealthState({
        provider: "openai",
        settings,
        validationStateByProvider: {},
      }),
    ).toBe("configured");
  });

  it("ignores a persisted validation failure after its model changes", () => {
    const validationStateByProvider = {
      openai: {
        llm: {
          status: "error" as const,
          message: "Rejected credentials",
          model: "previous-model",
        },
      },
    };

    expect(
      getProviderHealthState({
        provider: "openai",
        settings,
        validationStateByProvider,
      }),
    ).toBe("configured");
    expect(
      getConfiguredProvidersForCapability({
        capability: "llm",
        settings,
        validationStateByProvider,
      }),
    ).toContain("openai");
  });

  it("limits a matching validation failure to the capability that was tested", () => {
    const target = getProviderValidationTarget(settings, "openai", "llm");
    const validationStateByProvider = {
      openai: {
        llm: {
          status: "error" as const,
          message: "Model access rejected",
          model: target.model,
          configKey: target.configKey,
        },
      },
    };

    expect(
      getProviderCapabilityHealthState({
        capability: "llm",
        provider: "openai",
        settings,
        validationStateByProvider,
      }),
    ).toBe("failing");
    expect(
      getConfiguredProvidersForCapability({
        capability: "llm",
        settings,
        validationStateByProvider,
      }),
    ).not.toContain("openai");
    expect(
      getConfiguredProvidersForCapability({
        capability: "stt",
        settings,
        validationStateByProvider,
      }),
    ).toContain("openai");
    expect(
      getConfiguredProvidersForCapability({
        capability: "tts",
        settings,
        validationStateByProvider,
      }),
    ).toContain("openai");
  });

  it("keeps a successful LLM validation after the selected model changes", () => {
    const target = getProviderValidationTarget(settings, "openai", "llm");

    expect(
      getProviderCapabilityHealthState({
        capability: "llm",
        provider: "openai",
        settings,
        validationStateByProvider: {
          openai: {
            llm: {
              status: "success",
              model: target.model,
              configKey: target.configKey,
            },
          },
        },
      }),
    ).toBe("healthy");

    expect(
      getProviderCapabilityHealthState({
        capability: "llm",
        provider: "openai",
        settings,
        validationStateByProvider: {
          openai: {
            llm: {
              status: "success",
              model: "different-model",
            },
          },
        },
      }),
    ).toBe("healthy");
  });

  it("keeps each capability independent when one shared key has partial permissions", () => {
    const llmTarget = getProviderValidationTarget(settings, "openai", "llm");
    const sttTarget = getProviderValidationTarget(settings, "openai", "stt");
    const validationStateByProvider = {
      openai: {
        llm: {
          status: "error" as const,
          message: "Model access rejected",
          model: llmTarget.model,
          configKey: llmTarget.configKey,
        },
        stt: {
          status: "success" as const,
          model: sttTarget.model,
          configKey: sttTarget.configKey,
        },
      },
    };

    expect(
      getProviderCapabilityHealthState({
        capability: "llm",
        provider: "openai",
        settings,
        validationStateByProvider,
      }),
    ).toBe("failing");
    expect(
      getProviderCapabilityHealthState({
        capability: "stt",
        provider: "openai",
        settings,
        validationStateByProvider,
      }),
    ).toBe("healthy");
    expect(
      getConfiguredProvidersForCapability({
        capability: "llm",
        settings,
        validationStateByProvider,
      }),
    ).not.toContain("openai");
    expect(
      getConfiguredProvidersForCapability({
        capability: "stt",
        settings,
        validationStateByProvider,
      }),
    ).toContain("openai");
  });
});
