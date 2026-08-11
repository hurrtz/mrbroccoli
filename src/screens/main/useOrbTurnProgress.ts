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
 * The inner ring has a real estimate only while recording (elapsed against
 * the recording cap). The processing phases carry no per-phase estimate, so
 * their inner ring rests on the phase tint rather than faking a fraction.
 * The outer ring is the whole turn against the speech-start estimate; past
 * it, overtime rises and the orb fills with red. Speaking holds a full turn
 * ring — the estimate it tracked has been met.
 */
export function useOrbTurnProgress({
  recordingMaxMs,
  recordingStartedAtMs,
  speechStartProgress,
  visualPhase,
}: {
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
    return { phaseProgress: 0, turnProgress: 1, overtime: 0 };
  }

  if (!speechStartProgress) {
    return IDLE;
  }

  const estimatedMs = Math.max(1000, speechStartProgress.estimatedMs);
  const elapsedMs = Math.max(0, nowMs - speechStartProgress.startedAt);
  const turnProgress = clamp01(elapsedMs / estimatedMs);
  const overtime = clamp01((elapsedMs - estimatedMs) / estimatedMs);
  const beforeEstimate = elapsedMs < estimatedMs;
  return {
    phaseProgress: 0,
    turnProgress,
    overtime,
    turnProgressTiming:
      turnProgress < 1
        ? { durationMs: Math.max(0, estimatedMs - elapsedMs) }
        : undefined,
    overtimeTiming: beforeEstimate
      ? {
          delayMs: Math.max(0, estimatedMs - elapsedMs),
          durationMs: estimatedMs,
        }
      : overtime < 1
        ? { durationMs: Math.max(0, estimatedMs * (1 - overtime)) }
        : undefined,
  };
}
