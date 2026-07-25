import React from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

import { getTtsListenLanguageLabel } from "../../constants/localTts";
import {
  KOKORO_MODEL_DOWNLOAD_BYTES,
  KOKORO_MODEL_INSTALLED_BYTES,
  getKokoroVoiceOptions,
} from "../../constants/kokoro";
import {
  TTS_FALLBACK_OPTIONS,
  getTtsFallbackRoutes,
} from "../../constants/ttsFallback";
import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  providerRequiresTtsVoice,
  providerUsesTtsVoiceDirectory,
} from "../../constants/models";
import { useLocalization } from "../../i18n";
import {
  KokoroLanguage,
  KokoroTtsFallbackRoute,
  Provider,
  ProviderTtsFallbackRoute,
  Settings,
  TtsFallbackRoute,
  TtsListenLanguage,
} from "../../types";
import type { KokoroModelController } from "../../hooks/useKokoroModel";
import { useTheme } from "../../theme/ThemeContext";
import type { ProviderVoiceDirectories } from "../../services/providerVoiceDirectory";
import { Picker } from "../Picker";

import { PreviewComposer } from "./shared";
import { styles } from "./styles";
import {
  PreviewButtonPhase,
  ProviderPreviewTexts,
  TextInputFocusHandler,
} from "./types";

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

export function TtsFallbackSection({
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
  const availableRoutes = TTS_FALLBACK_OPTIONS[primaryMode];
  const addableRoutes = availableRoutes.filter(
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
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        accessibilityRole="header"
        style={[styles.sectionLabel, { color: colors.text }]}
      >
        {t("ttsFallbackRoutes")}
      </Text>
      <Text style={[styles.fallbackRouteHint, { color: colors.textMuted }]}>
        {t("ttsFallbackRoutesHint")}
      </Text>

      {routes.length === 0 ? (
        <Text
          testID="tts-fallback-empty"
          style={[styles.fallbackRouteEmpty, { color: colors.textSecondary }]}
        >
          {t("ttsFallbackNone")}
        </Text>
      ) : (
        <View style={styles.fallbackRouteList}>
          {routes.map((route, index) => (
            <View
              key={route}
              testID={`tts-fallback-route-${route}`}
              style={[
                styles.fallbackRouteRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[styles.fallbackRouteLabel, { color: colors.text }]}
              >
                {t("ttsFallbackPosition", {
                  position: index + 1,
                  route: getFallbackRouteLabel(route, t),
                })}
              </Text>
              <View style={styles.fallbackRouteActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t("moveFallbackEarlier", {
                    route: getFallbackRouteLabel(route, t),
                  })}
                  disabled={index === 0}
                  onPress={() => {
                    const nextRoutes = [...routes];
                    [nextRoutes[index - 1], nextRoutes[index]] = [
                      nextRoutes[index],
                      nextRoutes[index - 1],
                    ];
                    updateRoutes(nextRoutes);
                  }}
                  style={[
                    styles.fallbackRouteAction,
                    { opacity: index === 0 ? 0.35 : 1 },
                  ]}
                >
                  <Feather name="arrow-up" size={18} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t("moveFallbackLater", {
                    route: getFallbackRouteLabel(route, t),
                  })}
                  disabled={index === routes.length - 1}
                  onPress={() => {
                    const nextRoutes = [...routes];
                    [nextRoutes[index], nextRoutes[index + 1]] = [
                      nextRoutes[index + 1],
                      nextRoutes[index],
                    ];
                    updateRoutes(nextRoutes);
                  }}
                  style={[
                    styles.fallbackRouteAction,
                    {
                      opacity:
                        index === routes.length - 1 ? 0.35 : 1,
                    },
                  ]}
                >
                  <Feather name="arrow-down" size={18} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={t("removeFallbackRoute", {
                    route: getFallbackRouteLabel(route, t),
                  })}
                  onPress={() =>
                    updateRoutes(
                      routes.filter((candidate) => candidate !== route),
                    )
                  }
                  style={styles.fallbackRouteAction}
                >
                  <Feather name="x" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {addableRoutes.length > 0 ? (
        <View style={styles.fallbackRouteAddRow}>
          {addableRoutes.map((route) => (
            <TouchableOpacity
              key={route}
              accessibilityRole="button"
              accessibilityLabel={t("addFallbackRoute", {
                route: getFallbackRouteLabel(route, t),
              })}
              onPress={() => updateRoutes([...routes, route])}
              style={[
                styles.fallbackRouteAddButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="plus" size={16} color={colors.accent} />
              <Text
                style={[
                  styles.fallbackRouteAddLabel,
                  { color: colors.accent },
                ]}
              >
                {getFallbackRouteLabel(route, t)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function ProviderVoicePreviewSection({
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
  const { t, language } = useLocalization();

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
  const voiceOptions =
    hasVoiceDirectory
      ? (
          voiceDirectory?.voices.length
            ? voiceDirectory.voices
            : fallbackVoiceOptions
        ).map((voice) => ({
          value:
            "value" in voice && typeof voice.value === "string"
              ? voice.value
              : voice.id,
          label: voice.label,
        }))
      : fallbackVoiceOptions.map((voice) => ({
          value: voice.id,
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
    <View
      style={[
        styles.voicePreviewSection,
        { borderTopColor: colors.border },
      ]}
    >
      <View style={styles.voicePreviewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.groupLabel, { color: colors.text }]}
        >
          {t("providerVoicePreviews")}
        </Text>
        <Text
          style={[
            styles.sectionHint,
            styles.voicePreviewHeaderHint,
            { color: colors.textMuted },
          ]}
        >
          {t("providerVoicePreviewsHint")}
        </Text>
      </View>

      <View>
        <Text
          accessibilityRole="header"
          style={[styles.voicePreviewProvider, { color: colors.text }]}
        >
          {PROVIDER_LABELS[provider]}
        </Text>
        {hasVoiceDirectory && voiceDirectory ? (
          <View style={styles.providerVoiceDirectoryHeader}>
            <View style={styles.providerVoiceDirectoryCopy}>
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                {t("providerVoiceDirectory", {
                  provider: PROVIDER_LABELS[provider],
                })}
              </Text>
              <Text style={[styles.previewHint, { color: colors.textMuted }]}>
                {voiceDirectory.status === "ready"
                  ? t("providerVoicesAvailable", {
                      count: voiceDirectory.voices.length,
                      provider: PROVIDER_LABELS[provider],
                    })
                  : voiceDirectory.status === "error" && voiceDirectory.error
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
                  <Text style={[styles.previewHint, { color: colors.danger }]}>
                    {t("providerVoicesErrorDetail", {
                      detail: voiceDirectory.error.message,
                    })}
                  </Text>
                  {provider === "elevenlabs" &&
                  isElevenLabsVoiceReadPermissionError(
                    voiceDirectory.error,
                  ) ? (
                    <Text
                      style={[styles.previewHint, { color: colors.textMuted }]}
                    >
                      {t("elevenLabsVoicesReadPermissionHint")}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </View>
            <TouchableOpacity
              testID={`${provider}-voices-refresh`}
              accessibilityRole="button"
              accessibilityLabel={t("refreshProviderVoices", {
                provider: PROVIDER_LABELS[provider],
              })}
              disabled={voiceDirectoryBusy}
              onPress={() => {
                void voiceDirectory.refresh();
              }}
              style={[
                styles.providerVoiceRefreshButton,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  opacity: voiceDirectoryBusy ? 0.6 : 1,
                },
              ]}
            >
              {voiceDirectoryBusy ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Feather name="refresh-cw" size={15} color={colors.accent} />
              )}
              <Text
                style={[
                  styles.providerVoiceRefreshLabel,
                  { color: colors.accent },
                ]}
              >
                {t("refresh")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {voiceOptions.length > 0 ? (
          <Picker
            label={t("ttsVoice")}
            value={selectedVoice}
            options={voiceOptions}
            onChange={(value) => onUpdateProviderTtsVoice(provider, value)}
          />
        ) : hasVoiceDirectory && !voiceDirectoryBusy ? (
          <View style={styles.settingsSubsectionStack}>
            <Text
              style={[styles.previewLabel, { color: colors.textSecondary }]}
            >
              {t("providerVoiceId")}
            </Text>
            <TextInput
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
              style={[
                styles.apiKeyInput,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingRight: 14,
                },
              ]}
            />
            <Text
              style={[
                styles.previewHint,
                { color: selectedVoice ? colors.textMuted : colors.danger },
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
          <Text
            style={[
              styles.previewHint,
              { color: colors.textMuted, marginTop: 0 },
            ]}
          >
            {t("providerDefaultVoiceHint")}
          </Text>
        )}

        {selectedLanguages.map((entry) => {
          const previewId = `provider:${provider}:${entry}`;

          return (
            <View
              key={`${provider}:${entry}`}
              style={[
                styles.previewLanguageBlock,
                { borderTopColor: colors.border },
              ]}
            >
              <Text
                style={[styles.previewLabel, { color: colors.textSecondary }]}
              >
                {getTtsListenLanguageLabel(entry, language)}
              </Text>
              <PreviewComposer
                text={previewTexts[provider][entry]}
                setText={(text) => onSetPreviewText(provider, entry, text)}
                phase={
                  activePreview?.id === previewId ? activePreview.phase : "idle"
                }
                interactionDisabled={
                  (activePreview !== null &&
                    activePreview.id !== previewId) ||
                  (providerRequiresTtsVoice(provider) && !selectedVoice)
                }
                onPreview={() => onPreviewProvider(provider, entry)}
                onStop={onStopPreview}
                onTextInputFocus={onTextInputFocus}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function NativeVoicePreviewSection({
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
    <View
      style={[
        styles.voicePreviewSection,
        { borderTopColor: colors.border },
      ]}
    >
      <View style={styles.voicePreviewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.groupLabel, { color: colors.text }]}
        >
          {t("nativeVoicePreviewSection")}
        </Text>
        <Text
          style={[
            styles.sectionHint,
            styles.voicePreviewHeaderHint,
            { color: colors.textMuted },
          ]}
        >
          {t("nativeVoicePreviewSectionHint")}
        </Text>
      </View>

      <View>
        {voiceOptions.length > 0 ? (
          <>
            <Picker
              label={t("ttsVoice")}
              value={selectedVoice}
              options={voiceOptions}
              onChange={onSelectVoice}
            />
            <View
              style={[
                styles.previewLanguageBlock,
                { borderTopColor: colors.border },
              ]}
            >
              <PreviewComposer
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
            </View>
          </>
        ) : (
          <Text
            style={[
              styles.previewHint,
              { color: colors.textMuted, marginTop: 0 },
            ]}
          >
            {t("nativeVoiceUnavailable")}
          </Text>
        )}
      </View>
    </View>
  );
}

export function KokoroVoiceSection({
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
  const { t, language: appLanguage } = useLocalization();
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
    Alert.alert(
      t("kokoroRemoveTitle"),
      t("kokoroRemoveBody", { installedSize }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("remove"),
          style: "destructive",
          onPress: () => {
            void model.remove();
          },
        },
      ],
    );
  };

  return (
    <View
      style={[
        styles.voicePreviewSection,
        { borderTopColor: colors.border },
      ]}
    >
      <View style={styles.voicePreviewHeader}>
        <Text
          accessibilityRole="header"
          style={[styles.groupLabel, { color: colors.text }]}
        >
          {t("kokoroVoices")}
        </Text>
        <Text
          style={[
            styles.sectionHint,
            styles.voicePreviewHeaderHint,
            { color: colors.textMuted },
          ]}
        >
          {t("kokoroVoicesHint", {
            size: downloadSize,
            installedSize,
          })}
        </Text>
      </View>

      <View
        style={[
          styles.localPackCard,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: model.error ? colors.danger : colors.border,
          },
        ]}
      >
        <View style={styles.localPackHeader}>
          <View style={styles.localPackCopy}>
            <Text style={[styles.previewLabel, { color: colors.text }]}>
              {t("kokoroModel")}
            </Text>
            <Text
              style={[
                styles.previewHint,
                {
                  color: model.error
                    ? colors.danger
                    : model.installed
                      ? colors.success
                      : colors.textMuted,
                },
              ]}
            >
              {statusText}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={model.busy !== null}
            onPress={() => {
              if (model.installed) {
                handleRemove();
              } else {
                void model.download();
              }
            }}
            style={[
              styles.providerVoiceRefreshButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: model.busy !== null ? 0.6 : 1,
              },
            ]}
          >
            {model.busy ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <Feather
                name={model.installed ? "trash-2" : "download"}
                size={15}
                color={model.installed ? colors.danger : colors.accent}
              />
            )}
            <Text
              style={[
                styles.providerVoiceRefreshLabel,
                {
                  color: model.installed ? colors.danger : colors.accent,
                },
              ]}
            >
              {t(model.installed ? "remove" : "download")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={[
          styles.sectionHint,
          { color: colors.textMuted, marginTop: 12 },
        ]}
      >
        {t("kokoroLanguageFallback")}
      </Text>

      {previewLanguages.map((previewLanguage) => {
        const previewId = `kokoro:${previewLanguage}`;
        const voiceOptions = getKokoroVoiceOptions(
          previewLanguage,
          appLanguage,
        );

        return (
          <View
            key={previewLanguage}
            style={[
              styles.previewLanguageBlock,
              { borderTopColor: colors.border },
            ]}
          >
            <Text
              style={[styles.previewLabel, { color: colors.textSecondary }]}
            >
              {getTtsListenLanguageLabel(previewLanguage, appLanguage)}
            </Text>
            <Picker
              label={t("ttsVoice")}
              value={settings.kokoroVoices[previewLanguage]}
              options={voiceOptions}
              onChange={(voice) => onUpdateVoice(previewLanguage, voice)}
            />
            <PreviewComposer
              text={previewTexts[previewLanguage]}
              setText={(text) => onSetPreviewText(previewLanguage, text)}
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
    </View>
  );
}
