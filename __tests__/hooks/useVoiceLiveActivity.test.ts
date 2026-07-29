import { renderHook } from "@testing-library/react-native";

import { useVoiceLiveActivity } from "../../src/hooks/voicePipeline/useVoiceLiveActivity";
import {
  endVoiceLiveActivity,
  scheduleVoiceLiveActivityEnd,
  setVoiceLiveActivityState,
} from "../../src/services/voiceLiveActivity";
import type { VoicePhaseProgress } from "../../src/types";

jest.mock("../../src/services/voiceLiveActivity", () => ({
  endVoiceLiveActivity: jest.fn(),
  scheduleVoiceLiveActivityEnd: jest.fn(),
  setVoiceLiveActivityState: jest.fn(),
}));

const progress: VoicePhaseProgress = {
  phase: "thinking",
  progress: 0.25,
  elapsedMs: 4_000,
  startedAt: 120_000,
  estimatedMs: 12_000,
  sampleCount: 4,
  learned: true,
  overEstimate: false,
  overall: {
    progress: 0.25,
    elapsedMs: 40_000,
    startedAt: 80_000,
    estimatedMs: 140_000,
    sampleCount: 4,
    learned: true,
    overEstimate: false,
  },
};

const copy: Record<string, string> = {
  listening: "Listening",
  yourTurn: "Your turn",
  parsing: "Transcribing",
  searching: "Searching",
  converting: "Converting",
  thinking: "Thinking",
  pleaseWait: "Please wait",
};
const t = (key: string) => copy[key] ?? key;

describe("useVoiceLiveActivity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("runs continuously from recording through the learned ETA to playback", () => {
    const { rerender, unmount } = renderHook(
      (props: Parameters<typeof useVoiceLiveActivity>[0]) =>
        useVoiceLiveActivity(props),
      {
        initialProps: {
          isRecording: true,
          phaseProgress: null,
          pipelinePhase: "idle" as const,
          spokenRepliesEnabled: true,
          t,
        },
      },
    );

    expect(setVoiceLiveActivityState).toHaveBeenCalledWith({
      phase: "listening",
      expectedSpeechAtMs: null,
      phaseLabel: "Listening",
      statusLabel: "Your turn",
    });

    rerender({
      isRecording: false,
      phaseProgress: progress,
      pipelinePhase: "thinking",
      spokenRepliesEnabled: true,
      t,
    });

    expect(setVoiceLiveActivityState).toHaveBeenLastCalledWith({
      phase: "thinking",
      expectedSpeechAtMs: 220_000,
      phaseLabel: "Thinking",
      statusLabel: "Please wait",
    });

    rerender({
      isRecording: false,
      phaseProgress: null,
      pipelinePhase: "speaking",
      spokenRepliesEnabled: true,
      t,
    });

    expect(endVoiceLiveActivity).toHaveBeenCalledTimes(1);
    unmount();
  });

  it("uses a short idle grace for the capture-to-transcription hand-off", () => {
    const { unmount } = renderHook(() =>
      useVoiceLiveActivity({
        isRecording: false,
        phaseProgress: null,
        pipelinePhase: "idle",
        spokenRepliesEnabled: true,
        t,
      }),
    );

    expect(scheduleVoiceLiveActivityEnd).toHaveBeenCalledWith();
    unmount();
  });

  it("keeps brief request preparation inside the thinking live activity", () => {
    const { unmount } = renderHook(() =>
      useVoiceLiveActivity({
        isRecording: false,
        phaseProgress: {
          ...progress,
          phase: "thinking-briefly",
        },
        pipelinePhase: "thinking-briefly",
        spokenRepliesEnabled: true,
        t,
      }),
    );

    expect(setVoiceLiveActivityState).toHaveBeenCalledWith({
      phase: "thinking",
      expectedSpeechAtMs: 220_000,
      phaseLabel: "Thinking",
      statusLabel: "Please wait",
    });
    unmount();
  });

  it("keeps the Live Activity ETA tied to playback start, not full turn completion", () => {
    const { unmount } = renderHook(() =>
      useVoiceLiveActivity({
        isRecording: false,
        phaseProgress: {
          ...progress,
          speechStart: {
            progress: 0.5,
            elapsedMs: 10_000,
            startedAt: 100_000,
            estimatedMs: 30_000,
            sampleCount: 2,
            learned: true,
            overEstimate: false,
          },
        },
        pipelinePhase: "thinking",
        spokenRepliesEnabled: true,
        t,
      }),
    );

    expect(setVoiceLiveActivityState).toHaveBeenCalledWith({
      phase: "thinking",
      expectedSpeechAtMs: 130_000,
      phaseLabel: "Thinking",
      statusLabel: "Please wait",
    });
    unmount();
  });

  it("does not show an ETA to speech when spoken replies are disabled", () => {
    const { unmount } = renderHook(() =>
      useVoiceLiveActivity({
        isRecording: false,
        phaseProgress: progress,
        pipelinePhase: "thinking",
        spokenRepliesEnabled: false,
        t,
      }),
    );

    expect(endVoiceLiveActivity).toHaveBeenCalledTimes(1);
    expect(setVoiceLiveActivityState).not.toHaveBeenCalled();
    unmount();
  });
});
