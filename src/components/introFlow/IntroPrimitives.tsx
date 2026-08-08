import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { fonts, textStyles } from "../../theme/typography";
import { introRadius, introTheme } from "./introTheme";

type IconName = React.ComponentProps<typeof PhosphorIcon>["name"];

/**
 * Step heading. Uses the same headline face as the conversation drawer so the
 * introduction reads as part of the app despite its own palette.
 */
export function IntroTitle({
  align = "left",
  children,
}: {
  align?: "center" | "left";
  children: React.ReactNode;
}) {
  return <Text style={[styles.title, { textAlign: align }]}>{children}</Text>;
}

export function IntroBody({
  align = "left",
  children,
}: {
  align?: "center" | "left";
  children: React.ReactNode;
}) {
  return <Text style={[styles.body, { textAlign: align }]}>{children}</Text>;
}

/**
 * Marks a step as required or optional.
 *
 * Optional steps still matter -- speech makes the app markedly better -- so the
 * badge states the fact without discouraging, and the surrounding copy carries
 * the argument.
 */
export function IntroBadge({
  tone = "neutral",
  children,
}: {
  tone?: "accent" | "neutral" | "premium";
  children: React.ReactNode;
}) {
  const palette = {
    accent: [introTheme.accentSoft, introTheme.accentBorder, introTheme.accent],
    neutral: [introTheme.mutedSoft, introTheme.border, introTheme.muted],
    premium: [
      introTheme.premiumSoft,
      introTheme.premiumBorder,
      introTheme.premium,
    ],
  }[tone];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: palette[0], borderColor: palette[1] },
      ]}
    >
      <Text style={[styles.badgeLabel, { color: palette[2] }]}>{children}</Text>
    </View>
  );
}

/** Grouped content on a lifted surface, matching the referenced input field. */
export function IntroPanel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return <View style={[styles.panel, style]}>{children}</View>;
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
  const color = {
    accent: introTheme.accent,
    neutral: introTheme.muted,
    premium: introTheme.premium,
  }[tone];

  return (
    <View style={styles.point}>
      <View style={[styles.pointIcon, { borderColor: `${color}40` }]}>
        <PhosphorIcon color={color} name={icon} size="compact" />
      </View>
      <View style={styles.pointText}>
        <Text style={styles.pointTitle}>{title}</Text>
        {body ? <Text style={styles.pointBody}>{body}</Text> : null}
      </View>
    </View>
  );
}

/**
 * A checkbox on the dark canvas.
 *
 * Selected state fills the whole control in sand rather than only marking the
 * box, following the reference input: at rest a hairline, once chosen a filled
 * surface that reads from across the screen.
 */
export function IntroCheckbox({
  checked,
  label,
  onChange,
  testID,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [
        styles.checkbox,
        {
          backgroundColor: checked ? introTheme.sandSoft : "transparent",
          borderColor: checked ? introTheme.sandBorder : introTheme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.checkboxBox,
          {
            backgroundColor: checked ? introTheme.sand : "transparent",
            borderColor: checked ? introTheme.sand : introTheme.borderStrong,
          },
        ]}
      >
        {checked ? (
          <PhosphorIcon color={introTheme.onSand} name="check" size="inline" />
        ) : null}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
}

/** Primary/secondary action. Fully rounded, echoing the reference controls. */
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
  const filled = tone !== "secondary";
  const background =
    tone === "premium"
      ? introTheme.premium
      : tone === "primary"
        ? introTheme.accent
        : "transparent";
  const labelColor = filled ? introTheme.onAccent : introTheme.text;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor: filled ? "transparent" : introTheme.borderStrong,
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
  badge: {
    alignSelf: "flex-start",
    borderRadius: introRadius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  body: {
    color: introTheme.textSecondary,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
  checkbox: {
    alignItems: "center",
    borderRadius: introRadius.control,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  checkboxBox: {
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1.5,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  checkboxLabel: {
    color: introTheme.text,
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 19,
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
  panel: {
    backgroundColor: introTheme.panel,
    borderColor: introTheme.border,
    borderRadius: introRadius.panel,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
    padding: 18,
  },
  point: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  pointBody: {
    color: introTheme.textSecondary,
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
    color: introTheme.text,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    ...textStyles.screenTitle,
    color: introTheme.text,
    // 30 left longer headings breaking with a single word on line two.
    fontSize: 27,
    lineHeight: 33,
  },
});
