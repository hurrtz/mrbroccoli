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
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";

import {
  applyIosArchiveRootEntryPatch,
  hasIosArchiveRootEntryGuard,
} from "./espeak-free-runtime-patch.mjs";

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
const IOS_ARCHIVE_HELPER = resolve(
  wrapperRoot,
  "ios/archive/sherpa-onnx-archive-helper.mm",
);
// The wrapper resolves prebuilts THIRD_PARTY -> LOCAL_SDK -> MAVEN_AAR. Writing
// only jniLibs (LOCAL_SDK) is not enough: that stage is skipped whenever the
// version stamp is absent or stale, and the build then falls through to the
// upstream Maven AAR, which statically links GPL eSpeak NG and overwrites these
// libraries in place. Staging the same artifacts as THIRD_PARTY keeps the
// espeak-free runtime ahead of that fallback.
const THIRD_PARTY_ANDROID_ROOT = resolve(
  wrapperRoot,
  "third_party/sherpa-onnx-prebuilt/android",
);
// ONNX Runtime version-tags its exported symbols, so sherpa and the runtime it
// was compiled against are one indivisible pair. The wrapper resolves them in
// two independent stages: staging only sherpa leaves onnxruntime resolving from
// Maven, and the app then dies at startup on
// `cannot locate symbol OrtGetApiBase@VERS_<fork version>`. The fork's build
// downloads the exact runtime it links, including the libonnxruntime4j_jni.so
// the Java bridge needs, so stage that same copy as THIRD_PARTY too.
const THIRD_PARTY_ORT_ROOT = resolve(
  wrapperRoot,
  "third_party/onnxruntime_prebuilt/android",
);
const ORT_LIBRARIES = ["libonnxruntime.so", "libonnxruntime4j_jni.so"];
const ORT_VERSION = "1.23.2";
const checkOnly = process.argv.includes("--check");
// Verifies the libraries actually present in the wrapper, i.e. what a build
// would ship — independent of whether the fork checkout exists.
const verifyInstalled = process.argv.includes("--verify-installed");
// postinstall runs everywhere, including machines and CI images that have no
// fork checkout. There it reports and exits cleanly; the release gate is
// where a missing espeak-free runtime must be fatal.
const optional = process.argv.includes("--optional");

function fail(message) {
  if (optional) {
    console.warn(
      `espeak-free runtime: ${message}\n  skipping (optional); run ` +
        `npm run espeak-free:install before building for distribution`,
    );
    process.exit(0);
  }
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

if (verifyInstalled) {
  const installed = [
    ...ANDROID_ABIS.map(({ abi }) =>
      resolve(
        wrapperRoot,
        "android/src/main/jniLibs",
        abi,
        "libsherpa-onnx-jni.so",
      ),
    ),
    ...ANDROID_ABIS.map(({ abi }) =>
      resolve(THIRD_PARTY_ANDROID_ROOT, "jni", abi, "libsherpa-onnx-jni.so"),
    ),
    ...["ios-arm64", "ios-arm64_x86_64-simulator"].map((slice) =>
      resolve(
        wrapperRoot,
        "ios/Frameworks/sherpa_onnx.xcframework",
        slice,
        "libsherpa-onnx.a",
      ),
    ),
  ];
  const missing = installed.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    console.error(
      "espeak-free runtime: the wrapper is missing expected libraries:\n  " +
        missing.join("\n  ") +
        "\n  run: npm run espeak-free:install",
    );
    process.exit(1);
  }
  const helperSource = readFileSync(
    requireFile(
      IOS_ARCHIVE_HELPER,
      "reinstall react-native-sherpa-onnx, then run npm run espeak-free:install",
    ),
    "utf8",
  );
  if (!hasIosArchiveRootEntryGuard(helperSource)) {
    console.error(
      "espeak-free runtime: the iOS archive helper is missing the root-entry guard; " +
        "run npm run espeak-free:install",
    );
    process.exit(1);
  }
  verify(installed);
  console.log(
    `espeak-free runtime: ${installed.length} installed libraries carry no ` +
      "eSpeak NG markers",
  );
  process.exit(0);
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

verify([
  ...androidSources.flatMap(({ libraries }) => libraries),
  ...iosLibraries,
]);

if (checkOnly) {
  console.log(
    "espeak-free runtime: sources present and free of eSpeak NG markers",
  );
  process.exit(0);
}

if (!existsSync(wrapperRoot)) {
  fail(`wrapper not installed at ${wrapperRoot}; run npm install first`);
}

const originalIosArchiveHelper = readFileSync(
  requireFile(
    IOS_ARCHIVE_HELPER,
    "reinstall react-native-sherpa-onnx, then run npm run espeak-free:install",
  ),
  "utf8",
);
const patchedIosArchiveHelper = applyIosArchiveRootEntryPatch(
  originalIosArchiveHelper,
);
if (patchedIosArchiveHelper !== originalIosArchiveHelper) {
  writeFileSync(IOS_ARCHIVE_HELPER, patchedIosArchiveHelper);
  console.log("ios: archive root-entry guard installed");
}

for (const { abi, libraries } of androidSources) {
  const target = resolve(wrapperRoot, "android/src/main/jniLibs", abi);
  mkdirSync(target, { recursive: true });
  for (const library of libraries) {
    cpSync(library, resolve(target, library.split("/").pop()));
  }
  console.log(`android ${abi}: ${libraries.length} libraries installed`);
}

for (const { abi, libraries } of androidSources) {
  const target = resolve(THIRD_PARTY_ANDROID_ROOT, "jni", abi);
  mkdirSync(target, { recursive: true });
  for (const library of libraries) {
    cpSync(library, resolve(target, library.split("/").pop()));
  }
}

for (const { abi } of ANDROID_ABIS) {
  const target = resolve(THIRD_PARTY_ORT_ROOT, "jni", abi);
  mkdirSync(target, { recursive: true });
  for (const library of ORT_LIBRARIES) {
    cpSync(
      requireFile(
        resolve(
          forkRoot,
          ANDROID_ABIS[0].build,
          ORT_VERSION,
          "jni",
          abi,
          library,
        ),
        `rebuild the Android slices so the fork downloads onnxruntime ${ORT_VERSION}`,
      ),
      resolve(target, library),
    );
  }
}
console.log(
  `android third_party: onnxruntime ${ORT_VERSION} staged as the matching pair`,
);

const androidHeaderSource = requireFile(
  resolve(forkRoot, ANDROID_ABIS[0].build, "install/include/sherpa-onnx"),
  "rebuild the Android slices so the C API headers are installed",
);
const androidHeaderTarget = resolve(
  THIRD_PARTY_ANDROID_ROOT,
  "include/sherpa-onnx",
);
rmSync(androidHeaderTarget, { recursive: true, force: true });
cpSync(androidHeaderSource, androidHeaderTarget, { recursive: true });
console.log(
  `android third_party: staged ahead of the upstream Maven AAR at ` +
    THIRD_PARTY_ANDROID_ROOT,
);

const iosTarget = resolve(
  wrapperRoot,
  "ios/Frameworks/sherpa_onnx.xcframework",
);
rmSync(iosTarget, { recursive: true, force: true });
cpSync(iosSource, iosTarget, { recursive: true });
const installedSlices = readdirSync(iosTarget).filter((entry) =>
  statSync(resolve(iosTarget, entry)).isDirectory(),
);
console.log(`ios: ${installedSlices.length} slices installed`);

verify(
  installedSlices.map((slice) => resolve(iosTarget, slice, "libsherpa-onnx.a")),
);
console.log("espeak-free runtime installed; rebuild native apps to pick it up");
