import {
  getOfflineProfileModels,
  selectOfflineProfile,
} from "../../src/services/offlineProfile";
import {
  evaluateOfflineProfileReadiness,
  getOfflinePreparationSteps,
} from "../../src/services/offlineProfileManager";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../src/services/localDeviceCapabilities";

const GIB = 1024 ** 3;

const snapshot: LocalDeviceSnapshot = {
  version: 1,
  capturedAt: "2026-08-02T00:00:00.000Z",
  platform: "ios",
  physicalMemoryBytes: 8 * GIB,
  availableMemoryBytes: 5 * GIB,
  freeStorageBytes: 10 * GIB,
  totalStorageBytes: 128 * GIB,
  processorCount: 6,
  activeProcessorCount: 6,
  architecture: "arm64",
  osVersion: "26.0",
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
  status: LocalModelBenchmarkResult["status"] = "viable",
): LocalModelBenchmarkResult {
  return {
    modelId,
    catalogVersion: 2,
    testedAt: "2026-08-02T00:00:00.000Z",
    status,
    loadMs: 10,
    durationMs: 10,
    device: snapshot,
  };
}

describe("offline profile readiness", () => {
  const installs = Object.fromEntries(
    getOfflineProfileModels(profile).map((model) => [
      model.id,
      { installed: true, path: `/models/${model.id}`, verified: true },
    ]),
  );
  const benchmarks = Object.fromEntries(
    getOfflineProfileModels(profile).map((model) => [
      model.id,
      benchmark(model.id),
    ]),
  );

  it("requires every installed model to have a viable benchmark for this device", () => {
    expect(
      evaluateOfflineProfileReadiness({
        profile,
        snapshot,
        installs,
        benchmarks,
      }).ready,
    ).toBe(true);
  });

  it("rejects a below-target model", () => {
    const result = evaluateOfflineProfileReadiness({
      profile,
      snapshot,
      installs,
      benchmarks: {
        ...benchmarks,
        [profile.stt.id]: benchmark(profile.stt.id, "below-target"),
      },
    });

    expect(result.ready).toBe(false);
    expect(result.failedModelId).toBe(profile.stt.id);
  });

  it("invalidates a benchmark from another OS version", () => {
    const stale = benchmark(profile.llm.id);
    stale.device = { ...stale.device, osVersion: "25.0" };

    expect(
      evaluateOfflineProfileReadiness({
        profile,
        snapshot,
        installs,
        benchmarks: { ...benchmarks, [profile.llm.id]: stale },
      }).ready,
    ).toBe(false);
  });

  it("reports one download step per missing model and one test step per model", () => {
    const models = getOfflineProfileModels(profile);
    const steps = getOfflinePreparationSteps(profile, {
      [models[0].id]: installs[models[0].id],
    });

    expect(steps.filter((step) => step.action === "downloading")).toHaveLength(
      models.length - 1,
    );
    expect(steps.filter((step) => step.action === "benchmarking")).toHaveLength(
      models.length,
    );
  });
});
