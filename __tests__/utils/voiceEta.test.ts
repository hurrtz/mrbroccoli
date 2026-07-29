import {
  formatVoiceEtaDuration,
  getVoiceEta,
} from "../../src/utils/voiceEta";

const progress = {
  elapsedMs: 0,
  estimatedMs: 10_000,
  learned: true,
  overEstimate: false,
  progress: 0,
  sampleCount: 3,
  startedAt: 20_000,
};

describe("voiceEta", () => {
  it("formats short and minute-scale durations compactly", () => {
    expect(formatVoiceEtaDuration(9)).toBe("9 s");
    expect(formatVoiceEtaDuration(125)).toBe("2:05");
  });

  it("counts down until the learned speech deadline", () => {
    expect(getVoiceEta(progress, 24_100)).toEqual({
      label: "~ 6 s",
      overEstimate: false,
      seconds: 6,
    });
  });

  it("switches to explicit overtime after the deadline", () => {
    expect(getVoiceEta(progress, 33_400)).toEqual({
      label: "+ 3 s",
      overEstimate: true,
      seconds: 3,
    });
  });
});
