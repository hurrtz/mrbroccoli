import { useCallback, useEffect, useRef, useState } from "react";

import { ReplayPhase } from "../../../hooks/useVoicePipeline";
import { recordDebugLogEvent } from "../../../services/debugLogCapture";
import { playNativeRecordingCue } from "../../../services/nativeWaveform";
import { getDriveCountdownCueAudioUri } from "../../../services/playbackCues";
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

interface UseDriveSessionVoiceActivityParams {
  ambientInputMetering: number | null;
  ambientMonitoring: boolean;
  audioRoute: string | null;
  autoContinueEnabled: boolean;
  engaged: boolean;
  inputMetering: number | null;
  inputMode: Settings["inputMode"];
  isBusy: boolean;
  isRecording: boolean;
  mainSurfaceVisible: boolean;
  playerIsPlaybackPaused: boolean;
  playerIsPlaying: boolean;
  replayPhase: ReplayPhase;
  showToast: ShowToastFn;
  startAmbientMonitoring?: () => Promise<boolean>;
  stopAmbientMonitoring?: () => Promise<boolean>;
  stopVoiceCapture: () => Promise<void>;
  t: TranslateFn;
}

export function useDriveSessionVoiceActivity({
  ambientInputMetering,
  ambientMonitoring,
  audioRoute,
  autoContinueEnabled,
  engaged,
  inputMetering,
  inputMode,
  isBusy,
  isRecording,
  mainSurfaceVisible,
  playerIsPlaybackPaused,
  playerIsPlaying,
  replayPhase,
  showToast,
  startAmbientMonitoring,
  stopAmbientMonitoring,
  stopVoiceCapture,
  t,
}: UseDriveSessionVoiceActivityParams) {
  const [silenceCountdownSeconds, setSilenceCountdownSeconds] =
    useState<number | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const voiceActivityRef = useRef<DriveVoiceActivityState | null>(null);
  const acousticProfileRef = useRef(createDriveAcousticProfile());
  const lastAcousticProfileLogAtRef = useRef(0);
  const lastLoggedNoiseFloorDbRef = useRef(
    acousticProfileRef.current.noiseFloorDb,
  );
  const autoSubmitInFlightRef = useRef(false);
  const lastCountdownCueRef = useRef<number | null>(null);

  const resetAcousticProfile = useCallback(() => {
    acousticProfileRef.current = createDriveAcousticProfile();
    lastLoggedNoiseFloorDbRef.current =
      acousticProfileRef.current.noiseFloorDb;
  }, []);

  useEffect(() => {
    if (inputMode !== "drive-session") {
      resetAcousticProfile();
    }
  }, [inputMode, resetAcousticProfile]);

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
      inputMode === "drive-session" &&
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
    lastLoggedNoiseFloorDbRef.current = updated.profile.noiseFloorDb;
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
    inputMode,
    isRecording,
    mainSurfaceVisible,
  ]);

  useEffect(() => {
    const active =
      inputMode === "drive-session" &&
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
      voiceActivityRef.current = createDriveVoiceActivityState(nowMs, {
        noiseFloorDb: acousticProfileRef.current.noiseFloorDb,
        speechLevelDb: acousticProfileRef.current.speechLevelDb,
      });
      setSilenceCountdownSeconds(null);
      setVoiceActive(false);
      recordDebugLogEvent({
        event: "drive-session-voice-activity-monitor-started",
        payload: {
          ...getDriveAcousticProfileDiagnostics(acousticProfileRef.current),
          countdownStartsAfterSpeech: true,
          silenceWindowMs: 10_000,
        },
      });
    }
  }, [
    autoContinueEnabled,
    engaged,
    inputMode,
    isRecording,
    mainSurfaceVisible,
  ]);

  useEffect(() => {
    const current = voiceActivityRef.current;
    if (current === null || typeof inputMetering !== "number") {
      return;
    }

    const nowMs = Date.now();
    const updated = updateDriveVoiceActivity(current, inputMetering, nowMs);
    voiceActivityRef.current = updated;
    acousticProfileRef.current = updateDriveAcousticProfileFromRecording(
      acousticProfileRef.current,
      {
        meteringDb: inputMetering,
        noiseFloorDb: updated.noiseFloorDb,
        nowMs,
        voiceActive: updated.voiceActive,
      },
    );
    setSilenceCountdownSeconds(getDriveCountdownSeconds(updated, nowMs));

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
      inputMode === "drive-session" &&
      autoContinueEnabled &&
      engaged &&
      mainSurfaceVisible &&
      !isRecording &&
      isBusy &&
      replayPhase === "idle" &&
      !playerIsPlaying &&
      !playerIsPlaybackPaused;

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
    inputMode,
    isBusy,
    isRecording,
    mainSurfaceVisible,
    playerIsPlaybackPaused,
    playerIsPlaying,
    replayPhase,
    startAmbientMonitoring,
    stopAmbientMonitoring,
  ]);

  useEffect(() => {
    if (
      !ambientMonitoring ||
      typeof ambientInputMetering !== "number" ||
      inputMode !== "drive-session" ||
      !autoContinueEnabled ||
      !engaged ||
      isRecording ||
      playerIsPlaying ||
      playerIsPlaybackPaused
    ) {
      return;
    }

    const nowMs = Date.now();
    const previousNoiseFloorDb = acousticProfileRef.current.noiseFloorDb;
    const updated = updateDriveAcousticProfileFromAmbient(
      acousticProfileRef.current,
      ambientInputMetering,
      nowMs,
    );
    acousticProfileRef.current = updated;

    const noiseFloorShiftDb = Math.abs(
      updated.noiseFloorDb - lastLoggedNoiseFloorDbRef.current,
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
        previousNoiseFloorDb: Math.round(previousNoiseFloorDb * 10) / 10,
        source: "ambient-monitor",
      },
    });
  }, [
    ambientInputMetering,
    ambientMonitoring,
    autoContinueEnabled,
    engaged,
    inputMode,
    isRecording,
    playerIsPlaybackPaused,
    playerIsPlaying,
  ]);

  useEffect(() => {
    if (
      inputMode !== "drive-session" ||
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
      const countdownSeconds = getDriveCountdownSeconds(activity, nowMs);
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
              payload: { countdownSeconds, error },
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
    inputMode,
    isRecording,
    mainSurfaceVisible,
    showToast,
    stopVoiceCapture,
    t,
  ]);

  return {
    resetAcousticProfile,
    silenceCountdownSeconds,
    voiceActive,
  };
}
