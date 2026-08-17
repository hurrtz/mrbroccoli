import {
  getActiveCouncilModelPosition,
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
  it("reports the active Council model as one-based progress", () => {
    expect(getActiveCouncilModelPosition(0, 4)).toBe(1);
    expect(getActiveCouncilModelPosition(1, 4)).toBe(2);
    expect(getActiveCouncilModelPosition(4, 4)).toBe(4);
    expect(getActiveCouncilModelPosition(0, 0)).toBe(0);
  });

  it("derives streaming transcript state and the active turn phase", () => {
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
      model: "gpt-5.4",
      pipelinePhase: "thinking-briefly",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      settings,
      streamingText: "Streaming reply",
      t,
      ttsProvider: "openai",
    });

    expect(viewModel.visualPhase).toBe("thinking-briefly");
    expect(viewModel.isActive).toBe(true);
    expect(viewModel.messages).toHaveLength(2);
    expect(viewModel.lastAssistantReply).toBe("Stored reply");
  });

  it("shows synthesis rather than speaking while audio is only pending", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      model: "gpt-5.4",
      pipelinePhase: "speaking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
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
      model: "gpt-5.4",
      pipelinePhase: "speaking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: true,
        isPlaying: true,
      },
      provider: "openai",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      t,
      ttsProvider: "openai",
    });

    expect(viewModel.visualPhase).toBe("speaking");
  });

  it("keeps deterministic fixture phase and status presentation aligned", () => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      model: "gpt-5.4",
      pipelinePhase: "thinking",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      settings: DEFAULT_SETTINGS,
      streamingText: "",
      t,
      ttsProvider: null,
      visualPhaseOverride: "recording",
    });

    expect(viewModel.visualPhase).toBe("recording");
    expect(viewModel.isActive).toBe(true);
    expect(viewModel.statusDisplay.statusTitle).toBe("listening");
    expect(viewModel.statusDisplay.statusDetail).toBe("listeningToYourVoice");
  });
});
