import { useCallback, useEffect, useMemo } from "react";
import { PROVIDER_DEFAULT_STT_MODELS } from "../../constants/models";
import { setBackgroundVoiceTurnActive } from "../../services/backgroundVoiceTurn";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { getMaxRecordingMs } from "../../utils/recordingLimits";
import { useDriveSessionController } from "./voiceSession/useDriveSessionController";
import { useVoiceCaptureLifecycle } from "./voiceSession/useVoiceCaptureLifecycle";
import { useVoiceInputPressHandlers } from "./voiceSession/useVoiceInputPressHandlers";
import { useVoiceSessionAppState } from "./voiceSession/useVoiceSessionAppState";
import { useVoiceSessionCancellation } from "./voiceSession/useVoiceSessionCancellation";
import { useVoiceSessionGuards } from "./voiceSession/useVoiceSessionGuards";
import { useVoiceSessionKeepAwake } from "./voiceSession/useVoiceSessionKeepAwake";
import { useVoiceRemoteControls } from "./voiceSession/useVoiceRemoteControls";
import type { UseVoiceSessionControllerParams } from "./voiceSession/types";

export function useVoiceSessionController({
  abortRef,
  availableSttProviders,
  availableTtsProviders,
  completedReplyVersion,
  handleVoiceCaptureDone,
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
  settings,
  showToast,
  sttApiKey,
  sttProvider,
  t,
  ttsApiKey,
  ttsProvider,
  stopReplay,
}: UseVoiceSessionControllerParams) {
  const playbackCanPause =
    Boolean(player.isActivelyPlaying) || player.isPlaying;
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
    promptSubmissionBlockMessage,
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
    allowBackgroundStart:
      settings.inputMode === "drive-session" &&
      settings.sttMode === "provider",
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
  const startVoiceCaptureAfterAmbientStop = useCallback(async () => {
    await recorder.stopAmbientMonitoring?.();
    await startVoiceCapture();
  }, [recorder, startVoiceCapture]);

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
    startVoiceCapture: startVoiceCaptureAfterAmbientStop,
    stopVoiceCapture,
    t,
    togglePlaybackPause,
  });
  const driveSession = useDriveSessionController({
    cancelCurrentInteraction,
    cancelVoiceCapture,
    completedReplyVersion,
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    isBusy,
    isRecording,
    ambientInputMetering: recorder.ambientInputMetering,
    ambientMonitoring: recorder.ambientMonitoring ?? false,
    audioRoute: recorder.audioRoute,
    inputMetering:
      settings.sttMode === "native"
        ? nativeStt.inputMetering
        : recorder.inputMetering,
    lastCompletedReplyRef,
    mainSurfaceVisible,
    playReplyText,
    player,
    replayPhase,
    settings,
    showToast,
    startAmbientMonitoring: recorder.startAmbientMonitoring,
    startVoiceCapture: startVoiceCaptureAfterAmbientStop,
    stopAmbientMonitoring: recorder.stopAmbientMonitoring,
    stopVoiceCapture,
    stopReplay,
    t,
  });
  const {
    engage: engageDriveSession,
    handleStop: stopDriveSession,
    reset: resetDriveSession,
    suspend: suspendDriveSession,
  } = driveSession;
  const { handleTogglePress: handleStandardTogglePress } =
    standardPressHandlers;
  const stopAmbientMonitoring = recorder.stopAmbientMonitoring;
  const stopPlayback = player.stopPlayback;
  useVoiceRemoteControls({
    canRepeat: driveSession.canRepeat,
    driveActive:
      driveSession.autoContinueEnabled && driveSession.engaged,
    driveEnabled:
      driveSession.autoContinueEnabled && driveSession.engaged,
    isRecording,
    onContinueDrive: driveSession.handleContinue,
    onPauseDrive: driveSession.handleStop,
    onRepeat: driveSession.handleRepeat,
    onStopRecording: stopVoiceCapture,
    player,
    t,
  });
  useVoiceSessionKeepAwake(
    isRecording ||
      (driveSession.autoContinueEnabled && driveSession.engaged),
  );

  const allowBackgroundDriveSession =
    settings.inputMode === "drive-session" &&
    settings.sttMode === "provider" &&
    driveSession.autoContinueEnabled &&
    driveSession.engaged;
  const backgroundVoiceSessionActive =
    isBusy || isRecording || allowBackgroundDriveSession;

  useEffect(() => {
    const available = setBackgroundVoiceTurnActive(
      backgroundVoiceSessionActive,
    );
    recordDebugLogEvent({
      event: backgroundVoiceSessionActive
        ? "voice-session-background-support-armed"
        : "voice-session-background-support-released",
      payload: { available },
    });

    return () => {
      if (backgroundVoiceSessionActive) {
        setBackgroundVoiceTurnActive(false);
      }
    };
  }, [backgroundVoiceSessionActive]);

  useVoiceSessionAppState({
    allowBackgroundCapture: allowBackgroundDriveSession,
    hasActiveVoiceCaptureNow,
    onBackground: driveSession.suspend,
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
    async () => {
      if (settings.inputMode === "drive-session") {
        const playbackActive =
          playbackCanPause ||
          player.isPlaybackPaused ||
          player.isPlaying;

        if (!isRecording && isBusy && !playbackActive) {
          suspendDriveSession();
        } else if (!isRecording && !isBusy && !playbackActive) {
          engageDriveSession();
        }
      }

      await handleStandardTogglePress();
    },
    [
      engageDriveSession,
      handleStandardTogglePress,
      isBusy,
      isRecording,
      playbackCanPause,
      player.isPlaybackPaused,
      player.isPlaying,
      settings.inputMode,
      suspendDriveSession,
    ],
  );

  const handleStopPlayback = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-playback-stop-requested",
      payload: {
        inputMode: settings.inputMode,
        playbackPaused: player.isPlaybackPaused,
        replayPhase,
      },
    });

    if (settings.inputMode === "drive-session") {
      stopDriveSession();
    }
    if (replayPhase !== "idle") {
      await stopReplay().catch(() => undefined);
    }
    await cancelCurrentInteraction();
  }, [
    cancelCurrentInteraction,
    player.isPlaybackPaused,
    replayPhase,
    settings.inputMode,
    stopDriveSession,
    stopReplay,
  ]);

  const resetVoiceSessionState = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-reset-requested",
      payload: {
        isRecording,
        playerIsPlaying: player.isPlaying,
        sttMode: settings.sttMode,
      },
    });

    resetDriveSession();
    resetPipelineState();
    lastCompletedReplyRef.current = "";
    await stopAmbientMonitoring?.();
    await stopPlayback();
    try {
      await cancelVoiceCapture();
    } catch {
      // Ignore recorder cleanup failures while switching conversations.
    }
  }, [
    cancelVoiceCapture,
    isRecording,
    lastCompletedReplyRef,
    player.isPlaying,
    resetDriveSession,
    resetPipelineState,
    settings.sttMode,
    stopAmbientMonitoring,
    stopPlayback,
  ]);

  return {
    driveAutoContinueEnabled: driveSession.autoContinueEnabled,
    driveSessionCanRepeat: driveSession.canRepeat,
    driveSilenceCountdownSeconds:
      driveSession.silenceCountdownSeconds,
    driveVoiceActive: driveSession.voiceActive,
    handleContinueDriveSession: driveSession.handleContinue,
    handlePressIn: standardPressHandlers.handlePressIn,
    handlePressOut: standardPressHandlers.handlePressOut,
    handleRepeatDriveReply: driveSession.handleRepeat,
    handleStopPlayback,
    handleStopDriveSession: driveSession.handleStop,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  };
}
