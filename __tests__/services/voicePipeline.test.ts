import { runVoicePipeline } from "../../src/services/voicePipeline";
import { splitIntoSentences } from "../../src/services/tts";
import { transcribeAudio } from "../../src/services/whisper";
import { searchWeb } from "../../src/services/webSearch";
import {
  streamChat,
  summarizeConversationContext,
} from "../../src/services/llm";
import { synthesizeSpeech } from "../../src/services/tts";

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
    (summarizeConversationContext as jest.Mock).mockResolvedValue({
      summary: "",
      usage: undefined,
    });
    (searchWeb as jest.Mock).mockResolvedValue(null);
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
      model: "llama-3.3-70b-versatile",
      provider: "groq",
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
      model: "llama-3.3-70b-versatile",
      provider: "groq",
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
      undefined,
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

  it("speaks a completed sentence immediately in stream mode", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Wind is moving air.");
        await Promise.resolve();
        expect(events).toEqual(["speak:Wind is moving air."]);
        await onDone("Wind is moving air.");
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
      model: "llama-3.3-70b-versatile",
      provider: "groq",
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
    expect(events).toEqual(["speak:Wind is moving air.", "response-done"]);
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
        onChunk("Sentence one. Sentence two.");
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

  it("speaks each provider TTS chunk in stream mode", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("Sentence one.");
        onChunk(" Sentence two.");
        await onDone("Sentence one. Sentence two.");
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
        text: "Sentence one.",
        mode: "provider",
        provider: "gemini",
        providerModel: "gemini-2.5-flash-preview-tts",
        apiKey: "gemini-test",
      }),
    );
    expect(synthesizeSpeech).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        text: "Sentence two.",
        mode: "provider",
        provider: "gemini",
        providerModel: "gemini-2.5-flash-preview-tts",
        apiKey: "gemini-test",
      }),
    );
    expect(callbacks.onTtsFallback).not.toHaveBeenCalled();
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(2);
    expect(callbacks.onSpeechTextReady).not.toHaveBeenCalled();
  });

  it("starts synthesizing each completed follow-up sentence before the reply ends", async () => {
    (synthesizeSpeech as jest.Mock).mockResolvedValue("/tmp/tts.wav");
    (streamChat as jest.Mock).mockImplementation(
      async ({ onChunk }: { onChunk: (text: string) => void }) => {
        onChunk("Sentence one.");
        await Promise.resolve();
        await Promise.resolve();
        expect(synthesizeSpeech).toHaveBeenCalledTimes(1);

        onChunk(" Sentence two.");
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

  it("prefetches provider speech while preserving sentence playback order", async () => {
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
        onChunk("Sentence one.");
        onChunk(" Sentence two.");
        await Promise.resolve();
        await Promise.resolve();

        expect(synthesizeSpeech).toHaveBeenCalledTimes(2);

        resolveSecond("/tmp/tts-2.wav");
        await Promise.resolve();
        expect(audioEvents).toEqual([]);

        resolveFirst("/tmp/tts-1.wav");
        await onDone("Sentence one. Sentence two.");
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

  it("flushes a trailing partial sentence for provider TTS when the stream finishes", async () => {
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onChunk,
        onDone,
      }: {
        onChunk: (text: string) => void;
        onDone: (text: string) => Promise<void>;
      }) => {
        onChunk("One. Two");
        await onDone("One. Two");
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
    expect(callbacks.onAudioReady).toHaveBeenCalledTimes(
      synthesisCalls.length,
    );
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

    expect(audioEvents).toEqual([
      "/tmp/provider-1.wav",
      "/tmp/provider-2.wav",
    ]);
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
    expect(synthesizeSpeech).toHaveBeenCalledTimes(2);
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
      replyPlayback: "stream",
      assistantInstructions: "You are a voice assistant.",
      responseLength: "normal",
      responseTone: "professional",
      language: "en",
      callbacks,
    });

    expect(synthesizeSpeech.mock.calls.length).toBeGreaterThanOrEqual(2);
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
              mistralAssistantContent: Array<Record<string, unknown>>;
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
    expect((streamChat as jest.Mock).mock.calls[0][0].webSearchContext).toContain(
      "Wind is moving air.",
    );
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
      }),
    );
  });

  it("continues without web search context when the search step fails", async () => {
    (searchWeb as jest.Mock).mockRejectedValueOnce(new Error("Search unavailable."));
    (streamChat as jest.Mock).mockImplementation(
      async ({
        onDone,
      }: {
        onDone: (text: string) => Promise<void>;
      }) => {
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
    expect((streamChat as jest.Mock).mock.calls[0][0].webSearchContext).toBeUndefined();
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
});
