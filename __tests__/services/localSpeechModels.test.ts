const mockDestroy = jest.fn().mockResolvedValue(undefined);
const mockTranscribeSamples = jest.fn().mockRejectedValue(new Error("failed"));
const mockCreateStt = jest.fn().mockResolvedValue({
  destroy: mockDestroy,
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
} from "../../src/services/localSpeechModels";

describe("local speech model checks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("destroys the STT engine when its benchmark throws", async () => {
    const result = await benchmarkLocalStt("whisper-tiny", "de");

    expect(result.status).toBe("failed");
    expect(mockDestroy).toHaveBeenCalledTimes(1);
    expect(saveLocalModelBenchmarkResult).toHaveBeenCalledWith(
      expect.objectContaining({
        modelId: "whisper-tiny",
        status: "failed",
      }),
    );
  });

  it("uses the selected language for local TTS benchmarks", () => {
    expect(getLocalTtsBenchmarkText("de")).toBe("Hallo von Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("es")).toBe("Hola desde Mr Broccoli.");
    expect(getLocalTtsBenchmarkText("fr")).toBe(
      "Bonjour de la part de Mr Broccoli.",
    );
    expect(getLocalTtsBenchmarkText("pt-BR")).toBe(
      "Olá, aqui é o Mr Broccoli.",
    );
  });
});
