import { act, renderHook } from "@testing-library/react-native";

import { useOrbTurnProgress } from "../../../src/screens/main/useOrbTurnProgress";

describe("useOrbTurnProgress", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rests at zero while idle", () => {
    const { result } = renderHook(() =>
      useOrbTurnProgress({
        phaseTimingProgress: null,
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        processingProgress: null,
        visualPhase: "idle",
      }),
    );

    expect(result.current).toEqual({
      phaseProgress: 0,
      turnProgress: 0,
      overtime: 0,
    });
  });

  it("fills the recording ring from the actual recording start", () => {
    jest.spyOn(Date, "now").mockReturnValue(20_000);

    const { result } = renderHook(() =>
      useOrbTurnProgress({
        phaseTimingProgress: null,
        recordingMaxMs: 10_000,
        recordingStartedAtMs: 15_000,
        processingProgress: null,
        visualPhase: "recording",
      }),
    );

    expect(result.current.phaseProgress).toBeCloseTo(0.5);
    expect(result.current.turnProgress).toBe(0);
    expect(result.current.overtime).toBe(0);
    expect(result.current.recordingSecondsLeft).toBe(5);
  });

  it("updates elapsed recording progress even with no new native events", () => {
    jest.useFakeTimers({ now: 10_000 });
    try {
      const { result, unmount } = renderHook(() => useOrbTurnProgress({
        phaseTimingProgress: null, recordingMaxMs: 900_000,
        recordingStartedAtMs: 10_000, processingProgress: null, visualPhase: "recording",
      }));
      act(() => { jest.advanceTimersByTime(180_000); });
      expect(result.current.phaseProgress).toBeCloseTo(0.2);
      unmount();
    } finally {
      jest.useRealTimers();
    }
  });

  it("tracks the whole turn against the speech-start estimate", () => {
    jest.spyOn(Date, "now").mockReturnValue(15_000);

    const { result } = renderHook(() =>
      useOrbTurnProgress({
        phaseTimingProgress: {
          elapsedMs: 2_000,
          estimatedMs: 4_000,
          learned: true,
          overEstimate: false,
          progress: 0.5,
          sampleCount: 4,
          startedAt: 13_000,
        },
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        processingProgress: {
          elapsedMs: 5_000,
          estimatedMs: 10_000,
          learned: true,
          overEstimate: false,
          progress: 0.5,
          sampleCount: 4,
          startedAt: 10_000,
        },
        visualPhase: "thinking",
      }),
    );

    expect(result.current.turnProgress).toBeCloseTo(0.5);
    expect(result.current.overtime).toBe(0);
    expect(result.current.phaseProgress).toBeCloseTo(0.5);
    expect(result.current.phaseProgressTiming).toEqual({ durationMs: 5_000 });
    expect(result.current.turnProgressTiming).toEqual({ durationMs: 5_000 });
    expect(result.current.overtimeTiming).toEqual({
      delayMs: 5_000,
      durationMs: 10_000,
    });
  });

  it("rises into overtime once the estimate is passed", () => {
    jest.spyOn(Date, "now").mockReturnValue(25_000);

    const { result } = renderHook(() =>
      useOrbTurnProgress({
        phaseTimingProgress: null,
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        processingProgress: {
          elapsedMs: 15_000,
          estimatedMs: 10_000,
          learned: true,
          overEstimate: true,
          progress: 1,
          sampleCount: 4,
          startedAt: 10_000,
        },
        visualPhase: "synthesizing",
      }),
    );

    expect(result.current.turnProgress).toBe(1);
    expect(result.current.overtime).toBeCloseTo(0.5);
    expect(result.current.overtimeTiming).toEqual({ durationMs: 5_000 });
  });

  it("holds a full turn ring while speaking", () => {
    const { result } = renderHook(() =>
      useOrbTurnProgress({
        phaseTimingProgress: null,
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        processingProgress: null,
        visualPhase: "speaking",
      }),
    );

    expect(result.current.turnProgress).toBe(1);
    expect(result.current.overtime).toBe(0);
  });

  it("carries how much of the reply has been read while speaking", () => {
    const { rerender, result } = renderHook(
      (props: {
        readingProgress: number | null;
        readingProgressTiming?: { durationMs: number; target: number };
      }) =>
        useOrbTurnProgress({
          phaseTimingProgress: null,
          ...props,
          recordingMaxMs: 10_000,
          recordingStartedAtMs: null,
          processingProgress: null,
          visualPhase: "speaking",
        }),
      {
        initialProps: {
          readingProgress: 0.1,
          readingProgressTiming: { durationMs: 1_500, target: 0.4 },
        },
      },
    );

    expect(result.current.phaseProgress).toBeCloseTo(0.1);
    // Paragraphs differ in length, so a seek moves the arc by the paragraph's
    // own share rather than by an even step.
    expect(result.current.phaseProgressTiming).toEqual({
      durationMs: 1_500,
      target: 0.4,
    });
    rerender({ readingProgress: 0.4 });
    expect(result.current.phaseProgress).toBeCloseTo(0.4);
    expect(result.current.phaseProgressTiming).toBeUndefined();

    rerender({ readingProgress: null });
    expect(result.current.phaseProgress).toBe(0);
  });
});
