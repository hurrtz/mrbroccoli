export const DRIVE_SILENCE_WINDOW_MS = 10_000;

const DEFAULT_NOISE_FLOOR_DB = -60;
const MIN_VOICE_THRESHOLD_DB = -48;
const VOICE_THRESHOLD_ABOVE_FLOOR_DB = 10;
const VOICE_RELEASE_ABOVE_FLOOR_DB = 6;
const VOICE_ATTACK_SAMPLE_COUNT = 2;
const SUSTAINED_VOICE_ATTACK_SAMPLE_COUNT = 5;
const STRONG_VOICE_THRESHOLD_ABOVE_FLOOR_DB = 16;
const MIN_STRONG_VOICE_LEVEL_DB = -34;
const MIN_SUSTAINED_VOICE_RANGE_DB = 5;
const VOICE_RELEASE_SAMPLE_COUNT = 3;
const NOISE_FLOOR_RISE_SMOOTHING = 0.12;
const NOISE_FLOOR_FALL_SMOOTHING = 0.02;
const CANDIDATE_NOISE_FLOOR_RISE_SMOOTHING = 0.35;
const MAX_NOISE_FLOOR_RISE_PER_SAMPLE_DB = 2;
const MAX_CANDIDATE_NOISE_FLOOR_RISE_PER_SAMPLE_DB = 4;
const INITIAL_CALIBRATION_MS = 600;
const INITIAL_CALIBRATION_SMOOTHING = 0.28;
const IMMEDIATE_VOICE_LEVEL_DB = -32;

export interface DriveVoiceActivityState {
  aboveThresholdSamples: number;
  belowReleaseSamples: number;
  candidatePeakDb: number | null;
  candidateStartedAtMs: number | null;
  candidateTroughDb: number | null;
  hasDetectedSpeech: boolean;
  lastSpeechAtMs: number | null;
  noiseFloorDb: number;
  recordingStartedAtMs: number;
  strongVoiceSamples: number;
  voiceActive: boolean;
}

export function createDriveVoiceActivityState(
  recordingStartedAtMs: number,
): DriveVoiceActivityState {
  return {
    aboveThresholdSamples: 0,
    belowReleaseSamples: 0,
    candidatePeakDb: null,
    candidateStartedAtMs: null,
    candidateTroughDb: null,
    hasDetectedSpeech: false,
    lastSpeechAtMs: null,
    noiseFloorDb: DEFAULT_NOISE_FLOOR_DB,
    recordingStartedAtMs,
    strongVoiceSamples: 0,
    voiceActive: false,
  };
}

function clampMetering(metering: number) {
  if (!Number.isFinite(metering)) {
    return DEFAULT_NOISE_FLOOR_DB;
  }

  return Math.max(-160, Math.min(0, metering));
}

function learnNoiseFloor(
  noiseFloorDb: number,
  levelDb: number,
  candidateActive: boolean,
) {
  const deltaDb = levelDb - noiseFloorDb;
  if (deltaDb <= 0) {
    return noiseFloorDb + deltaDb * NOISE_FLOOR_FALL_SMOOTHING;
  }

  const smoothing = candidateActive
    ? CANDIDATE_NOISE_FLOOR_RISE_SMOOTHING
    : NOISE_FLOOR_RISE_SMOOTHING;
  const maximumRise = candidateActive
    ? MAX_CANDIDATE_NOISE_FLOOR_RISE_PER_SAMPLE_DB
    : MAX_NOISE_FLOOR_RISE_PER_SAMPLE_DB;

  return noiseFloorDb + Math.min(maximumRise, deltaDb * smoothing);
}

export function getDriveVoiceActivityDiagnostics(
  state: DriveVoiceActivityState,
) {
  return {
    candidateSamples: state.aboveThresholdSamples,
    noiseFloorDb: Math.round(state.noiseFloorDb * 10) / 10,
    releaseThresholdDb:
      Math.round(
        Math.max(
          MIN_VOICE_THRESHOLD_DB - 4,
          state.noiseFloorDb + VOICE_RELEASE_ABOVE_FLOOR_DB,
        ) * 10,
      ) / 10,
    strongVoiceSamples: state.strongVoiceSamples,
    voiceThresholdDb:
      Math.round(
        Math.max(
          MIN_VOICE_THRESHOLD_DB,
          state.noiseFloorDb + VOICE_THRESHOLD_ABOVE_FLOOR_DB,
        ) * 10,
      ) / 10,
  };
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
      candidatePeakDb: null,
      candidateStartedAtMs: null,
      candidateTroughDb: null,
      noiseFloorDb:
        current.noiseFloorDb +
        (levelDb - current.noiseFloorDb) *
          INITIAL_CALIBRATION_SMOOTHING,
      strongVoiceSamples: 0,
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

  if (current.voiceActive) {
    const belowReleaseSamples = belowRelease
      ? current.belowReleaseSamples + 1
      : 0;
    const voiceActive =
      belowReleaseSamples < VOICE_RELEASE_SAMPLE_COUNT;
    const speechDetectedNow = voiceActive && !belowRelease;

    return {
      aboveThresholdSamples: 0,
      belowReleaseSamples,
      candidatePeakDb: null,
      candidateStartedAtMs: null,
      candidateTroughDb: null,
      hasDetectedSpeech: true,
      lastSpeechAtMs: speechDetectedNow
        ? nowMs
        : current.lastSpeechAtMs,
      noiseFloorDb: voiceActive
        ? current.noiseFloorDb
        : learnNoiseFloor(current.noiseFloorDb, levelDb, false),
      recordingStartedAtMs: current.recordingStartedAtMs,
      strongVoiceSamples: 0,
      voiceActive,
    };
  }

  if (!aboveThreshold) {
    return {
      aboveThresholdSamples: 0,
      belowReleaseSamples: 0,
      candidatePeakDb: null,
      candidateStartedAtMs: null,
      candidateTroughDb: null,
      hasDetectedSpeech: current.hasDetectedSpeech,
      lastSpeechAtMs: current.lastSpeechAtMs,
      noiseFloorDb: learnNoiseFloor(
        current.noiseFloorDb,
        levelDb,
        false,
      ),
      recordingStartedAtMs: current.recordingStartedAtMs,
      strongVoiceSamples: 0,
      voiceActive: false,
    };
  }

  const aboveThresholdSamples = current.aboveThresholdSamples + 1;
  const candidatePeakDb = Math.max(
    current.candidatePeakDb ?? levelDb,
    levelDb,
  );
  const candidateTroughDb = Math.min(
    current.candidateTroughDb ?? levelDb,
    levelDb,
  );
  const strongVoiceThresholdDb = Math.max(
    MIN_STRONG_VOICE_LEVEL_DB,
    current.noiseFloorDb + STRONG_VOICE_THRESHOLD_ABOVE_FLOOR_DB,
  );
  const strongVoiceSamples =
    levelDb >= strongVoiceThresholdDb
      ? current.strongVoiceSamples + 1
      : 0;
  const candidateRangeDb = candidatePeakDb - candidateTroughDb;
  const voiceActive =
    strongVoiceSamples >= VOICE_ATTACK_SAMPLE_COUNT ||
    (aboveThresholdSamples >= SUSTAINED_VOICE_ATTACK_SAMPLE_COUNT &&
      candidateRangeDb >= MIN_SUSTAINED_VOICE_RANGE_DB);

  return {
    aboveThresholdSamples,
    belowReleaseSamples: 0,
    candidatePeakDb,
    candidateStartedAtMs: current.candidateStartedAtMs ?? nowMs,
    candidateTroughDb,
    hasDetectedSpeech: current.hasDetectedSpeech || voiceActive,
    lastSpeechAtMs: voiceActive ? nowMs : current.lastSpeechAtMs,
    noiseFloorDb: voiceActive
      ? current.noiseFloorDb
      : learnNoiseFloor(current.noiseFloorDb, levelDb, true),
    recordingStartedAtMs: current.recordingStartedAtMs,
    strongVoiceSamples,
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
  if (state.voiceActive || state.aboveThresholdSamples > 0) {
    return null;
  }

  return Math.max(
    0,
    Math.ceil(getDriveSilenceRemainingMs(state, nowMs) / 1000),
  );
}
