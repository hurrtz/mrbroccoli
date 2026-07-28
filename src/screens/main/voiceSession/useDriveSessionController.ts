import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ReplayPhase } from "../../../hooks/useVoicePipeline";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { getDriveReadyCueAudioUri } from "../../../services/playbackCues";
import { Settings } from "../../../types";
import { ShowToastFn, TranslateFn } from "../shared";
import { AudioPlayerController } from "./types";

interface UseDriveSessionControllerParams {
  cancelCurrentInteraction: () => Promise<void>;
  cancelVoiceCapture: () => Promise<void>;
  completedReplyVersion: number;
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
  t: TranslateFn;
}

export function useDriveSessionController({
  cancelCurrentInteraction,
  cancelVoiceCapture,
  completedReplyVersion,
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
  t,
}: UseDriveSessionControllerParams) {
  const [autoContinueEnabled, setAutoContinueEnabled] = useState(
    settings.inputMode === "drive-session",
  );
  const [engaged, setEngaged] = useState(false);
  const [armRequested, setArmRequested] = useState(false);
  const autoContinueEnabledRef = useRef(autoContinueEnabled);
  const engagedRef = useRef(false);
  const armRequestedRef = useRef(false);
  const pendingAutoRearmCueRef = useRef(false);
  const completedReplyVersionRef = useRef(completedReplyVersion);
  const previousInputModeRef = useRef(settings.inputMode);
  const generationRef = useRef(0);
  const armInFlightRef = useRef(false);
  const isBusyRef = useRef(isBusy);
  const isRecordingRef = useRef(isRecording);
  const mainSurfaceVisibleRef = useRef(mainSurfaceVisible);
  const replayPhaseRef = useRef(replayPhase);
  const playerIsPlayingRef = useRef(player.isPlaying);
  const playerIsPlaybackPausedRef = useRef(player.isPlaybackPaused);

  isBusyRef.current = isBusy;
  isRecordingRef.current = isRecording;
  mainSurfaceVisibleRef.current = mainSurfaceVisible;
  replayPhaseRef.current = replayPhase;
  playerIsPlayingRef.current = player.isPlaying;
  playerIsPlaybackPausedRef.current = player.isPlaybackPaused;

  const updateAutoContinueEnabled = useCallback((enabled: boolean) => {
    autoContinueEnabledRef.current = enabled;
    setAutoContinueEnabled(enabled);
  }, []);

  const updateEngaged = useCallback((nextEngaged: boolean) => {
    engagedRef.current = nextEngaged;
    setEngaged(nextEngaged);
  }, []);

  const updateArmRequested = useCallback((requested: boolean) => {
    armRequestedRef.current = requested;
    setArmRequested(requested);
  }, []);

  const arm = useCallback(async () => {
    if (
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabledRef.current ||
      !engagedRef.current ||
      !armRequestedRef.current ||
      armInFlightRef.current ||
      !mainSurfaceVisibleRef.current ||
      isBusyRef.current ||
      isRecordingRef.current ||
      replayPhaseRef.current !== "idle" ||
      playerIsPlayingRef.current ||
      playerIsPlaybackPausedRef.current ||
      hasActiveVoiceCaptureNow()
    ) {
      return;
    }

    if (!ensureVoiceSessionReady()) {
      updateEngaged(false);
      return;
    }

    const generation = generationRef.current;
    armInFlightRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-arm-requested",
      payload: {
        generation,
        withReadyCue: pendingAutoRearmCueRef.current,
      },
    });

    try {
      if (pendingAutoRearmCueRef.current) {
        pendingAutoRearmCueRef.current = false;

        try {
          const cueUri = await getDriveReadyCueAudioUri();

          if (
            autoContinueEnabledRef.current &&
            engagedRef.current &&
            generationRef.current === generation
          ) {
            player.enqueueAudio(cueUri);
            await player.waitForDrain();
          }
        } catch (error) {
          recordDebugLogEvent({
            event: "drive-session-ready-cue-failed",
            level: "warn",
            payload: {
              message:
                error instanceof Error ? error.message : String(error),
            },
          });
        }
      }

      if (
        !autoContinueEnabledRef.current ||
        !engagedRef.current ||
        generationRef.current !== generation ||
        !mainSurfaceVisibleRef.current ||
        isBusyRef.current ||
        isRecordingRef.current ||
        replayPhaseRef.current !== "idle" ||
        playerIsPlaybackPausedRef.current ||
        hasActiveVoiceCaptureNow()
      ) {
        return;
      }

      updateArmRequested(false);
      await startVoiceCapture();
      if (
        !autoContinueEnabledRef.current ||
        !engagedRef.current ||
        generationRef.current !== generation
      ) {
        return;
      }
      recordDebugLogEvent({
        event: "drive-session-armed",
        payload: { generation },
      });
    } catch (error) {
      if (
        autoContinueEnabledRef.current &&
        engagedRef.current &&
        generationRef.current === generation
      ) {
        updateEngaged(false);
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
    player,
    settings.inputMode,
    showToast,
    startVoiceCapture,
    t,
    updateArmRequested,
    updateEngaged,
  ]);

  const engage = useCallback(() => {
    if (
      settings.inputMode !== "drive-session" ||
      engagedRef.current
    ) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    updateEngaged(true);
    recordDebugLogEvent({ event: "drive-session-engaged" });
  }, [settings.inputMode, updateEngaged]);

  const suspend = useCallback(() => {
    if (!engagedRef.current) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    updateArmRequested(false);
    updateEngaged(false);
    recordDebugLogEvent({ event: "drive-session-suspended" });
  }, [updateArmRequested, updateEngaged]);

  useEffect(() => {
    const previousInputMode = previousInputModeRef.current;
    previousInputModeRef.current = settings.inputMode;

    if (settings.inputMode !== "drive-session") {
      suspend();
      return;
    }

    if (previousInputMode !== "drive-session") {
      generationRef.current += 1;
      updateArmRequested(false);
      updateEngaged(false);
      updateAutoContinueEnabled(true);
      recordDebugLogEvent({ event: "drive-session-mode-entered" });
    }
  }, [
    settings.inputMode,
    suspend,
    updateAutoContinueEnabled,
    updateArmRequested,
    updateEngaged,
  ]);

  useEffect(() => {
    if (mainSurfaceVisible) {
      return;
    }
    suspend();
  }, [mainSurfaceVisible, suspend]);

  useEffect(() => {
    const previousReplyVersion = completedReplyVersionRef.current;
    completedReplyVersionRef.current = completedReplyVersion;

    if (
      completedReplyVersion === previousReplyVersion ||
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabledRef.current ||
      !engagedRef.current
    ) {
      return;
    }

    updateArmRequested(true);
    pendingAutoRearmCueRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-reply-completed",
      payload: { completedReplyVersion },
    });
  }, [
    completedReplyVersion,
    settings.inputMode,
    updateArmRequested,
  ]);

  useEffect(() => {
    if (
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabled ||
      !engaged ||
      !armRequested ||
      !mainSurfaceVisible ||
      isBusy ||
      isRecording ||
      replayPhase !== "idle" ||
      player.isPlaying ||
      player.isPlaybackPaused
    ) {
      return;
    }
    void arm();
  }, [
    arm,
    armRequested,
    autoContinueEnabled,
    engaged,
    isBusy,
    isRecording,
    mainSurfaceVisible,
    player.isPlaybackPaused,
    player.isPlaying,
    replayPhase,
    settings.inputMode,
  ]);

  const handleStop = useCallback(() => {
    if (!autoContinueEnabledRef.current) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    updateArmRequested(false);
    updateAutoContinueEnabled(false);
    recordDebugLogEvent({ event: "drive-session-auto-paused" });
  }, [updateArmRequested, updateAutoContinueEnabled]);

  const handleContinue = useCallback(() => {
    if (!ensureVoiceSessionReady()) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    updateAutoContinueEnabled(true);
    updateEngaged(true);
    updateArmRequested(true);
    recordDebugLogEvent({ event: "drive-session-auto-resumed" });
  }, [
    ensureVoiceSessionReady,
    updateAutoContinueEnabled,
    updateArmRequested,
    updateEngaged,
  ]);

  const handleRepeat = useCallback(async () => {
    const reply = lastCompletedReplyRef.current.trim();
    if (!reply) {
      showToast(t("noReplyToRepeatYet"));
      return;
    }

    const shouldResume =
      autoContinueEnabledRef.current &&
      settings.inputMode === "drive-session" &&
      mainSurfaceVisibleRef.current;

    generationRef.current += 1;
    updateArmRequested(false);
    updateEngaged(false);
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
        autoContinueEnabledRef.current &&
        settings.inputMode === "drive-session" &&
        mainSurfaceVisibleRef.current
      ) {
        generationRef.current += 1;
        pendingAutoRearmCueRef.current = true;
        updateEngaged(true);
        updateArmRequested(true);
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
    updateArmRequested,
    updateEngaged,
  ]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    updateArmRequested(false);
    updateEngaged(false);
  }, [updateArmRequested, updateEngaged]);

  return {
    autoContinueEnabled,
    canRepeat: Boolean(lastCompletedReplyRef.current.trim()),
    engage,
    handleContinue,
    handleRepeat,
    handleStop,
    reset,
    suspend,
  };
}
