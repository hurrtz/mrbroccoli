import { createHash } from "node:crypto";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const BUNDLE_MAPPING_ENTRY =
  "BUNDLE-METADATA/com.android.tools.build.obfuscation/proguard.map";
export const BUNDLE_NATIVE_SYMBOL_PREFIX =
  "BUNDLE-METADATA/com.android.tools.build.debugsymbols/";

const SHERPA_JNI_FIELDS = {
  "com.k2fsa.sherpa.onnx.GeneratedAudio": ["samples", "sampleRate"],
  "com.k2fsa.sherpa.onnx.GenerationConfig": [
    "silenceScale",
    "speed",
    "sid",
    "referenceAudio",
    "referenceSampleRate",
    "referenceText",
    "numSteps",
    "extra",
  ],
  "com.k2fsa.sherpa.onnx.OfflineTts": ["config", "ptr"],
  "com.k2fsa.sherpa.onnx.OfflineTtsConfig": [
    "model",
    "ruleFsts",
    "ruleFars",
    "maxNumSentences",
    "silenceScale",
  ],
  "com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig": [
    "model",
    "voices",
    "tokens",
    "dataDir",
    "lexicon",
    "lang",
    "dictDir",
    "lengthScale",
  ],
  "com.k2fsa.sherpa.onnx.OfflineTtsModelConfig": [
    "vits",
    "matcha",
    "kokoro",
    "zipvoice",
    "kitten",
    "pocket",
    "supertonic",
    "numThreads",
    "debug",
    "provider",
  ],
};

const RELEASE_PATHS = {
  bundle: "android/app/build/outputs/bundle/release/app-release.aab",
  mapping: "android/app/build/outputs/mapping/release/mapping.txt",
  nativeSymbols:
    "android/app/build/outputs/native-debug-symbols/release/native-debug-symbols.zip",
};

export function parseAndroidVersionCode(androidBuild) {
  const match = androidBuild.match(/^\s*versionCode\s+(\d+)\s*$/m);

  if (!match) {
    throw new Error("Could not read Android versionCode from app/build.gradle");
  }

  return Number(match[1]);
}

export function inspectBundleMetadataEntries(entries) {
  if (!entries.includes(BUNDLE_MAPPING_ENTRY)) {
    throw new Error(
      `AAB does not contain the R8 mapping at ${BUNDLE_MAPPING_ENTRY}`,
    );
  }

  const nativeSymbolEntries = entries.filter(
    (entry) =>
      entry.startsWith(BUNDLE_NATIVE_SYMBOL_PREFIX) && entry.endsWith(".so.sym"),
  );

  if (nativeSymbolEntries.length === 0) {
    throw new Error("AAB does not contain native debug symbol tables");
  }

  const abis = [
    ...new Set(
      nativeSymbolEntries.map((entry) =>
        entry.slice(BUNDLE_NATIVE_SYMBOL_PREFIX.length).split("/")[0],
      ),
    ),
  ].sort();

  return { abis, nativeSymbolEntries };
}

export function verifyExternalNativeSymbols(bundleEntries, archiveEntries) {
  const expected = bundleEntries.map((entry) =>
    entry.slice(BUNDLE_NATIVE_SYMBOL_PREFIX.length),
  );
  const available = new Set(archiveEntries);
  const missing = expected.filter((entry) => !available.has(entry));

  if (missing.length > 0) {
    throw new Error(
      `Native symbol archive is missing ${missing.length} symbol table(s) embedded in the AAB`,
    );
  }
}

export function verifySherpaJniMapping(mappingText) {
  const classMappings = new Map();
  const fieldMappings = new Map();
  let currentClass = null;

  for (const line of mappingText.split(/\r?\n/)) {
    const classMatch = line.match(/^([^\s].*?) -> (.*):$/);
    if (classMatch) {
      currentClass = classMatch[1];
      classMappings.set(currentClass, classMatch[2]);
      continue;
    }

    if (!currentClass || line.includes("(")) {
      continue;
    }

    const fieldMatch = line.match(
      /^\s{4}(?:.+\s)?([A-Za-z_$][\w$]*) -> ([A-Za-z_$][\w$]*)$/,
    );
    if (fieldMatch) {
      const currentFields = fieldMappings.get(currentClass) ?? new Map();
      currentFields.set(fieldMatch[1], fieldMatch[2]);
      fieldMappings.set(currentClass, currentFields);
    }
  }

  const classNames = Object.keys(SHERPA_JNI_FIELDS);
  const missing = classNames.filter(
    (className) => !classMappings.has(className),
  );
  if (missing.length > 0) {
    throw new Error(
      `R8 mapping is missing Sherpa JNI class(es): ${missing.join(", ")}`,
    );
  }

  const renamed = classNames.flatMap((className) => {
    const mappedName = classMappings.get(className);
    return mappedName === className ? [] : [`${className} -> ${mappedName}`];
  });
  if (renamed.length > 0) {
    throw new Error(
      `R8 renamed Sherpa JNI class(es): ${renamed.join(", ")}`,
    );
  }

  const unsafeFields = Object.entries(SHERPA_JNI_FIELDS).flatMap(
    ([className, expectedFields]) => {
      const mappings = fieldMappings.get(className) ?? new Map();
      return expectedFields.flatMap((fieldName) => {
        const mappedName = mappings.get(fieldName);
        return mappedName && mappedName !== fieldName
          ? [`${className}.${fieldName} -> ${mappedName}`]
          : [];
      });
    },
  );
  if (unsafeFields.length > 0) {
    throw new Error(
      `R8 renamed Sherpa JNI field(s): ${unsafeFields.join(", ")}`,
    );
  }
}

// Runtime strings that only appear when GPL eSpeak NG (or piper-phonemize,
// which embeds it) is linked into a library. The espeak-free gate runs before
// Gradle, so it cannot see the wrapper resolving upstream prebuilts mid-build
// and overwriting the installed runtime; this checks what actually ships.
// Sherpa's own Apache-licensed sources mention "espeak" in setup hints and in
// the espeak-free stub's diagnostic, so a naive grep false-positives. These are
// the signals the fork's scripts/verify-espeak-free.sh treats as conclusive:
// the data-path environment variable and default data directory that only the
// real runtime embeds, plus piper's eSpeak phonemizer implementation.
export const ESPEAK_MARKERS = [
  "ESPEAK_DATA_PATH",
  "/usr/share/espeak-ng-data",
  "phonemize_eSpeak",
];

export function findEspeakMarkers(contents, markers = ESPEAK_MARKERS) {
  const text = Buffer.from(contents).toString("latin1");
  return markers.filter((marker) => text.includes(marker));
}

// ONNX Runtime version-tags its exported symbols, so a library built against
// one runtime cannot load against another. sherpa and onnxruntime resolve from
// independent stages in the wrapper, so they can drift apart and produce an AAB
// that passes every content check and then dies on launch with
// `cannot locate symbol OrtGetApiBase@VERS_<x>`. Compare what is required
// against what ships.
export function findVersionedSymbolRequirement(symbolTable, symbol) {
  const required = new Set();
  const provided = new Set();

  for (const line of symbolTable.split("\n")) {
    const match = line.match(
      new RegExp(`(\\S)\\s+${symbol}@+([A-Za-z0-9_.]+)\\s*$`),
    );

    if (!match) {
      continue;
    }

    if (match[1] === "U") {
      required.add(match[2]);
    } else {
      provided.add(match[2]);
    }
  }

  return { provided: [...provided].sort(), required: [...required].sort() };
}

function verifyBundleNativeAbisMatch(bundle, bundleEntries) {
  const abis = [
    ...new Set(
      bundleEntries
        .filter((entry) => entry.startsWith("base/lib/"))
        .map((entry) => entry.split("/")[2]),
    ),
  ].sort();

  for (const abi of abis) {
    const read = (library) => {
      const extracted = spawnSync(
        "unzip",
        ["-p", bundle, `base/lib/${abi}/${library}`],
        { maxBuffer: 1024 * 1024 * 1024 },
      );

      if (extracted.status !== 0 || !extracted.stdout) {
        return null;
      }

      const temporary = `${bundle}.${abi}.${library}.tmp`;
      writeFileSync(temporary, extracted.stdout);
      const symbols = spawnSync("nm", ["-D", temporary], { encoding: "utf8" });
      rmSync(temporary, { force: true });

      return symbols.status === 0 ? symbols.stdout : null;
    };

    const consumer = read("libsherpa-onnx-jni.so");
    const runtime = read("libonnxruntime.so");

    if (!consumer || !runtime) {
      continue;
    }

    const { required } = findVersionedSymbolRequirement(
      consumer,
      "OrtGetApiBase",
    );
    const { provided } = findVersionedSymbolRequirement(
      runtime,
      "OrtGetApiBase",
    );

    const unsatisfied = required.filter((version) => !provided.includes(version));

    if (unsatisfied.length > 0) {
      throw new Error(
        `${abi}: libsherpa-onnx-jni.so requires OrtGetApiBase@${unsatisfied.join(", ")} ` +
          `but the bundled libonnxruntime.so provides ${provided.join(", ") || "nothing"}. ` +
          "sherpa and onnxruntime came from different sources; the app will fail to " +
          "start. Run `npm run espeak-free:install` and rebuild.",
      );
    }
  }

  return abis;
}

function verifyBundleIsEspeakFree(bundle, bundleEntries) {
  const libraries = bundleEntries.filter(
    (entry) => entry.startsWith("base/lib/") && entry.endsWith(".so"),
  );

  if (libraries.length === 0) {
    throw new Error(`${bundle} contains no native libraries under base/lib/`);
  }

  const offenders = libraries.flatMap((entry) => {
    const result = spawnSync("unzip", ["-p", bundle, entry], {
      maxBuffer: 1024 * 1024 * 1024,
    });

    if (result.status !== 0 || !result.stdout) {
      throw new Error(`Could not read ${entry} from ${bundle}`);
    }

    const found = findEspeakMarkers(result.stdout);
    return found.length > 0 ? [`${entry}: ${found.join(", ")}`] : [];
  });

  if (offenders.length > 0) {
    throw new Error(
      "GPL eSpeak NG markers found in shipped native libraries. The build " +
        "resolved upstream prebuilts instead of the espeak-free runtime; run " +
        "`npm run espeak-free:install` and rebuild:\n  " +
        offenders.join("\n  "),
    );
  }

  return libraries.length;
}

function requireNonEmptyFile(file, label) {
  if (!existsSync(file)) {
    throw new Error(`${label} does not exist: ${file}`);
  }

  const stats = statSync(file);

  if (!stats.isFile() || stats.size === 0) {
    throw new Error(`${label} is empty: ${file}`);
  }

  return stats.size;
}

function listArchiveEntries(archive) {
  const result = spawnSync("unzip", ["-Z1", archive], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Could not inspect ${archive}: ${result.stderr.trim() || `unzip exited ${result.status}`}`,
    );
  }

  return result.stdout.split(/\r?\n/).filter(Boolean);
}

function listArchiveEntrySizes(archive) {
  const result = spawnSync("unzip", ["-l", archive], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(
      `Could not inspect sizes in ${archive}: ${result.stderr.trim() || `unzip exited ${result.status}`}`,
    );
  }

  return parseArchiveSizeListing(result.stdout);
}

export function parseArchiveSizeListing(listing) {
  return listing.split(/\r?\n/).flatMap((line) => {
    const match = line.match(
      /^\s*(\d+)\s+\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}\s+(.+)$/,
    );

    return match ? [{ bytes: Number(match[1]), path: match[2] }] : [];
  });
}

export function inspectAndroidBundleSize({ bundleBytes, budget, entries }) {
  if (budget.schemaVersion !== 1) {
    throw new Error(
      `Unsupported release size budget schema: ${budget.schemaVersion}`,
    );
  }

  const androidBudget = budget.android;
  if (
    !androidBudget ||
    !Number.isSafeInteger(androidBudget.aabMaxBytes) ||
    !Number.isSafeInteger(androidBudget.arm64NativeMaxBytes) ||
    !Number.isSafeInteger(androidBudget.bundledOnnxMaxBytes)
  ) {
    throw new Error("Android release size budget is incomplete");
  }

  const nativeBytesByAbi = {};
  let bundledOnnxBytes = 0;

  for (const entry of entries) {
    const nativeMatch = entry.path.match(/^base\/lib\/([^/]+)\/[^/]+\.so$/);
    if (nativeMatch) {
      const abi = nativeMatch[1];
      nativeBytesByAbi[abi] = (nativeBytesByAbi[abi] ?? 0) + entry.bytes;
    }

    if (/^base\/assets\/.*\.onnx$/i.test(entry.path)) {
      bundledOnnxBytes += entry.bytes;
    }
    if (/^base\/assets\/.*kokoro/i.test(entry.path)) {
      throw new Error(
        `Optional Kokoro model asset must not be bundled: ${entry.path}`,
      );
    }
  }

  const arm64NativeBytes = nativeBytesByAbi["arm64-v8a"] ?? 0;
  const failures = [];

  if (bundleBytes > androidBudget.aabMaxBytes) {
    failures.push(
      `AAB is ${bundleBytes} bytes; budget is ${androidBudget.aabMaxBytes}`,
    );
  }
  if (arm64NativeBytes > androidBudget.arm64NativeMaxBytes) {
    failures.push(
      `arm64 native payload is ${arm64NativeBytes} bytes; budget is ${androidBudget.arm64NativeMaxBytes}`,
    );
  }
  if (bundledOnnxBytes > androidBudget.bundledOnnxMaxBytes) {
    failures.push(
      `bundled ONNX payload is ${bundledOnnxBytes} bytes; budget is ${androidBudget.bundledOnnxMaxBytes}`,
    );
  }

  if (failures.length > 0) {
    throw new Error(`Android release size budget exceeded: ${failures.join("; ")}`);
  }

  return {
    bundleBytes,
    bundledOnnxBytes,
    nativeBytesByAbi,
  };
}

async function sha256(file) {
  const hash = createHash("sha256");

  await new Promise((resolve, reject) => {
    const stream = createReadStream(file);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.once("error", reject);
    stream.once("end", () => resolve());
  });

  return hash.digest("hex");
}

export async function verifyAndArchiveAndroidRelease({
  cwd = process.cwd(),
  stdout = process.stdout,
} = {}) {
  const resolveFromRoot = (relativePath) => path.resolve(cwd, relativePath);
  const bundle = resolveFromRoot(RELEASE_PATHS.bundle);
  const mapping = resolveFromRoot(RELEASE_PATHS.mapping);
  const nativeSymbols = resolveFromRoot(RELEASE_PATHS.nativeSymbols);
  const bundleBytes = requireNonEmptyFile(bundle, "Release AAB");
  const mappingBytes = requireNonEmptyFile(mapping, "R8 mapping");
  const nativeSymbolBytes = requireNonEmptyFile(
    nativeSymbols,
    "Native debug symbol archive",
  );
  const mappingText = readFileSync(mapping, "utf8");

  if (!mappingText.includes("# compiler: R8")) {
    throw new Error("Release mapping was not generated by R8");
  }
  verifySherpaJniMapping(mappingText);

  const bundleEntries = listArchiveEntries(bundle);
  const bundleEntrySizes = listArchiveEntrySizes(bundle);
  const metadata = inspectBundleMetadataEntries(bundleEntries);
  const nativeArchiveEntries = listArchiveEntries(nativeSymbols);
  verifyExternalNativeSymbols(metadata.nativeSymbolEntries, nativeArchiveEntries);
  const espeakFreeLibraryCount = verifyBundleIsEspeakFree(bundle, bundleEntries);
  const linkedAbis = verifyBundleNativeAbisMatch(bundle, bundleEntries);
  const sizeBudget = JSON.parse(
    readFileSync(resolveFromRoot("config/release-size-budget.json"), "utf8"),
  );
  const sizeReport = inspectAndroidBundleSize({
    budget: sizeBudget,
    bundleBytes,
    entries: bundleEntrySizes,
  });

  const appConfig = JSON.parse(
    readFileSync(resolveFromRoot("app.json"), "utf8"),
  ).expo;
  const versionCode = parseAndroidVersionCode(
    readFileSync(resolveFromRoot("android/app/build.gradle"), "utf8"),
  );
  const inputs = [
    { source: bundle, name: "app-release.aab", bytes: bundleBytes },
    { source: mapping, name: "mapping.txt", bytes: mappingBytes },
    {
      source: nativeSymbols,
      name: "native-debug-symbols.zip",
      bytes: nativeSymbolBytes,
    },
  ];
  const artifacts = [];

  for (const input of inputs) {
    artifacts.push({
      file: input.name,
      bytes: input.bytes,
      sha256: await sha256(input.source),
    });
  }

  const releaseId = `${appConfig.version}-${versionCode}`;
  const bundleId = artifacts[0].sha256.slice(0, 12);
  const archiveDirectory = resolveFromRoot(
    `artifacts/releases/android/${releaseId}/${bundleId}`,
  );
  mkdirSync(archiveDirectory, { recursive: true });

  for (const input of inputs) {
    copyFileSync(input.source, path.join(archiveDirectory, input.name));
  }

  writeFileSync(
    path.join(archiveDirectory, "SHA256SUMS"),
    `${artifacts.map(({ file, sha256: digest }) => `${digest}  ${file}`).join("\n")}\n`,
  );
  writeFileSync(
    path.join(archiveDirectory, "release-artifacts.json"),
    `${JSON.stringify(
      {
        schemaVersion: 1,
        packageName: appConfig.android.package,
        versionName: appConfig.version,
        versionCode,
        bundleMetadata: {
          r8Mapping: BUNDLE_MAPPING_ENTRY,
          nativeSymbolAbis: metadata.abis,
          nativeSymbolTableCount: metadata.nativeSymbolEntries.length,
        },
        sizeReport,
        artifacts,
      },
      null,
      2,
    )}\n`,
  );

  stdout.write(
    [
      `Android release artifacts verified for ${appConfig.version} (${versionCode}).`,
      `R8 mapping: ${BUNDLE_MAPPING_ENTRY}`,
      `Native symbols: ${metadata.nativeSymbolEntries.length} tables across ${metadata.abis.join(", ")}`,
      `espeak-free: ${espeakFreeLibraryCount} shipped libraries carry no eSpeak NG markers`,
      `native linkage: sherpa resolves onnxruntime in ${linkedAbis.join(", ")}`,
      `AAB size: ${sizeReport.bundleBytes} bytes (arm64 native: ${sizeReport.nativeBytesByAbi["arm64-v8a"] ?? 0}; bundled ONNX: ${sizeReport.bundledOnnxBytes})`,
      `Archived: ${path.relative(cwd, archiveDirectory)}`,
      "",
    ].join("\n"),
  );

  return { archiveDirectory, artifacts, metadata, sizeReport };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    await verifyAndArchiveAndroidRelease();
  } catch (error) {
    process.stderr.write(
      `Android release artifact verification failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
