import React from "react";
import type { StyleProp, TextStyle } from "react-native";

import { Icon } from "@ant-design/react-native";
import type { IconNames } from "@ant-design/react-native/lib/icon";

export const ANT_ICON_SIZE = {
  inline: 14,
  compact: 16,
  control: 20,
  navigation: 24,
  prominent: 28,
  feature: 32,
  hero: 40,
} as const;

export const MIN_ICON_TOUCH_TARGET = 44;

export type AntIconName = IconNames;
export type AntIconSize = keyof typeof ANT_ICON_SIZE;

export function resolveAntIconSize(size: AntIconSize) {
  return ANT_ICON_SIZE[size];
}

export function AntIcon({
  color,
  name,
  size = "control",
  style,
  testID,
}: {
  color: string;
  name: AntIconName;
  size?: AntIconSize;
  style?: StyleProp<TextStyle>;
  testID?: string;
}) {
  return (
    <Icon
      accessible={false}
      importantForAccessibility="no"
      name={name}
      size={resolveAntIconSize(size)}
      color={color}
      style={style}
      testID={testID ?? `ant-icon-${name}`}
    />
  );
}
