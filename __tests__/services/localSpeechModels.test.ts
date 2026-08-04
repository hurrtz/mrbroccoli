import * as FileSystem from "expo-file-system/legacy";

const mockDestroy = jest.fn().mockResolvedValue(undefined);
const mockTranscribeFile = jest.fn().mockRejectedValue(new Error("failed"));
const mockTranscribeSamples = jest.fn();
const mockCreateStt = jest.fn().mockResolvedValue({
  destroy: mockDestroy,
  transcribeFile: mockTranscribeFile,
  transcribeSamples: mockTranscribeSamples,
});

jest.mock("react-native-sherpa-onnx", () => ({
  fileModelPath: (path: string) => ({ type: "file", path }),
}));

jest.mock("react-native-sherpa-onnx/stt", () => ({
  createSTT: mockCreateStt,
}));

jest.mock("../../src/services/localModelManager", () => ({
  getLocalModelInstallStatus: jest.fn().mockResolvedValue({
    installed: true,
    path: "/models/whisper-tiny",
    verified: true,
  }),
}));

jest.mock("../../src/services/localDeviceCapabilities", () => ({
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
  transcribeLocalAudio,
} from "../../src/services/localSpeechModels";

describe("local speech model checks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
