import { useEffect, useReducer } from "react";
import type { VoiceTimingProgress, VoiceVisualPhase } from "../../types";

export interface OrbRingTiming {
  /** The remaining native-animation time for this clock. */
  durationMs: number;
  /** Optional delay before the clock begins, used for overtime. */
  delayMs?: number;
  /** Defaults to 1; speaking advances only through the current clip. */
  target?: number;
}

export interface OrbTurnProgress {
  phaseProgress: number;
  turnProgress: number;
  overtime: number;
  recordingSecondsLeft?: number;
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
 * Derives the orb's single progress clock from signals the session already has.
 *
 * Recording uses the recording cap. During processing, the ring measures the
 * whole turn from submission to first speech or text-only completion. It does not expose
 * per-phase estimates. Past that estimate, overtime rises and the orb fills
 * with red. Speaking carries how much of the reply has been read, so Back and
 * Forward move the arc by what the paragraph they skip actually holds.
 *
 * Speaking uses the player's measured read position and its estimate through
 * the current clip. Pausing freezes that interpolation in VoiceOrb.
 */
export function useOrbTurnProgress({
  phaseTimingProgress: _phaseTimingProgress,
  readingProgress,
  readingProgressTiming,
  recordingMaxMs,
  recordingStartedAtMs,
  processingProgress,
  visualPhase,
}: {
  /** Learned clock for the active processing phase. */
  phaseTimingProgress: VoiceTimingProgress | null;
  /** 0–1 of the reply already read, weighted by what each paragraph says. */
  readingProgress?: number | null;
  /** Estimated remaining time and measured boundary of the active clip. */
  readingProgressTiming?: OrbRingTiming | null;
  recordingMaxMs: number;
  recordingStartedAtMs: number | null;
  processingProgress: VoiceTimingProgress | null;
  visualPhase: VoiceVisualPhase;
}): OrbTurnProgress {
  const [, tick] = useReducer((count: number) => count + 1, 0);
  useEffect(() => {
    if (visualPhase !== "recording" || recordingStartedAtMs === null) return;
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [recordingStartedAtMs, visualPhase]);
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
      recordingSecondsLeft: Math.max(0, Math.ceil((safeMax - elapsedMs) / 1000)),
    };
  }

  if (visualPhase === "speaking") {
    return {
      phaseProgress: clamp01(readingProgress ?? 0),
      turnProgress: 1,
      overtime: 0,
      phaseProgressTiming: readingProgressTiming ?? undefined,
    };
  }

  const estimatedMs = processingProgress
    ? Math.max(1000, processingProgress.estimatedMs)
    : 0;
  const elapsedMs = processingProgress
    ? Math.max(0, nowMs - processingProgress.startedAt)
    : 0;
  const turnProgress = processingProgress
    ? clamp01(elapsedMs / estimatedMs)
    : 0;
  const overtime = processingProgress
    ? clamp01((elapsedMs - estimatedMs) / estimatedMs)
    : 0;
  const beforeEstimate = Boolean(
    processingProgress && elapsedMs < estimatedMs,
  );
  return {
    phaseProgress: turnProgress,
    turnProgress,
    overtime,
    phaseProgressTiming:
      processingProgress && turnProgress < 1
        ? { durationMs: Math.max(0, estimatedMs - elapsedMs) }
        : undefined,
    turnProgressTiming:
      processingProgress && turnProgress < 1
        ? { durationMs: Math.max(0, estimatedMs - elapsedMs) }
        : undefined,
    overtimeTiming: beforeEstimate
      ? {
          delayMs: Math.max(0, estimatedMs - elapsedMs),
          durationMs: estimatedMs,
        }
      : processingProgress && overtime < 1
        ? { durationMs: Math.max(0, estimatedMs * (1 - overtime)) }
        : undefined,
  };
}
