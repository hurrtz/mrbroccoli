import {
  formatRelativeAge,
  getMainScreenViewModel,
} from "../../../src/screens/main/mainScreenViewModel";
import { Conversation, DEFAULT_SETTINGS, Settings } from "../../../src/types";

function t(key: any, params?: Record<string, string | number | undefined>) {
  if (key === "messageCount") {
    return `${params?.count ?? 0} messages`;
  }

  if (params?.route) {
    return `${String(key)}:${params.route}`;
  }

  return String(key);
}

describe("getMainScreenViewModel", () => {
  it("builds provider and fallback route labels plus streaming transcript state", () => {
    const settings: Settings = {
      ...DEFAULT_SETTINGS,
      activeResponseMode: "mode-1",
      responseModes: [
        {
          id: "mode-1",
          route: { provider: "openai", model: "gpt-5.4" },
        },
      ],
      sttMode: "provider",
      sttProvider: "openai",
      providerSttModels: {
        ...DEFAULT_SETTINGS.providerSttModels,
        openai: "gpt-4o-mini-transcribe",
      },
      ttsMode: "provider",
      ttsFallbackPolicy: {
        provider: ["kokoro", "native"],
        kokoro: [],
        local: [],
      },
      spokenRepliesEnabled: true,
      ttsProvider: "openai",
      providerTtsModels: {
        ...DEFAULT_SETTINGS.providerTtsModels,
        openai: "gpt-4o-mini-tts",
      },
      providerTtsVoices: {
        ...DEFAULT_SETTINGS.providerTtsVoices,
        openai: "alloy",
      },
      apiKeys: {
        ...DEFAULT_SETTINGS.apiKeys,
        openai: "sk-test",
      },
      ttsListenLanguages: ["en", "de"],
      showUsageStats: true,
    };
    const conversation: Conversation = {
      id: "conv-1",
      title: "Planning",
      createdAt: "2026-03-20T08:00:00.000Z",
      updatedAt: "2026-03-20T08:05:00.000Z",
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "Stored reply",
          provider: "openai",
          model: "gpt-5.4",
          timestamp: "2026-03-20T08:01:00.000Z",
        },
      ],
    };

    const viewModel = getMainScreenViewModel({
      activeConversation: conversation,
      isRecording: false,
      language: "en",
      model: "gpt-5.4",
      pipelinePhase: "thinking-briefly",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      selectedSttModel: "gpt-4o-mini-transcribe",
      selectedTtsModel: "gpt-4o-mini-tts",
      selectedTtsVoice: "alloy",
      settings,
      streamingText: "Streaming reply",
      sttProvider: "openai",
      t,
      ttsProvider: "openai",
    });

    expect(viewModel.visualPhase).toBe("thinking-briefly");
    expect(viewModel.isActive).toBe(true);
    expect(viewModel.messages).toHaveLength(2);
    expect(viewModel.lastAssistantReply).toBe("Stored reply");
    expect(viewModel.sttStatusLabel).toContain("OpenAI");
    expect(viewModel.ttsStatusLabel).toContain("OpenAI");
    expect(viewModel.fallbackTtsStatusLabel).toBe("Kokoro → systemVoice");
    expect(viewModel.routeModelLabel).toContain("GPT-5.4");
    expect(viewModel.activeConversationTitle).toBe("Planning");
    expect(viewModel.conversationStatusDetail).toContain("Planning · ");
    expect(viewModel.transcriptHandleMeta).toContain("GPT-5.4 · ");
  });

  it("formats localized relative ages and ignores invalid timestamps", () => {
    const now = Date.parse("2026-08-12T14:30:00.000Z");

    expect(
      formatRelativeAge("2026-08-12T14:28:00.000Z", "en", now),
    ).toBe("2 min. ago");
    expect(
      formatRelativeAge("2026-08-12T14:28:00.000Z", "de", now),
    ).toBe("vor 2 Min.");
    expect(formatRelativeAge("not-a-date", "en", now)).toBeNull();
  });

  it("shows synthesis rather than speaking while audio is only pending", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      language: "en",
      model: "gpt-5.4",
      pipelinePhase: "speaking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      selectedSttModel: "",
      selectedTtsModel: "gpt-4o-mini-tts",
      selectedTtsVoice: "alloy",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      sttProvider: null,
      t,
      ttsProvider: "openai",
    });

    expect(viewModel.visualPhase).toBe("synthesizing");
    expect(viewModel.isActive).toBe(true);
  });

  it("keeps paused playback in the speaking visual state", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      language: "en",
      model: "gpt-5.4",
      pipelinePhase: "speaking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: true,
        isPlaying: true,
      },
      provider: "openai",
      selectedSttModel: "",
      selectedTtsModel: "gpt-4o-mini-tts",
      selectedTtsVoice: "alloy",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      sttProvider: null,
      t,
      ttsProvider: "openai",
    });

    expect(viewModel.visualPhase).toBe("speaking");
  });

  it("keeps deterministic fixture phase and status presentation aligned", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      language: "en",
      model: "gpt-5.4",
      pipelinePhase: "thinking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      selectedSttModel: "",
      selectedTtsModel: "",
      selectedTtsVoice: "",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      sttProvider: null,
      t,
      ttsProvider: null,
      visualPhaseOverride: "recording",
    });

    expect(viewModel.visualPhase).toBe("recording");
    expect(viewModel.isActive).toBe(true);
    expect(viewModel.statusDisplay.statusTitle).toBe("listening");
    expect(viewModel.statusDisplay.statusDetail).toBe("listeningToYourVoice");
  });

  it("does not expose the default model route when no reply provider is configured", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      language: "en",
      model: DEFAULT_SETTINGS.responseModes[0].route.model,
      pipelinePhase: "idle",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: DEFAULT_SETTINGS.responseModes[0].route.provider,
      selectedSttModel: "",
      selectedTtsModel: "",
      selectedTtsVoice: "",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      sttProvider: null,
      t,
      ttsProvider: null,
    });

    expect(viewModel.routeModelLabel).toBe("noProviderYet");
    expect(viewModel.routeModelLabel).not.toContain("Claude");
  });
});
