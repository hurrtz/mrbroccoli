import type { VoiceTimingProgress } from "../types";

export interface VoiceEta {
  label: string;
  overEstimate: boolean;
  seconds: number;
}

export function formatVoiceEtaDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  if (safeSeconds < 60) {
    return `${safeSeconds} s`;
  }

  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getVoiceEta(
  progress: VoiceTimingProgress | null | undefined,
  nowMs = Date.now(),
): VoiceEta | null {
  if (!progress) {
    return null;
  }

  const deadlineMs =
    progress.startedAt + Math.max(1_000, progress.estimatedMs);
  const remainingMs = deadlineMs - nowMs;

  if (remainingMs >= 0) {
    const seconds = Math.ceil(remainingMs / 1_000);
    return {
      label: `~ ${formatVoiceEtaDuration(seconds)}`,
      overEstimate: false,
      seconds,
    };
  }

  const seconds = Math.max(1, Math.floor(-remainingMs / 1_000));
  return {
    label: `+ ${formatVoiceEtaDuration(seconds)}`,
    overEstimate: true,
    seconds,
  };
}
