import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { introTheme } from "./introTheme";
import type { TranslateFn } from "../../screens/main/shared";

interface IntroStepperProps {
  count: number;
  index: number;
  onSelect: (index: number) => void;
  t: TranslateFn;
}

/**
 * Progress indicator for the introduction.
 *
 * Dots for the steps, a dash for the current one. A plain "step 4 of 6" told a
 * reader where they were but nothing about what they had passed or skipped;
 * the shape does both at a glance, and every marker is tappable so the flow
 * can be walked in either direction.
 *
 * Each dot keeps a 44pt touch target while drawing at 8pt, so the row stays
 * visually quiet without becoming hard to hit.
 */
export function IntroStepper({ count, index, onSelect, t }: IntroStepperProps) {
  return (
    <View
      accessibilityRole="tablist"
      style={styles.row}
      testID="intro-stepper"
    >
      {Array.from({ length: count }, (_, step) => {
        const current = step === index;
        const visited = step < index;
        return (
          <Pressable
            accessibilityLabel={t("introStepOfTotal", {
              step: step + 1,
              total: count,
            })}
            accessibilityRole="tab"
            accessibilityState={{ selected: current }}
            hitSlop={8}
            key={step}
            onPress={() => onSelect(step)}
            style={styles.target}
            testID={`intro-stepper-dot-${step}`}
          >
            <View
              style={[
                styles.marker,
                current ? styles.markerCurrent : null,
                {
                  backgroundColor: current
                    ? introTheme.accent
                    : visited
                      ? introTheme.borderStrong
                      : introTheme.border,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  markerCurrent: {
    width: 26,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
  },
  target: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minWidth: 20,
    paddingHorizontal: 3,
  },
});
