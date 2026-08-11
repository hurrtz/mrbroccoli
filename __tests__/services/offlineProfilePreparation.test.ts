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
  getKokoroInstallReadiness: jest.fn(async () => ({
    installed: false,
    rootPath: null,
    verified: false,
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

    await prepareOfflineProfile(profile);

    expect(mockBenchmarkLocalLlm).not.toHaveBeenCalled();
    expect(mockBenchmarkLocalStt).not.toHaveBeenCalled();
    expect(mockBenchmarkLocalTts).not.toHaveBeenCalled();
  });

  it("completes preparation while the device reports sustained pressure", async () => {
    // Regression: the setup used to block in a cooling loop whenever low
    // power mode, low memory, or serious thermal state was reported, so it
    // never finished on phones with battery saver enabled.
    mockGetLocalModelBenchmarkResults.mockResolvedValue({});
    mockProbeLocalDeviceCapabilities.mockResolvedValue({
      ...snapshot,
      lowPowerMode: true,
      thermalState: "serious",
    });
    const onProgress = jest.fn();

    await prepareOfflineProfile(profile, { onProgress });

    expect(mockBenchmarkLocalLlm).toHaveBeenCalled();
    expect(
      onProgress.mock.calls.some(
        ([progress]) => progress.action === "cooling",
      ),
    ).toBe(false);
  });

  it("reports an inconclusive verdict for a model that missed targets under pressure", async () => {
    mockGetLocalModelBenchmarkResults.mockResolvedValue(
      Object.fromEntries(
        getOfflineProfileValidationModels(profile)
          .filter((model) => model.id !== profile.llm.id)
          .map((model) => [model.id, benchmark(model.id)]),
      ),
    );
    mockProbeLocalDeviceCapabilities.mockResolvedValue({
      ...snapshot,
      thermalState: "critical",
    });
    mockBenchmarkLocalLlm.mockResolvedValue({
      ...benchmark(profile.llm.id),
      status: "below-target",
      measuredUnderPressure: true,
    });

    await expect(prepareOfflineProfile(profile)).rejects.toThrow(
      /could not be validated/,
    );
  });

  it("keeps the honest slow verdict when the device was not under pressure", async () => {
    mockGetLocalModelBenchmarkResults.mockResolvedValue(
      Object.fromEntries(
        getOfflineProfileValidationModels(profile)
          .filter((model) => model.id !== profile.llm.id)
          .map((model) => [model.id, benchmark(model.id)]),
      ),
    );
    mockBenchmarkLocalLlm.mockResolvedValue({
      ...benchmark(profile.llm.id),
      status: "below-target",
      measuredUnderPressure: false,
    });

    await expect(prepareOfflineProfile(profile)).rejects.toThrow(
      /not fast enough/,
    );
  });
});
