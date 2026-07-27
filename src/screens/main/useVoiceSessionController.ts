import { useCallback, useEffect, useMemo } from "react";
import { PROVIDER_DEFAULT_STT_MODELS } from "../../constants/models";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { getMaxRecordingMs } from "../../utils/recordingLimits";
import { useDriveSessionController } from "./voiceSession/useDriveSessionController";
import { useVoiceCaptureLifecycle } from "./voiceSession/useVoiceCaptureLifecycle";
import { useVoiceInputPressHandlers } from "./voiceSession/useVoiceInputPressHandlers";
import { useVoiceSessionAppState } from "./voiceSession/useVoiceSessionAppState";
import { useVoiceSessionCancellation } from "./voiceSession/useVoiceSessionCancellation";
import { useVoiceSessionGuards } from "./voiceSession/useVoiceSessionGuards";
import type { UseVoiceSessionControllerParams } from "./voiceSession/types";

export function useVoiceSessionController({
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
}: UseVoiceSessionControllerParams) {
  const playbackCanPause = player.isActivelyPlaying ?? player.isPlaying;
  const { cancelCurrentInteraction, resetPipelineState } =
    useVoiceSessionCancellation({
      abortRef,
      player,
      setPipelinePhase,
      setStreamingText,
    });
  const ensureVoiceSessionReady = useVoiceSessionGuards({
    availableSttProviders,
    availableTtsProviders,
    nativeSttAvailable: nativeStt.isAvailable,
    providerApiKey,
    providerLabel,
    settings,
    showToast,
    sttApiKey,
    sttProvider,
    t,
    ttsApiKey,
    ttsProvider,
  });
  const maxRecordingMs = useMemo(() => {
    const sttModel = sttProvider
      ? settings.providerSttModels?.[sttProvider] ||
        PROVIDER_DEFAULT_STT_MODELS[sttProvider] ||
        ""
      : "";
    return getMaxRecordingMs({
      sttMode: settings.sttMode,
      sttProvider,
      sttModel,
    });
  }, [settings.providerSttModels, settings.sttMode, sttProvider]);
  const {
    cancelVoiceCapture,
    hasActiveVoiceCaptureNow,
    startVoiceCapture,
    stopVoiceCapture,
  } = useVoiceCaptureLifecycle({
    isRecording,
    maxRecordingMs,
    nativeStt,
    onCaptureStopAbandoned: () => setPipelinePhase("idle"),
    onCaptureStopStarted: () => setPipelinePhase("transcribing"),
    player,
    processCapturedVoiceTurn: handleVoiceCaptureDone,
    recorder,
    showToast,
    sttMode: settings.sttMode,
    t,
  });

  const togglePlaybackPause = useCallback(async () => {
    const updated = player.isPlaybackPaused
      ? await player.resumePlayback()
      : await player.pausePlayback();
    if (!updated) {
      showToast(t("pausePlaybackUnavailable"));
    }
  }, [player, showToast, t]);

  const standardPressHandlers = useVoiceInputPressHandlers({
    cancelCurrentInteraction,
    ensureVoiceSessionReady,
    isBusy,
    isRecording,
    playbackCanPause,
    player,
    showToast,
    startVoiceCapture,
    stopVoiceCapture,
    t,
    togglePlaybackPause,
  });
  const driveSession = useDriveSessionController({
    cancelCurrentInteraction,
    cancelVoiceCapture,
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    isBusy,
    isRecording,
    lastCompletedReplyRef,
    mainSurfaceVisible,
    playReplyText,
    player,
    replayPhase,
    settings,
    showToast,
    startVoiceCapture,
    stopReplay,
    stopVoiceCapture,
    t,
  });

  useVoiceSessionAppState({
    hasActiveVoiceCaptureNow,
    onBackground: driveSession.deactivate,
    onBackgroundSubmitError: (error) => {
      showToast(
        error instanceof Error ? error.message : t("couldntProcessVoiceInput"),
        undefined,
        "danger",
      );
    },
    stopVoiceCapture,
  });

  useEffect(() => {
    if (!nativeStt.lastError) {
      return;
    }
    showToast(nativeStt.lastError, undefined, "danger");
    nativeStt.clearLastError();
  }, [nativeStt, showToast]);

  useEffect(() => {
    if (!recorder.lastError) {
      return;
    }
    showToast(recorder.lastError, undefined, "danger");
    recorder.clearLastError();
  }, [recorder, showToast]);

  const handleTogglePress = useCallback(
    () =>
      settings.inputMode === "drive-session"
        ? driveSession.handleTogglePress()
        : standardPressHandlers.handleTogglePress(),
    [
      driveSession.handleTogglePress,
      settings.inputMode,
      standardPressHandlers.handleTogglePress,
    ],
  );

  const resetVoiceSessionState = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-reset-requested",
      payload: {
        isRecording,
        playerIsPlaying: player.isPlaying,
        sttMode: settings.sttMode,
      },
    });

    driveSession.reset();
    resetPipelineState();
    lastCompletedReplyRef.current = "";
    await player.stopPlayback();
    try {
      await cancelVoiceCapture();
    } catch {
      // Ignore recorder cleanup failures while switching conversations.
    }
  }, [
    cancelVoiceCapture,
    driveSession.reset,
    isRecording,
    lastCompletedReplyRef,
    player,
    resetPipelineState,
    settings.sttMode,
  ]);

  return {
    driveSessionActive: driveSession.active,
    driveSessionCanContinue: driveSession.canContinue,
    driveSessionCanRepeat: driveSession.canRepeat,
    handleContinueDriveSession: driveSession.handleContinue,
    handlePressIn: standardPressHandlers.handlePressIn,
    handlePressOut: standardPressHandlers.handlePressOut,
    handleRepeatDriveReply: driveSession.handleRepeat,
    handleStopDriveSession: driveSession.handleStop,
    handleStopInteraction: cancelCurrentInteraction,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  };
}
