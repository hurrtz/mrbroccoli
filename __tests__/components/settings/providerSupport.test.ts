import { DEFAULT_SETTINGS } from "../../../src/types";
import {
  getConfiguredProvidersForCapability,
  getProviderHealthState,
  getProviderValidationTarget,
} from "../../../src/components/settings/providerSupport";

describe("getProviderValidationTarget", () => {
  it("prefers llm validation for xAI once a key unlocks chat plus voice", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        xai: "xai-test",
      },
    };

    expect(getProviderValidationTarget(settings, "xai")).toEqual({
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

    expect(getProviderValidationTarget(settings, "gemini")).toEqual({
      kind: "llm",
      model: "gemini-2.5-flash",
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

    expect(getProviderValidationTarget(settings, "elevenlabs")).toEqual({
      kind: "tts",
      model: "eleven_multilingual_v2",
      configKey: JSON.stringify({ voice: "voice-123" }),
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
        status: "error" as const,
        message: "Rejected credentials",
        model: "previous-model",
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
    const target = getProviderValidationTarget(settings, "openai");
    const validationStateByProvider = {
      openai: {
        status: "error" as const,
        message: "Model access rejected",
        model: target.model,
        configKey: target.configKey,
      },
    };

    expect(
      getProviderHealthState({
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

  it("restores a successful validation only for the tested configuration", () => {
    const target = getProviderValidationTarget(settings, "openai");

    expect(
      getProviderHealthState({
        provider: "openai",
        settings,
        validationStateByProvider: {
          openai: {
            status: "success",
            model: target.model,
            configKey: target.configKey,
          },
        },
      }),
    ).toBe("healthy");

    expect(
      getProviderHealthState({
        provider: "openai",
        settings,
        validationStateByProvider: {
          openai: {
            status: "success",
            model: "different-model",
          },
        },
      }),
    ).toBe("configured");
  });
});
