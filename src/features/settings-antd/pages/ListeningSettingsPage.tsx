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
      <AntSectionIntro
        title={t("voiceInput")}
      />

      <AntRadioSection<InputMode>
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
          },
        ]}
        value={settings.sttMode}
        onChange={(value) => onUpdate({ sttMode: value })}
      />

      {settings.sttMode === "provider" ? (
        <AntPickerSection
          title={t("sttProvider")}
          description={t("providerSttDescription")}
          helperText={
            <>
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
            </>
          }
        >
          <AntPickerRow
            label={t("provider")}
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
    </View>
  );
}
