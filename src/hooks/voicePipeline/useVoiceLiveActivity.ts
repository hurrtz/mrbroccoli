import { useEffect } from "react";

import {
  endVoiceLiveActivity,
  scheduleVoiceLiveActivityEnd,
  setVoiceLiveActivityState,
  type VoiceLiveActivityPhase,
} from "../../services/voiceLiveActivity";
import type { VoicePhaseProgress } from "../../types";
import type { TranslationKey } from "../../i18n";
import type { PipelinePhase } from "./types";

interface UseVoiceLiveActivityParams {
  isRecording: boolean;
  phaseProgress: VoicePhaseProgress | null;
  pipelinePhase: PipelinePhase;
  spokenRepliesEnabled: boolean;
  t: (
    key: TranslationKey,
    params?: Record<string, string | number | undefined>,
  ) => string;
}

function toLiveActivityPhase(
  pipelinePhase: PipelinePhase,
): VoiceLiveActivityPhase | null {
  switch (pipelinePhase) {
    case "thinking-briefly":
      return "thinking";
    case "transcribing":
    case "searching":
    case "thinking":
    case "synthesizing":
      return pipelinePhase;
    default:
      return null;
  }
}

export function useVoiceLiveActivity({
  isRecording,
  phaseProgress,
  pipelinePhase,
  spokenRepliesEnabled,
  t,
}: UseVoiceLiveActivityParams) {
  const speechStartProgress =
    phaseProgress?.speechStart ?? phaseProgress?.overall ?? phaseProgress;
  const expectedSpeechAtMs = speechStartProgress
    ? speechStartProgress.startedAt + speechStartProgress.estimatedMs
    : null;

  useEffect(() => {
    if (!spokenRepliesEnabled) {
      endVoiceLiveActivity();
      return;
    }

    if (isRecording) {
      setVoiceLiveActivityState({
        phase: "listening",
        expectedSpeechAtMs: null,
        phaseLabel: t("listening"),
        statusLabel: t("yourTurn"),
      });
      return;
    }

    const liveActivityPhase = toLiveActivityPhase(pipelinePhase);

    if (liveActivityPhase) {
      const phaseLabel =
        liveActivityPhase === "transcribing"
          ? t("parsing")
          : liveActivityPhase === "searching"
            ? t("searching")
            : liveActivityPhase === "synthesizing"
              ? t("converting")
              : t("thinking");
      setVoiceLiveActivityState({
        phase: liveActivityPhase,
        expectedSpeechAtMs,
        phaseLabel,
        statusLabel: t("pleaseWait"),
      });
      return;
    }

    if (pipelinePhase === "speaking") {
      endVoiceLiveActivity();
      return;
    }

    // Stopping capture briefly renders an idle state before transcription
    // begins. The small grace period keeps one continuous Live Activity across
    // that hand-off and is cancelled as soon as the next phase arrives.
    scheduleVoiceLiveActivityEnd();
  }, [
    expectedSpeechAtMs,
    isRecording,
    pipelinePhase,
    spokenRepliesEnabled,
    t,
  ]);

  useEffect(
    () => () => {
      endVoiceLiveActivity();
    },
    [],
  );
}
