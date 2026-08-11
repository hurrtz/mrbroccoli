import React from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  LOCAL_MODEL_CATALOG,
  type LocalModelDefinition,
  type LocalModelId,
} from "../constants/localModels";
import { useLocalization } from "../i18n";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../services/localDeviceCapabilities";
import {
  assessLocalModelPerformance,
  type LocalModelPerformanceAssessment,
} from "../services/localModelPerformance";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";

function roundedMetric(value: number) {
  return value >= 10 ? value.toFixed(1) : value.toFixed(2);
}

function performanceText(assessment: LocalModelPerformanceAssessment) {
  const performance = assessment.performance;
  if (!performance) {
    return null;
  }
  const unit = performance.kind === "tokens-per-second" ? "tok/s" : "RTF";
  if (
    assessment.evidence === "calibrated" &&
    performance.lowerBound !== undefined &&
    performance.upperBound !== undefined
  ) {
    const low = Math.min(performance.lowerBound, performance.upperBound);
    const high = Math.max(performance.lowerBound, performance.upperBound);
    return `${roundedMetric(low)}–${roundedMetric(high)} ${unit}`;
  }
  return `${roundedMetric(performance.value)} ${unit}`;
}

export function LocalModelPerformanceSummary({
  model,
  snapshot,
  benchmark,
  benchmarks,
}: {
  model: LocalModelDefinition;
  snapshot: LocalDeviceSnapshot;
  benchmark?: LocalModelBenchmarkResult;
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const assessment = assessLocalModelPerformance({
    model,
    snapshot,
    benchmark,
    benchmarks,
    models: LOCAL_MODEL_CATALOG,
  });
  const sourceKey =
    assessment.evidence === "measured"
      ? "onDevicePerformanceMeasured"
      : assessment.evidence === "calibrated"
        ? "onDevicePerformanceCalibrated"
        : "onDevicePerformanceEstimated";
  const fitKey =
    assessment.benchmarkStatus === "viable"
      ? "onDeviceViable"
      : assessment.benchmarkStatus === "below-target"
        ? "onDeviceBelowTarget"
        : assessment.benchmarkStatus === "failed"
          ? "onDeviceTestFailed"
          : assessment.fit === "strong"
            ? "onDevicePerformanceStrong"
            : assessment.fit === "likely"
              ? "onboardingLikely"
              : assessment.fit === "close"
                ? "onDevicePerformanceClose"
                : "onboardingNotRecommended";
  const metric = performanceText(assessment);
  const details = [
    metric,
    assessment.loadMs === undefined
      ? null
      : t("onDevicePerformanceLoad", {
          load: Math.round(assessment.loadMs),
        }),
    t("onDevicePerformanceHeadroom", {
      headroom: assessment.memoryHeadroom.toFixed(1),
    }),
  ].filter(Boolean);

  return (
    <View
      testID={`on-device-performance-${model.id}-${assessment.evidence}`}
      accessibilityLabel={`${t(sourceKey)}. ${t(fitKey)}. ${details.join(". ")}`}
      style={styles.container}
    >
      <Text style={[styles.primary, { color: colors.textSecondary }]}>
        {t(sourceKey)} · {t(fitKey)}
      </Text>
      <Text style={[styles.details, { color: colors.textMuted }]}>
        {details.join(" · ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 1 },
  details: { fontFamily: fonts.body, fontSize: 11, lineHeight: 16 },
  primary: { fontFamily: fonts.bodyMedium, fontSize: 12, lineHeight: 17 },
});
