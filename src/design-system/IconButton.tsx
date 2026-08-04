import React from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../theme/ThemeContext";
import {
  PhosphorIcon,
  MIN_ICON_TOUCH_TARGET,
  type IconSize,
  type PhosphorIconName,
} from "./PhosphorIcon";

export function IconButton({
  accessibilityLabel,
  active = false,
  disabled = false,
  icon,
  iconNode,
  iconColor,
  iconSize = "control",
  onPress,
  style,
  testID,
}: {
  accessibilityLabel: string;
  active?: boolean;
  disabled?: boolean;
  icon?: PhosphorIconName;
  iconNode?: React.ReactNode;
  iconColor?: string;
  iconSize?: IconSize;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      testID={testID}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed
            ? colors.surfaceAlt
            : active
              ? colors.accentSoft
              : "transparent",
          borderColor: active ? colors.accent : "transparent",
        },
        style,
        disabled ? styles.disabled : null,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {iconNode ??
        (icon ? (
          <PhosphorIcon
            name={icon}
            size={iconSize}
            color={iconColor ?? (active ? colors.accent : colors.textSecondary)}
          />
        ) : null)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: MIN_ICON_TOUCH_TARGET,
    height: MIN_ICON_TOUCH_TARGET,
    minWidth: MIN_ICON_TOUCH_TARGET,
    minHeight: MIN_ICON_TOUCH_TARGET,
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
  },
  disabled: { opacity: 0.45 },
});
