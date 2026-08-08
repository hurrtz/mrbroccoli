import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { fonts, textStyles } from "../../theme/typography";
import { introRadius, useIntroTheme } from "./introTheme";

type IconName = React.ComponentProps<typeof PhosphorIcon>["name"];

/**
 * Step heading. Uses the same headline face as the conversation drawer so the
 * introduction reads as part of the app.
 *
 * Headings are centred: every step is a single column of content with nothing
 * beside it, and a left-aligned heading over centred content read as a form.
 */
export function IntroTitle({ children }: { children: React.ReactNode }) {
  const theme = useIntroTheme();
  return (
    <Text style={[styles.title, { color: theme.text }]}>{children}</Text>
  );
}

export function IntroBody({ children }: { children: React.ReactNode }) {
  const theme = useIntroTheme();
  return (
    <Text style={[styles.body, { color: theme.textSecondary }]}>{children}</Text>
  );
}

/**
 * Marks a step as optional, as a rule with the word set into it.
 *
 * A pill above the heading competed with the heading for the eye and read as a
 * status badge on the step. As a divider it does the same job in the reading
 * order it belongs to -- a note about what follows, not a label on the title.
 */
export function IntroDivider({ label }: { label: string }) {
  const theme = useIntroTheme();
  return (
    <View style={styles.divider}>
      <View style={[styles.dividerRule, { backgroundColor: theme.border }]} />
      <Text style={[styles.dividerLabel, { color: theme.textMuted }]}>
        {label}
      </Text>
      <View style={[styles.dividerRule, { backgroundColor: theme.border }]} />
    </View>
  );
}

/** Grouped content on its own paper. */
export function IntroPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const theme = useIntroTheme();
  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: theme.panel, borderColor: theme.border },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** A hairline between grouped points inside a panel. */
export function IntroPanelDivider() {
  const theme = useIntroTheme();
  return (
    <View style={[styles.panelDivider, { backgroundColor: theme.border }]} />
  );
}

/** A single fact or benefit with a leading glyph. */
export function IntroPoint({
  icon,
  title,
  body,
  tone = "accent",
}: {
  icon: IconName;
  title: string;
  body?: string;
  tone?: "accent" | "neutral" | "premium";
}) {
  const theme = useIntroTheme();
  const color = {
    accent: theme.accent,
    neutral: theme.muted,
    premium: theme.premium,
  }[tone];

  return (
    <View style={styles.point}>
      <View style={[styles.pointIcon, { borderColor: `${color}40` }]}>
        <PhosphorIcon color={color} name={icon} size="compact" />
      </View>
      <View style={styles.pointText}>
        <Text style={[styles.pointTitle, { color: theme.text }]}>{title}</Text>
        {body ? (
          <Text style={[styles.pointBody, { color: theme.textSecondary }]}>
            {body}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** Primary/secondary action. Fully rounded, matching the app's own controls. */
export function IntroButton({
  label,
  onPress,
  tone = "primary",
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  tone?: "primary" | "secondary" | "premium";
  icon?: IconName;
  testID?: string;
}) {
  const theme = useIntroTheme();
  const filled = tone !== "secondary";
  const background =
    tone === "premium"
      ? theme.premium
      : tone === "primary"
        ? theme.accent
        : "transparent";
  const labelColor = filled
    ? tone === "premium"
      ? theme.onPremium
      : theme.onAccent
    : theme.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor: filled ? "transparent" : theme.borderStrong,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      testID={testID}
    >
      {icon ? <PhosphorIcon color={labelColor} name={icon} size="control" /> : null}
      <Text style={[styles.buttonLabel, { color: labelColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 22,
  },
  buttonLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
  },
  divider: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  dividerLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  dividerRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  panel: {
    borderRadius: introRadius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
    padding: 18,
  },
  panelDivider: {
    height: StyleSheet.hairlineWidth,
  },
  point: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  pointBody: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  pointIcon: {
    alignItems: "center",
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  pointText: {
    flex: 1,
    gap: 3,
  },
  pointTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    ...textStyles.screenTitle,
    // 30 left longer headings breaking with a single word on line two.
    fontSize: 27,
    lineHeight: 33,
    textAlign: "center",
  },
});
