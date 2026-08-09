import { getOrbProgress } from "../../../src/screens/main/orbProgress";
import type { VoicePhaseProgress } from "../../../src/types";

function timing(overrides: Partial<VoicePhaseProgress> = {}) {
  return {
    elapsedMs: 1_000,
    estimatedMs: 4_000,
    learned: true,
    overEstimate: false,
    phase: "thinking" as const,
    progress: 0.25,
    sampleCount: 5,
    startedAt: 0,
    ...overrides,
  } satisfies VoicePhaseProgress;
}

describe("getOrbProgress", () => {
  it("is idle when there is no turn running", () => {
    expect(getOrbProgress(null)).toEqual({
      overtime: 0,
      phaseProgress: 0,
      turnProgress: 0,
    });
  });

  it("carries two clocks: the phase and the whole turn", () => {
    // The outer ring is the turn against its estimate, the inner ring is the
    // current phase against itself, so a slow turn still shows phases landing.
    const result = getOrbProgress(
      timing({
        overall: {
          elapsedMs: 9_000,
          estimatedMs: 20_000,
          learned: true,
          overEstimate: false,
          progress: 0.45,
          sampleCount: 5,
          startedAt: 0,
        },
        progress: 0.8,
      }),
    );

    expect(result.phaseProgress).toBe(0.8);
    expect(result.turnProgress).toBe(0.45);
    expect(result.overtime).toBe(0);
  });

  it("grows overtime once the turn passes its estimate", () => {
    const result = getOrbProgress(
      timing({
        overall: {
          elapsedMs: 30_000,
          estimatedMs: 20_000,
          learned: true,
          overEstimate: true,
          progress: 1,
          sampleCount: 5,
          startedAt: 0,
        },
      }),
    );

    // Half an estimate late is half a lap of red.
    expect(result.overtime).toBeCloseTo(0.5);
  });

  it("caps overtime at a full lap", () => {
    const result = getOrbProgress(
      timing({
        overall: {
          elapsedMs: 200_000,
          estimatedMs: 20_000,
          learned: true,
          overEstimate: true,
          progress: 1,
          sampleCount: 5,
          startedAt: 0,
        },
      }),
    );

    expect(result.overtime).toBe(1);
  });

  it("never reports a turn with no estimate as late", () => {
    // A fresh install has learned nothing yet. Painting the orb red on the
    // first slow request would be reporting a deadline that does not exist.
    const result = getOrbProgress(
      timing({
        overall: {
          elapsedMs: 30_000,
          estimatedMs: 0,
          learned: false,
          overEstimate: true,
          progress: 0,
          sampleCount: 0,
          startedAt: 0,
        },
      }),
    );

    expect(result.overtime).toBe(0);
  });

  it("falls back to the phase's own timing when there is no overall clock", () => {
    const result = getOrbProgress(timing({ progress: 0.6 }));

    expect(result.phaseProgress).toBe(0.6);
    expect(result.turnProgress).toBe(0.6);
  });
});
