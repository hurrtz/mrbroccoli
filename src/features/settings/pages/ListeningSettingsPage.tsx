import React from "react";
import { View } from "react-native";

import { type SpeechLanguage } from "../../../constants/speechLanguages";
import { getTtsListenLanguageLabel } from "../../../constants/localTts";
import { useLocalization } from "../../../i18n";
import type { LocalModelSettingsController } from "../../settings-core/useLocalModelSettings";
import type { InputMode, Provider, Settings } from "../../../types";

import { styles } from "../styles";
import { LocalModelRouteGroup } from "../settings-primitives/LocalModelRouteGroup";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsMultiChoiceRow } from "../settings-primitives/SettingsMultiChoiceRow";

export function ListeningSettingsPage({
  localModels,
  onUpdate,
  onUpdateProviderSttModel,
  selectableSttProviders,
  selectedSttProviderModelOptions,
  settings,
}: {
  localModels: LocalModelSettingsController;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderSttModel: (provider: Provider, model: string) => void;
  selectableSttProviders: Provider[];
  selectedSttProviderModelOptions: { id: string; name: string }[];
  settings: Settings;
}) {
  const { t } = useLocalization();
  const languageOptions = localModels.speechLanguageOptions.map((value) => ({
    value,
    label: getTtsListenLanguageLabel(value, settings.language),
  }));
  const inputModeOptions = [
    {
      value: "push-to-talk",
      label: t("pushToTalk"),
      supporting: t("pushToTalkDescription"),
    },
    {
      value: "toggle-to-talk",
      label: t("toggleToTalk"),
      supporting: t("toggleToTalkDescription"),
    },
  ] as const;

  return (
    <View testID="listening-settings-page" style={styles.sectionPageStack}>
      <SettingsGroup
        title={t("voiceInput")}
        footer={t("onDeviceLanguagesHint")}
      >
        <SettingsChoiceRow<InputMode>
          testID="input-mode-picker"
          icon="mic"
          label={t("inputMode")}
          options={inputModeOptions}
          value={settings.inputMode}
          onChange={(inputMode) => onUpdate({ inputMode })}
        />
        <SettingsMultiChoiceRow<SpeechLanguage>
          testID="conversation-languages-picker"
          icon="global"
          label={t("onDeviceLanguages")}
          last
          options={languageOptions}
          values={settings.localLanguages}
          onToggle={localModels.toggleLanguage}
        />
      </SettingsGroup>

      <LocalModelRouteGroup
        capability="stt"
        title={t("whoListens")}
        footer={t("whoListensFooter")}
        localModels={localModels}
        settings={settings}
        providerRoutes={selectableSttProviders.map((provider) => ({
          provider,
          model: settings.providerSttModels[provider],
          selected:
            settings.sttMode === "provider" &&
            settings.sttProvider === provider,
          modelOptions:
            settings.sttProvider === provider
              ? selectedSttProviderModelOptions
              : undefined,
          onModelChange: (model: string) =>
            onUpdateProviderSttModel(provider, model),
          onSelect: () =>
            onUpdate({ sttMode: "provider", sttProvider: provider }),
        }))}
      />
    </View>
  );
}
