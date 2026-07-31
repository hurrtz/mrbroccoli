import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntIcon } from "../design-system/AntIcon";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { fonts } from "../theme/typography";
import type { ToastTone } from "../types";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  onRetry?: () => void;
  duration?: number;
  tone?: ToastTone;
}

export function Toast({
  message,
  visible,
  onDismiss,
  onRetry,
  duration = 4000,
  tone = "info",
}: ToastProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withTiming(0, { duration: 200 });

      if (!onRetry) {
        opacity.value = withDelay(duration, withTiming(0, { duration: 200 }));
        translateY.value = withDelay(
          duration,
          withTiming(-20, { duration: 200 }),
        );
        const timer = setTimeout(onDismiss, duration + 200);
        return () => clearTimeout(timer);
      }
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-20, { duration: 200 });
    }
  }, [duration, onDismiss, onRetry, opacity, translateY, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  const toneColor =
    tone === "danger"
      ? colors.danger
      : tone === "success"
        ? colors.success
        : colors.accent;
  const toneBackground =
    tone === "danger"
      ? `${colors.danger}12`
      : tone === "success"
        ? `${colors.success}18`
        : colors.accentSoft;

  return (
    <Animated.View
      testID="toast"
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: tone === "info" ? colors.border : toneColor,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.accentStripe, { backgroundColor: toneColor }]} />
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: toneBackground, borderColor: toneColor },
        ]}
      >
        <AntIcon
          name={tone === "success" ? "check" : "exclamation-circle"}
          size="compact"
          color={toneColor}
        />
      </View>
      <Text
        accessibilityLiveRegion={tone === "danger" ? "assertive" : "polite"}
        accessibilityRole="alert"
        style={[styles.message, { color: colors.text }]}
      >
        {message}
      </Text>
      <View style={styles.actions}>
        {onRetry && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: toneBackground, borderColor: toneColor },
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("retry")}
            onPress={() => {
              onRetry();
              onDismiss();
            }}
          >
            <Text style={[styles.retry, { color: toneColor }]}>
              {t("retry")}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.dismissButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={t("dismiss")}
        >
          <AntIcon
            name="close"
            size="compact"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    padding: 14,
    paddingLeft: 0,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1000,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  accentStripe: {
    alignSelf: "stretch",
    width: 5,
    marginRight: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    fontFamily: fonts.body,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 12,
  },
  retryButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retry: {
    fontSize: 13,
    fontFamily: fonts.display,
  },
  dismissButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
