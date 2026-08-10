import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { fonts } from "../theme/typography";
import { useTheme } from "../theme/ThemeContext";
import {
  MIN_ICON_TOUCH_TARGET,
  PhosphorIcon,
  type PhosphorIconName,
} from "./PhosphorIcon";

/**
 * A 44pt control with a quiet label beneath it, sitting under the orb.
 * Toggles carry a round well and tint when on; actions are momentary and
 * stay borderless. The label never carries the state — the well does — so it
 * can hold a legible neutral in both appearances.
 */
export function OrbSatellite({
  icon,
  label,
  accessibilityLabel,
  kind = "action",
  active = false,
  onPress,
  style,
  testID,
}: {
  icon: PhosphorIconName;
  /** Shown under the control, translated by the caller. One or two words. */
  label: string;
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Momentary action, or a switch that stays on. Defaults to action. */
  kind?: "action" | "toggle";
  /** Only meaningful for toggles. */
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();
  const toggle = kind === "toggle";
  const tint = active ? colors.accent : colors.textSecondary;

  return (
    <View style={[styles.column, style]}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole={toggle ? "switch" : "button"}
        accessibilityState={toggle ? { checked: !!active } : undefined}
        onPress={onPress}
        style={[
          styles.well,
          toggle
            ? {
                borderRadius: MIN_ICON_TOUCH_TARGET / 2,
                borderColor: active ? colors.accent : colors.border,
                backgroundColor: active ? colors.accentSoft : "transparent",
              }
            : styles.actionWell,
        ]}
        testID={testID ?? `orb-satellite-${icon}`}
      >
        <PhosphorIcon color={tint} name={icon} size="control" />
      </Pressable>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: colors.textSecondary }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: "center",
    gap: 4,
    width: 64,
  },
  well: {
    alignItems: "center",
    borderWidth: 1,
    height: MIN_ICON_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
  },
  actionWell: {
    borderColor: "transparent",
    borderRadius: 12,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.75,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
