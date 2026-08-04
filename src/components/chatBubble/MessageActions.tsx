import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { Modal } from "../../design-system/NativeControls";

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
  if (state === "speaking") {
    return <PhosphorIcon name="stop" size="control" color={color} />;
  }

  if (state === "preparing") {
    return <PreparingRepeatIcon color={color} />;
  }

  return <PhosphorIcon name="sound" size="control" color={color} />;
}

function PreparingRepeatIcon({ color }: { color: string }) {
  const rotation = useSharedValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    cancelAnimation(rotation);
    rotation.value = reducedMotion
      ? 0
      : withRepeat(
          withTiming(360, {
            duration: 1100,
            easing: Easing.linear,
          }),
          -1,
          false,
        );

    return () => cancelAnimation(rotation);
  }, [reducedMotion, rotation]);

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={rotationStyle}>
      <PhosphorIcon name="loading" size="control" color={color} />
    </Animated.View>
  );
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
  branchOrigin,
  onCopy,
  onEdit,
  onBranch,
  onOpenBranchSource,
  onSaveInsight,
  onShare,
  onRepeat,
  repeatState = "idle",
}: Pick<
  ChatBubbleProps,
  | "message"
  | "branchOrigin"
  | "onCopy"
  | "onEdit"
  | "onBranch"
  | "onOpenBranchSource"
  | "onSaveInsight"
  | "onShare"
  | "onRepeat"
  | "repeatState"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { confirmed: copyConfirmed, showConfirmation: showCopyConfirmation } =
    useTimedConfirmation(message.id);
  const [moreActionsVisible, setMoreActionsVisible] = useState(false);
  const userSecondaryActions = message.role === "user";
  const hasMoreActions = Boolean(
    onSaveInsight || (userSecondaryActions && (onCopy || onShare || onRepeat)),
  );

  const handleCopyPress = async () => {
    try {
      if (await onCopy?.(message)) {
        showCopyConfirmation();
      }
    } catch {
      // The owning action reports clipboard failures; keep the button neutral.
    }
  };

  if (
    !onCopy &&
    !onEdit &&
    !onBranch &&
    !(branchOrigin?.parentAvailable && onOpenBranchSource) &&
    !onSaveInsight &&
    !onShare &&
    !onRepeat
  ) {
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
      {onEdit ? (
        <TouchableOpacity
          testID={`message-edit-action-${message.id}`}
          style={[
            styles.iconAction,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
          onPress={() => onEdit(message)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("correctTranscript")}
        >
          <PhosphorIcon
            name="edit"
            size="control"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
      {onBranch ? (
        <TouchableOpacity
          testID={`message-branch-action-${message.id}`}
          style={[
            styles.iconAction,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            void onBranch(message);
          }}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("branchFromHere")}
        >
          <PhosphorIcon
            name="branch"
            size="control"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
      {branchOrigin?.parentAvailable && onOpenBranchSource ? (
        <TouchableOpacity
          testID={`message-branch-back-action-${message.id}`}
          style={[
            styles.textAction,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.borderStrong,
            },
          ]}
          onPress={() =>
            onOpenBranchSource(
              branchOrigin.parentConversationId,
              branchOrigin.parentMessageId,
            )
          }
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("backToForkPoint")}
        >
          <PhosphorIcon name="left" size="compact" color={colors.accent} />
          <Text style={[styles.textActionLabel, { color: colors.accent }]}>
            {t("backToForkPoint")}
          </Text>
        </TouchableOpacity>
      ) : null}
      {onCopy && !userSecondaryActions ? (
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
          <PhosphorIcon
            name={copyConfirmed ? "check" : "copy"}
            size="control"
            color={
              copyConfirmed
                ? getAccessibleForeground(colors.success)
                : colors.textSecondary
            }
          />
        </TouchableOpacity>
      ) : null}
      {onShare && !userSecondaryActions ? (
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
          <PhosphorIcon
            name="share-alt"
            size="control"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
      {onRepeat && !userSecondaryActions ? (
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
      {hasMoreActions ? (
        <TouchableOpacity
          testID={`message-more-actions-${message.id}`}
          style={[
            styles.iconAction,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setMoreActionsVisible(true)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel={t("conversationActions")}
        >
          <PhosphorIcon
            name="ellipsis-vertical"
            size="control"
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
      {hasMoreActions ? (
        <Modal
          visible={moreActionsVisible}
          title={t("conversationActions")}
          onClose={() => setMoreActionsVisible(false)}
          footer={[
            {
              text: t("done"),
              onPress: () => setMoreActionsVisible(false),
            },
          ]}
        >
          <View style={styles.moreActionList}>
            {onSaveInsight ? (
              <Pressable
                testID={`message-save-insight-action-${message.id}`}
                style={styles.moreAction}
                onPress={() => {
                  setMoreActionsVisible(false);
                  onSaveInsight(message);
                }}
                accessibilityRole="button"
                accessibilityLabel={t("saveAsInsight")}
              >
                <PhosphorIcon
                  name="file-text"
                  size="control"
                  color={colors.textSecondary}
                />
                <Text style={[styles.moreActionText, { color: colors.text }]}>
                  {t("saveAsInsight")}
                </Text>
              </Pressable>
            ) : null}
            {userSecondaryActions && onCopy ? (
              <Pressable
                style={styles.moreAction}
                onPress={() => {
                  setMoreActionsVisible(false);
                  void handleCopyPress();
                }}
                accessibilityRole="button"
                accessibilityLabel={t("copy")}
              >
                <PhosphorIcon
                  name="copy"
                  size="control"
                  color={colors.textSecondary}
                />
                <Text style={[styles.moreActionText, { color: colors.text }]}>
                  {t("copy")}
                </Text>
              </Pressable>
            ) : null}
            {userSecondaryActions && onShare ? (
              <Pressable
                style={styles.moreAction}
                onPress={() => {
                  setMoreActionsVisible(false);
                  onShare(message);
                }}
                accessibilityRole="button"
                accessibilityLabel={t("share")}
              >
                <PhosphorIcon
                  name="share-alt"
                  size="control"
                  color={colors.textSecondary}
                />
                <Text style={[styles.moreActionText, { color: colors.text }]}>
                  {t("share")}
                </Text>
              </Pressable>
            ) : null}
            {userSecondaryActions && onRepeat ? (
              <Pressable
                style={styles.moreAction}
                onPress={() => {
                  setMoreActionsVisible(false);
                  onRepeat(message);
                }}
                accessibilityRole="button"
                accessibilityLabel={t("repeatReply")}
              >
                <PhosphorIcon
                  name="sound"
                  size="control"
                  color={colors.textSecondary}
                />
                <Text style={[styles.moreActionText, { color: colors.text }]}>
                  {t("repeatReply")}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
