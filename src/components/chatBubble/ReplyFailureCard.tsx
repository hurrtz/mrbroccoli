import React from "react";
import { Pressable, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { styles } from "./styles";
import type { ChatBubbleProps } from "./types";

export function ReplyFailureCard({
  message,
  onRetry,
}: Pick<ChatBubbleProps, "message" | "onRetry">) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const replyFailure = message.metadata?.replyFailure;

  if (message.role !== "user" || !replyFailure) {
    return null;
  }

  return (
    <View
      testID={`reply-failure-card-${message.id}`}
      style={[
        styles.replyFailureCard,
        { borderTopColor: colors.danger },
      ]}
    >
      <View style={styles.replyFailureHeader}>
        <PhosphorIcon
          name="exclamation-circle"
          size="inline"
          color={colors.danger}
        />
        <Text style={[styles.replyFailureTitle, { color: colors.danger }]}>
          {t("replyFailed")}
        </Text>
      </View>
      <Text
        style={[styles.replyFailureMessage, { color: colors.textSecondary }]}
      >
        {replyFailure.message}
      </Text>
      <Text style={[styles.replyFailureHint, { color: colors.textMuted }]}>
        {t("replyFailedHint")}
      </Text>
      {onRetry ? (
        <Pressable
          testID={`reply-failure-retry-${message.id}`}
          style={({ pressed }) => [
            styles.replyFailureAction,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.borderStrong,
            },
            pressed ? styles.subCardActionPressed : null,
          ]}
          onPress={() => onRetry(message)}
          accessibilityRole="button"
          accessibilityLabel={t("retryReply")}
        >
          <PhosphorIcon name="reload" size="inline" color={colors.accent} />
          <Text
            style={[styles.replyFailureActionText, { color: colors.accent }]}
          >
            {t("retry")}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
