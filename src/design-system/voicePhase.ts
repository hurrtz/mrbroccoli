import type { Colors } from "../theme/colors";
import type { VoiceVisualPhase } from "../types";
import type { PhosphorIconName } from "./PhosphorIcon";

/**
 * The colour a phase owns, shared by every control that shows a turn running.
 *
 * Recording reads `phaseRecordingTrack` rather than `phaseRecording`: the latter
 * is the level wash drawn behind the control, which is a technique that differs
 * per appearance, while the track is the phase itself.
 */
export function getPhaseColor(
  phase: VoiceVisualPhase,
  colors: Colors,
): string {
  switch (phase) {
    case "recording":
      return colors.phaseRecordingTrack;
    case "transcribing":
      return colors.phaseTranscribing;
    case "thinking-briefly":
      return colors.phaseThinkingBriefly;
    case "searching":
      return colors.phaseSearching;
    case "thinking":
      return colors.phaseThinking;
    case "synthesizing":
      return colors.phaseSynthesizing;
    case "speaking":
      return colors.phaseSpeaking;
    default:
      return colors.accent;
  }
}

/**
 * The glyph on the orb's core.
 *
 * **Decision:** it says what tapping does, not what the machine is doing. A
 * control that shows the machine's state gives the user nothing to act on, and
 * the phase is already carried by the ring colour and the status line.
 */
export function getPhaseGlyph(phase: VoiceVisualPhase): PhosphorIconName {
  switch (phase) {
    case "recording":
      return "stop";
    case "transcribing":
      return "file-text";
    case "thinking-briefly":
      return "thunderbolt";
    case "searching":
      return "global";
    case "thinking":
      return "brain";
    case "synthesizing":
      return "customer-service";
    case "speaking":
      return "pause";
    default:
      return "mic";
  }
}
