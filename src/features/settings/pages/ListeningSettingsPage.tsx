import React from "react";
import { Text, View } from "react-native";

import { useLocalization } from "../../../i18n";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  InputMode,
  Provider,
  Settings,
  SttBackendMode,
} from "../../../types";
import { buildProviderPickerOptions } from "../../settings-core/providerPickerOptions";
import { SPEECH_LANGUAGE_OPTIONS } from "../../../constants/speechLanguages";
import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { getLocalModel } from "../../../constants/localModels";

import {
  AntPickerRow,
  AntPickerSection,
  AntRadioSection,
  AntSectionIntro,
} from "../AntSettingsPrimitives";
import { styles } from "../styles";

export function ListeningSettingsPage({
  settings,
  selectableSttProviders,
  selectedSttProviderModelOptions,
  selectedSttProviderModel,
  sttLanguageNote,
  sttLimitNote,
  onUpdate,
  onUpdateProviderSttModel,
}: {
  settings: Settings;
  selectableSttProviders: Provider[];
  selectedSttProviderModelOptions: { id: string; name: string }[];
  selectedSttProviderModel: string;
  sttLanguageNote: string | null;
  sttLimitNote: string | null;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderSttModel: (provider: Provider, model: string) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const sttProviderOptions = buildProviderPickerOptions(
    selectableSttProviders,
    settings.sttProvider,
    t("providerNeedsAttention"),
  );

  return (
    <View style={styles.pageStack}>
      <AntSectionIntro title={t("voiceInput")} />

      <AntRadioSection<InputMode>
        testID="input-mode-picker"
        label={t("inputMode")}
        options={[
          {
            value: "push-to-talk",
            label: t("pushToTalk"),
            description: t("pushToTalkDescription"),
          },
          {
            value: "toggle-to-talk",
            label: t("toggleToTalk"),
            description: t("toggleToTalkDescription"),
          },
          {
            value: "drive-session",
            label: t("driveSession"),
            description: t("driveSessionDescription"),
          },
        ]}
        value={settings.inputMode}
        onChange={(value) => onUpdate({ inputMode: value })}
      />

      <AntPickerSection
        title={t("recognitionLanguage")}
        helperText={t("recognitionLanguageHint")}
      >
        <AntPickerRow
          testID="stt-language-picker"
          value={settings.sttLanguage}
          options={[
            { value: "auto", label: t("automaticLanguage") },
            ...SPEECH_LANGUAGE_OPTIONS.map((value) => ({
              value,
              label: getTtsListenLanguageLabel(value, settings.language),
            })),
          ]}
          onChange={(value) =>
            onUpdate({ sttLanguage: value as Settings["sttLanguage"] })
          }
        />
      </AntPickerSection>

      <AntRadioSection<SttBackendMode>
        label={t("speechToText")}
        options={[
          {
            value: "native",
            label: t("appNative"),
            description: t("nativeSttDescription"),
          },
          {
            value: "provider",
            label: t("provider"),
            description: t("providerSttDescription"),
          },
          {
            value: "local",
            label: t("settingsOnDevice"),
            description: t("settingsOnDeviceSummary"),
            disabled: !settings.localSttModelId,
          },
        ]}
        value={settings.sttMode}
        onChange={(value) => onUpdate({ sttMode: value })}
      />

      {settings.sttMode === "provider" ? (
        <AntPickerSection
          title={t("sttProvider")}
          description={
            <View style={styles.infoModalContent}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fonts.body,
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {t("providerSttDescription")}
              </Text>
              {sttLanguageNote ? (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                    fontSize: 13,
                    lineHeight: 19,
                  }}
                >
                  {t("languageCoverage", { note: sttLanguageNote })}
                </Text>
              ) : null}
              {sttLimitNote ? (
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: fonts.body,
                    fontSize: 13,
                    lineHeight: 19,
                  }}
                >
                  {t("recordingLimits", { note: sttLimitNote })}
                </Text>
              ) : null}
            </View>
          }
        >
          <AntPickerRow
            testID="stt-provider-picker"
            label={sttProviderOptions.length > 1 ? t("provider") : undefined}
            value={settings.sttProvider ?? ""}
            options={sttProviderOptions}
            disabled={sttProviderOptions.length === 0}
            onChange={(value) => onUpdate({ sttProvider: value as Provider })}
          />
          {settings.sttProvider &&
          selectedSttProviderModelOptions.length > 0 ? (
            <AntPickerRow
              label={t("model")}
              value={selectedSttProviderModel}
              options={selectedSttProviderModelOptions.map((model) => ({
                value: model.id,
                label: model.name,
              }))}
              onChange={(value) =>
                onUpdateProviderSttModel(settings.sttProvider!, value)
              }
            />
          ) : null}
        </AntPickerSection>
      ) : null}

      {settings.sttMode === "local" && settings.localSttModelId ? (
        <AntPickerSection title={t("onDeviceListeningModels")}>
          <AntPickerRow
            label={t("model")}
            value={settings.localSttModelId}
            options={[
              {
                value: settings.localSttModelId,
                label: getLocalModel(settings.localSttModelId).name,
              },
            ]}
            onChange={() => undefined}
          />
        </AntPickerSection>
      ) : null}
    </View>
  );
}
