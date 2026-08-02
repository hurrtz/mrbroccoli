import { getLocalModel } from "../../src/constants/localModels";
import {
  evaluateLocalModelEligibility,
  type LocalDeviceSnapshot,
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
  it("accepts a model when platform, memory, storage, and transient state fit", () => {
    expect(
      evaluateLocalModelEligibility(getLocalModel("qwen3-1.7b-q8"), device()),
    ).toEqual({ eligible: true, reasons: [], retryLater: false });
  });

  it("excludes permanently impossible memory and storage combinations", () => {
    const result = evaluateLocalModelEligibility(
      getLocalModel("qwen3-1.7b-q8"),
      device({ physicalMemoryBytes: 3 * GIB, freeStorageBytes: 1 * GIB }),
    );

    expect(result.eligible).toBe(false);
    expect(result.retryLater).toBe(false);
    expect(result.reasons).toEqual(["memory", "storage"]);
  });

  it("marks transient pressure without permanently excluding the model", () => {
    const result = evaluateLocalModelEligibility(
      getLocalModel("whisper-tiny"),
      device({ lowPowerMode: true, thermalState: "serious" }),
    );

    expect(result).toEqual({
      eligible: true,
      reasons: ["temporary-device-state"],
      retryLater: true,
    });
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
