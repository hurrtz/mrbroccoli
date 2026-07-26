import React from "react";
import type { PressableProps } from "react-native";

import { Switch } from "@ant-design/react-native";

type NativeAccessibilityProps = Pick<
  PressableProps,
  "accessibilityLabel" | "accessibilityState" | "testID"
>;

export type AntSwitchProps = React.ComponentProps<typeof Switch> &
  NativeAccessibilityProps;

/**
 * Ant forwards native accessibility props to its underlying Pressable, but its
 * published type omits them. Keep the compatibility cast in one place.
 */
export function AntSwitch(props: AntSwitchProps) {
  const AccessibleSwitch = Switch as React.ComponentType<AntSwitchProps>;
  return <AccessibleSwitch {...props} />;
}
