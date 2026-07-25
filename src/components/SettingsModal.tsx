import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import Feather from "@expo/vector-icons/Feather";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_MODAL_ORIENTATIONS } from "../constants/layout";
import { useLocalization } from "../i18n";
import {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
  TtsListenLanguage,
} from "../types";
import { useTheme } from "../theme/ThemeContext";

import {
  ApiKeysSection,
  ListeningSection,
  SearchSection,
  SpeakingSection,
  ThinkingSection,
} from "./settings/SettingsFlowSections";
import { SettingsOverview } from "./settings/SettingsOverview";
import { Toast } from "./Toast";
import { getSettingsReadiness } from "./settings/readiness";
import { SpeechDiagnosticsSection } from "./settings/shared";
import { styles } from "./settings/styles";
import { SettingsModalProps, SettingsPage } from "./settings/types";
import { UiTab } from "./settings/UiTab";
import { useProviderValidationState } from "./settings/useProviderValidationState";
import { useSettingsModalController } from "./settings/useSettingsModalController";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

function getInitialSettingsPage(params: {
  focusProvider?: SettingsModalProps["focusProvider"];
  focusCatalogProviderId?: SettingsModalProps["focusCatalogProviderId"];
  focusTab?: SettingsModalProps["focusTab"];
}): SettingsPage {
  const { focusProvider, focusCatalogProviderId, focusTab } = params;

  if (focusProvider || focusCatalogProviderId || focusTab === "providers") {
    return "connections";
  }

  if (focusTab === "instructions") {
    return "thinking";
  }

  if (focusTab === "stt") {
    return "listening";
  }

  if (focusTab === "tts") {
    return "speaking";
  }

  if (focusTab === "web") {
    return "search";
  }

  if (focusTab === "ui") {
    return "app";
  }

  return "overview";
}

export const SettingsModal = React.memo(function SettingsModal(
  props: SettingsModalProps,
) {
  const {
    visible,
    settings,
    kokoroModel,
    focusProvider,
    focusCatalogProviderId,
    focusTab,
    onUpdate,
    onUpdateResponseModeRoute,
    onAddResponseMode,
    onRemoveResponseMode,
    onUpdateProviderSttModel,
    onUpdateProviderTtsModel,
    onUpdateProviderTtsVoice,
    providerVoiceDirectories,
    onUpdateApiKey,
    onPreviewVoice,
    onStopPreviewVoice,
    onValidateProviderCapability,
    onOpenSetupGuide,
    onClose,
  } = props;
  const { colors } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const modalMaxWidth = isLandscape ? Math.min(width - 24, 980) : width;
  const [activePage, setActivePage] = React.useState<SettingsPage>(() =>
    getInitialSettingsPage({
      focusProvider,
      focusCatalogProviderId,
      focusTab,
    }),
  );
  const [validationToastMessage, setValidationToastMessage] = React.useState<
    string | null
  >(null);
  const handleProviderValidationResult = React.useCallback(
    (
      provider: Provider,
      capability: ProviderCapability,
      result: ProviderValidationResult,
    ) => {
      onUpdate({
        providerValidationResults: {
          ...settings.providerValidationResults,
          [provider]: {
            ...settings.providerValidationResults[provider],
            [capability]: result,
          },
        },
      });
    },
    [onUpdate, settings.providerValidationResults],
  );
  const {
    contentScrollRef,
    providerPreviewTexts,
    kokoroPreviewTexts,
    setProviderPreviewText,
    setKokoroPreviewText,
    nativePreviewText,
    setNativePreviewText,
    activePreview,
    keyboardInset,
    speechDiagnostics,
    modalAnimStyle,
    handleTextInputFocus,
    handlePreviewProviderVoice,
    handlePreviewNativeVoice,
    handlePreviewKokoroVoice,
    selectedSttProviderModelOptions,
    selectedSttProviderModel,
    sttLanguageNote,
    sttLimitNote,
    ttsLanguageNote,
    selectedPreviewProvider,
    selectedPreviewProviderModelOptions,
    selectedPreviewProviderModel,
    nativeVoiceOptions,
    selectedNativeVoice,
    setSelectedNativeVoice,
    toggleListenLanguage,
  } = useSettingsModalController({
    visible,
    settings,
    onUpdate,
    onPreviewVoice,
    onStopPreviewVoice,
  });
  const {
    getHealthState,
    getCapabilityHealthState,
    getValidationState,
    canValidateCapability,
    validateProviderCapabilityForSettings,
    validateAllProviderCapabilities,
    selectableLlmProviders,
    selectableSttProviders,
    selectableTtsProviders,
    selectableSearchProviders,
  } = useProviderValidationState({
    settings,
    onValidateProviderCapability,
    onValidationError: setValidationToastMessage,
    onValidationResult: handleProviderValidationResult,
  });
  const handleValidateProviderCapabilityForSettings = React.useCallback(
    async (provider: Provider, capability: ProviderCapability) => {
      setValidationToastMessage(null);
      await validateProviderCapabilityForSettings(provider, capability);
    },
    [validateProviderCapabilityForSettings],
  );
  const handleValidateAllProviderCapabilities = React.useCallback(
    async (provider: Provider) => {
      setValidationToastMessage(null);
      await validateAllProviderCapabilities(provider);
    },
    [validateAllProviderCapabilities],
  );
  const readiness = React.useMemo(
    () =>
      getSettingsReadiness(settings, {
        llmProviders: selectableLlmProviders,
        sttProviders: selectableSttProviders,
        ttsProviders: selectableTtsProviders,
        searchProviders: selectableSearchProviders,
        kokoroInstalled: kokoroModel.installed,
      }),
    [
      selectableLlmProviders,
      kokoroModel.installed,
      selectableSearchProviders,
      selectableSttProviders,
      selectableTtsProviders,
      settings,
    ],
  );
  const showsBackButton = activePage !== "overview";

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setActivePage(
      getInitialSettingsPage({
        focusProvider,
        focusCatalogProviderId,
        focusTab,
      }),
    );
  }, [focusCatalogProviderId, focusProvider, focusTab, visible]);

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    requestAnimationFrame(() => {
      contentScrollRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [activePage, contentScrollRef, visible]);

  const getPageTitle = React.useCallback(
    (page: DrillInSettingsPage) => {
      switch (page) {
        case "connections":
          return t("settingsConnections");
        case "thinking":
          return t("settingsThinking");
        case "listening":
          return t("settingsListening");
        case "speaking":
          return t("settingsSpeaking");
        case "search":
          return t("settingsSearch");
        case "app":
          return t("settingsAppDiagnostics");
      }
    },
    [t],
  );

  const getPageSummary = React.useCallback(
    (page: DrillInSettingsPage) => {
      switch (page) {
        case "connections":
          return t("settingsConnectionsSummary");
        case "thinking":
          return t("settingsThinkingSummary");
        case "listening":
          return t("settingsListeningSummary");
        case "speaking":
          return t("settingsSpeakingSummary");
        case "search":
          return t("settingsSearchSummary");
        case "app":
          return t("settingsAppDiagnosticsSummary");
      }
    },
    [t],
  );

  const modalTitle =
    activePage === "overview" ? t("settings") : getPageTitle(activePage);

  const renderDrillInPage = React.useCallback(
    (page: DrillInSettingsPage, children: React.ReactNode) => (
      <View style={styles.tabPane}>
        <View style={styles.drillInHeader}>
          <Text
            style={[styles.drillInSummary, { color: colors.textSecondary }]}
          >
            {getPageSummary(page)}
          </Text>
        </View>
        {children}
      </View>
    ),
    [colors.textMuted, getPageSummary],
  );

  const activeContent = (() => {
    switch (activePage) {
      case "overview":
        return (
          <SettingsOverview
            readiness={readiness}
            onOpenPage={(page) => setActivePage(page)}
            onOpenSetupGuide={onOpenSetupGuide}
          />
        );
      case "connections":
        return renderDrillInPage(
          "connections",
          <ApiKeysSection
            settings={settings}
            focusProvider={focusProvider}
            focusCatalogProviderId={focusCatalogProviderId}
            getProviderHealthState={getHealthState}
            getProviderCapabilityHealthState={getCapabilityHealthState}
            getProviderValidationState={getValidationState}
            canValidateCapability={canValidateCapability}
            onValidateCapability={
              handleValidateProviderCapabilityForSettings
            }
            onValidateAll={handleValidateAllProviderCapabilities}
            onUpdateApiKey={onUpdateApiKey}
            onTextInputFocus={handleTextInputFocus}
          />,
        );
      case "thinking":
        return renderDrillInPage(
          "thinking",
          <ThinkingSection
            settings={settings}
            llmProviders={selectableLlmProviders}
            onUpdate={onUpdate}
            onUpdateResponseModeRoute={onUpdateResponseModeRoute}
            onAddResponseMode={onAddResponseMode}
            onRemoveResponseMode={onRemoveResponseMode}
          />,
        );
      case "listening":
        return renderDrillInPage(
          "listening",
          <ListeningSection
            settings={settings}
            selectableSttProviders={selectableSttProviders}
            selectedSttProviderModelOptions={selectedSttProviderModelOptions}
            selectedSttProviderModel={selectedSttProviderModel}
            sttLanguageNote={sttLanguageNote}
            sttLimitNote={sttLimitNote}
            onUpdate={onUpdate}
            onUpdateProviderSttModel={onUpdateProviderSttModel}
          />,
        );
      case "speaking":
        return renderDrillInPage(
          "speaking",
          <SpeakingSection
            settings={settings}
            kokoroModel={kokoroModel}
            selectableTtsProviders={selectableTtsProviders}
            ttsLanguageNote={ttsLanguageNote}
            selectedPreviewProvider={selectedPreviewProvider}
            selectedPreviewProviderModelOptions={
              selectedPreviewProviderModelOptions
            }
            selectedPreviewProviderModel={selectedPreviewProviderModel}
            providerPreviewTexts={providerPreviewTexts}
            activePreview={activePreview}
            nativeVoiceOptions={nativeVoiceOptions}
            selectedNativeVoice={selectedNativeVoice}
            nativePreviewText={nativePreviewText}
            kokoroPreviewTexts={kokoroPreviewTexts}
            onUpdate={onUpdate}
            onUpdateProviderTtsModel={onUpdateProviderTtsModel}
            onUpdateProviderTtsVoice={onUpdateProviderTtsVoice}
            providerVoiceDirectories={providerVoiceDirectories}
            onStopPreviewVoice={onStopPreviewVoice}
            onSetProviderPreviewText={(
              provider: Provider,
              language: TtsListenLanguage,
              text: string,
            ) => setProviderPreviewText(provider, language, text)}
            onSetNativePreviewText={setNativePreviewText}
            onSetKokoroPreviewText={setKokoroPreviewText}
            onPreviewProviderVoice={handlePreviewProviderVoice}
            onPreviewNativeVoice={handlePreviewNativeVoice}
            onPreviewKokoroVoice={handlePreviewKokoroVoice}
            onSelectNativeVoice={setSelectedNativeVoice}
            onTextInputFocus={handleTextInputFocus}
            onToggleListenLanguage={toggleListenLanguage}
          />,
        );
      case "app":
        return renderDrillInPage(
          "app",
          <>
            <UiTab settings={settings} onUpdate={onUpdate} />
            <SpeechDiagnosticsSection summaries={speechDiagnostics} />
          </>,
        );
      case "search":
        return renderDrillInPage(
          "search",
          <SearchSection
            settings={settings}
            searchProviders={selectableSearchProviders}
            onUpdate={onUpdate}
          />,
        );
    }
  })();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      supportedOrientations={APP_MODAL_ORIENTATIONS}
    >
      <View
        accessibilityViewIsModal
        style={[
          styles.overlay,
          {
            paddingTop: isLandscape ? Math.max(insets.top + 8, 16) : 0,
            paddingBottom: 0,
            paddingHorizontal: isLandscape ? 12 : 0,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={onClose}
          accessible={false}
        />
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              maxWidth: modalMaxWidth,
              shadowColor: colors.glow,
              borderRadius: isLandscape ? 22 : 0,
              borderWidth: isLandscape ? 1 : 0,
            },
            modalAnimStyle,
          ]}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                paddingTop: isLandscape ? 18 : insets.top + 14,
              },
            ]}
          >
            <View style={styles.headerControlSlot}>
              {showsBackButton ? (
                <TouchableOpacity
                  style={[
                    styles.headerBackButton,
                    {
                      backgroundColor: colors.surfaceElevated,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setActivePage("overview")}
                  accessibilityRole="button"
                  accessibilityLabel={t("settingsBackToOverview")}
                >
                  <Feather
                    name="chevron-left"
                    size={20}
                    color={colors.accent}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.headerCopy}>
              <Text
                testID="settings-modal-title"
                accessibilityRole="header"
                style={[styles.title, { color: colors.text }]}
              >
                {modalTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.surfaceElevated,
                  borderColor: colors.border,
                },
              ]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t("dismiss")}
            >
              <Feather name="x" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={contentScrollRef}
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              isLandscape ? styles.contentLandscape : null,
              {
                paddingBottom: Math.max(insets.bottom + 20, keyboardInset + 20),
              },
            ]}
            scrollIndicatorInsets={{ bottom: keyboardInset }}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="interactive"
            nestedScrollEnabled
          >
            {activeContent}
          </ScrollView>
        </Animated.View>
        <Toast
          message={validationToastMessage ?? ""}
          visible={validationToastMessage !== null}
          onDismiss={() => setValidationToastMessage(null)}
          tone="danger"
        />
      </View>
    </Modal>
  );
});
