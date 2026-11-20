import {
  FALLBACK_MAX_RECORDING_MS,
  getMaxRecordingMs,
} from "../../src/utils/recordingLimits";

describe("getMaxRecordingMs", () => {
  it("uses the generous fallback for native STT (no upload limit)", () => {
    expect(
      getMaxRecordingMs({
        sttMode: "native",
        sttProvider: "openai",
        sttModel: "whisper-1",
      }),
    ).toBe(FALLBACK_MAX_RECORDING_MS);
  });

  it("uses the fallback when no provider is selected", () => {
    expect(
      getMaxRecordingMs({
        sttMode: "provider",
        sttProvider: null,
        sttModel: "",
      }),
    ).toBe(FALLBACK_MAX_RECORDING_MS);
  });

  it("derives a real cap from a provider model's catalog size limit", () => {
    // OpenAI STT documents a 25,000,000-byte upload limit. At the worst-case
    // 16 kHz mono 16-bit bitrate (~32 KB/s) with 90% headroom that is ~11.7 min.
    const ms = getMaxRecordingMs({
      sttMode: "provider",
      sttProvider: "openai",
      sttModel: "gpt-4o-mini-transcribe",
    });

    expect(ms).toBeLessThan(FALLBACK_MAX_RECORDING_MS);
    expect(ms).toBeGreaterThan(10 * 60 * 1000);
    expect(ms).toBeLessThan(13 * 60 * 1000);
  });

  it("also respects the provider's maximum recording duration", () => {
    expect(getMaxRecordingMs({
      sttMode: "provider",
      sttProvider: "elevenlabs",
      sttModel: "scribe_v2",
    })).toBe(10 * 60 * 60 * 1000);
  });

  it("falls back when the provider/model has no documented size limit", () => {
    expect(
      getMaxRecordingMs({
        sttMode: "provider",
        sttProvider: "anthropic",
        sttModel: "",
      }),
    ).toBe(FALLBACK_MAX_RECORDING_MS);
  });
});
