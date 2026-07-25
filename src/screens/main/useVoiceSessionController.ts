import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { recordDebugLogEvent } from "../../services/debugLogCapture";
import { PROVIDER_DEFAULT_STT_MODELS } from "../../constants/models";
import { getMaxRecordingMs } from "../../utils/recordingLimits";

import { useVoiceCaptureLifecycle } from "./voiceSession/useVoiceCaptureLifecycle";
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
  const suppressNextPressOutRef = useRef(false);
  const [driveSessionActive, setDriveSessionActive] = useState(false);
  const driveSessionActiveRef = useRef(false);
  const driveSessionGenerationRef = useRef(0);
  const driveSessionArmInFlightRef = useRef(false);
  const isBusyRef = useRef(isBusy);
  const isRecordingRef = useRef(isRecording);
  const mainSurfaceVisibleRef = useRef(mainSurfaceVisible);
  const replayPhaseRef = useRef(replayPhase);
  const playerIsPlayingRef = useRef(player.isPlaying);

  isBusyRef.current = isBusy;
  isRecordingRef.current = isRecording;
  mainSurfaceVisibleRef.current = mainSurfaceVisible;
  replayPhaseRef.current = replayPhase;
  playerIsPlayingRef.current = player.isPlaying;

  const updateDriveSessionActive = useCallback((active: boolean) => {
    driveSessionActiveRef.current = active;
    setDriveSessionActive(active);
  }, []);
  const playbackCanPause =
    player.isActivelyPlaying ?? player.isPlaying;
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
  // Auto-stop a long recording just before it would exceed the active STT
  // model's upload size limit (derived from the catalog), so a long thought is
  // sent rather than rejected. Adapts per provider/model.
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
  }, [settings.sttMode, settings.providerSttModels, sttProvider]);

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

  const playDriveSessionCue = useCallback(
    async (message: string) => {
      player.resetCancellation();
      player.speakText(message);
      await player.waitForDrain();
    },
    [player],
  );

  const armDriveSession = useCallback(async () => {
    if (
      !driveSessionActiveRef.current ||
      driveSessionArmInFlightRef.current ||
      !mainSurfaceVisibleRef.current ||
      isBusyRef.current ||
      isRecordingRef.current ||
      replayPhaseRef.current !== "idle" ||
      playerIsPlayingRef.current ||
      hasActiveVoiceCaptureNow()
    ) {
      return;
    }

    if (!ensureVoiceSessionReady()) {
      updateDriveSessionActive(false);
      return;
    }

    const generation = driveSessionGenerationRef.current;
    driveSessionArmInFlightRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-arm-requested",
      payload: { generation },
    });

    try {
      await playDriveSessionCue(t("driveSessionListeningCue"));
      if (
        !driveSessionActiveRef.current ||
        driveSessionGenerationRef.current !== generation ||
        !mainSurfaceVisibleRef.current ||
        isBusyRef.current ||
        replayPhaseRef.current !== "idle"
      ) {
        return;
      }

      await startVoiceCapture();
      recordDebugLogEvent({
        event: "drive-session-armed",
        payload: { generation },
      });
    } catch (error) {
      if (
        driveSessionActiveRef.current &&
        driveSessionGenerationRef.current === generation
      ) {
        updateDriveSessionActive(false);
        showToast(
          error instanceof Error ? error.message : t("couldntStartVoiceInput"),
          undefined,
          "danger",
        );
      }
    } finally {
      driveSessionArmInFlightRef.current = false;
    }
  }, [
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    playDriveSessionCue,
    showToast,
    startVoiceCapture,
    t,
    updateDriveSessionActive,
  ]);

  const deactivateDriveSession = useCallback(() => {
    if (!driveSessionActiveRef.current) {
      return;
    }

    driveSessionGenerationRef.current += 1;
    updateDriveSessionActive(false);
    recordDebugLogEvent({ event: "drive-session-deactivated" });
  }, [updateDriveSessionActive]);

  useVoiceSessionAppState({
    hasActiveVoiceCaptureNow,
    onBackground: deactivateDriveSession,
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
    if (settings.inputMode === "drive-session" && mainSurfaceVisible) {
      return;
    }

    deactivateDriveSession();
  }, [
    deactivateDriveSession,
    mainSurfaceVisible,
    settings.inputMode,
  ]);

  useEffect(() => {
    if (
      settings.inputMode !== "drive-session" ||
      !driveSessionActive ||
      !mainSurfaceVisible ||
      isBusy ||
      isRecording ||
      replayPhase !== "idle" ||
      player.isPlaying
    ) {
      return;
    }

    void armDriveSession();
  }, [
    armDriveSession,
    driveSessionActive,
    isBusy,
    isRecording,
    mainSurfaceVisible,
    player.isPlaying,
    replayPhase,
    settings.inputMode,
  ]);

  const togglePlaybackPause = useCallback(async () => {
    const updated = player.isPlaybackPaused
      ? await player.resumePlayback()
      : await player.pausePlayback();

    if (!updated) {
      showToast(t("pausePlaybackUnavailable"));
    }
  }, [player, showToast, t]);

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

  const handlePressIn = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-press-in",
      payload: {
        isBusy,
        isRecording,
        playerIsPlaying: player.isPlaying,
      },
    });

    if (playbackCanPause || player.isPlaybackPaused) {
      suppressNextPressOutRef.current = true;
      await togglePlaybackPause();
      return;
    }

    if (isBusy) {
      await cancelCurrentInteraction();
      return;
    }

    if (player.isPlaying) {
      await player.stopPlayback();
      return;
    }

    if (!ensureVoiceSessionReady()) {
      return;
    }

    try {
      await startVoiceCapture();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("couldntStartVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-start-failed",
        level: "error",
        payload: {
          message,
        },
      });
      showToast(message, undefined, "danger");
    }
  }, [
    cancelCurrentInteraction,
    ensureVoiceSessionReady,
    isBusy,
    playbackCanPause,
    player.isPlaybackPaused,
    player.isPlaying,
    player.stopPlayback,
    showToast,
    startVoiceCapture,
    t,
    togglePlaybackPause,
  ]);

  const handlePressOut = useCallback(async () => {
    recordDebugLogEvent({
      event: "voice-session-press-out",
      payload: {
        isRecording,
      },
    });

    if (suppressNextPressOutRef.current) {
      suppressNextPressOutRef.current = false;
      return;
    }

    try {
      await stopVoiceCapture();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("couldntProcessVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-stop-failed",
        level: "error",
        payload: {
          message,
        },
      });
      showToast(message, undefined, "danger");
    }
  }, [showToast, stopVoiceCapture, t]);

  const handleTogglePress = useCallback(async () => {
    if (settings.inputMode === "drive-session") {
      if (!driveSessionActiveRef.current) {
        if (!ensureVoiceSessionReady()) {
          return;
        }

        driveSessionGenerationRef.current += 1;
        updateDriveSessionActive(true);
        recordDebugLogEvent({ event: "drive-session-started" });
        return;
      }

      if (hasActiveVoiceCaptureNow()) {
        try {
          await stopVoiceCapture();
        } catch (error) {
          showToast(
            error instanceof Error
              ? error.message
              : t("couldntProcessVoiceInput"),
            undefined,
            "danger",
          );
        }
        return;
      }

      if (
        isBusy ||
        player.isPlaying ||
        player.isPlaybackPaused ||
        replayPhase !== "idle"
      ) {
        recordDebugLogEvent({ event: "drive-session-barge-in-requested" });
        await stopReplay();
        await cancelCurrentInteraction();
        return;
      }

      await armDriveSession();
      return;
    }

    recordDebugLogEvent({
      event: "voice-session-toggle-press",
      payload: {
        isBusy,
        isRecording,
        playerIsPlaying: player.isPlaying,
      },
    });

    if (
      !isRecording &&
      !player.isPlaying &&
      !isBusy &&
      !ensureVoiceSessionReady()
    ) {
      return;
    }

    if (playbackCanPause || player.isPlaybackPaused) {
      await togglePlaybackPause();
      return;
    }

    if (isBusy) {
      await cancelCurrentInteraction();
      return;
    }

    if (player.isPlaying) {
      await player.stopPlayback();
      return;
    }

    try {
      if (isRecording) {
        await stopVoiceCapture();
        return;
      }

      await startVoiceCapture();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isRecording
            ? t("couldntProcessVoiceInput")
            : t("couldntStartVoiceInput");
      recordDebugLogEvent({
        event: "voice-session-toggle-failed",
        level: "error",
        payload: {
          isRecording,
          message,
        },
      });
      showToast(message, undefined, "danger");
    }
  }, [
    cancelCurrentInteraction,
    armDriveSession,
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    isBusy,
    isRecording,
    playbackCanPause,
    player.isPlaybackPaused,
    player.isPlaying,
    player.stopPlayback,
    replayPhase,
    settings.inputMode,
    showToast,
    startVoiceCapture,
    stopVoiceCapture,
    t,
    togglePlaybackPause,
    stopReplay,
    updateDriveSessionActive,
  ]);

  const handleStopDriveSession = useCallback(async () => {
    const wasActive = driveSessionActiveRef.current;
    driveSessionGenerationRef.current += 1;
    updateDriveSessionActive(false);

    await cancelVoiceCapture().catch(() => undefined);
    await stopReplay().catch(() => undefined);
    await cancelCurrentInteraction().catch(() => undefined);

    if (wasActive && mainSurfaceVisibleRef.current) {
      await playDriveSessionCue(t("driveSessionStoppedCue")).catch(
        () => undefined,
      );
    }
  }, [
    cancelCurrentInteraction,
    cancelVoiceCapture,
    playDriveSessionCue,
    stopReplay,
    t,
    updateDriveSessionActive,
  ]);

  const handleContinueDriveSession = useCallback(async () => {
    if (!driveSessionActiveRef.current) {
      if (!ensureVoiceSessionReady()) {
        return;
      }

      driveSessionGenerationRef.current += 1;
      updateDriveSessionActive(true);
      return;
    }

    await armDriveSession();
  }, [
    armDriveSession,
    ensureVoiceSessionReady,
    updateDriveSessionActive,
  ]);

  const handleRepeatDriveReply = useCallback(async () => {
    const reply = lastCompletedReplyRef.current.trim();
    if (!reply) {
      showToast(t("noReplyToRepeatYet"));
      return;
    }

    const shouldResume =
      driveSessionActiveRef.current &&
      settings.inputMode === "drive-session" &&
      mainSurfaceVisibleRef.current;

    driveSessionGenerationRef.current += 1;
    updateDriveSessionActive(false);
    await cancelVoiceCapture().catch(() => undefined);
    await stopReplay().catch(() => undefined);
    await cancelCurrentInteraction().catch(() => undefined);

    try {
      await playReplyText(reply);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : t("couldntReplayReply"),
        undefined,
        "danger",
      );
    } finally {
      if (
        shouldResume &&
        settings.inputMode === "drive-session" &&
        mainSurfaceVisibleRef.current
      ) {
        driveSessionGenerationRef.current += 1;
        updateDriveSessionActive(true);
      }
    }
  }, [
    cancelCurrentInteraction,
    cancelVoiceCapture,
    lastCompletedReplyRef,
    playReplyText,
    settings.inputMode,
    showToast,
    stopReplay,
    t,
    updateDriveSessionActive,
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

    driveSessionGenerationRef.current += 1;
    updateDriveSessionActive(false);
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
    isRecording,
    lastCompletedReplyRef,
    player,
    resetPipelineState,
    settings.sttMode,
    updateDriveSessionActive,
  ]);

  return {
    driveSessionActive,
    driveSessionCanContinue:
      settings.inputMode === "drive-session" &&
      !isBusy &&
      !isRecording &&
      replayPhase === "idle" &&
      !player.isPlaying,
    driveSessionCanRepeat: Boolean(lastCompletedReplyRef.current.trim()),
    handleContinueDriveSession,
    handlePressIn,
    handlePressOut,
    handleRepeatDriveReply,
    handleStopDriveSession,
    handleStopInteraction: cancelCurrentInteraction,
    handleTogglePress,
    maxRecordingMs,
    resetVoiceSessionState,
  };
}
