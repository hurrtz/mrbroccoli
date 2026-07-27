import React from "react";
import { Text, View } from "react-native";
import { Picker } from "../../../components/Picker";
import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { styles } from "../styles";

interface ConversationVoiceSectionProps {
  onChange: (voice: string) => void;
  routeLabel: string;
  value: string;
  voiceOptions: { value: string; label: string }[];
}

export function ConversationVoiceSection({
  onChange,
  routeLabel,
  value,
  voiceOptions,
}: ConversationVoiceSectionProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <View
      testID="conversation-settings-voice"
      style={styles.styleSheetGroup}
    >
      <Text
        style={[styles.styleSheetGroupLabel, { color: colors.textMuted }]}
      >
        {t("ttsVoice")}
      </Text>
      <Text
        style={[
          styles.styleSheetDescription,
          { color: colors.textSecondary },
        ]}
      >
        {t("conversationVoiceDescription", { route: routeLabel })}
      </Text>
      <Picker
        label={t("ttsVoice")}
        value={value}
        options={voiceOptions}
        onChange={onChange}
        dropdownLabel={routeLabel}
        hideLabel
        containerStyle={styles.styleSheetVoicePicker}
      />
    </View>
  );
}
