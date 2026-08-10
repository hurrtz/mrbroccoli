import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type { Colors } from "../../../theme/colors";
import type {
  SettingsReadiness,
  SettingsReadinessState,
} from "../../settings-core/readiness";

export type ReadinessStep = "think" | "listen" | "speak" | "search";

const STEPS = [
  { key: "think", labelKey: "settingsReadinessThink" },
  { key: "listen", labelKey: "settingsReadinessListen" },
  { key: "speak", labelKey: "settingsReadinessSpeak" },
  { key: "search", labelKey: "settingsReadinessSearch" },
] as const;

/** Colour lives in the dot; the state word carries it for everyone else. */
function getInk(state: SettingsReadinessState, colors: Colors): string {
  switch (state) {
    case "ready":
      return colors.success;
    case "attention":
      return colors.premium;
    case "broken":
      return colors.danger;
    default:
      return colors.textMuted;
  }
}

/** Filled versus hollow is the second channel, so states separate without colour. */
function isFilled(state: SettingsReadinessState): boolean {
  return state === "ready" || state === "broken";
}

const LARGE_TEXT_FONT_SCALE = 1.35;

/**
 * The four capabilities a conversation needs, on one line: think, listen,
 * speak, search. Each is a 44pt target that opens the setting behind it.
 *
 * Not a stepper, and not in a card: these are independent capabilities, so
 * there are no connectors, no container and no heading. The component bleeds
 * its own padding outwards so the first dot lands flush with the cards
 * around it; drop it straight into the column with no wrapper padding.
 */
export function RuntimeReadiness({
  readiness,
  onSelect,
  style,
}: {
  readiness: SettingsReadiness;
  onSelect: (step: ReadinessStep) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { fontScale } = useWindowDimensions();
  const largeText = fontScale >= LARGE_TEXT_FONT_SCALE;

  return (
    <View
      style={[styles.line, largeText ? styles.lineLargeText : null, style]}
      testID="settings-readiness-line"
    >
      {STEPS.map((step) => {
        const status = readiness[step.key];
        const ink = getInk(status.state, colors);
        const label = t(step.labelKey);

        return (
          <Pressable
            accessibilityHint={t("settingsOpenSection", { section: label })}
            accessibilityLabel={`${label}. ${t(status.summaryKey)}.`}
            accessibilityRole="button"
            key={step.key}
            onPress={() => onSelect(step.key)}
            style={({ pressed }) => [
              styles.step,
              pressed ? { backgroundColor: colors.surfaceAlt } : null,
            ]}
            testID={`settings-readiness-${step.key}`}
          >
            <View
              style={[
                styles.dot,
                {
                  borderColor: ink,
                  backgroundColor: isFilled(status.state)
                    ? ink
                    : "transparent",
                },
              ]}
              testID={`settings-readiness-dot-${step.key}`}
            />
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    // Bleed the touch padding outwards so the first dot lands flush with the
    // left edge of the cards around it. The 6pt item padding keeps the 44pt
    // targets from colliding — neutralise it here, never delete it.
    marginHorizontal: -6,
    marginVertical: -10,
  },
  lineLargeText: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 0,
    marginVertical: 0,
  },
  step: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 6,
  },
  dot: {
    borderRadius: 3.5,
    borderWidth: 1.5,
    height: 7,
    width: 7,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
});
