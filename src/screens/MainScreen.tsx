import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { useSharedSettings } from "../context/SettingsContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useNativeSpeechRecognizer } from "../hooks/useNativeSpeechRecognizer";
import { useConversations } from "../hooks/useConversations";
import { useConversationArchive } from "../hooks/useConversationArchive";
import { useVoicePipeline } from "../hooks/useVoicePipeline";
import { useBatteryDiagnostics } from "../hooks/useBatteryDiagnostics";
import { useKokoroModel } from "../hooks/useKokoroModel";
import { getTtsFallbackRoutes } from "../constants/ttsFallback";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { MainScreenPresentation } from "./main/MainScreenPresentation";
import { getMainScreenViewModel } from "./main/mainScreenViewModel";
import {
  getConversationTtsControlState,
  getMainScreenRouteConfiguration,
} from "./main/mainScreenRouteConfiguration";
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
import { useUlraModeControl } from "./main/useUlraModeControl";
import { getKokoroPromptBlockState } from "./main/kokoroPromptBlockState";
import { useMainScreenDataBackup } from "./main/useMainScreenDataBackup";
import { useMainScreenImageAttachments } from "./main/useMainScreenImageAttachments";
import { formatMessageForCopy } from "../utils/conversationExport";
import { useImagePromptSubmission } from "./main/useImagePromptSubmission";
import { useFreeOfflineMode } from "./main/useFreeOfflineMode";

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
    updateProviderValidationResult,
    restorePortableSettings,
    loaded,
  } = useSharedSettings();
  const freeOffline = useFreeOfflineMode({
    settings,
    settingsLoaded: loaded,
    updateSettings,
  });
  const runtimeSettings = freeOffline.effectiveSettings;
  const [premiumModalVisible, setPremiumModalVisible] = React.useState(false);
  const providerVoiceDirectories = useMainScreenVoiceDirectories({
    loaded,
    settings: runtimeSettings,
    updateProviderTtsVoice,
  });
  const {
    conversations,
    activeConversation,
    createConversation,
    selectConversation,
    getConversationById,
    inspectConversationIntegrity,
    addMessage,
    updateMessage,
    updateConversationMemory,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationMemory,
    renameConversation,
    repairConversationIntegrity,
    toggleConversationPinned,
    toggleConversationPrivate,
    undoConversationIntegrityRepair,
    searchConversations,
    deleteConversation,
    editUserMessage,
    restoreConversationBackup,
    clearActiveConversation,
    loaded: conversationsLoaded = true,
  } = useConversations({
    pastConversationKnowledgeEnabled:
      runtimeSettings.pastConversationKnowledgeEnabled,
  });
  const privateConversationIds = React.useMemo(
    () =>
      conversations
        .filter((conversation) => conversation.isPrivate)
        .map((conversation) => conversation.id),
    [conversations],
  );
  const routeConfiguration = React.useMemo(
    () => getMainScreenRouteConfiguration(runtimeSettings, conversationsLoaded),
    [conversationsLoaded, runtimeSettings],
  );
  const {
    createBackup: handleCreateAppDataBackup,
    restoreBackup: handleRestoreAppDataBackup,
  } = useMainScreenDataBackup({
    activeConversationId: activeConversation?.id ?? null,
    conversationMetas: conversations,
    getConversationById,
    restoreConversationBackup,
    restorePortableSettings,
    settings,
  });
  const conversationArchive = useConversationArchive({
    enabled: freeOffline.entitlement.isPremium,
    activeConversationId: activeConversation?.id ?? null,
    conversationMetas: conversations,
    conversationsLoaded,
    getConversationById,
  });

  const recorder = useAudioRecorder();
  const nativeStt = useNativeSpeechRecognizer(runtimeSettings.sttLanguage);
  const player = useAudioPlayer({
    beforePlayback: recorder.stopAmbientMonitoring,
  });
  const kokoroModel = useKokoroModel();
  const {
    actionLabel: kokoroPromptBlockActionLabel,
    message: kokoroPromptBlockMessage,
    progress: kokoroPromptBlockProgress,
  } = getKokoroPromptBlockState({
    kokoroModel,
    verifiedByOfflineProfile:
      freeOffline.entitlement.status === "free" && freeOffline.freeRuntimeReady,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    t,
    ttsMode: runtimeSettings.ttsMode,
  });

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
    localLlmModelId,
    provider,
    providerApiKey,
    providerLabel,
    selectedSttModel,
    selectedTtsModel,
    sttApiKey,
    sttProvider,
    ttsApiKey,
    ttsProvider,
    ulraMode: ulraModeConfiguration,
    voiceInputDisabled,
    webSearchActive,
    webSearchApiKey,
    webSearchMode,
    webSearchOptions,
    webSearchProvider,
    webSearchReady,
  } = routeConfiguration;
  const isLandscape = width > height;
  const ulraMode = useUlraModeControl({
    availableModelCount: availableResponseModes.length,
    settings: runtimeSettings,
    t,
    updateSettings,
  });
  const showStyleChip =
    loaded &&
    freeOffline.entitlement.isPremium &&
    availableResponseModes.length > 0;
  const mainSurfaceVisible = !(
    drawerVisible ||
    memoryVisible ||
    settingsVisible ||
    setupGuideVisible ||
    statusDetailsVisible ||
    styleSheetVisible ||
    freeOffline.modalVisible ||
    premiumModalVisible
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
    globalAssistantInstructions: runtimeSettings.assistantInstructions,
    globalResponseLength: runtimeSettings.responseLength,
    globalResponseTone: runtimeSettings.responseTone,
    globalTtsInstructions: runtimeSettings.ttsInstructions,
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
        settings: runtimeSettings,
        ttsProvider,
      }),
    [
      language,
      providerVoiceDirectories,
      selectedTtsModel,
      runtimeSettings,
      ttsProvider,
    ],
  );
  const {
    conversationTtsRouteLabel,
    conversationTtsVoiceOptions,
    ttsInstructionsSupported,
  } = conversationTtsControlState;
  const isRecording =
    runtimeSettings.sttMode === "native"
      ? nativeStt.isRecording
      : recorder.isRecording;
  const recordingStartedAtMs = React.useMemo(
    () => (isRecording ? Date.now() : null),
    [isRecording],
  );
  const { dismissToast, showToast, toast } = useMainScreenToastController();
  usePersistenceFailureAlert(showToast, t);
  const showImageError = React.useCallback(
    (message: string) => showToast(message, undefined, "danger"),
    [showToast],
  );

  const pendingImages = useMainScreenImageAttachments({
    disabled: voiceInputDisabled || !freeOffline.entitlement.isPremium,
    showError: showImageError,
    t,
  });

  const {
    completedReplyVersion,
    phaseProgress,
    pipelinePhase,
    setPipelinePhase,
    streamingText,
    setStreamingText,
    abortRef,
    lastCompletedReplyRef,
    replayPhase,
    activeReplayMessageId,
    handleRepeatLastReply,
    playReplyText,
    stopReplay,
    handleVoiceCaptureDone: runVoiceCapture,
  } = useVoicePipeline({
    activeConversation,
    privateConversationIds,
    pastConversationKnowledgeEnabled:
      runtimeSettings.pastConversationKnowledgeEnabled,
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
    localLlmModelId,
    sttMode: runtimeSettings.sttMode,
    sttLanguage: runtimeSettings.sttLanguage,
    sttProvider,
    sttApiKey,
    selectedSttModel,
    localSttModelId: runtimeSettings.localSttModelId,
    selectedTtsModel,
    localTtsModelId: runtimeSettings.localTtsModelId,
    ttsMode: runtimeSettings.ttsMode,
    ttsProvider,
    ttsApiKey,
    selectedTtsVoice:
      runtimeSettings.ttsMode === "kokoro"
        ? runtimeSettings.kokoroVoices.en
        : selectedTtsVoice,
    kokoroVoices: runtimeSettings.kokoroVoices,
    ttsFallbackRoutes: getTtsFallbackRoutes(
      runtimeSettings.ttsFallbackPolicy,
      runtimeSettings.ttsMode,
    ),
    ttsListenLanguages: runtimeSettings.ttsListenLanguages,
    replyPlayback: runtimeSettings.replyPlayback,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    assistantInstructions,
    responseLength,
    responseTone,
    ttsInstructions: effectiveTtsInstructions,
    language,
    webSearchMode,
    webSearchProvider,
    webSearchApiKey,
    webSearchOptions,
    ulraMode: ulraModeConfiguration,
    isRecording,
    showToast,
    t,
    onAttachmentsAccepted: pendingImages.handleAttachmentsAccepted,
  });

  const isBusy = pipelinePhase !== "idle";

  const imageRoutes = React.useMemo(
    () => [
      { provider, model },
      ...(ulraModeConfiguration?.routes ?? []).map((route) => ({
        provider: route.provider,
        model: route.model,
      })),
    ],
    [model, provider, ulraModeConfiguration],
  );
  const imagePromptSubmission = useImagePromptSubmission({
    activeConversation,
    imagesEnabled: freeOffline.entitlement.isPremium,
    imageRoutes,
    onAddImage: pendingImages.handleAddImage,
    pendingAttachments: pendingImages.attachments,
    runVoiceCapture,
    showToast,
    t,
    updateMessage,
  });
  const promptSubmissionBlockMessage =
    kokoroPromptBlockMessage ?? imagePromptSubmission.imageInputBlockMessage;
  const handleVoiceCaptureDone = imagePromptSubmission.handleVoiceCaptureDone;

  const handleRepeatMessage = useMainScreenReplyReplay({
    activeReplayMessageId,
    handleRepeatLastReply,
    stopReplay,
  });

  const { handleRetryMessage, handleSubmitTextMessage } =
    useTextTurnSubmitController({
      handleVoiceCaptureDone,
      isBusy,
      pendingAttachments: pendingImages.attachments,
      promptSubmissionBlockMessage,
      showToast,
    });

  useProviderAvailabilityGuards({
    activeResponseMode,
    availableResponseModes,
    availableSttProviders,
    availableTtsProviders,
    loaded,
    providerApiKey,
    settings: runtimeSettings,
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
    loaded: loaded && freeOffline.entitlement.isPremium,
    nativeStt,
    openSettings,
    player,
    recorder,
    setSetupGuideVisible,
    setupGuideVisible,
    setupGuideDismissed: runtimeSettings.setupGuideDismissed,
    settings: runtimeSettings,
    updateApiKey,
    updateSettings,
  });

  const {
    driveAutoContinueEnabled,
    driveSilenceCountdownSeconds,
    driveSessionCanRepeat,
    driveVoiceActive,
    handleContinueDriveSession,
    handlePressIn,
    handlePressOut,
    handleRepeatDriveReply,
    handleStopPlayback,
    handleStopDriveSession,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  } = useVoiceSessionController({
    abortRef,
    availableSttProviders,
    availableTtsProviders,
    completedReplyVersion,
    handleVoiceCaptureDone:
      imagePromptSubmission.handleRecordedVoiceCaptureDone,
    isBusy,
    isRecording,
    lastCompletedReplyRef,
    mainSurfaceVisible,
    nativeStt,
    playReplyText,
    player,
    promptSubmissionBlockMessage,
    providerApiKey,
    providerLabel,
    recorder,
    replayPhase,
    setPipelinePhase,
    setStreamingText,
    settings: runtimeSettings,
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
    handleTogglePrivate,
    handleDeleteConversation,
    handleSelectConversation,
    handleStartNewSession,
    openMemory,
    handleCopyMemory,
    handleClearMemory,
    handleSaveMemory,
  } = useConversationActions({
    activeConversation,
    memoryConversation,
    getConversationById,
    renameConversation,
    toggleConversationPinned,
    toggleConversationPrivate,
    clearConversationMemory,
    updateConversationMemory,
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
      providerReady:
        freeOffline.entitlement.isPremium &&
        !localLlmModelId &&
        !voiceInputDisabled,
      renameConversation,
      showToast,
      t,
    });

  const handleResponseModeChange = useMainScreenResponseModeSelection({
    activeResponseMode,
    settings: runtimeSettings,
    showToast,
    t,
    updateActiveResponseMode,
  });

  const { handlePreviewVoice, stopPreviewVoice } = usePreviewVoiceController({
    isBusy,
    isRecording,
    language,
    player,
    settings: runtimeSettings,
    showToast,
    t,
  });

  const { validateProviderCapability: handleValidateProviderCapability } =
    useProviderConnectionValidation({ language, settings });

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
    isRecording,
    language,
    model,
    pipelinePhase,
    player,
    provider,
    selectedSttModel,
    selectedTtsModel,
    selectedTtsVoice,
    settings: runtimeSettings,
    streamingText,
    sttProvider,
    t,
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
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
  });

  useEffect(() => {
    lastCompletedReplyRef.current = lastAssistantReply;
  }, [lastAssistantReply, lastCompletedReplyRef]);

  const {
    captureState: debugLogCaptureState,
    handleToggle: handleToggleDebugLog,
  } = useDebugLogCaptureController({
    activeConversationId: activeConversation?.id ?? null,
    appLanguage: language,
    inputMode: runtimeSettings.inputMode,
    isLandscape,
    kokoroState: {
      busy: kokoroModel.busy,
      installed: kokoroModel.installed,
      phase: kokoroModel.phase,
      progress: kokoroModel.progress,
      verified: kokoroModel.verified,
    },
    model,
    modelEffort,
    pipelinePhase,
    provider,
    replyPlayback: runtimeSettings.replyPlayback,
    selectedSttModel,
    selectedTtsModel,
    selectedTtsVoice,
    showToast,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    sttMode: runtimeSettings.sttMode,
    sttProvider,
    t,
    ttsMode: runtimeSettings.ttsMode,
    ttsProvider,
    ttsFallbackRoutes: getTtsFallbackRoutes(
      runtimeSettings.ttsFallbackPolicy,
      runtimeSettings.ttsMode,
    ),
    webSearchMode,
    webSearchProvider: webSearchProvider ?? null,
  });

  useMainScreenDiagnostics({
    activeConversationId: activeConversation?.id ?? null,
    activeConversationTitle: activeConversation?.title ?? null,
    activeReplayMessageId,
    activeResponseMode,
    conversationCount: conversations.length,
    drawerVisible,
    inputMode: runtimeSettings.inputMode,
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
    replyPlayback: runtimeSettings.replyPlayback,
    responseLength,
    responseTone,
    settingsFocusCatalogProviderId: settingsFocusCatalogProviderId ?? null,
    settingsVisible,
    setupGuideVisible,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    statusDetailsVisible,
    sttMode: runtimeSettings.sttMode,
    sttProvider,
    ttsMode: runtimeSettings.ttsMode,
    ttsProvider,
    visualPhase,
  });

  return (
    <MainScreenPresentation
      colors={colors}
      isDark={isDark}
      isLandscape={isLandscape}
      toast={{
        message: toast?.message || "",
        visible: Boolean(toast),
        onDismiss: dismissToast,
        onRetry: toast?.onRetry,
        tone: toast?.tone,
      }}
      workspace={{
        colors,
        isLandscape,
        topBar: {
          brandName: t("appName"),
          debugLogActive: debugLogCaptureState.active,
          debugLogLabel: t("debugLogLabel"),
          drawerLabel: t("conversations"),
          onOpenDrawer: handleOpenDrawer,
          onOpenSettings: handleOpenMainSettings,
          onToggleDebugLog:
            runtimeSettings.showDebugLogButton || debugLogCaptureState.active
              ? handleToggleDebugLog
              : undefined,
          settingsLabel: t("settings"),
        },
        routeCard: {
          activeResponseMode,
          availableResponseModes: loaded ? availableResponseModes : [],
          isPremium: freeOffline.entitlement.isPremium,
          offlineReady: freeOffline.freeRuntimeReady,
          onOpenSetupGuide: freeOffline.entitlement.isPremium
            ? handleOpenProviderSettings
            : () => freeOffline.setModalVisible(true),
          onSelectResponseMode: handleResponseModeChange,
          responseModes: runtimeSettings.responseModes,
          t,
        },
        routeControls: {
          showWebSearch: freeOffline.entitlement.isPremium,
          onToggleUlraMode: ulraMode.handleToggle,
          onToggleWebSearchEnabled: handleToggleWebSearch,
          t,
          ulraModeActive: ulraMode.active,
          ulraModeAvailable:
            freeOffline.entitlement.isPremium && ulraMode.available,
          webSearchEnabled: webSearchActive,
          webSearchReady: freeOffline.entitlement.isPremium && webSearchReady,
        },
        voiceStage: {
          attachments: pendingImages.attachments,
          disabled:
            voiceInputDisabled || freeOffline.entitlement.status === "loading",
          driveAutoContinueEnabled,
          driveSilenceCountdownSeconds,
          driveSessionCanRepeat,
          driveVoiceActive,
          initialInputSurface: inputSurfaceRef.current,
          initialTextMessage: textMessageDraftRef.current,
          imageAttachmentDisabled:
            voiceInputDisabled || !freeOffline.entitlement.isPremium,
          inputMode: runtimeSettings.inputMode,
          isActive: isActive && mainSurfaceVisible,
          onInputSurfaceChange: handleInputSurfaceChange,
          onAddImage: freeOffline.entitlement.isPremium
            ? imagePromptSubmission.handleAddImage
            : undefined,
          onRemoveImage: pendingImages.handleRemoveImage,
          onDriveContinue: handleContinueDriveSession,
          onDriveRepeat: handleRepeatDriveReply,
          onDriveStop: handleStopDriveSession,
          onPress: handleTogglePress,
          onPressIn: handlePressIn,
          onPressOut: handlePressOut,
          onStopPlayback: handleStopPlayback,
          onResolvePromptBlock:
            freeOffline.entitlement.status === "free" &&
            !freeOffline.freeRuntimeReady
              ? () => freeOffline.setModalVisible(true)
              : handleOpenSpeakingSettings,
          onSubmitTextMessage: handleSubmitTextMessage,
          onTextMessageChange: handleTextMessageChange,
          playbackPaused: player.isPlaybackPaused,
          promptBlockedActionEnabled:
            freeOffline.entitlement.status === "free" &&
            !freeOffline.freeRuntimeReady &&
            !freeOffline.checking &&
            !freeOffline.preparing,
          promptBlockedActionLabel:
            freeOffline.entitlement.status === "free" &&
            !freeOffline.freeRuntimeReady
              ? freeOffline.checking || freeOffline.preparing
                ? t("onDeviceTestingDevice")
                : t("freeOfflineDownloadAndTest")
              : kokoroPromptBlockActionLabel,
          promptBlockedMessage:
            freeOffline.entitlement.status === "free" &&
            !freeOffline.freeRuntimeReady
              ? t("freeOfflineIntro")
              : kokoroPromptBlockMessage,
          promptBlockedProgress:
            freeOffline.entitlement.status === "free" &&
            !freeOffline.freeRuntimeReady
              ? null
              : kokoroPromptBlockProgress,
          recordingMaxMs: maxRecordingMs,
          recordingStartedAtMs,
          speechStartProgress: phaseProgress?.speechStart ?? null,
          statusTitle: statusDisplay.actionLabel,
          t,
          visualPhase,
        },
        transcript: {
          activeConversationId: activeConversation?.id ?? null,
          activeConversationTitle,
          activeReplayMessageId,
          messages,
          onCopyMessage: (message) =>
            handleCopyMessage(formatMessageForCopy(message, language)),
          onEditMessage: isBusy
            ? undefined
            : (message, content) => editUserMessage(message.id, content),
          onOpenSpeakingSettings: handleOpenSpeakingSettings,
          onOpenStyleSheet: handleOpenConversationSettings,
          onRepeatMessage: (message) => {
            void handleRepeatMessage(message);
          },
          onRetryMessage: handleRetryMessage,
          onShareMessage: (message) => {
            void handleShareMessage(formatMessageForCopy(message, language));
          },
          replayPhase,
          scrollEnabled: true,
          showStyleControl: showStyleChip,
          showUsageStats: runtimeSettings.showUsageStats,
          showWhenEmpty: true,
          t,
        },
      }}
      styleSheet={{
        canAutoRenameConversation: canGenerateTitle,
        isAutoRenamingConversation: isGeneratingTitle,
        visible: styleSheetVisible,
        llmInstructions,
        responseLength,
        responseTone,
        ttsInstructions,
        ttsInstructionsSupported,
        ttsRouteLabel: conversationTtsRouteLabel,
        ttsVoice: selectedTtsVoice,
        ttsVoiceOptions: conversationTtsVoiceOptions,
        onAutoRenameConversation: handleAutoRenameConversation,
        onChange: updateResponseSettings,
        onLlmInstructionsChange: updateLlmInstructions,
        onTtsInstructionsChange: updateTtsInstructions,
        onTtsVoiceChange: updateTtsVoice,
        onClose: handleCloseConversationSettings,
      }}
      statusDetails={{
        visible: statusDetailsVisible,
        colors,
        fallbackTtsStatusLabel,
        isActive,
        messageCountLabel: statusDisplay.messageCountLabel,
        onClose: closeStatusDetails,
        routeModelLabel,
        statusDetail: statusDisplay.statusDetail,
        statusTitle: statusDisplay.statusTitle,
        sttStatusLabel,
        t,
        ttsStatusLabel,
      }}
      settingsModal={{
        visible: settingsVisible,
        suspended: premiumModalVisible,
        settings,
        kokoroModel,
        providerVoiceDirectories,
        focusCatalogProviderId: settingsFocusCatalogProviderId,
        focusTab: settingsFocusTab,
        onUpdate: updateSettings,
        onUpdateResponseModeRoute: updateResponseModeRoute,
        onAddResponseMode: addResponseMode,
        onRemoveResponseMode: removeResponseMode,
        onUpdateProviderSttModel: updateProviderSttModel,
        onUpdateProviderTtsModel: updateProviderTtsModel,
        onUpdateProviderTtsVoice: updateProviderTtsVoice,
        onUpdateApiKey: updateApiKey,
        onUpdateProviderValidationResult: updateProviderValidationResult,
        onPreviewVoice: handlePreviewVoice,
        onStopPreviewVoice: stopPreviewVoice,
        onValidateProviderCapability: handleValidateProviderCapability,
        onOpenSetupGuide: freeOffline.entitlement.isPremium
          ? settings.showSetupGuideShortcut
            ? handleOpenSetupGuideFromSettings
            : undefined
          : () => {
              closeSettings();
              freeOffline.setModalVisible(true);
            },
        isPremium: freeOffline.entitlement.isPremium,
        developmentEntitlementMode:
          freeOffline.entitlement.developmentEntitlementMode,
        onSetDevelopmentEntitlementMode:
          freeOffline.entitlement.setDevelopmentEntitlementMode,
        onOpenPremium: () => {
          setPremiumModalVisible(true);
        },
        onCreateAppDataBackup: handleCreateAppDataBackup,
        onRestoreAppDataBackup: handleRestoreAppDataBackup,
        conversationArchive,
        onClose: closeSettings,
      }}
      setupGuide={{
        visible: setupGuideVisible && freeOffline.entitlement.isPremium,
        step: setupGuideStep,
        providerOptions: setupGuideProviderOptions,
        selectedProvider: setupGuideSelectedProvider,
        selectedProviderApiKey: setupGuideSelectedProviderApiKey,
        currentValidationState: setupGuideValidationState,
        resolvedRoutes: setupGuideResolvedRoutes,
        voiceTest: setupGuideVoiceTest,
        kokoroModel,
        useKokoro: setupGuideUseKokoro,
        onSelectProvider: handleSelectProvider,
        onChangeProviderApiKey: handleProviderApiKeyChange,
        onDismiss: handleDismissSetupGuide,
        onBack: handleBack,
        onContinueFromIntro: handleContinueFromIntro,
        onValidateProviderKey: handleValidateSetupGuideProviderKey,
        onContinueFromProvider: handleContinueFromProvider,
        onToggleKokoro: handleToggleKokoro,
        onDownloadKokoro: handleDownloadKokoro,
        onContinueFromKokoro: handleContinueFromKokoro,
        onVoiceTestAction: handleSetupGuideVoiceTestAction,
        onResetVoiceTest: handleResetSetupGuideVoiceTest,
        onContinueFromVoiceTest: handleContinueFromVoiceTest,
        onFinish: handleFinishSetupGuidePress,
        onOpenSettings: handleOpenSettingsFromSetupGuide,
        showSettingsShortcutOption: setupGuideOpenedFromSettings,
        settingsShortcutVisible:
          freeOffline.entitlement.isPremium && settings.showSetupGuideShortcut,
        onChangeSettingsShortcutVisible:
          handleSetupGuideShortcutVisibilityChange,
      }}
      freeOffline={{
        controller: freeOffline,
        onOpenPremium: () => {
          freeOffline.setModalVisible(false);
          setPremiumModalVisible(true);
        },
      }}
      premiumUpgrade={{
        visible: premiumModalVisible,
        onClose: () => setPremiumModalVisible(false),
      }}
      conversationMemory={{
        visible: memoryVisible,
        title: memoryConversation?.title ?? t("freshSession"),
        summary: memoryConversation?.contextSummary,
        summarizedMessageCount: memoryConversation?.summarizedMessageCount,
        onCopy: handleCopyMemoryPress,
        onClear: handleClearMemoryPress,
        onSave: handleSaveMemory,
        onClose: closeMemory,
      }}
      conversationDrawer={{
        visible: drawerVisible,
        conversations,
        activeId: activeConversation?.id || null,
        onSearchConversations: searchConversations,
        onSelect: handleSelectConversation,
        onCopyThread: handleCopyDrawerThread,
        onShareThread: handleShareDrawerThread,
        onManageMemory: handleManageDrawerMemory,
        onInspectIntegrity: inspectConversationIntegrity,
        onRepairIntegrity: repairConversationIntegrity,
        onUndoIntegrityRepair: undoConversationIntegrityRepair,
        onExportIntegrityOriginals: handleShareMessage,
        onRenameThread: handleRenameDrawerThread,
        onTogglePinned: handleTogglePinned,
        onNewSession: () => {
          pendingImages.clearAttachments();
          void handleStartNewSession();
        },
        onTogglePrivate: (id) => {
          void handleTogglePrivate(id);
        },
        onDelete: handleDeleteConversation,
        onClose: handleCloseDrawer,
        onDismiss: handleDrawerDismiss,
      }}
    />
  );
}
