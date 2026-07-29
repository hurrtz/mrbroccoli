import {
  PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS,
  getTtsModelLabel,
} from "../../../src/constants/models";
import {
  getConversationTtsControlState,
  getMainScreenRouteConfiguration,
} from "../../../src/screens/main/mainScreenRouteConfiguration";
import { DEFAULT_SETTINGS } from "../../../src/types";

describe("mainScreenRouteConfiguration", () => {
  it("derives the active LLM, speech, and search routes from one settings snapshot", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: "normal",
      responseModes: [
        {
          id: "normal",
          route: {
            provider: "openai" as const,
            model: "gpt-5.2",
            effort: "high",
          },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        elevenlabs: " eleven-key ",
        mistral: " mistral-key ",
        openai: " openai-key ",
        perplexity: " search-key ",
      },
      sttMode: "provider" as const,
      sttProvider: "mistral" as const,
      ttsMode: "provider" as const,
      ttsProvider: "elevenlabs" as const,
      webSearchMode: "on" as const,
      webSearchProvider: "perplexity" as const,
    };

    const result = getMainScreenRouteConfiguration(settings, true);

    expect(result).toEqual(
      expect.objectContaining({
        activeResponseMode: "normal",
        globalSelectedTtsVoice:
          settings.providerTtsVoices.elevenlabs,
        model: "gpt-5.2",
        modelEffort: "high",
        provider: "openai",
        providerApiKey: "openai-key",
        selectedSttModel: PROVIDER_DEFAULT_STT_MODELS.mistral,
        selectedTtsModel: PROVIDER_DEFAULT_TTS_MODELS.elevenlabs,
        sttApiKey: "mistral-key",
        sttProvider: "mistral",
        ttsApiKey: "eleven-key",
        ttsProvider: "elevenlabs",
        voiceInputDisabled: false,
        webSearchActive: true,
        webSearchApiKey: "search-key",
        webSearchProvider: "perplexity",
        webSearchReady: true,
      }),
    );
  });

  it("keeps input disabled until conversations hydrate", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "openai-key",
      },
      responseModes: [
        {
          id: DEFAULT_SETTINGS.activeResponseMode,
          route: {
            provider: "openai" as const,
            model: "gpt-5.2",
          },
        },
      ],
    };

    expect(
      getMainScreenRouteConfiguration(settings, false)
        .voiceInputDisabled,
    ).toBe(true);
  });

  it("builds Uber routes only from ready home-screen models", () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: "mode-1",
      ulraModeActive: true,
      ulraModeRounds: 5,
      responseModes: [
        {
          id: "mode-1",
          route: {
            provider: "openai" as const,
            model: "gpt-test",
            effort: "high",
          },
        },
        {
          id: "mode-2",
          route: {
            provider: "anthropic" as const,
            model: "claude-test",
          },
        },
        {
          id: "mode-3",
          route: {
            provider: "gemini" as const,
            model: "gemini-test",
          },
        },
      ],
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: " openai-key ",
        anthropic: " anthropic-key ",
      },
    };

    expect(
      getMainScreenRouteConfiguration(settings, true).ulraMode,
    ).toEqual({
      rounds: 5,
      routes: [
        {
          apiKey: "openai-key",
          modeId: "mode-1",
          model: "gpt-test",
          modelEffort: "high",
          provider: "openai",
        },
        {
          apiKey: "anthropic-key",
          modeId: "mode-2",
          model: "claude-test",
          provider: "anthropic",
        },
      ],
    });
  });

  it("prefers live account voices for a directory-backed TTS provider", () => {
    const selectedTtsModel = PROVIDER_DEFAULT_TTS_MODELS.elevenlabs;
    const settings = {
      ...DEFAULT_SETTINGS,
      ttsMode: "provider" as const,
      ttsProvider: "elevenlabs" as const,
    };
    const result = getConversationTtsControlState({
      language: "en",
      providerVoiceDirectories: {
        elevenlabs: {
          error: null,
          refresh: jest.fn(async () => []),
          status: "ready",
          voices: [
            {
              accent: null,
              category: "cloned",
              description: null,
              gender: null,
              id: "voice-account-1",
              label: "Account voice",
              name: "Account voice",
              previewUrl: null,
              value: "voice-account-1",
            },
          ],
        },
      },
      selectedTtsModel,
      settings,
      ttsProvider: "elevenlabs",
    });

    expect(result.conversationTtsVoiceOptions).toEqual([
      {
        label: "Account voice",
        value: "voice-account-1",
      },
    ]);
    expect(result.conversationTtsRouteLabel).toBe(
      `ElevenLabs · ${getTtsModelLabel(
        "elevenlabs",
        selectedTtsModel,
      )}`,
    );
    expect(result.ttsInstructionsSupported).toBe(false);
  });

  it("hides provider voice controls for native speech", () => {
    expect(
      getConversationTtsControlState({
        language: "en",
        providerVoiceDirectories: {},
        selectedTtsModel: "",
        settings: DEFAULT_SETTINGS,
        ttsProvider: null,
      }),
    ).toEqual({
      conversationTtsRouteLabel: null,
      conversationTtsVoiceOptions: [],
      ttsInstructionsSupported: false,
    });
  });
});
