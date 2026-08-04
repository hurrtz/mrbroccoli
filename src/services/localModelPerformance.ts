import type {
  LocalModelDefinition,
  LocalModelId,
} from "../constants/localModels";
import {
  evaluateLocalModelEligibility,
  localModelBenchmarkMatchesDevice,
  type LocalDeviceSnapshot,
  type LocalModelBenchmarkResult,
} from "./localDeviceCapabilities";

export type LocalModelPerformanceFit =
  "strong" | "likely" | "close" | "not-recommended";

export type LocalModelPerformanceEvidence =
  "measured" | "calibrated" | "requirements";

export interface LocalModelPerformanceEstimate {
  kind: "tokens-per-second" | "realtime-factor";
  value: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface LocalModelPerformanceAssessment {
  evidence: LocalModelPerformanceEvidence;
  fit: LocalModelPerformanceFit;
  benchmarkStatus?: LocalModelBenchmarkResult["status"];
  performance?: LocalModelPerformanceEstimate;
  loadMs?: number;
  memoryHeadroom: number;
  referenceModelId?: LocalModelId;
}

function memoryHeadroom(
  model: LocalModelDefinition,
  snapshot: LocalDeviceSnapshot,
) {
  return (
    snapshot.physicalMemoryBytes /
    Math.max(1, model.requirements.minimumPhysicalMemoryBytes)
  );
}

function fitFromRequirements(params: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
}) {
  const eligibility = evaluateLocalModelEligibility(
    params.model,
    params.snapshot,
  );
  if (!eligibility.eligible || eligibility.retryLater) {
    return "not-recommended" as const;
  }

  const headroom = memoryHeadroom(params.model, params.snapshot);
  const availableMemoryRatio =
    params.snapshot.availableMemoryBytes === undefined
      ? Number.POSITIVE_INFINITY
      : params.snapshot.availableMemoryBytes /
        Math.max(1, params.model.installedBytes);
  if (headroom >= 1.5 && availableMemoryRatio >= 1.5) {
    return "strong" as const;
  }
  if (headroom >= 1.15 && availableMemoryRatio >= 1.15) {
    return "likely" as const;
  }
  return "close" as const;
}

function measuredPerformance(
  model: LocalModelDefinition,
  benchmark: LocalModelBenchmarkResult,
): LocalModelPerformanceEstimate | undefined {
  if (
    model.capability === "llm" &&
    typeof benchmark.tokensPerSecond === "number"
  ) {
    return {
      kind: "tokens-per-second",
      value: benchmark.tokensPerSecond,
    };
  }
  if (
    model.capability !== "llm" &&
    typeof benchmark.realtimeFactor === "number"
  ) {
    return {
      kind: "realtime-factor",
      value: benchmark.realtimeFactor,
    };
  }
  return undefined;
}

function comparableReference(
  model: LocalModelDefinition,
  snapshot: LocalDeviceSnapshot,
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>,
  models: readonly LocalModelDefinition[],
) {
  return models
    .filter((candidate) => {
      if (
        candidate.id === model.id ||
        candidate.capability !== model.capability
      ) {
        return false;
      }
      if (
        model.capability !== "llm" &&
        candidate.capability !== "llm" &&
        candidate.sherpaModelType !== model.sherpaModelType
      ) {
        return false;
      }
      const benchmark = benchmarks[candidate.id];
      return (
        localModelBenchmarkMatchesDevice(benchmark, snapshot) &&
        measuredPerformance(candidate, benchmark!) !== undefined
      );
    })
    .sort(
      (left, right) =>
        Math.abs(Math.log(left.installedBytes / model.installedBytes)) -
        Math.abs(Math.log(right.installedBytes / model.installedBytes)),
    )[0];
}

function calibratedPerformance(params: {
  model: LocalModelDefinition;
  reference: LocalModelDefinition;
  benchmark: LocalModelBenchmarkResult;
}) {
  const referencePerformance = measuredPerformance(
    params.reference,
    params.benchmark,
  );
  if (!referencePerformance) {
    return undefined;
  }

  const sizeRatio =
    params.reference.installedBytes / Math.max(1, params.model.installedBytes);
  const scale = Math.pow(sizeRatio, 0.7);
  const value =
    referencePerformance.kind === "tokens-per-second"
      ? referencePerformance.value * scale
      : referencePerformance.value / scale;
  return {
    kind: referencePerformance.kind,
    value,
    lowerBound: value * 0.65,
    upperBound: value * 1.35,
  } satisfies LocalModelPerformanceEstimate;
}

function fitFromCalibratedPerformance(
  model: LocalModelDefinition,
  performance: LocalModelPerformanceEstimate | undefined,
  fallback: LocalModelPerformanceFit,
) {
  if (
    !performance ||
    performance.lowerBound === undefined ||
    performance.upperBound === undefined
  ) {
    return fallback;
  }
  if (performance.kind === "tokens-per-second") {
    const target = model.benchmark.minimumTokensPerSecond ?? 0;
    if (performance.lowerBound >= target) {
      return "strong" as const;
    }
    if (performance.value >= target) {
      return "likely" as const;
    }
    return performance.upperBound >= target
      ? ("close" as const)
      : ("not-recommended" as const);
  }

  const target = model.benchmark.maximumRealtimeFactor ?? Infinity;
  if (performance.upperBound <= target) {
    return "strong" as const;
  }
  if (performance.value <= target) {
    return "likely" as const;
  }
  return performance.lowerBound <= target
    ? ("close" as const)
    : ("not-recommended" as const);
}

export function assessLocalModelPerformance(params: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
  benchmark?: LocalModelBenchmarkResult;
  benchmarks?: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  models?: readonly LocalModelDefinition[];
}): LocalModelPerformanceAssessment {
  const headroom = memoryHeadroom(params.model, params.snapshot);
  if (localModelBenchmarkMatchesDevice(params.benchmark, params.snapshot)) {
    return {
      evidence: "measured",
      fit:
        params.benchmark?.status === "viable"
          ? "strong"
          : params.benchmark?.status === "below-target"
            ? "close"
            : "not-recommended",
      benchmarkStatus: params.benchmark?.status,
      performance: params.benchmark
        ? measuredPerformance(params.model, params.benchmark)
        : undefined,
      loadMs: params.benchmark?.loadMs,
      memoryHeadroom: headroom,
    };
  }

  const requirementsFit = fitFromRequirements(params);
  const reference = comparableReference(
    params.model,
    params.snapshot,
    params.benchmarks ?? {},
    params.models ?? [],
  );
  if (reference) {
    const benchmark = params.benchmarks?.[reference.id];
    const performance = benchmark
      ? calibratedPerformance({
          model: params.model,
          reference,
          benchmark,
        })
      : undefined;
    return {
      evidence: "calibrated",
      fit: fitFromCalibratedPerformance(
        params.model,
        performance,
        requirementsFit,
      ),
      performance,
      memoryHeadroom: headroom,
      referenceModelId: reference.id,
    };
  }

  return {
    evidence: "requirements",
    fit: requirementsFit,
    memoryHeadroom: headroom,
  };
}
