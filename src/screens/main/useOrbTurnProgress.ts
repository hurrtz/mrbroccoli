import type { VoiceTimingProgress, VoiceVisualPhase } from "../../types";

export interface OrbRingTiming {
  /** The remaining native-animation time for this clock. */
  durationMs: number;
  /** Optional delay before the clock begins, used for overtime. */
  delayMs?: number;
}

export interface OrbTurnProgress {
  phaseProgress: number;
  turnProgress: number;
  overtime: number;
  phaseProgressTiming?: OrbRingTiming;
  turnProgressTiming?: OrbRingTiming;
  overtimeTiming?: OrbRingTiming;
}

const IDLE: OrbTurnProgress = {
  phaseProgress: 0,
  turnProgress: 0,
  overtime: 0,
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/**
 * Derives the orb's two clocks from the signals the session already has.
 *
 * Recording uses the recording cap. During processing, the inner ring uses
 * the current phase's learned clock while the outer ring uses the whole turn
 * to first speech. Past the outer estimate, overtime rises and the orb fills
 * with red. Speaking holds a full turn ring and carries how much of the reply
 * has been read, so Back and Forward move the arc by what the paragraph they
 * skip actually holds.
 *
 * **Decision:** the speaking arc advances at spoken-clip boundaries rather
 * than on a clock. Neither the native queue nor the speech engine reports a
 * clip's duration, so a per-second fill would be an invented rate; the reel's
 * character weights are a measurement.
 */
export function useOrbTurnProgress({
  phaseTimingProgress,
  readingProgress,
  recordingMaxMs,
  recordingStartedAtMs,
  speechStartProgress,
  visualPhase,
}: {
  /** Learned clock for the active processing phase. */
  phaseTimingProgress: VoiceTimingProgress | null;
  /** 0–1 of the reply already read, weighted by what each paragraph says. */
  readingProgress?: number | null;
  recordingMaxMs: number;
  recordingStartedAtMs: number | null;
  speechStartProgress: VoiceTimingProgress | null;
  visualPhase: VoiceVisualPhase;
}): OrbTurnProgress {
  const nowMs = Date.now();

  if (visualPhase === "idle") {
    return IDLE;
  }

  if (visualPhase === "recording") {
    const startedAt = recordingStartedAtMs ?? nowMs;
    const safeMax = Math.max(1000, recordingMaxMs);
    const elapsedMs = Math.max(0, nowMs - startedAt);
    const phaseProgress = clamp01(elapsedMs / safeMax);
    return {
      phaseProgress,
      turnProgress: 0,
      overtime: 0,
      phaseProgressTiming:
        phaseProgress < 1
          ? { durationMs: Math.max(0, safeMax - elapsedMs) }
          : undefined,
    };
  }

  if (visualPhase === "speaking") {
    return {
      phaseProgress: clamp01(readingProgress ?? 0),
      turnProgress: 1,
      overtime: 0,
    };
  }

  const phaseEstimatedMs = phaseTimingProgress
    ? Math.max(1000, phaseTimingProgress.estimatedMs)
    : 0;
  const phaseElapsedMs = phaseTimingProgress
    ? Math.max(0, nowMs - phaseTimingProgress.startedAt)
    : 0;
  const phaseProgress = phaseTimingProgress
    ? clamp01(phaseElapsedMs / phaseEstimatedMs)
    : 0;
  const estimatedMs = speechStartProgress
    ? Math.max(1000, speechStartProgress.estimatedMs)
    : 0;
  const elapsedMs = speechStartProgress
    ? Math.max(0, nowMs - speechStartProgress.startedAt)
    : 0;
  const turnProgress = speechStartProgress
    ? clamp01(elapsedMs / estimatedMs)
    : 0;
  const overtime = speechStartProgress
    ? clamp01((elapsedMs - estimatedMs) / estimatedMs)
    : 0;
  const beforeEstimate = Boolean(
    speechStartProgress && elapsedMs < estimatedMs,
  );
  return {
    phaseProgress,
    turnProgress,
    overtime,
    phaseProgressTiming:
      phaseTimingProgress && phaseProgress < 1
        ? { durationMs: Math.max(0, phaseEstimatedMs - phaseElapsedMs) }
        : undefined,
    turnProgressTiming:
      speechStartProgress && turnProgress < 1
        ? { durationMs: Math.max(0, estimatedMs - elapsedMs) }
        : undefined,
    overtimeTiming: beforeEstimate
      ? {
          delayMs: Math.max(0, estimatedMs - elapsedMs),
          durationMs: estimatedMs,
        }
      : speechStartProgress && overtime < 1
        ? { durationMs: Math.max(0, estimatedMs * (1 - overtime)) }
        : undefined,
  };
}
