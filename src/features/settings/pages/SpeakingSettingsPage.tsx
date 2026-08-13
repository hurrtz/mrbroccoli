import React from "react";
import {
  AccessibilityInfo,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getKokoroLanguage, getKokoroVoiceOptions } from "../../../constants/kokoro";
import { APP_MODAL_ORIENTATIONS } from "../../../constants/layout";
import {
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsModelOptions,
  getProviderTtsVoiceOptions,
  providerRequiresTtsVoice,
  providerTtsModelSupportsInstructions,
  providerUsesTtsVoiceDirectory,
} from "../../../constants/models";
import { IconButton } from "../../../design-system/IconButton";
import { Input } from "../../../design-system/NativeControls";
import type { LocalModelDefinition } from "../../../constants/localModels";
import { useLocalization } from "../../../i18n";
import { clearProviderTtsAudioCache } from "../../../services/providerTtsAudioCache";
import type {
  ProviderVoice,
  ProviderVoiceDirectories,
} from "../../../services/providerVoiceDirectory";
import { useTheme } from "../../../theme/ThemeContext";
import { fonts } from "../../../theme/typography";
import type {
  KokoroLanguage,
  Provider,
  ReplyPlayback,
  Settings,
  TtsListenLanguage,
} from "../../../types";
import type { LocalModelSettingsController } from "../../settings-core/useLocalModelSettings";
import type {
  PreviewButtonPhase,
  TextInputFocusHandler,
} from "../../settings-core/types";

import { styles } from "../styles";
import { LocalModelRouteGroup } from "../settings-primitives/LocalModelRouteGroup";
import { SettingsChoiceRow } from "../settings-primitives/SettingsChoiceRow";
import { SettingsGroup } from "../settings-primitives/SettingsGroup";
import { SettingsRow } from "../settings-primitives/SettingsRow";
import {
  VoicePickerSheet,
  type VoicePickerOption,
} from "../settings-primitives/VoicePickerSheet";

type VoicePickerRoute =
  | { kind: "native" }
  | { kind: "kokoro"; language: KokoroLanguage }
  | { kind: "provider"; provider: Provider };

function providerVoiceMeta(voice: ProviderVoice) {
  const parts = [
    "accent" in voice ? voice.accent : null,
    "gender" in voice ? voice.gender : null,
    "tone" in voice ? voice.tone : null,
    "language" in voice ? voice.language : null,
    "languages" in voice ? voice.languages.join(", ") : null,
    "category" in voice ? voice.category : null,
    "isCustom" in voice && voice.isCustom ? "Custom" : null,
  ].filter((part): part is string => Boolean(part));
  return [...new Set(parts)].join(" · ");
}

function getProviderVoicePickerOptions(params: {
  provider: Provider;
  model: string;
  language: Settings["language"];
  directory: ProviderVoiceDirectories[Provider];
  selectedVoice: string;
}): VoicePickerOption[] {
  const fallbackOptions = getProviderTtsVoiceOptions(
    params.provider,
    params.language,
    params.model,
  ).map((voice) => ({ value: voice.id, label: voice.label }));
  const directoryOptions = params.directory?.voices.map((voice) => ({
    value: voice.value,
    label: voice.name,
    meta: providerVoiceMeta(voice) || undefined,
  }));
  const options = directoryOptions?.length ? directoryOptions : fallbackOptions;

  if (
    params.selectedVoice &&
    !options.some((option) => option.value === params.selectedVoice)
  ) {
    return [
      { value: params.selectedVoice, label: params.selectedVoice },
      ...options,
    ];
  }
  return options;
}

function InstructionsSheet({
  onChange,
  onClose,
  onTextInputFocus,
  value,
  visible,
}: {
  onChange: (value: string) => void;
  onClose: () => void;
  onTextInputFocus: TextInputFocusHandler;
  value: string;
  visible: boolean;
}) {
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      supportedOrientations={APP_MODAL_ORIENTATIONS}
      transparent
      visible={visible}
    >
      <View accessibilityViewIsModal style={pageStyles.overlay}>
        <Pressable
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <View
          style={[
            pageStyles.instructionsSheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingBottom: Math.max(18, insets.bottom + 10),
            },
          ]}
        >
          <View
            style={[
              pageStyles.handle,
              { backgroundColor: colors.borderStrong },
            ]}
          />
          <View style={pageStyles.sheetHeader}>
            <Text
              accessibilityRole="header"
              style={[pageStyles.sheetTitle, { color: colors.text }]}
            >
              {t("ttsInstructions")}
            </Text>
            <IconButton
              icon="close"
              accessibilityLabel={t("done")}
              onPress={onClose}
            />
          </View>
          <Text
            style={[pageStyles.instructionsHint, { color: colors.textMuted }]}
          >
            {t("ttsInstructionsDescription")}
          </Text>
          <Input.TextArea
            testID="speaking-instructions-input"
            value={value}
            placeholder={t("ttsInstructionsPlaceholder")}
            placeholderTextColor={colors.textMuted}
            onFocus={onTextInputFocus}
            onChangeText={onChange}
            rows={5}
            styles={{ container: pageStyles.instructionsInput }}
          />
        </View>
      </View>
    </Modal>
  );
}

export function SpeakingSettingsPage({
  activePreview,
  allTtsProviders,
  isPremium,
  localModels,
  onOpenPremium,
  onPreviewKokoroVoice,
  onPreviewNativeVoice,
  onPreviewProviderVoice,
  onTextInputFocus,
  onUpdate,
  onUpdateProviderTtsModel,
  onUpdateProviderTtsVoice,
  providerVoiceDirectories,
  selectableTtsProviders,
  settings,
}: {
  activePreview: { id: string; phase: PreviewButtonPhase } | null;
  allTtsProviders: Provider[];
  isPremium: boolean;
  localModels: LocalModelSettingsController;
  onOpenPremium: () => void;
  onPreviewKokoroVoice: (
    language: KokoroLanguage,
    voice?: string,
  ) => Promise<void>;
  onPreviewNativeVoice: (voice?: string) => Promise<void>;
  onPreviewProviderVoice: (
    provider: Provider,
    language: TtsListenLanguage,
    voice?: string,
  ) => Promise<void>;
  onTextInputFocus: TextInputFocusHandler;
  onUpdate: (
    partial: Partial<Omit<Settings, "apiKeys" | "providerModels">>,
  ) => void;
  onUpdateProviderTtsModel: (provider: Provider, model: string) => void;
  onUpdateProviderTtsVoice: (provider: Provider, voice: string) => void;
  providerVoiceDirectories: ProviderVoiceDirectories;
  selectableTtsProviders: Provider[];
  settings: Settings;
}) {
  const { language, t } = useLocalization();
  const [instructionsVisible, setInstructionsVisible] = React.useState(false);
  const [voicePicker, setVoicePicker] = React.useState<VoicePickerRoute | null>(
    null,
  );
  const [isClearingSpeechCache, setIsClearingSpeechCache] =
    React.useState(false);
  const [speechCacheOutcome, setSpeechCacheOutcome] = React.useState<
    "success" | "error" | null
  >(null);
  const previewLanguage = settings.ttsListenLanguages[0] ?? "en";
  const providerModel = (provider: Provider) =>
    settings.providerTtsModels[provider] ||
    PROVIDER_DEFAULT_TTS_MODELS[provider] ||
    getProviderTtsModelOptions(provider)[0]?.id ||
    "";
  const selectedProvider =
    settings.ttsMode === "provider" ? settings.ttsProvider : null;
  const selectedProviderModel = selectedProvider
    ? providerModel(selectedProvider)
    : "";
  const instructionsSupported = Boolean(
    selectedProvider &&
      providerTtsModelSupportsInstructions(
        selectedProvider,
        selectedProviderModel,
      ),
  );
  const kokoroLanguage =
    settings.localLanguages.map(getKokoroLanguage).find(Boolean) ?? "en";

  const voiceRouteTitle = voicePicker
    ? voicePicker.kind === "native"
      ? t("systemVoice")
      : voicePicker.kind === "kokoro"
        ? "Kokoro"
        : PROVIDER_LABELS[voicePicker.provider]
    : t("ttsVoice");
  let voiceOptions: VoicePickerOption[] = [];
  let selectedVoice = "";
  let directoryStatus: string | null = null;
  let refreshVoices: (() => void) | undefined;

  if (voicePicker?.kind === "native") {
    voiceOptions = localModels.nativeVoiceOptions;
    selectedVoice = localModels.selectedNativeVoice;
  } else if (voicePicker?.kind === "kokoro") {
    voiceOptions = getKokoroVoiceOptions(voicePicker.language, language);
    selectedVoice = settings.kokoroVoices[voicePicker.language];
  } else if (voicePicker?.kind === "provider") {
    const provider = voicePicker.provider;
    const directory = providerVoiceDirectories[provider];
    selectedVoice =
      settings.providerTtsVoices[provider] ||
      PROVIDER_DEFAULT_TTS_VOICES[provider] ||
      "";
    voiceOptions = getProviderVoicePickerOptions({
      provider,
      model: providerModel(provider),
      language,
      directory,
      selectedVoice,
    });
    if (providerUsesTtsVoiceDirectory(provider) && directory) {
      refreshVoices = () => void directory.refresh();
      directoryStatus =
        directory.status === "loading" || directory.status === "refreshing"
          ? t("providerVoicesLoadingHint", {
              provider: PROVIDER_LABELS[provider],
            })
          : directory.status === "error"
            ? [
                t(
                  getProviderTtsVoiceOptions(
                    provider,
                    language,
                    providerModel(provider),
                  ).length > 0
                    ? "providerVoicesLoadFailedWithFallback"
                    : "providerVoicesLoadFailed",
                ),
                directory.error
                  ? t("providerVoicesErrorDetail", {
                      detail: directory.error.message,
                    })
                  : null,
                provider === "elevenlabs" &&
                directory.error?.message.toLocaleLowerCase().includes(
                  "voices_read",
                )
                  ? t("elevenLabsVoicesReadPermissionHint")
                  : null,
              ]
                .filter(Boolean)
                .join("\n")
            : null;
    }
  }

  const selectedVoiceLabel = (options: readonly VoicePickerOption[], value: string) =>
    options.find((option) => option.value === value)?.label || value;
  const providerVoiceRow = (provider: Provider) => {
    const model = providerModel(provider);
    const directory = providerVoiceDirectories[provider];
    const voice =
      settings.providerTtsVoices[provider] ||
      PROVIDER_DEFAULT_TTS_VOICES[provider] ||
      "";
    const options = getProviderVoicePickerOptions({
      provider,
      model,
      language,
      directory,
      selectedVoice: voice,
    });
    if (
      !providerRequiresTtsVoice(provider) &&
      !providerUsesTtsVoiceDirectory(provider) &&
      options.length === 0
    ) {
      return null;
    }
    return (
      <SettingsRow
        testID={`settings-tts-provider-${provider}-voice`}
        label={t("ttsVoice")}
        last
        value={selectedVoiceLabel(options, voice)}
        onPress={() => setVoicePicker({ kind: "provider", provider })}
      />
    );
  };
  const kokoroVoiceRow = (model: LocalModelDefinition) =>
    model.id === "kokoro-multilingual" ? (
      <SettingsRow
        testID="settings-tts-kokoro-voice"
        label={t("ttsVoice")}
        last
        value={selectedVoiceLabel(
          getKokoroVoiceOptions(kokoroLanguage, language),
          settings.kokoroVoices[kokoroLanguage],
        )}
        onPress={() =>
          setVoicePicker({ kind: "kokoro", language: kokoroLanguage })
        }
      />
    ) : null;

  const handleVoiceSelect = (voice: string) => {
    if (voicePicker?.kind === "native") {
      localModels.selectNativeVoice(voice);
    } else if (voicePicker?.kind === "kokoro") {
      onUpdate({
        kokoroVoices: {
          ...settings.kokoroVoices,
          [voicePicker.language]: voice,
        },
      });
    } else if (voicePicker?.kind === "provider") {
      onUpdateProviderTtsVoice(voicePicker.provider, voice);
    }
  };
  const handleVoicePreview = (voice: string) => {
    if (voicePicker?.kind === "native") {
      void onPreviewNativeVoice(voice);
    } else if (voicePicker?.kind === "kokoro") {
      void onPreviewKokoroVoice(voicePicker.language, voice);
    } else if (voicePicker?.kind === "provider") {
      void onPreviewProviderVoice(voicePicker.provider, previewLanguage, voice);
    }
  };
  const busyVoice = voiceOptions.find((option) =>
    activePreview?.id.endsWith(`:${option.value}`),
  )?.value;
  const handleClearSpeechCache = async () => {
    if (isClearingSpeechCache) {
      return;
    }
    setIsClearingSpeechCache(true);
    setSpeechCacheOutcome(null);
    try {
      await clearProviderTtsAudioCache();
      setSpeechCacheOutcome("success");
      AccessibilityInfo.announceForAccessibility(
        t("speechReplayCacheCleared"),
      );
    } catch {
      setSpeechCacheOutcome("error");
      AccessibilityInfo.announceForAccessibility(
        t("speechReplayCacheClearFailed"),
      );
    } finally {
      setIsClearingSpeechCache(false);
    }
  };

  return (
    <View testID="speaking-settings-page" style={styles.sectionPageStack}>
      <SettingsGroup title={t("speakingPlayback")}>
        <SettingsChoiceRow<ReplyPlayback>
          testID="reply-playback-picker"
          icon="play-circle"
          label={t("startSpeaking")}
          options={[
            { value: "stream", label: t("sentencesArrive") },
            { value: "wait", label: t("fullReplyFirst") },
          ]}
          value={settings.replyPlayback}
          onChange={(replyPlayback) => onUpdate({ replyPlayback })}
        />
        <SettingsRow
          testID="speaking-instructions-row"
          icon="edit"
          label={t("ttsInstructions")}
          last
          disabled={!instructionsSupported}
          supporting={
            instructionsSupported ? undefined : t("ttsInstructionsUnsupported")
          }
          value={
            settings.ttsInstructions.trim()
              ? t("providerStatusConfigured")
              : t("settingsReadinessOff")
          }
          onPress={() => setInstructionsVisible(true)}
        />
      </SettingsGroup>

      <LocalModelRouteGroup
        capability="tts"
        title={t("whoSpeaks")}
        footer={t("voiceOutputDescription")}
        freeProviderRoutes={allTtsProviders}
        isPremium={isPremium}
        localModels={localModels}
        localSub={kokoroVoiceRow}
        nativeSub={
          localModels.nativeVoiceOptions.length > 0 ? (
            <SettingsRow
              testID="settings-tts-native-voice"
              label={t("ttsVoice")}
              last
              value={selectedVoiceLabel(
                localModels.nativeVoiceOptions,
                localModels.selectedNativeVoice,
              )}
              onPress={() => setVoicePicker({ kind: "native" })}
            />
          ) : null
        }
        onOpenPremium={onOpenPremium}
        premiumCopy={t("premiumDescription")}
        settings={settings}
        providerRoutes={selectableTtsProviders.map((provider) => ({
          provider,
          model: providerModel(provider),
          modelOptions: getProviderTtsModelOptions(provider),
          selected:
            settings.ttsMode === "provider" &&
            settings.ttsProvider === provider,
          sub: providerVoiceRow(provider),
          onModelChange: (model: string) =>
            onUpdateProviderTtsModel(provider, model),
          onSelect: () =>
            onUpdate({
              spokenRepliesEnabled: true,
              ttsMode: "provider",
              ttsProvider: provider,
            }),
        }))}
      />

      <SettingsGroup
        title={t("autoSetupFactStorage")}
        footer={t("speechReplayCacheDescription")}
      >
        <SettingsRow
          testID="clear-speech-replay-cache"
          control={null}
          danger
          disabled={isClearingSpeechCache}
          icon="delete"
          label={t("clearSpeechReplayCache")}
          last
          onPress={() => void handleClearSpeechCache()}
          supporting={
            speechCacheOutcome === "success"
              ? t("speechReplayCacheCleared")
              : speechCacheOutcome === "error"
                ? t("speechReplayCacheClearFailed")
                : undefined
          }
          supportingTone={
            speechCacheOutcome === "error" ? "danger" : "default"
          }
        />
      </SettingsGroup>

      <InstructionsSheet
        visible={instructionsVisible}
        value={settings.ttsInstructions}
        onTextInputFocus={onTextInputFocus}
        onChange={(ttsInstructions) => onUpdate({ ttsInstructions })}
        onClose={() => setInstructionsVisible(false)}
      />
      <VoicePickerSheet
        testID="speaking-voice-picker"
        visible={voicePicker !== null}
        title={voiceRouteTitle}
        options={voiceOptions}
        value={selectedVoice}
        busyValue={busyVoice}
        directoryStatus={directoryStatus}
        onRefresh={refreshVoices}
        onSelect={handleVoiceSelect}
        onPreview={handleVoicePreview}
        onClose={() => setVoicePicker(null)}
      />
    </View>
  );
}

const pageStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  instructionsSheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
  },
  sheetHeader: {
    minHeight: 58,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sheetTitle: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 17,
    lineHeight: 22,
  },
  instructionsHint: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  instructionsInput: {
    marginHorizontal: 18,
  },
});
