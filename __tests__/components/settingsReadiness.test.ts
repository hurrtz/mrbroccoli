import { DEFAULT_SETTINGS, Settings } from "../../src/types";
import {
  getSettingsReadiness,
  type SettingsReadinessStatus,
} from "../../src/features/settings-core/readiness";

function withSettings(partial: Partial<Settings>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
  };
}

function expectStatus(
  status: SettingsReadinessStatus,
  expected: SettingsReadinessStatus["state"],
) {
  expect(status.state).toBe(expected);
}

describe("settings readiness", () => {
  it("marks the default native voice pipeline as listen-ready and search-off", () => {
    const readiness = getSettingsReadiness(DEFAULT_SETTINGS, {
      llmProviders: ["openai"],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.listen, "ready");
    expectStatus(readiness.search, "off");
  });

  it("marks thinking broken when no response route can run", () => {
    const readiness = getSettingsReadiness(DEFAULT_SETTINGS, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.think, "broken");
  });

  it("marks selected local thinking, listening, and compatible speech ready", () => {
    const settings = withSettings({
      responseModes: [
        {
          id: "mode-1",
          route: {
            runtime: "local",
            localModelId: "qwen3-0.6b-q8",
            provider: "openai",
            model: "Qwen3 0.6B",
          },
        },
      ],
      activeResponseMode: "mode-1",
      sttMode: "local",
      localSttModelId: "whisper-tiny",
      ttsMode: "local",
      localTtsModelId: "piper-de-de-thorsten",
      ttsListenLanguages: ["de"],
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.think, "ready");
    expectStatus(readiness.listen, "ready");
    expectStatus(readiness.speak, "ready");
  });

  it("marks a local voice broken when it cannot cover every selected language", () => {
    const settings = withSettings({
      ttsMode: "local",
      localTtsModelId: "piper-de-de-thorsten",
      ttsListenLanguages: ["de", "en"],
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.speak, "broken");
  });

  it("marks provider STT broken when provider STT is selected without an enabled STT provider", () => {
    const settings = withSettings({
      sttMode: "provider",
      sttProvider: null,
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: ["openai"],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.listen, "broken");
  });

  it("marks provider STT broken when the explicit language is unsupported", () => {
    const settings = withSettings({
      sttMode: "provider",
      sttProvider: "mistral",
      sttLanguage: "uk",
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        mistral: "mistral-test-key",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: ["mistral"],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.listen, "broken");
  });

  it("marks spoken replies off when spoken replies are disabled", () => {
    const settings = withSettings({
      spokenRepliesEnabled: false,
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: ["openai"],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
    });

    expectStatus(readiness.speak, "off");
  });

  it("marks Mistral speech broken until a saved voice slug is configured", () => {
    const settings = withSettings({
      ttsMode: "provider",
      ttsProvider: "mistral",
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        mistral: "mistral-test-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        mistral: "",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: ["mistral"],
      sttProviders: ["mistral"],
      ttsProviders: ["mistral"],
      searchProviders: ["mistral"],
    });

    expectStatus(readiness.speak, "broken");
  });

  it("uses the built-in ElevenLabs voice when account voices are unavailable", () => {
    const settings = withSettings({
      ttsMode: "provider",
      ttsProvider: "elevenlabs",
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: "elevenlabs-test-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        elevenlabs: "",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: ["elevenlabs"],
      searchProviders: [],
    });

    expectStatus(readiness.speak, "ready");
  });

  it("marks an unavailable configured fallback as needing attention", () => {
    const settings = withSettings({
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsFallbackPolicy: {
        provider: ["kokoro"],
        kokoro: [],
        local: [],
      },
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "sk-test",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: ["openai"],
      sttProviders: [],
      ttsProviders: ["openai"],
      searchProviders: [],
      kokoroInstalled: false,
    });

    expectStatus(readiness.speak, "attention");
  });

  it("requires an explicit compatible fallback for unsupported provider languages", () => {
    const baseSettings = withSettings({
      ttsMode: "provider",
      ttsProvider: "mistral",
      ttsListenLanguages: ["uk"],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        mistral: "mistral-test-key",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        mistral: "preset-voice",
      },
    });
    const context = {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: ["mistral" as const],
      searchProviders: [],
    };

    expectStatus(getSettingsReadiness(baseSettings, context).speak, "broken");
    expectStatus(
      getSettingsReadiness(
        {
          ...baseSettings,
          ttsFallbackPolicy: {
            ...baseSettings.ttsFallbackPolicy,
            provider: ["native"],
          },
        },
        context,
      ).speak,
      "attention",
    );
  });

  it("marks unsupported Kokoro languages broken without an explicit fallback", () => {
    const settings = withSettings({
      ttsMode: "kokoro",
      ttsListenLanguages: ["de"],
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
      kokoroInstalled: true,
    });

    expectStatus(readiness.speak, "broken");
  });

  it("ignores fallback policy when native speech is selected", () => {
    const settings = withSettings({
      ttsMode: "native",
      ttsFallbackPolicy: {
        provider: ["kokoro", "native"],
        kokoro: ["provider", "native"],
        local: [],
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [],
      kokoroInstalled: false,
    });

    expectStatus(readiness.speak, "ready");
  });

  it("marks search ready when a selected search-capable provider has credentials even if search is disabled", () => {
    const settings = withSettings({
      webSearchMode: "off",
      webSearchProvider: "openai",
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "sk-test",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: ["openai"],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: ["openai"],
    });

    expectStatus(readiness.search, "ready");
  });

  it("does not treat retired Gemini composite credentials as web-search readiness", () => {
    const provider = "gemini";
    const settings = withSettings({
      webSearchMode: "off",
      webSearchProvider: provider,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        [provider]: "project-id|ya29.speech-token|us",
      },
    });

    const readiness = getSettingsReadiness(settings, {
      llmProviders: [],
      sttProviders: [],
      ttsProviders: [],
      searchProviders: [provider],
    });

    expectStatus(readiness.search, "broken");
  });
});
