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
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
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
});
