import * as FileSystem from "expo-file-system/legacy";
import { transcribeAudio } from "../../src/services/whisper";
import { getProviderSttTimeoutMs } from "../../src/services/whisper/config";
import { resetProviderModelHealthForTests } from "../../src/services/providerResilience";

global.fetch = jest.fn();

jest.mock("../../src/services/whisper/recordedFileReady", () => ({
  waitForRecordedFileReady: jest.fn(() => Promise.resolve()),
}));

const OriginalWebSocket = (globalThis as any).WebSocket;

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  readonly url: string;
  readonly protocols: any;
  readonly options: any;
  readonly sent: any[] = [];
  onopen: ((event: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onclose: ((event: any) => void) | null = null;

  constructor(url: string, protocols?: any, options?: any) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    MockWebSocket.instances.push(this);
  }

  send(data: any) {
    this.sent.push(data);
  }

  close() {
    this.onclose?.({ code: 1000, reason: "closed" });
  }

  emitOpen() {
    this.onopen?.({});
  }

  emitMessage(data: any) {
    this.onmessage?.({
      data: typeof data === "string" ? data : JSON.stringify(data),
    });
  }
}

function mockBuildTestWavBase64() {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const dataLength = 6400;

  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 64000, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 32, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, dataLength, true);

  const wav = new Uint8Array(44 + dataLength);
  wav.set(new Uint8Array(header), 0);

  return Buffer.from(wav).toString("base64");
}

async function waitForMockSocket() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const socket = MockWebSocket.instances[0];

    if (socket) {
      return socket;
    }

    await Promise.resolve();
  }

  throw new Error("Expected realtime STT socket to be created.");
}

jest.mock("expo-file-system/legacy", () => ({
  readAsStringAsync: jest.fn((fileUri: string) =>
    Promise.resolve(
      fileUri.endsWith(".wav") ? mockBuildTestWavBase64() : "ZmFrZQ==",
    ),
  ),
  getInfoAsync: jest.fn(() =>
    Promise.resolve({
      exists: true,
      size: 8192,
    }),
  ),
}));

jest.mock("expo-file-system", () => ({
  File: class MockFile {
    static createdUris: string[] = [];

    readonly name: string;
    readonly type: string;
    readonly uri: string;

    constructor(fileUri: string) {
      MockFile.createdUris.push(fileUri);
      this.uri = fileUri;
      this.name = fileUri.split("/").pop() || "recording.m4a";
      this.type = fileUri.endsWith(".wav") ? "audio/wav" : "audio/m4a";
    }

    bytes() {
      return Promise.resolve(new Uint8Array([1, 2, 3]));
    }
  },
}));

describe("transcribeAudio", () => {
  beforeAll(() => {
    (globalThis as any).WebSocket = MockWebSocket;
  });

  afterAll(() => {
    (globalThis as any).WebSocket = OriginalWebSocket;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    resetProviderModelHealthForTests();
    MockWebSocket.instances = [];
    require("expo-file-system").File.createdUris.length = 0;
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      exists: true,
      size: 8192,
    });
  });

  it("uses a shorter STT timeout budget for OpenAI than the generic provider default", () => {
    expect(getProviderSttTimeoutMs("openai")).toBe(45000);
    expect(getProviderSttTimeoutMs("mistral")).toBe(60000);
  });

  it("returns a human-readable rate limit error for provider STT", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 429,
      text: async () =>
        JSON.stringify({
          error: {
            message: "Rate limit exceeded",
          },
        }),
    });

    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
      }),
    ).rejects.toThrow(
      "OpenAI is rate limiting speech transcription right now. Try again in a moment.",
    );
  });

  it("returns a human-readable network error for provider STT", async () => {
    (fetch as jest.Mock).mockRejectedValue(
      new TypeError("Network request failed"),
    );

    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "mistral",
        apiKey: "mistral-test",
        language: "en",
      }),
    ).rejects.toThrow(
      "Couldn't reach Mistral for speech transcription. Check the connection and try again.",
    );
  });

  it("uses the configured multipart endpoint for newly wired STT providers", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        text: "Hallo Welt",
      }),
    });

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "mistral",
      apiKey: "mistral-test",
      language: "en",
      speechLanguage: "de",
    });

    expect(result).toBe("Hallo Welt");
    const [url] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.mistral.ai/v1/audio/transcriptions");
    const [, options] = (fetch as jest.Mock).mock.calls[0];
    expect(Array.from((options.body as FormData).entries())).toEqual(
      expect.arrayContaining([["language", "de"]]),
    );
  });

  it("uses ElevenLabs Scribe v2 with its multipart field and API-key header", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        text: "Hello from ElevenLabs",
      }),
    });

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "elevenlabs",
      apiKey: "elevenlabs-test",
      language: "en",
    });

    expect(result).toBe("Hello from ElevenLabs");
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.elevenlabs.io/v1/speech-to-text");
    expect(options.headers).toEqual({
      "xi-api-key": "elevenlabs-test",
    });
    expect(Array.from((options.body as FormData).entries())).toEqual(
      expect.arrayContaining([["model_id", "scribe_v2"]]),
    );
    expect(require("expo-file-system").File.createdUris).toEqual([
      "/tmp/recording.m4a",
    ]);
  });

  it("enables diarized output and automatic chunking for OpenAI diarization", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Speaker-aware transcript" }),
    });

    await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "openai",
      providerModel: "gpt-4o-transcribe-diarize",
      apiKey: "sk-test",
      language: "en",
    });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    const parts = Array.from((options.body as FormData).entries());

    expect(parts).toEqual(
      expect.arrayContaining([
        ["model", "gpt-4o-transcribe-diarize"],
        ["response_format", "diarized_json"],
        ["chunking_strategy", "auto"],
      ]),
    );
  });

  it("uses Gemini audio input for STT with an AI Studio key", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Hello from Gemini STT" }],
            },
          },
        ],
      }),
    });

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "gemini",
      providerModel: "gemini-3.5-flash",
      apiKey: "gemini-test-key",
      language: "de",
    });

    expect(result).toBe("Hello from Gemini STT");
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
    );
    expect(options.headers["x-goog-api-key"]).toBe("gemini-test-key");
    expect(JSON.parse(options.body)).toEqual(
      expect.objectContaining({
        contents: [
          expect.objectContaining({
            parts: expect.arrayContaining([
              expect.objectContaining({
                inlineData: {
                  mimeType: "audio/m4a",
                  data: "ZmFrZQ==",
                },
              }),
            ]),
          }),
        ],
      }),
    );
  });

  it("retries an overloaded Gemini STT model and falls back to another audio-capable model", async () => {
    const overloadedResponse = {
      ok: false,
      status: 503,
      text: async () =>
        JSON.stringify({
          error: {
            message: "The model is experiencing high demand.",
          },
        }),
    };
    (fetch as jest.Mock)
      .mockResolvedValueOnce(overloadedResponse)
      .mockResolvedValueOnce(overloadedResponse)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: "Recovered transcription" }],
              },
            },
          ],
        }),
      });
    const onModelResolved = jest.fn();

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.wav",
      mode: "provider",
      provider: "gemini",
      providerModel: "gemini-3.5-flash",
      apiKey: "gemini-test-key",
      language: "en",
      onModelResolved,
    });

    expect(result).toBe("Recovered transcription");
    expect((fetch as jest.Mock).mock.calls.map(([url]) => url)).toEqual([
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    ]);
    expect(onModelResolved).toHaveBeenCalledWith("gemini-3.6-flash");
  });

  it("uses the xAI standalone REST STT endpoint for recorded audio", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Hello from xAI STT" }),
    });

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "xai",
      providerModel: "grok-stt",
      apiKey: "xai-test",
      language: "en",
      speechLanguage: "en",
    });

    expect(result).toBe("Hello from xAI STT");
    expect(MockWebSocket.instances).toHaveLength(0);

    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe("https://api.x.ai/v1/stt");
    expect(options.headers.Authorization).toBe("Bearer xai-test");
    const parts = Array.from((options.body as FormData).entries());

    expect(parts.slice(0, 2)).toEqual([
      ["format", "true"],
      ["language", "en"],
    ]);
    expect(parts[2][0]).toBe("file");
  });

  it("lets xAI auto-detect STT without forcing formatting or a language", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ text: "Auto-detected speech" }),
    });

    await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "xai",
      providerModel: "grok-stt",
      apiKey: "xai-test",
      language: "en",
      speechLanguage: "auto",
    });

    const [, options] = (fetch as jest.Mock).mock.calls[0];
    const parts = Array.from((options.body as FormData).entries());
    expect(parts.map(([key]) => key)).toEqual(["file"]);
  });

  it("rejects an explicitly unsupported provider STT language before upload", async () => {
    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "xai",
        providerModel: "grok-stt",
        apiKey: "xai-test",
        language: "en",
        speechLanguage: "uk",
      }),
    ).rejects.toThrow(
      "xAI does not officially support Ukrainian for this speech route.",
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses the configured audio-input endpoint for DashScope short-file STT", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Hello world",
            },
          },
        ],
      }),
    });

    const result = await transcribeAudio({
      fileUri: "/tmp/recording.m4a",
      mode: "provider",
      provider: "alibaba-qwen-dashscope",
      apiKey: "dashscope-test|beijing",
      language: "en",
      speechLanguage: "uk",
    });

    expect(result).toBe("Hello world");
    const [url, options] = (fetch as jest.Mock).mock.calls[0];
    expect(url).toBe(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    );
    const body = JSON.parse(options.body);
    expect(body.model).toBe("qwen3-asr-flash");
    expect(body.messages[0].content[0].type).toBe("input_audio");
    expect(body.messages[0].content[0].input_audio.data).toMatch(
      /^data:audio\/m4a;base64,/,
    );
    expect(body.asr_options).toEqual({
      language: "uk",
      enable_itn: false,
    });
  });

  it("rejects Qwen STT when the credential belongs to the US region", async () => {
    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "alibaba-qwen-dashscope",
        apiKey: "dashscope-test|us",
        language: "en",
      }),
    ).rejects.toThrow("not available in the US region");

    expect(fetch).not.toHaveBeenCalled();
  });

  it("aborts before starting the provider request when the signal is already cancelled", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
        abortSignal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: "AbortError",
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects uploads that exceed an exact catalog file-size limit before any upload", async () => {
    (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
      exists: true,
      size: 26_000_000,
    });

    await expect(
      transcribeAudio({
        fileUri: "/tmp/recording.m4a",
        mode: "provider",
        provider: "openai",
        apiKey: "sk-test",
        language: "en",
      }),
    ).rejects.toThrow(/too long for .* speech-to-text \(max 25 MB\)/);

    expect(fetch).not.toHaveBeenCalled();
  });
});
