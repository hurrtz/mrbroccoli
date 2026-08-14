import React from "react";
import { Pressable, Text, View } from "react-native";

import { PhosphorIcon } from "../../design-system/PhosphorIcon";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import type { ChatBubbleProps } from "./types";
import { styles } from "./styles";

function BranchChip({
  accessibilityLabel,
  label,
  onPress,
  testID,
}: {
  accessibilityLabel: string;
  label: string;
  onPress?: () => void;
  testID: string;
}) {
  const { colors } = useTheme();
  const tappable = !!onPress;
  const chip = (
    <View
      testID={`${testID}-chip`}
      style={[
        styles.branchIndicator,
        {
          backgroundColor: tappable ? colors.accentSoft : colors.surfaceAlt,
          borderColor: tappable ? colors.borderStrong : colors.border,
        },
      ]}
    >
      <PhosphorIcon name="branch" size="inline" color={colors.accent} />
      <Text
        numberOfLines={1}
        style={[
          styles.branchIndicatorText,
          { color: tappable ? colors.accent : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return tappable ? (
    <Pressable
      testID={testID}
      style={({ pressed }) => [
        styles.branchIndicatorTarget,
        pressed ? styles.branchIndicatorTargetPressed : null,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {chip}
    </Pressable>
  ) : (
    <View testID={testID} style={styles.branchIndicatorTarget}>
      {chip}
    </View>
  );
}

export function MessageBranchIndicator({
  messageId,
  branchChildren = [],
  branchOrigin,
  onOpenBranches,
  onOpenBranchSource,
}: Pick<
  ChatBubbleProps,
  "branchChildren" | "branchOrigin" | "onOpenBranches" | "onOpenBranchSource"
> & { messageId: string }) {
  const { t } = useLocalization();

  if (!branchOrigin && branchChildren.length === 0) {
    return null;
  }

  const originLabel = branchOrigin?.parentAvailable
    ? branchOrigin.parentTitle
      ? t("branchContextKeptFrom", { title: branchOrigin.parentTitle })
      : t("branchContextKept")
    : t("branchSourceUnavailable");

  return (
    <View
      testID={`message-branch-indicator-${messageId}`}
      style={styles.branchIndicatorList}
    >
      {branchOrigin ? (
        <BranchChip
          testID={`message-branch-source-${messageId}`}
          label={originLabel}
          accessibilityLabel={originLabel}
          onPress={
            branchOrigin.parentAvailable && onOpenBranchSource
              ? () =>
                  onOpenBranchSource(
                    branchOrigin.parentConversationId,
                    branchOrigin.parentMessageId,
                  )
              : undefined
          }
        />
      ) : null}
      {branchChildren.length > 0 ? (
        <BranchChip
          testID={`message-branch-children-${messageId}`}
          label={t("branchCount", { count: branchChildren.length })}
          accessibilityLabel={t("branchCount", {
            count: branchChildren.length,
          })}
          onPress={
            onOpenBranches ? () => onOpenBranches(branchChildren) : undefined
          }
        />
      ) : null}
    </View>
  );
}
