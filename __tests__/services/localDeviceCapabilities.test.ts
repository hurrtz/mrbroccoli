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
      evaluateLocalModelEligibility(getLocalModel("whisper-small"), device()),
    ).toEqual({ eligible: true, reasons: [] });
  });

  it("excludes permanently impossible memory and storage combinations", () => {
    const result = evaluateLocalModelEligibility(
      getLocalModel("whisper-small"),
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

});

describe("benchmark verdict persistence", () => {
  beforeEach(async () => {
    await resetLocalModelDeviceResults();
  });

  function verdict(
    overrides: Partial<LocalModelBenchmarkResult>,
  ): LocalModelBenchmarkResult {
    return {
      modelId: "whisper-small",
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
    expect(stored["whisper-small"]?.status).toBe("viable");
  });

  it("discards a non-viable verdict measured under pressure", async () => {
    // A throttled or battery-saver run must not durably label the model as
    // too slow for this device.
    await saveLocalModelBenchmarkResult(
      verdict({ status: "below-target", measuredUnderPressure: true }),
    );

    const stored = await getLocalModelBenchmarkResults();
    expect(stored["whisper-small"]).toBeUndefined();
  });

  it("keeps a non-viable verdict from an unpressured run", async () => {
    await saveLocalModelBenchmarkResult(
      verdict({ status: "below-target", measuredUnderPressure: false }),
    );

    const stored = await getLocalModelBenchmarkResults();
    expect(stored["whisper-small"]?.status).toBe("below-target");
  });
});
