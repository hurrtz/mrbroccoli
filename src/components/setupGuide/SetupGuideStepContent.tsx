import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";

import {
  PROVIDER_API_KEY_HINTS,
  PROVIDER_API_KEY_PLACEHOLDERS,
  PROVIDER_LABELS,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import { KOKORO_MODEL_DOWNLOAD_BYTES } from "../../constants/kokoro";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import type {
  SetupGuideProviderOption,
  SetupGuideResolvedRoutes,
  SetupGuideStep,
  SetupGuideValidationState,
} from "../../screens/main/setupGuideSupport";
import { useTheme } from "../../theme/ThemeContext";
import type { Provider } from "../../types";
import {
  formatQwenApiCredential,
  parseQwenApiCredential,
  QWEN_API_REGIONS,
  type QwenApiRegion,
} from "../../utils/qwenRegion";
import { Picker } from "../Picker";
import { getSttRouteCopy, getTtsRouteCopy, RouteRow } from "./shared";
import { styles } from "./styles";
import type { SetupGuideVoiceTestState } from "./types";

const PROVIDER_PLACEHOLDER_VALUE = "__setup_guide_select_provider__";

interface SetupGuideStepContentProps {
  visible: boolean;
  step: SetupGuideStep;
  providerOptions: SetupGuideProviderOption[];
  selectedProvider: Provider | null;
  selectedProviderApiKey: string;
  currentValidationState: SetupGuideValidationState;
  resolvedRoutes: SetupGuideResolvedRoutes;
  voiceTest: SetupGuideVoiceTestState;
  kokoroModel: KokoroModelController;
  useKokoro: boolean;
  onSelectProvider: (provider: Provider | null) => void;
  onChangeProviderApiKey: (value: string) => void;
  onToggleKokoro: (enabled: boolean) => void;
  onDownloadKokoro: () => void;
  onResetVoiceTest: () => void;
  showSettingsShortcutOption: boolean;
  settingsShortcutVisible: boolean;
  onChangeSettingsShortcutVisible?: (visible: boolean) => void;
}

function KokoroStep({
  kokoroModel,
  useKokoro,
  onToggleKokoro,
  onDownloadKokoro,
}: Pick<
  SetupGuideStepContentProps,
  | "kokoroModel"
  | "useKokoro"
  | "onToggleKokoro"
  | "onDownloadKokoro"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const progress = Math.round(kokoroModel.progress * 100);
  const status = kokoroModel.error
    ? kokoroModel.error
    : kokoroModel.busy === "downloading"
      ? t(
          kokoroModel.phase === "extracting"
            ? "kokoroExtracting"
            : "kokoroDownloading",
          { progress },
        )
      : kokoroModel.busy === "verifying"
        ? t("kokoroVerifying")
        : kokoroModel.busy === "checking"
          ? t("kokoroChecking")
          : kokoroModel.installed
            ? t("kokoroInstalled")
            : t("kokoroNotInstalled");

  return (
    <>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("setupGuideKokoroBody", {
          size: Math.round(KOKORO_MODEL_DOWNLOAD_BYTES / 1024 / 1024),
        })}
      </Text>
      <Text style={[styles.note, { color: colors.textMuted }]}>
        {t("setupGuideKokoroLanguageNote")}
      </Text>
      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: kokoroModel.error ? colors.danger : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: kokoroModel.error ? colors.danger : colors.text,
            },
          ]}
        >
          {status}
        </Text>
      </View>
      {!kokoroModel.installed ? (
        <TouchableOpacity
          onPress={onDownloadKokoro}
          disabled={kokoroModel.busy !== null}
          activeOpacity={0.8}
          style={styles.inlineLink}
          accessibilityRole="button"
          accessibilityLabel={t("setupGuideKokoroDownload")}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {kokoroModel.busy ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Feather name="download" size={16} color={colors.accent} />
            )}
            <Text style={[styles.inlineLinkText, { color: colors.accent }]}>
              {t("setupGuideKokoroDownload")}
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.settingsShortcutRow,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.settingsShortcutCopy}>
            <Text
              style={[styles.settingsShortcutTitle, { color: colors.text }]}
            >
              {t("setupGuideUseKokoro")}
            </Text>
            <Text
              style={[
                styles.settingsShortcutSummary,
                { color: colors.textMuted },
              ]}
            >
              {t("setupGuideUseKokoroSummary")}
            </Text>
          </View>
          <Switch
            value={useKokoro}
            onValueChange={onToggleKokoro}
            trackColor={{
              false: colors.borderStrong,
              true: colors.accentSoft,
            }}
            thumbColor={useKokoro ? colors.accent : colors.textMuted}
            accessibilityLabel={t("setupGuideUseKokoro")}
          />
        </View>
      )}
    </>
  );
}

function IntroStep({
  showSettingsShortcutOption,
  settingsShortcutVisible,
  onChangeSettingsShortcutVisible,
}: Pick<
  SetupGuideStepContentProps,
  | "showSettingsShortcutOption"
  | "settingsShortcutVisible"
  | "onChangeSettingsShortcutVisible"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("setupGuideIntroBody")}
      </Text>
      <Text style={[styles.note, { color: colors.textMuted }]}>
        {t("setupGuideIntroNote")}
      </Text>
      {showSettingsShortcutOption ? (
        <Pressable
          accessibilityLabel={t("setupGuideShowInSettings")}
          accessibilityRole="switch"
          accessibilityState={{
            checked: settingsShortcutVisible,
            disabled: !onChangeSettingsShortcutVisible,
          }}
          disabled={!onChangeSettingsShortcutVisible}
          onPress={() =>
            onChangeSettingsShortcutVisible?.(!settingsShortcutVisible)
          }
          style={({ pressed }) => [
            styles.settingsShortcutRow,
            pressed ? styles.settingsShortcutRowPressed : null,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.settingsShortcutCopy}>
            <Text
              style={[styles.settingsShortcutTitle, { color: colors.text }]}
            >
              {t("setupGuideShowInSettings")}
            </Text>
            <Text
              style={[
                styles.settingsShortcutSummary,
                { color: colors.textMuted },
              ]}
            >
              {t("setupGuideShowInSettingsSummary")}
            </Text>
          </View>
          <Switch
            accessible={false}
            focusable={false}
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            value={settingsShortcutVisible}
            trackColor={{
              false: colors.borderStrong,
              true: colors.accentSoft,
            }}
            thumbColor={
              settingsShortcutVisible ? colors.accent : colors.textMuted
            }
          />
        </Pressable>
      ) : null}
    </>
  );
}

function ProviderStep({
  visible,
  providerOptions,
  selectedProvider,
  selectedProviderApiKey,
  currentValidationState,
  onSelectProvider,
  onChangeProviderApiKey,
}: Pick<
  SetupGuideStepContentProps,
  | "visible"
  | "providerOptions"
  | "selectedProvider"
  | "selectedProviderApiKey"
  | "currentValidationState"
  | "onSelectProvider"
  | "onChangeProviderApiKey"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const [isProviderApiKeyVisible, setIsProviderApiKeyVisible] =
    React.useState(false);

  React.useEffect(() => {
    setIsProviderApiKeyVisible(false);
  }, [selectedProvider, visible]);

  const providerPickerValue = selectedProvider ?? PROVIDER_PLACEHOLDER_VALUE;
  const providerPickerOptions = [
    {
      label: t("setupGuideSelectProvider"),
      value: PROVIDER_PLACEHOLDER_VALUE,
    },
    ...providerOptions,
  ];
  const providerHint = selectedProvider
    ? PROVIDER_API_KEY_HINTS[selectedProvider]
    : t("setupGuideSelectProviderFirst");
  const providerPlaceholder =
    (selectedProvider
      ? PROVIDER_API_KEY_PLACEHOLDERS[selectedProvider]
      : null) || t("setupGuideApiKeyPlaceholder");
  const qwenCredentials =
    selectedProvider === "alibaba-qwen-dashscope"
      ? parseQwenApiCredential(selectedProviderApiKey)
      : null;
  const displayedProviderApiKey =
    qwenCredentials?.apiKey ?? selectedProviderApiKey;
  const qwenRegionOptions = QWEN_API_REGIONS.map((region) => ({
    value: region,
    label:
      region === "singapore"
        ? t("qwenRegionSingapore")
        : region === "us"
          ? t("qwenRegionUs")
          : t("qwenRegionBeijing"),
  }));
  const isProviderApiKeyMissing = selectedProviderApiKey.trim().length === 0;
  const shouldShowFooterValidationPrompt =
    currentValidationState.status === "error" &&
    Boolean(currentValidationState.message) &&
    (!selectedProvider || isProviderApiKeyMissing);
  const shouldShowStatusMessage =
    Boolean(currentValidationState.message) &&
    !shouldShowFooterValidationPrompt;

  return (
    <>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("setupGuideProviderBody")}
      </Text>
      <Picker
        label={t("setupGuideProviderPickerLabel")}
        value={providerPickerValue}
        options={providerPickerOptions}
        onChange={(value) =>
          onSelectProvider(
            value === PROVIDER_PLACEHOLDER_VALUE ? null : (value as Provider),
          )
        }
        dropdownLabel={t("setupGuideProviderPickerLabel")}
        containerStyle={styles.providerPicker}
      />
      <View style={styles.inputSection}>
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          {t("setupGuideApiKeyLabel")}
        </Text>
        <View style={styles.apiKeyInputRow}>
          <TextInput
            value={displayedProviderApiKey}
            onChangeText={(value) =>
              onChangeProviderApiKey(
                qwenCredentials
                  ? formatQwenApiCredential(value, qwenCredentials.region)
                  : value,
              )
            }
            editable={Boolean(selectedProvider)}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
            spellCheck={false}
            contextMenuHidden={false}
            selectTextOnFocus={isProviderApiKeyVisible}
            returnKeyType="done"
            secureTextEntry={
              selectedProviderApiKey.trim().length > 0 &&
              !isProviderApiKeyVisible
            }
            placeholder={providerPlaceholder}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
          />
          <TouchableOpacity
            style={[
              styles.apiKeyVisibilityButton,
              { backgroundColor: colors.surface },
            ]}
            onPress={() => setIsProviderApiKeyVisible((previous) => !previous)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={
              isProviderApiKeyVisible ? t("hideKey") : t("showKey")
            }
          >
            <Feather
              name={isProviderApiKeyVisible ? "eye-off" : "eye"}
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {qwenCredentials ? (
          <>
            <Picker
              label={t("qwenApiRegion")}
              value={qwenCredentials.region}
              options={qwenRegionOptions}
              onChange={(value) =>
                onChangeProviderApiKey(
                  formatQwenApiCredential(
                    qwenCredentials.apiKey,
                    value as QwenApiRegion,
                  ),
                )
              }
            />
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              {qwenCredentials.region === "us"
                ? t("qwenRegionUsSpeechHint")
                : t("qwenRegionHint")}
            </Text>
          </>
        ) : null}
        <Text style={[styles.helperText, { color: colors.textMuted }]}>
          {providerHint}
        </Text>
      </View>
      {shouldShowStatusMessage ? (
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                currentValidationState.status === "success"
                  ? colors.accentSoft
                  : colors.surfaceElevated,
              borderColor:
                currentValidationState.status === "error"
                  ? colors.borderStrong
                  : colors.border,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: colors.text }]}>
            {currentValidationState.message}
          </Text>
        </View>
      ) : null}
    </>
  );
}

function VoiceTestStep({
  resolvedRoutes,
  voiceTest,
  onResetVoiceTest,
}: Pick<
  SetupGuideStepContentProps,
  "resolvedRoutes" | "voiceTest" | "onResetVoiceTest"
>) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {resolvedRoutes.stt.enabled
          ? t("setupGuideVoiceTestBody")
          : t("setupGuideVoiceTestNoInputBody")}
      </Text>
      <View style={styles.summaryStack}>
        <RouteRow
          label={t("setupGuideSummaryStt")}
          value={getSttRouteCopy(t, resolvedRoutes)}
          muted={!resolvedRoutes.stt.enabled}
        />
        <RouteRow
          label={t("setupGuideSummaryTts")}
          value={getTtsRouteCopy(t, resolvedRoutes)}
          muted={!resolvedRoutes.tts.enabled}
        />
      </View>
      {resolvedRoutes.stt.enabled ? (
        <>
          {!resolvedRoutes.tts.enabled ? (
            <Text style={[styles.note, { color: colors.textMuted }]}>
              {t("setupGuideVoiceTestTextOnlyNote")}
            </Text>
          ) : null}
          {voiceTest.transcript ? (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textSecondary }]}
              >
                {t("setupGuideVoiceTestTranscript")}
              </Text>
              <Text style={[styles.resultText, { color: colors.text }]}>
                {voiceTest.transcript}
              </Text>
            </View>
          ) : null}
          {voiceTest.reply ? (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.resultLabel, { color: colors.textSecondary }]}
              >
                {t("setupGuideVoiceTestReply")}
              </Text>
              <Text style={[styles.resultText, { color: colors.text }]}>
                {voiceTest.reply}
              </Text>
            </View>
          ) : null}
          {voiceTest.errorMessage ? (
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.borderStrong,
                },
              ]}
            >
              <Text style={[styles.statusText, { color: colors.text }]}>
                {voiceTest.errorMessage}
              </Text>
            </View>
          ) : null}
          {voiceTest.phase === "success" || voiceTest.phase === "error" ? (
            <TouchableOpacity
              onPress={onResetVoiceTest}
              activeOpacity={0.8}
              style={styles.inlineLink}
              accessibilityRole="button"
              accessibilityLabel={t("setupGuideVoiceTestReset")}
            >
              <Text style={[styles.inlineLinkText, { color: colors.accent }]}>
                {t("setupGuideVoiceTestReset")}
              </Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function SummaryStep({
  resolvedRoutes,
}: Pick<SetupGuideStepContentProps, "resolvedRoutes">) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const summaryRows = [
    {
      label: t("setupGuideSummaryLlm"),
      value: t("setupGuideRouteProviderLlm", {
        provider: PROVIDER_LABELS[resolvedRoutes.llm.provider],
      }),
      muted: false,
    },
    {
      label: t("setupGuideSummaryStt"),
      value: getSttRouteCopy(t, resolvedRoutes),
      muted: !resolvedRoutes.stt.enabled,
    },
    {
      label: t("setupGuideSummaryTts"),
      value: getTtsRouteCopy(t, resolvedRoutes),
      muted: !resolvedRoutes.tts.enabled,
    },
    {
      label: t("setupGuideSummaryWebSearch"),
      value: resolvedRoutes.webSearch.available
        ? t("setupGuideWebSearchAvailableOff", {
            provider: PROVIDER_LABELS[resolvedRoutes.webSearch.provider!],
          })
        : t("setupGuideRouteUnavailable"),
      muted: !resolvedRoutes.webSearch.available,
    },
  ];

  return (
    <>
      <Text style={[styles.body, { color: colors.textSecondary }]}>
        {t("setupGuideSummaryBody")}
      </Text>
      <View style={styles.summaryStack}>
        {summaryRows.map((row) => (
          <RouteRow
            key={row.label}
            label={row.label}
            value={row.value}
            muted={row.muted}
          />
        ))}
      </View>
      {!resolvedRoutes.tts.enabled ? (
        <Text style={[styles.note, { color: colors.textMuted }]}>
          {t("setupGuideSummaryTextOnlyNote")}
        </Text>
      ) : null}
    </>
  );
}

export function SetupGuideStepContent(props: SetupGuideStepContentProps) {
  switch (props.step) {
    case "intro":
      return <IntroStep {...props} />;
    case "provider":
      return <ProviderStep {...props} />;
    case "kokoro":
      return <KokoroStep {...props} />;
    case "voice-test":
      return <VoiceTestStep {...props} />;
    case "summary":
      return <SummaryStep {...props} />;
  }
}
