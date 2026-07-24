import { useEffect } from "react";

import {
  endVoiceLiveActivity,
  scheduleVoiceLiveActivityEnd,
  setVoiceLiveActivityState,
  type VoiceLiveActivityPhase,
} from "../../services/voiceLiveActivity";
import type { VoicePhaseProgress } from "../../types";
import type { PipelinePhase } from "./types";

interface UseVoiceLiveActivityParams {
  isRecording: boolean;
  phaseProgress: VoicePhaseProgress | null;
  pipelinePhase: PipelinePhase;
  spokenRepliesEnabled: boolean;
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
      });
      return;
    }

    const liveActivityPhase = toLiveActivityPhase(pipelinePhase);

    if (liveActivityPhase) {
      setVoiceLiveActivityState({
        phase: liveActivityPhase,
        expectedSpeechAtMs,
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
  }, [expectedSpeechAtMs, isRecording, pipelinePhase, spokenRepliesEnabled]);

  useEffect(
    () => () => {
      endVoiceLiveActivity();
    },
    [],
  );
}
