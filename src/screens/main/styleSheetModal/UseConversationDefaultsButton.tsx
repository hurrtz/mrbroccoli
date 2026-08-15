import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { PhosphorIcon } from "../../../design-system/PhosphorIcon";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles";

export function UseConversationDefaultsButton({
  onPress,
}: {
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.72}
      onPress={onPress}
      style={[
        styles.styleSheetSecondaryButton,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
      testID="use-conversation-defaults"
    >
      <PhosphorIcon color={colors.textSecondary} name="reload" size="compact" />
      <Text
        style={[
          styles.styleSheetSecondaryButtonText,
          { color: colors.textSecondary },
        ]}
      >
        {t("useConversationDefaults")}
      </Text>
    </TouchableOpacity>
  );
}
