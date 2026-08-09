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
import { MIN_ICON_TOUCH_TARGET, PhosphorIcon } from "./PhosphorIcon";
import type { PhosphorIconName } from "./PhosphorIcon";

/**
 * A 44pt control with a quiet label beneath it, for the row under the orb.
 *
 * **Decision:** the label is neutral in both states and the well carries the
 * state. A label that changed with the state would have to be legible as two
 * different words in nineteen languages under a 44pt target, and the state
 * would then be told twice and could disagree with itself.
 */
export function OrbSatellite({
  accessibilityLabel,
  active = false,
  icon,
  kind = "action",
  label,
  onPress,
  style,
  testID,
}: {
  /** Accessible name when the visible label is too terse. */
  accessibilityLabel?: string;
  /** Only meaningful for toggles. */
  active?: boolean;
  icon: PhosphorIconName;
  /** Momentary action, or a switch that stays on. */
  kind?: "action" | "toggle";
  /** Shown under the control. One or two words; it must survive 19 languages. */
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();
  const toggle = kind === "toggle";

  return (
    <View style={[styles.satellite, style]}>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole={toggle ? "switch" : "button"}
        accessibilityState={toggle ? { checked: active } : undefined}
        onPress={onPress}
        style={({ pressed }) => [
          styles.well,
          {
            backgroundColor:
              toggle && active
                ? colors.accentSoft
                : pressed
                  ? colors.surfaceAlt
                  : "transparent",
            // A toggle is round because the well is the state; an action stays
            // borderless so the two read as different kinds of thing.
            borderColor: toggle
              ? active
                ? colors.accent
                : colors.border
              : "transparent",
            borderRadius: toggle ? MIN_ICON_TOUCH_TARGET / 2 : 12,
            opacity: pressed ? 0.68 : 1,
          },
        ]}
        testID={testID}
      >
        <PhosphorIcon
          color={active ? colors.accent : colors.textSecondary}
          name={icon}
          size="control"
        />
      </Pressable>
      <Text
        // The label is decorative here: the control above it already carries
        // the accessible name, so announcing both repeats the word.
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        numberOfLines={2}
        style={[styles.label, { color: colors.textSecondary }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.75,
    textAlign: "center",
    textTransform: "uppercase",
  },
  satellite: { alignItems: "center", gap: 4, width: 64 },
  well: {
    alignItems: "center",
    borderWidth: 1,
    height: MIN_ICON_TOUCH_TARGET,
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
  },
});
