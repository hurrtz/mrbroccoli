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
        openai: "gpt-4o-mini-tts-2025-12-15",
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

  it.each(["speaking", "idle"] as const)("keeps paused playback visible after the pipeline becomes %s", (pipelinePhase) => {
    const viewModel = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      model: "gpt-5.4",
      pipelinePhase,
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

  it("shows the provider actually transferring fallback audio for a local primary", () => {
    const view = getMainScreenViewModel({
      activeConversation: null,
      isRecording: false,
      model: "gpt-5.4",
      pipelinePhase: "synthesizing",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai",
      settings: { ...DEFAULT_SETTINGS, ttsMode: "kokoro" },
      speechTransfer: { stage: "receiving-audio", provider: "gemini" },
      streamingText: "",
      t,
      ttsProvider: "openai",
    });
    expect(view.activity).toMatchObject({
      label: "orbSendingAudio",
      provider: "gemini",
    });
  });

  it("uses the captured STT provider and the active Council synthesizer across settings changes", () => {
    const base = {
      activeConversation: null,
      isRecording: false,
      model: "gpt-5.4",
      player: {
        isActivelyPlaying: false,
        isPlaybackPaused: false,
        isPlaying: false,
      },
      provider: "openai" as const,
      settings: {
        ...DEFAULT_SETTINGS,
        sttMode: "provider" as const,
        sttProvider: "gemini" as const,
      },
      streamingText: "",
      t,
      ttsProvider: null,
    };
    const progress = {
      startedAt: 10,
      progress: 0,
      elapsedMs: 0,
      estimatedMs: 100,
      sampleCount: 0,
      learned: false,
      overEstimate: false,
      provider: "openai" as const,
    };
    const stt = getMainScreenViewModel({
      ...base,
      pipelinePhase: "transcribing",
      phaseProgress: { ...progress, phase: "transcribing" },
    });
    expect(stt.activity.provider).toBe("openai");
    expect(getMainScreenViewModel({ ...base, pipelinePhase: "transcribing" }).activity.provider)
      .toBe("gemini");
    const local = getMainScreenViewModel({
      ...base,
      pipelinePhase: "transcribing",
      phaseProgress: { ...progress, phase: "transcribing", provider: null },
    });
    expect(local.activity.provider).toBe("device");
    const council = getMainScreenViewModel({
      ...base,
      pipelinePhase: "thinking",
      phaseProgress: { ...progress, phase: "thinking" },
      replyProvider: "anthropic",
      streamingText: "An answer from the Council",
    });
    expect(council.activity.provider).toBe("anthropic");
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
