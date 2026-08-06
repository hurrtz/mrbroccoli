import { Platform } from "react-native";

import {
  getPhonemePackDownloadUrl,
  getPhonemePacksForLanguage,
  type PhonemePackDefinition,
} from "../constants/phonemePacks";
import type { SpeechLanguage } from "../constants/speechLanguages";

/**
 * Installs libphonemize language packs beside a speech model's data
 * directory.
 *
 * The app ships an espeak-free sherpa-onnx runtime, so Kokoro and Piper
 * phonemization resolves through libphonemize. The runtime loads packs from
 * the directory it receives as the model data directory — the same
 * `espeak-ng-data` folder the speech model download already provisions — so
 * installing a pack means downloading its pinned archive, verifying the
 * SHA-256, and extracting it there.
 *
 * Without a pack for the conversation language the runtime yields no
 * phonemes: speech falls back to the system voice rather than producing
 * wrong pronunciations.
 */

type FsModule = typeof import("@dr.pogodin/react-native-fs");

let fsModule: FsModule | null = null;

function getFsModule(): FsModule {
  if (!fsModule) {
    fsModule =
      require("@dr.pogodin/react-native-fs") as FsModule;
  }

  return fsModule;
}

export interface PhonemePackProgress {
  packId: string;
  phase: "downloading" | "verifying" | "extracting";
  progress: number;
}

export interface PhonemePackInstallStatus {
  packId: string;
  installed: boolean;
}

function packInstallPath(dataDir: string, pack: PhonemePackDefinition) {
  return `${dataDir}/${pack.installedEntry}`;
}

export async function getPhonemePackInstallStatus(
  dataDir: string,
  language: SpeechLanguage,
): Promise<PhonemePackInstallStatus[]> {
  const { exists } = getFsModule();

  return Promise.all(
    getPhonemePacksForLanguage(language).map(async (pack) => ({
      packId: pack.id,
      installed: await exists(packInstallPath(dataDir, pack)),
    })),
  );
}

export async function arePhonemePacksInstalled(
  dataDir: string,
  language: SpeechLanguage,
) {
  const statuses = await getPhonemePackInstallStatus(dataDir, language);

  return statuses.length > 0 && statuses.every(({ installed }) => installed);
}

async function installPack(
  dataDir: string,
  pack: PhonemePackDefinition,
  params?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: PhonemePackProgress) => void;
  },
) {
  const { downloadFile, exists, hash, unlink } = getFsModule();
  const archivePath = `${dataDir}/${pack.id}.tar.bz2`;

  if (params?.abortSignal?.aborted) {
    throw new Error("Phoneme pack installation was cancelled.");
  }

  const task = downloadFile({
    fromUrl: getPhonemePackDownloadUrl(pack),
    toFile: archivePath,
    background: Platform.OS === "ios",
    discretionary: false,
    progress: ({ bytesWritten, contentLength }) => {
      params?.onProgress?.({
        packId: pack.id,
        phase: "downloading",
        progress:
          contentLength > 0
            ? Math.max(0, Math.min(1, bytesWritten / contentLength))
            : 0,
      });
    },
  });

  try {
    const result = await task.promise;

    if (result.statusCode < 200 || result.statusCode >= 300) {
      throw new Error(
        `Phoneme pack ${pack.id} download failed with HTTP ${result.statusCode}.`,
      );
    }

    params?.onProgress?.({
      packId: pack.id,
      phase: "verifying",
      progress: 1,
    });

    const digest = await hash(archivePath, "sha256");

    // Fail closed: an unverified artifact is never extracted, matching the
    // local model catalogue's integrity contract.
    if (digest.toLowerCase() !== pack.sha256) {
      throw new Error(
        `Phoneme pack ${pack.id} did not match its pinned checksum.`,
      );
    }

    params?.onProgress?.({
      packId: pack.id,
      phase: "extracting",
      progress: 1,
    });

    const { extractPhonemePackArchive } = require("./phonemePackArchive") as
      typeof import("./phonemePackArchive");
    await extractPhonemePackArchive(archivePath, dataDir);

    if (!(await exists(packInstallPath(dataDir, pack)))) {
      throw new Error(
        `Phoneme pack ${pack.id} did not produce ${pack.installedEntry}.`,
      );
    }
  } finally {
    if (await exists(archivePath)) {
      await unlink(archivePath).catch(() => undefined);
    }
  }
}

/**
 * Installs every pack the language needs. Already-present packs are skipped
 * so repeated calls are cheap and interrupted installs resume.
 */
export async function installPhonemePacks(
  dataDir: string,
  language: SpeechLanguage,
  params?: {
    abortSignal?: AbortSignal;
    onProgress?: (progress: PhonemePackProgress) => void;
  },
) {
  const { exists } = getFsModule();
  const packs = getPhonemePacksForLanguage(language);

  for (const pack of packs) {
    if (await exists(packInstallPath(dataDir, pack))) {
      continue;
    }

    await installPack(dataDir, pack, params);
  }

  return packs.map(({ id }) => id);
}

export function getPhonemePackDownloadBytes(language: SpeechLanguage) {
  return getPhonemePacksForLanguage(language).reduce(
    (total, pack) => total + pack.downloadBytes,
    0,
  );
}
