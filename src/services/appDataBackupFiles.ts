import * as FileSystem from "expo-file-system/legacy";

export const APP_DATA_BACKUP_SHARE_RETENTION_MS = 24 * 60 * 60 * 1_000;

const BACKUP_DIRECTORY_NAME = "backups";
const BACKUP_FILE_PREFIX = "mr-broccoli-backup-";

function getBackupDirectory() {
  return FileSystem.cacheDirectory
    ? `${FileSystem.cacheDirectory}${BACKUP_DIRECTORY_NAME}/`
    : null;
}

export async function cleanupExpiredBackupShareFiles(
  nowMs = Date.now(),
) {
  const directory = getBackupDirectory();
  if (!directory) {
    return;
  }

  let names: string[];
  try {
    names = await FileSystem.readDirectoryAsync(directory);
  } catch {
    return;
  }

  await Promise.all(
    names
      .filter((name) => name.startsWith(BACKUP_FILE_PREFIX))
      .map(async (name) => {
        const path = `${directory}${name}`;
        try {
          const info = await FileSystem.getInfoAsync(path);
          const modifiedAtMs =
            info.exists && typeof info.modificationTime === "number"
              ? info.modificationTime * 1_000
              : nowMs;
          if (nowMs - modifiedAtMs >= APP_DATA_BACKUP_SHARE_RETENTION_MS) {
            await FileSystem.deleteAsync(path, { idempotent: true });
          }
        } catch {
          // Cache cleanup must never prevent the user from exporting a backup.
        }
      }),
  );
}

export async function writeBackupShareFile(
  content: string,
  fileName: string,
) {
  const directory = getBackupDirectory();
  if (!directory) {
    throw new Error("cache-unavailable");
  }

  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  await cleanupExpiredBackupShareFiles();

  const path = `${directory}${fileName}`;
  await FileSystem.writeAsStringAsync(path, content);
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    throw new Error("backup-file-missing");
  }

  return {
    path,
    sizeBytes: typeof info.size === "number" ? info.size : null,
  };
}
