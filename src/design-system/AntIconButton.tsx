import React from "react";
import {
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Button, Icon } from "@ant-design/react-native";
import type { IconNames } from "@ant-design/react-native/lib/icon";

import { useTheme } from "../theme/ThemeContext";

export function AntIconButton({
  accessibilityLabel,
  active = false,
  icon,
  iconNode,
  iconColor,
  iconSize = 20,
  onPress,
  style,
  testID,
}: {
  accessibilityLabel: string;
  active?: boolean;
  icon?: IconNames;
  iconNode?: React.ReactNode;
  iconColor?: string;
  iconSize?: number;
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
          <Icon
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
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    paddingHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
  },
});
