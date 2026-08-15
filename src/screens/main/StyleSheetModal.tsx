import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import { IconButton } from "../../design-system/IconButton";
import {
  getResponseLengthOptions,
  getResponseToneOptions,
} from "../../features/settings-core/helpers";
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      statusBarTranslucent
    >
      <View
        testID="styleSheetOverlay"
        style={[styles.styleSheetOverlay, { backgroundColor: colors.overlay }]}
      >
        <TouchableOpacity
          testID="styleSheetBackdrop"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />
        <SafeAreaView
          testID="conversation-settings-drawer"
          edges={["bottom", "left", "right"]}
          accessibilityViewIsModal
          style={[
            styles.styleSheetCard,
            { maxHeight: drawerMaxHeight },
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
        >
          <View
            testID="conversation-settings-header"
            style={[
              styles.styleSheetHeader,
              { borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.styleSheetHeaderCopy}>
              <Text
                style={[styles.styleSheetTitle, { color: colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t("styleSheetTitle")}
              </Text>
              <Text
                style={[
                  styles.styleSheetSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {t("styleSheetSubtitle")}
              </Text>
            </View>
            <IconButton
              testID="conversation-settings-close"
              icon="close"
              style={[
                styles.styleSheetCloseButton,
                { backgroundColor: colors.surfaceElevated },
              ]}
              onPress={onClose}
              accessibilityLabel={t("dismiss")}
            />
          </View>

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

          <View
            style={[styles.styleSheetFooter, { borderTopColor: colors.border }]}
          >
            <TouchableOpacity
              style={[
                styles.styleSheetDoneButton,
                { backgroundColor: colors.bubbleUser },
              ]}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.styleSheetDoneButtonText,
                  { color: colors.onPrimary },
                ]}
              >
                {t("setupGuideFinish")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
});
