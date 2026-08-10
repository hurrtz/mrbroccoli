import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import { PhosphorIcon, type PhosphorIconName } from "./PhosphorIcon";

/**
 * A job that outlives the screen it was started on, stated in one row under
 * the top bar.
 *
 * It is a status line that happens to be tappable, not a card and not a
 * banner: a download the user has already agreed to should not compete with
 * the orb for attention, and it is deliberately not dismissible — the work is
 * still running whether or not the row is there, and hiding it would only
 * cost the user the way back to it. The progress line sits on the bottom edge
 * so the reading is legible at a glance and the text is never pushed around.
 */
export function BackgroundTaskBar({
  accessibilityLabel,
  detail,
  fraction = 0,
  icon = "cpu",
  onPress,
  style,
  title,
  tone = "progress",
}: {
  /** Full accessible name, translated by the caller. */
  accessibilityLabel: string;
  /** The reading, e.g. "Step 3 of 5 · about 2 min left". */
  detail?: string;
  /** 0–1. Drives the line along the bottom edge. */
  fraction?: number;
  icon?: PhosphorIconName;
  /** Where the row leads — the settings page that owns the job. */
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** What is running, translated by the caller. */
  title: string;
  /** progress while running, success when finished, danger when it failed. */
  tone?: "progress" | "success" | "danger";
}) {
  const { colors } = useTheme();
  const ink =
    tone === "danger"
      ? colors.danger
      : tone === "success"
        ? colors.success
        : colors.accent;
  const percent = Math.round(Math.max(0, Math.min(1, fraction)) * 100);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.bar,
        {
          backgroundColor:
            tone === "progress" ? colors.accentSoft : colors.surfaceAlt,
          borderColor: ink,
        },
        style,
      ]}
      testID="background-task-bar"
    >
      <PhosphorIcon color={ink} name={icon} size="compact" />
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {detail ? (
          <Text
            style={[styles.detail, { color: colors.textSecondary }]}
            testID="background-task-bar-detail"
          >
            {detail}
          </Text>
        ) : null}
      </View>
      <PhosphorIcon color={colors.textMuted} name="right" size="compact" />
      {tone === "progress" ? (
        <View
          style={[styles.trackLine, { backgroundColor: colors.border }]}
        >
          <View
            style={[
              styles.trackFill,
              { backgroundColor: ink, width: `${percent}%` },
            ]}
            testID="background-task-bar-fill"
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
    minHeight: 46,
    overflow: "hidden",
    paddingHorizontal: 12,
  },
  copy: {
    alignItems: "baseline",
    columnGap: 8,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  detail: {
    fontFamily: fonts.mono,
    fontSize: 11,
    lineHeight: 16,
  },
  trackLine: {
    bottom: 0,
    height: 2,
    left: 0,
    position: "absolute",
    right: 0,
  },
  trackFill: {
    height: "100%",
  },
});
