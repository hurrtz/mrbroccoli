/**
 * Archive extraction for libphonemize language packs.
 *
 * Packs ship as tar.bz2, the same format the speech-model catalogue uses, so
 * extraction reuses the sherpa-onnx wrapper's libarchive-backed extractor
 * rather than adding a second archive implementation.
 */

export async function extractPhonemePackArchive(
  archivePath: string,
  targetPath: string,
) {
  const { extractArchive } = require("react-native-sherpa-onnx/extraction") as
    typeof import("react-native-sherpa-onnx/extraction");

  const modelId =
    archivePath.split("/").pop()?.replace(/\.tar\.bz2$/, "") ?? "phoneme-pack";

  await extractArchive(
    {
      modelId,
      archivePath,
      format: "tar.bz2",
    },
    targetPath,
    { force: true },
  );
}
