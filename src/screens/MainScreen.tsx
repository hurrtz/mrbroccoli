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
import { getKokoroVoiceOptions } from "../constants/kokoro";
import { getProviderModelName } from "../constants/models";
import { getLocalModel } from "../constants/localModels";
import { useLocalization } from "../i18n";
import { useTheme } from "../theme/ThemeContext";
import { resolveIpadLayout } from "../utils/ipadLayout";
import { MainScreenPresentation } from "./main/MainScreenPresentation";
import {
  getActiveCouncilModelPosition,
  getMainScreenViewModel,
} from "./main/mainScreenViewModel";
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
import { useCouncilControl } from "./main/useCouncilControl";
import { getKokoroPromptBlockState } from "./main/kokoroPromptBlockState";
import { isSpeechInputUnavailable } from "./main/speechInputAvailability";
import { useMainScreenDataBackup } from "./main/useMainScreenDataBackup";
import { useMainScreenImageAttachments } from "./main/useMainScreenImageAttachments";
import { formatMessageForCopy } from "../utils/conversationExport";
import { useImagePromptSubmission } from "./main/useImagePromptSubmission";
import { hasProviderCredentialForCapability } from "../utils/providerCredentials";
import { useStorePromoPresentation } from "../hooks/useStorePromoPresentation";
import { useNativeVoiceOptions } from "../features/settings-core/useNativeVoiceOptions";
import {
  canUnlockSessionWithDeviceAuth,
  clearSessionLock,
  createSessionLock,
  unlockSessionWithDeviceAuth,
  verifySessionPassword,
} from "../services/sessionLock";
import { getStorePromoPipelinePhase } from "../services/storePromoPresentation";

export function MainScreen() {
  const { colors, isDark } = useTheme();
  const { isRtl, language, t } = useLocalization();
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
  const runtimeSettings = settings;
  const providerVoiceDirectories = useMainScreenVoiceDirectories({
    loaded,
    settings: runtimeSettings,
    suspended: !storePromoPresentation.loaded,
    updateProviderTtsVoice,
  });
  const {
    conversations,
    activeConversation,
    createConversation,
    selectConversation,
    grantConversationAccess,
    getConversationById,
    addMessage,
    updateMessage,
    updateConversationContextSummary,
    updateConversationSettings,
    clearConversationSettings,
    renameConversation,
    removeMessage,
    toggleConversationPinned,
    toggleConversationArchived,
    updateConversationLocked,
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
  const lockedConversationIds = React.useMemo(
    () =>
      conversations
        .filter((conversation) => conversation.isLocked)
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
    enabled: true,
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
    verifiedByOfflineProfile: false,
    spokenRepliesEnabled: runtimeSettings.spokenRepliesEnabled,
    t,
    ttsMode: runtimeSettings.ttsMode,
  });

  const [styleSheetVisible, setStyleSheetVisible] = React.useState(false);
  const [imageSourceVisible, setImageSourceVisible] = React.useState(false);
  const [drawerArchivedRevealRequestId, setDrawerArchivedRevealRequestId] =
    React.useState<number | null>(null);
  const drawerArchivedRevealSequenceRef = React.useRef(0);
  const {
    handleInputSurfaceChange,
    handleTextInputFocusChange,
    handleTextMessageChange,
    inputSurfaceRef,
    textInputFocusedRef,
    textMessageDraftRef,
  } = useMainScreenComposerDraft();
  const {
    settingsVisible,
    settingsFocusCatalogProviderId,
    settingsFocusTab,
    settingsFocusPage,
    drawerVisible,
    routePickerVisible,
    transcriptSheetVisible,
    setDrawerVisible,
    openSettings,
    closeSettings,
    runAfterSettingsDismiss,
    handleSettingsDismiss,
    openRoutePicker,
    closeRoutePicker,
    openTranscriptSheet,
    closeTranscriptSheet,
    runAfterTranscriptDismiss,
    handleTranscriptDismiss,
    runAfterDrawerDismiss,
    handleDrawerDismiss,
  } = useMainScreenUiState();
  const handleCloseSettings = closeSettings;

  const {
    activeResponseMode,
    availableResponseModes,
    availableSttProviders,
    availableTtsProviders,
    councilRoutes,
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
  const presentationAvailableResponseModes = availableResponseModes;
  const ipadLayout = React.useMemo(
    () =>
      resolveIpadLayout({
        height,
        isPad: Platform.OS === "ios" && Platform.isPad,
        platform: Platform.OS,
        width,
      }),
    [height, width],
  );
  const { isLandscape } = ipadLayout;
  const ipadLayoutRef = React.useRef(ipadLayout);
  ipadLayoutRef.current = ipadLayout;
  const drawerModalAvailable = !ipadLayout.isRegularWidth;
  const drawerModalVisible = drawerModalAvailable && drawerVisible;
  const transcriptModalAvailable =
    !ipadLayout.transcriptDocked && (ipadLayout.isRegularWidth || !isLandscape);
  const transcriptModalVisible =
    transcriptModalAvailable && transcriptSheetVisible;

  React.useEffect(() => {
    if (!drawerModalAvailable && drawerVisible) {
      setDrawerVisible(false);
    }
  }, [drawerModalAvailable, drawerVisible, setDrawerVisible]);

  React.useEffect(() => {
    if (!transcriptModalAvailable && transcriptSheetVisible) {
      closeTranscriptSheet();
    }
  }, [closeTranscriptSheet, transcriptModalAvailable, transcriptSheetVisible]);
  const council = useCouncilControl({
    activeResponseMode,
    availableModeIds: presentationAvailableResponseModes,
    settings: runtimeSettings,
    updateSettings,
  });
  const ulraModeConfiguration = React.useMemo(() => {
    if (!council.active) {
      return undefined;
    }
    const selectedModeIds = new Set(council.selectedModeIds);
    const routes = councilRoutes.filter(({ modeId }) =>
      selectedModeIds.has(modeId),
    );
    return routes.length > 1
      ? { rounds: runtimeSettings.ulraModeRounds, routes }
      : undefined;
  }, [
    council.active,
    council.selectedModeIds,
    councilRoutes,
    runtimeSettings.ulraModeRounds,
  ]);
  const {
    assistantInstructions,
    effectiveTtsInstructions,
    hasOverrides: conversationSettingsHaveOverrides,
    initialConversationSettings,
    llmInstructions,
    responseLength,
    responseTone,
    resetConversationSettings,
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
    clearConversationSettings,
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
  const { nativeVoiceOptions } = useNativeVoiceOptions({
    visible: loaded,
    shouldLoad:
      runtimeSettings.spokenRepliesEnabled &&
      runtimeSettings.ttsMode === "native",
    listenLanguages: runtimeSettings.ttsListenLanguages,
    preferredVoiceId: runtimeSettings.nativeTtsVoiceId,
  });
  const settingsSummaryVoice = React.useMemo(() => {
    if (!runtimeSettings.spokenRepliesEnabled) {
      return t("spokenRepliesOff");
    }

    if (runtimeSettings.ttsMode === "native") {
      return (
        nativeVoiceOptions.find(
          ({ value }) => value === runtimeSettings.nativeTtsVoiceId,
        )?.label ?? t("systemVoice")
      );
    }

    if (runtimeSettings.ttsMode === "kokoro") {
      return (
        getKokoroVoiceOptions("en", language).find(
          ({ value }) => value === runtimeSettings.kokoroVoices.en,
        )?.label ?? "Kokoro"
      );
    }

    if (runtimeSettings.ttsMode === "local") {
      return runtimeSettings.localTtsModelId
        ? getLocalModel(runtimeSettings.localTtsModelId).name
        : t("noTtsProvider");
    }

    return (
      conversationTtsVoiceOptions.find(
        ({ value }) => value === selectedTtsVoice,
      )?.label ?? selectedTtsVoice
    );
  }, [
    conversationTtsVoiceOptions,
    language,
    nativeVoiceOptions,
    runtimeSettings.kokoroVoices.en,
    runtimeSettings.localTtsModelId,
    runtimeSettings.nativeTtsVoiceId,
    runtimeSettings.spokenRepliesEnabled,
    runtimeSettings.ttsMode,
    selectedTtsVoice,
    t,
  ]);
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
  const authenticateLockedSession = React.useCallback(
    async (
      conversationId: string,
      method: "device" | "password",
      password?: string,
    ) => {
      try {
        const authenticated =
          method === "device"
            ? await unlockSessionWithDeviceAuth(
                conversationId,
                t("sessionDeviceAuthPrompt"),
              )
            : await verifySessionPassword(conversationId, password ?? "");
        if (!authenticated) {
          showToast(t("sessionUnlockFailedNotLoaded"), undefined, "danger");
          return false;
        }
        grantConversationAccess(conversationId);
        return true;
      } catch {
        showToast(t("sessionUnlockFailedNotLoaded"), undefined, "danger");
        return false;
      }
    },
    [grantConversationAccess, showToast, t],
  );
  const handleRemoveSessionLock = React.useCallback(
    async (
      conversationId: string,
      method: "device" | "password",
      password?: string,
    ) => {
      if (
        !(await authenticateLockedSession(conversationId, method, password))
      ) {
        return false;
      }
      try {
        if (!(await updateConversationLocked(conversationId, false))) {
          throw new Error("lock-state-update-failed");
        }
        await clearSessionLock(conversationId, t("sessionDeviceAuthPrompt"));
        showToast(t("sessionLockRemoved"), undefined, "success");
        return true;
      } catch {
        showToast(t("sessionUnlockFailedNotLoaded"), undefined, "danger");
        return false;
      }
    },
    [authenticateLockedSession, showToast, t, updateConversationLocked],
  );
  usePersistenceFailureAlert(showToast, t);
  const showImageError = React.useCallback(
    (message: string) => showToast(message, undefined, "danger"),
    [showToast],
  );

  const pendingImages = useMainScreenImageAttachments({
    disabled: voiceInputDisabled,
    onOpenSourcePicker: () => setImageSourceVisible(true),
    showError: showImageError,
    t,
  });

  const {
    completedReplyVersion,
    councilProgress,
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
    lockedConversationIds,
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

  const councilModels = React.useMemo(
    () =>
      councilRoutes.map((route) => ({
        id: route.modeId,
        label: getProviderModelName(route.provider, route.model),
        provider: route.provider,
        selected: council.selectedModeIds.includes(route.modeId),
      })),
    [council.selectedModeIds, councilRoutes],
  );
  const councilHeaderReport = React.useMemo(() => {
    if (!isBusy || !ulraModeConfiguration) {
      return undefined;
    }
    const fallbackRoute = ulraModeConfiguration.routes[0];
    const reportedRoute =
      councilProgress?.stage === "round" &&
      councilProgress.activeModel &&
      councilProgress.activeProvider
        ? {
            model: councilProgress.activeModel,
            provider: councilProgress.activeProvider,
          }
        : councilProgress?.stage === "synthesis"
          ? {
              model: councilProgress.model,
              provider: councilProgress.provider,
            }
          : fallbackRoute;
    const activeRoute = reportedRoute ?? fallbackRoute;
    if (!activeRoute) {
      return undefined;
    }
    const summary =
      councilProgress?.stage === "synthesis"
        ? `${t("councilModelsDone", {
            completed: ulraModeConfiguration.routes.length,
            total: ulraModeConfiguration.routes.length,
          })} · ${t("councilSynthesizing")}`
        : [
            t("councilActiveModelProgress", {
              current: getActiveCouncilModelPosition(
                councilProgress?.stage === "round"
                  ? councilProgress.completedModels
                  : 0,
                councilProgress?.stage === "round"
                  ? councilProgress.totalModels
                  : ulraModeConfiguration.routes.length,
              ),
              total:
                councilProgress?.stage === "round"
                  ? councilProgress.totalModels
                  : ulraModeConfiguration.routes.length,
            }),
            councilProgress?.stage === "round" &&
            councilProgress.failedModels > 0
              ? t("councilFailedProgress", {
                  count: councilProgress.failedModels,
                })
              : null,
            t("councilRoundProgress", {
              current:
                councilProgress?.stage === "round"
                  ? councilProgress.currentRound
                  : 1,
              total:
                councilProgress?.stage === "round"
                  ? councilProgress.totalRounds
                  : runtimeSettings.ulraModeRounds + 1,
            }),
          ]
            .filter(Boolean)
            .join(" · ");
    return {
      modelName: getProviderModelName(activeRoute.provider, activeRoute.model),
      provider: activeRoute.provider,
      summary,
    };
  }, [
    councilProgress,
    isBusy,
    runtimeSettings.ulraModeRounds,
    t,
    ulraModeConfiguration,
  ]);

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
    imagesEnabled: true,
    imageRoutes,
    onAddImage: pendingImages.handleAddImage,
    pendingAttachments: pendingImages.attachments,
    runVoiceCapture,
    showToast,
    t,
    updateMessage,
  });
  const secondarySurfaceTransitionVisible = false;
  const mainSurfaceVisible = !(
    drawerModalVisible ||
    imageSourceVisible ||
    Boolean(imagePromptSubmission.consent) ||
    routePickerVisible ||
    settingsVisible ||
    styleSheetVisible ||
    transcriptModalVisible
  );
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
    handsFreeEnabled,
    handsFreeSilenceCountdownSeconds,
    handsFreeVoiceActive,
    handlePressIn,
    handlePressOut,
    handleStopPlayback,
    handleInterruptPlayback,
    handleToggleHandsFree,
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
        provider,
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
  const conversationSettingsSummary = React.useMemo(
    () =>
      t("conversationSettingsSummary", {
        handsFree: handsFreeEnabled ? t("modelEffortEnabled") : "",
        length: t(responseLength),
        tone: t(responseTone),
        voice: settingsSummaryVoice,
      }),
    [handsFreeEnabled, responseLength, responseTone, settingsSummaryVoice, t],
  );

  const {
    handleCopyMessage,
    handleCopyThread,
    handleShareThread,
    handleShareMessage,
    handleReportMessage,
    handleRenameThread,
    handleTogglePinned,
    handleToggleArchived,
    handleDeleteConversation,
    handleSelectConversation,
    handleStartNewSession,
  } = useConversationActions({
    activeConversation,
    getConversationById,
    renameConversation,
    toggleConversationPinned,
    toggleConversationArchived,
    deleteConversation,
    selectConversation,
    clearActiveConversation,
    resetVoiceSessionState,
    showToast,
    language,
    t,
  });

  const activeConversationId = activeConversation?.id;
  const handleLockSession = React.useCallback(
    async (conversationId: string, password: string) => {
      try {
        await createSessionLock(
          conversationId,
          password,
          t("sessionDeviceAuthPrompt"),
        );
        if (activeConversationId === conversationId) {
          await resetVoiceSessionState();
        }
        if (!(await updateConversationLocked(conversationId, true))) {
          await clearSessionLock(conversationId);
          throw new Error("lock-state-update-failed");
        }
        showToast(t("sessionLocked"), undefined, "success");
        return true;
      } catch {
        showToast(t("sessionLockCouldNotBeSet"), undefined, "danger");
        return false;
      }
    },
    [
      activeConversationId,
      resetVoiceSessionState,
      showToast,
      t,
      updateConversationLocked,
    ],
  );

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
    providerReady: !voiceInputDisabled,
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
  const { isActive, lastAssistantReply, messages, statusDisplay, visualPhase } =
    getMainScreenViewModel({
      activeConversation,
      isRecording,
      model,
      pipelinePhase: presentationPipelinePhase,
      player,
      provider,
      settings: runtimeSettings,
      streamingText,
      t,
      ttsProvider,
      visualPhaseOverride: storePromoOrbPresentation?.phase,
    });
  const {
    handleAutoRenameConversation,
    handleCloseConversationSettings,
    handleCloseDrawer,
    handleCopyDrawerThread,
    handleOpenConversationSettings,
    handleOpenDrawer,
    handleOpenMainSettings,
    handleOpenProviderSettings,
    handleOpenSpeakingSettings,
    handleRenameDrawerThread,
    handleShareDrawerThread,
    handleToggleWebSearch,
  } = useMainScreenSurfaceActions({
    handleCopyThread,
    handleGenerateTitle,
    handleRenameThread,
    handleShareThread,
    openSettings,
    runAfterDrawerDismiss,
    setDrawerVisible,
    setStyleSheetVisible,
    updateSettings,
    webSearchActive,
  });
  const handleOpenTranscriptSpeakingSettings = React.useCallback(() => {
    runAfterTranscriptDismiss(handleOpenSpeakingSettings);
  }, [handleOpenSpeakingSettings, runAfterTranscriptDismiss]);
  const handleOpenArchivedConversations = React.useCallback(() => {
    runAfterSettingsDismiss(() => {
      drawerArchivedRevealSequenceRef.current += 1;
      setDrawerArchivedRevealRequestId(drawerArchivedRevealSequenceRef.current);
      if (!ipadLayoutRef.current.isRegularWidth) {
        setDrawerVisible(true);
      }
    });
  }, [runAfterSettingsDismiss, setDrawerVisible]);
  const handleArchivedRevealHandled = React.useCallback((requestId: number) => {
    setDrawerArchivedRevealRequestId((currentRequestId) =>
      currentRequestId === requestId ? null : currentRequestId,
    );
  }, []);
  const handleCloseConversationDrawer = React.useCallback(() => {
    setDrawerArchivedRevealRequestId(null);
    handleCloseDrawer();
  }, [handleCloseDrawer]);
  const handleConversationDrawerDismiss = React.useCallback(() => {
    setDrawerArchivedRevealRequestId(null);
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
    drawerVisible: drawerModalVisible,
    inputMode: runtimeSettings.inputMode,
    isRecording,
    loaded,
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
    sttMode: runtimeSettings.sttMode,
    sttProvider,
    ttsMode: runtimeSettings.ttsMode,
    ttsProvider,
    visualPhase,
  });

  const voiceStageDisabled = voiceInputDisabled;
  const voiceStageActive = isActive && mainSurfaceVisible;
  // Hidden rather than disabled when the route cannot take an image at all;
  // disabled only for the moments it is briefly unavailable.
  const imageAttachmentAvailable = !voiceInputDisabled;
  const imageAttachmentDisabled = voiceStageDisabled || voiceStageActive;

  const providerRouteBlocked =
    loaded &&
    presentationAvailableResponseModes.length === 0 &&
    !kokoroPromptBlockMessage;
  const promptBlockedActionEnabled =
    providerRouteBlocked || Boolean(kokoroPromptBlockMessage);
  const promptBlockedMessage = providerRouteBlocked
    ? t("configureCredentialsBeforeVoiceSession")
    : kokoroPromptBlockMessage;
  const voiceInputUnavailableMessage =
    speechInputUnavailable && !promptBlockedMessage
      ? t("speechInputUnavailableHint")
      : null;
  return (
    <MainScreenPresentation
      colors={colors}
      imageConsent={{
        cancelLabel: t("dismiss"),
        confirmLabel: t("imageProviderConsentConfirm"),
        message: imagePromptSubmission.consent?.message ?? "",
        onCancel: imagePromptSubmission.cancelConsent,
        onConfirm: imagePromptSubmission.confirmConsent,
        testID: "image-provider-consent-message",
        title:
          imagePromptSubmission.consent?.title ??
          t("imageProviderConsentTitle"),
        visible: Boolean(imagePromptSubmission.consent),
      }}
      isDark={isDark}
      ipadLayout={ipadLayout}
      isLandscape={isLandscape}
      language={language}
      toast={{
        message: toast?.message || "",
        visible: Boolean(toast),
        onDismiss: dismissToast,
        onRetry: toast?.onRetry,
        suspended: !mainSurfaceVisible,
        tone: toast?.tone,
      }}
      imageSource={{
        onChooseFromPhotos: () => void pendingImages.chooseFromPhotos(),
        onClose: () => setImageSourceVisible(false),
        onTakePhoto: () => void pendingImages.takePhoto(),
        t,
        visible: imageSourceVisible,
      }}
      workspace={{
        backgroundTask: null,
        colors,
        isLandscape,
        ipadLayout,
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
          councilReport: councilHeaderReport,
          onOpenRoutePicker: openRoutePicker,
          responseModes: runtimeSettings.responseModes,
          running: isBusy,
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
          attachments: pendingImages.attachments,
          councilActive: council.active,
          councilAvailable: council.available,
          councilCostSummary: t("councilCostSummary", {
            answers: council.selectedModeIds.length * council.totalRounds,
            models: council.selectedModeIds.length,
            rounds: council.totalRounds,
          }),
          councilMinimumModelsSummary: t("councilMinimumModels"),
          councilModels,
          councilRounds: council.totalRounds,
          councilRoundsLabel: t("councilRounds"),
          disabled: voiceStageActive,
          handsFreeActive: handsFreeEnabled,
          imageAvailable: imageAttachmentAvailable,
          imageDisabled: imageAttachmentDisabled,
          onAddImage: imagePromptSubmission.handleAddImage,
          onRemoveImage: pendingImages.handleRemoveImage,
          onChangeCouncilRounds: council.setTotalRounds,
          onToggleCouncilModel: council.toggleMode,
          onToggleHandsFree: handleToggleHandsFree,
          onToggleWeb: handleToggleWebSearch,
          t,
          webActive: webSearchActive,
          webAvailable: webSearchReady && Boolean(handleToggleWebSearch),
        },
        settingsSummary: {
          accessibilityLabel: t("openStyleSheet"),
          onPress: handleOpenConversationSettings,
          summary: conversationSettingsSummary,
        },
        transcriptSheet: {
          countLabel: statusDisplay.messageCountLabel,
          emptyLabel: t("workspaceNoMessagesYet"),
          hideLabel: t("workspaceHideTranscript"),
          onClose: closeTranscriptSheet,
          onDismiss: handleTranscriptDismiss,
          onOpen: openTranscriptSheet,
          showLabel: t("showTranscript"),
          titleLabel: t("workspaceTranscriptTitle"),
          visible: transcriptModalVisible,
        },
        visualPhase,
        voiceStage: {
          disabled: voiceStageDisabled,
          initialInputSurface: inputSurfaceRef.current,
          initialTextInputFocused: textInputFocusedRef.current,
          initialTextMessage: textMessageDraftRef.current,
          inputMode: runtimeSettings.inputMode,
          isActive: voiceStageActive,
          handsFreeSilenceCountdownSeconds,
          handsFreeVoiceActive,
          onInputSurfaceChange: handleInputSurfaceChange,
          onPress: handleTogglePress,
          onPressIn: handlePressIn,
          onPressOut: handlePressOut,
          onInterruptPlayback: handleInterruptPlayback,
          onRestartReply: player.canRestartReply
            ? () => void player.restartReply()
            : undefined,
          onSeekBack: player.canSeekParagraph
            ? () => void player.seekParagraph("back")
            : undefined,
          onSeekForward: player.canSeekParagraph
            ? () => void player.seekParagraph("forward")
            : undefined,
          onStopPlayback: handleStopPlayback,
          onResolvePromptBlock: providerRouteBlocked
            ? handleOpenProviderSettings
            : handleOpenSpeakingSettings,
          onSubmitTextMessage: handleSubmitTextMessage,
          onTextInputFocusChange: handleTextInputFocusChange,
          onTextMessageChange: handleTextMessageChange,
          orbProgressOverride: storePromoOrbPresentation,
          playbackPaused: player.isPlaybackPaused,
          promptBlockedActionEnabled,
          promptBlockedActionLabel: providerRouteBlocked
            ? t("setupGuideConnectProviderTitle")
            : kokoroPromptBlockActionLabel,
          promptBlockedMessage,
          readingProgress: player.readingProgress,
          readingProgressTiming: player.readingProgressTiming,
          recordingMaxMs: maxRecordingMs,
          recordingStartedAtMs,
          rtl: isRtl,
          phaseTimingProgress:
            phaseProgress?.phase === visualPhase ? phaseProgress : null,
          speechStartProgress: phaseProgress?.speechStart ?? null,
          statusTitle: statusDisplay.actionLabel,
          t,
          visualPhase,
          voiceInputUnavailableMessage,
        },
        transcript: {
          activeConversationId: activeConversation?.id ?? null,
          activeConversationBranch: activeConversation?.branch,
          conversationBranches: conversations,
          activeReplayMessageId,
          messages,
          onCopyMessage: (message) =>
            handleCopyMessage(formatMessageForCopy(message, language)),
          onEditMessage: isBusy
            ? undefined
            : (message, content) => editUserMessage(message.id, content),
          onBranchMessage: isBusy ? undefined : handleBranchMessage,
          onSelectBranchConversation: isBusy
            ? undefined
            : async (conversationId) => {
                await selectConversation(conversationId);
              },
          onOpenSpeakingSettings: handleOpenTranscriptSpeakingSettings,
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
          showUsageStats: runtimeSettings.showUsageStats,
          showWhenEmpty: true,
          t,
        },
      }}
      styleSheet={{
        canAutoRenameConversation: canGenerateTitle,
        hasOverrides: conversationSettingsHaveOverrides,
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
        onUseDefaults: resetConversationSettings,
      }}
      surfaceTransition={{
        label: t("pleaseWait"),
        visible: secondarySurfaceTransitionVisible,
      }}
      settingsModal={{
        archivedConversationCount,
        focusPage: settingsFocusPage,
        visible: settingsVisible,
        suspended: false,
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
        onOpenArchivedConversations: handleOpenArchivedConversations,
        onCreateAppDataBackup: handleCreateAppDataBackup,
        onRestoreAppDataBackup: handleRestoreAppDataBackup,
        conversationArchive,
        onClose: handleCloseSettings,
        onDismiss: handleSettingsDismiss,
      }}
      conversationDrawer={{
        archivedRevealRequestId: drawerArchivedRevealRequestId,
        // Feedback for drawer-born actions (auto-naming) renders inside the
        // drawer modal; the workspace toast layer sits underneath it.
        toast,
        onDismissToast: dismissToast,
        visible: drawerModalVisible,
        conversations,
        activeId: activeConversation?.id || null,
        onSearchConversations: searchConversations,
        onSelect: handleSelectConversation,
        onCanUseSessionDeviceAuth: async (id) => {
          try {
            return await canUnlockSessionWithDeviceAuth(id);
          } catch {
            return false;
          }
        },
        onLockSession: handleLockSession,
        onUnlockSession: authenticateLockedSession,
        onRemoveSessionLock: handleRemoveSessionLock,
        onCopyThread: handleCopyDrawerThread,
        onShareThread: handleShareDrawerThread,
        onRenameThread: handleRenameDrawerThread,
        onTogglePinned: handleTogglePinned,
        onToggleArchived: handleToggleArchived,
        onAutoName: handleGenerateTitleForConversation,
        onNewSession: () => {
          pendingImages.clearAttachments();
          void handleStartNewSession();
        },
        onDelete: handleDeleteConversation,
        onArchivedRevealHandled: handleArchivedRevealHandled,
        onClose: handleCloseConversationDrawer,
        onDismiss: handleConversationDrawerDismiss,
      }}
    />
  );
}
