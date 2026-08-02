import {
  getLocalSttBenchmarkAudioBase64,
  LOCAL_STT_BENCHMARK_AUDIO_DURATION_SECONDS,
  STT_VALIDATION_AUDIO_BASE64,
} from "../../src/services/sttValidationAudio";

describe("STT validation audio", () => {
  it("is a complete WAV large enough for the recording-readiness guard", () => {
    const wav = Buffer.from(STT_VALIDATION_AUDIO_BASE64, "base64");

    expect(wav.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(wav.subarray(8, 12).toString("ascii")).toBe("WAVE");
    expect(wav.readUInt32LE(4) + 8).toBe(wav.length);
    expect(wav.readUInt32LE(74) + 78).toBe(wav.length);
    expect(wav.length).toBeGreaterThanOrEqual(4096);
  });

  it("builds a non-silent 16 kHz mono benchmark WAV for local Whisper", () => {
    const wav = Buffer.from(getLocalSttBenchmarkAudioBase64(), "base64");
    const dataSize = wav.readUInt32LE(40);
    const pcm = wav.subarray(44);

    expect(wav.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(wav.subarray(8, 12).toString("ascii")).toBe("WAVE");
    expect(wav.readUInt16LE(20)).toBe(1);
    expect(wav.readUInt16LE(22)).toBe(1);
    expect(wav.readUInt32LE(24)).toBe(16_000);
    expect(wav.readUInt16LE(34)).toBe(16);
    expect(dataSize).toBe(
      16_000 * 2 * LOCAL_STT_BENCHMARK_AUDIO_DURATION_SECONDS,
    );
    expect(dataSize + 44).toBe(wav.length);
    expect(pcm.some((byte) => byte !== 0)).toBe(true);
  });
});
