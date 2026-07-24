import { Text, View } from "react-native";

import { useLocalization } from "../../i18n";
import type {
  InputMode,
  Provider,
  Settings,
  SttBackendMode,
} from "../../types";
import { useTheme } from "../../theme/ThemeContext";
import { Picker } from "../Picker";

import { buildProviderPickerOptions } from "./providerPickerOptions";
import { PickerSection, RadioGroup } from "./shared";
import { styles } from "./styles";

export function ListeningSection({
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
    <View style={styles.tabPane}>
      <View style={styles.settingsSubsectionIntro}>
        <Text
          accessibilityRole="header"
          style={[styles.settingsSectionTitle, { color: colors.text }]}
        >
          {t("voiceInput")}
        </Text>
        <Text
          style={[
            styles.settingsSectionDescription,
            { color: colors.textSecondary },
          ]}
        >
          {t("voiceInputDescription")}
        </Text>
      </View>

      <View style={styles.settingsSubsectionStack}>
        <RadioGroup<InputMode>
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
          ]}
          value={settings.inputMode}
          onChange={(value) => onUpdate({ inputMode: value })}
        />

        <RadioGroup<SttBackendMode>
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
          ]}
          value={settings.sttMode}
          onChange={(value) => onUpdate({ sttMode: value })}
        />

        {settings.sttMode === "provider" ? (
          <PickerSection>
            <Picker
              label={t("sttProvider")}
              value={settings.sttProvider ?? ""}
              options={sttProviderOptions}
              disabled={sttProviderOptions.length === 0}
              onChange={(value) => onUpdate({ sttProvider: value as Provider })}
            />
            {settings.sttProvider && selectedSttProviderModelOptions.length > 1 ? (
              <Picker
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
            {sttLanguageNote ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("languageCoverage", { note: sttLanguageNote })}
              </Text>
            ) : null}
            {sttLimitNote ? (
              <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
                {t("recordingLimits", { note: sttLimitNote })}
              </Text>
            ) : null}
          </PickerSection>
        ) : null}
      </View>
    </View>
  );
}
