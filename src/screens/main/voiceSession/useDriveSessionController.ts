import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { Settings } from "../../../types";
import { ReplayPhase } from "../../../hooks/useVoicePipeline";
import { ShowToastFn, TranslateFn } from "../shared";
import { AudioPlayerController } from "./types";

interface UseDriveSessionControllerParams {
  cancelCurrentInteraction: () => Promise<void>;
  cancelVoiceCapture: () => Promise<void>;
  ensureVoiceSessionReady: () => boolean;
  hasActiveVoiceCaptureNow: () => boolean;
  isBusy: boolean;
  isRecording: boolean;
  lastCompletedReplyRef: MutableRefObject<string>;
  mainSurfaceVisible: boolean;
  playReplyText: (text: string) => Promise<void>;
  player: AudioPlayerController;
  replayPhase: ReplayPhase;
  settings: Pick<Settings, "inputMode">;
  showToast: ShowToastFn;
  startVoiceCapture: () => Promise<void>;
  stopReplay: () => Promise<void>;
  stopVoiceCapture: () => Promise<void>;
  t: TranslateFn;
}

export function useDriveSessionController({
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
}: UseDriveSessionControllerParams) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const generationRef = useRef(0);
  const armInFlightRef = useRef(false);
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

  const updateActive = useCallback((nextActive: boolean) => {
    activeRef.current = nextActive;
    setActive(nextActive);
  }, []);

  const playCue = useCallback(
    async (message: string) => {
      player.resetCancellation();
      player.speakText(message);
      await player.waitForDrain();
    },
    [player],
  );

  const arm = useCallback(async () => {
    if (
      !activeRef.current ||
      armInFlightRef.current ||
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
      updateActive(false);
      return;
    }

    const generation = generationRef.current;
    armInFlightRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-arm-requested",
      payload: { generation },
    });

    try {
      await playCue(t("driveSessionListeningCue"));
      if (
        !activeRef.current ||
        generationRef.current !== generation ||
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
        activeRef.current &&
        generationRef.current === generation
      ) {
        updateActive(false);
        showToast(
          error instanceof Error ? error.message : t("couldntStartVoiceInput"),
          undefined,
          "danger",
        );
      }
    } finally {
      armInFlightRef.current = false;
    }
  }, [
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    playCue,
    showToast,
    startVoiceCapture,
    t,
    updateActive,
  ]);

  const deactivate = useCallback(() => {
    if (!activeRef.current) {
      return;
    }

    generationRef.current += 1;
    updateActive(false);
    recordDebugLogEvent({ event: "drive-session-deactivated" });
  }, [updateActive]);

  useEffect(() => {
    if (settings.inputMode === "drive-session" && mainSurfaceVisible) {
      return;
    }
    deactivate();
  }, [deactivate, mainSurfaceVisible, settings.inputMode]);

  useEffect(() => {
    if (
      settings.inputMode !== "drive-session" ||
      !active ||
      !mainSurfaceVisible ||
      isBusy ||
      isRecording ||
      replayPhase !== "idle" ||
      player.isPlaying
    ) {
      return;
    }
    void arm();
  }, [
    active,
    arm,
    isBusy,
    isRecording,
    mainSurfaceVisible,
    player.isPlaying,
    replayPhase,
    settings.inputMode,
  ]);

  const handleTogglePress = useCallback(async () => {
    if (!activeRef.current) {
      if (!ensureVoiceSessionReady()) {
        return;
      }
      generationRef.current += 1;
      updateActive(true);
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

    await arm();
  }, [
    arm,
    cancelCurrentInteraction,
    ensureVoiceSessionReady,
    hasActiveVoiceCaptureNow,
    isBusy,
    player.isPlaybackPaused,
    player.isPlaying,
    replayPhase,
    showToast,
    stopReplay,
    stopVoiceCapture,
    t,
    updateActive,
  ]);

  const handleStop = useCallback(async () => {
    const wasActive = activeRef.current;
    generationRef.current += 1;
    updateActive(false);

    await cancelVoiceCapture().catch(() => undefined);
    await stopReplay().catch(() => undefined);
    await cancelCurrentInteraction().catch(() => undefined);

    if (wasActive && mainSurfaceVisibleRef.current) {
      await playCue(t("driveSessionStoppedCue")).catch(() => undefined);
    }
  }, [
    cancelCurrentInteraction,
    cancelVoiceCapture,
    playCue,
    stopReplay,
    t,
    updateActive,
  ]);

  const handleContinue = useCallback(async () => {
    if (!activeRef.current) {
      if (!ensureVoiceSessionReady()) {
        return;
      }
      generationRef.current += 1;
      updateActive(true);
      return;
    }
    await arm();
  }, [arm, ensureVoiceSessionReady, updateActive]);

  const handleRepeat = useCallback(async () => {
    const reply = lastCompletedReplyRef.current.trim();
    if (!reply) {
      showToast(t("noReplyToRepeatYet"));
      return;
    }

    const shouldResume =
      activeRef.current &&
      settings.inputMode === "drive-session" &&
      mainSurfaceVisibleRef.current;

    generationRef.current += 1;
    updateActive(false);
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
        generationRef.current += 1;
        updateActive(true);
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
    updateActive,
  ]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    updateActive(false);
  }, [updateActive]);

  return {
    active,
    canContinue:
      settings.inputMode === "drive-session" &&
      !isBusy &&
      !isRecording &&
      replayPhase === "idle" &&
      !player.isPlaying,
    canRepeat: Boolean(lastCompletedReplyRef.current.trim()),
    deactivate,
    handleContinue,
    handleRepeat,
    handleStop,
    handleTogglePress,
    reset,
  };
}
