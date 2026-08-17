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
import { ShowToastFn, TranslateFn } from "../shared";
import {
  createDriveSessionState,
  DriveSessionEvent,
  transitionDriveSessionState,
} from "./driveSessionStateMachine";
import { AudioPlayerController } from "./types";
import { useDriveSessionVoiceActivity } from "./useDriveSessionVoiceActivity";

interface UseDriveSessionControllerParams {
  ambientInputMetering?: number | null;
  ambientInputMeteringSampleId?: number;
  ambientMonitoring?: boolean;
  audioRoute?: string | null;
  cancelCurrentInteraction: () => Promise<void>;
  cancelVoiceCapture: () => Promise<void>;
  completedReplyVersion: number;
  ensureVoiceSessionReady: () => boolean;
  hasActiveVoiceCaptureNow: () => boolean;
  isBusy: boolean;
  isRecording: boolean;
  inputMetering?: number | null;
  inputMeteringSampleId?: number;
  lastCompletedReplyRef: MutableRefObject<string>;
  mainSurfaceVisible: boolean;
  playReplyText: (text: string) => Promise<void>;
  player: AudioPlayerController;
  replayPhase: ReplayPhase;
  showToast: ShowToastFn;
  startAmbientMonitoring?: () => Promise<boolean>;
  startVoiceCapture: () => Promise<void>;
  stopAmbientMonitoring?: () => Promise<boolean>;
  stopVoiceCapture: () => Promise<void>;
  stopReplay: () => Promise<void>;
  t: TranslateFn;
}

export function useDriveSessionController({
  ambientInputMetering = null,
  ambientInputMeteringSampleId = 0,
  ambientMonitoring = false,
  audioRoute = null,
  cancelCurrentInteraction,
  cancelVoiceCapture,
  completedReplyVersion,
  ensureVoiceSessionReady,
  hasActiveVoiceCaptureNow,
  isBusy,
  isRecording,
  inputMetering = null,
  inputMeteringSampleId = 0,
  lastCompletedReplyRef,
  mainSurfaceVisible,
  playReplyText,
  player,
  replayPhase,
  showToast,
  startAmbientMonitoring,
  startVoiceCapture,
  stopAmbientMonitoring,
  stopVoiceCapture,
  stopReplay,
  t,
}: UseDriveSessionControllerParams) {
  const [driveSessionState, setDriveSessionState] = useState(() =>
    createDriveSessionState(),
  );
  const { armRequested, autoContinueEnabled, engaged } = driveSessionState;
  const driveSessionStateRef = useRef(driveSessionState);
  const pendingAutoRearmCueRef = useRef(false);
  const completedReplyVersionRef = useRef(completedReplyVersion);
  const previousIsBusyRef = useRef(isBusy);
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

  const transition = useCallback((event: DriveSessionEvent) => {
    const nextState = transitionDriveSessionState(
      driveSessionStateRef.current,
      event,
    );
    driveSessionStateRef.current = nextState;
    setDriveSessionState(nextState);
  }, []);
  const { resetAcousticProfile, silenceCountdownSeconds, voiceActive } =
    useDriveSessionVoiceActivity({
      ambientInputMetering,
      ambientInputMeteringSampleId,
      ambientMonitoring,
      audioRoute,
      autoContinueEnabled,
      engaged,
      inputMetering,
      inputMeteringSampleId,
      isBusy,
      isRecording,
      mainSurfaceVisible,
      playerIsPlaybackPaused: player.isPlaybackPaused,
      playerIsPlaying: player.isPlaying,
      replayPhase,
      showToast,
      startAmbientMonitoring,
      stopAmbientMonitoring,
      stopVoiceCapture,
      t,
    });

  const arm = useCallback(async () => {
    if (
      !driveSessionStateRef.current.autoContinueEnabled ||
      !driveSessionStateRef.current.engaged ||
      !driveSessionStateRef.current.armRequested ||
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
      transition({ type: "disengage" });
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
            driveSessionStateRef.current.autoContinueEnabled &&
            driveSessionStateRef.current.engaged &&
            generationRef.current === generation
          ) {
            player.enqueueAudio(cueUri);
            await player.waitForDrain();
          }
        } catch (error) {
          recordDebugLogEvent({
            event: "drive-session-ready-cue-failed",
            level: "warn",
            payload: { error },
          });
        }
      }

      if (
        !driveSessionStateRef.current.autoContinueEnabled ||
        !driveSessionStateRef.current.engaged ||
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

      transition({ type: "arm-consumed" });
      await startVoiceCapture();
      if (
        !driveSessionStateRef.current.autoContinueEnabled ||
        !driveSessionStateRef.current.engaged ||
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
        driveSessionStateRef.current.autoContinueEnabled &&
        driveSessionStateRef.current.engaged &&
        generationRef.current === generation
      ) {
        transition({ type: "disengage" });
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
    showToast,
    startVoiceCapture,
    t,
    transition,
  ]);

  const enable = useCallback(() => {
    if (driveSessionStateRef.current.autoContinueEnabled) {
      return;
    }

    if (!ensureVoiceSessionReady()) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    transition({ type: "resume" });
    recordDebugLogEvent({ event: "hands-free-enabled" });
  }, [ensureVoiceSessionReady, transition]);

  const suspend = useCallback(() => {
    if (!driveSessionStateRef.current.engaged) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    transition({ type: "suspend" });
    recordDebugLogEvent({ event: "drive-session-suspended" });
  }, [transition]);

  useEffect(() => {
    if (!mainSurfaceVisible) {
      suspend();
      return;
    }

    if (
      driveSessionStateRef.current.autoContinueEnabled &&
      !driveSessionStateRef.current.engaged
    ) {
      transition({ type: "engage" });
    }
  }, [mainSurfaceVisible, suspend, transition]);

  useEffect(() => {
    const previousReplyVersion = completedReplyVersionRef.current;
    completedReplyVersionRef.current = completedReplyVersion;

    if (
      completedReplyVersion === previousReplyVersion ||
      !driveSessionStateRef.current.autoContinueEnabled ||
      !driveSessionStateRef.current.engaged
    ) {
      return;
    }

    transition({ type: "arm-requested" });
    pendingAutoRearmCueRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-reply-completed",
      payload: { completedReplyVersion },
    });
  }, [completedReplyVersion, transition]);

  useEffect(() => {
    const wasBusy = previousIsBusyRef.current;
    previousIsBusyRef.current = isBusy;

    if (
      !wasBusy ||
      isBusy ||
      !driveSessionStateRef.current.autoContinueEnabled ||
      !driveSessionStateRef.current.engaged
    ) {
      return;
    }

    transition({ type: "arm-requested" });
    pendingAutoRearmCueRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-pipeline-returned-idle",
      payload: {
        completedReplyVersion,
      },
    });
  }, [completedReplyVersion, isBusy, transition]);

  useEffect(() => {
    if (
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
  ]);

  const disable = useCallback(() => {
    if (!driveSessionStateRef.current.autoContinueEnabled) {
      return;
    }

    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    transition({ type: "pause" });
    resetAcousticProfile();
    void stopAmbientMonitoring?.();
    recordDebugLogEvent({ event: "hands-free-disabled" });
  }, [resetAcousticProfile, stopAmbientMonitoring, transition]);

  const toggle = useCallback(() => {
    if (driveSessionStateRef.current.autoContinueEnabled) {
      disable();
    } else {
      enable();
    }
  }, [disable, enable]);

  const requestNextTurn = useCallback(() => {
    if (
      !driveSessionStateRef.current.autoContinueEnabled ||
      !driveSessionStateRef.current.engaged
    ) {
      return;
    }
    pendingAutoRearmCueRef.current = false;
    transition({ type: "arm-requested" });
  }, [transition]);

  const handleRepeat = useCallback(async () => {
    const reply = lastCompletedReplyRef.current.trim();
    if (!reply) {
      showToast(t("noReplyToRepeatYet"));
      return;
    }

    const shouldResume =
      driveSessionStateRef.current.autoContinueEnabled &&
      mainSurfaceVisibleRef.current;

    generationRef.current += 1;
    transition({ type: "suspend" });
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
        driveSessionStateRef.current.autoContinueEnabled &&
        mainSurfaceVisibleRef.current
      ) {
        generationRef.current += 1;
        pendingAutoRearmCueRef.current = true;
        transition({ type: "resume" });
      }
    }
  }, [
    cancelCurrentInteraction,
    cancelVoiceCapture,
    lastCompletedReplyRef,
    playReplyText,
    showToast,
    stopReplay,
    t,
    transition,
  ]);

  const reset = useCallback(() => {
    generationRef.current += 1;
    pendingAutoRearmCueRef.current = false;
    transition({ type: "pause" });
    resetAcousticProfile();
    void stopAmbientMonitoring?.();
  }, [resetAcousticProfile, stopAmbientMonitoring, transition]);

  return {
    autoContinueEnabled,
    canRepeat: Boolean(lastCompletedReplyRef.current.trim()),
    engaged,
    silenceCountdownSeconds,
    voiceActive,
    disable,
    enable,
    handleRepeat,
    reset,
    requestNextTurn,
    suspend,
    toggle,
  };
}
