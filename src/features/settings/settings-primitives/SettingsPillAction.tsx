import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

export function SettingsPillAction({
  danger = false,
  disabled = false,
  label,
  onPress,
  testID,
}: {
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  testID?: string;
}) {
  const { colors } = useTheme();
  const ink = danger ? colors.danger : colors.accent;

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={(event) => {
        event?.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => [
        styles.target,
        { borderColor: ink },
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    minHeight: 44,
    marginVertical: -6,
    marginRight: -6,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.68,
  },
  disabled: {
    opacity: 0.45,
  },
});
