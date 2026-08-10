import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";

/**
 * A determinate install bar with both readings the user might want: how far
 * through the queue it is, and how long is left. Neither alone is enough —
 * "step 3 of 5" says nothing about a 900 MB step, and a time estimate alone
 * gives no sense of what is actually happening.
 */
export function InstallProgressBar({
  fraction = 0,
  label,
  remaining,
  stepLabel,
  tone,
}: {
  /** 0–1. Drives the fill and the percentage. */
  fraction?: number;
  /** What is happening right now, translated by the caller. */
  label: string;
  /** Time reading, translated and formatted by the caller. */
  remaining?: string;
  /** "Step n of m", translated by the caller. Omit to hide. */
  stepLabel?: string;
  /** Fill colour override; the danger token for a stalled queue. */
  tone?: string;
}) {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(1, fraction));
  const percent = Math.round(clamped * 100);

  return (
    <View style={styles.stack}>
      <View style={styles.readingRow}>
        <Text
          numberOfLines={1}
          style={[styles.label, { color: colors.text }]}
        >
          {label}
        </Text>
        {stepLabel ? (
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {stepLabel}
          </Text>
        ) : null}
      </View>
      <View
        accessibilityLabel={label}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        style={[
          styles.track,
          {
            backgroundColor: colors.surfaceAlt,
            borderColor: colors.border,
          },
        ]}
        testID="install-progress-track"
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: tone ?? colors.accent,
              width: `${percent}%`,
            },
          ]}
          testID="install-progress-fill"
        />
      </View>
      <View style={styles.readingRow}>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {remaining}
        </Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {`${percent}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 8,
  },
  readingRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 21,
    minWidth: 0,
  },
  meta: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  track: {
    borderRadius: 3,
    borderWidth: 1,
    height: 6,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
});
