import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Platform } from "react-native";

import {
  LOCAL_MODEL_CATALOG_VERSION,
  type LocalModelDefinition,
  type LocalModelId,
} from "../constants/localModels";

const LOCAL_MODEL_STATE_KEY = "@mrbroccoli/local-model-state";
const DEVICE_PROBE_VERSION = 1;

export type DeviceThermalState =
  "nominal" | "fair" | "serious" | "critical" | "unknown";

export interface LocalDeviceSnapshot {
  version: number;
  capturedAt: string;
  platform: "android" | "ios";
  physicalMemoryBytes: number;
  availableMemoryBytes?: number;
  freeStorageBytes: number;
  totalStorageBytes: number;
  processorCount: number;
  activeProcessorCount: number;
  architecture: string;
  osVersion: string;
  lowPowerMode: boolean;
  memoryLow: boolean;
  thermalState: DeviceThermalState;
}

export type LocalModelEligibilityReason =
  "platform" | "architecture" | "memory" | "storage";

export interface LocalModelEligibility {
  eligible: boolean;
  reasons: LocalModelEligibilityReason[];
}

export function hasLocalDeviceRuntimePressure(snapshot: LocalDeviceSnapshot) {
  return (
    snapshot.lowPowerMode ||
    snapshot.memoryLow ||
    snapshot.thermalState === "serious" ||
    snapshot.thermalState === "critical"
  );
}

export interface LocalModelBenchmarkResult {
  modelId: LocalModelId;
  catalogVersion: number;
  testedAt: string;
  status: "viable" | "below-target" | "failed";
  loadMs: number;
  durationMs: number;
  tokensPerSecond?: number;
  realtimeFactor?: number;
  detail?: string;
  /**
   * True when the device reported low power mode, low memory, or serious
   * thermal state while this benchmark ran. A throttled run can miss its
   * targets on a device that is fine when idle.
   */
  measuredUnderPressure?: boolean;
  device: Pick<
    LocalDeviceSnapshot,
    "platform" | "architecture" | "osVersion" | "physicalMemoryBytes"
  >;
}

export function localModelBenchmarkMatchesDevice(
  benchmark: LocalModelBenchmarkResult | undefined,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    benchmark?.catalogVersion === LOCAL_MODEL_CATALOG_VERSION &&
    benchmark?.device.platform === snapshot.platform &&
    benchmark.device.architecture === snapshot.architecture &&
    benchmark.device.osVersion === snapshot.osVersion &&
    benchmark.device.physicalMemoryBytes === snapshot.physicalMemoryBytes
  );
}

interface StoredLocalModelState {
  version: 1;
  snapshot?: LocalDeviceSnapshot;
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}

type NativeDeviceCapabilities = Omit<
  LocalDeviceSnapshot,
  "version" | "capturedAt" | "freeStorageBytes" | "totalStorageBytes"
>;

type DiagnosticsNativeModule = {
  getDeviceCapabilities?: () => Promise<NativeDeviceCapabilities>;
};

function getFsModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- lazy native loading keeps Jest and unsupported builds import-safe
  return require("@dr.pogodin/react-native-fs") as typeof import("@dr.pogodin/react-native-fs");
}

function normalizeFiniteNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function normalizeThermalState(value: unknown): DeviceThermalState {
  return value === "nominal" ||
    value === "fair" ||
    value === "serious" ||
    value === "critical"
    ? value
    : "unknown";
}

export async function probeLocalDeviceCapabilities(): Promise<LocalDeviceSnapshot> {
  const diagnostics = NativeModules.MrBroccoliDiagnostics as
    DiagnosticsNativeModule | undefined;

  if (!diagnostics?.getDeviceCapabilities) {
    throw new Error(
      "This app build does not include the on-device capability probe. Install a fresh native build.",
    );
  }

  const [native, storage] = await Promise.all([
    diagnostics.getDeviceCapabilities(),
    getFsModule().getFSInfo(),
  ]);
  const platform = native.platform === "ios" ? "ios" : "android";
  const snapshot: LocalDeviceSnapshot = {
    version: DEVICE_PROBE_VERSION,
    capturedAt: new Date().toISOString(),
    platform,
    physicalMemoryBytes: normalizeFiniteNumber(native.physicalMemoryBytes),
    availableMemoryBytes:
      native.availableMemoryBytes === undefined
        ? undefined
        : normalizeFiniteNumber(native.availableMemoryBytes),
    freeStorageBytes: normalizeFiniteNumber(storage.freeSpace),
    totalStorageBytes: normalizeFiniteNumber(storage.totalSpace),
    processorCount: normalizeFiniteNumber(native.processorCount, 1),
    activeProcessorCount: normalizeFiniteNumber(
      native.activeProcessorCount,
      normalizeFiniteNumber(native.processorCount, 1),
    ),
    architecture: String(native.architecture || "unknown"),
    osVersion: String(native.osVersion || Platform.Version),
    lowPowerMode: native.lowPowerMode === true,
    memoryLow: native.memoryLow === true,
    thermalState: normalizeThermalState(native.thermalState),
  };

  const state = await loadLocalModelState();
  await persistLocalModelState({ ...state, snapshot });
  return snapshot;
}

export function evaluateLocalModelEligibility(
  model: LocalModelDefinition,
  snapshot: LocalDeviceSnapshot,
): LocalModelEligibility {
  const reasons: LocalModelEligibilityReason[] = [];

  if (!model.requirements.platforms.includes(snapshot.platform)) {
    reasons.push("platform");
  }
  if (
    snapshot.physicalMemoryBytes < model.requirements.minimumPhysicalMemoryBytes
  ) {
    reasons.push("memory");
  }
  if (snapshot.freeStorageBytes < model.requirements.minimumFreeStorageBytes) {
    reasons.push("storage");
  }

  // Transient pressure (low power mode, low memory, thermal throttling) is
  // deliberately not an eligibility reason: the OS manages it, and blocking
  // on it left setup stuck whenever battery saver was enabled.
  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

async function loadLocalModelState(): Promise<StoredLocalModelState> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_MODEL_STATE_KEY);
    if (!raw) {
      return { version: 1, benchmarks: {} };
    }
    const parsed = JSON.parse(raw) as Partial<StoredLocalModelState>;
    return {
      version: 1,
      snapshot: parsed.snapshot,
      benchmarks:
        parsed.benchmarks && typeof parsed.benchmarks === "object"
          ? parsed.benchmarks
          : {},
    };
  } catch {
    return { version: 1, benchmarks: {} };
  }
}

async function persistLocalModelState(state: StoredLocalModelState) {
  await AsyncStorage.setItem(LOCAL_MODEL_STATE_KEY, JSON.stringify(state));
}

export async function getStoredLocalDeviceSnapshot() {
  return (await loadLocalModelState()).snapshot ?? null;
}

export async function getLocalModelBenchmarkResults() {
  const state = await loadLocalModelState();
  return Object.fromEntries(
    Object.entries(state.benchmarks).filter(
      ([, result]) => result?.catalogVersion === LOCAL_MODEL_CATALOG_VERSION,
    ),
  ) as Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}

export async function saveLocalModelBenchmarkResult(
  result: LocalModelBenchmarkResult,
) {
  if (result.status !== "viable" && result.measuredUnderPressure) {
    // A throttled or battery-saver run proves nothing about the model's real
    // speed; persisting it would durably mislabel the device as too slow.
    return;
  }
  const state = await loadLocalModelState();
  await persistLocalModelState({
    ...state,
    benchmarks: {
      ...state.benchmarks,
      [result.modelId]: result,
    },
  });
}

export async function resetLocalModelDeviceResults() {
  await AsyncStorage.removeItem(LOCAL_MODEL_STATE_KEY);
}
