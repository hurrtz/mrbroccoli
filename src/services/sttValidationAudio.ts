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
