import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type {
  LocalModelDefinition,
  LocalModelId,
} from "../../constants/localModels";
import { PhosphorIcon, type PhosphorIconName } from "../../design-system/PhosphorIcon";
import type {
  LocalDeviceSnapshot,
  LocalModelBenchmarkResult,
} from "../../services/localDeviceCapabilities";
import { formatBytes } from "../../utils/formatBytes";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import { LocalModelPerformanceSummary } from "../LocalModelPerformanceSummary";

export type AutoSetupRole = "think" | "listen" | "speak";
export type AutoSetupRowState =
  "planned" | "active" | "done" | "failed" | "skipped";

const ROLE_ICON: Record<AutoSetupRole, PhosphorIconName> = {
  think: "brain",
  listen: "mic",
  speak: "sound",
};

/**
 * One model the device check picked, with the job it was picked for.
 *
 * The role comes first and the model name second: a user choosing to trust an
 * automatic selection cares that something will do the thinking, not that the
 * something is called Qwen. The performance summary keeps the house rule —
 * evidence, then verdict, then numbers.
 */
export function AutoSetupPlanRow({
  benchmarks,
  model,
  name,
  note,
  role,
  roleLabel,
  snapshot,
  state = "planned",
}: {
  benchmarks: Partial<Record<LocalModelId, LocalModelBenchmarkResult>>;
  /** Absent for a job routed to the device's own recognizer or voice. */
  model?: LocalModelDefinition;
  /** Display name; defaults to the model's own. Required when model is absent. */
  name?: string;
  /** Replaces the performance summary — install status or a failure line. */
  note?: string | null;
  role: AutoSetupRole;
  /** The job, written out and translated: "Thinking", "Listening", "Speaking". */
  roleLabel: string;
  snapshot: LocalDeviceSnapshot | null;
  state?: AutoSetupRowState;
}) {
  const { colors } = useTheme();
  const tint =
    state === "active"
      ? colors.accent
      : state === "done"
        ? colors.success
        : state === "failed"
          ? colors.danger
          : colors.textMuted;
  const glyph: PhosphorIconName =
    state === "done" ? "check" : state === "failed" ? "warning" : ROLE_ICON[role];

  return (
    <View style={styles.row} testID={`auto-setup-row-${role}`}>
      <View
        style={[
          styles.badge,
          {
            borderColor: tint,
            backgroundColor:
              state === "done" || state === "failed"
                ? colors.surfaceAlt
                : "transparent",
          },
        ]}
      >
        <PhosphorIcon color={tint} name={glyph} size="compact" />
      </View>
      <View style={styles.copy}>
        <View style={styles.labelRow}>
          <Text
            numberOfLines={1}
            style={[styles.roleLabel, { color: colors.textMuted }]}
          >
            {roleLabel}
          </Text>
          {model ? (
            <Text style={[styles.size, { color: colors.textMuted }]}>
              {formatBytes(model.downloadBytes)}
            </Text>
          ) : null}
        </View>
        <Text
          numberOfLines={1}
          style={[styles.name, { color: colors.text }]}
        >
          {name ?? model?.name}
        </Text>
        {note ? (
          <Text
            style={[
              styles.note,
              {
                color:
                  state === "failed" ? colors.danger : colors.textSecondary,
              },
            ]}
            testID={`auto-setup-row-${role}-note`}
          >
            {note}
          </Text>
        ) : model && snapshot ? (
          <LocalModelPerformanceSummary
            benchmark={benchmarks[model.id]}
            benchmarks={benchmarks}
            model={model}
            snapshot={snapshot}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  badge: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    marginTop: 1,
    width: 30,
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  labelRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 8,
  },
  roleLabel: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.75,
    lineHeight: 15,
    minWidth: 0,
    textTransform: "uppercase",
  },
  size: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 15,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
