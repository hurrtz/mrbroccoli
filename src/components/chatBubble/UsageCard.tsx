import React from "react";
import { Text, View } from "react-native";

import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { formatTokenCount } from "../../utils/usageStats";
import { styles } from "./styles";
import type { ChatBubbleProps } from "./types";

export function UsageCard({
  message,
  showUsageStats,
}: Pick<ChatBubbleProps, "message" | "showUsageStats">) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const usage =
    message.role === "assistant" && showUsageStats ? message.usage : undefined;

  if (!usage) {
    return null;
  }

  return (
    <View
      style={[
        styles.usageCard,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.usageText, { color: colors.textSecondary }]}>
        {t("estimatedUsageInline", {
          prompt: formatTokenCount(usage.promptTokens),
          completion: formatTokenCount(usage.completionTokens),
          total: formatTokenCount(usage.totalTokens),
        })}
      </Text>
    </View>
  );
}
