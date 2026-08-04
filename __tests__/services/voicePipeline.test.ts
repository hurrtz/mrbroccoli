import { runVoicePipeline as runVoicePipelineImplementation } from "../../src/services/voicePipeline";
import type { RunVoicePipelineParams } from "../../src/services/voicePipeline/types";
import { splitIntoSentences, synthesizeSpeech } from "../../src/services/tts";
import { transcribeAudio } from "../../src/services/whisper";
import { searchWeb } from "../../src/services/webSearch";
import {
  streamChat,
  summarizeConversationContext,
} from "../../src/services/llm";
import { runUlraModeDeliberation } from "../../src/services/ulraMode";
import {
  executeProviderModelRequest,
  resetProviderModelHealthForTests,
} from "../../src/services/providerResilience";
import { ProviderRequestError } from "../../src/services/providerErrors";
import { retrieveConversationKnowledge } from "../../src/services/conversationKnowledge";
import { streamLocalChat } from "../../src/services/localLlm";
import { recordDebugLogEvent } from "../../src/services/debugLogCapture";

jest.mock("expo-file-system/legacy", () => ({
  deleteAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

jest.mock("../../src/services/whisper", () => ({
  transcribeAudio: jest.fn(),
}));

jest.mock("../../src/services/llm", () => ({
  streamChat: jest.fn(),
  summarizeConversationContext: jest.fn(),
}));

jest.mock("../../src/services/webSearch", () => ({
  searchWeb: jest.fn(),
}));

jest.mock("../../src/services/conversationKnowledge", () => ({
  retrieveConversationKnowledge: jest.fn(),
}));

jest.mock("../../src/services/localLlm", () => ({
  streamLocalChat: jest.fn(),
}));

jest.mock("../../src/services/ulraMode", () => ({
  getUlraModeFailureParticipants: jest.fn(() => [
    "#2 · Anthropic / claude-test",
  ]),
  runUlraModeDeliberation: jest.fn(),
}));

jest.mock("../../src/services/playbackCues", () => ({
  INTER_PARAGRAPH_PAUSE_MS: 250,
  getInterParagraphPauseAudioUri: jest.fn(
    async () => "file:///tmp/paragraph-pause.wav",
  ),
}));

jest.mock("../../src/services/tts", () => ({
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
    if (current) result.push(current);
    return result;
  },
  LOCAL_TTS_MAX_INPUT_CHARS: 420,
  PROVIDER_TTS_MAX_INPUT_CHARS: 3500,
  getProviderTtsTargetChunkChars: (provider?: string | null) => {
    if (provider === "alibaba-qwen-dashscope") return 550;
    return 600;
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
}));

type TestVoicePipelineParams = Omit<
  RunVoicePipelineParams,
  "sttLanguage" | "turnId"
> &
  Partial<Pick<RunVoicePipelineParams, "sttLanguage" | "turnId">>;

function runVoicePipeline(params: TestVoicePipelineParams) {
  return runVoicePipelineImplementation({
    sttLanguage: "en",
    turnId: "test-turn",
    ...params,
  });
}

describe("splitIntoSentences", () => {
  it("splits on period", () => {
    expect(splitIntoSentences("Hello. World.")).toEqual(["Hello.", " World."]);
  });
  it("splits on question mark", () => {
    expect(splitIntoSentences("How? Why?")).toEqual(["How?", " Why?"]);
  });
  it("splits on exclamation mark", () => {
    expect(splitIntoSentences("Wow! Great!")).toEqual(["Wow!", " Great!"]);
  });
  it("splits on newline", () => {
    expect(splitIntoSentences("Line one\nLine two")).toEqual([
      "Line one\n",
      "Line two",
    ]);
  });
  it("returns single chunk for no delimiters", () => {
    expect(splitIntoSentences("hello world")).toEqual(["hello world"]);
  });
});

describe("runVoicePipeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
    (summarizeConversationContext as jest.Mock).mockResolvedValue({
      summary: "",
      usage: undefined,
    });
    (searchWeb as jest.Mock).mockResolvedValue(null);
    (retrieveConversationKnowledge as jest.Mock).mockResolvedValue(null);
  });

  it("injects source-backed past knowledge while preserving private exclusions", async () => {
    (retrieveConversationKnowledge as jest.Mock).mockResolvedValue({
      context:
        "SOURCE 1 — Architecture notes (2026-08-01, conversation architecture)\nUser: Keep the index local.",
      metadata: {
        engine: "local-hybrid-v1",
        sources: [
          {
            conversationId: "architecture",
            title: "Architecture notes",
            updatedAt: "2026-08-01T08:00:00.000Z",
          },
        ],
      },
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Use the local index.");
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onLlmStart: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "What did we decide about the index?",
      messages: [],
      currentConversationId: "current",
      conversationKnowledgeExcludedIds: ["fork-source"],
      privateConversationIds: ["private"],
      pastConversationKnowledgeEnabled: true,
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "test-key",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      spokenRepliesEnabled: false,
      assistantInstructions: "Be accurate.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(retrieveConversationKnowledge).toHaveBeenCalledWith({
      currentConversationId: "current",
      excludedConversationIds: ["fork-source"],
      privateConversationIds: ["private"],
      query: "What did we decide about the index?",
    });
    expect(streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        pastConversationKnowledge: expect.stringContaining(
          "Keep the index local",
        ),
      }),
    );
    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "Use the local index.",
      undefined,
      expect.objectContaining({
        conversationKnowledge: expect.objectContaining({
          sources: [
            expect.objectContaining({ conversationId: "architecture" }),
          ],
        }),
        turnReceipt: expect.objectContaining({
          context: expect.objectContaining({
            pastKnowledgeRequested: true,
            pastKnowledgeUsed: true,
            pastKnowledgeSourceCount: 1,
          }),
        }),
      }),
    );
  });

  it("uses the conversation created by transcription as the retrieval exclusion", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Fresh answer.");
      },
    );
    const callbacks = {
      onTranscription: jest.fn(() => "created-current"),
      onLlmStart: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Start a new conversation about device heat.",
      messages: [],
      currentConversationId: null,
      privateConversationIds: [],
      pastConversationKnowledgeEnabled: true,
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "test-key",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      spokenRepliesEnabled: false,
      assistantInstructions: "Be accurate.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(retrieveConversationKnowledge).toHaveBeenCalledWith(
      expect.objectContaining({
        currentConversationId: "created-current",
      }),
    );
  });

  it("blocks serialized hidden context before saving or speaking it", async () => {
    (retrieveConversationKnowledge as jest.Mock).mockResolvedValue({
      context:
        "SOURCE 1 — Earlier notes (2026-08-01)\nUser: Historical context",
      metadata: {
        engine: "local-user-authored-v2",
        sources: [
          {
            conversationId: "earlier",
            title: "Earlier notes",
            updatedAt: "2026-08-01T08:00:00.000Z",
          },
        ],
      },
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
        onError,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
        onError: (error: Error) => Promise<void>;
      }) => {
        const safeText =
          "The hardware verdict needs a live benchmark before it is final. ";
        const leakedText =
          "[Truncated: earlier conversation had 6 more turns]\n\n" +
          "SOURCE 4 — Weather notes (2026-04-14)\n" +
          "User: Hidden historical text";
        try {
          onChunk(safeText);
          onChunk(leakedText);
          await onDone(safeText + leakedText);
        } catch (error) {
          await onError(error as Error);
        }
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onLlmStart: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Assess the hardware check.",
      messages: [],
      currentConversationId: "current",
      privateConversationIds: [],
      pastConversationKnowledgeEnabled: true,
      model: "claude-fable-5",
      provider: "anthropic",
      providerApiKey: "test-key",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      spokenRepliesEnabled: true,
      assistantInstructions: "Keep internal context private.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onResponseDone).not.toHaveBeenCalled();
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalledWith(
      expect.stringContaining("Hidden historical text"),
      expect.anything(),
      expect.anything(),
    );
    expect(callbacks.onChunk.mock.calls.flat().join(" ")).not.toContain(
      "Hidden historical text",
    );
    expect(callbacks.onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Anthropic's reply ended before it was complete. Try again.",
      }),
    );
  });

  it("passes source-backed past knowledge to an on-device response", async () => {
    (retrieveConversationKnowledge as jest.Mock).mockResolvedValue({
      context: "SOURCE 1 — Private architecture\nUser: Keep inference local.",
      metadata: {
        engine: "local-hybrid-v1",
        sources: [
          {
            conversationId: "architecture",
            title: "Private architecture",
            updatedAt: "2026-08-01T08:00:00.000Z",
          },
        ],
      },
    });
    (streamLocalChat as jest.Mock).mockResolvedValue({
      fullText: "I will keep inference local.",
      usage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 20,
        completionTokens: 7,
        totalTokens: 27,
      },
      termination: {
        completionTokenLimit: 384,
        contextFull: false,
        limitReached: false,
        stoppedEos: true,
        stoppedWord: false,
      },
    });
    const callbacks = {
      onTranscription: jest.fn(),
      onLlmStart: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "What did we decide?",
      messages: [],
      currentConversationId: "current",
      privateConversationIds: ["private"],
      pastConversationKnowledgeEnabled: true,
      model: "qwen3-0.6b-q8",
      localLlmModelId: "qwen3-0.6b-q8",
      provider: "openai",
      providerApiKey: "",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      spokenRepliesEnabled: false,
      assistantInstructions: "Be accurate.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(streamChat).not.toHaveBeenCalled();
    expect(streamLocalChat).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: "qwen3-0.6b-q8",
        pastConversationKnowledge: expect.stringContaining(
          "Keep inference local",
        ),
      }),
    );
    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "I will keep inference local.",
      expect.objectContaining({ totalTokens: 27 }),
      expect.objectContaining({
        conversationKnowledge: expect.objectContaining({
          sources: [
            expect.objectContaining({ conversationId: "architecture" }),
          ],
        }),
      }),
    );
    expect(recordDebugLogEvent).toHaveBeenCalledWith({
      event: "voice-pipeline-local-llm-finished",
      payload: expect.objectContaining({
        completionTokenLimit: 384,
        completionTokens: 7,
        limitReached: false,
      }),
    });
  });

  it("uses a native transcript override and skips provider STT", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Wind is moving air.");
        await onDone("Wind is moving air.");
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onLlmStart: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    const result = await runVoicePipeline({
      transcriptionOverride: "Explain wind.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "gsk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(result).toBe("Explain wind.");
    expect(transcribeAudio).not.toHaveBeenCalled();
    expect(callbacks.onTranscription).toHaveBeenCalledWith("Explain wind.");
    expect(callbacks.onLlmStart).toHaveBeenCalledTimes(1);
    expect(callbacks.onLlmStart.mock.invocationCallOrder[0]).toBeLessThan(
      callbacks.onChunk.mock.invocationCallOrder[0],
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Wind is moving air.",
      undefined,
      expect.objectContaining({
        requestId: expect.stringMatching(/^conversation-/),
        source: "conversation",
      }),
    );
    expect(synthesizeSpeech).not.toHaveBeenCalled();
  });

  it("keeps replies text-only when spoken replies are disabled", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Wind is moving air.");
        await onDone("Wind is moving air.");
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain wind.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "gsk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      spokenRepliesEnabled: false,
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "Wind is moving air.",
      undefined,
      expect.objectContaining({
        turnReceipt: expect.objectContaining({
          input: expect.objectContaining({
            source: "text",
            mode: "native",
          }),
          requestedRoute: {
            provider: "openai",
            model: "gpt-5.4",
            runtime: "provider",
          },
          actualRoute: {
            provider: "openai",
            model: "gpt-5.4",
            runtime: "provider",
          },
          speechOutput: expect.objectContaining({
            enabled: false,
            requestedMode: "off",
            actualMode: "off",
          }),
          timing: expect.objectContaining({
            transcriptionMs: expect.any(Number),
            modelMs: expect.any(Number),
            replyReadyMs: expect.any(Number),
            totalMs: expect.any(Number),
          }),
        }),
      }),
    );
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(synthesizeSpeech).not.toHaveBeenCalled();
  });

  it("passes summary usage metadata through the pipeline callback", async () => {
    (summarizeConversationContext as jest.Mock).mockResolvedValueOnce({
      summary: "User prefers concise answers.",
      usage: {
        kind: "summary",
        source: "estimated",
        promptTokens: 90,
        completionTokens: 14,
        totalTokens: 104,
      },
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Done.");
        await onDone("Done.");
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onContextSummary: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Remember this.",
      messages: Array.from({ length: 8 }, (_, index) => ({
        id: `m${index + 1}`,
        role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
        content: "I like short answers. ".repeat(80),
        model: index % 2 === 0 ? null : "gpt-5.4",
        provider: index % 2 === 0 ? null : "openai",
        timestamp: `2026-03-17T10:0${index}:00.000Z`,
      })),
      contextSummary: "Prior preference.",
      summarizedMessageCount: 1,
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onContextSummary).toHaveBeenCalledWith(
      "[Conversation response provenance v1]\nUser prefers concise answers.",
      expect.any(Number),
      expect.objectContaining({
        kind: "summary",
        totalTokens: 104,
      }),
    );
    expect(summarizeConversationContext).toHaveBeenCalledWith(
      expect.objectContaining({
        existingSummary: "",
        messages: expect.arrayContaining([
          expect.objectContaining({ id: "m1" }),
        ]),
      }),
    );
  });

  it("deletes the captured audio file after provider STT completes", async () => {
    const { deleteAsync } = jest.requireMock("expo-file-system/legacy") as {
      deleteAsync: jest.Mock;
    };

    (transcribeAudio as jest.Mock).mockResolvedValueOnce("Explain wind.");
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Wind is moving air.");
        await onDone("Wind is moving air.");
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      audioUri: "file:///tmp/recording.wav",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "provider",
      sttProvider: "openai",
      sttApiKey: "sk-test",
      sttModel: "gpt-4o-mini-transcribe",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(deleteAsync).toHaveBeenCalledWith("file:///tmp/recording.wav", {
      idempotent: true,
    });
  });

  it("retains captured audio when provider STT fails before transcription", async () => {
    const { deleteAsync } = jest.requireMock("expo-file-system/legacy") as {
      deleteAsync: jest.Mock;
    };
    const transcriptionError = new Error("Speech provider unavailable.");

    (transcribeAudio as jest.Mock).mockRejectedValueOnce(transcriptionError);

    await expect(
      runVoicePipeline({
        audioUri: "file:///tmp/retryable-recording.wav",
        messages: [],
        model: "gpt-5.4",
        provider: "openai",
        providerApiKey: "sk-test",
        sttMode: "provider",
        sttProvider: "openai",
        sttApiKey: "sk-test",
        sttModel: "gpt-4o-mini-transcribe",
        ttsMode: "native",
        ttsVoice: "alloy",
        replyPlayback: "wait",
        assistantInstructions: "You are a voice assistant.",
        responseLength: "normal",
        responseTone: "professional",
        language: "en",
        callbacks: {
          onTranscription: jest.fn(),
          onChunk: jest.fn(),
          onResponseDone: jest.fn(),
          onAudioReady: jest.fn(),
          onSpeechTextReady: jest.fn(),
          onError: jest.fn(),
        },
      }),
    ).rejects.toBe(transcriptionError);

    expect(deleteAsync).not.toHaveBeenCalled();
  });

  it("retains captured audio when provider STT returns no transcription", async () => {
    const { deleteAsync } = jest.requireMock("expo-file-system/legacy") as {
      deleteAsync: jest.Mock;
    };

    (transcribeAudio as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      runVoicePipeline({
        audioUri: "file:///tmp/empty-recording.wav",
        messages: [],
        model: "gpt-5.4",
        provider: "openai",
        providerApiKey: "sk-test",
        sttMode: "provider",
        sttProvider: "openai",
        sttApiKey: "sk-test",
        sttModel: "gpt-4o-mini-transcribe",
        ttsMode: "native",
        ttsVoice: "alloy",
        replyPlayback: "wait",
        assistantInstructions: "You are a voice assistant.",
        responseLength: "normal",
        responseTone: "professional",
        language: "en",
        callbacks: {
          onTranscription: jest.fn(),
          onChunk: jest.fn(),
          onResponseDone: jest.fn(),
          onAudioReady: jest.fn(),
          onSpeechTextReady: jest.fn(),
          onError: jest.fn(),
        },
      }),
    ).resolves.toBeNull();

    expect(deleteAsync).not.toHaveBeenCalled();
  });

  it("deletes captured audio when the transcription turn was cancelled", async () => {
    const { deleteAsync } = jest.requireMock("expo-file-system/legacy") as {
      deleteAsync: jest.Mock;
    };
    const abortController = new AbortController();
    abortController.abort();

    await expect(
      runVoicePipeline({
        audioUri: "file:///tmp/cancelled-recording.wav",
        messages: [],
        model: "gpt-5.4",
        provider: "openai",
        providerApiKey: "sk-test",
        sttMode: "provider",
        sttProvider: "openai",
        sttApiKey: "sk-test",
        sttModel: "gpt-4o-mini-transcribe",
        ttsMode: "native",
        ttsVoice: "alloy",
        replyPlayback: "wait",
        assistantInstructions: "You are a voice assistant.",
        responseLength: "normal",
        responseTone: "professional",
        language: "en",
        abortSignal: abortController.signal,
        callbacks: {
          onTranscription: jest.fn(),
          onChunk: jest.fn(),
          onResponseDone: jest.fn(),
          onAudioReady: jest.fn(),
          onSpeechTextReady: jest.fn(),
          onError: jest.fn(),
        },
      }),
    ).resolves.toBeNull();

    expect(deleteAsync).toHaveBeenCalledWith(
      "file:///tmp/cancelled-recording.wav",
      { idempotent: true },
    );
  });

  it("speaks a completed paragraph immediately in stream mode", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Wind is moving air.\n\n");
        await Promise.resolve();
        expect(events).toEqual(["speak:Wind is moving air."]);
        await onDone("Wind is moving air.\n\n");
      },
    );

    const events: string[] = [];
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(() => {
        events.push("response-done");
      }),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn((text: string) => {
        events.push(`speak:${text}`);
      }),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain wind.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "gsk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Wind is moving air.",
      undefined,
      expect.objectContaining({
        requestId: expect.stringMatching(/^conversation-/),
        source: "conversation",
      }),
    );
    expect(streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        spokenParagraphStreaming: true,
      }),
    );
    expect(events).toEqual(["speak:Wind is moving air.", "response-done"]);
  });

  it("speaks a Markdown response through the speech-only renderer", async () => {
    const response = [
      "## Recommendation",
      "- Choose **Quick** for routine turns.",
      "- See the [notes](https://example.com/models). [1]",
    ].join("\n");
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone(response);
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Which route?",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      response,
      undefined,
      expect.any(Object),
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Recommendation. Choose Quick for routine turns. See the notes.",
      undefined,
      expect.any(Object),
    );
  });

  it("queues a short native speech pause between paragraphs", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("First line.\nStill first paragraph.\n\n");
        onChunk("Second paragraph.\n\n");
        await onDone(
          "First line.\nStill first paragraph.\n\nSecond paragraph.",
        );
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onSpeechPauseReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain it.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onSpeechTextReady).toHaveBeenCalledTimes(2);
    expect(callbacks.onSpeechTextReady).toHaveBeenNthCalledWith(
      1,
      "First line. Still first paragraph.",
      undefined,
      expect.any(Object),
    );
    expect(callbacks.onSpeechPauseReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onSpeechPauseReady).toHaveBeenCalledWith(250);
  });

  it("keeps complete stream text together when multiple sentences arrive in one chunk", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Sentence one. Sentence two.\n\n");
        await onDone("Sentence one. Sentence two.");
      },
    );

    (synthesizeSpeech as jest.Mock).mockResolvedValueOnce("/tmp/tts-1.mp3");

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain glass.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: "Sentence one. Sentence two.",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
        diagnostics: expect.objectContaining({
          source: "conversation",
          requestId: expect.any(String),
        }),
      }),
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
  });

  it("routes spoken replies through Kokoro without provider credentials", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("A private on-device reply.");
        await onDone("A private on-device reply.");
      },
    );
    (synthesizeSpeech as jest.Mock).mockResolvedValueOnce(
      "file:///tmp/kokoro.wav",
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };
    const kokoroVoices = { en: "af_sol", zh: "zf_001" };

    await runVoicePipeline({
      transcriptionOverride: "Reply locally.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "kokoro",
      ttsVoice: "af_sol",
      kokoroVoices,
      ttsListenLanguages: ["en"],
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({
        text: "A private on-device reply.",
        mode: "kokoro",
        voice: "af_sol",
        kokoroVoices,
        apiKey: undefined,
        provider: undefined,
      }),
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledWith(
      "file:///tmp/kokoro.wav",
      expect.objectContaining({
        mode: "kokoro",
        provider: null,
        language: "en",
        voice: "af_sol",
      }),
    );
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
  });

  it("speaks each paragraph in stream mode with a pause between them", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Paragraph one.\n\n");
        onChunk("Paragraph two.\n\n");
        await onDone("Paragraph one.\n\nParagraph two.");
      },
    );

    (synthesizeSpeech as jest.Mock)
      .mockResolvedValueOnce("/tmp/provider-1.wav")
      .mockResolvedValueOnce("/tmp/provider-2.wav");

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onAudioPauseReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain glass.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "gemini",
      ttsApiKey: "gemini-test",
      ttsModel: "gemini-2.5-flash-preview-tts",
      ttsVoice: "Algenib",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: "Paragraph one.",
        mode: "provider",
        provider: "gemini",
        providerModel: "gemini-2.5-flash-preview-tts",
        apiKey: "gemini-test",
      }),
    );
    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        text: "Paragraph two.",
        mode: "provider",
        provider: "gemini",
        providerModel: "gemini-2.5-flash-preview-tts",
        apiKey: "gemini-test",
      }),
    );
    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(2);
    expect(callbacks.onAudioPauseReady).toHaveBeenCalledWith(
      "file:///tmp/paragraph-pause.wav",
    );
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
  });

  it("starts synthesizing each completed follow-up paragraph before the reply ends", async () => {
    (synthesizeSpeech as jest.Mock).mockResolvedValue("/tmp/tts.wav");
    (streamChat as jest.Mock).mockImplementation(
      async ({ onChunk }: { onChunk: (text: string) => void }) => {
        onChunk("Paragraph one.\n\n");
        await Promise.resolve();
        await Promise.resolve();
        expect(synthesizeSpeech).toHaveBeenCalledTimes(1);

        onChunk("Paragraph two.\n\n");
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        expect(synthesizeSpeech).toHaveBeenCalledTimes(2);
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "Explain glass.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });
  });

  it("prefetches provider speech while preserving paragraph playback order", async () => {
    let resolveFirst: (value: string) => void = () => undefined;
    let resolveSecond: (value: string) => void = () => undefined;
    const audioEvents: string[] = [];

    (synthesizeSpeech as jest.Mock)
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveSecond = resolve;
          }),
      );
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Paragraph one.\n\n");
        onChunk("Paragraph two.\n\n");
        await Promise.resolve();
        await Promise.resolve();

        expect(synthesizeSpeech).toHaveBeenCalledTimes(2);

        resolveSecond("/tmp/tts-2.wav");
        await Promise.resolve();
        expect(audioEvents).toEqual([]);

        resolveFirst("/tmp/tts-1.wav");
        await onDone("Paragraph one.\n\nParagraph two.");
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "Explain glass.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: (audioUri) => audioEvents.push(audioUri),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(audioEvents).toEqual(["/tmp/tts-1.wav", "/tmp/tts-2.wav"]);
  });

  it("flushes a trailing partial paragraph for provider TTS when the stream finishes", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("One.\n\nTwo");
        await onDone("One.\n\nTwo");
      },
    );

    (synthesizeSpeech as jest.Mock)
      .mockResolvedValueOnce("/tmp/tts-1.mp3")
      .mockResolvedValueOnce("/tmp/tts-2.mp3");

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Count.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        text: "One.",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
        diagnostics: expect.objectContaining({
          source: "conversation",
          requestId: expect.any(String),
        }),
      }),
    );
    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        text: "Two",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
        diagnostics: expect.objectContaining({
          source: "conversation",
          requestId: expect.any(String),
        }),
      }),
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(2);
  });

  it("does not synthesize a streamed domain as a tiny trailing fragment", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("The official site is x.");
        await Promise.resolve();
        expect(synthesizeSpeech).not.toHaveBeenCalled();
        onChunk("ai.");
        await onDone("The official site is x.ai.");
      },
    );

    (synthesizeSpeech as jest.Mock).mockResolvedValueOnce("/tmp/domain.mp3");

    await runVoicePipeline({
      transcriptionOverride: "Find the official site.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(synthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({ text: "The official site is x.ai." }),
    );
  });

  it("chunks long provider TTS replies in wait mode", async () => {
    const longReply = Array.from(
      { length: 180 },
      () => "This is a deliberately long reply sentence.",
    ).join(" ");

    (streamChat as jest.Mock).mockImplementation(
      async ({
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        await onDone(longReply);
      },
    );

    (synthesizeSpeech as jest.Mock).mockImplementation(
      async ({ text }: { text: string }) => `/tmp/tts-${text.length}.mp3`,
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Summarize the route.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    const synthesizedTexts = (synthesizeSpeech as jest.Mock).mock.calls.map(
      ([params]: [{ text: string }]) => params.text,
    );

    expect(synthesizedTexts.length).toBeGreaterThan(1);
    expect(synthesizedTexts.every((text: string) => text.length <= 600)).toBe(
      true,
    );
    expect(synthesizedTexts.join(" ")).toBe(longReply);
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(
      synthesizedTexts.length,
    );
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("stitches adjacent ElevenLabs chunks without delaying playback order", async () => {
    const longReply = Array.from(
      { length: 40 },
      () => "A deliberately paced ElevenLabs sentence.",
    ).join(" ");

    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone(longReply);
      },
    );
    (synthesizeSpeech as jest.Mock).mockImplementation(
      async ({ text }: { text: string }) => `/tmp/tts-${text.length}.mp3`,
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Read this naturally.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "elevenlabs",
      ttsApiKey: "elevenlabs-test-key",
      ttsModel: "eleven_flash_v2_5",
      ttsVoice: "voice-123",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    const synthesisCalls = (synthesizeSpeech as jest.Mock).mock.calls.map(
      ([params]) => params,
    );
    expect(synthesisCalls.length).toBeGreaterThan(1);
    expect(synthesisCalls[0]).toEqual(
      expect.objectContaining({
        previousText: undefined,
        nextText: synthesisCalls[1].text,
      }),
    );
    expect(synthesisCalls[1]).toEqual(
      expect.objectContaining({
        previousText: synthesisCalls[0].text,
      }),
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(synthesisCalls.length);
  });

  it("buffers wait-mode provider audio until every chunk is ready", async () => {
    const sentenceOne = `First ${"carefully buffered word ".repeat(22)}.`;
    const sentenceTwo = `Second ${"carefully buffered word ".repeat(22)}.`;
    const longReply = `${sentenceOne} ${sentenceTwo}`;
    const audioEvents: string[] = [];
    let resolveSecond: (value: string) => void = () => undefined;

    (synthesizeSpeech as jest.Mock)
      .mockResolvedValueOnce("/tmp/provider-1.wav")
      .mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveSecond = resolve;
          }),
      );
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        const pendingDone = onDone(longReply);
        await Promise.resolve();
        await Promise.resolve();

        expect(audioEvents).toEqual([]);

        resolveSecond("/tmp/provider-2.wav");
        await pendingDone;
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "Read the complete answer.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: (audioUri) => audioEvents.push(audioUri),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(audioEvents).toEqual(["/tmp/provider-1.wav", "/tmp/provider-2.wav"]);
  });

  it("keeps long Gemini TTS replies within a practical request budget", async () => {
    const longReply = Array.from(
      { length: 70 },
      () => "Gemini should receive a modest speech segment.",
    ).join(" ");

    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone(longReply);
      },
    );
    (synthesizeSpeech as jest.Mock).mockImplementation(
      async ({ text }: { text: string }) => `/tmp/tts-${text.length}.wav`,
    );

    await runVoicePipeline({
      transcriptionOverride: "Read the answer.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "gemini",
      ttsApiKey: "gemini-test",
      ttsModel: "gemini-2.5-flash-preview-tts",
      ttsVoice: "Kore",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    const synthesizedTexts = (synthesizeSpeech as jest.Mock).mock.calls.map(
      ([params]: [{ text: string }]) => params.text,
    );

    expect(synthesizedTexts.length).toBeGreaterThan(1);
    expect(synthesizedTexts.every((text: string) => text.length <= 600)).toBe(
      true,
    );
    expect(synthesizedTexts.length).toBeLessThanOrEqual(10);
    expect(synthesizedTexts.join(" ")).toBe(longReply);
  });

  it("keeps native fallback active for the rest of a reply", async () => {
    const longReply = Array.from(
      { length: 70 },
      () => "Fallback should remain on one voice route.",
    ).join(" ");
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone(longReply);
      },
    );
    (synthesizeSpeech as jest.Mock).mockRejectedValueOnce(
      new Error("Gemini timed out"),
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Read the answer.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "gemini",
      ttsApiKey: "gemini-test",
      ttsVoice: "Kore",
      ttsFallbackRoutes: ["native"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    const nativeSegments = callbacks.onSpeechTextReady.mock.calls.map(
      ([text]: [string]) => text,
    );
    expect(synthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(callbacks.onTtsFallback).toHaveBeenCalledTimes(1);
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(nativeSegments.length).toBeGreaterThan(1);
    expect(nativeSegments.join(" ")).toBe(longReply);
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("does not switch to native after provider playback has started", async () => {
    const longReply = Array.from(
      { length: 40 },
      () => "Provider playback must remain the only voice route.",
    ).join(" ");
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk(longReply);
        await onDone(longReply);
      },
    );
    (synthesizeSpeech as jest.Mock)
      .mockResolvedValueOnce("/tmp/provider-1.wav")
      .mockRejectedValueOnce(new Error("Gemini timed out"));
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Read the answer.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "gemini",
      ttsApiKey: "gemini-test",
      ttsVoice: "Kore",
      ttsFallbackRoutes: ["native"],
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(
      (synthesizeSpeech as jest.Mock).mock.calls.length,
    ).toBeGreaterThanOrEqual(2);
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Gemini timed out" }),
    );
  });

  it("falls back to native speech when provider TTS fails in wait mode", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        await onDone("A complete answer.");
      },
    );

    (synthesizeSpeech as jest.Mock).mockRejectedValueOnce(
      new Error("Provider TTS unavailable"),
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      ttsFallbackRoutes: ["native"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Provider TTS unavailable",
      }),
      "native",
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "A complete answer.",
      undefined,
      expect.objectContaining({
        requestId: expect.stringMatching(/^conversation-/),
        source: "conversation",
      }),
    );
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("does not use a fallback route unless one is explicitly configured", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("A complete answer.");
      },
    );
    (synthesizeSpeech as jest.Mock).mockRejectedValueOnce(
      new Error("Provider TTS unavailable"),
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Provider TTS unavailable" }),
    );
  });

  it("rejects an unsupported provider output language without an implicit fallback", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Привіт з України.");
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Speak Ukrainian.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "mistral",
      ttsApiKey: "mistral-test",
      ttsVoice: "voice-123",
      ttsListenLanguages: ["uk"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).not.toHaveBeenCalled();
    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Mistral does not officially support Ukrainian for this speech route.",
      }),
    );
  });

  it("uses an explicitly configured native fallback for an unsupported output language", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Привіт з України.");
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Speak Ukrainian.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "mistral",
      ttsApiKey: "mistral-test",
      ttsVoice: "voice-123",
      ttsFallbackRoutes: ["native"],
      ttsListenLanguages: ["uk"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).not.toHaveBeenCalled();
    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "Mistral does not officially support Ukrainian for this speech route.",
      }),
      "native",
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Привіт з України.",
      undefined,
      expect.objectContaining({
        language: "uk",
        mode: "native",
      }),
    );
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("chooses a compatible route independently for each streamed language", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("This is the English answer.\n\n");
        onChunk("Це українська відповідь.");
        await onDone("This is the English answer.\n\nЦе українська відповідь.");
      },
    );
    (synthesizeSpeech as jest.Mock).mockResolvedValueOnce("/tmp/english.wav");
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onAudioPauseReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onSpeechPauseReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Reply bilingually.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "mistral",
      ttsApiKey: "mistral-test",
      ttsVoice: "voice-123",
      ttsFallbackRoutes: ["native"],
      ttsListenLanguages: ["en", "uk"],
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).toHaveBeenCalledTimes(1);
    expect(synthesizeSpeech).toHaveBeenCalledWith(
      expect.objectContaining({
        speechLanguage: "en",
        text: "This is the English answer.",
      }),
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledWith(
      "/tmp/english.wav",
      expect.objectContaining({ language: "en", mode: "provider" }),
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Це українська відповідь.",
      undefined,
      expect.objectContaining({ language: "uk", mode: "native" }),
    );
    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.any(Error),
      "native",
    );
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("tries provider fallbacks in the configured Kokoro then native order", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("A complete answer.");
      },
    );
    (synthesizeSpeech as jest.Mock)
      .mockRejectedValueOnce(new Error("Provider TTS unavailable"))
      .mockRejectedValueOnce(new Error("Kokoro unavailable"));
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      kokoroVoices: { en: "af_maple", zh: "zf_001" },
      ttsFallbackRoutes: ["kokoro", "native"],
      ttsListenLanguages: ["en"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(
      (synthesizeSpeech as jest.Mock).mock.calls.map(
        ([params]: [{ mode: string }]) => params.mode,
      ),
    ).toEqual(["provider", "kokoro"]);
    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Provider TTS unavailable" }),
      "native",
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onAudioReady).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("stops at the first configured provider fallback that succeeds", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("A complete answer.");
      },
    );
    (synthesizeSpeech as jest.Mock)
      .mockRejectedValueOnce(new Error("Provider TTS unavailable"))
      .mockResolvedValueOnce("/tmp/kokoro.wav");
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "provider",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      kokoroVoices: { en: "af_maple", zh: "zf_001" },
      ttsFallbackRoutes: ["kokoro", "native"],
      ttsListenLanguages: ["en"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Provider TTS unavailable" }),
      "kokoro",
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledWith(
      "/tmp/kokoro.wav",
      expect.objectContaining({ mode: "kokoro" }),
    );
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("uses the configured provider before native when Kokoro is primary", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("A complete answer.");
      },
    );
    (synthesizeSpeech as jest.Mock)
      .mockRejectedValueOnce(new Error("Kokoro unavailable"))
      .mockResolvedValueOnce("/tmp/provider.wav");
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "kokoro",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsModel: "gpt-4o-mini-tts",
      ttsVoice: "alloy",
      kokoroVoices: { en: "af_maple", zh: "zf_001" },
      ttsFallbackRoutes: ["provider", "native"],
      ttsListenLanguages: ["en"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(
      (synthesizeSpeech as jest.Mock).mock.calls.map(
        ([params]: [{ mode: string }]) => params.mode,
      ),
    ).toEqual(["kokoro", "provider"]);
    expect(callbacks.onTtsFallback).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Kokoro unavailable" }),
      "provider",
    );
    expect(callbacks.onAudioReady).toHaveBeenCalledWith(
      "/tmp/provider.wav",
      expect.objectContaining({
        mode: "provider",
        provider: "openai",
      }),
    );
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("does not consult fallback routes when native speech is primary", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("A complete answer.");
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onTtsFallback: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain the issue.",
      messages: [],
      model: "gpt-5.4",
      provider: "openai",
      providerApiKey: "sk-test",
      sttMode: "native",
      ttsMode: "native",
      ttsProvider: "openai",
      ttsApiKey: "sk-test",
      ttsVoice: "alloy",
      ttsFallbackRoutes: ["provider", "kokoro"],
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech).not.toHaveBeenCalled();
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onError).not.toHaveBeenCalled();
  });

  it("injects fresh web search context before the reply request when enabled", async () => {
    (searchWeb as jest.Mock).mockResolvedValueOnce({
      context:
        "Fresh web search context for the user's latest request.\n\nEvidence brief: Wind is moving air.",
      model: "gpt-4.1-mini",
      provider: "openai",
      sources: [{ title: "Britannica", url: "https://example.com/wind" }],
      summary: "Wind is moving air.",
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onDone,
      }: {
        onDone: (
          text: string,
          usage?: undefined,
          metadata?: {
            providerState: {
              mistralAssistantContent: Record<string, unknown>[];
            };
          },
        ) => Promise<void>;
      }) => {
        await onDone("Wind is moving air.", undefined, {
          providerState: {
            mistralAssistantContent: [
              { type: "text", text: "Wind is moving air." },
            ],
          },
        });
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain wind.",
      messages: [],
      model: "claude-opus-4-6",
      provider: "anthropic",
      providerApiKey: "sk-ant-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      webSearchMode: "on",
      webSearchProvider: "openai",
      webSearchApiKey: "sk-openai",
      callbacks,
    });

    expect(searchWeb).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "openai",
        apiKey: "sk-openai",
        query: "Explain wind.",
      }),
    );
    expect(
      (streamChat as jest.Mock).mock.calls[0][0].webSearchContext,
    ).toContain("Wind is moving air.");
    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "Wind is moving air.",
      undefined,
      expect.objectContaining({
        webSearch: expect.objectContaining({
          provider: "openai",
          model: "gpt-4.1-mini",
          query: "Explain wind.",
          summary: "Wind is moving air.",
          sources: [{ title: "Britannica", url: "https://example.com/wind" }],
        }),
        providerState: {
          mistralAssistantContent: [
            { type: "text", text: "Wind is moving air." },
          ],
        },
        turnReceipt: expect.objectContaining({
          webSearch: expect.objectContaining({
            requested: true,
            ready: true,
            used: true,
            fellBack: false,
            provider: "openai",
            model: "gpt-4.1-mini",
          }),
        }),
      }),
    );
  });

  it("continues without web search context when the search step fails", async () => {
    (searchWeb as jest.Mock).mockRejectedValueOnce(
      new Error("Search unavailable."),
    );
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Wind is moving air.");
      },
    );

    const callbacks = {
      onTranscription: jest.fn(),
      onWebSearchStart: jest.fn(),
      onWebSearchComplete: jest.fn(),
      onWebSearchFallback: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };

    await runVoicePipeline({
      transcriptionOverride: "Explain wind.",
      messages: [],
      model: "claude-opus-4-6",
      provider: "anthropic",
      providerApiKey: "sk-ant-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      webSearchMode: "on",
      webSearchProvider: "openai",
      webSearchApiKey: "sk-openai",
      callbacks,
    });

    expect(callbacks.onWebSearchStart).toHaveBeenCalled();
    expect(callbacks.onWebSearchComplete).toHaveBeenCalled();
    expect(callbacks.onWebSearchFallback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Search unavailable.",
      }),
    );
    expect(callbacks.onError).not.toHaveBeenCalled();
    expect(
      (streamChat as jest.Mock).mock.calls[0][0].webSearchContext,
    ).toBeUndefined();
    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "Wind is moving air.",
      undefined,
      expect.objectContaining({
        turnReceipt: expect.objectContaining({
          webSearch: expect.objectContaining({
            requested: true,
            ready: true,
            used: false,
            fellBack: true,
          }),
        }),
      }),
    );
  });

  it("runs web search whenever the mode is on and a provider is ready", async () => {
    (searchWeb as jest.Mock).mockResolvedValueOnce({
      context: "Fresh web context",
      model: "gpt-4.1-mini",
      provider: "openai",
      sources: [],
      summary: "Fresh answer",
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Here is the current update.");
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "What is the latest Claude release?",
      messages: [],
      model: "claude-opus-4-6",
      provider: "anthropic",
      providerApiKey: "sk-ant-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      webSearchMode: "on",
      webSearchProvider: "openai",
      webSearchApiKey: "sk-openai",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(searchWeb).toHaveBeenCalledTimes(1);
  });

  it("skips web search when the mode is off even for fresh prompts", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Photosynthesis turns light into energy.");
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "What is the latest Claude release?",
      messages: [],
      model: "claude-opus-4-6",
      provider: "anthropic",
      providerApiKey: "sk-ant-test",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      webSearchMode: "off",
      webSearchProvider: "openai",
      webSearchApiKey: "sk-openai",
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(searchWeb).not.toHaveBeenCalled();
  });

  it("reuses one web result for private Uber deliberation and the selected final model", async () => {
    (searchWeb as jest.Mock).mockResolvedValueOnce({
      context: "Fresh shared evidence",
      model: "gpt-4.1-mini",
      provider: "openai",
      sources: [],
      summary: "Fresh answer",
    });
    (runUlraModeDeliberation as jest.Mock).mockResolvedValueOnce({
      convergenceReached: false,
      entries: [
        {
          modeId: "mode-1",
          model: "gpt-test",
          participant: 1,
          provider: "openai",
          round: 0,
          text: "First contribution",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 15,
            completionTokens: 5,
            totalTokens: 20,
          },
        },
        {
          modeId: "mode-1",
          model: "gpt-test",
          participant: 1,
          provider: "openai",
          reviewVerdict: "challenge",
          round: 1,
          text: "Reviewed contribution",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 15,
            completionTokens: 5,
            totalTokens: 20,
          },
        },
      ],
      estimatedUsage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 30,
        completionTokens: 10,
        totalTokens: 40,
      },
      failures: [
        {
          message: "rate limited",
          modeId: "mode-2",
          model: "claude-test",
          participant: 2,
          provider: "anthropic",
          round: 1,
        },
      ],
      retiredParticipants: 1,
      roundsCompleted: 1,
      synthesisPrompt: "Private Uber synthesis evidence",
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onDone,
      }: {
        onDone: (
          text: string,
          usage: {
            kind: "reply";
            source: "estimated";
            promptTokens: number;
            completionTokens: number;
            totalTokens: number;
          },
        ) => Promise<void>;
      }) => {
        await onDone("Final answer", {
          kind: "reply",
          source: "estimated",
          promptTokens: 12,
          completionTokens: 8,
          totalTokens: 20,
        });
      },
    );
    const callbacks = {
      onTranscription: jest.fn(),
      onLlmStart: jest.fn(),
      onUlraModeComplete: jest.fn(),
      onChunk: jest.fn(),
      onResponseDone: jest.fn(),
      onAudioReady: jest.fn(),
      onSpeechTextReady: jest.fn(),
      onError: jest.fn(),
    };
    const ulraMode = {
      rounds: 1,
      routes: [
        {
          apiKey: "openai-key",
          modeId: "mode-1",
          model: "gpt-test",
          provider: "openai" as const,
        },
        {
          apiKey: "anthropic-key",
          modeId: "mode-2",
          model: "claude-test",
          provider: "anthropic" as const,
        },
      ],
    };

    await runVoicePipeline({
      transcriptionOverride: "What is new today?",
      messages: [],
      contextSummary:
        "[Conversation response provenance v1]\nThe user previously selected option B.",
      model: "gpt-test",
      provider: "openai",
      providerApiKey: "openai-key",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "Be accurate.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      webSearchMode: "on",
      webSearchProvider: "openai",
      webSearchApiKey: "search-key",
      ulraMode,
      callbacks,
    });

    expect(searchWeb).toHaveBeenCalledTimes(1);
    expect(callbacks.onLlmStart).toHaveBeenCalledTimes(1);
    expect(callbacks.onUlraModeComplete).toHaveBeenCalledWith({
      failedCalls: 1,
      outcome: "retired",
      retiredParticipants: 1,
      successfulCalls: 2,
    });
    expect(runUlraModeDeliberation).toHaveBeenCalledWith(
      expect.objectContaining({
        config: ulraMode,
        conversationSummary:
          "[Conversation response provenance v1]\nThe user previously selected option B.",
        webSearchContext: "Fresh shared evidence",
      }),
    );
    expect(streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-test",
        provider: "openai",
        synthesisContext: "Private Uber synthesis evidence",
        webSearchContext: "Fresh shared evidence",
      }),
    );
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledTimes(1);
    expect(callbacks.onSpeechTextReady).toHaveBeenCalledWith(
      "Final answer",
      undefined,
      expect.objectContaining({
        source: "conversation",
      }),
    );
    expect(callbacks.onResponseDone).toHaveBeenCalledWith(
      "Final answer",
      expect.objectContaining({
        promptTokens: 42,
        completionTokens: 18,
        totalTokens: 60,
      }),
      expect.objectContaining({
        ulraMode: expect.objectContaining({
          convergenceReached: false,
          contributions: expect.arrayContaining([
            expect.objectContaining({
              participant: 1,
              reviewVerdict: "challenge",
            }),
          ]),
          failedCalls: 1,
          retiredParticipants: 1,
          roundsCompleted: 1,
          roundsRequested: 1,
          successfulCalls: 2,
          synthesisContract: "evidence-ledger-v1",
          synthesisContributions: 2,
          synthesisOmittedContributions: 0,
        }),
        notices: [
          expect.objectContaining({
            stage: "ulra",
            level: "warning",
          }),
        ],
      }),
    );
  });

  it("moves Uber synthesis to a successful participant when the selected provider circuit opens", async () => {
    await expect(
      executeProviderModelRequest({
        candidateModels: ["gpt-test"],
        capability: "llm",
        provider: "openai",
        request: jest.fn().mockRejectedValue(
          new ProviderRequestError({
            action: "reply",
            failureKind: "authentication",
            message: "OpenAI key rejected",
            provider: "openai",
            status: 401,
          }),
        ),
        retryDelayMs: 0,
      }),
    ).rejects.toThrow("OpenAI key rejected");
    (runUlraModeDeliberation as jest.Mock).mockResolvedValueOnce({
      convergenceReached: false,
      entries: [
        {
          modeId: "mode-2",
          model: "claude-test",
          participant: 2,
          provider: "anthropic",
          round: 0,
          text: "Fallback contribution",
          usage: {
            kind: "reply",
            source: "estimated",
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
          },
        },
      ],
      estimatedUsage: {
        kind: "reply",
        source: "estimated",
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15,
      },
      failures: [],
      retiredParticipants: 1,
      roundsCompleted: 0,
      synthesisPrompt: "Use the surviving contribution.",
    });
    (streamChat as jest.Mock).mockImplementation(
      async ({ onDone }: { onDone: (text: string) => Promise<void> }) => {
        await onDone("Fallback answer");
      },
    );

    await runVoicePipeline({
      transcriptionOverride: "Please answer.",
      messages: [],
      model: "gpt-test",
      provider: "openai",
      providerApiKey: "openai-key",
      sttMode: "native",
      ttsMode: "native",
      ttsVoice: "alloy",
      replyPlayback: "wait",
      assistantInstructions: "",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      ulraMode: {
        rounds: 1,
        routes: [
          {
            apiKey: "openai-key",
            modeId: "mode-1",
            model: "gpt-test",
            provider: "openai",
          },
          {
            apiKey: "anthropic-key",
            modeId: "mode-2",
            model: "claude-test",
            provider: "anthropic",
          },
        ],
      },
      callbacks: {
        onTranscription: jest.fn(),
        onChunk: jest.fn(),
        onResponseDone: jest.fn(),
        onAudioReady: jest.fn(),
        onSpeechTextReady: jest.fn(),
        onError: jest.fn(),
      },
    });

    expect(streamChat).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "anthropic-key",
        model: "claude-test",
        provider: "anthropic",
      }),
    );
  });
});
