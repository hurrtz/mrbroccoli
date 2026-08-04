jest.mock("../../src/services/localDeviceCapabilities", () => {
  const actual = jest.requireActual(
    "../../src/services/localDeviceCapabilities",
  );
  return {
    ...actual,
    getLocalModelBenchmarkResults: jest.fn(),
    probeLocalDeviceCapabilities: jest.fn(),
  };
});

jest.mock("../../src/services/localLlm", () => ({
  benchmarkLocalLlm: jest.fn(),
}));

jest.mock("../../src/services/localSpeechModels", () => ({
  benchmarkLocalStt: jest.fn(),
  benchmarkLocalTts: jest.fn(),
}));

jest.mock("../../src/services/localModelManager", () => ({
  downloadLocalModel: jest.fn(async () => undefined),
  getLocalModelInstallStatus: jest.fn(async (modelId: string) => ({
    installed: true,
    path: `/models/${modelId}`,
    verified: true,
  })),
}));

jest.mock("../../src/services/kokoroTts", () => ({
  benchmarkKokoroModel: jest.fn(),
  downloadKokoroModel: jest.fn(async () => undefined),
  getKokoroInstallStatus: jest.fn(async () => ({
    installed: false,
    rootPath: null,
  })),
}));

jest.mock("../../src/services/debugLogCapture", () => ({
  recordDebugLogEvent: jest.fn(),
}));

import { LOCAL_MODEL_CATALOG_VERSION } from "../../src/constants/localModels";
import { benchmarkLocalLlm } from "../../src/services/localLlm";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../src/services/localDeviceCapabilities";
import {
  getLocalModelBenchmarkResults,
  probeLocalDeviceCapabilities,
} from "../../src/services/localDeviceCapabilities";
import { selectOfflineProfile } from "../../src/services/offlineProfile";
import {
  getOfflineProfileValidationModels,
  prepareOfflineProfile,
} from "../../src/services/offlineProfileManager";
import {
  benchmarkLocalStt,
  benchmarkLocalTts,
} from "../../src/services/localSpeechModels";

const mockBenchmarkLocalLlm = jest.mocked(benchmarkLocalLlm);
const mockBenchmarkLocalStt = jest.mocked(benchmarkLocalStt);
const mockBenchmarkLocalTts = jest.mocked(benchmarkLocalTts);
const mockGetLocalModelBenchmarkResults = jest.mocked(
  getLocalModelBenchmarkResults,
);
const mockProbeLocalDeviceCapabilities = jest.mocked(
  probeLocalDeviceCapabilities,
);

const GIB = 1024 ** 3;
const snapshot: LocalDeviceSnapshot = {
  version: 1,
  capturedAt: "2026-08-04T10:00:00.000Z",
  platform: "ios",
  physicalMemoryBytes: 12 * GIB,
  availableMemoryBytes: 8 * GIB,
  freeStorageBytes: 100 * GIB,
  totalStorageBytes: 512 * GIB,
  processorCount: 6,
  activeProcessorCount: 6,
  architecture: "arm64",
  osVersion: "26.5.2",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal",
};

const selection = selectOfflineProfile({ languages: ["de"], snapshot });
if (selection.status !== "ready") {
  throw new Error("Expected a German offline profile");
}
const profile = selection.profile;

function benchmark(
  modelId: LocalModelBenchmarkResult["modelId"],
): LocalModelBenchmarkResult {
  return {
    modelId,
    catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
    testedAt: "2026-08-04T10:00:00.000Z",
    status: "viable",
    loadMs: 10,
    durationMs: 10,
    device: snapshot,
  };
}

describe("offline profile preparation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProbeLocalDeviceCapabilities.mockResolvedValue(snapshot);
    mockBenchmarkLocalLlm.mockImplementation(async (modelId: string) =>
      benchmark(modelId as LocalModelBenchmarkResult["modelId"]),
    );
    mockBenchmarkLocalStt.mockImplementation(async (modelId: string) =>
      benchmark(modelId as LocalModelBenchmarkResult["modelId"]),
    );
    mockBenchmarkLocalTts.mockImplementation(async (modelId: string) =>
      benchmark(modelId as LocalModelBenchmarkResult["modelId"]),
    );
  });

  it("does not rerun fresh viable benchmarks", async () => {
    mockGetLocalModelBenchmarkResults.mockResolvedValue(
      Object.fromEntries(
        getOfflineProfileValidationModels(profile).map((model) => [
          model.id,
          benchmark(model.id),
        ]),
      ),
    );

    await prepareOfflineProfile(profile, {
      benchmarkCooldownMs: 0,
      downloadCooldownMs: 0,
      thermalPollIntervalMs: 0,
    });

    expect(mockBenchmarkLocalLlm).not.toHaveBeenCalled();
    expect(mockBenchmarkLocalStt).not.toHaveBeenCalled();
    expect(mockBenchmarkLocalTts).not.toHaveBeenCalled();
  });

  it("pauses before model work until thermal pressure clears", async () => {
    const quickBenchmark = benchmark(profile.llm.id);
    mockGetLocalModelBenchmarkResults.mockResolvedValue({
      ...Object.fromEntries(
        getOfflineProfileValidationModels(profile)
          .filter((model) => model.id !== profile.llm.id)
          .map((model) => [model.id, benchmark(model.id)]),
      ),
    });
    mockProbeLocalDeviceCapabilities
      .mockResolvedValueOnce(snapshot)
      .mockResolvedValueOnce({
        ...snapshot,
        thermalState: "serious",
      })
      .mockResolvedValueOnce(snapshot)
      .mockResolvedValue(snapshot);
    mockBenchmarkLocalLlm.mockResolvedValue(quickBenchmark);
    const onProgress = jest.fn();

    await prepareOfflineProfile(profile, {
      benchmarkCooldownMs: 0,
      downloadCooldownMs: 0,
      onProgress,
      thermalPollIntervalMs: 0,
    });

    expect(onProgress).toHaveBeenCalledWith(
      expect.objectContaining({ action: "cooling", modelId: profile.llm.id }),
    );
    expect(mockBenchmarkLocalLlm).toHaveBeenCalledTimes(1);
    expect(
      onProgress.mock.calls.findIndex(
        ([progress]) => progress.action === "cooling",
      ),
    ).toBeLessThan(
      onProgress.mock.calls.findIndex(
        ([progress]) => progress.action === "benchmarking",
      ),
    );
  });
});
