import {
  getLocalModel,
  LOCAL_MODEL_CATALOG_VERSION,
} from "../../src/constants/localModels";
import {
  evaluateLocalModelEligibility,
  getLocalModelBenchmarkResults,
  resetLocalModelDeviceResults,
  saveLocalModelBenchmarkResult,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "../../src/services/localDeviceCapabilities";

const GIB = 1024 ** 3;

function device(
  partial: Partial<LocalDeviceSnapshot> = {},
): LocalDeviceSnapshot {
  return {
    version: 1,
    capturedAt: "2026-08-02T00:00:00.000Z",
    platform: "android",
    physicalMemoryBytes: 8 * GIB,
    availableMemoryBytes: 5 * GIB,
    freeStorageBytes: 10 * GIB,
    totalStorageBytes: 128 * GIB,
    processorCount: 8,
    activeProcessorCount: 8,
    architecture: "arm64-v8a",
    osVersion: "16",
    lowPowerMode: false,
    memoryLow: false,
    thermalState: "nominal",
    ...partial,
  };
}

describe("local device model eligibility", () => {
  it("accepts a model when platform, memory, and storage fit", () => {
    expect(
      evaluateLocalModelEligibility(getLocalModel("qwen3-1.7b-q8"), device()),
    ).toEqual({ eligible: true, reasons: [] });
  });

  it("excludes permanently impossible memory and storage combinations", () => {
    const result = evaluateLocalModelEligibility(
      getLocalModel("qwen3-1.7b-q8"),
      device({ physicalMemoryBytes: 3 * GIB, freeStorageBytes: 1 * GIB }),
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual(["memory", "storage"]);
  });

  it("ignores transient device pressure when judging eligibility", () => {
    // The OS throttles on its own; pressure must not hide or block models.
    const result = evaluateLocalModelEligibility(
      getLocalModel("whisper-tiny"),
      device({ lowPowerMode: true, memoryLow: true, thermalState: "serious" }),
    );

    expect(result).toEqual({ eligible: true, reasons: [] });
  });

  it("excludes local LLMs on unsupported 32-bit architectures", () => {
    const result = evaluateLocalModelEligibility(
      getLocalModel("qwen3-0.6b-q8"),
      device({ architecture: "armeabi-v7a" }),
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toEqual(["architecture"]);
  });
});

describe("benchmark verdict persistence", () => {
  beforeEach(async () => {
    await resetLocalModelDeviceResults();
  });

  function verdict(
    overrides: Partial<LocalModelBenchmarkResult>,
  ): LocalModelBenchmarkResult {
    return {
      modelId: "qwen3-1.7b-q8",
      catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
      testedAt: "2026-08-06T00:00:00.000Z",
      status: "viable",
      loadMs: 10,
      durationMs: 10,
      device: {
        platform: "android",
        architecture: "arm64-v8a",
        osVersion: "16",
        physicalMemoryBytes: 8 * GIB,
      },
      ...overrides,
    };
  }

  it("keeps a viable verdict even when measured under pressure", async () => {
    await saveLocalModelBenchmarkResult(
      verdict({ measuredUnderPressure: true }),
    );

    const stored = await getLocalModelBenchmarkResults();
    expect(stored["qwen3-1.7b-q8"]?.status).toBe("viable");
  });

  it("discards a non-viable verdict measured under pressure", async () => {
    // A throttled or battery-saver run must not durably label the model as
    // too slow for this device.
    await saveLocalModelBenchmarkResult(
      verdict({ status: "below-target", measuredUnderPressure: true }),
    );

    const stored = await getLocalModelBenchmarkResults();
    expect(stored["qwen3-1.7b-q8"]).toBeUndefined();
  });

  it("keeps a non-viable verdict from an unpressured run", async () => {
    await saveLocalModelBenchmarkResult(
      verdict({ status: "below-target", measuredUnderPressure: false }),
    );

    const stored = await getLocalModelBenchmarkResults();
    expect(stored["qwen3-1.7b-q8"]?.status).toBe("below-target");
  });
});
