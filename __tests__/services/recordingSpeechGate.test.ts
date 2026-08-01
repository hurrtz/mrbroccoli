import { assessRecordedSpeech } from "../../src/services/recordingSpeechGate";

describe("recording speech gate", () => {
  it("rejects a silent recording before provider transcription", () => {
    expect(assessRecordedSpeech([-160, -160, -160, -160])).toEqual({
      dynamicRangeDb: 0,
      peakDb: null,
      sampleCount: 4,
      shouldSubmit: false,
    });
  });

  it("rejects steady background noise that has no speech-like peak", () => {
    expect(
      assessRecordedSpeech([-64, -63.5, -64.2, -63.8]).shouldSubmit,
    ).toBe(false);
  });

  it("accepts both ordinary speech and quieter speech with a dynamic peak", () => {
    expect(assessRecordedSpeech([-62, -38, -41, -35]).shouldSubmit).toBe(
      true,
    );
    expect(assessRecordedSpeech([-66, -62, -56, -60]).shouldSubmit).toBe(
      true,
    );
  });

  it("fails open when the recorder supplies too little metering data", () => {
    expect(assessRecordedSpeech([-160]).shouldSubmit).toBe(true);
    expect(assessRecordedSpeech([]).shouldSubmit).toBe(true);
  });
});
