import * as FileSystem from "expo-file-system/legacy";

import {
  APP_DATA_BACKUP_SHARE_RETENTION_MS,
  cleanupExpiredBackupShareFiles,
  writeBackupShareFile,
} from "../../src/services/appDataBackupFiles";

describe("appDataBackupFiles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("removes expired shared backups but retains recent attachments", async () => {
    const nowMs = 2_000_000_000_000;
    jest.mocked(FileSystem.readDirectoryAsync).mockResolvedValue([
      "mr-broccoli-backup-old.mrbroccoli.json",
      "mr-broccoli-backup-current.mrbroccoli.encrypted",
      "unrelated-file.txt",
    ]);
    jest.mocked(FileSystem.getInfoAsync).mockImplementation(async (path) => ({
      exists: true,
      isDirectory: false,
      modificationTime:
        path.includes("old")
          ? (nowMs - APP_DATA_BACKUP_SHARE_RETENTION_MS) / 1_000
          : nowMs / 1_000,
      size: 100,
      uri: path,
    }));

    await cleanupExpiredBackupShareFiles(nowMs);

    expect(FileSystem.deleteAsync).toHaveBeenCalledTimes(1);
    expect(FileSystem.deleteAsync).toHaveBeenCalledWith(
      "file:///cache/backups/mr-broccoli-backup-old.mrbroccoli.json",
      { idempotent: true },
    );
  });

  it("writes and verifies a share file without deleting it immediately", async () => {
    jest.mocked(FileSystem.readDirectoryAsync).mockResolvedValue([]);
    jest.mocked(FileSystem.getInfoAsync).mockResolvedValue({
      exists: true,
      isDirectory: false,
      modificationTime: Date.now() / 1_000,
      size: 42,
      uri: "file:///cache/backups/mr-broccoli-backup-test.mrbroccoli.json",
    });

    await expect(
      writeBackupShareFile(
        "backup-content",
        "mr-broccoli-backup-test.mrbroccoli.json",
      ),
    ).resolves.toEqual({
      path: "file:///cache/backups/mr-broccoli-backup-test.mrbroccoli.json",
      sizeBytes: 42,
    });
    expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
  });
});
