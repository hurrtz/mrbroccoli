import * as FileSystem from "expo-file-system/legacy";

const ACTIVE_CAPTURE_FILE_NAME = "debug-log-active.jsonl";
const LEGACY_ACTIVE_CAPTURE_FILE_NAME = "debug-log-active.log";
const MAX_RETAINED_LOGS = 5;

let writeQueue = Promise.resolve();

export function ensureLogsDirectory() {
  const baseDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;
  if (!baseDirectory) {
    throw new Error("No writable directory available for debug logs.");
  }
  return `${baseDirectory}debug-logs/`;
}

export function getActiveCapturePath() {
  return `${ensureLogsDirectory()}${ACTIVE_CAPTURE_FILE_NAME}`;
}

export function getLegacyActiveCapturePath() {
  return `${ensureLogsDirectory()}${LEGACY_ACTIVE_CAPTURE_FILE_NAME}`;
}

export function queueDebugLogWrite<T>(task: () => Promise<T>) {
  const queued = writeQueue.catch(() => undefined).then(task);
  writeQueue = queued.then(
    () => undefined,
    () => undefined,
  );
  return queued;
}

export async function writeAtomic(path: string, content: string) {
  const tempPath = `${path}.tmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await FileSystem.writeAsStringAsync(tempPath, content);
  try {
    await FileSystem.moveAsync({ from: tempPath, to: path });
  } catch (error) {
    await FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(
      () => undefined,
    );
    throw error;
  }
}

export async function pruneCompletedLogs() {
  const directory = ensureLogsDirectory();
  const names = await FileSystem.readDirectoryAsync(directory).catch(() => []);
  const retained = names
    .filter((name) => /^(?:debug-log-\d+-.+|recovered-\d+)\.log$/.test(name))
    .sort()
    .reverse();
  await Promise.all(
    retained
      .slice(MAX_RETAINED_LOGS)
      .map((name) =>
        FileSystem.deleteAsync(`${directory}${name}`, { idempotent: true }),
      ),
  );
}
