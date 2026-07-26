import { STT_VALIDATION_AUDIO_BASE64 } from "../../src/services/sttValidationAudio";

describe("STT validation audio", () => {
  it("is a complete WAV large enough for the recording-readiness guard", () => {
    const wav = Buffer.from(STT_VALIDATION_AUDIO_BASE64, "base64");

    expect(wav.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(wav.subarray(8, 12).toString("ascii")).toBe("WAVE");
    expect(wav.readUInt32LE(4) + 8).toBe(wav.length);
    expect(wav.readUInt32LE(74) + 78).toBe(wav.length);
    expect(wav.length).toBeGreaterThanOrEqual(4096);
  });
});
