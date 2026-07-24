import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

import { APP_MODAL_ORIENTATIONS } from "../../constants/layout";
import { Picker } from "../../components/Picker";
import {
  getResponseLengthOptions,
  getResponseToneOptions,
} from "../../components/settings/helpers";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { AssistantResponseLength, AssistantResponseTone } from "../../types";

import { styles } from "./styles";

interface StyleSheetModalProps {
  canAutoRenameConversation: boolean;
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
}

export function StyleSheetModal({
  canAutoRenameConversation,
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
}: StyleSheetModalProps) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const cardMaxWidth = isLandscape ? Math.min(width - 40, 760) : 520;

  const lengthOptions = React.useMemo(() => getResponseLengthOptions(t), [t]);
  const toneOptions = React.useMemo(() => getResponseToneOptions(t), [t]);
  const activeLength = lengthOptions.find((o) => o.value === responseLength);
  const activeTone = toneOptions.find((o) => o.value === responseTone);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <SafeAreaView style={styles.styleSheetOverlay}>
        <TouchableOpacity
          testID="styleSheetBackdrop"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View
          style={[
            styles.styleSheetCard,
            { maxWidth: cardMaxWidth },
            { maxHeight: Math.max(280, height - 32) },
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.glow,
            },
          ]}
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
            <View style={styles.styleSheetHeader}>
              <Text style={[styles.styleSheetTitle, { color: colors.text }]}>
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

            <View
              style={
                isLandscape
                  ? styles.styleSheetInstructionRowLandscape
                  : styles.styleSheetOptionsColumn
              }
            >
              <View
                style={[
                  styles.styleSheetGroup,
                  isLandscape ? styles.styleSheetGroupLandscape : null,
                ]}
              >
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("conversationThinkingInstructions")}
                </Text>
                <Text
                  style={[
                    styles.styleSheetDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t("conversationThinkingInstructionsDescription")}
                </Text>
                <TextInput
                  testID="conversation-llm-instructions"
                  value={llmInstructions}
                  onChangeText={onLlmInstructionsChange}
                  multiline
                  placeholder={t(
                    "conversationThinkingInstructionsPlaceholder",
                  )}
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                  textAlignVertical="top"
                  style={[
                    styles.styleSheetInstructionInput,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.styleSheetGroup,
                  isLandscape ? styles.styleSheetGroupLandscape : null,
                ]}
              >
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("ttsInstructions")}
                </Text>
                <Text
                  style={[
                    styles.styleSheetDescription,
                    {
                      color: ttsInstructionsSupported
                        ? colors.textSecondary
                        : colors.textMuted,
                    },
                  ]}
                >
                  {t(
                    ttsInstructionsSupported
                      ? "conversationTtsInstructionsDescription"
                      : "ttsInstructionsUnsupported",
                  )}
                </Text>
                <TextInput
                  testID="conversation-tts-instructions"
                  value={ttsInstructions}
                  onChangeText={onTtsInstructionsChange}
                  editable={ttsInstructionsSupported}
                  multiline
                  placeholder={t("ttsInstructionsPlaceholder")}
                  placeholderTextColor={colors.textMuted}
                  selectionColor={colors.accent}
                  textAlignVertical="top"
                  style={[
                    styles.styleSheetInstructionInput,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                      color: colors.text,
                      opacity: ttsInstructionsSupported ? 1 : 0.55,
                    },
                  ]}
                />
              </View>
            </View>

            {ttsRouteLabel && ttsVoiceOptions.length > 0 ? (
              <View style={styles.styleSheetGroup}>
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("ttsVoice")}
                </Text>
                <Text
                  style={[
                    styles.styleSheetDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t("conversationVoiceDescription", {
                    route: ttsRouteLabel,
                  })}
                </Text>
                <Picker
                  label={t("ttsVoice")}
                  value={ttsVoice}
                  options={ttsVoiceOptions}
                  onChange={onTtsVoiceChange}
                  dropdownLabel={ttsRouteLabel}
                  hideLabel
                  containerStyle={styles.styleSheetVoicePicker}
                />
              </View>
            ) : null}

            <View
              style={
                isLandscape
                  ? styles.styleSheetOptionsRowLandscape
                  : styles.styleSheetOptionsColumn
              }
            >
              <View
                style={[
                  styles.styleSheetGroup,
                  isLandscape ? styles.styleSheetGroupLandscape : null,
                ]}
              >
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("adaptiveLength")}
                </Text>
                <View style={styles.styleSheetPillRow}>
                  {lengthOptions.map((option) => {
                    const active = option.value === responseLength;
                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.styleSheetPill,
                          {
                            backgroundColor: active
                              ? colors.accentSoft
                              : colors.surfaceElevated,
                            borderColor: active ? colors.accent : colors.border,
                          },
                        ]}
                        onPress={() =>
                          onChange({ responseLength: option.value })
                        }
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            styles.styleSheetPillText,
                            {
                              color: active
                                ? colors.text
                                : colors.textSecondary,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {activeLength ? (
                  <Text
                    style={[
                      styles.styleSheetDescription,
                      { color: colors.textMuted },
                    ]}
                  >
                    {activeLength.description}
                  </Text>
                ) : null}
              </View>

              <View
                style={[
                  styles.styleSheetGroup,
                  isLandscape ? styles.styleSheetGroupLandscape : null,
                ]}
              >
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("responseTone")}
                </Text>
                <View style={styles.styleSheetPillRow}>
                  {toneOptions.map((option) => {
                    const active = option.value === responseTone;
                    return (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.styleSheetPill,
                          {
                            backgroundColor: active
                              ? colors.accentSoft
                              : colors.surfaceElevated,
                            borderColor: active ? colors.accent : colors.border,
                          },
                        ]}
                        onPress={() => onChange({ responseTone: option.value })}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            styles.styleSheetPillText,
                            {
                              color: active
                                ? colors.text
                                : colors.textSecondary,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {activeTone ? (
                  <Text
                    style={[
                      styles.styleSheetDescription,
                      { color: colors.textMuted },
                    ]}
                  >
                    {activeTone.description}
                  </Text>
                ) : null}
              </View>
            </View>

            <View
              style={[
                styles.styleSheetAutoRenameCard,
                isLandscape ? styles.styleSheetAutoRenameCardLandscape : null,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.styleSheetAutoRenameCopy}>
                <Text
                  style={[
                    styles.styleSheetGroupLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  {t("conversationTitle")}
                </Text>
                <Text
                  style={[
                    styles.styleSheetDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {t("conversationTitleGenerationDescription")}
                </Text>
              </View>
              <TouchableOpacity
                testID="auto-rename-conversation"
                style={[
                  styles.styleSheetAutoRenameButton,
                  {
                    backgroundColor: canAutoRenameConversation
                      ? colors.accentSoft
                      : colors.surfaceAlt,
                    borderColor: canAutoRenameConversation
                      ? colors.borderStrong
                      : colors.border,
                  },
                ]}
                disabled={!canAutoRenameConversation}
                onPress={onAutoRenameConversation}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityState={{ disabled: !canAutoRenameConversation }}
              >
                {isAutoRenamingConversation ? (
                  <ActivityIndicator size="small" color={colors.accent} />
                ) : (
                  <Feather
                    name="edit-3"
                    size={14}
                    color={
                      canAutoRenameConversation
                        ? colors.accent
                        : colors.textMuted
                    }
                  />
                )}
                <Text
                  style={[
                    styles.styleSheetAutoRenameButtonText,
                    {
                      color: canAutoRenameConversation
                        ? colors.accent
                        : colors.textMuted,
                    },
                  ]}
                >
                  {isAutoRenamingConversation
                    ? t("conversationTitleGenerating")
                    : t("conversationTitleGenerate")}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

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
    </Modal>
  );
}
