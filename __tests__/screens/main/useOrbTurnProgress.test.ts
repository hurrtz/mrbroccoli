import { renderHook } from "@testing-library/react-native";

import { useOrbTurnProgress } from "../../../src/screens/main/useOrbTurnProgress";

describe("useOrbTurnProgress", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rests at zero while idle", () => {
    const { result } = renderHook(() =>
      useOrbTurnProgress({
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        speechStartProgress: null,
        visualPhase: "idle",
      }),
    );

    expect(result.current).toEqual({
      phaseProgress: 0,
      turnProgress: 0,
      overtime: 0,
    });
  });

  it("fills the inner ring from the actual recording start", () => {
    jest.spyOn(Date, "now").mockReturnValue(20_000);

    const { result } = renderHook(() =>
      useOrbTurnProgress({
        recordingMaxMs: 10_000,
        recordingStartedAtMs: 15_000,
        speechStartProgress: null,
        visualPhase: "recording",
      }),
    );

    expect(result.current.phaseProgress).toBeCloseTo(0.5);
    expect(result.current.turnProgress).toBe(0);
    expect(result.current.overtime).toBe(0);
    expect(result.current.phaseProgressTiming).toEqual({ durationMs: 5_000 });
  });

  it("tracks the whole turn against the speech-start estimate", () => {
    jest.spyOn(Date, "now").mockReturnValue(15_000);

    const { result } = renderHook(() =>
      useOrbTurnProgress({
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        speechStartProgress: {
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
    // No per-phase estimate exists for processing phases, so the inner ring
    // rests on the phase tint rather than faking a fraction.
    expect(result.current.phaseProgress).toBe(0);
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
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        speechStartProgress: {
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
        recordingMaxMs: 10_000,
        recordingStartedAtMs: null,
        speechStartProgress: null,
        visualPhase: "speaking",
      }),
    );

    expect(result.current.turnProgress).toBe(1);
    expect(result.current.overtime).toBe(0);
  });
});
