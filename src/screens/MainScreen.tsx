import React, { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";
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
import { useAutoSetupJob } from "./main/useAutoSetupJob";
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
import { useTextTurnSubmitController } from "./main/useTextTurnSubmitController";
import { useVoiceSessionController } from "./main/useVoiceSessionController";
import { useUlraModeControl } from "./main/useUlraModeControl";
import { getKokoroPromptBlockState } from "./main/kokoroPromptBlockState";
import { isSpeechInputUnavailable } from "./main/speechInputAvailability";
import { useMainScreenDataBackup } from "./main/useMainScreenDataBackup";
import { useMainScreenImageAttachments } from "./main/useMainScreenImageAttachments";
import { formatMessageForCopy } from "../utils/conversationExport";
import { useImagePromptSubmission } from "./main/useImagePromptSubmission";
import { useFreeOfflineMode } from "./main/useFreeOfflineMode";
import { hasProviderCredentialForCapability } from "../utils/providerCredentials";
import { useStorePromoPresentation } from "../hooks/useStorePromoPresentation";
import {
  applyStorePromoFreeOfflineController,
  getStorePromoPipelinePhase,
} from "../services/storePromoPresentation";

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
  const storePromoPresentation = useStorePromoPresentation();
  const storePromoOrbPresentation = storePromoPresentation.orb;
  const storePromoScene = storePromoPresentation.scene;
  const baseFreeOffline = useFreeOfflineMode({
    settings,
    settingsLoaded: loaded && storePromoPresentation.loaded,
    suspended: storePromoScene === "free",
    updateSettings,
  });
  const freeOffline = React.useMemo(
    () =>
      applyStorePromoFreeOfflineController(
        baseFreeOffline,
        settings,
        storePromoScene,
        Platform.OS === "ios" ? "ios" : "android",
      ),
    [baseFreeOffline, settings, storePromoScene],
  );
  const runtimeSettings = freeOffline.effectiveSettings;

  // The introduction is an explicit secondary surface opened from its banner.
  // A blocked turn points to the relevant settings page rather than hijacking
  // a voice or text action into the information flow.
  const [introVisible, setIntroVisible] = React.useState(false);
  const openIntro = React.useCallback(() => {
    setIntroVisible(true);
    updateSettings({ introOpened: true });
  }, [updateSettings]);
  const closeIntro = React.useCallback(() => setIntroVisible(false), []);
  const dismissIntroBanner = React.useCallback(() => {
    updateSettings({ introDismissed: true });
  }, [updateSettings]);
  const [premiumModalVisible, setPremiumModalVisible] = React.useState(false);
  // A purchase is the one outcome that ends the introduction on its own: the
  // reader has decided, and the invitation has nothing left to invite. Closing
  // the purchase sheet without buying leaves them where they were.
  const wasPremiumRef = React.useRef<boolean | null>(null);
  const isPremiumNow = freeOffline.entitlement.isPremium;
  React.useEffect(() => {
    const wasPremium = wasPremiumRef.current;
    wasPremiumRef.current = isPremiumNow;
    // Only while the sheet is open. Entitlement also resolves from false to
    // premium during boot, and treating that as a purchase would dismiss the
    // banner on every launch for someone who already owns Premium.
    if (wasPremium === false && isPremiumNow && premiumModalVisible) {
      setPremiumModalVisible(false);
      setIntroVisible(false);
      updateSettings({ introDismissed: true });
    }
  }, [isPremiumNow, premiumModalVisible, updateSettings]);
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
    removeMessage,
    repairConversationIntegrity,
    toggleConversationPinned,
    toggleConversationPrivate,
    toggleConversationArchived,
    undoConversationIntegrityRepair,
    searchConversations,
    deleteConversation,
    editUserMessage,
    branchConversationAtMessage,
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
  const archivedConversationCount = React.useMemo(
    () => conversations.filter((conversation) => conversation.archived).length,
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
  const nativeStt = useNativeSpeechRecognizer(
    runtimeSettings.sttLanguage,
    runtimeSettings.nativeSttRequiresOnDevice,
  );
  const player = useAudioPlayer({
    beforePlayback: recorder.stopAmbientMonitoring,
  });
  const kokoroModel = useKokoroModel();
  const {
    actionLabel: kokoroPromptBlockActionLabel,
    message: kokoroPromptBlockMessage,
  } = getKokoroPromptBlockState({
    kokoroModel,
    verifiedByOfflineProfile:
      freeOffline.entitlement.status === "free" && freeOffline.freeRuntimeReady,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    t,
    ttsMode: runtimeSettings.ttsMode,
  });

  const [styleSheetVisible, setStyleSheetVisible] = React.useState(false);
  const [drawerArchivedOnOpen, setDrawerArchivedOnOpen] = React.useState(false);
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
    settingsFocusPage,
    drawerVisible,
    routePickerVisible,
    statusDetailsVisible,
    transcriptSheetVisible,
    memoryConversation,
    memoryVisible,
    setDrawerVisible,
    setMemoryConversation,
    openSettings,
    closeSettings,
    runAfterSettingsDismiss,
    handleSettingsDismiss,
    openMemoryConversation,
    closeMemory,
    openStatusDetails,
    closeStatusDetails,
    openRoutePicker,
    closeRoutePicker,
    openTranscriptSheet,
    closeTranscriptSheet,
    runAfterTranscriptDismiss,
    handleTranscriptDismiss,
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
  const premiumStorePromoActive = storePromoScene === "premium";
  const presentationAvailableResponseModes = premiumStorePromoActive
    ? runtimeSettings.responseModes.map(({ id }) => id)
    : availableResponseModes;
  const isLandscape = width > height;
  const ulraMode = useUlraModeControl({
    availableModelCount: presentationAvailableResponseModes.length,
    settings: runtimeSettings,
    t,
    updateSettings,
  });
  const showStyleChip =
    loaded &&
    freeOffline.entitlement.isPremium &&
    presentationAvailableResponseModes.length > 0;
  const mainSurfaceVisible = !(
    drawerVisible ||
    memoryVisible ||
    settingsVisible ||
    statusDetailsVisible ||
    styleSheetVisible ||
    freeOffline.setupVisible ||
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
  const speechInputUnavailable = isSpeechInputUnavailable({
    hasProviderCredential: sttProvider
      ? hasProviderCredentialForCapability(sttProvider, sttApiKey, "stt")
      : false,
    localSttModelId: runtimeSettings.localSttModelId,
    nativeRecognizerAvailable: nativeStt.isAvailable,
    sttMode: runtimeSettings.sttMode,
    sttProvider,
  });

  const recordingStartedAtMs = React.useMemo(
    () => (isRecording ? Date.now() : null),
    [isRecording],
  );
  const { dismissToast, showToast, toast } = useMainScreenToastController();
  usePersistenceFailureAlert(showToast, t);
  // Where the outcome is announced depends on where the user is: the auto
  // setup card states it in full in the introduction and on the On-device
  // page, and the toast carries it anywhere else. Never both — two
  // announcements of one event read as two events.
  const autoSetupSurfacesVisibleRef = React.useRef(false);
  autoSetupSurfacesVisibleRef.current = introVisible || settingsVisible;
  const autoSetup = useAutoSetupJob({
    onOutcome: (outcome) => {
      if (autoSetupSurfacesVisibleRef.current) {
        return;
      }
      if (outcome === "done") {
        showToast(t("autoSetupDoneTitle"), undefined, "success");
      } else {
        showToast(t("autoSetupBarFailed"), undefined, "danger");
      }
    },
    settings,
    t,
    updateSettings,
  });
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
    language: runtimeSettings.language,
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

  const { handleBranchMessage, handleRetryMessage, handleSubmitTextMessage } =
    useTextTurnSubmitController({
      branchConversationAtMessage,
      branchCreatedMessage: t("branchReady"),
      branchFailureMessage: t("persistenceFailure"),
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
    driveAutoContinueEnabled,
    driveSilenceCountdownSeconds,
    driveSessionCanRepeat,
    driveVoiceActive,
    handleContinueDriveSession,
    handlePressIn,
    handlePressOut,
    handleRepeatDriveReply,
    handleStopPlayback,
    handleInterruptPlayback,
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
    preserveInterruptedReply: () => {
      const partialReply = streamingText.trim();
      if (
        !partialReply ||
        partialReply === lastCompletedReplyRef.current.trim()
      ) {
        return;
      }
      addMessage({
        role: "assistant",
        content: partialReply,
        model,
        provider: localLlmModelId ? null : provider,
        metadata: {
          notices: [
            {
              stage: "interruption",
              level: "warning",
              message: t("replyInterruptedNotice"),
            },
          ],
        },
      });
    },
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
    handleReportMessage,
    handleRenameThread,
    handleTogglePinned,
    handleTogglePrivate,
    handleToggleArchived,
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
    toggleConversationArchived,
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

  const {
    canGenerateTitle,
    handleGenerateTitle,
    handleGenerateTitleForConversation,
    isGeneratingTitle,
  } = useConversationTitleGenerator({
    activeConversation,
    apiKey: providerApiKey,
    getConversationById,
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

  const presentationPipelinePhase = getStorePromoPipelinePhase(
    storePromoScene,
    pipelinePhase,
  );
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
    pipelinePhase: presentationPipelinePhase,
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
    visualPhaseOverride: storePromoOrbPresentation?.phase,
  });
  const {
    handleAutoRenameConversation,
    handleClearMemoryPress,
    handleCloseConversationSettings,
    handleCloseDrawer,
    handleCopyDrawerThread,
    handleCopyMemoryPress,
    handleManageDrawerMemory,
    handleOpenConversationSettings,
    handleOpenDrawer,
    handleOpenMainSettings,
    handleOpenProviderSettings,
    handleOpenSpeakingSettings,
    handleRenameDrawerThread,
    handleShareDrawerThread,
    handleToggleWebSearch,
  } = useMainScreenSurfaceActions({
    handleClearMemory,
    handleCopyMemory,
    handleCopyThread,
    handleGenerateTitle,
    handleRenameThread,
    handleShareThread,
    openMemory,
    openSettings,
    runAfterDrawerDismiss,
    setDrawerVisible,
    setStyleSheetVisible,
    updateSettings,
    webSearchActive,
  });
  const handleOpenTranscriptConversationSettings = React.useCallback(() => {
    runAfterTranscriptDismiss(handleOpenConversationSettings);
  }, [handleOpenConversationSettings, runAfterTranscriptDismiss]);
  const handleOpenTranscriptSpeakingSettings = React.useCallback(() => {
    runAfterTranscriptDismiss(handleOpenSpeakingSettings);
  }, [handleOpenSpeakingSettings, runAfterTranscriptDismiss]);
  const handleOpenArchivedConversations = React.useCallback(() => {
    runAfterSettingsDismiss(() => {
      setDrawerArchivedOnOpen(true);
      setDrawerVisible(true);
    });
  }, [runAfterSettingsDismiss, setDrawerVisible]);
  const handleCloseConversationDrawer = React.useCallback(() => {
    setDrawerArchivedOnOpen(false);
    handleCloseDrawer();
  }, [handleCloseDrawer]);
  const handleConversationDrawerDismiss = React.useCallback(() => {
    setDrawerArchivedOnOpen(false);
    handleDrawerDismiss();
  }, [handleDrawerDismiss]);

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
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    statusDetailsVisible,
    sttMode: runtimeSettings.sttMode,
    sttProvider,
    ttsMode: runtimeSettings.ttsMode,
    ttsProvider,
    visualPhase,
  });

  const voiceStageDisabled =
    (!premiumStorePromoActive && voiceInputDisabled) ||
    freeOffline.entitlement.status === "loading";
  const voiceStageActive = isActive && mainSurfaceVisible;
  // Hidden rather than disabled when the route cannot take an image at all;
  // disabled only for the moments it is briefly unavailable.
  const imageAttachmentAvailable =
    freeOffline.entitlement.isPremium && !voiceInputDisabled;
  const imageAttachmentDisabled = voiceStageDisabled || voiceStageActive;

  const freeRuntimeBlocked =
    freeOffline.entitlement.status === "free" && !freeOffline.freeRuntimeReady;
  const providerRouteBlocked =
    loaded &&
    freeOffline.entitlement.isPremium &&
    presentationAvailableResponseModes.length === 0 &&
    !kokoroPromptBlockMessage;
  const promptBlockedActionEnabled = freeRuntimeBlocked
    ? !freeOffline.checking && !freeOffline.preparing
    : providerRouteBlocked || Boolean(kokoroPromptBlockMessage);
  const promptBlockedMessage = freeRuntimeBlocked
    ? t("freeOfflineIntro")
    : providerRouteBlocked
      ? t("configureCredentialsBeforeVoiceSession")
      : kokoroPromptBlockMessage;
  // Only when nothing else already owns the control: a Free runtime that is
  // still downloading, or a missing Kokoro voice, are both about a step the
  // user is mid-way through and outrank the general hint.
  const voiceInputUnavailableMessage =
    speechInputUnavailable && !promptBlockedMessage
      ? t("speechInputUnavailableHint")
      : null;
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
      intro={{
        autoSetup,
        language: settings.language,
        onClose: closeIntro,
        // Provider keys are Premium, so a Free reader is sent to the purchase
        // sheet rather than to a page that would only tell them no. The sheet
        // opens over the introduction; see onClose on premiumUpgrade.
        onConnectProvider: () => {
          if (!freeOffline.entitlement.isPremium) {
            setPremiumModalVisible(true);
            return;
          }
          closeIntro();
          openSettings(undefined, "providers", "connections");
        },
        onInstallLocal: () => {
          closeIntro();
          openSettings(undefined, undefined, "thinking");
        },
        onOpenPremium: () => {
          setPremiumModalVisible(true);
        },
        onOpenStt: () => {
          closeIntro();
          openSettings(undefined, "stt", "listening");
        },
        onOpenTts: () => {
          closeIntro();
          openSettings(undefined, "tts", "speaking");
        },
        t,
        visible: introVisible,
      }}
      workspace={{
        // The row reports work the user started somewhere else. A failed
        // scan is not that: nothing was running, so nothing is reported.
        backgroundTask:
          autoSetup.state === "installing" ||
          (autoSetup.state === "failed" && autoSetup.errorKind === "install")
            ? {
                accessibilityLabel: `${
                  autoSetup.state === "failed"
                    ? t("autoSetupBarFailed")
                    : t("autoSetupBarInstalling")
                }. ${t("autoSetupBarOpen")}`,
                detail:
                  autoSetup.state === "failed"
                    ? t("autoSetupBarFailedDetail")
                    : [
                        autoSetup.reading?.stepLabel,
                        autoSetup.reading?.remaining,
                      ]
                        .filter(Boolean)
                        .join(" · "),
                fraction: autoSetup.fraction,
                onPress: () => openSettings(undefined, undefined, "app"),
                title:
                  autoSetup.state === "failed"
                    ? t("autoSetupBarFailed")
                    : t("autoSetupBarInstalling"),
                tone: autoSetup.state === "failed" ? "danger" : "progress",
              }
            : null,
        colors,
        introBanner: {
          onDismiss: dismissIntroBanner,
          onOpen: openIntro,
          showDismiss: runtimeSettings.introOpened,
          t,
          // Hidden once dismissed, and never shown over a store-promo capture.
          visible:
            loaded && !runtimeSettings.introDismissed && !storePromoScene,
        },
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
          availableResponseModes: loaded
            ? presentationAvailableResponseModes
            : [],
          onOpenRoutePicker: openRoutePicker,
          responseModes: runtimeSettings.responseModes,
          t,
        },
        routePicker: {
          modes: runtimeSettings.responseModes,
          onClose: closeRoutePicker,
          onSelect: handleResponseModeChange,
          readyModes: loaded ? presentationAvailableResponseModes : [],
          selected: activeResponseMode,
          visible: routePickerVisible,
        },
        satellites: {
          councilActive: premiumStorePromoActive || ulraMode.active,
          councilAvailable:
            freeOffline.entitlement.isPremium &&
            (premiumStorePromoActive || ulraMode.available),
          disabled: voiceStageActive,
          imageAvailable: imageAttachmentAvailable,
          imageDisabled: imageAttachmentDisabled,
          onAddImage: imagePromptSubmission.handleAddImage,
          onInterruptPlayback: handleInterruptPlayback,
          onStopPlayback: handleStopPlayback,
          onToggleCouncil: ulraMode.handleToggle,
          onToggleWeb: handleToggleWebSearch,
          t,
          webActive: webSearchActive,
          webAvailable:
            freeOffline.entitlement.isPremium &&
            webSearchReady &&
            Boolean(handleToggleWebSearch),
        },
        settingsSummary: {
          accessibilityLabel: t("openStyleSheet"),
          onPress: handleOpenConversationSettings,
          summary: `${t(responseTone)} · ${t(responseLength)}`,
        },
        statusLine: {
          detailActive: statusDisplay.statusDetail,
          detailIdle: `${activeConversationTitle} · ${
            statusDisplay.messageCountLabel ?? t("freshSession")
          }`,
          onInfo: openStatusDetails,
          sessionDetailsLabel: t("workspaceSessionDetails"),
          titleActive: statusDisplay.statusTitle,
          titleIdleText: t("workspaceTypeAndSend"),
          titleIdleVoice: statusDisplay.actionLabel,
        },
        transcriptSheet: {
          countLabel: statusDisplay.messageCountLabel,
          emptyLabel: t("workspaceNoMessagesYet"),
          hideLabel: t("workspaceHideTranscript"),
          onClose: closeTranscriptSheet,
          onDismiss: handleTranscriptDismiss,
          onOpen: openTranscriptSheet,
          showLabel: t("showTranscript"),
          title: activeConversationTitle,
          visible: transcriptSheetVisible,
        },
        visualPhase,
        voiceStage: {
          attachments: pendingImages.attachments,
          disabled: voiceStageDisabled,
          driveAutoContinueEnabled,
          driveSilenceCountdownSeconds,
          driveSessionCanRepeat,
          driveVoiceActive,
          initialInputSurface: inputSurfaceRef.current,
          initialTextMessage: textMessageDraftRef.current,
          inputMode: runtimeSettings.inputMode,
          isActive: voiceStageActive,
          onInputSurfaceChange: handleInputSurfaceChange,
          onRemoveImage: pendingImages.handleRemoveImage,
          onDriveContinue: handleContinueDriveSession,
          onDriveRepeat: handleRepeatDriveReply,
          onDriveStop: handleStopDriveSession,
          onPress: handleTogglePress,
          onPressIn: handlePressIn,
          onPressOut: handlePressOut,
          onInterruptPlayback: handleInterruptPlayback,
          onStopPlayback: handleStopPlayback,
          onResolvePromptBlock: freeRuntimeBlocked
            ? () => openSettings(undefined, undefined, "app")
            : providerRouteBlocked
              ? handleOpenProviderSettings
              : handleOpenSpeakingSettings,
          onSubmitTextMessage: handleSubmitTextMessage,
          onTextMessageChange: handleTextMessageChange,
          orbProgressOverride: storePromoOrbPresentation,
          playbackPaused: player.isPlaybackPaused,
          promptBlockedActionEnabled,
          promptBlockedActionLabel: freeRuntimeBlocked
            ? freeOffline.checking || freeOffline.preparing
              ? t("onDeviceTestingDevice")
              : t("freeOfflineDownloadAndTest")
            : providerRouteBlocked
              ? t("setupGuideConnectProviderTitle")
              : kokoroPromptBlockActionLabel,
          promptBlockedMessage,
          recordingMaxMs: maxRecordingMs,
          recordingStartedAtMs,
          speechStartProgress: phaseProgress?.speechStart ?? null,
          statusTitle: statusDisplay.actionLabel,
          t,
          visualPhase,
          voiceInputUnavailableMessage,
        },
        transcript: {
          activeConversationId: activeConversation?.id ?? null,
          activeConversationTitle,
          activeConversationBranch: activeConversation?.branch,
          conversationBranches: conversations,
          activeReplayMessageId,
          imageAttachmentDisabled,
          messages,
          onAddImage: imageAttachmentAvailable
            ? imagePromptSubmission.handleAddImage
            : undefined,
          onCopyMessage: (message) =>
            handleCopyMessage(formatMessageForCopy(message, language)),
          onEditMessage: isBusy
            ? undefined
            : (message, content) => editUserMessage(message.id, content),
          onBranchMessage: isBusy ? undefined : handleBranchMessage,
          onSelectBranchConversation: isBusy ? undefined : selectConversation,
          onOpenSpeakingSettings: handleOpenTranscriptSpeakingSettings,
          onOpenStyleSheet: handleOpenTranscriptConversationSettings,
          onRepeatMessage: (message) => {
            void handleRepeatMessage(message);
          },
          onRetryMessage: handleRetryMessage,
          onRemoveMessage: isBusy
            ? undefined
            : (message) => {
                void removeMessage(message.id);
              },
          onShareMessage: (message) => {
            void handleShareMessage(formatMessageForCopy(message, language));
          },
          onReportMessage: (message) => {
            void handleReportMessage(message);
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
        archivedConversationCount,
        autoSetup,
        focusPage: settingsFocusPage,
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
        isPremium: freeOffline.entitlement.isPremium,
        developmentEntitlementMode:
          freeOffline.entitlement.developmentEntitlementMode,
        onSetDevelopmentEntitlementMode:
          freeOffline.entitlement.setDevelopmentEntitlementMode,
        onOpenPremium: () => {
          setPremiumModalVisible(true);
        },
        onOpenArchivedConversations: handleOpenArchivedConversations,
        onCreateAppDataBackup: handleCreateAppDataBackup,
        onRestoreAppDataBackup: handleRestoreAppDataBackup,
        conversationArchive,
        storePromoLocalDevicePreview: premiumStorePromoActive,
        onClose: closeSettings,
        onDismiss: handleSettingsDismiss,
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
        archivedInitiallyExpanded: drawerArchivedOnOpen,
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
        onToggleArchived: handleToggleArchived,
        onAutoName: handleGenerateTitleForConversation,
        onNewSession: () => {
          pendingImages.clearAttachments();
          void handleStartNewSession();
        },
        onTogglePrivate: (id) => {
          void handleTogglePrivate(id);
        },
        onDelete: handleDeleteConversation,
        onClose: handleCloseConversationDrawer,
        onDismiss: handleConversationDrawerDismiss,
      }}
    />
  );
}
