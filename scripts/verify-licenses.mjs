import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const noticesPath = path.join(root, "THIRD_PARTY_NOTICES.md");

const APPROVED_LICENSES = new Set([
  "0BSD",
  "Apache-2.0",
  "BlueOak-1.0.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "CC-BY-4.0",
  "CC0-1.0",
  "ISC",
  "MIT",
  "MIT AND Apache-2.0",
  "MIT AND OFL-1.1",
  "MPL-2.0",
  "Python-2.0",
  "Unlicense",
  "(MIT OR Apache-2.0)",
  "(MIT OR CC0-1.0)",
  "(BSD-3-Clause OR GPL-2.0)",
]);

const LICENSE_OVERRIDES = new Map([
  ["exit@0.1.2", "MIT"],
  ["jscodeshift@0.11.0", "MIT"],
]);

const LICENSE_FILE_CANDIDATES = [
  "LICENSE",
  "LICENSE.md",
  "LICENSE.txt",
  "LICENSE-MIT",
  "COPYING",
  "COPYING.md",
  "license",
  "license.md",
  "license.txt",
];

const NATIVE_LICENSES = [
  {
    name: "react-native-sherpa-onnx",
    license: "MIT",
    source: "node_modules/react-native-sherpa-onnx/LICENSE",
  },
  {
    name: "sherpa-onnx",
    license: "Apache-2.0",
    source:
      "node_modules/react-native-sherpa-onnx/THIRD_PARTY_LICENSES/sherpa-onnx.txt",
  },
  {
    name: "ONNX Runtime",
    license: "MIT",
    source:
      "node_modules/react-native-sherpa-onnx/THIRD_PARTY_LICENSES/onnxruntime.txt",
  },
  {
    name: "libarchive",
    license: "BSD-2-Clause",
    source:
      "node_modules/react-native-sherpa-onnx/THIRD_PARTY_LICENSES/libarchive.txt",
  },
  {
    name: "zstd",
    license: "BSD-3-Clause",
    source:
      "node_modules/react-native-sherpa-onnx/THIRD_PARTY_LICENSES/zstd.txt",
  },
  {
    name: "llama.cpp",
    license: "MIT",
    source: "node_modules/llama.rn/cpp/LICENSE",
  },
];

const REVIEWED_SHERPA_MODEL_LICENSE_ROWS = [
  "sherpa-onnx-whisper-tiny.tar.bz2,mit,yes,high,manual,https://github.com/openai/whisper/",
  "kokoro-int8-multi-lang-v1_1.tar.bz2,apache-2.0,yes,high,archive_license_file,kokoro-int8-multi-lang-v1_1/LICENSE",
  "vits-piper-en_US-kristin-medium-int8.tar.bz2,public-domain,yes,high,manual,https://huggingface.co/csukuangfj/vits-piper-en_US-kristin-medium",
  "vits-piper-de_DE-thorsten-medium-int8.tar.bz2,cc0,yes,high,manual,https://huggingface.co/rhasspy/piper-voices/tree/main",
  "vits-piper-es_ES-sharvard-medium-int8.tar.bz2,cc-by-3.0,yes,high,manual,https://huggingface.co/rhasspy/piper-voices/tree/main",
  "vits-piper-fr_FR-siwis-medium-int8.tar.bz2,cc-by-4.0,yes,medium,huggingface_model_card,https://huggingface.co/csukuangfj/vits-piper-fr_FR-siwis-medium",
  "vits-piper-pt_BR-faber-medium-int8.tar.bz2,cc0,yes,high,manual,https://huggingface.co/rhasspy/piper-voices/tree/main",
];

function fail(message) {
  throw new Error(message);
}

export function resolvedLicense(packageInfo) {
  return (
    LICENSE_OVERRIDES.get(`${packageInfo.name}@${packageInfo.version}`) ??
    packageInfo.license ??
    "UNKNOWN"
  );
}

export function isApprovedLicense(license) {
  return APPROVED_LICENSES.has(license);
}

function collectProductionPackages() {
  const result = spawnSync(
    "npm",
    ["ls", "--omit=dev", "--all", "--json", "--long"],
    {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    },
  );

  if (result.status !== 0) {
    fail(`npm dependency inventory failed:\n${result.stderr.trim()}`);
  }

  const dependencyTree = JSON.parse(result.stdout);
  const byPath = new Map();

  function visit(node) {
    for (const [name, dependency] of Object.entries(node.dependencies ?? {})) {
      if (!dependency.path || !dependency.version) {
        // npm includes unresolved optional and peer edges as empty objects.
        // They are not installed or distributed and therefore have no local
        // license artifact to inventory.
        continue;
      }

      byPath.set(dependency.path, {
        name,
        version: dependency.version,
        license: dependency.license,
        packagePath: dependency.path,
      });
      visit(dependency);
    }
  }

  visit(dependencyTree);
  return [...byPath.values()];
}

function normalizeLicenseText(text) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}

function readLicenseText(packageInfo) {
  for (const filename of LICENSE_FILE_CANDIDATES) {
    const candidate = path.join(packageInfo.packagePath, filename);

    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return normalizeLicenseText(fs.readFileSync(candidate, "utf8"));
    }
  }

  return "";
}

function verifyNativeLicenses() {
  const podfile = fs.readFileSync(path.join(root, "ios/Podfile"), "utf8");
  const gradleProperties = fs.readFileSync(
    path.join(root, "android/gradle.properties"),
    "utf8",
  );
  const modelLicenseCsv = fs.readFileSync(
    path.join(
      root,
      "node_modules/react-native-sherpa-onnx/android/src/main/assets/model_licenses/tts-models-license-status.csv",
    ),
    "utf8",
  );
  const asrModelLicenseCsv = fs.readFileSync(
    path.join(
      root,
      "node_modules/react-native-sherpa-onnx/android/src/main/assets/model_licenses/asr-models-license-status.csv",
    ),
    "utf8",
  );

  if (!podfile.includes("ENV['SHERPA_ONNX_DISABLE_FFMPEG'] = '1'")) {
    fail("iOS must keep Sherpa FFmpeg disabled");
  }
  if (!gradleProperties.includes("sherpaOnnxDisableFfmpeg=true")) {
    fail("Android must keep Sherpa FFmpeg disabled");
  }
  for (const row of REVIEWED_SHERPA_MODEL_LICENSE_ROWS) {
    const registry = row.startsWith("sherpa-onnx-whisper-")
      ? asrModelLicenseCsv
      : modelLicenseCsv;
    if (!registry.includes(row)) {
      fail(`A reviewed Sherpa model license record changed: ${row}`);
    }
  }

  for (const entry of NATIVE_LICENSES) {
    if (!fs.existsSync(path.join(root, entry.source))) {
      fail(`Missing native license text: ${entry.source}`);
    }
  }
}

function packageKey(packageInfo) {
  return `${packageInfo.name}@${packageInfo.version}`;
}

function renderNotices(packages) {
  const uniquePackages = new Map();

  for (const packageInfo of packages) {
    const key = packageKey(packageInfo);

    if (!uniquePackages.has(key)) {
      uniquePackages.set(key, {
        ...packageInfo,
        license: resolvedLicense(packageInfo),
        licenseText: readLicenseText(packageInfo),
      });
    }
  }

  const groups = new Map();

  for (const packageInfo of uniquePackages.values()) {
    const fingerprint = createHash("sha256")
      .update(`${packageInfo.license}\0${packageInfo.licenseText}`)
      .digest("hex");
    const group = groups.get(fingerprint) ?? {
      license: packageInfo.license,
      licenseText: packageInfo.licenseText,
      packages: [],
    };
    group.packages.push(packageKey(packageInfo));
    groups.set(fingerprint, group);
  }

  const sections = [...groups.values()]
    .map((group) => ({
      ...group,
      packages: group.packages.sort((left, right) => left.localeCompare(right)),
    }))
    .sort((left, right) => left.packages[0].localeCompare(right.packages[0]))
    .map((group) => {
      const licenseBody = group.licenseText
        ? `\n\`\`\`text\n${group.licenseText}\n\`\`\`\n`
        : "\nThe installed package declares this SPDX license but does not ship a separate license file.\n";

      return [
        `### ${group.packages[0]}`,
        "",
        group.packages.length === 1
          ? `License: ${group.license}`
          : `Packages (${group.packages.length}): ${group.packages.join(", ")}`,
        group.packages.length === 1 ? "" : `\nLicense: ${group.license}`,
        licenseBody,
      ]
        .filter((line) => line !== "")
        .join("\n");
    });

  const nativeSections = NATIVE_LICENSES.map((entry) => {
    const licenseText = normalizeLicenseText(
      fs.readFileSync(path.join(root, entry.source), "utf8"),
    );
    return [
      `### ${entry.name}`,
      "",
      `License: ${entry.license}`,
      "",
      "```text",
      licenseText,
      "```",
    ].join("\n");
  });

  return [
    "# Third-party notices",
    "",
    "Mr Broccoli's original materials are proprietary. The packages and native",
    "components below retain their own licenses. This file is generated by",
    "`scripts/verify-licenses.mjs`; do not edit it by hand.",
    "",
    "Optional on-device models are downloaded only after user action and are not",
    "bundled. Their separate licenses and source links are shown in the catalogue",
    "and reviewed in `docs/licensing-and-provider-terms.md`.",
    "",
    "## JavaScript and React Native packages",
    "",
    ...sections,
    "## Native on-device runtimes",
    "",
    ...nativeSections,
    "",
  ].join("\n");
}

export function verifyLicenses({ write = false } = {}) {
  const packages = collectProductionPackages();
  const failures = packages
    .map((packageInfo) => ({
      package: packageKey(packageInfo),
      license: resolvedLicense(packageInfo),
    }))
    .filter((entry) => !isApprovedLicense(entry.license));

  if (failures.length > 0) {
    fail(
      [
        "Unreviewed production dependency licenses:",
        ...failures.map((entry) => `- ${entry.package}: ${entry.license}`),
      ].join("\n"),
    );
  }

  verifyNativeLicenses();
  const expectedNotices = renderNotices(packages);

  if (write) {
    fs.writeFileSync(noticesPath, expectedNotices);
  } else if (
    !fs.existsSync(noticesPath) ||
    fs.readFileSync(noticesPath, "utf8") !== expectedNotices
  ) {
    fail(
      "THIRD_PARTY_NOTICES.md is stale; run npm run license:notices:generate",
    );
  }

  const uniquePackages = new Set(packages.map(packageKey));
  process.stdout.write(
    `License review passed for ${uniquePackages.size} production packages and ${NATIVE_LICENSES.length} native components.\n`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    verifyLicenses({ write: process.argv.includes("--write") });
  } catch (error) {
    process.stderr.write(
      `License review failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
