import type { VoicePhaseProgress } from "../../types";

export interface OrbProgress {
  /** 0–1 past the estimate. Above 0 both rings fill with red as the turn runs. */
  overtime: number;
  /** 0–1 through the current phase. The inner ring. */
  phaseProgress: number;
  /** 0–1 through the whole turn against its estimate. The outer ring. */
  turnProgress: number;
}

const IDLE: OrbProgress = { overtime: 0, phaseProgress: 0, turnProgress: 0 };

function clampUnit(value: number) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

/**
 * The pipeline's timing, as the orb's two clocks.
 *
 * The outer ring is the whole turn against its estimate and the inner ring is
 * the current phase against itself, so a turn that is slow overall still shows
 * each phase completing. Past the estimate `overtime` grows towards a full lap,
 * which is what turns both rings red.
 */
export function getOrbProgress(
  progress: VoicePhaseProgress | null | undefined,
): OrbProgress {
  if (!progress) {
    return IDLE;
  }

  const turn = progress.overall ?? progress;
  // A turn with no usable estimate cannot be late, and pretending otherwise
  // would paint the orb red on the first slow request of a fresh install.
  const late =
    turn.overEstimate && turn.estimatedMs > 0
      ? clampUnit((turn.elapsedMs - turn.estimatedMs) / turn.estimatedMs)
      : 0;

  return {
    overtime: late,
    phaseProgress: clampUnit(progress.progress),
    turnProgress: clampUnit(turn.progress),
  };
}
