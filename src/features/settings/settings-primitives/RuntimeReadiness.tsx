import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { MIN_ICON_TOUCH_TARGET } from "../../../design-system/PhosphorIcon";
import type { TranslateFn } from "../../../screens/main/shared";
import { useTheme } from "../../../theme/ThemeContext";
import { textStyles } from "../../../theme/typography";
import type {
  SettingsReadiness,
  SettingsReadinessState,
} from "../../settings-core/readiness";

export type ReadinessStep = keyof SettingsReadiness;

const STEPS = [
  { key: "think", labelKey: "settingsReadinessThink" },
  { key: "listen", labelKey: "settingsReadinessListen" },
  { key: "speak", labelKey: "settingsReadinessSpeak" },
  { key: "search", labelKey: "settingsReadinessSearch" },
] as const satisfies readonly {
  key: ReadinessStep;
  labelKey: Parameters<TranslateFn>[0];
}[];

/**
 * Filled versus hollow is the second channel, so the four states separate
 * without colour. `attention` and `off` stay hollow; `ready` and `broken` fill.
 */
const FILLED: Record<SettingsReadinessState, boolean> = {
  attention: false,
  broken: true,
  off: false,
  ready: true,
};

/** The 6pt each item carries so two 44pt targets cannot collide. */
const ITEM_INSET = 6;

/**
 * The four capabilities a conversation needs -- think, listen, speak, search --
 * on one line, each a 44pt target that opens the setting behind it.
 *
 * **Decision:** no connectors. An earlier draft chained the four with hairlines,
 * which reads as a progress stepper and promises a sequence. These are
 * independent capabilities; nothing is step 1 of 4.
 *
 * **Decision:** no card and no heading. Four dots with words beside them read as
 * status without being told they are status, and a container around a small line
 * of text makes it look like a section of the page.
 */
export function RuntimeReadiness({
  onSelect,
  readiness,
  style,
  t,
}: {
  /** Opens the setting behind a capability. Omit to render the line inert. */
  onSelect?: (step: ReadinessStep) => void;
  readiness: SettingsReadiness;
  style?: StyleProp<ViewStyle>;
  t: TranslateFn;
}) {
  const { colors } = useTheme();

  const ink: Record<SettingsReadinessState, string> = {
    attention: colors.premium,
    broken: colors.danger,
    off: colors.textMuted,
    ready: colors.success,
  };

  return (
    <View style={[styles.line, style]} testID="runtime-readiness">
      {STEPS.map((step) => {
        const status = readiness[step.key];
        const label = t(step.labelKey);

        return (
          <Pressable
            // Both halves come from the same status, so the spoken state can
            // never disagree with the drawn one. The button role carries the
            // fact that it opens something; an "Open <label> settings" clause
            // would need the label lower-cased, which is not safe across
            // nineteen languages.
            accessibilityLabel={`${label}. ${t(status.summaryKey)}.`}
            accessibilityRole="button"
            disabled={!onSelect}
            key={step.key}
            onPress={onSelect ? () => onSelect(step.key) : undefined}
            style={({ pressed }) => [
              styles.step,
              { opacity: pressed ? 0.68 : 1 },
            ]}
            testID={`runtime-readiness-${step.key}`}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: FILLED[status.state]
                    ? ink[status.state]
                    : "transparent",
                  borderColor: ink[status.state],
                },
              ]}
              testID={`runtime-readiness-dot-${step.key}`}
            />
            {/* The label never takes the dot's colour. Gold on a tinted
                surface measures 4.35:1, under AA, and the state is already
                carried by the dot and spoken in the accessible name. */}
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: 3.5,
    borderWidth: 1.5,
    height: 7,
    width: 7,
  },
  label: { ...textStyles.caption, fontSize: 12, lineHeight: 16 },
  line: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    // The line bleeds its own padding outwards so the first dot lands flush
    // with the edge of the rows around it. The inset itself is what keeps the
    // targets apart, so it is neutralised here rather than deleted.
    marginHorizontal: -ITEM_INSET,
    marginVertical: -10,
  },
  step: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    height: MIN_ICON_TOUCH_TARGET,
    paddingHorizontal: ITEM_INSET,
  },
});
