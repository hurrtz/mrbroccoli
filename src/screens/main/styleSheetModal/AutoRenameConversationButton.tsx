import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles";

interface AutoRenameConversationButtonProps {
  canRename: boolean;
  renaming: boolean;
  onPress: () => void;
}

export function AutoRenameConversationButton({
  canRename,
  renaming,
  onPress,
}: AutoRenameConversationButtonProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <TouchableOpacity
      testID="auto-rename-conversation"
      style={[
        styles.styleSheetSecondaryButton,
        {
          backgroundColor: canRename ? colors.accentSoft : colors.surfaceAlt,
          borderColor: canRename ? colors.borderStrong : colors.border,
        },
      ]}
      disabled={!canRename}
      onPress={onPress}
      activeOpacity={0.72}
      accessibilityRole="button"
      accessibilityState={{ disabled: !canRename }}
    >
      {renaming ? (
        <ActivityIndicator size="small" color={colors.accent} />
      ) : null}
      <Text
        style={[
          styles.styleSheetSecondaryButtonText,
          { color: canRename ? colors.accent : colors.textMuted },
        ]}
      >
        {renaming
          ? t("conversationTitleGenerating")
          : t("conversationTitleGenerate")}
      </Text>
    </TouchableOpacity>
  );
}
