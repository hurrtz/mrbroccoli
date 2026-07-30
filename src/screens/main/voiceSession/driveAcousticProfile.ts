const DEFAULT_NOISE_FLOOR_DB = -60;
const MIN_METERING_DB = -160;
const MAX_METERING_DB = 0;
const AMBIENT_WINDOW_SAMPLE_COUNT = 12;
const AMBIENT_NOISE_PERCENTILE = 0.25;
const INITIAL_NOISE_SMOOTHING = 0.28;
const NORMAL_NOISE_SMOOTHING = 0.1;
const RAPID_NOISE_SMOOTHING = 0.4;
const RAPID_ENVIRONMENT_SHIFT_DB = 8;
const SPEECH_LEVEL_SMOOTHING = 0.18;

export interface DriveAcousticProfile {
  ambientLevelsDb: number[];
  ambientSampleCount: number;
  audioRoute: string | null;
  noiseFloorDb: number;
  speechLevelDb: number | null;
  speechSampleCount: number;
  updatedAtMs: number | null;
}

export interface DriveAcousticProfileDiagnostics {
  ambientSampleCount: number;
  audioRoute: string | null;
  noiseFloorDb: number;
  speechLevelDb: number | null;
  speechSampleCount: number;
}

function clampMetering(levelDb: number) {
  if (!Number.isFinite(levelDb)) {
    return DEFAULT_NOISE_FLOOR_DB;
  }

  return Math.max(
    MIN_METERING_DB,
    Math.min(MAX_METERING_DB, levelDb),
  );
}

function roundDb(levelDb: number | null) {
  return levelDb === null
    ? null
    : Math.round(levelDb * 10) / 10;
}

function percentile(values: number[], fraction: number) {
  if (values.length === 0) {
    return DEFAULT_NOISE_FLOOR_DB;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * fraction)),
  );

  return sorted[index];
}

export function createDriveAcousticProfile(
  audioRoute: string | null = null,
): DriveAcousticProfile {
  return {
    ambientLevelsDb: [],
    ambientSampleCount: 0,
    audioRoute,
    noiseFloorDb: DEFAULT_NOISE_FLOOR_DB,
    speechLevelDb: null,
    speechSampleCount: 0,
    updatedAtMs: null,
  };
}

export function updateDriveAcousticProfileRoute(
  current: DriveAcousticProfile,
  audioRoute: string | null,
) {
  if (!audioRoute || current.audioRoute === audioRoute) {
    return {
      profile: current,
      reset: false,
    };
  }

  if (current.audioRoute === null) {
    return {
      profile: {
        ...current,
        audioRoute,
      },
      reset: false,
    };
  }

  return {
    profile: createDriveAcousticProfile(audioRoute),
    reset: true,
  };
}

export function updateDriveAcousticProfileFromAmbient(
  current: DriveAcousticProfile,
  meteringDb: number,
  nowMs: number,
): DriveAcousticProfile {
  const levelDb = clampMetering(meteringDb);
  const ambientLevelsDb = [
    ...current.ambientLevelsDb,
    levelDb,
  ].slice(-AMBIENT_WINDOW_SAMPLE_COUNT);
  const estimatedNoiseFloorDb = percentile(
    ambientLevelsDb,
    AMBIENT_NOISE_PERCENTILE,
  );
  const shiftDb = Math.abs(
    estimatedNoiseFloorDb - current.noiseFloorDb,
  );
  const smoothing =
    current.ambientSampleCount < 3
      ? INITIAL_NOISE_SMOOTHING
      : shiftDb >= RAPID_ENVIRONMENT_SHIFT_DB &&
          ambientLevelsDb.length >= AMBIENT_WINDOW_SAMPLE_COUNT
        ? RAPID_NOISE_SMOOTHING
        : NORMAL_NOISE_SMOOTHING;

  return {
    ...current,
    ambientLevelsDb,
    ambientSampleCount: current.ambientSampleCount + 1,
    noiseFloorDb:
      current.noiseFloorDb +
      (estimatedNoiseFloorDb - current.noiseFloorDb) * smoothing,
    updatedAtMs: nowMs,
  };
}

export function updateDriveAcousticProfileFromRecording(
  current: DriveAcousticProfile,
  params: {
    meteringDb: number;
    noiseFloorDb: number;
    nowMs: number;
    voiceActive: boolean;
  },
): DriveAcousticProfile {
  const meteringDb = clampMetering(params.meteringDb);
  const speechLevelDb = params.voiceActive
    ? current.speechLevelDb === null
      ? meteringDb
      : current.speechLevelDb +
        (meteringDb - current.speechLevelDb) *
          SPEECH_LEVEL_SMOOTHING
    : current.speechLevelDb;

  return {
    ...current,
    noiseFloorDb: clampMetering(params.noiseFloorDb),
    speechLevelDb,
    speechSampleCount:
      current.speechSampleCount + (params.voiceActive ? 1 : 0),
    updatedAtMs: params.nowMs,
  };
}

export function getDriveAcousticProfileDiagnostics(
  profile: DriveAcousticProfile,
): DriveAcousticProfileDiagnostics {
  return {
    ambientSampleCount: profile.ambientSampleCount,
    audioRoute: profile.audioRoute,
    noiseFloorDb: roundDb(profile.noiseFloorDb) ?? DEFAULT_NOISE_FLOOR_DB,
    speechLevelDb: roundDb(profile.speechLevelDb),
    speechSampleCount: profile.speechSampleCount,
  };
}
