import React from "react";
import {
  Animated,
  BackHandler,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSettingsReadiness } from "../settings-core/readiness";
import type {
  SettingsModalProps,
  SettingsPage,
} from "../settings-core/types";
import { useProviderValidationState } from "../settings-core/useProviderValidationState";
import { useSettingsController } from "../settings-core/useSettingsController";
import { Toast } from "../../components/Toast";
import { AntIconButton } from "../../design-system/AntIconButton";
import { useLocalization } from "../../i18n";
import { useTheme } from "../../theme/ThemeContext";
import {
  Provider,
  ProviderCapability,
  ProviderValidationResult,
  TtsListenLanguage,
} from "../../types";

import { AntSettingsOverview } from "./AntSettingsOverview";
import { AppSettingsPage } from "./pages/AppSettingsPage";
import { ConnectionsSettingsPage } from "./pages/ConnectionsSettingsPage";
import { ListeningSettingsPage } from "./pages/ListeningSettingsPage";
import { SearchSettingsPage } from "./pages/SearchSettingsPage";
import { SpeakingSettingsPage } from "./pages/SpeakingSettingsPage";
import { ThinkingSettingsPage } from "./pages/ThinkingSettingsPage";
import { styles } from "./styles";

type DrillInSettingsPage = Exclude<SettingsPage, "overview">;

function getInitialSettingsPage({
  focusProvider,
  focusCatalogProviderId,
  focusTab,
}: Pick<
  SettingsModalProps,
  "focusProvider" | "focusCatalogProviderId" | "focusTab"
>): SettingsPage {
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

export const AntSettingsModal = React.memo(function AntSettingsModal(
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
  const entrance = React.useRef(new Animated.Value(0)).current;
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
  } = useSettingsController({
    visible,
    settings,
    onUpdate,
    onPreviewVoice,
    onStopPreviewVoice,
  });
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
      kokoroModel.installed,
      selectableLlmProviders,
      selectableSearchProviders,
      selectableSttProviders,
      selectableTtsProviders,
      settings,
    ],
  );

  React.useEffect(() => {
    if (!visible) {
      entrance.setValue(0);
      return;
    }

    setActivePage(
      getInitialSettingsPage({
        focusProvider,
        focusCatalogProviderId,
        focusTab,
      }),
    );
    Animated.timing(entrance, {
      toValue: 1,
      duration: 190,
      useNativeDriver: true,
    }).start();
  }, [
    entrance,
    focusCatalogProviderId,
    focusProvider,
    focusTab,
    visible,
  ]);

  React.useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        contentScrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    }
  }, [activePage, visible]);

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

  const renderDrillInPage = React.useCallback(
    (page: DrillInSettingsPage, children: React.ReactNode) => (
      <View style={styles.drillInPage}>
        <Text
          style={[
            styles.drillInSummary,
            { color: colors.textSecondary },
          ]}
        >
          {getPageSummary(page)}
        </Text>
        {children}
      </View>
    ),
    [colors.textSecondary, getPageSummary],
  );

  const activeContent = (() => {
    switch (activePage) {
      case "overview":
        return (
          <AntSettingsOverview
            readiness={readiness}
            onOpenPage={setActivePage}
            onOpenSetupGuide={onOpenSetupGuide}
          />
        );
      case "connections":
        return renderDrillInPage(
          "connections",
          <ConnectionsSettingsPage
            settings={settings}
            focusProvider={focusProvider}
            focusCatalogProviderId={focusCatalogProviderId}
            getProviderHealthState={getHealthState}
            getProviderCapabilityHealthState={getCapabilityHealthState}
            getProviderValidationState={getValidationState}
            canValidateCapability={canValidateCapability}
            onValidateCapability={async (provider, capability) => {
              setValidationToastMessage(null);
              await validateProviderCapabilityForSettings(
                provider,
                capability,
              );
            }}
            onValidateAll={async (provider) => {
              setValidationToastMessage(null);
              await validateAllProviderCapabilities(provider);
            }}
            onUpdateApiKey={onUpdateApiKey}
            onTextInputFocus={handleTextInputFocus}
          />,
        );
      case "thinking":
        return renderDrillInPage(
          "thinking",
          <ThinkingSettingsPage
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
          <ListeningSettingsPage
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
          <SpeakingSettingsPage
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
      case "search":
        return renderDrillInPage(
          "search",
          <SearchSettingsPage
            settings={settings}
            searchProviders={selectableSearchProviders}
            onUpdate={onUpdate}
          />,
        );
      case "app":
        return renderDrillInPage(
          "app",
          <AppSettingsPage
            settings={settings}
            speechDiagnostics={speechDiagnostics}
            onUpdate={onUpdate}
          />,
        );
    }
  })();

  const showsBackButton = activePage !== "overview";
  const title =
    activePage === "overview" ? t("settings") : getPageTitle(activePage);
  const animatedModalStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (activePage !== "overview") {
          setActivePage("overview");
        } else {
          onClose();
        }
        return true;
      },
    );

    return () => subscription.remove();
  }, [activePage, onClose, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View
      accessibilityViewIsModal
      style={[
        styles.overlay,
        {
          paddingTop: isLandscape ? Math.max(insets.top + 8, 16) : 0,
          paddingBottom: isLandscape
            ? Math.max(insets.bottom + 8, 16)
            : 0,
          paddingHorizontal: isLandscape ? 12 : 0,
        },
      ]}
    >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdrop,
            {
              backgroundColor: colors.overlay,
              opacity: entrance,
            },
          ]}
        />
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessible={false}
        />
        <Animated.View
          style={[
            styles.modal,
            isLandscape ? styles.modalLandscape : null,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: isLandscape ? 22 : 0,
              borderWidth: isLandscape ? 1 : 0,
              maxWidth: modalMaxWidth,
              shadowColor: colors.glow,
            },
            animatedModalStyle,
          ]}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                paddingTop: isLandscape ? 14 : insets.top + 12,
              },
            ]}
          >
            {showsBackButton ? (
              <AntIconButton
                icon="left"
                iconSize={23}
                style={styles.headerControl}
                onPress={() => setActivePage("overview")}
                accessibilityLabel={t("settingsBackToOverview")}
              />
            ) : (
              <View style={styles.headerControl} />
            )}
            <View style={styles.headerTitleWrap}>
              <Text
                testID="settings-modal-title"
                accessibilityRole="header"
                style={[styles.headerTitle, { color: colors.text }]}
              >
                {title}
              </Text>
            </View>
            <AntIconButton
              icon="close"
              style={styles.headerControl}
              onPress={onClose}
              accessibilityLabel={t("dismiss")}
            />
          </View>

          <ScrollView
            ref={contentScrollRef}
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom: Math.max(insets.bottom + 20, keyboardInset + 20),
              },
            ]}
            showsVerticalScrollIndicator={false}
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
  );
});
