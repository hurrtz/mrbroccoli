import React, { useState, useCallback, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationDrawer } from "../components/ConversationDrawer";
import { ConversationMemoryModal } from "../components/ConversationMemoryModal";
import { SettingsModal } from "../components/SettingsModal";
import { SetupGuideModal } from "../components/SetupGuideModal";
import { Toast } from "../components/Toast";
import {
  PROVIDER_DEFAULT_STT_MODELS,
  PROVIDER_DEFAULT_TTS_MODELS,
  PROVIDER_DEFAULT_TTS_VOICES,
  PROVIDER_LABELS,
  getProviderTtsVoiceOptions,
  getTtsModelLabel,
  providerTtsModelSupportsInstructions,
} from "../constants/models";
import { useSharedSettings } from "../context/SettingsContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useNativeSpeechRecognizer } from "../hooks/useNativeSpeechRecognizer";
import { useConversations } from "../hooks/useConversations";
import { useVoicePipeline } from "../hooks/useVoicePipeline";
import { useBatteryDiagnostics } from "../hooks/useBatteryDiagnostics";
import { useLocalization } from "../i18n";
import { recordDebugLogEvent } from "../services/debugLogCapture";
import { providerHasVoiceDirectory } from "../services/providerVoiceDirectory";
import { useTheme } from "../theme/ThemeContext";
import { Provider, ResponseMode, ToastTone } from "../types";
import {
  getEnabledSttProviders,
  getEnabledTtsProviders,
} from "../utils/providerCapabilities";
import { hasProviderCredentialForCapability } from "../utils/providerCredentials";
import {
  getAvailableResponseModes,
  getResponseModeRoute,
} from "../utils/responseModes";
import { MainScreenWorkspace } from "./main/MainScreenWorkspace";
import { StyleSheetModal } from "./main/StyleSheetModal";
import { StatusDetailsModal } from "./main/StatusDetailsModal";
import { getMainScreenViewModel } from "./main/mainScreenViewModel";
import { styles } from "./main/styles";
import { useConversationActions } from "./main/useConversationActions";
import { useConversationTitleGenerator } from "./main/useConversationTitleGenerator";
import { useConversationSettings } from "./main/useConversationSettings";
import { useDebugLogCaptureController } from "./main/useDebugLogCaptureController";
import { useMainScreenUiState } from "./main/useMainScreenUiState";
import { useMainScreenVoiceDirectories } from "./main/useMainScreenVoiceDirectories";
import { useMainScreenDiagnostics } from "./main/useMainScreenDiagnostics";
import { usePreviewVoiceController } from "./main/usePreviewVoiceController";
import { usePersistenceFailureAlert } from "./main/usePersistenceFailureAlert";
import { useProviderAvailabilityGuards } from "./main/useProviderAvailabilityGuards";
import { useProviderConnectionValidation } from "./main/useProviderConnectionValidation";
import { useSetupGuideController } from "./main/useSetupGuideController";
import { useTextTurnSubmitController } from "./main/useTextTurnSubmitController";
import { useVoiceSessionController } from "./main/useVoiceSessionController";

export function MainScreen() {
  const { colors, isDark } = useTheme();
  const { t, language } = useLocalization();
  const { height, width } = useWindowDimensions();
  const {
    settings,
    updateSettings,
    updateActiveResponseMode,
    updateResponseModeRoute,
    addResponseMode,
    removeResponseMode,
    updateProviderSttModel,
    updateProviderTtsModel,
    updateProviderTtsVoice,
    updateApiKey,
    loaded,
  } = useSharedSettings();
  const providerVoiceDirectories = useMainScreenVoiceDirectories({
    loaded,
    settings,
    updateProviderTtsVoice,
  });
  const {
    conversations,
    activeConversation,
    createConversation,
    selectConversation,
    getConversationById,
    addMessage,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationMemory,
    renameConversation,
    toggleConversationPinned,
    searchConversations,
    deleteConversation,
    clearActiveConversation,
    loaded: conversationsLoaded = true,
  } = useConversations();

  const recorder = useAudioRecorder();
  const nativeStt = useNativeSpeechRecognizer();
  const player = useAudioPlayer();

  const [toast, setToast] = useState<{
    message: string;
    onRetry?: () => void;
    tone?: ToastTone;
  } | null>(null);
  const [styleSheetVisible, setStyleSheetVisible] = useState(false);
  const inputSurfaceRef = React.useRef<"voice" | "text">("voice");
  const textMessageDraftRef = React.useRef("");
  const handleInputSurfaceChange = useCallback(
    (surface: "voice" | "text") => {
      inputSurfaceRef.current = surface;
    },
    [],
  );
  const handleTextMessageChange = useCallback((text: string) => {
    textMessageDraftRef.current = text;
  }, []);
  const {
    settingsVisible,
    settingsFocusCatalogProviderId,
    settingsFocusTab,
    drawerVisible,
    statusDetailsVisible,
    setupGuideVisible,
    memoryConversation,
    memoryVisible,
    setDrawerVisible,
    setSetupGuideVisible,
    setMemoryConversation,
    openSettings,
    closeSettings,
    openMemoryConversation,
    closeMemory,
    openStatusDetails,
    closeStatusDetails,
    runAfterDrawerDismiss,
    handleDrawerDismiss,
  } = useMainScreenUiState();

  const activeResponseMode = settings.activeResponseMode;
  const activeResponseRoute = getResponseModeRoute(settings);
  const provider = activeResponseRoute.provider;
  const providerApiKey = settings.apiKeys[provider].trim();
  const voiceInputDisabled =
    !conversationsLoaded ||
    !hasProviderCredentialForCapability(provider, providerApiKey, "llm");
  const model = activeResponseRoute.model;
  const modelEffort = activeResponseRoute.effort;
  const availableResponseModes = getAvailableResponseModes(settings);
  const availableSttProviders = getEnabledSttProviders(settings);
  const availableTtsProviders = getEnabledTtsProviders(settings);
  const sttProvider =
    settings.sttMode === "provider" ? settings.sttProvider : null;
  const ttsProvider = settings.ttsProvider;
  const webSearchProvider = settings.webSearchProvider;
  const webSearchMode = settings.webSearchMode;
  const sttApiKey = sttProvider ? settings.apiKeys[sttProvider].trim() : "";
  const ttsApiKey = ttsProvider ? settings.apiKeys[ttsProvider].trim() : "";
  const webSearchApiKey = webSearchProvider
    ? settings.apiKeys[webSearchProvider].trim()
    : "";
  const webSearchOptions = webSearchProvider
    ? settings.webSearchProviderSettings[webSearchProvider]
    : undefined;
  const webSearchReady =
    !!webSearchProvider &&
    hasProviderCredentialForCapability(
      webSearchProvider,
      webSearchApiKey,
      "search",
    );
  const webSearchActive = webSearchMode !== "off" && webSearchReady;
  const isLandscape = width > height;
  const showStyleChip = loaded && availableResponseModes.length > 0;
  const mainSurfaceVisible = !(
    drawerVisible ||
    memoryVisible ||
    settingsVisible ||
    setupGuideVisible ||
    statusDetailsVisible ||
    styleSheetVisible
  );
  const selectedSttModel = sttProvider
    ? settings.providerSttModels[sttProvider] ||
      PROVIDER_DEFAULT_STT_MODELS[sttProvider] ||
      ""
    : "";
  const globalSelectedTtsVoice = ttsProvider
    ? settings.providerTtsVoices[ttsProvider] ||
      PROVIDER_DEFAULT_TTS_VOICES[ttsProvider] ||
      ""
    : "";
  const selectedTtsModel = ttsProvider
    ? settings.providerTtsModels[ttsProvider] ||
      PROVIDER_DEFAULT_TTS_MODELS[ttsProvider] ||
      ""
    : "";
  const {
    assistantInstructions,
    effectiveTtsInstructions,
    initialConversationSettings,
    llmInstructions,
    responseLength,
    responseTone,
    selectedTtsVoice,
    ttsInstructions,
    updateLlmInstructions,
    updateResponseSettings,
    updateTtsInstructions,
    updateTtsVoice,
  } = useConversationSettings({
    activeConversation,
    globalAssistantInstructions: settings.assistantInstructions,
    globalResponseLength: settings.responseLength,
    globalResponseTone: settings.responseTone,
    globalTtsInstructions: settings.ttsInstructions,
    globalTtsVoice: globalSelectedTtsVoice,
    ttsModel: selectedTtsModel,
    ttsProvider,
    updateConversationSettings,
  });
  const conversationTtsVoiceOptions =
    settings.ttsMode === "provider" && ttsProvider
      ? providerHasVoiceDirectory(ttsProvider)
        ? (
            providerVoiceDirectories[ttsProvider]?.voices.length
              ? providerVoiceDirectories[ttsProvider]?.voices ?? []
              : getProviderTtsVoiceOptions(
                  ttsProvider,
                  language,
                  selectedTtsModel,
                )
          ).map((voice) => ({
            value:
              "value" in voice && typeof voice.value === "string"
                ? voice.value
                : voice.id,
            label: voice.label,
          }))
        : getProviderTtsVoiceOptions(
            ttsProvider,
            language,
            selectedTtsModel,
          ).map((voice) => ({
            value: voice.id,
            label: voice.label,
          }))
      : [];
  const conversationTtsRouteLabel =
    settings.ttsMode === "provider" && ttsProvider && selectedTtsModel
      ? `${PROVIDER_LABELS[ttsProvider]} · ${getTtsModelLabel(
          ttsProvider,
          selectedTtsModel,
        )}`
      : null;
  const ttsInstructionsSupported =
    settings.ttsMode === "provider" && ttsProvider
      ? providerTtsModelSupportsInstructions(ttsProvider, selectedTtsModel)
      : false;
  const providerLabel = PROVIDER_LABELS[provider];
  const isRecording =
    settings.sttMode === "native"
      ? nativeStt.isRecording
      : recorder.isRecording;
  const showToast = useCallback(
    (message: string, onRetry?: () => void, tone: ToastTone = "info") => {
      recordDebugLogEvent({
        event: "toast-shown",
        payload: {
          hasRetry: Boolean(onRetry),
          message,
          tone,
        },
      });
      setToast({ message, onRetry, tone });
    },
    [],
  );
  usePersistenceFailureAlert(showToast, t);

  const {
    pipelinePhase,
    setPipelinePhase,
    streamingText,
    setStreamingText,
    abortRef,
    lastCompletedReplyRef,
    phaseProgress,
    replayPhase,
    activeReplayMessageId,
    handleRepeatLastReply,
    stopReplay,
    handleVoiceCaptureDone,
  } = useVoicePipeline({
    activeConversation,
    addMessage,
    createConversation,
    initialConversationSettings,
    updateMessage,
    updateConversationContextSummary,
    player,
    provider,
    providerApiKey,
    model,
    modelEffort,
    sttMode: settings.sttMode,
    sttProvider,
    sttApiKey,
    selectedSttModel,
    selectedTtsModel,
    ttsMode: settings.ttsMode,
    ttsProvider,
    ttsApiKey,
    selectedTtsVoice,
    ttsListenLanguages: settings.ttsListenLanguages,
    replyPlayback: settings.replyPlayback,
    spokenRepliesEnabled: settings.spokenRepliesEnabled,
    assistantInstructions,
    responseLength,
    responseTone,
    ttsInstructions: effectiveTtsInstructions,
    language,
    webSearchMode,
    webSearchProvider,
    webSearchApiKey,
    webSearchOptions,
    isRecording,
    showToast,
    t,
  });

  const isBusy = pipelinePhase !== "idle";

  const handleRepeatMessage = useCallback(
    async (message: { id: string; content: string }) => {
      if (activeReplayMessageId === message.id) {
        recordDebugLogEvent({
          event: "reply-repeat-stop-requested",
          payload: {
            messageId: message.id,
          },
        });
        await stopReplay();
        return;
      }

      recordDebugLogEvent({
        event: "reply-repeat-requested",
        payload: {
          contentLength: message.content.length,
          messageId: message.id,
        },
      });
      await handleRepeatLastReply(message.content, message.id);
    },
    [activeReplayMessageId, handleRepeatLastReply, stopReplay],
  );

  const { handleRetryMessage, handleSubmitTextMessage } =
    useTextTurnSubmitController({
      handleVoiceCaptureDone,
      isBusy,
    });

  useProviderAvailabilityGuards({
    activeResponseMode,
    availableResponseModes,
    availableSttProviders,
    availableTtsProviders,
    loaded,
    providerApiKey,
    settings,
    sttProvider,
    ttsProvider,
    updateActiveResponseMode,
    updateSettings,
  });

  const {
    handleDismissSetupGuide,
    handleBack,
    handleContinueFromIntro,
    handleSelectProvider,
    handleProviderApiKeyChange,
    handleValidateProviderKey,
    handleContinueFromProvider,
    handleContinueFromVoiceTest,
    handleFinishSetupGuide,
    handleOpenSettingsFromSummary,
    handleOpenSetupGuide,
    openedFromSettings: setupGuideOpenedFromSettings,
    step: setupGuideStep,
    providerOptions: setupGuideProviderOptions,
    selectedProvider: setupGuideSelectedProvider,
    selectedProviderApiKey: setupGuideSelectedProviderApiKey,
    currentValidationState: setupGuideValidationState,
    resolvedRoutes: setupGuideResolvedRoutes,
    voiceTest: setupGuideVoiceTest,
  } = useSetupGuideController({
    loaded,
    nativeStt,
    openSettings,
    player,
    recorder,
    setSetupGuideVisible,
    setupGuideVisible,
    setupGuideDismissed: settings.setupGuideDismissed,
    settings,
    updateApiKey,
    updateSettings,
  });

  const {
    handlePressIn,
    handlePressOut,
    handleStopInteraction,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  } = useVoiceSessionController({
    abortRef,
    availableSttProviders,
    availableTtsProviders,
    handleVoiceCaptureDone,
    isBusy,
    isRecording,
    lastCompletedReplyRef,
    nativeStt,
    player,
    providerApiKey,
    providerLabel,
    recorder,
    setPipelinePhase,
    setStreamingText,
    settings,
    showToast,
    sttApiKey,
    sttProvider,
    t,
    ttsApiKey,
    ttsProvider,
  });

  const {
    handleCopyMessage,
    handleCopyThread,
    handleShareThread,
    handleShareMessage,
    handleRenameThread,
    handleTogglePinned,
    handleDeleteConversation,
    handleSelectConversation,
    handleStartNewSession,
    openMemory,
    handleCopyMemory,
    handleClearMemory,
  } = useConversationActions({
    activeConversation,
    memoryConversation,
    getConversationById,
    renameConversation,
    toggleConversationPinned,
    clearConversationMemory,
    deleteConversation,
    selectConversation,
    clearActiveConversation,
    resetVoiceSessionState,
    openMemoryConversation,
    setMemoryConversation,
    showToast,
    language,
    t,
  });

  const {
    canGenerateTitle,
    handleGenerateTitle,
    isGeneratingTitle,
  } = useConversationTitleGenerator({
    activeConversation,
    apiKey: providerApiKey,
    language,
    model,
    modelEffort,
    provider,
    providerReady: !voiceInputDisabled,
    renameConversation,
    showToast,
    t,
  });

  const handleResponseModeChange = useCallback(
    (nextMode: ResponseMode) => {
      const nextRoute = getResponseModeRoute(settings, nextMode);
      const nextProvider = nextRoute.provider;

      recordDebugLogEvent({
        event: "response-mode-change-requested",
        payload: {
          currentMode: activeResponseMode,
          nextMode,
          nextProvider,
        },
      });

      if (
        !hasProviderCredentialForCapability(
          nextProvider,
          settings.apiKeys[nextProvider],
          "llm",
        )
      ) {
        recordDebugLogEvent({
          event: "response-mode-change-blocked",
          level: "warn",
          payload: {
            missingProviderKey: nextProvider,
            nextMode,
          },
        });
        showToast(
          t("addProviderKeyToEnableProvider", {
            provider: PROVIDER_LABELS[nextProvider],
          }),
        );
        return;
      }

      recordDebugLogEvent({
        event: "response-mode-change-applied",
        payload: {
          nextMode,
          nextProvider,
        },
      });
      updateActiveResponseMode(nextMode);
    },
    [
      activeResponseMode,
      settings.apiKeys,
      settings.responseModes,
      showToast,
      t,
      updateActiveResponseMode,
    ],
  );

  const { handlePreviewVoice, stopPreviewVoice } = usePreviewVoiceController({
    isBusy,
    isRecording,
    language,
    player,
    settings,
    showToast,
    t,
  });

  const {
    validateProvider: handleValidateProvider,
    validateWebSearchProvider: handleValidateWebSearchProvider,
  } = useProviderConnectionValidation({ language, settings });

  const {
    activeConversationTitle,
    fallbackTtsStatusLabel,
    isActive,
    lastAssistantReply,
    messages,
    routeModelLabel,
    statusDisplay,
    sttStatusLabel,
    ttsStatusLabel,
    visualPhase,
  } = getMainScreenViewModel({
    activeConversation,
    availableTtsProviders,
    isRecording,
    language,
    model,
    pipelinePhase,
    player,
    provider,
    selectedSttModel,
    selectedTtsModel,
    selectedTtsVoice,
    settings,
    streamingText,
    sttProvider,
    t,
    ttsApiKey,
    ttsProvider,
  });

  useBatteryDiagnostics({
    isActive,
    isRecording,
    pipelinePhase,
    playerIsPlaying: player.isPlaying,
    playerPaused: player.isPlaybackPaused,
    spokenRepliesEnabled: settings.spokenRepliesEnabled,
  });

  useEffect(() => {
    lastCompletedReplyRef.current = lastAssistantReply;
  }, [lastAssistantReply, lastCompletedReplyRef]);

  const {
    captureState: debugLogCaptureState,
    handleToggle: handleToggleDebugLog,
  } = useDebugLogCaptureController({
    activeConversationId: activeConversation?.id ?? null,
    inputMode: settings.inputMode,
    model,
    pipelinePhase,
    provider,
    replyPlayback: settings.replyPlayback,
    selectedSttModel,
    selectedTtsModel,
    showToast,
    spokenRepliesEnabled: settings.spokenRepliesEnabled,
    sttMode: settings.sttMode,
    sttProvider,
    t,
    ttsMode: settings.ttsMode,
    ttsProvider,
  });

  useMainScreenDiagnostics({
    activeConversationId: activeConversation?.id ?? null,
    activeConversationTitle: activeConversation?.title ?? null,
    activeReplayMessageId,
    activeResponseMode,
    conversationCount: conversations.length,
    drawerVisible,
    inputMode: settings.inputMode,
    isRecording,
    loaded,
    memoryConversationId: memoryConversation?.id ?? null,
    memoryVisible,
    messageCount: messages.length,
    model,
    modelEffort,
    pipelinePhase,
    playerIsPlaying: player.isPlaying,
    provider,
    replayPhase,
    replyPlayback: settings.replyPlayback,
    responseLength,
    responseTone,
    settingsFocusCatalogProviderId: settingsFocusCatalogProviderId ?? null,
    settingsVisible,
    setupGuideVisible,
    spokenRepliesEnabled: settings.spokenRepliesEnabled,
    statusDetailsVisible,
    sttMode: settings.sttMode,
    sttProvider,
    ttsMode: settings.ttsMode,
    ttsProvider,
    visualPhase,
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={
        Platform.OS === "ios" && isLandscape
          ? ["top"]
          : ["top", "left", "right"]
      }
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Toast
        message={toast?.message || ""}
        visible={!!toast}
        onDismiss={() => setToast(null)}
        onRetry={toast?.onRetry}
        tone={toast?.tone}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={[
          styles.defaultLayout,
          isLandscape ? styles.defaultLayoutLandscape : null,
        ]}
      >
        <MainScreenWorkspace
          colors={colors}
          isLandscape={isLandscape}
          topBar={{
            debugLogActive: debugLogCaptureState.active,
            debugLogLabel: t("debugLogLabel"),
            drawerLabel: t("conversations"),
            onOpenDrawer: () => setDrawerVisible(true),
            onOpenSettings: () => openSettings(),
            onToggleDebugLog:
              settings.showDebugLogButton || debugLogCaptureState.active
                ? handleToggleDebugLog
                : undefined,
            settingsLabel: t("settings"),
          }}
          routeCard={{
            activeResponseMode,
            availableResponseModes: loaded ? availableResponseModes : [],
            onOpenSetupGuide: () => openSettings(undefined, "providers"),
            onSelectResponseMode: handleResponseModeChange,
            responseModes: settings.responseModes,
            t,
          }}
          routeControls={{
            onToggleWebSearchEnabled: () => {
              updateSettings({
                webSearchMode: webSearchActive ? "off" : "on",
              });
            },
            t,
            webSearchEnabled: webSearchActive,
            webSearchReady,
          }}
          voiceStage={{
            disabled: voiceInputDisabled,
            initialInputSurface: inputSurfaceRef.current,
            initialTextMessage: textMessageDraftRef.current,
            inputMode: settings.inputMode,
            isActive: isActive && mainSurfaceVisible,
            onInputSurfaceChange: handleInputSurfaceChange,
            onOpenStatusDetails: openStatusDetails,
            onPress: handleTogglePress,
            onPressIn: handlePressIn,
            onPressOut: handlePressOut,
            onStopPlayback: handleStopInteraction,
            onSubmitTextMessage: handleSubmitTextMessage,
            onTextMessageChange: handleTextMessageChange,
            phaseLabel: statusDisplay.statusTitle,
            phaseProgress,
            playbackActive: player.isPlaying,
            playbackPaused: player.isPlaybackPaused,
            recordingMaxMs: maxRecordingMs,
            statusTitle: statusDisplay.actionLabel,
            stopPlaybackLabel: t("stop"),
            t,
            visualPhase,
          }}
          transcript={{
            activeConversationId: activeConversation?.id ?? null,
            activeConversationTitle,
            activeReplayMessageId,
            messages,
            onCopyMessage: (message) =>
              handleCopyMessage(message.content),
            onOpenSpeakingSettings: () => openSettings(undefined, "tts"),
            onOpenStyleSheet: () => setStyleSheetVisible(true),
            onRepeatMessage: (message) => {
              void handleRepeatMessage(message);
            },
            onRetryMessage: handleRetryMessage,
            onShareMessage: (message) => {
              void handleShareMessage(message.content);
            },
            replayPhase,
            scrollEnabled: true,
            showStyleControl: showStyleChip,
            showUsageStats: settings.showUsageStats,
            showWhenEmpty: true,
            t,
          }}
        />
      </KeyboardAvoidingView>

      <StyleSheetModal
        canAutoRenameConversation={canGenerateTitle}
        isAutoRenamingConversation={isGeneratingTitle}
        visible={styleSheetVisible}
        llmInstructions={llmInstructions}
        responseLength={responseLength}
        responseTone={responseTone}
        ttsInstructions={ttsInstructions}
        ttsInstructionsSupported={ttsInstructionsSupported}
        ttsRouteLabel={conversationTtsRouteLabel}
        ttsVoice={selectedTtsVoice}
        ttsVoiceOptions={conversationTtsVoiceOptions}
        onAutoRenameConversation={() => {
          void handleGenerateTitle();
        }}
        onChange={updateResponseSettings}
        onLlmInstructionsChange={updateLlmInstructions}
        onTtsInstructionsChange={updateTtsInstructions}
        onTtsVoiceChange={updateTtsVoice}
        onClose={() => setStyleSheetVisible(false)}
      />

      <StatusDetailsModal
        visible={statusDetailsVisible}
        colors={colors}
        fallbackTtsStatusLabel={fallbackTtsStatusLabel}
        isActive={isActive}
        messageCountLabel={statusDisplay.messageCountLabel}
        onClose={closeStatusDetails}
        routeModelLabel={routeModelLabel}
        statusDetail={statusDisplay.statusDetail}
        statusTitle={statusDisplay.statusTitle}
        sttStatusLabel={sttStatusLabel}
        t={t}
        ttsStatusLabel={ttsStatusLabel}
      />

      <SettingsModal
        visible={settingsVisible}
        settings={settings}
        providerVoiceDirectories={providerVoiceDirectories}
        focusCatalogProviderId={settingsFocusCatalogProviderId}
        focusTab={settingsFocusTab}
        onUpdate={updateSettings}
        onUpdateResponseModeRoute={updateResponseModeRoute}
        onAddResponseMode={addResponseMode}
        onRemoveResponseMode={removeResponseMode}
        onUpdateProviderSttModel={updateProviderSttModel}
        onUpdateProviderTtsModel={updateProviderTtsModel}
        onUpdateProviderTtsVoice={updateProviderTtsVoice}
        onUpdateApiKey={updateApiKey}
        onPreviewVoice={handlePreviewVoice}
        onStopPreviewVoice={stopPreviewVoice}
        onValidateProvider={handleValidateProvider}
        onValidateWebSearchProvider={handleValidateWebSearchProvider}
        onOpenSetupGuide={
          settings.showSetupGuideShortcut
            ? () => {
                closeSettings();
                handleOpenSetupGuide("intro", "settings");
              }
            : undefined
        }
        onClose={closeSettings}
      />
      <SetupGuideModal
        visible={setupGuideVisible}
        step={setupGuideStep}
        providerOptions={setupGuideProviderOptions}
        selectedProvider={setupGuideSelectedProvider}
        selectedProviderApiKey={setupGuideSelectedProviderApiKey}
        currentValidationState={setupGuideValidationState}
        resolvedRoutes={setupGuideResolvedRoutes}
        voiceTest={setupGuideVoiceTest}
        onSelectProvider={handleSelectProvider}
        onChangeProviderApiKey={handleProviderApiKeyChange}
        onDismiss={handleDismissSetupGuide}
        onBack={handleBack}
        onContinueFromIntro={handleContinueFromIntro}
        onValidateProviderKey={() => {
          void handleValidateProviderKey();
        }}
        onContinueFromProvider={handleContinueFromProvider}
        onVoiceTestAction={() => {
          void setupGuideVoiceTest.handleAction();
        }}
        onResetVoiceTest={() => {
          void setupGuideVoiceTest.reset(true);
        }}
        onContinueFromVoiceTest={handleContinueFromVoiceTest}
        onFinish={() => {
          void handleFinishSetupGuide();
        }}
        onOpenSettings={() => {
          void handleOpenSettingsFromSummary();
        }}
        showSettingsShortcutOption={setupGuideOpenedFromSettings}
        settingsShortcutVisible={settings.showSetupGuideShortcut}
        onChangeSettingsShortcutVisible={(visible) => {
          updateSettings({ showSetupGuideShortcut: visible });
        }}
      />
      <ConversationMemoryModal
        visible={memoryVisible}
        title={memoryConversation?.title ?? t("freshSession")}
        summary={memoryConversation?.contextSummary}
        summarizedMessageCount={memoryConversation?.summarizedMessageCount}
        onCopy={() => {
          void handleCopyMemory();
        }}
        onClear={() => {
          void handleClearMemory();
        }}
        onClose={closeMemory}
      />
      <ConversationDrawer
        visible={drawerVisible}
        conversations={conversations}
        activeId={activeConversation?.id || null}
        onSearchConversations={searchConversations}
        onSelect={handleSelectConversation}
        onCopyThread={(id) => {
          void handleCopyThread(id);
        }}
        onShareThread={(id) => {
          runAfterDrawerDismiss(() => {
            void handleShareThread(id);
          });
        }}
        onManageMemory={(id) => {
          runAfterDrawerDismiss(() => {
            void openMemory(id);
          });
        }}
        onRenameThread={(id, title) => {
          void handleRenameThread(id, title);
        }}
        onTogglePinned={handleTogglePinned}
        onNewSession={handleStartNewSession}
        onDelete={handleDeleteConversation}
        onClose={() => setDrawerVisible(false)}
        onDismiss={handleDrawerDismiss}
      />
    </SafeAreaView>
  );
}
