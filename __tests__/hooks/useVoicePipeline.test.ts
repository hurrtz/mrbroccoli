import { act, renderHook, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { translate } from "../../src/i18n";
import { useVoicePipeline } from "../../src/hooks/useVoicePipeline";
import { DEFAULT_SETTINGS, type UsageEstimate } from "../../src/types";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  deleteAsync: jest.fn(async () => undefined),
}));

jest.mock("../../src/services/voicePipeline", () => ({
  runVoicePipeline: jest.fn(),
}));

jest.mock("../../src/services/tts", () => ({
  LOCAL_TTS_MAX_INPUT_CHARS: 420,
  PROVIDER_TTS_MAX_INPUT_CHARS: 3500,
  getProviderTtsTargetChunkChars: (provider?: string | null) => {
    if (provider === "alibaba-qwen-dashscope") return 550;
    return 600;
  },
  splitIntoSentences: (text: string): string[] => {
    const result: string[] = [];
    let current = "";

    for (const char of text) {
      current += char;

      if (char === "." || char === "!" || char === "?" || char === "\n") {
        result.push(current);
        current = "";
      }
    }

    if (current) {
      result.push(current);
    }

    return result;
  },
  splitTextForTts: (text: string, maxChars = 3500) => {
    const normalized = text.trim();

    if (!normalized) {
      return [];
    }

    const words = normalized.split(/\s+/);
    const chunks: string[] = [];
    let current = "";

    for (const word of words) {
      const next = current ? `${current} ${word}` : word;

      if (next.length <= maxChars) {
        current = next;
        continue;
      }

      if (current) {
        chunks.push(current);
      }

      current = word;
    }

    if (current) {
      chunks.push(current);
    }

    return chunks;
  },
  synthesizeSpeech: jest.fn(),
  synthesizeSpeechSequence: jest.fn(),
}));

jest.mock("../../src/services/speech/diagnostics", () => ({
  createSpeechRequestId: jest.fn(() => "speech-request-1"),
}));

import { runVoicePipeline } from "../../src/services/voicePipeline";
import {
  synthesizeSpeech,
  synthesizeSpeechSequence,
} from "../../src/services/tts";

function createPlayer(
  overrides: Partial<ReturnType<typeof createPlayerBase>> = {},
) {
  return {
    ...createPlayerBase(),
    ...overrides,
  };
}

function createPlayerBase() {
  return {
    isPlaybackPaused: false,
    isPlaying: false,
    pausePlayback: jest.fn(async () => true),
    resumePlayback: jest.fn(async () => true),
    stopPlayback: jest.fn(async () => undefined),
    resetCancellation: jest.fn(),
    waitForDrain: jest.fn(async () => undefined),
    enqueueAudio: jest.fn(),
    speakText: jest.fn(),
    hasPendingPlaybackNow: jest.fn(() => false),
  };
}

function createParams(
  overrides: Partial<Parameters<typeof useVoicePipeline>[0]> = {},
) {
  const player = createPlayer();
  return {
    activeConversation: null,
    addMessage: jest.fn(),
    createConversation: jest.fn(),
    updateMessage: jest.fn(),
    updateConversationContextSummary: jest.fn(),
    player,
    provider: "openai" as const,
    providerApiKey: "sk-test",
    model: "gpt-5.4",
    sttMode: "native" as const,
    sttProvider: null,
    sttApiKey: "",
    selectedSttModel: "",
    ttsMode: "provider" as const,
    ttsProvider: "openai" as const,
    ttsApiKey: "sk-tts",
    selectedTtsModel: "gpt-4o-mini-tts",
    selectedTtsVoice: "alloy",
    ttsListenLanguages: DEFAULT_SETTINGS.ttsListenLanguages,
    replyPlayback: DEFAULT_SETTINGS.replyPlayback,
    spokenRepliesEnabled: true,
    assistantInstructions: DEFAULT_SETTINGS.assistantInstructions,
    responseLength: DEFAULT_SETTINGS.responseLength,
    responseTone: DEFAULT_SETTINGS.responseTone,
    language: "en" as const,
    isRecording: false,
    showToast: jest.fn(),
    t: (
      key: Parameters<typeof translate>[1],
      params?: Record<string, string | number | undefined>,
    ) => translate("en", key, params),
    ...overrides,
  };
}

describe("useVoicePipeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("shows a toast when there is no reply to replay yet", async () => {
    const params = createParams();
    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleRepeatLastReply();
    });

    expect(params.showToast).toHaveBeenCalledWith(
      translate("en", "noReplyToRepeatYet"),
    );
  });

  it("blocks reply replay when spoken replies are turned off", async () => {
    const params = createParams({
      spokenRepliesEnabled: false,
      player: createPlayer(),
    });
    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText("Replay this", "message-1");
    });

    expect(params.showToast).toHaveBeenCalledWith(
      translate("en", "spokenRepliesDisabled"),
    );
    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.player.enqueueAudio).not.toHaveBeenCalled();
  });

  it("reports replay synthesis failures without falling back to native speech", async () => {
    const params = createParams({
      ttsMode: "provider",
      player: createPlayer(),
    });
    (synthesizeSpeech as jest.Mock).mockRejectedValue(
      new Error("Provider TTS unavailable"),
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText("Replay this", "message-1");
    });

    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.showToast).toHaveBeenCalledWith(
      "Provider TTS unavailable",
      undefined,
      "danger",
    );
    expect(result.current.replayPhase).toBe("idle");
    expect(result.current.activeReplayMessageId).toBeNull();
  });

  it("does not start a long replay when a later provider chunk fails", async () => {
    const firstSentence = `First ${"buffered replay word ".repeat(24)}.`;
    const secondSentence = `Second ${"buffered replay word ".repeat(24)}.`;
    const params = createParams({
      ttsMode: "provider",
      player: createPlayer(),
    });
    (synthesizeSpeech as jest.Mock)
      .mockResolvedValueOnce("file://reply-1.wav")
      .mockRejectedValueOnce(new Error("Provider TTS unavailable"));

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText(
        `${firstSentence} ${secondSentence}`,
        "message-1",
      );
    });

    expect(params.player.enqueueAudio).not.toHaveBeenCalled();
    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.showToast).toHaveBeenCalledWith(
      "Provider TTS unavailable",
      undefined,
      "danger",
    );
  });

  it("keeps replay stream text together when the full reply is already available", async () => {
    const params = createParams({
      replyPlayback: "stream",
      player: createPlayer(),
    });
    (synthesizeSpeech as jest.Mock).mockResolvedValueOnce("file://reply-1.wav");

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText(
        "Sentence one. Sentence two.",
        "message-1",
      );
    });

    expect(synthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: "Sentence one. Sentence two.",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        providerModel: "gpt-4o-mini-tts",
        apiKey: "sk-tts",
        language: "en",
        listenLanguages: DEFAULT_SETTINGS.ttsListenLanguages,
        diagnostics: expect.objectContaining({
          requestId: "speech-request-1",
          source: "repeat",
        }),
      }),
    );
    expect(params.player.enqueueAudio).toHaveBeenCalledTimes(1);
    expect(params.player.enqueueAudio).toHaveBeenNthCalledWith(
      1,
      "file://reply-1.wav",
      expect.objectContaining({
        requestId: "speech-request-1",
        source: "repeat",
      }),
    );
    expect(synthesizeSpeechSequence).not.toHaveBeenCalled();
  });

  it("clears stale pending playback before starting a replay even when rendered state lags", async () => {
    const player = createPlayer({
      isPlaying: false,
    });
    const params = createParams({
      player,
      ttsMode: "native",
    });
    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText("Replay this", "message-1");
    });

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(player.stopPlayback.mock.invocationCallOrder[0]).toBeLessThan(
      player.resetCancellation.mock.invocationCallOrder[0],
    );
  });

  it("stops replay playback without relying on rendered playback state", async () => {
    const player = createPlayer({
      isPlaying: false,
    });
    const params = createParams({ player });
    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.stopReplay();
    });

    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(player.resetCancellation).not.toHaveBeenCalled();
  });

  it("replays long Gemini replies in reliable provider-sized chunks", async () => {
    const reply = Array.from(
      { length: 50 },
      () => "Replay this sentence with the selected provider voice.",
    ).join(" ");
    const params = createParams({
      ttsMode: "provider",
      ttsProvider: "gemini",
      ttsApiKey: "gemini-test",
      selectedTtsModel: "gemini-2.5-flash-preview-tts",
      selectedTtsVoice: "Kore",
      player: createPlayer(),
    });
    (synthesizeSpeech as jest.Mock).mockImplementation(
      async ({ text }: { text: string }) => `file://reply-${text.length}.wav`,
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.playReplyText(reply, "message-1");
    });

    const synthesizedTexts = (synthesizeSpeech as jest.Mock).mock.calls.map(
      ([ttsParams]: [{ text: string }]) => ttsParams.text,
    );
    expect(synthesizedTexts.length).toBeGreaterThan(1);
    expect(synthesizedTexts.every((text: string) => text.length <= 600)).toBe(
      true,
    );
    expect(synthesizedTexts.join(" ")).toBe(reply);
    expect(params.player.enqueueAudio).toHaveBeenCalledTimes(
      synthesizedTexts.length,
    );
    expect(params.player.speakText).not.toHaveBeenCalled();
  });

  it("runs the full voice pipeline and updates conversation state", async () => {
    const params = createParams();
    const summaryUsage: UsageEstimate = {
      kind: "summary",
      source: "estimated",
      promptTokens: 90,
      completionTokens: 12,
      totalTokens: 102,
    };
    const replyUsage: UsageEstimate = {
      kind: "reply",
      source: "estimated",
      promptTokens: 120,
      completionTokens: 40,
      totalTokens: 160,
    };
    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onTranscription("Hello from the microphone");
        callbacks.onContextSummary("Conversation summary", 3, summaryUsage);
        callbacks.onChunk("Streaming ");
        callbacks.onChunk("reply");
        callbacks.onResponseDone("Completed reply", replyUsage);
        callbacks.onAudioReady("file://reply.wav", {
          requestId: "speech-request-1",
          source: "conversation",
        });
        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(params.createConversation).toHaveBeenCalledWith(
      "Hello from the microphone",
      "gpt-5.4",
      "openai",
    );
    expect(params.addMessage).toHaveBeenCalledWith({
      role: "user",
      content: "Hello from the microphone",
      model: null,
      provider: null,
    });
    expect(params.addMessage).toHaveBeenCalledWith({
      role: "assistant",
      content: "Completed reply",
      model: "gpt-5.4",
      provider: "openai",
      usage: replyUsage,
    });
    expect(params.updateConversationContextSummary).toHaveBeenCalledWith(
      "Conversation summary",
      3,
      summaryUsage,
      "gpt-5.4",
      "openai",
    );
    expect(params.player.enqueueAudio).toHaveBeenCalledWith(
      "file://reply.wav",
      {
        requestId: "speech-request-1",
        source: "conversation",
      },
      expect.any(Function),
    );
    expect(result.current.pipelinePhase).toBe("idle");
    expect(result.current.streamingText).toBe("");
    expect(result.current.lastCompletedReplyRef.current).toBe(
      "Completed reply",
    );
  });

  it("uses the latest per-conversation settings for the next turn", async () => {
    const initialParams = createParams({
      modelEffort: "low",
      spokenRepliesEnabled: false,
      ttsInstructions: "Use the old delivery.",
      initialConversationSettings: {
        responseLength: "brief",
        responseTone: "casual",
        ttsVoice: "alloy",
        ttsInstructions: "Use the old delivery.",
        assistantInstructions: "Use the old thinking instructions.",
      },
    });
    const updatedConversationSettings = {
      responseLength: "thorough" as const,
      responseTone: "socratic" as const,
      ttsVoice: "nova",
      ttsInstructions: "Use the new delivery.",
      assistantInstructions: "Use the new thinking instructions.",
    };
    const updatedParams = {
      ...initialParams,
      modelEffort: "high",
      ttsInstructions: "Use the new delivery.",
      initialConversationSettings: updatedConversationSettings,
    };

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onTranscription("A new conversation");
        callbacks.onResponseDone("A current reply");
        return "A new conversation";
      },
    );

    const { result, rerender } = renderHook(
      ({ params }) => useVoicePipeline(params),
      { initialProps: { params: initialParams } },
    );

    rerender({ params: updatedParams });

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(runVoicePipeline).toHaveBeenCalledWith(
      expect.objectContaining({
        modelEffort: "high",
        ttsInstructions: "Use the new delivery.",
      }),
    );
    expect(initialParams.createConversation).toHaveBeenCalledWith(
      "A new conversation",
      "gpt-5.4",
      "openai",
      updatedConversationSettings,
    );
  });

  it("does not stop produced audio when a later speech chunk fails", async () => {
    const player = createPlayer({
      isPlaying: true,
      hasPendingPlaybackNow: jest.fn(() => true),
    });
    const params = createParams({ player });
    (params.addMessage as jest.Mock)
      .mockReturnValueOnce({ id: "user-1" })
      .mockReturnValueOnce({ id: "assistant-1" });
    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onTranscription("Hello from the microphone");
        callbacks.onResponseDone("A completed reply with several chunks.");
        callbacks.onAudioReady("file://reply-1.wav", {
          requestId: "speech-request-1",
          source: "conversation",
        });
        await callbacks.onError(
          new Error("Gemini speech output took too long."),
        );
        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
    });

    expect(player.stopPlayback).not.toHaveBeenCalled();
    expect(player.waitForDrain).toHaveBeenCalled();
    expect(params.showToast).not.toHaveBeenCalled();
    const updateAssistant = (params.updateMessage as jest.Mock).mock
      .calls[0][1];
    const updatedAssistant = updateAssistant({
      id: "assistant-1",
      role: "assistant",
      content: "A completed reply with several chunks.",
      model: "gpt-5.4",
      provider: "openai",
      timestamp: "2026-07-21T12:00:00.000Z",
    });
    expect(updatedAssistant.metadata?.notices).toEqual([
      {
        stage: "tts",
        level: "error",
        message: "The reply was saved, but it could not be spoken.",
        detail: "Gemini speech output took too long.",
      },
    ]);
  });

  it("persists a failed LLM turn for inline retry without duplicating the user message", async () => {
    const params = createParams();
    (params.addMessage as jest.Mock)
      .mockReturnValueOnce({ id: "user-1" })
      .mockReturnValueOnce({ id: "assistant-1" });
    let attempt = 0;
    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onTranscription("Please retry this turn");
        attempt += 1;

        if (attempt === 1) {
          await callbacks.onError(new Error("Provider request failed"));
        } else {
          callbacks.onResponseDone("Recovered reply");
        }

        return "Please retry this turn";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));
    result.current.lastCompletedReplyRef.current = "Older reply";

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Please retry this turn",
      });
    });

    expect(params.showToast).not.toHaveBeenCalled();
    const failedUserMessage = {
      id: "user-1",
      role: "user" as const,
      content: "Please retry this turn",
      model: null,
      provider: null,
      timestamp: "2026-07-21T12:00:00.000Z",
    };
    const markFailure = (params.updateMessage as jest.Mock).mock.calls[0][1];
    const markedUserMessage = markFailure(failedUserMessage);
    expect(markedUserMessage.metadata?.replyFailure).toEqual({
      message: "Provider request failed",
    });

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        existingUserMessageId: "user-1",
        transcriptionOverride: "Please retry this turn",
      });
    });

    expect(params.player.speakText).not.toHaveBeenCalled();
    expect(params.addMessage).toHaveBeenCalledWith({
      role: "user",
      content: "Please retry this turn",
      model: null,
      provider: null,
    });
    expect(
      (params.addMessage as jest.Mock).mock.calls.filter(
        ([message]) => message.role === "user",
      ),
    ).toHaveLength(1);
    const clearFailure = (params.updateMessage as jest.Mock).mock.calls[1][1];
    expect(clearFailure(markedUserMessage).metadata).toBeUndefined();
    expect(params.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "assistant",
        content: "Recovered reply",
      }),
    );
  });

  it("learns request preparation and the complete model response separately", async () => {
    const params = createParams({
      spokenRepliesEnabled: false,
    });
    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        jest.advanceTimersByTime(1_000);
        callbacks.onLlmStart();
        callbacks.onChunk("First token");
        jest.advanceTimersByTime(4_000);
        callbacks.onResponseDone("First token and the completed reply.");
        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@mrbroccoli/latency_stats",
        expect.stringContaining("request-preparation-v1"),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@mrbroccoli/latency_stats",
        expect.stringContaining("llm-response-v2"),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@mrbroccoli/latency_stats",
        expect.stringContaining("5000"),
      );
    });
  });

  it("keeps the total progress estimate through playback completion", async () => {
    let onPlaybackStarted: (() => void) | undefined;
    let resolveRun: (() => void) | null = null;
    const player = createPlayer({
      enqueueAudio: jest.fn(
        (_uri: string, _diagnostics: unknown, callback?: () => void) => {
          onPlaybackStarted = callback;
        },
      ),
    });
    const params = createParams({ player });

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        jest.advanceTimersByTime(1_000);
        callbacks.onTranscription("Hello from the microphone");
        callbacks.onWebSearchStart();
        jest.advanceTimersByTime(1_000);
        callbacks.onWebSearchComplete();
        callbacks.onLlmStart();
        jest.advanceTimersByTime(3_000);
        callbacks.onChunk("A complete reply is forming.");
        callbacks.onResponseDone("A complete reply is forming.");
        jest.advanceTimersByTime(2_000);
        callbacks.onAudioReady("file://reply.wav", {
          requestId: "speech-request-1",
          source: "conversation",
        });

        await new Promise<void>((resolve) => {
          resolveRun = resolve;
        });

        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));
    let pending: Promise<void> | null = null;

    await act(async () => {
      pending = result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
      await Promise.resolve();
    });

    expect(result.current.pipelinePhase).toBe("synthesizing");
    expect(result.current.phaseProgress).toMatchObject({
      phase: "synthesizing",
      overall: {
        startedAt: expect.any(Number),
      },
    });
    expect(
      Date.now() - (result.current.phaseProgress?.overall?.startedAt ?? 0),
    ).toBe(7_000);
    expect(onPlaybackStarted).toEqual(expect.any(Function));

    act(() => {
      onPlaybackStarted?.();
    });

    expect(result.current.pipelinePhase).toBe("speaking");
    expect(result.current.phaseProgress).toMatchObject({
      phase: "turn",
      startedAt: expect.any(Number),
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@mrbroccoli/latency_stats",
        expect.stringContaining("7000"),
      );
    });

    await act(async () => {
      jest.advanceTimersByTime(3_000);
      resolveRun?.();
      await pending;
    });

    expect(result.current.phaseProgress).toBeNull();
    await waitFor(() => {
      const completionPayload = (AsyncStorage.setItem as jest.Mock).mock.calls
        .map(
          ([, value]) =>
            JSON.parse(value) as Record<string, { samples?: number[] }>,
        )
        .find((value) =>
          Object.keys(value).some((key) =>
            key.startsWith("turn-to-completion-v1"),
          ),
        );
      const completionKey = Object.keys(completionPayload ?? {}).find((key) =>
        key.startsWith("turn-to-completion-v1"),
      );

      expect(
        completionKey
          ? completionPayload?.[completionKey]?.samples?.[0]
          : undefined,
      ).toBeGreaterThanOrEqual(10_000);
    });
  });

  it("does not learn a shortened completion time when playback is cancelled", async () => {
    let resolveDrain: (() => void) | null = null;
    const player = createPlayer({
      hasPendingPlaybackNow: jest.fn(() => true),
      waitForDrain: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveDrain = resolve;
          }),
      ),
    });
    const params = createParams({ player });

    (runVoicePipeline as jest.Mock).mockResolvedValue(
      "Hello from the microphone",
    );

    const { result } = renderHook(() => useVoicePipeline(params));
    let pending: Promise<void> | null = null;

    await act(async () => {
      pending = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
      await Promise.resolve();
    });

    act(() => {
      result.current.abortRef.current?.abort();
      resolveDrain?.();
    });

    await act(async () => {
      await pending;
    });

    const persistedPayloads = (
      AsyncStorage.setItem as jest.Mock
    ).mock.calls.map(
      ([, value]) => JSON.parse(value) as Record<string, unknown>,
    );

    expect(
      persistedPayloads.some((payload) =>
        Object.keys(payload).some((key) =>
          key.startsWith("turn-to-completion-v1"),
        ),
      ),
    ).toBe(false);
    expect(result.current.phaseProgress).toBeNull();
  });

  it("shows the retry toast when no transcription is produced", async () => {
    const params = createParams();
    (runVoicePipeline as jest.Mock).mockImplementation(async () => {
      jest.advanceTimersByTime(1_000);
      return null;
    });

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(params.showToast).toHaveBeenCalledWith(
      translate("en", "couldntCatchThatTryAgain"),
      expect.any(Function),
      "danger",
      expect.any(Function),
    );
    const retry = (params.showToast as jest.Mock).mock
      .calls[0][1] as () => void;

    await act(async () => {
      retry();
    });
    await waitFor(() => {
      expect(runVoicePipeline).toHaveBeenCalledTimes(2);
    });
    expect(runVoicePipeline).toHaveBeenLastCalledWith(
      expect.objectContaining({
        audioUri: "file://capture.wav",
      }),
    );
    expect(
      (AsyncStorage.setItem as jest.Mock).mock.calls.some(([, value]) =>
        Object.keys(JSON.parse(value) as Record<string, unknown>).some((key) =>
          key.startsWith("turn-to-completion-v1"),
        ),
      ),
    ).toBe(false);
    expect(result.current.pipelinePhase).toBe("idle");
  });

  it("does not learn turn completion from a failed request", async () => {
    const params = createParams();
    (runVoicePipeline as jest.Mock).mockImplementation(async () => {
      jest.advanceTimersByTime(1_000);
      throw new Error("Speech transcription failed.");
    });

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(params.showToast).toHaveBeenCalledWith(
      "Speech transcription failed.",
      expect.any(Function),
      "danger",
      expect.any(Function),
    );
    expect(
      (AsyncStorage.setItem as jest.Mock).mock.calls.some(([, value]) =>
        Object.keys(JSON.parse(value) as Record<string, unknown>).some((key) =>
          key.startsWith("turn-to-completion-v1"),
        ),
      ),
    ).toBe(false);
    expect(result.current.phaseProgress).toBeNull();
  });

  it("does not learn spoken completion after a late TTS failure", async () => {
    const player = createPlayer({
      isPlaying: true,
      enqueueAudio: jest.fn(
        (_uri: string, _diagnostics: unknown, onPlaybackStarted?: () => void) =>
          onPlaybackStarted?.(),
      ),
    });
    const params = createParams({ player });

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        jest.advanceTimersByTime(1_000);
        callbacks.onResponseDone("The reply was generated.");
        callbacks.onAudioReady("file://partial-reply.wav");
        jest.advanceTimersByTime(1_000);
        await callbacks.onError(new Error("Later speech chunk failed."));
        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
    });

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
    expect(
      (AsyncStorage.setItem as jest.Mock).mock.calls.some(([, value]) =>
        Object.keys(JSON.parse(value) as Record<string, unknown>).some((key) =>
          key.startsWith("turn-to-completion-v1"),
        ),
      ),
    ).toBe(false);
    expect(result.current.phaseProgress).toBeNull();
  });

  it("stores a durable assistant notice when provider TTS falls back", async () => {
    const params = createParams();
    (params.addMessage as jest.Mock)
      .mockReturnValueOnce({
        id: "user-1",
        role: "user",
        content: "Hello from the microphone",
        model: null,
        provider: null,
        timestamp: "2026-03-25T12:00:00.000Z",
      })
      .mockReturnValueOnce({
        id: "assistant-1",
        role: "assistant",
        content: "Completed reply",
        model: "gpt-5.4",
        provider: "openai",
        timestamp: "2026-03-25T12:00:01.000Z",
      });
    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onTranscription("Hello from the microphone");
        callbacks.onResponseDone("Completed reply");
        callbacks.onTtsFallback(new Error("Provider fallback"));
        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(params.updateMessage).toHaveBeenCalledWith(
      "assistant-1",
      expect.any(Function),
    );
    const updater = (params.updateMessage as jest.Mock).mock.calls[0][1];
    expect(
      updater({
        id: "assistant-1",
        role: "assistant",
        content: "Completed reply",
        model: "gpt-5.4",
        provider: "openai",
        timestamp: "2026-03-25T12:00:01.000Z",
      }),
    ).toEqual(
      expect.objectContaining({
        metadata: {
          notices: [
            {
              stage: "tts",
              level: "warning",
              message: translate("en", "providerVoiceFallback"),
              detail: "Provider fallback",
            },
          ],
        },
      }),
    );
  });

  it("stores a durable STT failure notice inside an existing conversation", async () => {
    const params = createParams({
      activeConversation: {
        id: "conversation-1",
        title: "Existing conversation",
        createdAt: "2026-03-25T11:00:00.000Z",
        updatedAt: "2026-03-25T11:00:00.000Z",
        messages: [],
      },
    });
    (runVoicePipeline as jest.Mock).mockRejectedValue(
      new Error("OpenAI speech transcription took too long."),
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    await act(async () => {
      await result.current.handleVoiceCaptureDone({
        audioUri: "file://capture.wav",
      });
    });

    expect(params.addMessage).toHaveBeenCalledWith({
      role: "assistant",
      content: "",
      model: null,
      provider: null,
      metadata: {
        notices: [
          {
            stage: "stt",
            level: "error",
            message: "OpenAI speech transcription took too long.",
          },
        ],
      },
    });
  });

  it("keeps the phase at speaking once streamed playback has already started", async () => {
    const params = createParams({
      player: createPlayer({
        hasPendingPlaybackNow: jest.fn(() => false),
        enqueueAudio: jest.fn(
          (
            _uri: string,
            _diagnostics: unknown,
            onPlaybackStarted?: () => void,
          ) => onPlaybackStarted?.(),
        ),
      }),
    });
    let resolveRun: (() => void) | null = null;

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onAudioReady("file://reply.wav", {
          requestId: "speech-request-1",
          source: "conversation",
        });
        callbacks.onResponseDone("Completed reply");

        await new Promise<void>((resolve) => {
          resolveRun = resolve;
        });

        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    let pending: Promise<void> | null = null;
    await act(async () => {
      pending = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
      await Promise.resolve();
    });

    expect(result.current.pipelinePhase).toBe("speaking");

    await act(async () => {
      resolveRun?.();
      await pending;
    });
  });

  it("does not regress from speaking back to thinking when later stream chunks arrive", async () => {
    const params = createParams({
      player: createPlayer({
        hasPendingPlaybackNow: jest.fn(() => false),
        enqueueAudio: jest.fn(
          (
            _uri: string,
            _diagnostics: unknown,
            onPlaybackStarted?: () => void,
          ) => onPlaybackStarted?.(),
        ),
      }),
    });
    let resolveRun: (() => void) | null = null;

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onAudioReady("file://reply.wav", {
          requestId: "speech-request-1",
          source: "conversation",
        });
        callbacks.onChunk(" more reply");

        await new Promise<void>((resolve) => {
          resolveRun = resolve;
        });

        return "Hello from the microphone";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));

    let pending: Promise<void> | null = null;
    await act(async () => {
      pending = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Hello from the microphone",
      });
      await Promise.resolve();
    });

    expect(result.current.pipelinePhase).toBe("speaking");

    await act(async () => {
      resolveRun?.();
      await pending;
    });
  });

  it("prevents a cancelled stale turn from mutating a newer turn", async () => {
    type PendingRun = {
      abortSignal: AbortSignal;
      callbacks: Record<string, (...args: any[]) => any>;
      reject: (reason?: unknown) => void;
      resolve: (value: string | null) => void;
    };
    const runs: PendingRun[] = [];
    let stalePlaybackStarted: (() => void) | undefined;
    const player = createPlayer({
      enqueueAudio: jest.fn(
        (
          _uri: string,
          _diagnostics: unknown,
          onPlaybackStarted?: () => void,
        ) => {
          stalePlaybackStarted = onPlaybackStarted;
        },
      ),
    });
    const params = createParams({
      player,
      spokenRepliesEnabled: false,
    });

    (runVoicePipeline as jest.Mock).mockImplementation(
      ({ abortSignal, callbacks }: any) =>
        new Promise<string | null>((resolve, reject) => {
          runs.push({
            abortSignal,
            callbacks,
            reject,
            resolve,
          });
        }),
    );

    const { result } = renderHook(() => useVoicePipeline(params));
    let firstTurn: Promise<void> | null = null;
    let secondTurn: Promise<void> | null = null;

    await act(async () => {
      firstTurn = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "First turn",
      });
      await Promise.resolve();
    });

    act(() => {
      runs[0].callbacks.onAudioReady("file://stale-reply.wav");
    });

    expect(result.current.pipelinePhase).toBe("synthesizing");

    await act(async () => {
      secondTurn = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Second turn",
      });
      await Promise.resolve();
    });

    expect(runs).toHaveLength(2);
    expect(runs[0].abortSignal.aborted).toBe(true);
    expect(runs[1].abortSignal.aborted).toBe(false);
    expect(player.stopPlayback).toHaveBeenCalledTimes(1);
    expect(result.current.pipelinePhase).toBe("thinking-briefly");

    act(() => {
      stalePlaybackStarted?.();
    });

    expect(result.current.pipelinePhase).toBe("thinking-briefly");

    await act(async () => {
      runs[0].callbacks.onResponseDone("Stale reply");
      await runs[0].callbacks.onError(new Error("Stale failure"));
      runs[0].reject(new Error("Cancelled first turn"));
      await firstTurn;
    });

    expect(params.addMessage).not.toHaveBeenCalled();
    expect(params.showToast).not.toHaveBeenCalled();
    expect(result.current.pipelinePhase).toBe("thinking-briefly");

    act(() => {
      runs[1].callbacks.onLlmStart();
      runs[1].callbacks.onChunk("Fresh reply");
      jest.advanceTimersByTime(17);
    });

    expect(result.current.pipelinePhase).toBe("thinking");
    expect(result.current.streamingText).toBe("Fresh reply");

    await act(async () => {
      runs[1].callbacks.onResponseDone("Fresh reply");
      runs[1].resolve("Second turn");
      await secondTurn;
    });

    expect(params.addMessage).toHaveBeenCalledTimes(1);
    expect(params.addMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Fresh reply",
        role: "assistant",
      }),
    );
    expect(result.current.pipelinePhase).toBe("idle");
  });

  it("coalesces rapid stream chunks into one visual frame without losing text", async () => {
    const params = createParams();
    let resolveRun: (() => void) | null = null;

    (runVoicePipeline as jest.Mock).mockImplementation(
      async ({ callbacks }: any) => {
        callbacks.onChunk("One");
        callbacks.onChunk(" two");
        callbacks.onChunk(" three");

        await new Promise<void>((resolve) => {
          resolveRun = resolve;
        });

        return "Typed input";
      },
    );

    const { result } = renderHook(() => useVoicePipeline(params));
    let pending: Promise<void> | null = null;

    await act(async () => {
      pending = result.current.handleVoiceCaptureDone({
        transcriptionOverride: "Typed input",
      });
      await Promise.resolve();
    });

    expect(result.current.streamingText).toBe("");

    act(() => {
      jest.advanceTimersByTime(17);
    });

    expect(result.current.streamingText).toBe("One two three");

    await act(async () => {
      resolveRun?.();
      await pending;
    });

    expect(result.current.streamingText).toBe("");
  });
});
