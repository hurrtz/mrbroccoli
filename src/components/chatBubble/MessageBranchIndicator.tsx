import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { ChatBubbleProps } from "./types";
import { styles } from "./styles";

export function MessageBranchIndicator({
  messageId,
  branchChildren = [],
  branchOrigin,
  onOpenBranches,
  onOpenBranchSource,
}: Pick<
  ChatBubbleProps,
  | "branchChildren"
  | "branchOrigin"
  | "onOpenBranches"
  | "onOpenBranchSource"
> & { messageId: string }) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  if (!branchOrigin && branchChildren.length === 0) {
    return null;
  }

  const originLabel = branchOrigin?.parentAvailable
    ? branchOrigin.parentTitle
      ? `${t("branchStartsHere")} · ${branchOrigin.parentTitle}`
      : t("branchStartsHere")
    : t("branchSourceUnavailable");
  const originContent = branchOrigin ? (
    <>
      <PhosphorIcon name="branch" size="inline" color={colors.accent} />
      <Text
        style={[styles.branchIndicatorText, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {originLabel}
      </Text>
    </>
  ) : null;

  return (
    <View
      testID={`message-branch-indicator-${messageId}`}
      style={styles.branchIndicatorList}
    >
      {branchOrigin ? (
        branchOrigin.parentAvailable && onOpenBranchSource ? (
          <TouchableOpacity
            testID={`message-branch-source-${messageId}`}
            style={[
              styles.branchIndicator,
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
            accessibilityRole="button"
            accessibilityLabel={originLabel}
            activeOpacity={0.88}
          >
            {originContent}
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.branchIndicator,
              {
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
              },
            ]}
          >
            {originContent}
          </View>
        )
      ) : null}
      {branchChildren.length > 0 ? (
        <TouchableOpacity
          testID={`message-branch-children-${messageId}`}
          style={[
            styles.branchIndicator,
            {
              backgroundColor: colors.accentSoft,
              borderColor: colors.borderStrong,
            },
          ]}
          onPress={() => onOpenBranches?.(branchChildren)}
          disabled={!onOpenBranches}
          accessibilityRole="button"
          accessibilityState={{ disabled: !onOpenBranches }}
          accessibilityLabel={t("branchCount", {
            count: branchChildren.length,
          })}
          activeOpacity={0.88}
        >
          <PhosphorIcon name="branch" size="inline" color={colors.accent} />
          <Text
            style={[styles.branchIndicatorText, { color: colors.accent }]}
          >
            {t("branchCount", { count: branchChildren.length })}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
