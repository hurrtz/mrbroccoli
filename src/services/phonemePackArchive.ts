/**
 * Archive extraction for libphonemize language packs.
 *
 * Packs ship as tar.bz2, the same format the speech-model catalogue uses, so
 * extraction reuses the sherpa-onnx wrapper's libarchive-backed extractor
 * rather than adding a second archive implementation. The extractor replaces
 * its target directory when `force` is set. It must therefore never receive
 * the live `espeak-ng-data` directory: doing so would delete the archive
 * before it can be read, then delete a previously installed companion pack.
 */

export async function extractPhonemePackArchive(
  archivePath: string,
  targetPath: string,
  installedEntry: string,
) {
  // Keep the service import-safe in Jest and unsupported native builds.
  const { exists, mkdir, moveFile, unlink } =
    require("@dr.pogodin/react-native-fs") as typeof import("@dr.pogodin/react-native-fs");
  const { extractArchive } = require("react-native-sherpa-onnx/extraction") as
    typeof import("react-native-sherpa-onnx/extraction");

  const modelId =
    archivePath.split("/").pop()?.replace(/\.tar\.bz2$/, "") ?? "phoneme-pack";
  const stagingPath = `${targetPath}.extract-${modelId}-${Date.now()}`;
  const stagedEntry = `${stagingPath}/${installedEntry}`;
  const destination = `${targetPath}/${installedEntry}`;

  if (await exists(stagingPath)) {
    await unlink(stagingPath);
  }

  try {
    await extractArchive(
      {
        modelId,
        archivePath,
        format: "tar.bz2",
      },
      stagingPath,
      { force: true },
    );
    if (!(await exists(stagedEntry))) {
      throw new Error(
        `Phoneme pack ${modelId} did not produce ${installedEntry}.`,
      );
    }
    await mkdir(targetPath, { NSURLIsExcludedFromBackupKey: true });
    if (await exists(destination)) {
      await unlink(destination);
    }
    await moveFile(stagedEntry, destination);
  } finally {
    if (await exists(stagingPath)) {
      await unlink(stagingPath).catch(() => undefined);
    }
  }
}
