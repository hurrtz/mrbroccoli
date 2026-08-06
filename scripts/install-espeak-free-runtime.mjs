#!/usr/bin/env node
// Installs the espeak-free sherpa-onnx runtime into the react-native
// wrapper, replacing the upstream prebuilt that statically links eSpeak NG
// (GPL-3.0). See docs/licensing-and-provider-terms.md for why this is a
// distribution prerequisite.
//
// Sources are the local checkouts of the two supporting repositories:
//   sherpa-onnx-espeak-free  Apache-2.0 fork built with
//                            SHERPA_ONNX_ENABLE_ESPEAK=OFF and routed into
//                            libphonemize
//   libphonemize             Apache-2.0 phonemizer replacing eSpeak NG
//
// Android artifacts land in the wrapper's LOCAL_SDK path
// (android/src/main/jniLibs/<abi>), which its prebuilt-download.gradle
// prefers over any Maven or GitHub download. iOS replaces the vendored
// sherpa_onnx.xcframework. Every installed binary is re-verified for
// eSpeak markers before it is written.
//
// Usage: node scripts/install-espeak-free-runtime.mjs [--check]

import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

const ANDROID_ABIS = [
  { abi: "arm64-v8a", build: "build-android-arm64-v8a" },
  { abi: "armeabi-v7a", build: "build-android-armv7-eabi" },
  { abi: "x86_64", build: "build-android-x86-64" },
  { abi: "x86", build: "build-android-x86" },
];

const ANDROID_LIBRARIES = [
  "libsherpa-onnx-jni.so",
  "libsherpa-onnx-c-api.so",
  "libsherpa-onnx-cxx-api.so",
  "libonnxruntime.so",
];

const forkRoot =
  process.env.SHERPA_ONNX_ESPEAK_FREE_ROOT ??
  resolve(homedir(), "Projects/sherpa-onnx-espeak-free");
const wrapperRoot = resolve(
  process.cwd(),
  "node_modules/react-native-sherpa-onnx",
);
const checkOnly = process.argv.includes("--check");

function fail(message) {
  console.error(`espeak-free runtime: ${message}`);
  process.exit(1);
}

function verify(paths) {
  // The fork's verifier distinguishes real eSpeak markers from sherpa's own
  // Apache-licensed symbol names; a naive grep would false-positive.
  execFileSync(resolve(forkRoot, "scripts/verify-espeak-free.sh"), paths, {
    stdio: "inherit",
  });
}

function requireFile(path, hint) {
  if (!existsSync(path)) {
    fail(`missing ${path}\n  ${hint}`);
  }
  return path;
}

const androidSources = ANDROID_ABIS.map(({ abi, build }) => ({
  abi,
  libraries: ANDROID_LIBRARIES.map((name) =>
    requireFile(
      resolve(forkRoot, build, "install/lib", name),
      `build it with: SHERPA_ONNX_ENABLE_ESPEAK=OFF SHERPA_ONNX_ENABLE_C_API=ON ` +
        `SHERPA_ONNX_LIBPHONEMIZE_ROOT=<libphonemize>/build-android/${abi}/install ` +
        `./${build.replace("build-android-", "build-android-")}.sh`,
    ),
  ),
}));

const iosSource = requireFile(
  resolve(forkRoot, "build-ios/sherpa-onnx.xcframework"),
  "build it with: SHERPA_ONNX_ENABLE_ESPEAK=OFF " +
    "SHERPA_ONNX_LIBPHONEMIZE_IOS_ROOT=<libphonemize>/build-ios ./build-ios.sh",
);

const iosLibraries = readdirSync(iosSource)
  .map((entry) => resolve(iosSource, entry, "libsherpa-onnx.a"))
  .filter((path) => existsSync(path));

if (iosLibraries.length === 0) {
  fail(`no slices found in ${iosSource}`);
}

verify([...androidSources.flatMap(({ libraries }) => libraries), ...iosLibraries]);

if (checkOnly) {
  console.log(
    "espeak-free runtime: sources present and free of eSpeak NG markers",
  );
  process.exit(0);
}

if (!existsSync(wrapperRoot)) {
  fail(`wrapper not installed at ${wrapperRoot}; run npm install first`);
}

for (const { abi, libraries } of androidSources) {
  const target = resolve(wrapperRoot, "android/src/main/jniLibs", abi);
  mkdirSync(target, { recursive: true });
  for (const library of libraries) {
    cpSync(library, resolve(target, library.split("/").pop()));
  }
  console.log(`android ${abi}: ${libraries.length} libraries installed`);
}

const iosTarget = resolve(wrapperRoot, "ios/Frameworks/sherpa_onnx.xcframework");
rmSync(iosTarget, { recursive: true, force: true });
cpSync(iosSource, iosTarget, { recursive: true });
const installedSlices = readdirSync(iosTarget).filter((entry) =>
  statSync(resolve(iosTarget, entry)).isDirectory(),
);
console.log(`ios: ${installedSlices.length} slices installed`);

verify(
  installedSlices.map((slice) =>
    resolve(iosTarget, slice, "libsherpa-onnx.a"),
  ),
);
console.log(
  "espeak-free runtime installed; rebuild native apps to pick it up",
);
