export const DRIVE_SILENCE_WINDOW_MS = 10_000;

const DEFAULT_NOISE_FLOOR_DB = -60;
const MIN_VOICE_THRESHOLD_DB = -48;
const VOICE_THRESHOLD_ABOVE_FLOOR_DB = 10;
const VOICE_RELEASE_ABOVE_FLOOR_DB = 6;
const VOICE_ATTACK_SAMPLE_COUNT = 2;
const VOICE_RELEASE_SAMPLE_COUNT = 3;
const NOISE_FLOOR_SMOOTHING = 0.08;
const INITIAL_CALIBRATION_MS = 600;
const INITIAL_CALIBRATION_SMOOTHING = 0.28;
const IMMEDIATE_VOICE_LEVEL_DB = -32;

export interface DriveVoiceActivityState {
  aboveThresholdSamples: number;
  belowReleaseSamples: number;
  hasDetectedSpeech: boolean;
  lastSpeechAtMs: number | null;
  noiseFloorDb: number;
  recordingStartedAtMs: number;
  voiceActive: boolean;
}

export function createDriveVoiceActivityState(
  recordingStartedAtMs: number,
): DriveVoiceActivityState {
  return {
    aboveThresholdSamples: 0,
    belowReleaseSamples: 0,
    hasDetectedSpeech: false,
    lastSpeechAtMs: null,
    noiseFloorDb: DEFAULT_NOISE_FLOOR_DB,
    recordingStartedAtMs,
    voiceActive: false,
  };
}

function clampMetering(metering: number) {
  if (!Number.isFinite(metering)) {
    return DEFAULT_NOISE_FLOOR_DB;
  }

  return Math.max(-160, Math.min(0, metering));
}

export function updateDriveVoiceActivity(
  current: DriveVoiceActivityState,
  metering: number,
  nowMs: number,
): DriveVoiceActivityState {
  const levelDb = clampMetering(metering);
  const calibrating =
    nowMs - current.recordingStartedAtMs < INITIAL_CALIBRATION_MS;
  if (
    calibrating &&
    !current.hasDetectedSpeech &&
    levelDb < IMMEDIATE_VOICE_LEVEL_DB
  ) {
    return {
      ...current,
      aboveThresholdSamples: 0,
      belowReleaseSamples: 0,
      noiseFloorDb:
        current.noiseFloorDb +
        (levelDb - current.noiseFloorDb) *
          INITIAL_CALIBRATION_SMOOTHING,
      voiceActive: false,
    };
  }

  const voiceThresholdDb = Math.max(
    MIN_VOICE_THRESHOLD_DB,
    current.noiseFloorDb + VOICE_THRESHOLD_ABOVE_FLOOR_DB,
  );
  const voiceReleaseDb = Math.max(
    MIN_VOICE_THRESHOLD_DB - 4,
    current.noiseFloorDb + VOICE_RELEASE_ABOVE_FLOOR_DB,
  );
  const aboveThreshold = levelDb >= voiceThresholdDb;
  const belowRelease = levelDb < voiceReleaseDb;
  const aboveThresholdSamples = aboveThreshold
    ? current.aboveThresholdSamples + 1
    : 0;
  const voiceActivated =
    current.voiceActive ||
    aboveThresholdSamples >= VOICE_ATTACK_SAMPLE_COUNT;
  const belowReleaseSamples =
    voiceActivated && belowRelease
      ? current.belowReleaseSamples + 1
      : 0;
  const voiceActive =
    voiceActivated &&
    belowReleaseSamples < VOICE_RELEASE_SAMPLE_COUNT;
  const speechDetectedNow = voiceActive && !belowRelease;
  const shouldLearnNoiseFloor =
    !current.voiceActive &&
    !aboveThreshold &&
    !current.hasDetectedSpeech;
  const noiseFloorDb = shouldLearnNoiseFloor
    ? current.noiseFloorDb +
      (levelDb - current.noiseFloorDb) * NOISE_FLOOR_SMOOTHING
    : current.noiseFloorDb;

  return {
    aboveThresholdSamples,
    belowReleaseSamples,
    hasDetectedSpeech:
      current.hasDetectedSpeech || speechDetectedNow,
    lastSpeechAtMs: speechDetectedNow
      ? nowMs
      : current.lastSpeechAtMs,
    noiseFloorDb,
    recordingStartedAtMs: current.recordingStartedAtMs,
    voiceActive,
  };
}

export function getDriveSilenceRemainingMs(
  state: DriveVoiceActivityState,
  nowMs: number,
) {
  const silenceStartedAtMs =
    state.lastSpeechAtMs ?? state.recordingStartedAtMs;

  return Math.max(
    0,
    DRIVE_SILENCE_WINDOW_MS - (nowMs - silenceStartedAtMs),
  );
}

export function getDriveCountdownSeconds(
  state: DriveVoiceActivityState,
  nowMs: number,
) {
  if (state.voiceActive) {
    return null;
  }

  return Math.max(
    0,
    Math.ceil(getDriveSilenceRemainingMs(state, nowMs) / 1000),
  );
}
