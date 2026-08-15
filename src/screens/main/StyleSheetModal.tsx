import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";

import {
  getResponseLengthOptions,
  getResponseToneOptions,
} from "../../features/settings-core/helpers";
import { SettingsSheet } from "../../features/settings/settings-primitives/SettingsSheet";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { AssistantResponseLength, AssistantResponseTone } from "../../types";

import { styles } from "./styles";
import { AutoRenameConversationButton } from "./styleSheetModal/AutoRenameConversationButton";
import { ConversationVoiceSection } from "./styleSheetModal/ConversationVoiceSection";
import { InstructionSection } from "./styleSheetModal/InstructionSection";
import { StyleChoiceGroup } from "./styleSheetModal/StyleChoiceGroup";
import { UseConversationDefaultsButton } from "./styleSheetModal/UseConversationDefaultsButton";

interface StyleSheetModalProps {
  canAutoRenameConversation: boolean;
  hasOverrides: boolean;
  isAutoRenamingConversation: boolean;
  visible: boolean;
  llmInstructions: string;
  responseLength: AssistantResponseLength;
  responseTone: AssistantResponseTone;
  ttsInstructions: string;
  ttsInstructionsSupported: boolean;
  ttsRouteLabel: string | null;
  ttsVoice: string;
  ttsVoiceOptions: { value: string; label: string }[];
  onChange: (
    partial:
      | { responseLength: AssistantResponseLength }
      | { responseTone: AssistantResponseTone },
  ) => void;
  onLlmInstructionsChange: (instructions: string) => void;
  onTtsInstructionsChange: (instructions: string) => void;
  onTtsVoiceChange: (voice: string) => void;
  onAutoRenameConversation: () => void;
  onClose: () => void;
  onUseDefaults: () => void;
}

export const StyleSheetModal = React.memo(function StyleSheetModal({
  canAutoRenameConversation,
  hasOverrides,
  isAutoRenamingConversation,
  visible,
  llmInstructions,
  responseLength,
  responseTone,
  ttsInstructions,
  ttsInstructionsSupported,
  ttsRouteLabel,
  ttsVoice,
  ttsVoiceOptions,
  onChange,
  onLlmInstructionsChange,
  onTtsInstructionsChange,
  onTtsVoiceChange,
  onAutoRenameConversation,
  onClose,
  onUseDefaults,
}: StyleSheetModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const drawerMaxHeight = Math.max(280, height - (isLandscape ? 12 : 44));

  const lengthOptions = React.useMemo(() => getResponseLengthOptions(t), [t]);
  const toneOptions = React.useMemo(() => getResponseToneOptions(t), [t]);
  return (
    <SettingsSheet
      cardStyle={[
        styles.styleSheetCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.glow,
        },
      ]}
      keyboardAvoiding
      maxHeight={drawerMaxHeight}
      onClose={onClose}
      scrollable={false}
      subtitle={t("styleSheetSubtitle")}
      testID="conversation-settings-drawer"
      title={t("styleSheetTitle")}
      visible={visible}
    >
      <ScrollView
        style={styles.styleSheetScroll}
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[
          styles.styleSheetScrollContent,
          isLandscape ? styles.styleSheetScrollContentLandscape : null,
        ]}
        keyboardDismissMode={isLandscape ? "on-drag" : "interactive"}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={
            isLandscape
              ? styles.styleSheetOptionsRowLandscape
              : styles.styleSheetOptionsColumn
          }
        >
          <StyleChoiceGroup
            testID="conversation-settings-length"
            label={t("adaptiveLength")}
            landscape={isLandscape}
            onChange={(value) => onChange({ responseLength: value })}
            options={lengthOptions}
            value={responseLength}
          />
          <StyleChoiceGroup
            testID="conversation-settings-tone"
            label={t("responseTone")}
            landscape={isLandscape}
            onChange={(value) => onChange({ responseTone: value })}
            options={toneOptions}
            value={responseTone}
          />
        </View>

        {ttsRouteLabel && ttsVoiceOptions.length > 0 ? (
          <ConversationVoiceSection
            onChange={onTtsVoiceChange}
            routeLabel={ttsRouteLabel}
            value={ttsVoice}
            voiceOptions={ttsVoiceOptions}
          />
        ) : null}

        <View
          style={
            isLandscape
              ? styles.styleSheetInstructionRowLandscape
              : styles.styleSheetOptionsColumn
          }
        >
          <InstructionSection
            description={t(
              ttsInstructionsSupported
                ? "conversationTtsInstructionsDescription"
                : "ttsInstructionsUnsupported",
            )}
            editable={ttsInstructionsSupported}
            inputTestID="conversation-tts-instructions"
            label={t("ttsInstructions")}
            landscape={isLandscape}
            onChange={onTtsInstructionsChange}
            placeholder={t("ttsInstructionsPlaceholder")}
            sectionTestID="conversation-settings-tts-instructions"
            value={ttsInstructions}
          />
          <InstructionSection
            description={t("conversationThinkingInstructionsDescription")}
            inputTestID="conversation-llm-instructions"
            label={t("conversationThinkingInstructions")}
            landscape={isLandscape}
            onChange={onLlmInstructionsChange}
            placeholder={t("conversationThinkingInstructionsPlaceholder")}
            sectionTestID="conversation-settings-thinking-instructions"
            value={llmInstructions}
          />
        </View>

        {hasOverrides ? (
          <UseConversationDefaultsButton onPress={onUseDefaults} />
        ) : null}

        <AutoRenameConversationButton
          canRename={canAutoRenameConversation}
          onPress={onAutoRenameConversation}
          renaming={isAutoRenamingConversation}
        />
      </ScrollView>
    </SettingsSheet>
  );
});
