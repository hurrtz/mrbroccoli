import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Colors } from "../../../theme/colors";
import { TranslateFn } from "../shared";
import { voiceTextInputPagerStyles as styles } from "./styles";
import { InputSurface } from "./types";

interface InputSurfaceIndicatorsProps {
  activeSurface: InputSurface;
  colors: Colors;
  disabled: boolean;
  onSelect: (surface: InputSurface) => void;
  t: TranslateFn;
}

const INPUT_SURFACES: InputSurface[] = ["voice", "text"];

export function InputSurfaceIndicators({
  activeSurface,
  colors,
  disabled,
  onSelect,
  t,
}: InputSurfaceIndicatorsProps) {
  return (
    <View style={styles.pageIndicators}>
      {INPUT_SURFACES.map((surface) => {
        const selected = activeSurface === surface;
        return (
          <TouchableOpacity
            key={surface}
            testID={`show-${surface}-input`}
            accessibilityLabel={
              surface === "voice"
                ? t("showVoiceInput")
                : t("showTextInput")
            }
            accessibilityRole="button"
            accessibilityState={{ disabled, selected }}
            activeOpacity={0.7}
            disabled={disabled}
            onPress={() => onSelect(surface)}
            style={styles.pageIndicatorTarget}
          >
            <View
              testID={`${surface}-input-indicator`}
              style={[
                styles.pageIndicator,
                surface === "voice"
                  ? styles.pageIndicatorLeading
                  : styles.pageIndicatorTrailing,
                selected
                  ? styles.pageIndicatorSelected
                  : styles.pageIndicatorIdle,
                {
                  backgroundColor: selected
                    ? colors.accent
                    : colors.borderStrong,
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
