import {
  LOCAL_MODEL_CATALOG,
  LOCAL_MODEL_CATALOG_VERSION,
  getLocalModel,
} from "../../src/constants/localModels";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../src/services/localDeviceCapabilities";
import { assessLocalModelPerformance } from "../../src/services/localModelPerformance";

const GIB = 1024 ** 3;

const snapshot: LocalDeviceSnapshot = {
  version: 1,
  capturedAt: "2026-08-04T00:00:00.000Z",
  platform: "ios",
  physicalMemoryBytes: 8 * GIB,
  freeStorageBytes: 20 * GIB,
  totalStorageBytes: 256 * GIB,
  processorCount: 8,
  activeProcessorCount: 8,
  architecture: "arm64",
  osVersion: "26.5.2",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal",
};

function benchmark(
  modelId: LocalModelBenchmarkResult["modelId"],
  partial: Partial<LocalModelBenchmarkResult> = {},
): LocalModelBenchmarkResult {
  return {
    modelId,
    catalogVersion: LOCAL_MODEL_CATALOG_VERSION,
    testedAt: "2026-08-04T00:00:00.000Z",
    status: "viable",
    loadMs: 420,
    durationMs: 2_000,
    device: snapshot,
    ...partial,
  };
}

describe("local model performance assessment", () => {
  it("reports exact current-device measurements instead of predicting", () => {
    const model = getLocalModel("whisper-tiny");
    const result = assessLocalModelPerformance({
      model,
      snapshot,
      benchmark: benchmark(model.id, { realtimeFactor: 0.42 }),
      models: LOCAL_MODEL_CATALOG,
    });

    expect(result).toMatchObject({
      evidence: "measured",
      benchmarkStatus: "viable",
      loadMs: 420,
      performance: { kind: "realtime-factor", value: 0.42 },
    });
  });

  it("does not reuse a benchmark after the device OS changes", () => {
    const model = getLocalModel("whisper-tiny");
    const stale = benchmark(model.id, { realtimeFactor: 0.42 });
    stale.device = { ...stale.device, osVersion: "25.0" };

    expect(
      assessLocalModelPerformance({
        model,
        snapshot,
        benchmark: stale,
        models: LOCAL_MODEL_CATALOG,
      }),
    ).toMatchObject({ evidence: "requirements", fit: "strong" });
  });

  it("calibrates an untested speech model from a comparable model tested on this phone", () => {
    const model = getLocalModel("whisper-base");
    const reference = benchmark("whisper-tiny", { realtimeFactor: 0.35 });
    const result = assessLocalModelPerformance({
      model,
      snapshot,
      benchmarks: { "whisper-tiny": reference },
      models: LOCAL_MODEL_CATALOG,
    });

    expect(result.evidence).toBe("calibrated");
    expect(result.referenceModelId).toBe("whisper-tiny");
    expect(result.performance?.kind).toBe("realtime-factor");
    expect(result.performance?.lowerBound).toBeLessThan(
      result.performance?.value ?? 0,
    );
    expect(result.performance?.upperBound).toBeGreaterThan(
      result.performance?.value ?? Infinity,
    );
  });

  it("recommends normally despite thermal or low-power pressure", () => {
    // The OS manages transient pressure; it must not hide capable models.
    const model = getLocalModel("whisper-tiny");

    expect(
      assessLocalModelPerformance({
        model,
        snapshot: {
          ...snapshot,
          lowPowerMode: true,
          thermalState: "serious",
        },
      }),
    ).toMatchObject({
      evidence: "requirements",
      fit: "strong",
    });
  });
});
