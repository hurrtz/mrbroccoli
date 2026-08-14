import * as FileSystem from "expo-file-system/legacy";

const mockDestroy = jest.fn().mockResolvedValue(undefined);
const mockTranscribeFile = jest.fn().mockRejectedValue(new Error("failed"));
const mockTranscribeSamples = jest.fn();
const mockCreateStt = jest.fn().mockResolvedValue({
  destroy: mockDestroy,
  transcribeFile: mockTranscribeFile,
  transcribeSamples: mockTranscribeSamples,
});
const mockDestroyTts = jest.fn().mockResolvedValue(undefined);
const mockCancelSpeechStream = jest.fn().mockResolvedValue(undefined);
const mockSaveAudioToFile = jest.fn().mockResolvedValue(undefined);
type StreamHandlers = {
  onChunk?: (chunk: { samples: number[]; sampleRate: number }) => void;
  onEnd?: (event: { cancelled: boolean }) => void;
  onError?: (event: { message: string }) => void;
};
const generateSpeechStream = async (
  _text: string,
  _options: unknown,
  handlers: StreamHandlers,
) => {
  handlers.onChunk?.({ samples: [0, 0.25], sampleRate: 24_000 });
  handlers.onChunk?.({ samples: [-0.25], sampleRate: 24_000 });
  handlers.onEnd?.({ cancelled: false });
  return { cancel: jest.fn(), unsubscribe: jest.fn() };
};
const mockGenerateSpeechStream = jest.fn(generateSpeechStream);
const mockCreateStreamingTts = jest.fn().mockResolvedValue({
  cancelSpeechStream: mockCancelSpeechStream,
  destroy: mockDestroyTts,
  generateSpeechStream: mockGenerateSpeechStream,
});

jest.mock("react-native-sherpa-onnx", () => ({
  fileModelPath: (path: string) => ({ type: "file", path }),
}));

jest.mock("react-native-sherpa-onnx/stt", () => ({
  createSTT: mockCreateStt,
}));

jest.mock("react-native-sherpa-onnx/tts", () => ({
  createStreamingTTS: mockCreateStreamingTts,
  saveAudioToFile: mockSaveAudioToFile,
}));

jest.mock("../../src/services/localModelManager", () => ({
  getLocalModelInstallStatus: jest.fn().mockResolvedValue({
    installed: true,
    path: "/models/whisper-tiny",
    verified: true,
  }),
}));

jest.mock("../../src/services/localDeviceCapabilities", () => ({
  hasLocalDeviceRuntimePressure: jest.requireActual(
    "../../src/services/localDeviceCapabilities",
  ).hasLocalDeviceRuntimePressure,
  probeLocalDeviceCapabilities: jest.fn().mockResolvedValue({
    version: 1,
    capturedAt: "2026-08-02T00:00:00.000Z",
    platform: "android",
    physicalMemoryBytes: 8 * 1024 ** 3,
    freeStorageBytes: 10 * 1024 ** 3,
    totalStorageBytes: 128 * 1024 ** 3,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: "arm64-v8a",
    osVersion: "16",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
  }),
  saveLocalModelBenchmarkResult: jest.fn().mockResolvedValue(undefined),
}));

import { saveLocalModelBenchmarkResult } from "../../src/services/localDeviceCapabilities";
import {
  benchmarkLocalStt,
  getLocalTtsBenchmarkText,
  synthesizeLocalSpeech,
  transcribeLocalAudio,
} from "../../src/services/localSpeechModels";

describe("local speech model checks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateSpeechStream.mockImplementation(generateSpeechStream);
  });

  it("benchmarks real audio through the file-transcription route and cleans up", async () => {
    const result = await benchmarkLocalStt("whisper-tiny", "de");

    expect(result.status).toBe("failed");
    const audioPath = expect.stringMatching(
      /^file:\/\/\/cache\/local-stt-benchmark-\d+\.wav$/,
    );
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      audioPath,
      expect.any(String),
      { encoding: "base64" },
    );
    expect(mockTranscribeFile).toHaveBeenCalledWith(
      expect.stringMatching(/^\/cache\/local-stt-benchmark-\d+\.wav$/),
    );
    expect(mockTranscribeSamples).not.toHaveBeenCalled();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(audioPath, {
      idempotent: true,
    });
    expect(saveLocalModelBenchmarkResult).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: "whisper-tiny",
        status: "failed",
      }),
    );
  });

  it("uses Sherpa's empty language sentinel for automatic Whisper detection", async () => {
    await benchmarkLocalStt("whisper-tiny", "auto");

    expect(mockCreateStt).toHaveBeenCalledWith(
      expect.objectContaining({
        modelOptions: {
          whisper: { language: "", task: "transcribe" },
        },
      }),
    );
  });

  it("does not send Whisper-only options to Omnilingual ASR", async () => {
    mockTranscribeFile.mockResolvedValueOnce({ text: "ciao" });

    await expect(
      transcribeLocalAudio({
        fileUri: "file:///recording.wav",
        modelId: "omnilingual-asr-300m",
        language: "it",
      }),
    ).resolves.toBe("ciao");

    expect(mockCreateStt).toHaveBeenCalledWith(
      expect.objectContaining({
        modelType: "omnilingual",
        modelOptions: undefined,
      }),
    );
    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["parakeet-tdt-0.6b-v3-int8", "nemo_transducer"],
    ["qwen3-asr-0.6b-int8", "qwen3_asr"],
  ] as const)(
    "routes %s through Sherpa's %s recognizer",
    async (modelId, modelType) => {
      mockTranscribeFile.mockResolvedValueOnce({ text: "recognized" });

      await expect(
        transcribeLocalAudio({
          fileUri: "file:///recording.wav",
          modelId,
          language: "ru",
        }),
      ).resolves.toBe("recognized");

      expect(mockCreateStt).toHaveBeenCalledWith(
        expect.objectContaining({ modelType, modelOptions: undefined }),
      );
    },
  );

  it("uses the selected language for local TTS benchmarks", () => {
    expect(getLocalTtsBenchmarkText("de")).toBe("Hallo von Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("es")).toBe("Hola desde Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("fr")).toBe(
      "Bonjour de la part de Mr Broccoli.",
    );
    expect(getLocalTtsBenchmarkText("pt-BR")).toBe(
      "Olá, aqui é o Mr Broccoli.",
    );
    expect(getLocalTtsBenchmarkText("pt")).toBe("Olá, aqui é o Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("it")).toBe("Ciao da Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("ru")).toBe("Привет от Mr Broccoli.");
  });

  it("runs Piper synthesis through the non-blocking streaming engine", async () => {
    const result = await synthesizeLocalSpeech({
      text: "Hello from the phone.",
      modelId: "piper-en-us-kristin",
      speechLanguage: "en",
    });

    expect(mockCreateStreamingTts).toHaveBeenCalledWith({
      modelPath: { type: "file", path: "/models/whisper-tiny" },
      modelType: "vits",
      numThreads: 2,
      provider: "cpu",
      maxNumSentences: 1,
      silenceScale: 0.2,
    });
    expect(mockGenerateSpeechStream).toHaveBeenCalledWith(
      "Hello from the phone.",
      { sid: 0, silenceScale: 0.2, speed: 1 },
      expect.objectContaining({
        onChunk: expect.any(Function),
        onEnd: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(mockSaveAudioToFile).toHaveBeenCalledWith(
      { samples: [0, 0.25, -0.25], sampleRate: 24_000 },
      expect.stringMatching(/^\/cache\/local-tts-\d+-[a-z0-9]+\.wav$/),
    );
    expect(result).toEqual({
      fileUri: expect.stringMatching(
        /^file:\/\/\/cache\/local-tts-\d+-[a-z0-9]+\.wav$/,
      ),
      audioDurationSeconds: 3 / 24_000,
      loadMs: expect.any(Number),
    });
    expect(mockDestroyTts).toHaveBeenCalledTimes(1);
  });

  it("accumulates a native-sized Piper chunk without spreading it onto the stack", async () => {
    const samples = new Array(200_000).fill(0);
    samples[0] = -0.5;
    samples[samples.length - 1] = 0.5;
    mockGenerateSpeechStream.mockImplementationOnce(
      async (_text, _options, handlers) => {
        handlers.onChunk?.({ samples, sampleRate: 24_000 });
        handlers.onEnd?.({ cancelled: false });
        return { cancel: jest.fn(), unsubscribe: jest.fn() };
      },
    );

    await synthesizeLocalSpeech({
      text: "A longer local reply.",
      modelId: "piper-en-us-kristin",
      speechLanguage: "en",
    });

    const generatedAudio = mockSaveAudioToFile.mock.calls.at(-1)?.[0];
    expect(generatedAudio).toEqual({
      samples: expect.any(Array),
      sampleRate: 24_000,
    });
    expect(generatedAudio.samples).toHaveLength(200_000);
    expect(generatedAudio.samples[0]).toBe(-0.5);
    expect(generatedAudio.samples.at(-1)).toBe(0.5);
  });

  it("cancels active Piper streaming when its signal aborts", async () => {
    let handlers: StreamHandlers | undefined;
    let markStarted!: () => void;
    const started = new Promise<void>((resolve) => {
      markStarted = resolve;
    });
    mockGenerateSpeechStream.mockImplementationOnce(
      async (_text, _options, nextHandlers) => {
        handlers = nextHandlers;
        markStarted();
        return { cancel: jest.fn(), unsubscribe: jest.fn() };
      },
    );
    const controller = new AbortController();
    const synthesis = synthesizeLocalSpeech({
      text: "Please stop.",
      modelId: "piper-en-us-kristin",
      speechLanguage: "en",
      abortSignal: controller.signal,
    });
    const outcome = expect(synthesis).rejects.toMatchObject({
      name: "AbortError",
    });
    await started;

    controller.abort();
    handlers?.onEnd?.({ cancelled: true });

    await outcome;
    expect(mockCancelSpeechStream).toHaveBeenCalledTimes(1);
    expect(mockSaveAudioToFile).not.toHaveBeenCalled();
    expect(mockDestroyTts).toHaveBeenCalledTimes(1);
  });
});
