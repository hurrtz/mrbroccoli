const ABSOLUTE_SPEECH_PEAK_DB = -52;
const MIN_DYNAMIC_RANGE_DB = 5;
const MIN_DYNAMIC_SPEECH_PEAK_DB = -70;
const MIN_METERING_SAMPLES = 2;
const SILENCE_SENTINEL_DB = -100;

export interface RecordingSpeechAssessment {
  dynamicRangeDb: number | null;
  peakDb: number | null;
  sampleCount: number;
  shouldSubmit: boolean;
}

export function assessRecordedSpeech(
  meteringSamples: number[],
): RecordingSpeechAssessment {
  const samples = meteringSamples
    .filter(Number.isFinite)
    .map((sample) => Math.max(-160, Math.min(0, sample)));
  const audibleSamples = samples.filter(
    (sample) => sample > SILENCE_SENTINEL_DB,
  );

  // Metering is diagnostic rather than authoritative. If a platform did not
  // provide enough samples, keep the recording instead of risking lost speech.
  if (samples.length < MIN_METERING_SAMPLES) {
    return {
      dynamicRangeDb: null,
      peakDb: audibleSamples.length
        ? Math.max(...audibleSamples)
        : null,
      sampleCount: samples.length,
      shouldSubmit: true,
    };
  }

  if (audibleSamples.length === 0) {
    return {
      dynamicRangeDb: 0,
      peakDb: null,
      sampleCount: samples.length,
      shouldSubmit: false,
    };
  }

  const sorted = [...audibleSamples].sort((left, right) => left - right);
  const baselineIndex = Math.floor((sorted.length - 1) * 0.2);
  const baselineDb = sorted[baselineIndex];
  const peakDb = sorted[sorted.length - 1];
  const dynamicRangeDb = peakDb - baselineDb;
  const hasAbsoluteSpeechPeak = peakDb >= ABSOLUTE_SPEECH_PEAK_DB;
  const hasDynamicSpeechPeak =
    peakDb >= MIN_DYNAMIC_SPEECH_PEAK_DB &&
    dynamicRangeDb >= MIN_DYNAMIC_RANGE_DB;

  return {
    dynamicRangeDb: Math.round(dynamicRangeDb * 10) / 10,
    peakDb: Math.round(peakDb * 10) / 10,
    sampleCount: samples.length,
    shouldSubmit: hasAbsoluteSpeechPeak || hasDynamicSpeechPeak,
  };
}
