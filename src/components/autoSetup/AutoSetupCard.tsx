import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../design-system/PhosphorIcon";
import type { TranslateFn } from "../../screens/main/shared";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import { AutoSetupPlanRow, type AutoSetupRowState } from "./AutoSetupPlanRow";
import { InstallProgressBar } from "./InstallProgressBar";
import type {
  AutoSetupJobPlanItem,
  AutoSetupJobState,
  AutoSetupStepReading,
} from "./types";

function CardAction({
  icon,
  label,
  onPress,
  tone = "primary",
}: {
  icon?: PhosphorIconName;
  label: string;
  onPress: () => void;
  tone?: "primary" | "secondary";
}) {
  const { colors } = useTheme();
  const filled = tone === "primary";
  // The app's filled-control pairing, not the raw accent: the deeper
  // activeControl green is what keeps this label above the 4.5:1 text floor
  // in both appearances.
  const ink = filled ? colors.onActiveControl : colors.text;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: filled ? colors.activeControl : "transparent",
          borderColor: filled ? "transparent" : colors.borderStrong,
        },
        pressed ? styles.pressed : null,
      ]}
      testID={`auto-setup-action-${label}`}
    >
      {icon ? <PhosphorIcon color={ink} name={icon} size="control" /> : null}
      <Text style={[styles.actionLabel, { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

function Verdict({
  body,
  tone,
  title,
}: {
  body: string;
  tone: "success" | "danger";
  title: string;
}) {
  const { colors } = useTheme();
  const ink = tone === "danger" ? colors.danger : colors.success;

  return (
    <View style={styles.verdict}>
      <View style={[styles.verdictBadge, { borderColor: ink }]}>
        <PhosphorIcon
          color={ink}
          name={tone === "danger" ? "warning" : "check"}
          size="compact"
        />
      </View>
      <View style={styles.verdictCopy}>
        <Text style={[styles.verdictTitle, { color: ink }]}>{title}</Text>
        <Text style={[styles.verdictBody, { color: colors.textSecondary }]}>
          {body}
        </Text>
      </View>
    </View>
  );
}

/**
 * One tap that measures the device, proposes a set of on-device models, and
 * installs them. Six states, one card, the same card in the introduction and
 * in On-device AI settings.
 *
 * Unlike the design system's web card, this one is always controlled: the
 * install has to keep running after the screen that started it is gone, so
 * the job lives above every screen that shows it and passes its state down.
 * The proposal is never installed on the user's behalf — the app has just
 * said it can decide for them, so the one thing it must not do is spend their
 * storage before they have seen the list.
 */
export function AutoSetupCard({
  job,
  onManual,
  showHeader = true,
  style,
  t,
}: {
  job: AutoSetupJobState;
  /** Leave for the manual catalogue. Omit to hide that route. */
  onManual?: () => void;
  /** Hide the icon, title and body — for a screen that already carries them. */
  showHeader?: boolean;
  style?: StyleProp<ViewStyle>;
  t: TranslateFn;
}) {
  const { colors } = useTheme();
  const divider = (
    <View style={[styles.divider, { backgroundColor: colors.border }]} />
  );

  const rowState = (index: number): AutoSetupRowState => {
    if (job.state === "done") {
      return "done";
    }
    if (job.state === "failed") {
      const failedAt = job.plan.findIndex((item) => item.failed);
      if (failedAt < 0) {
        return "planned";
      }
      return index === failedAt
        ? "failed"
        : index < failedAt
          ? "done"
          : "skipped";
    }
    if (job.state !== "installing") {
      return "planned";
    }
    const item = job.plan[index];
    if (item.installed) {
      return "done";
    }
    return item.active ? "active" : "planned";
  };

  const rowNote = (item: AutoSetupJobPlanItem, index: number) => {
    const current = rowState(index);
    if (current === "done" && job.state !== "proposal") {
      return t("autoSetupInstalledNote");
    }
    if (current === "active") {
      return t("autoSetupDownloadingNote");
    }
    if (current === "failed") {
      return job.errorDetail ?? t("autoSetupFailedRowNote");
    }
    if (current === "skipped") {
      return t("autoSetupQueuedNote");
    }
    return null;
  };

  const planRows = (
    <View style={styles.planStack}>
      {job.plan.map((item, index) => (
        <AutoSetupPlanRow
          benchmarks={job.benchmarks}
          key={item.role}
          model={item.model}
          name={item.name}
          note={job.state === "proposal" ? null : rowNote(item, index)}
          role={item.role}
          roleLabel={item.roleLabel}
          snapshot={job.snapshot}
          state={rowState(index)}
        />
      ))}
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
      testID="auto-setup-card"
    >
      {showHeader ? (
        <View style={styles.header}>
          <View
            style={[
              styles.headerBadge,
              {
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              },
            ]}
          >
            <PhosphorIcon color={colors.accent} name="cpu" size="control" />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t("autoSetupTitle")}
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>
              {t("autoSetupBody")}
            </Text>
          </View>
        </View>
      ) : null}

      {job.state === "offer" ? (
        <>
          <Text style={[styles.note, { color: colors.textMuted }]}>
            {t("autoSetupOfferNote")}
          </Text>
          <CardAction
            icon="thunderbolt"
            label={t("autoSetupStart")}
            onPress={job.start}
          />
        </>
      ) : null}

      {job.state === "scanning" ? (
        <>
          <View style={styles.scanRow}>
            <ActivityIndicator color={colors.accent} size="small" />
            <Text style={[styles.scanLabel, { color: colors.text }]}>
              {t("autoSetupScanning")}
            </Text>
          </View>
          <View
            accessibilityLiveRegion="polite"
            style={styles.factStack}
            testID="auto-setup-facts"
          >
            {job.facts.slice(0, job.scanned).map((fact) => (
              <View key={fact.label} style={styles.factRow}>
                <PhosphorIcon
                  color={colors.success}
                  name="check"
                  size="inline"
                />
                <Text style={[styles.factLabel, { color: colors.textMuted }]}>
                  {fact.label}
                </Text>
                <Text style={[styles.factValue, { color: colors.text }]}>
                  {fact.value}
                </Text>
              </View>
            ))}
          </View>
          <Text style={[styles.note, { color: colors.textMuted }]}>
            {t("autoSetupScanNote")}
          </Text>
        </>
      ) : null}

      {job.state === "proposal" ? (
        <>
          <Text style={[styles.proposalLabel, { color: colors.textMuted }]}>
            {t("autoSetupProposalLabel")}
          </Text>
          {planRows}
          {divider}
          <Text style={[styles.totalReading, { color: colors.textSecondary }]}>
            {t("autoSetupTotalSize", { size: job.totalSizeLabel })}
          </Text>
          <Text style={[styles.note, { color: colors.textMuted }]}>
            {t("autoSetupProposalNote")}
          </Text>
          <CardAction
            icon="download"
            label={
              job.downloadBytes > 0
                ? t("autoSetupInstallAction")
                : t("autoSetupStart")
            }
            onPress={job.install}
          />
          {onManual ? (
            <Pressable
              accessibilityLabel={t("autoSetupManual")}
              accessibilityRole="button"
              onPress={onManual}
              style={styles.textAction}
              testID="auto-setup-manual"
            >
              <Text
                style={[
                  styles.textActionLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {t("autoSetupManual")}
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : null}

      {job.state === "installing" ? (
        <>
          <InstallProgressBar
            fraction={job.fraction}
            label={job.reading?.label ?? t("autoSetupPreparing")}
            remaining={job.reading?.remaining}
            stepLabel={job.reading?.stepLabel}
          />
          {divider}
          {planRows}
          <Text style={[styles.note, { color: colors.textMuted }]}>
            {t("autoSetupInstallingNote")}
          </Text>
        </>
      ) : null}

      {job.state === "done" ? (
        <>
          <Verdict
            body={t("autoSetupDoneBody")}
            title={t("autoSetupDoneTitle")}
            tone="success"
          />
          {divider}
          {planRows}
        </>
      ) : null}

      {job.state === "failed" ? (
        <>
          <Verdict
            body={
              job.errorKind === "scan"
                ? t("autoSetupScanFailedDetail")
                : (job.errorDetail ?? t("autoSetupFailedDetail"))
            }
            title={
              job.errorKind === "scan"
                ? t("autoSetupScanFailedTitle")
                : t("autoSetupFailedTitle")
            }
            tone="danger"
          />
          {job.errorKind === "scan" ? null : divider}
          {job.errorKind === "scan" ? null : planRows}
          <CardAction
            icon="reload"
            label={t("autoSetupRetry")}
            onPress={job.retry}
          />
          {onManual ? (
            <Pressable
              accessibilityLabel={t("autoSetupManual")}
              accessibilityRole="button"
              onPress={onManual}
              style={styles.textAction}
              testID="auto-setup-manual"
            >
              <Text
                style={[
                  styles.textActionLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {t("autoSetupManual")}
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

export type { AutoSetupStepReading };

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  headerBadge: {
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.headline,
    fontSize: 18,
    letterSpacing: -0.1,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  action: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.72,
  },
  actionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    fontWeight: "500",
  },
  textAction: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  textActionLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    fontWeight: "500",
  },
  scanRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  scanLabel: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
    minWidth: 0,
  },
  factStack: {
    gap: 6,
    minHeight: 76,
  },
  factRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 10,
  },
  factLabel: {
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.75,
    lineHeight: 17,
    textTransform: "uppercase",
    width: 88,
  },
  factValue: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    minWidth: 0,
  },
  proposalLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.75,
    lineHeight: 16,
    textTransform: "uppercase",
  },
  planStack: {
    gap: 14,
  },
  divider: {
    height: 1,
  },
  totalReading: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
  verdict: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  verdictBadge: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    height: 30,
    justifyContent: "center",
    marginTop: 1,
    width: 30,
  },
  verdictCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  verdictTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
  },
  verdictBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
