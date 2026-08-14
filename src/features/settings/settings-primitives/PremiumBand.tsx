import React from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export function PremiumBand({
  actionLabel,
  copy,
  onPress,
  premiumLabel,
  testID,
}: {
  actionLabel: string;
  copy: string;
  onPress: () => void;
  premiumLabel: string;
  testID?: string;
}) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const { width } = useWindowDimensions();
  const sheen = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduceMotion) {
      sheen.stopAnimation();
      sheen.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1_760),
        Animated.timing(sheen, {
          toValue: 1,
          duration: 960,
          useNativeDriver: true,
        }),
        Animated.delay(480),
        Animated.timing(sheen, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, sheen]);

  return (
    <LinearGradient
      testID={testID}
      colors={[
        colors.premiumGradientSoftStart,
        colors.premiumGradientSoftMiddle,
        colors.premiumGradientSoftEnd,
      ]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.band, { borderTopColor: colors.premiumBorder }]}
    >
      {!reduceMotion ? (
        <AnimatedGradient
          pointerEvents="none"
          colors={["transparent", colors.premiumSheen, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.sheen,
            {
              transform: [
                { skewX: "-18deg" },
                {
                  translateX: sheen.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-120, width + 120],
                  }),
                },
              ],
            },
          ]}
        />
      ) : null}
      <LinearGradient
        colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
        style={[styles.badge, { shadowColor: colors.premiumGradientEnd }]}
        testID={testID ? `${testID}-badge` : undefined}
      >
        <PhosphorIcon
          name="thunderbolt"
          size="compact"
          color={colors.premiumForeground}
        />
      </LinearGradient>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.premium }]}>
          {premiumLabel}
        </Text>
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {copy}
        </Text>
      </View>
      <Pressable
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.actionTarget,
          pressed ? styles.pressed : null,
        ]}
      >
        <LinearGradient
          colors={[colors.premiumGradientStart, colors.premiumGradientEnd]}
          style={[styles.action, { shadowColor: colors.premiumGradientEnd }]}
        >
          <Text
            style={[styles.actionText, { color: colors.premiumForeground }]}
          >
            {actionLabel}
          </Text>
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  band: {
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 100,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  supporting: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  actionTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  action: {
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  actionText: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 17,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
