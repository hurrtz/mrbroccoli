import React from "react";
import { Text, TextInput, View } from "react-native";

import { Button } from "@ant-design/react-native";

import { antButtonTypography } from "../../design-system/antTypography";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type {
  PreviewButtonPhase,
  TextInputFocusHandler,
} from "../settings-core/types";

import { AntSettingsInfoButton } from "./AntSettingsInfoButton";
import { AntButtonLabel } from "./AntSettingsPrimitives";
import { styles } from "./styles";

export function AntPreviewComposer({
  text,
  setText,
  phase,
  interactionDisabled,
  onPreview,
  onStop,
  onTextInputFocus,
}: {
  text: string;
  setText: (text: string) => void;
  phase: PreviewButtonPhase;
  interactionDisabled: boolean;
  onPreview: () => Promise<void>;
  onStop: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const isGenerating = phase === "generating";
  const isPlaying = phase === "playing";
  const isBusy = isGenerating || isPlaying;
  const disabled = interactionDisabled || (!isBusy && text.trim().length === 0);

  return (
    <View style={{ gap: 8 }}>
      <View style={styles.previewFieldHeader}>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          {t("voicePreviewText")}
        </Text>
        <AntSettingsInfoButton
          accessibilityLabel={t("aboutSetting", {
            setting: t("voicePreviewText"),
          })}
          title={t("voicePreviewText")}
        >
          {t("voicePreviewHint")}
        </AntSettingsInfoButton>
      </View>
      <TextInput
        testID="voice-preview-text-input"
        accessibilityLabel={t("voicePreviewText")}
        value={text}
        onChangeText={setText}
        onFocus={onTextInputFocus}
        placeholder={t("voicePreviewPlaceholder")}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        multiline
        scrollEnabled
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: 15,
          height: 126,
          lineHeight: 21,
          paddingHorizontal: 12,
          paddingVertical: 10,
          textAlignVertical: "top",
        }}
      />
      <Button
        type="primary"
        loading={isGenerating}
        disabled={disabled}
        style={styles.previewButton}
        styles={antButtonTypography}
        onPress={() => {
          void (isBusy ? onStop() : onPreview());
        }}
      >
        <AntButtonLabel
          color={colors.onActiveControl}
          icon={isPlaying ? "stop" : "sound"}
          iconSize={16}
          label={isBusy ? t("stop") : t("previewVoice")}
        />
      </Button>
    </View>
  );
}
