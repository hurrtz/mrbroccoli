import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationDrawer } from "../components/ConversationDrawer";
import { ConversationMemoryModal } from "../components/ConversationMemoryModal";
import { AntSettingsModal } from "../features/settings-antd/AntSettingsModal";
import { SetupGuideModal } from "../components/SetupGuideModal";
import { Toast } from "../components/Toast";
import { useSharedSettings } from "../context/SettingsContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useNativeSpeechRecognizer } from "../hooks/useNativeSpeechRecognizer";
import { useConversations } from "../hooks/useConversations";
import { useVoicePipeline } from "../hooks/useVoicePipeline";
import { useBatteryDiagnostics } from "../hooks/useBatteryDiagnostics";
import { useKokoroModel } from "../hooks/useKokoroModel";
import { getTtsFallbackRoutes } from "../constants/ttsFallback";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { MainScreenWorkspace } from "./main/MainScreenWorkspace";
import { StyleSheetModal } from "./main/StyleSheetModal";
import { StatusDetailsModal } from "./main/StatusDetailsModal";
import { getMainScreenViewModel } from "./main/mainScreenViewModel";
import {
  getConversationTtsControlState,
  getMainScreenRouteConfiguration,
} from "./main/mainScreenRouteConfiguration";
import { styles } from "./main/styles";
import { useConversationActions } from "./main/useConversationActions";
import { useConversationTitleGenerator } from "./main/useConversationTitleGenerator";
import { useConversationSettings } from "./main/useConversationSettings";
import { useDebugLogCaptureController } from "./main/useDebugLogCaptureController";
import { useMainScreenUiState } from "./main/useMainScreenUiState";
import { useMainScreenComposerDraft } from "./main/useMainScreenComposerDraft";
import { useMainScreenReplyReplay } from "./main/useMainScreenReplyReplay";
import { useMainScreenResponseModeSelection } from "./main/useMainScreenResponseModeSelection";
import { useMainScreenToastController } from "./main/useMainScreenToastController";
import { useMainScreenVoiceDirectories } from "./main/useMainScreenVoiceDirectories";
import { useMainScreenDiagnostics } from "./main/useMainScreenDiagnostics";
import { useMainScreenSurfaceActions } from "./main/useMainScreenSurfaceActions";
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
  const routeConfiguration = React.useMemo(
    () => getMainScreenRouteConfiguration(settings, conversationsLoaded),
    [conversationsLoaded, settings],
  );

  const recorder = useAudioRecorder();
  const nativeStt = useNativeSpeechRecognizer();
  const player = useAudioPlayer();
  const kokoroModel = useKokoroModel();

  const [styleSheetVisible, setStyleSheetVisible] = React.useState(false);
  const {
    handleInputSurfaceChange,
    handleTextMessageChange,
    inputSurfaceRef,
    textMessageDraftRef,
  } = useMainScreenComposerDraft();
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

  const {
    activeResponseMode,
    availableResponseModes,
    availableSttProviders,
    availableTtsProviders,
    globalSelectedTtsVoice,
    model,
    modelEffort,
    provider,
    providerApiKey,
    providerLabel,
    selectedSttModel,
    selectedTtsModel,
    sttApiKey,
    sttProvider,
    ttsApiKey,
    ttsProvider,
    voiceInputDisabled,
    webSearchActive,
    webSearchApiKey,
    webSearchMode,
    webSearchOptions,
    webSearchProvider,
    webSearchReady,
  } = routeConfiguration;
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
  const conversationTtsControlState = React.useMemo(
    () =>
      getConversationTtsControlState({
        language,
        providerVoiceDirectories,
        selectedTtsModel,
        settings,
        ttsProvider,
      }),
    [
      language,
      providerVoiceDirectories,
      selectedTtsModel,
      settings,
      ttsProvider,
    ],
  );
  const {
    conversationTtsRouteLabel,
    conversationTtsVoiceOptions,
    ttsInstructionsSupported,
  } = conversationTtsControlState;
  const isRecording =
    settings.sttMode === "native"
      ? nativeStt.isRecording
      : recorder.isRecording;
  const { dismissToast, showToast, toast } =
    useMainScreenToastController();
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
    playReplyText,
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
    selectedTtsVoice:
      settings.ttsMode === "kokoro"
        ? settings.kokoroVoices.en
        : selectedTtsVoice,
    kokoroVoices: settings.kokoroVoices,
    ttsFallbackRoutes: getTtsFallbackRoutes(
      settings.ttsFallbackPolicy,
      settings.ttsMode,
    ),
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

  const handleRepeatMessage = useMainScreenReplyReplay({
    activeReplayMessageId,
    handleRepeatLastReply,
    stopReplay,
  });

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
    handleToggleKokoro,
    handleDownloadKokoro,
    handleContinueFromKokoro,
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
    useKokoro: setupGuideUseKokoro,
  } = useSetupGuideController({
    kokoroModel,
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
    driveSessionActive,
    driveSessionCanContinue,
    driveSessionCanRepeat,
    handleContinueDriveSession,
    handlePressIn,
    handlePressOut,
    handleRepeatDriveReply,
    handleStopDriveSession,
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
    mainSurfaceVisible,
    nativeStt,
    playReplyText,
    player,
    providerApiKey,
    providerLabel,
    recorder,
    replayPhase,
    setPipelinePhase,
    setStreamingText,
    settings,
    showToast,
    sttApiKey,
    sttProvider,
    t,
    ttsApiKey,
    ttsProvider,
    stopReplay,
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

  const { canGenerateTitle, handleGenerateTitle, isGeneratingTitle } =
    useConversationTitleGenerator({
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

  const handleResponseModeChange = useMainScreenResponseModeSelection({
    activeResponseMode,
    settings,
    showToast,
    t,
    updateActiveResponseMode,
  });

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
    validateProviderCapability: handleValidateProviderCapability,
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
    driveSessionActive,
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
  const {
    handleAutoRenameConversation,
    handleClearMemoryPress,
    handleCloseConversationSettings,
    handleCloseDrawer,
    handleCopyDrawerThread,
    handleCopyMemoryPress,
    handleFinishSetupGuidePress,
    handleManageDrawerMemory,
    handleOpenConversationSettings,
    handleOpenDrawer,
    handleOpenMainSettings,
    handleOpenProviderSettings,
    handleOpenSettingsFromSetupGuide,
    handleOpenSetupGuideFromSettings,
    handleOpenSpeakingSettings,
    handleRenameDrawerThread,
    handleResetSetupGuideVoiceTest,
    handleSetupGuideShortcutVisibilityChange,
    handleSetupGuideVoiceTestAction,
    handleShareDrawerThread,
    handleToggleWebSearch,
    handleValidateSetupGuideProviderKey,
  } = useMainScreenSurfaceActions({
    closeSettings,
    handleClearMemory,
    handleCopyMemory,
    handleCopyThread,
    handleFinishSetupGuide,
    handleGenerateTitle,
    handleOpenSettingsFromSummary,
    handleOpenSetupGuide,
    handleRenameThread,
    handleShareThread,
    handleValidateProviderKey,
    openMemory,
    openSettings,
    runAfterDrawerDismiss,
    setDrawerVisible,
    setStyleSheetVisible,
    setupGuideVoiceTest,
    updateSettings,
    webSearchActive,
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
        onDismiss={dismissToast}
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
            brandName: t("appName"),
            debugLogActive: debugLogCaptureState.active,
            debugLogLabel: t("debugLogLabel"),
            drawerLabel: t("conversations"),
            onOpenDrawer: handleOpenDrawer,
            onOpenSettings: handleOpenMainSettings,
            onToggleDebugLog:
              settings.showDebugLogButton || debugLogCaptureState.active
                ? handleToggleDebugLog
                : undefined,
            settingsLabel: t("settings"),
          }}
          routeCard={{
            activeResponseMode,
            availableResponseModes: loaded ? availableResponseModes : [],
            onOpenSetupGuide: handleOpenProviderSettings,
            onSelectResponseMode: handleResponseModeChange,
            responseModes: settings.responseModes,
            t,
          }}
          routeControls={{
            onToggleWebSearchEnabled: handleToggleWebSearch,
            t,
            webSearchEnabled: webSearchActive,
            webSearchReady,
          }}
          voiceStage={{
            disabled: voiceInputDisabled,
            driveSessionActive,
            driveSessionCanContinue,
            driveSessionCanRepeat,
            initialInputSurface: inputSurfaceRef.current,
            initialTextMessage: textMessageDraftRef.current,
            inputMode: settings.inputMode,
            isActive: isActive && mainSurfaceVisible,
            onInputSurfaceChange: handleInputSurfaceChange,
            onDriveContinue: handleContinueDriveSession,
            onDriveRepeat: handleRepeatDriveReply,
            onDriveStop: handleStopDriveSession,
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
            onCopyMessage: (message) => handleCopyMessage(message.content),
            onOpenSpeakingSettings: handleOpenSpeakingSettings,
            onOpenStyleSheet: handleOpenConversationSettings,
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
        onAutoRenameConversation={handleAutoRenameConversation}
        onChange={updateResponseSettings}
        onLlmInstructionsChange={updateLlmInstructions}
        onTtsInstructionsChange={updateTtsInstructions}
        onTtsVoiceChange={updateTtsVoice}
        onClose={handleCloseConversationSettings}
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

      <AntSettingsModal
        visible={settingsVisible}
        settings={settings}
        kokoroModel={kokoroModel}
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
        onValidateProviderCapability={handleValidateProviderCapability}
        onOpenSetupGuide={
          settings.showSetupGuideShortcut
            ? handleOpenSetupGuideFromSettings
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
        kokoroModel={kokoroModel}
        useKokoro={setupGuideUseKokoro}
        onSelectProvider={handleSelectProvider}
        onChangeProviderApiKey={handleProviderApiKeyChange}
        onDismiss={handleDismissSetupGuide}
        onBack={handleBack}
        onContinueFromIntro={handleContinueFromIntro}
        onValidateProviderKey={handleValidateSetupGuideProviderKey}
        onContinueFromProvider={handleContinueFromProvider}
        onToggleKokoro={handleToggleKokoro}
        onDownloadKokoro={handleDownloadKokoro}
        onContinueFromKokoro={handleContinueFromKokoro}
        onVoiceTestAction={handleSetupGuideVoiceTestAction}
        onResetVoiceTest={handleResetSetupGuideVoiceTest}
        onContinueFromVoiceTest={handleContinueFromVoiceTest}
        onFinish={handleFinishSetupGuidePress}
        onOpenSettings={handleOpenSettingsFromSetupGuide}
        showSettingsShortcutOption={setupGuideOpenedFromSettings}
        settingsShortcutVisible={settings.showSetupGuideShortcut}
        onChangeSettingsShortcutVisible={
          handleSetupGuideShortcutVisibilityChange
        }
      />
      <ConversationMemoryModal
        visible={memoryVisible}
        title={memoryConversation?.title ?? t("freshSession")}
        summary={memoryConversation?.contextSummary}
        summarizedMessageCount={memoryConversation?.summarizedMessageCount}
        onCopy={handleCopyMemoryPress}
        onClear={handleClearMemoryPress}
        onClose={closeMemory}
      />
      <ConversationDrawer
        visible={drawerVisible}
        conversations={conversations}
        activeId={activeConversation?.id || null}
        onSearchConversations={searchConversations}
        onSelect={handleSelectConversation}
        onCopyThread={handleCopyDrawerThread}
        onShareThread={handleShareDrawerThread}
        onManageMemory={handleManageDrawerMemory}
        onRenameThread={handleRenameDrawerThread}
        onTogglePinned={handleTogglePinned}
        onNewSession={handleStartNewSession}
        onDelete={handleDeleteConversation}
        onClose={handleCloseDrawer}
        onDismiss={handleDrawerDismiss}
      />
    </SafeAreaView>
  );
}
