import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { PhosphorIcon } from "../design-system/PhosphorIcon";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { withAlpha } from "../theme/colors";
import { fonts } from "../theme/typography";
import type { ToastTone } from "../types";

interface ToastProps {
  message: string;
  visible: boolean;
  /** Keep a pending workspace toast behind a focused sheet until it closes. */
  suspended?: boolean;
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
  suspended = false,
  tone = "info",
}: ToastProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;
    opacity.stopAnimation();
    translateY.stopAnimation();

    const presented = visible && !suspended;

    if (presented) {
      Animated.parallel([
        Animated.timing(opacity, {
          duration: 200,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          duration: 200,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();

      if (!onRetry) {
        dismissTimer = setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              duration: 200,
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              duration: 200,
              toValue: -20,
              useNativeDriver: true,
            }),
          ]).start(({ finished }) => {
            if (finished) {
              onDismiss();
            }
          });
        }, duration);
      }
    } else {
      opacity.setValue(0);
      translateY.setValue(-20);
    }

    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
  }, [duration, onDismiss, onRetry, opacity, suspended, translateY, visible]);

  if (!visible || suspended) return null;

  const toneColor =
    tone === "danger"
      ? colors.danger
      : tone === "success"
        ? colors.success
        : colors.accent;
  const toneBackground =
    tone === "danger"
      ? withAlpha(colors.danger, 0.12)
      : tone === "success"
        ? withAlpha(colors.success, 0.12)
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
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View
        testID="toast-icon"
        style={[
          styles.iconWrap,
          { backgroundColor: toneBackground, borderColor: toneColor },
        ]}
      >
        <PhosphorIcon
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
      <View testID="toast-actions" style={styles.actions}>
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
          <PhosphorIcon
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
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    zIndex: 1000,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 5,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
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
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
