// Pin the Android System TTS bridge to installed offline voices. Expo ships
// a prebuilt AAR; package.json selects this module for compilation from source.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const version = "57.0.3";
const upstreamDigest =
  "2cdc688bd36d3913ca80e8088d248c77a4897886f44dc525c9af932978862010";
const patchedDigest =
  "664bde2f222188b323a9265b50e848d0bee7f8e0845253f0fff0d6999b0aa037";
const patch = fileURLToPath(
  new URL("./android-offline-speech.patch", import.meta.url),
);
const dependency = join(process.cwd(), "node_modules", "expo-speech");
const app = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);
if (!app.expo?.autolinking?.android?.buildFromSource?.includes("expo-speech")) {
  throw new Error(
    "Android must build expo-speech from the reviewed offline-voice source.",
  );
}
const installed = JSON.parse(
  readFileSync(join(dependency, "package.json"), "utf8"),
);
const file = join(
  dependency,
  "android/src/main/java/expo/modules/speech/SpeechModule.kt",
);
const checksum = (bytes) => createHash("sha256").update(bytes).digest("hex");
const current = checksum(readFileSync(file));
if (
  installed.version !== version ||
  ![upstreamDigest, patchedDigest].includes(current)
) {
  throw new Error(
    "Review the Android offline-voice patch for the installed expo-speech version and source.",
  );
}
if (current !== patchedDigest) {
  if (process.argv.includes("--check")) {
    throw new Error("Install the Android offline-voice patch before building.");
  }
  const source = execFileSync("patch", ["-s", "-o", "-", file, patch]);
  if (checksum(source) !== patchedDigest) {
    throw new Error(
      "The Android offline-voice patch produced an unexpected source file.",
    );
  }
  writeFileSync(file, source);
}
