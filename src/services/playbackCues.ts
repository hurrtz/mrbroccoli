import { writeBytesAudioFile } from "./tts/shared";

const SAMPLE_RATE = 16_000;
const INTER_PARAGRAPH_PAUSE_MS = 1_000;
const DRIVE_READY_CUE_MS = 720;
const DRIVE_COUNTDOWN_CUE_MS = 180;

let interParagraphPauseUriPromise: Promise<string> | null = null;
let driveReadyCueUriPromise: Promise<string> | null = null;
const driveCountdownCueUriPromises = new Map<number, Promise<string>>();

function buildMonoPcmWavBytes(
  durationMs: number,
  sampleAt: (timeSeconds: number, progress: number) => number,
) {
  const sampleCount = Math.floor((SAMPLE_RATE * durationMs) / 1_000);
  const dataLength = sampleCount * 2;
  const bytes = new Uint8Array(44 + dataLength);
  const view = new DataView(bytes.buffer);

  view.setUint32(0, 0x52494646, false);
  view.setUint32(4, 36 + dataLength, true);
  view.setUint32(8, 0x57415645, false);
  view.setUint32(12, 0x666d7420, false);
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false);
  view.setUint32(40, dataLength, true);

  for (let index = 0; index < sampleCount; index += 1) {
    const progress = index / Math.max(1, sampleCount - 1);
    const sample = Math.max(
      -1,
      Math.min(1, sampleAt(index / SAMPLE_RATE, progress)),
    );
    view.setInt16(44 + index * 2, Math.round(sample * 32_767), true);
  }

  return bytes;
}

function writeCue(bytes: Uint8Array) {
  return writeBytesAudioFile({
    bytes,
    extension: "wav",
    language: "en",
  });
}

export function getInterParagraphPauseAudioUri() {
  if (!interParagraphPauseUriPromise) {
    interParagraphPauseUriPromise = writeCue(
      buildMonoPcmWavBytes(INTER_PARAGRAPH_PAUSE_MS, () => 0),
    ).catch((error) => {
      interParagraphPauseUriPromise = null;
      throw error;
    });
  }

  return interParagraphPauseUriPromise;
}

export function getDriveReadyCueAudioUri() {
  if (!driveReadyCueUriPromise) {
    driveReadyCueUriPromise = writeCue(
      buildMonoPcmWavBytes(DRIVE_READY_CUE_MS, (time, progress) => {
        const attack = Math.min(1, progress / 0.06);
        const decay = Math.pow(1 - progress, 2.4);
        const firstTone = Math.sin(2 * Math.PI * 523.25 * time);
        const secondTone =
          time < 0.1
            ? 0
            : Math.sin(2 * Math.PI * 659.25 * (time - 0.1));

        return attack * decay * (firstTone * 0.075 + secondTone * 0.055);
      }),
    ).catch((error) => {
      driveReadyCueUriPromise = null;
      throw error;
    });
  }

  return driveReadyCueUriPromise;
}

export function getDriveCountdownCueAudioUri(urgency: number) {
  const normalizedUrgency = Math.max(1, Math.min(3, Math.round(urgency)));
  const existing = driveCountdownCueUriPromises.get(normalizedUrgency);

  if (existing) {
    return existing;
  }

  const cuePromise = writeCue(
    buildMonoPcmWavBytes(DRIVE_COUNTDOWN_CUE_MS, (time, progress) => {
      const attack = Math.min(1, progress / 0.12);
      const decay = Math.pow(1 - progress, 2.8);
      const frequency = 392 + normalizedUrgency * 72;
      const fundamental = Math.sin(2 * Math.PI * frequency * time);
      const overtone = Math.sin(2 * Math.PI * frequency * 1.5 * time);
      const volume = 0.026 + normalizedUrgency * 0.008;

      return attack * decay * volume * (fundamental + overtone * 0.22);
    }),
  ).catch((error) => {
    driveCountdownCueUriPromises.delete(normalizedUrgency);
    throw error;
  });

  driveCountdownCueUriPromises.set(normalizedUrgency, cuePromise);
  return cuePromise;
}
