import React from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";

import { OrbSatellite } from "../../design-system/OrbSatellite";
import { VoiceOrb } from "../../design-system/VoiceOrb";
import { WorkspaceStatusLine } from "../../design-system/WorkspaceStatusLine";
import type { Colors } from "../../theme/colors";
import type {
  InputMode,
  VoicePhaseProgress,
  VoiceTimingProgress,
  VoiceVisualPhase,
} from "../../types";
import { getVoiceEta } from "../../utils/voiceEta";
import { getOrbProgress, getRecordingProgress } from "./orbProgress";
import type { TranslateFn } from "./shared";

/**
 * How often the recording ring is redrawn against its deadline. The fill is a
 * real countdown to the recording cap, not decoration, so it keeps running
 * under reduce motion -- but it does not need a frame every 16ms to read.
 */
const RECORDING_TICK_MS = 250;

interface OrbVoiceStageProps {
  colors: Colors;
  driveSilenceCountdownSeconds?: number | null;
  driveVoiceActive?: boolean;
  inputMode: InputMode;
  layout?: "portrait" | "landscape";
  onInterruptPlayback?: () => void;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onStopPlayback: () => void;
  phaseProgress?: VoicePhaseProgress | null;
  playbackPaused?: boolean;
  recordingMaxMs: number;
  recordingStartedAtMs?: number | null;
  speechStartProgress?: VoiceTimingProgress | null;
  statusLabel: string;
  t: TranslateFn;
  visualPhase: VoiceVisualPhase;
}

function getPhaseCopy(
  visualPhase: VoiceVisualPhase,
  inputMode: InputMode,
  playbackPaused: boolean,
  t: TranslateFn,
) {
  if (visualPhase === "recording") {
    return {
      detail:
        inputMode === "push-to-talk"
          ? t("keepPressing")
          : inputMode === "drive-session"
            ? t("listening")
            : t("tapWhenDone"),
      title:
        inputMode === "push-to-talk"
          ? t("pushToTalk")
          : inputMode === "drive-session"
            ? t("driveSession")
            : t("toggleToTalk"),
    };
  }

  const title =
    visualPhase === "transcribing"
      ? t("parsing")
      : visualPhase === "searching"
        ? t("searching")
        : visualPhase === "synthesizing"
          ? t("converting")
          : visualPhase === "speaking"
            ? playbackPaused
              ? t("paused")
              : t("speaking")
            : t("thinking");

  return { detail: t("pleaseWait"), title };
}

/**
 * How far through the recording cap we are, ticked against a real deadline.
 *
 * This is the orb's inner ring while recording. It replaces the fill that used
 * to sweep across the docked bar -- the same clock, drawn as the ring the phase
 * already owns.
 */
function useRecordingProgress(
  visualPhase: VoiceVisualPhase,
  recordingMaxMs: number,
  recordingStartedAtMs: number | null,
) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (visualPhase !== "recording") {
      setProgress(0);
      return;
    }

    // Continued from the actual start, so returning to a running recording
    // does not restart the fill at zero.
    const startedAt = recordingStartedAtMs ?? Date.now();
    const measure = () =>
      setProgress(getRecordingProgress(Date.now(), startedAt, recordingMaxMs));

    measure();
    const timer = setInterval(measure, RECORDING_TICK_MS);
    return () => clearInterval(timer);
  }, [recordingMaxMs, recordingStartedAtMs, visualPhase]);

  return progress;
}

/**
 * The voice stage while a turn is running: the orb, what is happening beneath
 * it, and the actions that belong to the current phase.
 *
 * **Decision:** this replaces the docked `PhaseAwareVoiceAction` bar on the home
 * screen only. The bar drew two clocks as a sweeping fill and a timeline border
 * around its own edge; the orb already has two rings for exactly those, so the
 * progress moves onto them rather than being redrawn. Everything the bar said in
 * words moves to `WorkspaceStatusLine`, and its stop action becomes a satellite.
 * `PhaseAwareVoiceAction` is unchanged and still correct in a bar.
 */
export function OrbVoiceStage({
  colors: _colors,
  driveSilenceCountdownSeconds = null,
  driveVoiceActive = false,
  inputMode,
  layout = "portrait",
  onInterruptPlayback,
  onPress,
  onPressIn,
  onPressOut,
  onStopPlayback,
  phaseProgress = null,
  playbackPaused = false,
  recordingMaxMs,
  recordingStartedAtMs = null,
  speechStartProgress = null,
  statusLabel,
  t,
  visualPhase,
}: OrbVoiceStageProps) {
  const [etaNowMs, setEtaNowMs] = React.useState(Date.now);
  const recordingProgress = useRecordingProgress(
    visualPhase,
    recordingMaxMs,
    recordingStartedAtMs,
  );
  const copy = getPhaseCopy(visualPhase, inputMode, playbackPaused, t);
  const turn = getOrbProgress(phaseProgress);
  const isRecording = visualPhase === "recording";
  const isSpeaking = visualPhase === "speaking";
  const showSpeechEta = !isRecording && !isSpeaking && Boolean(speechStartProgress);
  const speechEta = getVoiceEta(speechStartProgress, etaNowMs);
  const showDriveCountdown =
    inputMode === "drive-session" &&
    isRecording &&
    !driveVoiceActive &&
    driveSilenceCountdownSeconds !== null;

  React.useEffect(() => {
    if (!showSpeechEta) {
      return;
    }

    setEtaNowMs(Date.now());
    const timer = setInterval(() => setEtaNowMs(Date.now()), 1_000);
    return () => clearInterval(timer);
  }, [
    showSpeechEta,
    speechStartProgress?.estimatedMs,
    speechStartProgress?.startedAt,
  ]);

  /**
   * Announced once per phase, never per ETA tick. The detail line changes every
   * second while an estimate is running, and announcing that would talk over
   * the reply it is counting down to.
   */
  const announcement = `${copy.title}. ${copy.detail}`;
  const previousPhase = React.useRef(visualPhase);

  React.useEffect(() => {
    if (previousPhase.current === visualPhase) {
      return;
    }

    previousPhase.current = visualPhase;
    AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement, visualPhase]);

  const detail = showDriveCountdown
    ? `${copy.detail} · ${driveSilenceCountdownSeconds}s`
    : showSpeechEta && speechEta
      ? speechEta.label
      : copy.detail;

  const orbLabel = isRecording
    ? t("voiceOrbRecordingLabel")
    : isSpeaking
      ? t("voiceOrbSpeakingLabel")
      : statusLabel;

  return (
    <View
      style={[styles.stage, layout === "landscape" ? styles.landscape : null]}
      testID="orb-voice-stage"
    >
      <VoiceOrb
        glyph={isSpeaking && playbackPaused ? "play-circle" : undefined}
        label={orbLabel}
        maxDiameter={layout === "landscape" ? 150 : undefined}
        minDiameter={layout === "landscape" ? 84 : undefined}
        onPress={
          inputMode === "push-to-talk"
            ? undefined
            : isSpeaking && !playbackPaused && onInterruptPlayback
              ? onInterruptPlayback
              : onPress
        }
        onPressIn={inputMode === "push-to-talk" ? onPressIn : undefined}
        onPressOut={inputMode === "push-to-talk" ? onPressOut : undefined}
        overtime={turn.overtime}
        phase={visualPhase}
        // While recording the phase is its own deadline; afterwards the phase
        // ring is the pipeline's own phase clock.
        phaseProgress={isRecording ? recordingProgress : turn.phaseProgress}
        turnProgress={isRecording ? 0 : turn.turnProgress}
      />

      <WorkspaceStatusLine
        detail={detail}
        phase={visualPhase}
        style={styles.status}
        title={copy.title}
      />

      {isSpeaking ? (
        <View style={styles.actions}>
          <OrbSatellite
            accessibilityLabel={t("stop")}
            icon="stop"
            label={t("stop")}
            onPress={onStopPlayback}
            testID="orb-stage-stop-playback"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: "center", flexDirection: "row", gap: 8 },
  landscape: { gap: 10 },
  stage: { alignItems: "center", gap: 16, width: "100%" },
  status: { alignSelf: "stretch" },
});
