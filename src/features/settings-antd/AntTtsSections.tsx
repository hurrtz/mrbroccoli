import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Icon,
  Input,
  Modal,
} from "@ant-design/react-native";

import { antButtonTypography } from "../../design-system/antTypography";
import {
  KOKORO_MODEL_DOWNLOAD_BYTES,
  KOKORO_MODEL_INSTALLED_BYTES,
  getKokoroVoiceOptions,
} from "../../constants/kokoro";
import { getTtsListenLanguageLabel } from "../../constants/localTts";
import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  providerRequiresTtsVoice,
  providerUsesTtsVoiceDirectory,
} from "../../constants/models";
import {
  TTS_FALLBACK_OPTIONS,
  getTtsFallbackRoutes,
} from "../../constants/ttsFallback";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { useLocalization } from "../../i18n";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { useTheme } from "../../theme/ThemeContext";
import { fonts } from "../../theme/typography";
import type {
  KokoroLanguage,
  KokoroTtsFallbackRoute,
  Provider,
  ProviderTtsFallbackRoute,
  Settings,
  TtsFallbackRoute,
  TtsListenLanguage,
} from "../../types";
import type {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "../settings-core/types";

import { AntPreviewComposer } from "./AntPreviewComposer";
import {
  AntButtonLabel,
  AntPickerRow,
  AntPickerSection,
  AntSettingsCard,
} from "./AntSettingsPrimitives";
import { styles } from "./styles";

function isElevenLabsVoiceReadPermissionError(error: Error) {
  const normalizedMessage = error.message.toLowerCase();
  return (
    normalizedMessage.includes("voices_read") ||
    normalizedMessage.includes("voice read")
  );
}

function getFallbackRouteLabel(
  route: TtsFallbackRoute,
  t: ReturnType<typeof useLocalization>["t"],
) {
  if (route === "provider") {
    return t("provider");
  }
  if (route === "kokoro") {
    return "Kokoro";
  }
  return t("systemVoice");
}

export function AntTtsFallbackSection({
  settings,
  onUpdate,
}: {
  settings: Settings;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const primaryMode = settings.ttsMode;

  if (primaryMode === "native") {
    return null;
  }

  const routes = getTtsFallbackRoutes(
    settings.ttsFallbackPolicy,
    primaryMode,
  );
  const addableRoutes = TTS_FALLBACK_OPTIONS[primaryMode].filter(
    (route) => !routes.includes(route),
  );
  const updateRoutes = (nextRoutes: TtsFallbackRoute[]) => {
    onUpdate({
      ttsFallbackPolicy:
        primaryMode === "provider"
          ? {
              ...settings.ttsFallbackPolicy,
              provider: nextRoutes as ProviderTtsFallbackRoute[],
            }
          : {
              ...settings.ttsFallbackPolicy,
              kokoro: nextRoutes as KokoroTtsFallbackRoute[],
            },
    });
  };

  return (
    <AntSettingsCard>
      <Text
        accessibilityRole="header"
        style={[styles.fieldLabel, { color: colors.text }]}
      >
        {t("ttsFallbackRoutes")}
      </Text>
      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        {t("ttsFallbackRoutesHint")}
      </Text>

      {routes.length === 0 ? (
        <Text
          testID="tts-fallback-empty"
          style={[styles.helperText, { color: colors.textSecondary }]}
        >
          {t("ttsFallbackNone")}
        </Text>
      ) : (
        routes.map((route, index) => (
          <View
            key={route}
            testID={`tts-fallback-route-${route}`}
            style={[
              styles.fallbackRow,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.fallbackLabel, { color: colors.text }]}>
              {t("ttsFallbackPosition", {
                position: index + 1,
                route: getFallbackRouteLabel(route, t),
              })}
            </Text>
            <Button
              size="small"
              type="ghost"
              disabled={index === 0}
              style={StyleSheet.flatten([
                styles.iconButton,
                { borderColor: colors.border },
              ])}
              styles={antButtonTypography}
              onPress={() => {
                const nextRoutes = [...routes];
                [nextRoutes[index - 1], nextRoutes[index]] = [
                  nextRoutes[index],
                  nextRoutes[index - 1],
                ];
                updateRoutes(nextRoutes);
              }}
              accessibilityLabel={t("moveFallbackEarlier", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <Icon name="arrow-up" size={16} color={colors.accent} />
            </Button>
            <Button
              size="small"
              type="ghost"
              disabled={index === routes.length - 1}
              style={StyleSheet.flatten([
                styles.iconButton,
                { borderColor: colors.border },
              ])}
              styles={antButtonTypography}
              onPress={() => {
                const nextRoutes = [...routes];
                [nextRoutes[index], nextRoutes[index + 1]] = [
                  nextRoutes[index + 1],
                  nextRoutes[index],
                ];
                updateRoutes(nextRoutes);
              }}
              accessibilityLabel={t("moveFallbackLater", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <Icon name="arrow-down" size={16} color={colors.accent} />
            </Button>
            <Button
              size="small"
              type="warning"
              style={styles.iconButton}
              styles={antButtonTypography}
              onPress={() =>
                updateRoutes(
                  routes.filter((candidate) => candidate !== route),
                )
              }
              accessibilityLabel={t("removeFallbackRoute", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <Icon name="close" size={16} color={colors.onDanger} />
            </Button>
          </View>
        ))
      )}

      {addableRoutes.length > 0 ? (
        <View style={styles.buttonRow}>
          {addableRoutes.map((route) => (
            <Button
              key={route}
              size="small"
              type="ghost"
              style={StyleSheet.flatten([
                styles.compactButton,
                { borderColor: colors.border },
              ])}
              styles={antButtonTypography}
              onPress={() => updateRoutes([...routes, route])}
              accessibilityLabel={t("addFallbackRoute", {
                route: getFallbackRouteLabel(route, t),
              })}
            >
              <AntButtonLabel
                color={colors.accent}
                icon="plus"
                iconSize={14}
                label={getFallbackRouteLabel(route, t)}
              />
            </Button>
          ))}
        </View>
      ) : null}
    </AntSettingsCard>
  );
}

export function AntProviderVoiceSection({
  provider,
  selectedLanguages,
  settings,
  previewTexts,
  activePreview,
  onSetPreviewText,
  onPreviewProvider,
  onStopPreview,
  onUpdateProviderTtsVoice,
  providerVoiceDirectories,
  onTextInputFocus,
}: {
  provider: Provider | null;
  selectedLanguages: TtsListenLanguage[];
  settings: Settings;
  previewTexts: ProviderPreviewTexts;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onSetPreviewText: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
    text: string,
  ) => void;
  onPreviewProvider: (
    provider: Provider,
    previewLanguage: TtsListenLanguage,
  ) => Promise<void>;
  onStopPreview: () => Promise<void>;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { language, t } = useLocalization();

  if (!provider) {
    return null;
  }

  const voiceDirectory = providerVoiceDirectories[provider];
  const hasVoiceDirectory = providerUsesTtsVoiceDirectory(provider);
  const selectedModel =
    settings.providerTtsModels[provider] ||
    PROVIDER_DEFAULT_TTS_MODELS[provider] ||
    "";
  const fallbackVoiceOptions = getProviderTtsVoiceOptions(
    provider,
    language,
    selectedModel,
  );
  const voiceOptions = (
    hasVoiceDirectory
      ? voiceDirectory?.voices.length
        ? voiceDirectory.voices
        : fallbackVoiceOptions
      : fallbackVoiceOptions
  ).map((voice) => ({
    value:
      "value" in voice && typeof voice.value === "string"
        ? voice.value
        : voice.id,
    label: voice.label,
  }));
  const selectedVoice =
    settings.providerTtsVoices[provider] ||
    PROVIDER_DEFAULT_TTS_VOICES[provider] ||
    voiceOptions[0]?.value ||
    "";
  const voiceDirectoryBusy =
    voiceDirectory?.status === "loading" ||
    voiceDirectory?.status === "refreshing";

  return (
    <AntSettingsCard>
      <View style={styles.previewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {t("providerVoicePreviews")}
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("providerVoicePreviewsHint")}
        </Text>
      </View>

      <Text style={[styles.fieldLabel, { color: colors.text }]}>
        {PROVIDER_LABELS[provider]}
      </Text>

      {hasVoiceDirectory && voiceDirectory ? (
        <View style={styles.statusRow}>
          <View style={styles.statusCopy}>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              {t("providerVoiceDirectory", {
                provider: PROVIDER_LABELS[provider],
              })}
            </Text>
            <Text style={[styles.helperText, { color: colors.textMuted }]}>
              {voiceDirectory.status === "ready"
                ? t("providerVoicesAvailable", {
                    count: voiceDirectory.voices.length,
                    provider: PROVIDER_LABELS[provider],
                  })
                : voiceDirectory.status === "error"
                  ? t(
                      fallbackVoiceOptions.length > 0
                        ? "providerVoicesLoadFailedWithFallback"
                        : "providerVoicesLoadFailed",
                    )
                  : t("providerVoicesLoadingHint", {
                      provider: PROVIDER_LABELS[provider],
                    })}
            </Text>
            {voiceDirectory.status === "error" && voiceDirectory.error ? (
              <>
                <Text style={[styles.helperText, { color: colors.danger }]}>
                  {t("providerVoicesErrorDetail", {
                    detail: voiceDirectory.error.message,
                  })}
                </Text>
                {provider === "elevenlabs" &&
                isElevenLabsVoiceReadPermissionError(
                  voiceDirectory.error,
                ) ? (
                  <Text
                    style={[
                      styles.helperText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {t("elevenLabsVoicesReadPermissionHint")}
                  </Text>
                ) : null}
              </>
            ) : null}
          </View>
          <Button
            testID={`${provider}-voices-refresh`}
            size="small"
            type="ghost"
            loading={voiceDirectoryBusy}
            disabled={voiceDirectoryBusy}
            style={StyleSheet.flatten([
              styles.compactButton,
              { borderColor: colors.border },
            ])}
            styles={antButtonTypography}
            onPress={() => {
              void voiceDirectory.refresh();
            }}
            accessibilityLabel={t("refreshProviderVoices", {
              provider: PROVIDER_LABELS[provider],
            })}
          >
            <AntButtonLabel
              color={colors.accent}
              icon="reload"
              label={t("refresh")}
            />
          </Button>
        </View>
      ) : null}

      {voiceOptions.length > 0 ? (
        <AntPickerSection>
          <AntPickerRow
            label={t("ttsVoice")}
            value={selectedVoice}
            options={voiceOptions}
            onChange={(value) =>
              onUpdateProviderTtsVoice(provider, value)
            }
          />
        </AntPickerSection>
      ) : hasVoiceDirectory && !voiceDirectoryBusy ? (
        <View style={{ gap: 8 }}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            {t("providerVoiceId")}
          </Text>
          <Input
            value={selectedVoice}
            onChangeText={(value) =>
              onUpdateProviderTtsVoice(provider, value.trim())
            }
            onFocus={onTextInputFocus}
            placeholder={t("providerVoiceIdPlaceholder")}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            autoCapitalize="none"
            autoCorrect={false}
            allowClear
            inputStyle={{ color: colors.text, fontFamily: fonts.body }}
            styles={{
              container: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 10,
              },
            }}
          />
          <Text
            style={[
              styles.helperText,
              { color: selectedVoice ? colors.textSecondary : colors.danger },
            ]}
          >
            {t(
              selectedVoice
                ? "providerVoiceIdFallbackHint"
                : "providerVoiceIdRequired",
              { provider: PROVIDER_LABELS[provider] },
            )}
          </Text>
        </View>
      ) : hasVoiceDirectory ? null : (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("providerDefaultVoiceHint")}
        </Text>
      )}

      {selectedLanguages.map((entry, index) => {
        const previewId = `provider:${provider}:${entry}`;
        return (
          <View
            key={`${provider}:${entry}`}
            style={[
              styles.previewBlock,
              index === 0 ? styles.previewBlockFirst : null,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {getTtsListenLanguageLabel(entry, language)}
            </Text>
            <AntPreviewComposer
              text={previewTexts[provider][entry]}
              setText={(text) => onSetPreviewText(provider, entry, text)}
              phase={
                activePreview?.id === previewId
                  ? activePreview.phase
                  : "idle"
              }
              interactionDisabled={
                (activePreview !== null && activePreview.id !== previewId) ||
                (providerRequiresTtsVoice(provider) && !selectedVoice)
              }
              onPreview={() => onPreviewProvider(provider, entry)}
              onStop={onStopPreview}
              onTextInputFocus={onTextInputFocus}
            />
          </View>
        );
      })}
    </AntSettingsCard>
  );
}

export function AntNativeVoiceSection({
  voiceOptions,
  selectedVoice,
  previewText,
  activePreview,
  onSelectVoice,
  onSetPreviewText,
  onPreview,
  onStopPreview,
  onTextInputFocus,
}: {
  voiceOptions: { value: string; label: string }[];
  selectedVoice: string;
  previewText: string;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onSelectVoice: (voiceId: string) => void;
  onSetPreviewText: (text: string) => void;
  onPreview: () => Promise<void>;
  onStopPreview: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();

  return (
    <AntSettingsCard>
      <View style={styles.previewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {t("nativeVoicePreviewSection")}
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("nativeVoicePreviewSectionHint")}
        </Text>
      </View>
      {voiceOptions.length > 0 ? (
        <>
          <AntPickerSection>
            <AntPickerRow
              label={t("ttsVoice")}
              value={selectedVoice}
              options={voiceOptions}
              onChange={onSelectVoice}
            />
          </AntPickerSection>
          <AntPreviewComposer
            text={previewText}
            setText={onSetPreviewText}
            phase={
              activePreview?.id === "native"
                ? activePreview.phase
                : "idle"
            }
            interactionDisabled={
              activePreview !== null && activePreview.id !== "native"
            }
            onPreview={onPreview}
            onStop={onStopPreview}
            onTextInputFocus={onTextInputFocus}
          />
        </>
      ) : (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("nativeVoiceUnavailable")}
        </Text>
      )}
    </AntSettingsCard>
  );
}

export function AntKokoroVoiceSection({
  settings,
  model,
  previewTexts,
  activePreview,
  onUpdateVoice,
  onSetPreviewText,
  onPreview,
  onStopPreview,
  onTextInputFocus,
}: {
  settings: Settings;
  model: KokoroModelController;
  previewTexts: Record<KokoroLanguage, string>;
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  onUpdateVoice: (language: KokoroLanguage, voice: string) => void;
  onSetPreviewText: (language: KokoroLanguage, text: string) => void;
  onPreview: (language: KokoroLanguage) => Promise<void>;
  onStopPreview: () => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
}) {
  const { colors } = useTheme();
  const { language: appLanguage, t } = useLocalization();
  const previewLanguages: KokoroLanguage[] = ["en", "zh"];
  const progressPercent = Math.round(model.progress * 100);
  const downloadSize = Math.round(KOKORO_MODEL_DOWNLOAD_BYTES / 1024 / 1024);
  const installedSize = Math.round(
    KOKORO_MODEL_INSTALLED_BYTES / 1024 / 1024,
  );
  const statusText = model.error
    ? model.error
    : model.busy === "downloading"
      ? t(
          model.phase === "extracting"
            ? "kokoroExtracting"
            : "kokoroDownloading",
          { progress: progressPercent },
        )
      : model.busy === "verifying"
        ? t("kokoroVerifying")
        : model.busy === "checking"
          ? t("kokoroChecking")
          : model.installed
            ? t("kokoroInstalled")
            : t("kokoroNotInstalled");

  const handleRemove = () => {
    Modal.alert(
      t("kokoroRemoveTitle"),
      t("kokoroRemoveBody", { installedSize }),
      [
        { text: t("cancel") },
        {
          text: t("remove"),
          style: { color: colors.danger },
          onPress: () => {
            void model.remove();
          },
        },
      ],
    );
  };

  return (
    <AntSettingsCard>
      <View style={styles.previewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, { color: colors.text }]}
        >
          {t("kokoroVoices")}
        </Text>
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {t("kokoroVoicesHint", { size: downloadSize, installedSize })}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusCopy}>
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("kokoroModel")}
          </Text>
          <Text
            style={[
              styles.helperText,
              {
                color: model.error
                  ? colors.danger
                  : model.installed
                    ? colors.success
                    : colors.textSecondary,
              },
            ]}
          >
            {statusText}
          </Text>
        </View>
        <Button
          size="small"
          type={model.installed ? "warning" : "primary"}
          loading={model.busy !== null}
          disabled={model.busy !== null}
          style={styles.compactButton}
          styles={antButtonTypography}
          onPress={() => {
            if (model.installed) {
              handleRemove();
            } else {
              void model.download();
            }
          }}
        >
          <AntButtonLabel
            color={
              model.installed
                ? colors.onDanger
                : colors.onActiveControl
            }
            icon={model.installed ? "delete" : "download"}
            label={t(model.installed ? "remove" : "download")}
          />
        </Button>
      </View>

      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        {t("kokoroLanguageFallback")}
      </Text>

      {previewLanguages.map((previewLanguage, index) => {
        const previewId = `kokoro:${previewLanguage}`;
        return (
          <View
            key={previewLanguage}
            style={[
              styles.previewBlock,
              index === 0 ? styles.previewBlockFirst : null,
              { borderTopColor: colors.border },
            ]}
          >
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
              {getTtsListenLanguageLabel(previewLanguage, appLanguage)}
            </Text>
            <AntPickerSection>
              <AntPickerRow
                label={t("ttsVoice")}
                value={settings.kokoroVoices[previewLanguage]}
                options={getKokoroVoiceOptions(
                  previewLanguage,
                  appLanguage,
                )}
                onChange={(voice) =>
                  onUpdateVoice(previewLanguage, voice)
                }
              />
            </AntPickerSection>
            <AntPreviewComposer
              text={previewTexts[previewLanguage]}
              setText={(text) =>
                onSetPreviewText(previewLanguage, text)
              }
              phase={
                activePreview?.id === previewId
                  ? activePreview.phase
                  : "idle"
              }
              interactionDisabled={
                !model.installed ||
                (activePreview !== null && activePreview.id !== previewId)
              }
              onPreview={() => onPreview(previewLanguage)}
              onStop={onStopPreview}
              onTextInputFocus={onTextInputFocus}
            />
          </View>
        );
      })}
    </AntSettingsCard>
  );
}
