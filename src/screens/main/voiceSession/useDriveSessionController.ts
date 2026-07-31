import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ReplayPhase } from "../../../hooks/useVoicePipeline";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { playNativeRecordingCue } from "../../../services/nativeWaveform";
import {
  getDriveCountdownCueAudioUri,
  getDriveReadyCueAudioUri,
} from "../../../services/playbackCues";
import { Settings } from "../../../types";
import { ShowToastFn, TranslateFn } from "../shared";
import {
  createDriveAcousticProfile,
  getDriveAcousticProfileDiagnostics,
  updateDriveAcousticProfileFromAmbient,
  updateDriveAcousticProfileFromRecording,
  updateDriveAcousticProfileRoute,
} from "./driveAcousticProfile";
import {
  createDriveVoiceActivityState,
  DriveVoiceActivityState,
  getDriveCountdownSeconds,
  getDriveSilenceRemainingMs,
  getDriveVoiceActivityDiagnostics,
  updateDriveVoiceActivity,
} from "./driveVoiceActivity";
import { AudioPlayerController } from "./types";

interface UseDriveSessionControllerParams {
  ambientInputMetering?: number | null;
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
  lastCompletedReplyRef: MutableRefObject<string>;
  mainSurfaceVisible: boolean;
  playReplyText: (text: string) => Promise<void>;
  player: AudioPlayerController;
  replayPhase: ReplayPhase;
  settings: Pick<Settings, "inputMode">;
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
  lastCompletedReplyRef,
  mainSurfaceVisible,
  playReplyText,
  player,
  replayPhase,
  settings,
  showToast,
  startAmbientMonitoring,
  startVoiceCapture,
  stopAmbientMonitoring,
  stopVoiceCapture,
  stopReplay,
  t,
}: UseDriveSessionControllerParams) {
  const [autoContinueEnabled, setAutoContinueEnabled] = useState(
    settings.inputMode === "drive-session",
  );
  const [engaged, setEngaged] = useState(false);
  const [armRequested, setArmRequested] = useState(false);
  const [silenceCountdownSeconds, setSilenceCountdownSeconds] =
    useState<number | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const autoContinueEnabledRef = useRef(autoContinueEnabled);
  const engagedRef = useRef(false);
  const armRequestedRef = useRef(false);
  const pendingAutoRearmCueRef = useRef(false);
  const completedReplyVersionRef = useRef(completedReplyVersion);
  const previousIsBusyRef = useRef(isBusy);
  const previousInputModeRef = useRef(settings.inputMode);
  const generationRef = useRef(0);
  const armInFlightRef = useRef(false);
  const isBusyRef = useRef(isBusy);
  const isRecordingRef = useRef(isRecording);
  const mainSurfaceVisibleRef = useRef(mainSurfaceVisible);
  const replayPhaseRef = useRef(replayPhase);
  const playerIsPlayingRef = useRef(player.isPlaying);
  const playerIsPlaybackPausedRef = useRef(player.isPlaybackPaused);
  const voiceActivityRef = useRef<DriveVoiceActivityState | null>(
    null,
  );
  const acousticProfileRef = useRef(createDriveAcousticProfile());
  const lastAcousticProfileLogAtRef = useRef(0);
  const lastLoggedNoiseFloorDbRef = useRef(
    acousticProfileRef.current.noiseFloorDb,
  );
  const autoSubmitInFlightRef = useRef(false);
  const lastCountdownCueRef = useRef<number | null>(null);

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
            payload: { error },
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
      acousticProfileRef.current = createDriveAcousticProfile();
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
    const updated = updateDriveAcousticProfileRoute(
      acousticProfileRef.current,
      audioRoute,
    );
    acousticProfileRef.current = updated.profile;

    if (!updated.reset) {
      return;
    }

    const shouldRestartVoiceActivity =
      settings.inputMode === "drive-session" &&
      autoContinueEnabled &&
      engaged &&
      isRecording &&
      mainSurfaceVisible;
    voiceActivityRef.current = shouldRestartVoiceActivity
      ? createDriveVoiceActivityState(Date.now(), {
          noiseFloorDb: updated.profile.noiseFloorDb,
          speechLevelDb: updated.profile.speechLevelDb,
        })
      : null;
    lastLoggedNoiseFloorDbRef.current =
      updated.profile.noiseFloorDb;
    setSilenceCountdownSeconds(null);
    setVoiceActive(false);
    recordDebugLogEvent({
      event: "drive-session-acoustic-profile-route-reset",
      payload: {
        ...getDriveAcousticProfileDiagnostics(updated.profile),
      },
    });
  }, [
    audioRoute,
    autoContinueEnabled,
    engaged,
    isRecording,
    mainSurfaceVisible,
    settings.inputMode,
  ]);

  useEffect(() => {
    const active =
      settings.inputMode === "drive-session" &&
      autoContinueEnabled &&
      engaged &&
      isRecording &&
      mainSurfaceVisible;

    if (!active) {
      voiceActivityRef.current = null;
      autoSubmitInFlightRef.current = false;
      lastCountdownCueRef.current = null;
      setSilenceCountdownSeconds(null);
      setVoiceActive(false);
      return;
    }

    if (!voiceActivityRef.current) {
      const nowMs = Date.now();
      voiceActivityRef.current =
        createDriveVoiceActivityState(nowMs, {
          noiseFloorDb: acousticProfileRef.current.noiseFloorDb,
          speechLevelDb: acousticProfileRef.current.speechLevelDb,
        });
      setSilenceCountdownSeconds(null);
      setVoiceActive(false);
      recordDebugLogEvent({
        event: "drive-session-voice-activity-monitor-started",
        payload: {
          ...getDriveAcousticProfileDiagnostics(
            acousticProfileRef.current,
          ),
          countdownStartsAfterSpeech: true,
          silenceWindowMs: 10_000,
        },
      });
    }
  }, [
    autoContinueEnabled,
    engaged,
    isRecording,
    mainSurfaceVisible,
    settings.inputMode,
  ]);

  useEffect(() => {
    const current = voiceActivityRef.current;
    if (current === null || typeof inputMetering !== "number") {
      return;
    }

    const nowMs = Date.now();
    const updated = updateDriveVoiceActivity(
      current,
      inputMetering,
      nowMs,
    );
    voiceActivityRef.current = updated;
    acousticProfileRef.current =
      updateDriveAcousticProfileFromRecording(
        acousticProfileRef.current,
        {
          meteringDb: inputMetering,
          noiseFloorDb: updated.noiseFloorDb,
          nowMs,
          voiceActive: updated.voiceActive,
        },
      );
    setSilenceCountdownSeconds(
      getDriveCountdownSeconds(updated, nowMs),
    );

    if (
      !current.voiceActive &&
      current.aboveThresholdSamples > 0 &&
      !updated.voiceActive &&
      updated.aboveThresholdSamples === 0
    ) {
      recordDebugLogEvent({
        event: "drive-session-speech-candidate-rejected",
        payload: {
          ...getDriveVoiceActivityDiagnostics(updated),
          candidateDurationMs:
            current.candidateStartedAtMs === null
              ? 0
              : Math.max(0, nowMs - current.candidateStartedAtMs),
          candidatePeakDb: current.candidatePeakDb,
          candidateSamples: current.aboveThresholdSamples,
          candidateTroughDb: current.candidateTroughDb,
          meteringDb: inputMetering,
        },
      });
    }

    if (updated.voiceActive !== current.voiceActive) {
      setVoiceActive(updated.voiceActive);
      if (updated.voiceActive) {
        lastCountdownCueRef.current = null;
      }
      recordDebugLogEvent({
        event: updated.voiceActive
          ? "drive-session-speech-started"
          : "drive-session-speech-ended",
        payload: {
          hasDetectedSpeech: updated.hasDetectedSpeech,
          meteringDb: inputMetering,
          ...getDriveVoiceActivityDiagnostics(updated),
        },
      });
    }
  }, [inputMetering]);

  useEffect(() => {
    const shouldMonitorAmbient =
      settings.inputMode === "drive-session" &&
      autoContinueEnabled &&
      engaged &&
      mainSurfaceVisible &&
      !isRecording &&
      isBusy &&
      replayPhase === "idle" &&
      !player.isPlaying &&
      !player.isPlaybackPaused;

    if (shouldMonitorAmbient) {
      void startAmbientMonitoring?.().catch((error) => {
        recordDebugLogEvent({
          event: "drive-session-ambient-monitor-start-failed",
          level: "warn",
          payload: { error },
        });
      });
      return;
    }

    void stopAmbientMonitoring?.().catch((error) => {
      recordDebugLogEvent({
        event: "drive-session-ambient-monitor-stop-failed",
        level: "warn",
        payload: { error },
      });
    });
  }, [
    autoContinueEnabled,
    engaged,
    isBusy,
    isRecording,
    mainSurfaceVisible,
    player.isPlaybackPaused,
    player.isPlaying,
    replayPhase,
    settings.inputMode,
    startAmbientMonitoring,
    stopAmbientMonitoring,
  ]);

  useEffect(() => {
    if (
      !ambientMonitoring ||
      typeof ambientInputMetering !== "number" ||
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabled ||
      !engaged ||
      isRecording ||
      player.isPlaying ||
      player.isPlaybackPaused
    ) {
      return;
    }

    const nowMs = Date.now();
    const previousNoiseFloorDb =
      acousticProfileRef.current.noiseFloorDb;
    const updated = updateDriveAcousticProfileFromAmbient(
      acousticProfileRef.current,
      ambientInputMetering,
      nowMs,
    );
    acousticProfileRef.current = updated;

    const noiseFloorShiftDb = Math.abs(
      updated.noiseFloorDb -
        lastLoggedNoiseFloorDbRef.current,
    );
    if (
      noiseFloorShiftDb < 3 &&
      nowMs - lastAcousticProfileLogAtRef.current < 5_000
    ) {
      return;
    }

    lastAcousticProfileLogAtRef.current = nowMs;
    lastLoggedNoiseFloorDbRef.current = updated.noiseFloorDb;
    recordDebugLogEvent({
      event: "drive-session-acoustic-profile-updated",
      payload: {
        ...getDriveAcousticProfileDiagnostics(updated),
        meteringDb: ambientInputMetering,
        previousNoiseFloorDb:
          Math.round(previousNoiseFloorDb * 10) / 10,
        source: "ambient-monitor",
      },
    });
  }, [
    ambientInputMetering,
    ambientMonitoring,
    autoContinueEnabled,
    engaged,
    isRecording,
    player.isPlaybackPaused,
    player.isPlaying,
    settings.inputMode,
  ]);

  useEffect(() => {
    if (
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabled ||
      !engaged ||
      !isRecording ||
      !mainSurfaceVisible
    ) {
      return;
    }

    const tick = () => {
      const activity = voiceActivityRef.current;
      if (!activity || autoSubmitInFlightRef.current) {
        return;
      }

      const nowMs = Date.now();
      const countdownSeconds = getDriveCountdownSeconds(
        activity,
        nowMs,
      );
      setSilenceCountdownSeconds(countdownSeconds);

      if (countdownSeconds === null) {
        return;
      }

      if (
        countdownSeconds >= 1 &&
        countdownSeconds <= 3 &&
        lastCountdownCueRef.current !== countdownSeconds
      ) {
        lastCountdownCueRef.current = countdownSeconds;
        void getDriveCountdownCueAudioUri(4 - countdownSeconds)
          .then(async (cueUri) => {
            const played = await playNativeRecordingCue(cueUri);
            if (!played) {
              recordDebugLogEvent({
                event: "drive-session-countdown-cue-unavailable",
                level: "warn",
                payload: { countdownSeconds },
              });
            }
          })
          .catch((error) => {
            recordDebugLogEvent({
              event: "drive-session-countdown-cue-failed",
              level: "warn",
              payload: {
                countdownSeconds,
                error,
              },
            });
          });
      }

      if (getDriveSilenceRemainingMs(activity, nowMs) > 0) {
        return;
      }

      autoSubmitInFlightRef.current = true;
      recordDebugLogEvent({
        event: "drive-session-silence-auto-submit",
        payload: {
          hasDetectedSpeech: activity.hasDetectedSpeech,
          silenceWindowMs: 10_000,
        },
      });
      void stopVoiceCapture().catch((error) => {
        autoSubmitInFlightRef.current = false;
        recordDebugLogEvent({
          event: "drive-session-silence-auto-submit-failed",
          level: "error",
          payload: { error },
        });
        showToast(
          error instanceof Error
            ? error.message
            : t("couldntProcessVoiceInput"),
          undefined,
          "danger",
        );
      });
    };

    tick();
    const timer = setInterval(tick, 200);
    return () => clearInterval(timer);
  }, [
    autoContinueEnabled,
    engaged,
    isRecording,
    mainSurfaceVisible,
    settings.inputMode,
    showToast,
    stopVoiceCapture,
    t,
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
    const wasBusy = previousIsBusyRef.current;
    previousIsBusyRef.current = isBusy;

    if (
      !wasBusy ||
      isBusy ||
      settings.inputMode !== "drive-session" ||
      !autoContinueEnabledRef.current ||
      !engagedRef.current
    ) {
      return;
    }

    updateArmRequested(true);
    pendingAutoRearmCueRef.current = true;
    recordDebugLogEvent({
      event: "drive-session-pipeline-returned-idle",
      payload: {
        completedReplyVersion,
      },
    });
  }, [
    completedReplyVersion,
    isBusy,
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
    acousticProfileRef.current = createDriveAcousticProfile();
    lastLoggedNoiseFloorDbRef.current =
      acousticProfileRef.current.noiseFloorDb;
    void stopAmbientMonitoring?.();
  }, [
    stopAmbientMonitoring,
    updateArmRequested,
    updateEngaged,
  ]);

  return {
    autoContinueEnabled,
    canRepeat: Boolean(lastCompletedReplyRef.current.trim()),
    engaged,
    silenceCountdownSeconds,
    voiceActive,
    engage,
    handleContinue,
    handleRepeat,
    handleStop,
    reset,
    suspend,
  };
}
