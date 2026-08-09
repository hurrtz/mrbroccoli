import React from "react";
import {
  AntSettingsCard,
  LocalModelPerformanceSummary,
  Text,
  View,
  darkColors,
} from "mrbroccoli";

// LocalModelPerformanceSummary (src/components/LocalModelPerformanceSummary.tsx)
// takes model/snapshot/benchmark/benchmarks entirely as props and calls the
// pure `assessLocalModelPerformance` (src/services/localModelPerformance.ts)
// -- it never itself calls the native device probe in
// src/services/localDeviceCapabilities.ts (that only happens in the parent,
// OnDeviceSettingsPage, via probeLocalDeviceCapabilities()). Every helper this
// component actually calls (assessLocalModelPerformance,
// evaluateLocalModelEligibility, localModelBenchmarkMatchesDevice) is plain
// data-in/data-out logic, so real device snapshots and benchmark results can
// be supplied directly as props here -- the browser-stub concern in the brief
// applies to the native probe functions, not to this component itself.
//
// Real composition: OnDeviceSettingsPage.renderModel wraps this in
// <AntSettingsCard title={model.name}> with a size/license meta line above it
// -- ported here rather than showing the summary text in isolation.
//
// Model data is the real catalogue (src/constants/localModels.ts); device
// snapshots follow the shape __tests__/services/localModelPerformance.test.ts
// uses. catalogVersion must equal LOCAL_MODEL_CATALOG_VERSION (2) for a
// benchmark to be treated as matching its device.

const GIB = 1024 ** 3;

const qwen17b = {
  id: "qwen3-1.7b-q8" as const,
  capability: "llm" as const,
  name: "Qwen3 1.7B",
  description: "Higher-quality multilingual responses on stronger phones.",
  catalogTier: "recommended" as const,
  runtime: "llama-rn" as const,
  languages: ["en"] as const,
  fileName: "Qwen3-1.7B-Q8_0.gguf",
  downloadBytes: 1_834_426_016,
  installedBytes: 1_834_426_016,
  sha256: "061b54daade076b5d3362dac252678d17da8c68f07560be70818cace6590cb1a",
  license: "Apache-2.0",
  sourceUrl: "https://huggingface.co/Qwen/Qwen3-1.7B-GGUF",
  downloadUrl: "https://huggingface.co/Qwen/Qwen3-1.7B-GGUF",
  requirements: {
    minimumPhysicalMemoryBytes: 6 * GIB,
    minimumFreeStorageBytes: 1_834_426_016 + 768 * 1024 * 1024,
    platforms: ["android", "ios"] as const,
  },
  benchmark: { maximumLoadMs: 55_000, minimumTokensPerSecond: 3 },
  contextTokens: 4_096,
  responseProfile: "thorough" as const,
};

const qwen4b = {
  ...qwen17b,
  id: "qwen3-4b-q4" as const,
  name: "Qwen3 4B",
  description:
    "Larger multilingual reasoning option, including Russian, for high-end phones.",
  catalogTier: "advanced" as const,
  downloadBytes: 2_497_280_256,
  installedBytes: 2_497_280_256,
  requirements: {
    minimumPhysicalMemoryBytes: 8 * GIB,
    minimumFreeStorageBytes: 2_497_280_256 + 768 * 1024 * 1024,
    platforms: ["android", "ios"] as const,
  },
};

const qwen06b = {
  ...qwen17b,
  id: "qwen3-0.6b-q8" as const,
  name: "Qwen3 0.6B",
  description: "Small multilingual response model; fastest local option.",
  catalogTier: "recommended" as const,
  downloadBytes: 639_446_688,
  installedBytes: 639_446_688,
  requirements: {
    minimumPhysicalMemoryBytes: 3 * GIB,
    minimumFreeStorageBytes: 639_446_688 + 768 * 1024 * 1024,
    platforms: ["android", "ios"] as const,
  },
  benchmark: { maximumLoadMs: 35_000, minimumTokensPerSecond: 3 },
  responseProfile: "quick" as const,
};

const whisperSmall = {
  id: "whisper-small" as const,
  capability: "stt" as const,
  name: "Whisper Small",
  description:
    "Higher-accuracy Whisper option for stronger phones and difficult audio.",
  catalogTier: "advanced" as const,
  runtime: "sherpa-onnx" as const,
  runtimeModelId: "sherpa-onnx-whisper-small",
  sherpaModelType: "whisper" as const,
  languages: ["en"] as const,
  downloadBytes: 639_387_718,
  installedBytes: 970_000_000,
  sha256: "486a46afbb7ba798507190ffe02fea2dd726049af212e774537efac6afb210a6",
  license: "MIT",
  sourceUrl: "https://github.com/openai/whisper",
  downloadUrl: "https://github.com/k2-fsa/sherpa-onnx",
  requirements: {
    minimumPhysicalMemoryBytes: 5 * GIB,
    minimumFreeStorageBytes: 970_000_000 + 384 * 1024 * 1024,
    platforms: ["android", "ios"] as const,
  },
  benchmark: { maximumLoadMs: 40_000, maximumRealtimeFactor: 1.5 },
};

const iphoneSnapshot = {
  version: 1,
  capturedAt: "2026-08-09T09:00:00.000Z",
  platform: "ios" as const,
  physicalMemoryBytes: 8 * GIB,
  freeStorageBytes: 40 * GIB,
  totalStorageBytes: 256 * GIB,
  processorCount: 6,
  activeProcessorCount: 6,
  architecture: "arm64",
  osVersion: "26.5.2",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal" as const,
};

const oldAndroidSnapshot = {
  version: 1,
  capturedAt: "2026-08-09T09:00:00.000Z",
  platform: "android" as const,
  physicalMemoryBytes: 4 * GIB,
  freeStorageBytes: 12 * GIB,
  totalStorageBytes: 64 * GIB,
  processorCount: 8,
  activeProcessorCount: 8,
  architecture: "arm64-v8a",
  osVersion: "13",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal" as const,
};

const midAndroidSnapshot = {
  version: 1,
  capturedAt: "2026-08-09T09:00:00.000Z",
  platform: "android" as const,
  physicalMemoryBytes: 6 * GIB,
  freeStorageBytes: 20 * GIB,
  totalStorageBytes: 128 * GIB,
  processorCount: 8,
  activeProcessorCount: 8,
  architecture: "arm64-v8a",
  osVersion: "15",
  lowPowerMode: false,
  memoryLow: false,
  thermalState: "nominal" as const,
};

const measuredQwen17b = {
  modelId: "qwen3-1.7b-q8" as const,
  catalogVersion: 2,
  testedAt: "2026-08-09T09:01:00.000Z",
  status: "viable" as const,
  loadMs: 2_350,
  durationMs: 6_000,
  tokensPerSecond: 15.8,
  device: {
    platform: iphoneSnapshot.platform,
    architecture: iphoneSnapshot.architecture,
    osVersion: iphoneSnapshot.osVersion,
    physicalMemoryBytes: iphoneSnapshot.physicalMemoryBytes,
  },
};

const belowTargetQwen06b = {
  modelId: "qwen3-0.6b-q8" as const,
  catalogVersion: 2,
  testedAt: "2026-08-09T09:01:00.000Z",
  status: "below-target" as const,
  loadMs: 4_100,
  durationMs: 8_000,
  tokensPerSecond: 1.8,
  device: {
    platform: oldAndroidSnapshot.platform,
    architecture: oldAndroidSnapshot.architecture,
    osVersion: oldAndroidSnapshot.osVersion,
    physicalMemoryBytes: oldAndroidSnapshot.physicalMemoryBytes,
  },
};

const Canvas = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      backgroundColor: darkColors.background,
      borderRadius: 12,
      padding: 16,
      width: "100%",
      maxWidth: 420,
    }}
  >
    {children}
  </View>
);

const Meta = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: 12, lineHeight: 18, color: darkColors.textMuted }}>
    {children}
  </Text>
);

// Directly benchmarked on this exact phone: the strongest evidence tier.
export const Measured = () => (
  <Canvas>
    <AntSettingsCard title={qwen17b.name}>
      <Meta>1.8 GB · Apache-2.0</Meta>
      <LocalModelPerformanceSummary
        model={qwen17b}
        snapshot={iphoneSnapshot}
        benchmark={measuredQwen17b}
        benchmarks={{ "qwen3-1.7b-q8": measuredQwen17b }}
      />
    </AntSettingsCard>
  </Canvas>
);

// Never tested itself, but a sibling model's benchmark on the same phone lets
// the app scale a calibrated estimate (see calibratedPerformance()).
export const Calibrated = () => (
  <Canvas>
    <AntSettingsCard title={qwen4b.name}>
      <Meta>2.3 GB · Apache-2.0</Meta>
      <LocalModelPerformanceSummary
        model={qwen4b}
        snapshot={iphoneSnapshot}
        benchmarks={{ "qwen3-1.7b-q8": measuredQwen17b }}
      />
    </AntSettingsCard>
  </Canvas>
);

// Measured, but the phone came in under the model's target throughput.
export const BelowTarget = () => (
  <Canvas>
    <AntSettingsCard title={qwen06b.name}>
      <Meta>610 MB · Apache-2.0</Meta>
      <LocalModelPerformanceSummary
        model={qwen06b}
        snapshot={oldAndroidSnapshot}
        benchmark={belowTargetQwen06b}
        benchmarks={{ "qwen3-0.6b-q8": belowTargetQwen06b }}
      />
    </AntSettingsCard>
  </Canvas>
);

// No benchmark at all yet, on either this model or a comparable one -- the
// weakest evidence tier, a plain fit-from-specifications guess.
export const Estimated = () => (
  <Canvas>
    <AntSettingsCard title={whisperSmall.name}>
      <Meta>925 MB · MIT</Meta>
      <LocalModelPerformanceSummary
        model={whisperSmall}
        snapshot={midAndroidSnapshot}
        benchmarks={{}}
      />
    </AntSettingsCard>
  </Canvas>
);
