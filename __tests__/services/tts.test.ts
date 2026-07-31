jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(async () => undefined),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(async () => null),
  removeItem: jest.fn(async () => undefined),
  setItem: jest.fn(async () => undefined),
}));

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "file:///tmp/",
  documentDirectory: "file:///tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false, isDirectory: false })),
  makeDirectoryAsync: jest.fn(async () => undefined),
  moveAsync: jest.fn(async () => undefined),
  readAsStringAsync: jest.fn(async () => ""),
  writeAsStringAsync: jest.fn(async () => undefined),
}));

import {
  getProviderTtsTimeoutMs,
  getProviderTtsTargetChunkChars,
  PROVIDER_TTS_MAX_TIMEOUT_MS,
  PROVIDER_TTS_TIMEOUT_MS,
  PROVIDER_TTS_MAX_INPUT_CHARS,
  splitIntoSentences,
  splitTextForTts,
  clearProviderTtsAudioCacheForTests,
  synthesizeSpeech,
  synthesizeSpeechSequence,
  TtsRequestError,
} from "../../src/services/tts";
import { resetProviderModelHealthForTests } from "../../src/services/providerResilience";
import {
  getRuntimeCapabilityOverrides,
  RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY,
  resetRuntimeCapabilityOverridesForTests,
} from "../../src/services/runtimeCapabilityOverrides";
import AsyncStorage from "@react-native-async-storage/async-storage";

global.fetch = jest.fn();

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "/tmp/",
  deleteAsync: jest.fn(async () => undefined),
  getInfoAsync: jest.fn(async () => ({ exists: false, isDirectory: false })),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
}));

import * as FileSystem from "expo-file-system/legacy";

class MockFileReader {
  public result: string | ArrayBuffer | null = null;
  public onloadend: (() => void) | null = null;
  public onerror: (() => void) | null = null;

  readAsDataURL() {
    this.result = "data:audio/mpeg;base64,ZmFrZQ==";
    this.onloadend?.();
  }
}

Object.defineProperty(global, "FileReader", {
  value: MockFileReader,
  writable: true,
});

describe("splitIntoSentences", () => {
  it("returns an empty array for an empty string", () => {
    expect(splitIntoSentences("")).toEqual([]);
  });

  it("splits a single sentence ending with a period", () => {
    expect(splitIntoSentences("Hello world.")).toEqual(["Hello world."]);
  });

  it("splits multiple sentences with different terminators", () => {
    expect(splitIntoSentences("Hi. How are you? Great!\nBye")).toEqual([
      "Hi.",
      " How are you?",
      " Great!",
      "\n",
      "Bye",
    ]);
  });

  it("returns the full text as a single element when there is no sentence boundary", () => {
    expect(splitIntoSentences("no punctuation here")).toEqual([
      "no punctuation here",
    ]);
  });

  it("handles text with only whitespace", () => {
    expect(splitIntoSentences("   ")).toEqual(["   "]);
  });

  it("handles consecutive terminators", () => {
    expect(splitIntoSentences("Wait...")).toEqual(["Wait..."]);
  });

  it("does not split domains, decimals, or dotted abbreviations", () => {
    expect(
      splitIntoSentences("Visit x.ai. Version 1.2 works in the U.S."),
    ).toEqual(["Visit x.ai.", " Version 1.2 works in the U.S."]);
  });
});

describe("splitTextForTts", () => {
  it("returns an empty array for an empty string", () => {
    expect(splitTextForTts("")).toEqual([]);
  });

  it("returns an empty array for whitespace-only input", () => {
    expect(splitTextForTts("   ")).toEqual([]);
  });

  it("returns a single chunk for short text", () => {
    expect(splitTextForTts("Hello world.")).toEqual(["Hello world."]);
  });

  it("groups sentences together up to the max chars limit", () => {
    const chunks = splitTextForTts("Short. Also short.", 30);
    expect(chunks).toEqual(["Short. Also short."]);
  });

  it("splits into multiple chunks when text exceeds max chars", () => {
    const sentence = "Word. ";
    const text = sentence.repeat(100);
    const chunks = splitTextForTts(text, 20);

    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(20);
    }
  });

  it("uses the default max chars constant when none is provided", () => {
    const longText = "Sentence. ".repeat(500);
    const chunks = splitTextForTts(longText);

    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(PROVIDER_TTS_MAX_INPUT_CHARS);
    }
  });

  it("handles a single very long word by splitting it into fixed-size chunks", () => {
    const longWord = "a".repeat(50);
    const chunks = splitTextForTts(longWord, 20);

    expect(chunks.length).toBe(3);
    expect(chunks[0]).toBe("a".repeat(20));
    expect(chunks[1]).toBe("a".repeat(20));
    expect(chunks[2]).toBe("a".repeat(10));
  });

  it("normalizes internal whitespace", () => {
    const chunks = splitTextForTts("Hello   world.   Goodbye   world.");
    expect(chunks).toEqual(["Hello world. Goodbye world."]);
  });

  it("keeps domains intact while normalizing TTS text", () => {
    expect(splitTextForTts("Visit x.ai. It works.")).toEqual([
      "Visit x.ai. It works.",
    ]);
  });
});

describe("synthesizeSpeech", () => {
  beforeEach(async () => {
    await AsyncStorage.removeItem(RUNTIME_CAPABILITY_OVERRIDES_STORAGE_KEY);
    jest.clearAllMocks();
    clearProviderTtsAudioCacheForTests();
    resetProviderModelHealthForTests();
    resetRuntimeCapabilityOverridesForTests();
  });

  it("generates a local Android dev WAV for the exact fake provider key", async () => {
    const result = await synthesizeSpeech({
      text: "Hello local audio",
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      apiKey: "sk-test-android-local-dev",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.wav$/);
    expect(fetch).not.toHaveBeenCalled();
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledTimes(1);
    expect(
      (FileSystem.writeAsStringAsync as jest.Mock).mock.calls[0][1],
    ).toMatch(/^UklGR/);
  });

  it("calls the configured provider TTS API and returns a cached file path", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    const result = await synthesizeSpeech({
      text: "Hello world",
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      apiKey: "sk-test",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/audio/speech");
    expect(options.method).toBe("POST");
    const body = JSON.parse(options.body);
    expect(body.model).toBe("gpt-4o-mini-tts");
    expect(body.voice).toBe("alloy");
    expect(body.input).toBe("Hello world");
  });

  it("reuses successful provider audio for an identical synthesis request", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      exists: true,
      isDirectory: false,
      size: 10,
    });
    const request = {
      text: "Cache this spoken reply.",
      voice: "alloy",
      mode: "provider" as const,
      provider: "openai" as const,
      providerModel: "gpt-4o-mini-tts",
      apiKey: "sk-test",
      instructions: "Speak clearly.",
      language: "en" as const,
    };

    const first = await synthesizeSpeech(request);
    const second = await synthesizeSpeech(request);

    expect(second).toBe(first);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(FileSystem.getInfoAsync).toHaveBeenCalledWith(first);
  });

  it("uses another model from the same TTS provider when the selected model is unavailable", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () =>
          JSON.stringify({
            error: {
              message: "The model tts-1-hd is no longer available.",
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    await synthesizeSpeech({
      text: "Hello world",
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      providerModel: "tts-1-hd",
      apiKey: "sk-test",
      language: "en",
    });

    expect(
      (fetch as jest.Mock).mock.calls.map(
        ([, options]) => JSON.parse(options.body).model,
      ),
    ).toEqual(["tts-1-hd", "gpt-4o-mini-tts"]);
    expect(getRuntimeCapabilityOverrides()).toEqual([
      expect.objectContaining({
        capability: "tts",
        model: "tts-1-hd",
        provider: "openai",
        reason: "model-unavailable",
      }),
    ]);
  });

  it("sends delivery instructions to instruction-capable OpenAI TTS models", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeSpeech({
      text: "Hello world",
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      providerModel: "gpt-4o-mini-tts",
      apiKey: "sk-test",
      instructions: "Speak warmly and with a relaxed pace.",
      language: "en",
    });

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.instructions).toBe("Speak warmly and with a relaxed pace.");
  });

  it("does not send unsupported instructions to legacy OpenAI TTS models", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeSpeech({
      text: "Hello world",
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      providerModel: "tts-1",
      apiKey: "sk-test",
      instructions: "Speak warmly.",
      language: "en",
    });

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.instructions).toBeUndefined();
  });

  it("throws when provider mode is selected without a provider", async () => {
    await expect(
      synthesizeSpeech({
        text: "Test",
        voice: "alloy",
        mode: "provider",
        language: "en",
      }),
    ).rejects.toThrow("Choose a text-to-speech provider");
  });

  it("uses Gemini TTS and writes a wav file", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      mimeType: "audio/L16;rate=24000",
                      data: "AQACAAMABAA=",
                    },
                  },
                ],
              },
            },
          ],
        }),
    });

    const result = await synthesizeSpeech({
      text: "Hallo Welt",
      voice: "Aoede",
      mode: "provider",
      provider: "gemini",
      apiKey: "gemini-test-key",
      language: "de",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.wav$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent",
    );
    expect(options.headers["x-goog-api-key"]).toBe("gemini-test-key");
    const body = JSON.parse(options.body);
    expect(
      body.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig
        .voiceName,
    ).toBe("Aoede");
  });

  it("adds delivery instructions to Gemini's performance prompt", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          candidates: [
            {
              content: {
                parts: [
                  {
                    inlineData: {
                      mimeType: "audio/L16;rate=24000",
                      data: "AQACAAMABAA=",
                    },
                  },
                ],
              },
            },
          ],
        }),
    });

    await synthesizeSpeech({
      text: "Hallo Welt",
      voice: "Aoede",
      mode: "provider",
      provider: "gemini",
      apiKey: "gemini-test-key",
      instructions: "Use a calm, reassuring delivery.",
      language: "de",
    });

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    const prompt = body.contents[0].parts[0].text;
    expect(prompt).toContain(
      "Performance instructions:\nUse a calm, reassuring delivery.",
    );
    expect(prompt).toContain("Transcript:\nHallo Welt");
  });

  it("uses DashScope TTS and downloads the generated wav file", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            output: {
              audio: {
                url: "https://dashscope.example/audio.wav",
              },
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    const result = await synthesizeSpeech({
      text: "Hello world",
      voice: "",
      mode: "provider",
      provider: "alibaba-qwen-dashscope",
      apiKey: "dashscope-test|beijing",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.wav$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
    );
    const body = JSON.parse(options.body);
    expect(body.model).toBe("qwen3-tts-flash");
    expect(body.input.voice).toBe("Cherry");
    expect(body.input.text).toBe("Hello world");
    expect(body.input.language_type).toBe("English");
    expect((fetch as jest.Mock).mock.calls[1][0]).toBe(
      "https://dashscope.example/audio.wav",
    );
  });

  it("sends instructions only to Qwen's instruct TTS model", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            output: {
              audio: {
                url: "https://dashscope.example/audio.wav",
              },
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    await synthesizeSpeech({
      text: "Hello world",
      voice: "Cherry",
      mode: "provider",
      provider: "alibaba-qwen-dashscope",
      providerModel: "qwen3-tts-instruct-flash",
      apiKey: "dashscope-test|beijing",
      instructions: "Sound optimistic and energetic.",
      language: "en",
    });

    const body = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
    expect(body.input.instructions).toBe("Sound optimistic and energetic.");
  });

  it("rejects Qwen TTS when the credential belongs to the US region", async () => {
    await expect(
      synthesizeSpeech({
        text: "Hello world",
        voice: "Cherry",
        mode: "provider",
        provider: "alibaba-qwen-dashscope",
        apiKey: "dashscope-test|us",
        language: "en",
      }),
    ).rejects.toThrow("not available in the US region");

    expect(fetch).not.toHaveBeenCalled();
  });

  it("retries Gemini TTS after a transient transport failure", async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error("Network request failed"))
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      inlineData: {
                        mimeType: "audio/L16;rate=24000",
                        data: "AQACAAMABAA=",
                      },
                    },
                  ],
                },
              },
            ],
          }),
      });

    const result = await synthesizeSpeech({
      text: "Retry this once",
      voice: "Kore",
      mode: "provider",
      provider: "gemini",
      apiKey: "gemini-test-key",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.wav$/);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("rethrows when provider synthesis fails", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("provider failure"));

    await expect(
      synthesizeSpeech({
        text: "Ich glaube, das ist die richtige Antwort.",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
        listenLanguages: ["de"],
      }),
    ).rejects.toThrow("provider failure");
  });

  it("calls the merged xAI grok-speech TTS route with provider-specific fields", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    const result = await synthesizeSpeech({
      text: "Hello world",
      voice: "leo",
      mode: "provider",
      provider: "xai",
      apiKey: "xai-test",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.mp3$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.x.ai/v1/tts");
    const body = JSON.parse(options.body);
    expect(body.text).toBe("Hello world");
    expect(body.voice_id).toBe("leo");
    expect(body.language).toBe("en");
    expect(body.output_format).toBeUndefined();
  });

  it("calls Mistral Voxtral TTS with a saved voice slug", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ audio_data: "ZmFrZQ==" }),
    });

    const result = await synthesizeSpeech({
      text: "Hallo Welt",
      voice: "voice-123",
      mode: "provider",
      provider: "mistral",
      providerModel: "voxtral-mini-tts-2603",
      apiKey: "mistral-test-key",
      language: "de",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.mp3$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.mistral.ai/v1/audio/speech");
    expect(options.headers.Authorization).toBe("Bearer mistral-test-key");
    expect(JSON.parse(options.body)).toEqual({
      model: "voxtral-mini-tts-2603",
      input: "Hallo Welt",
      voice_id: "voice-123",
      response_format: "mp3",
    });
  });

  it("rejects Mistral speech locally when no voice slug is saved", async () => {
    await expect(
      synthesizeSpeech({
        text: "Hallo Welt",
        voice: "",
        mode: "provider",
        provider: "mistral",
        apiKey: "mistral-test-key",
        language: "en",
      }),
    ).rejects.toThrow(
      "Refresh the Mistral voice library or enter a voice ID before using speech output.",
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("calls ElevenLabs TTS with its account voice and API-key header", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    const result = await synthesizeSpeech({
      text: "Hello ElevenLabs",
      voice: "voice/account id",
      mode: "provider",
      provider: "elevenlabs",
      providerModel: "eleven_flash_v2_5",
      apiKey: "elevenlabs-test-key",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.mp3$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://api.elevenlabs.io/v1/text-to-speech/voice%2Faccount%20id?output_format=mp3_44100_128",
    );
    expect(options.headers).toEqual({
      "Content-Type": "application/json",
      "xi-api-key": "elevenlabs-test-key",
    });
    expect(JSON.parse(options.body)).toEqual({
      text: "Hello ElevenLabs",
      model_id: "eleven_flash_v2_5",
      language_code: "en",
    });
  });

  it("gives split ElevenLabs generations adjacent prosody context", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeSpeech({
      text: "This is the current segment.",
      previousText: "This came immediately before.",
      nextText: "This follows immediately after.",
      voice: "voice-123",
      mode: "provider",
      provider: "elevenlabs",
      providerModel: "eleven_flash_v2_5",
      apiKey: "elevenlabs-test-key",
      language: "en",
    });

    expect(JSON.parse((fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
      text: "This is the current segment.",
      model_id: "eleven_flash_v2_5",
      language_code: "en",
      previous_text: "This came immediately before.",
      next_text: "This follows immediately after.",
    });
  });

  it("does not send unsupported request-stitching context to Eleven v3", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeSpeech({
      text: "An expressive current segment.",
      previousText: "Earlier context.",
      nextText: "Later context.",
      voice: "voice-123",
      mode: "provider",
      provider: "elevenlabs",
      providerModel: "eleven_v3",
      apiKey: "elevenlabs-test-key",
      language: "en",
    });

    expect(JSON.parse((fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
      text: "An expressive current segment.",
      model_id: "eleven_v3",
      language_code: "en",
    });
  });

  it("uses a built-in ElevenLabs voice when account voice access is unavailable", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeSpeech({
      text: "Hello ElevenLabs",
      voice: "",
      mode: "provider",
      provider: "elevenlabs",
      apiKey: "elevenlabs-test-key",
      language: "en",
    });

    expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM?output_format=mp3_44100_128",
    );
  });

  it("splits long provider speech into multiple synthesis requests", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    const segments = await synthesizeSpeechSequence({
      text: `${"Sentence one. ".repeat(400)}Sentence two.`,
      voice: "alloy",
      mode: "provider",
      provider: "openai",
      apiKey: "sk-test",
      language: "en",
    });

    expect(segments.length).toBeGreaterThan(1);
    expect((fetch as jest.Mock).mock.calls.length).toBeGreaterThan(1);
  });

  it("surfaces a readable long-input TTS error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            error: {
              message: "String should have at most 4096 characters",
              type: "invalid_request_error",
              code: "string_too_long",
            },
          }),
        ),
    });

    await expect(
      synthesizeSpeech({
        text: "Hello world",
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
      }),
    ).rejects.toEqual(
      expect.objectContaining<TtsRequestError>({
        name: "TtsRequestError",
        inputTooLong: true,
        message:
          "OpenAI speech output rejected the reply because it was too long.",
      }),
    );
  });

  it("times out a hanging provider TTS request with a readable error", async () => {
    jest.useFakeTimers();
    try {
      (fetch as jest.Mock).mockImplementation(
        () => new Promise(() => undefined),
      );
      const text = "Hello world";

      const pending = synthesizeSpeech({
        text,
        voice: "alloy",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
      });
      const expectation = expect(pending).rejects.toThrow(
        "OpenAI speech output took too long.",
      );

      await jest.advanceTimersByTimeAsync(
        getProviderTtsTimeoutMs(text, "openai") + 1,
      );
      await jest.advanceTimersByTimeAsync(401);
      await jest.advanceTimersByTimeAsync(
        getProviderTtsTimeoutMs(text, "openai") + 1,
      );

      await expectation;
    } finally {
      jest.useRealTimers();
    }
  });

  it("scales provider TTS timeout with reply length up to a cap", () => {
    expect(getProviderTtsTimeoutMs("short")).toBeGreaterThan(
      PROVIDER_TTS_TIMEOUT_MS,
    );
    expect(getProviderTtsTimeoutMs("x".repeat(10000))).toBe(
      PROVIDER_TTS_MAX_TIMEOUT_MS,
    );
  });

  it("uses provider-specific TTS chunk targets", () => {
    expect(getProviderTtsTargetChunkChars("gemini")).toBe(600);
    expect(getProviderTtsTargetChunkChars("alibaba-qwen-dashscope")).toBe(550);
    expect(getProviderTtsTargetChunkChars("openai")).toBe(600);
    expect(getProviderTtsTargetChunkChars("xai")).toBe(240);
  });

  it("gives slower provider TTS routes realistic timeout budgets", () => {
    const text = "x".repeat(600);

    expect(getProviderTtsTimeoutMs(text, "openai")).toBe(32000);
    expect(getProviderTtsTimeoutMs(text, "gemini")).toBe(60000);
    expect(getProviderTtsTimeoutMs(text, "alibaba-qwen-dashscope")).toBe(42000);
    expect(getProviderTtsTimeoutMs(text, "xai")).toBe(48000);
  });
});
