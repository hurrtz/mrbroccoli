import React from "react";
import { Text, View } from "react-native";

import { Button, Input } from "@ant-design/react-native";

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
      <Input.TextArea
        value={text}
        onChangeText={setText}
        onFocus={onTextInputFocus}
        placeholder={t("voicePreviewPlaceholder")}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        rows={3}
        inputStyle={{
          color: colors.text,
          fontFamily: fonts.body,
          fontSize: 15,
          lineHeight: 21,
          paddingHorizontal: 12,
          textAlignVertical: "top",
        }}
        styles={{
          container: {
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            minHeight: 84,
            maxHeight: 84,
          },
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
