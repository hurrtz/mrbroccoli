import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { useTheme } from "../theme/ThemeContext";

export function Switch({
  disabled = false,
  label,
  onChange,
  testID,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: boolean) => void;
  testID?: string;
  value: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      hitSlop={0}
      onPress={(event) => {
        event?.stopPropagation();
        onChange(!value);
      }}
      style={({ pressed }) => [
        styles.target,
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: value ? colors.accent : colors.borderStrong,
          },
        ]}
      >
        <View
          style={[
            styles.thumb,
            {
              backgroundColor: colors.onActiveControl,
              shadowColor: colors.glow,
              transform: [{ translateX: value ? 18 : 0 }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: 52,
    height: 44,
    marginVertical: -8,
    marginRight: -3,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  track: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.72,
  },
  disabled: {
    opacity: 0.45,
  },
});
