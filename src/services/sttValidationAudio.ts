import { STT_VALIDATION_AUDIO_CAPTURE_BASE64 } from "./sttValidationAudioCapture";

// The captured payload was shorter than its declared WAV data chunk. Rebuild
// the aligned header and add enough unsigned 8-bit PCM silence to keep the
// complete fixture above the recording-readiness threshold.
const STT_VALIDATION_AUDIO_HEADER_BASE64 =
  "UklGRmIRAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNjIuMTIuMTAyAGRhdGEcEQAA";

export const STT_VALIDATION_AUDIO_BASE64 =
  STT_VALIDATION_AUDIO_HEADER_BASE64 +
  STT_VALIDATION_AUDIO_CAPTURE_BASE64.slice(104) +
  "gICA".repeat(237);

export const LOCAL_STT_BENCHMARK_AUDIO_DURATION_SECONDS = 2;

/**
 * Converts the short captured utterance into the 16 kHz mono PCM shape used by
 * local Whisper, then pads it with silence to make timing comparisons useful.
 */
export function getLocalSttBenchmarkAudioBase64() {
  const sourceWav = atob(STT_VALIDATION_AUDIO_CAPTURE_BASE64);
  const sourcePcm = sourceWav.slice(78);
  const sampleRate = 16_000;
  const sampleCount = sampleRate * LOCAL_STT_BENCHMARK_AUDIO_DURATION_SECONDS;
  const bytesPerSample = 2;
  const wav = new Uint8Array(44 + sampleCount * bytesPerSample);
  const view = new DataView(wav.buffer);

  const writeAscii = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      wav[offset + index] = value.charCodeAt(index);
    }
  };

  writeAscii(0, "RIFF");
  view.setUint32(4, wav.length - 8, true);
  writeAscii(8, "WAVE");
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(36, "data");
  view.setUint32(40, sampleCount * bytesPerSample, true);

  const capturedSampleCount = Math.min(
    sourcePcm.length,
    Math.floor(sampleCount / 2),
  );
  for (let index = 0; index < capturedSampleCount; index += 1) {
    const sample = (sourcePcm.charCodeAt(index) - 128) << 8;
    const outputIndex = index * 2;
    view.setInt16(44 + outputIndex * bytesPerSample, sample, true);
    view.setInt16(44 + (outputIndex + 1) * bytesPerSample, sample, true);
  }

  let binary = "";
  for (let offset = 0; offset < wav.length; offset += 8_192) {
    binary += String.fromCharCode(...wav.subarray(offset, offset + 8_192));
  }
  return btoa(binary);
}
