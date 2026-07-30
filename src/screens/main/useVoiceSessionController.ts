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
import { useVoiceSessionKeepAwake } from "./voiceSession/useVoiceSessionKeepAwake";
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
  useVoiceSessionKeepAwake(
    isRecording ||
      (driveSession.autoContinueEnabled && driveSession.engaged),
  );

  useVoiceSessionAppState({
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
          driveSession.suspend();
        } else if (!isRecording && !isBusy && !playbackActive) {
          driveSession.engage();
        }
      }

      await standardPressHandlers.handleTogglePress();
    },
    [
      driveSession.engage,
      driveSession.suspend,
      isBusy,
      isRecording,
      playbackCanPause,
      player.isPlaybackPaused,
      player.isPlaying,
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
    await recorder.stopAmbientMonitoring?.();
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
    recorder,
    resetPipelineState,
    settings.sttMode,
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
    handleStopDriveSession: driveSession.handleStop,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  };
}
