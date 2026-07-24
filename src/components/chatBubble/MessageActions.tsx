import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import Feather from "@expo/vector-icons/Feather";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useLocalization } from "../../i18n";
import { getAccessibleForeground } from "../../theme/colors";
import { useTheme } from "../../theme/ThemeContext";
import { styles } from "./styles";
import type { ChatBubbleProps, RepeatState } from "./types";

const COPY_CONFIRMATION_DURATION_MS = 3_000;

function RepeatActionIcon({
  state,
  color,
}: {
  state: RepeatState;
  color: string;
}) {
  const rotation = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    cancelAnimation(rotation);

    if (state !== "preparing" || reducedMotion) {
      rotation.value = 0;
    } else {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1100,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    }

    return () => cancelAnimation(rotation);
  }, [reducedMotion, rotation, state]);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (state === "speaking") {
    return <Feather name="square" size={14} color={color} />;
  }

  if (state === "preparing") {
    return (
      <Animated.View style={rotationStyle}>
        <Feather name="loader" size={14} color={color} />
      </Animated.View>
    );
  }

  return <Feather name="volume-2" size={14} color={color} />;
}

function useTimedConfirmation(resetKey: string) {
  const [confirmed, setConfirmed] = useState(false);
  const isMountedRef = useRef(true);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  useEffect(() => {
    setConfirmed(false);

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [resetKey]);

  const showConfirmation = () => {
    if (!isMountedRef.current) {
      return;
    }

    setConfirmed(true);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => {
      resetTimeoutRef.current = null;
      setConfirmed(false);
    }, COPY_CONFIRMATION_DURATION_MS);
  };

  return { confirmed, showConfirmation };
}

export function MessageActions({
  message,
  onCopy,
  onShare,
  onRepeat,
  repeatState = "idle",
}: Pick<
  ChatBubbleProps,
  "message" | "onCopy" | "onShare" | "onRepeat" | "repeatState"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const {
    confirmed: copyConfirmed,
    showConfirmation: showCopyConfirmation,
  } = useTimedConfirmation(message.id);

  const handleCopyPress = async () => {
    try {
      if (await onCopy?.(message)) {
        showCopyConfirmation();
      }
    } catch {
      // The owning action reports clipboard failures; keep the button neutral.
    }
  };

  if (!onCopy && !onShare && !onRepeat) {
    return null;
  }

  return (
    <View
      testID={`message-actions-${message.id}`}
      style={[
        styles.actionRow,
        {
          backgroundColor: colors.surfaceAlt,
          borderTopColor: colors.border,
        },
      ]}
    >
      {onCopy ? (
        <TouchableOpacity
          testID={`message-copy-action-${message.id}`}
          style={[
            styles.iconAction,
            {
              backgroundColor: copyConfirmed
                ? colors.success
                : colors.surfaceAlt,
              borderColor: copyConfirmed ? colors.success : colors.border,
            },
          ]}
          onPress={() => {
            void handleCopyPress();
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={copyConfirmed ? t("messageCopied") : t("copy")}
        >
          <Feather
            name={copyConfirmed ? "check" : "copy"}
            size={14}
            color={
              copyConfirmed
                ? getAccessibleForeground(colors.success)
                : colors.textSecondary
            }
          />
        </TouchableOpacity>
      ) : null}
      {onShare ? (
        <TouchableOpacity
          style={[
            styles.iconAction,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onShare(message)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("share")}
        >
          <Feather name="share-2" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
      {onRepeat ? (
        <TouchableOpacity
          testID={`message-repeat-action-${message.id}`}
          style={[
            styles.iconAction,
            {
              backgroundColor:
                repeatState === "speaking"
                  ? colors.success
                  : repeatState === "preparing"
                    ? colors.phaseSynthesizing
                    : colors.surfaceAlt,
              borderColor:
                repeatState === "speaking"
                  ? colors.success
                  : repeatState === "preparing"
                    ? colors.phaseSynthesizing
                    : colors.border,
            },
          ]}
          onPress={() => onRepeat(message)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={
            repeatState === "speaking" ? t("stop") : t("repeatReply")
          }
        >
          <RepeatActionIcon
            state={repeatState}
            color={
              repeatState === "speaking"
                ? getAccessibleForeground(colors.success)
                : repeatState === "preparing"
                  ? getAccessibleForeground(colors.phaseSynthesizing)
                  : colors.textSecondary
            }
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
