import { DEFAULT_SETTINGS, Settings } from "../../src/types";
import {
  getSettingsReadiness,
  type SettingsReadinessStatus,
} from "../../src/components/settings/readiness";

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

  it("ignores fallback policy when native speech is selected", () => {
    const settings = withSettings({
      ttsMode: "native",
      ttsFallbackPolicy: {
        provider: ["kokoro", "native"],
        kokoro: ["provider", "native"],
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

  it.each([
    ["gemini", "project-id|ya29.speech-token|us"],
    ["bytedance-doubao-seed", "speech-app-key|speech-access-key"],
  ] as const)(
    "does not treat %s speech-only credentials as web-search readiness",
    (provider, apiKey) => {
      const settings = withSettings({
        webSearchMode: "off",
        webSearchProvider: provider,
        apiKeys: {
          ...DEFAULT_SETTINGS.apiKeys,
          [provider]: apiKey,
        },
      });

      const readiness = getSettingsReadiness(settings, {
        llmProviders: [],
        sttProviders: [provider],
        ttsProviders: [],
        searchProviders: [provider],
      });

      expectStatus(readiness.search, "broken");
    },
  );
});
