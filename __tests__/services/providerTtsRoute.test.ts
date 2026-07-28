import { synthesizeProviderSpeech } from "../../src/services/tts/providerRoute";

global.fetch = jest.fn();

jest.mock("expo-file-system/legacy", () => ({
  cacheDirectory: "/tmp/",
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
}));

class MockFileReader {
  public result: string | ArrayBuffer | null = null;
  public onloadend: (() => void) | null = null;
  public onerror: (() => void) | null = null;

  readAsDataURL() {
    this.result = "data:audio/wav;base64,ZmFrZQ==";
    this.onloadend?.();
  }
}

Object.defineProperty(global, "FileReader", {
  value: MockFileReader,
  writable: true,
});

describe("synthesizeProviderSpeech", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("upgrades DashScope's HTTP result URL before downloading the wav file", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            output: {
              audio: {
                url: "http://dashscope.example/audio.wav",
              },
            },
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    const result = await synthesizeProviderSpeech({
      text: "Hello world",
      voice: "",
      provider: "alibaba-qwen-dashscope",
      apiKey: "dashscope-test",
      language: "en",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.wav$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
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

  it("uses the merged xAI grok-speech route with the documented payload", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    const result = await synthesizeProviderSpeech({
      text: "Hello world",
      voice: "Eve",
      provider: "xai",
      apiKey: "xai-test",
      language: "en",
      speechLanguage: "pt-BR",
    });

    expect(result).toMatch(/^\/tmp\/tts-.*\.mp3$/);
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.x.ai/v1/tts");
    const body = JSON.parse(options.body);
    expect(body.text).toBe("Hello world");
    expect(body.voice_id).toBe("Eve");
    expect(body.language).toBe("pt-BR");
    expect(body.output_format).toBeUndefined();
  });

  it("omits ElevenLabs language_code only for multilingual v2", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["fake-audio"])),
    });

    await synthesizeProviderSpeech({
      text: "Привіт",
      voice: "voice-123",
      provider: "elevenlabs",
      providerModel: "eleven_flash_v2_5",
      apiKey: "elevenlabs-test",
      language: "uk",
      speechLanguage: "uk",
    });
    await synthesizeProviderSpeech({
      text: "Привіт",
      voice: "voice-123",
      provider: "elevenlabs",
      providerModel: "eleven_multilingual_v2",
      apiKey: "elevenlabs-test",
      language: "uk",
      speechLanguage: "uk",
    });

    expect(JSON.parse((fetch as jest.Mock).mock.calls[0][1].body)).toEqual({
      text: "Привіт",
      model_id: "eleven_flash_v2_5",
      language_code: "uk",
    });
    expect(JSON.parse((fetch as jest.Mock).mock.calls[1][1].body)).toEqual({
      text: "Привіт",
      model_id: "eleven_multilingual_v2",
    });
  });

  it("rejects a provider language that is not supported before fetching", async () => {
    await expect(
      synthesizeProviderSpeech({
        text: "Привіт",
        voice: "voice-123",
        provider: "mistral",
        apiKey: "mistral-test",
        language: "en",
        speechLanguage: "uk",
      }),
    ).rejects.toThrow(
      "Mistral does not officially support Ukrainian for this speech route.",
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it("retries xAI TTS after a transient server failure", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        text: () => Promise.resolve("Service temporarily unavailable"),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    await expect(
      synthesizeProviderSpeech({
        text: "Please retry this speech.",
        voice: "eve",
        provider: "xai",
        apiKey: "xai-test",
        language: "en",
      }),
    ).resolves.toMatch(/^\/tmp\/tts-.*\.mp3$/);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("retries one provider TTS timeout", async () => {
    const timeoutAbort = new Error("The request was aborted");
    timeoutAbort.name = "AbortError";
    (fetch as jest.Mock)
      .mockRejectedValueOnce(timeoutAbort)
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    await expect(
      synthesizeProviderSpeech({
        text: "Please retry this timed-out speech.",
        voice: "eve",
        provider: "xai",
        apiKey: "xai-test",
        language: "en",
      }),
    ).resolves.toMatch(/^\/tmp\/tts-.*\.mp3$/);

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not retry a permanent xAI authentication failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Invalid API key"),
    });

    await expect(
      synthesizeProviderSpeech({
        text: "Do not retry this speech.",
        voice: "eve",
        provider: "xai",
        apiKey: "invalid-xai-test",
        language: "en",
      }),
    ).rejects.toThrow();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries a transient DashScope audio download failure", async () => {
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
        ok: false,
        status: 500,
        text: () => Promise.resolve("Temporary download failure"),
      })
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-audio"])),
      });

    await expect(
      synthesizeProviderSpeech({
        text: "Please retry this download.",
        voice: "Cherry",
        provider: "alibaba-qwen-dashscope",
        apiKey: "dashscope-test",
        language: "en",
      }),
    ).resolves.toMatch(/^\/tmp\/tts-.*\.wav$/);

    expect(fetch).toHaveBeenCalledTimes(3);
    expect((fetch as jest.Mock).mock.calls[1][0]).toBe(
      "https://dashscope.example/audio.wav",
    );
    expect((fetch as jest.Mock).mock.calls[2][0]).toBe(
      "https://dashscope.example/audio.wav",
    );
  });
});
