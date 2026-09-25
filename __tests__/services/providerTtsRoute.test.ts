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

});
