import React from "react";
import {
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Button } from "@ant-design/react-native";

import { useTheme } from "../theme/ThemeContext";
import {
  AntIcon,
  MIN_ICON_TOUCH_TARGET,
  type AntIconName,
  type AntIconSize,
} from "./AntIcon";

export function AntIconButton({
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
  icon?: AntIconName;
  iconNode?: React.ReactNode;
  iconColor?: string;
  iconSize?: AntIconSize;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const { colors } = useTheme();

  return (
    <Button
      testID={testID}
      type="ghost"
      size="small"
      style={StyleSheet.flatten([
        styles.button,
        {
          backgroundColor: active ? colors.accentSoft : "transparent",
          borderColor: active ? colors.accent : "transparent",
        },
        style,
      ])}
      activeStyle={{ backgroundColor: colors.surfaceAlt }}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
    >
      {iconNode ??
        (icon ? (
          <AntIcon
            name={icon}
            size={iconSize}
            color={
              iconColor ??
              (active ? colors.accent : colors.textSecondary)
            }
          />
        ) : null)}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: MIN_ICON_TOUCH_TARGET,
    height: MIN_ICON_TOUCH_TARGET,
    minWidth: MIN_ICON_TOUCH_TARGET,
    minHeight: MIN_ICON_TOUCH_TARGET,
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
  },
});
