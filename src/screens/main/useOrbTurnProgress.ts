import { useEffect, useState } from "react";

import type { VoiceTimingProgress, VoiceVisualPhase } from "../../types";

export interface OrbTurnProgress {
  phaseProgress: number;
  turnProgress: number;
  overtime: number;
}

const IDLE: OrbTurnProgress = { phaseProgress: 0, turnProgress: 0, overtime: 0 };
const TICK_MS = 200;

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
  // The interval only forces re-renders; every fraction reads the clock at
  // render time, so a prop change is never stuck on a stale tick.
  const [, setTick] = useState(0);
  const nowMs = Date.now();
  const ticking =
    visualPhase === "recording" ||
    (visualPhase !== "idle" &&
      visualPhase !== "speaking" &&
      Boolean(speechStartProgress));

  useEffect(() => {
    if (!ticking) {
      return;
    }

    const timer = setInterval(
      () => setTick((current) => current + 1),
      TICK_MS,
    );
    return () => clearInterval(timer);
  }, [ticking]);

  if (visualPhase === "idle") {
    return IDLE;
  }

  if (visualPhase === "recording") {
    const startedAt = recordingStartedAtMs ?? nowMs;
    const safeMax = Math.max(1000, recordingMaxMs);
    return {
      phaseProgress: clamp01((nowMs - startedAt) / safeMax),
      turnProgress: 0,
      overtime: 0,
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
  return {
    phaseProgress: 0,
    turnProgress: clamp01(elapsedMs / estimatedMs),
    overtime: clamp01((elapsedMs - estimatedMs) / estimatedMs),
  };
}
