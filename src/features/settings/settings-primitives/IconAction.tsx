import React from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import {
  PhosphorIcon,
  type PhosphorIconName,
} from "../../../design-system/PhosphorIcon";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useTheme } from "../../../theme/ThemeContext";

export function IconAction({
  danger = false,
  disabled = false,
  icon,
  label,
  onPress,
  spin = false,
  testID,
}: {
  danger?: boolean;
  disabled?: boolean;
  icon: PhosphorIconName;
  label: string;
  onPress?: () => void;
  spin?: boolean;
  testID?: string;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const rotation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!spin || reduceMotion) {
      rotation.stopAnimation();
      rotation.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1_000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, rotation, spin]);

  const glyph = (
    <PhosphorIcon
      name={icon}
      size="compact"
      color={danger ? colors.danger : colors.accent}
    />
  );

  return (
    <Pressable
      testID={testID}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ busy: spin, disabled }}
      disabled={disabled || !onPress}
      hitSlop={0}
      onPress={(event) => {
        event?.stopPropagation?.();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.target,
        pressed ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <View
        testID={testID ? `${testID}-well` : undefined}
        style={[
          styles.well,
          {
            backgroundColor: colors.surface,
            borderColor: danger ? colors.danger : colors.borderStrong,
          },
        ]}
      >
        {spin && !reduceMotion ? (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            {glyph}
          </Animated.View>
        ) : (
          glyph
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: 44,
    height: 44,
    marginVertical: -7,
    marginRight: -8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  well: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.68,
  },
  disabled: {
    opacity: 0.45,
  },
});
