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

  // The intro replaces the blocking wizards. It opens from the banner, and
  // also whenever a turn is attempted with no usable route -- otherwise a new
  // user can reach a microphone that silently does nothing.
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
    repairConversationIntegrity,
    toggleConversationPinned,
    toggleConversationPrivate,
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
    settingsFocusPage,
    drawerVisible,
    statusDetailsVisible,
    memoryConversation,
    memoryVisible,
    setDrawerVisible,
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
    nativeRecognizerAvailable: nativeStt.isAvailable,
    selectedLocalSttModel: Boolean(selectedSttModel),
    sttMode: runtimeSettings.sttMode,
    sttProvider,
  });

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
  const promptBlockedActionEnabled =
    freeRuntimeBlocked && !freeOffline.checking && !freeOffline.preparing;
  const promptBlockedMessage = freeRuntimeBlocked
    ? t("freeOfflineIntro")
    : kokoroPromptBlockMessage;
  // Only when nothing else already owns the control: a Free runtime that is
  // still downloading, or a missing Kokoro voice, are both about a step the
  // user is mid-way through and outrank the general hint.
  const voiceInputUnavailableMessage =
    speechInputUnavailable && !promptBlockedMessage
      ? t("speechInputUnavailableHint")
      : null;
  // The workspace opens on the composer whenever the voice control cannot be
  // pressed: no route at all, nothing that can hear the user, or a block with
  // no action behind it. Landing on a dead control says the app is broken; the
  // composer at least shows what to do.
  //
  // Gated on settled state because the surface is chosen once, when the pager
  // mounts. Conversations and entitlement both start unresolved, and reading
  // that moment as "unusable" would strand every launch on the composer.
  const inputRoutesSettled =
    loaded && conversationsLoaded && freeOffline.entitlement.status !== "loading";
  const voiceSurfaceUnusable =
    inputRoutesSettled &&
    (voiceStageDisabled ||
      Boolean(voiceInputUnavailableMessage) ||
      Boolean(promptBlockedMessage && !promptBlockedActionEnabled));

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
          // The on-device page owns downloading, progress and verification;
          // firing a headless download here would leave it invisible.
          openSettings(undefined, undefined, "local");
        },
        onOpenPremium: () => {
          setPremiumModalVisible(true);
        },
        onOpenStt: () => {
          closeIntro();
          openSettings(
            undefined,
            "stt",
            freeOffline.entitlement.isPremium ? "listening" : "local",
          );
        },
        onOpenTts: () => {
          closeIntro();
          openSettings(
            undefined,
            "tts",
            freeOffline.entitlement.isPremium ? "speaking" : "local",
          );
        },
        t,
        visible: introVisible,
      }}
      workspace={{
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
          isPremium: freeOffline.entitlement.isPremium,
          language,
          offlineReady: freeOffline.freeRuntimeReady,
          onOpenSetupGuide: freeOffline.entitlement.isPremium
            ? handleOpenProviderSettings
            : openIntro,
          onSelectResponseMode: handleResponseModeChange,
          responseModes: runtimeSettings.responseModes,
          t,
        },
        routeControls: {
          showWebSearch: freeOffline.entitlement.isPremium,
          onToggleUlraMode: ulraMode.handleToggle,
          onToggleWebSearchEnabled: handleToggleWebSearch,
          t,
          ulraModeActive: premiumStorePromoActive || ulraMode.active,
          ulraModeAvailable:
            freeOffline.entitlement.isPremium &&
            (premiumStorePromoActive || ulraMode.available),
          webSearchEnabled: webSearchActive,
          webSearchReady: freeOffline.entitlement.isPremium && webSearchReady,
        },
        voiceStage: {
          attachments: pendingImages.attachments,
          disabled: voiceStageDisabled,
          driveAutoContinueEnabled,
          driveSilenceCountdownSeconds,
          driveSessionCanRepeat,
          driveVoiceActive,
          initialInputSurface: voiceSurfaceUnusable
            ? "text"
            : inputSurfaceRef.current,
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
            ? openIntro
            : handleOpenSpeakingSettings,
          onSubmitTextMessage: handleSubmitTextMessage,
          onTextMessageChange: handleTextMessageChange,
          playbackPaused: player.isPlaybackPaused,
          promptBlockedActionEnabled,
          promptBlockedActionLabel: freeRuntimeBlocked
            ? freeOffline.checking || freeOffline.preparing
              ? t("onDeviceTestingDevice")
              : t("freeOfflineDownloadAndTest")
            : kokoroPromptBlockActionLabel,
          promptBlockedMessage,
          promptBlockedProgress: freeRuntimeBlocked
            ? null
            : kokoroPromptBlockProgress,
          phaseProgress,
          recordingMaxMs: maxRecordingMs,
          recordingStartedAtMs,
          speechStartProgress: phaseProgress?.speechStart ?? null,
          statusTitle: statusDisplay.actionLabel,
          t,
          visualPhase,
          voiceInputUnavailableMessage,
          voiceSurfaceUnusable,
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
          onOpenSpeakingSettings: handleOpenSpeakingSettings,
          onOpenStyleSheet: handleOpenConversationSettings,
          onRepeatMessage: (message) => {
            void handleRepeatMessage(message);
          },
          onRetryMessage: handleRetryMessage,
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
        onCreateAppDataBackup: handleCreateAppDataBackup,
        onRestoreAppDataBackup: handleRestoreAppDataBackup,
        conversationArchive,
        storePromoLocalDevicePreview: premiumStorePromoActive,
        onClose: closeSettings,
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
