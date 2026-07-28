import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const paths = {
  appConfig: "app.json",
  package: "package.json",
  packageLock: "package-lock.json",
  androidBuild: "android/app/build.gradle",
  iosInfo: "ios/MrBroccoli/Info.plist",
  iosProject: "ios/MrBroccoli.xcodeproj/project.pbxproj",
};
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

function abort(message) {
  console.error(`Version bump failed: ${message}`);
  process.exit(1);
}

function parseArguments(args) {
  const dryRun = args.includes("--dry-run");
  const unknownOptions = args.filter(
    (argument) => argument.startsWith("--") && argument !== "--dry-run",
  );
  const versions = args.filter((argument) => !argument.startsWith("--"));

  if (unknownOptions.length > 0) {
    abort(`unknown option ${unknownOptions[0]}`);
  }
  if (versions.length !== 1 || !versionPattern.test(versions[0])) {
    abort(
      "provide exactly one numeric version, for example: npm run version:bump -- 2.4.3",
    );
  }

  return { dryRun, targetVersion: versions[0] };
}

function compareVersions(left, right) {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);

  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
}

function replaceExactlyOnce(label, source, pattern, replacement) {
  const matches = [...source.matchAll(pattern)];
  if (matches.length !== 1) {
    abort(`${label} must occur exactly once; found ${matches.length}`);
  }
  return source.replace(pattern, replacement);
}

function verifyNativeConfig() {
  return spawnSync(
    process.execPath,
    [resolve(root, "scripts/verify-native-config-sync.mjs")],
    {
      cwd: root,
      stdio: "inherit",
    },
  ).status === 0;
}

const { dryRun, targetVersion } = parseArguments(process.argv.slice(2));
const original = Object.fromEntries(
  Object.entries(paths).map(([key, path]) => [
    key,
    readFileSync(resolve(root, path), "utf8"),
  ]),
);

if (!verifyNativeConfig()) {
  abort("the current native configuration is already out of sync");
}

const appConfig = JSON.parse(original.appConfig);
const packageJson = JSON.parse(original.package);
const packageLock = JSON.parse(original.packageLock);
const currentVersion = appConfig.expo?.version;
const versionCodeMatches = [
  ...original.androidBuild.matchAll(/^\s*versionCode\s+(\d+)\s*$/gm),
];
const iosBundleVersionMatches = [
  ...original.iosInfo.matchAll(
    /<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/g,
  ),
];
const iosProjectVersionMatches = [
  ...original.iosProject.matchAll(
    /CURRENT_PROJECT_VERSION = (\d+);/g,
  ),
];

if (!versionPattern.test(currentVersion ?? "")) {
  abort(`app.json has an invalid Expo version: ${JSON.stringify(currentVersion)}`);
}
if (compareVersions(targetVersion, currentVersion) <= 0) {
  abort(
    `target version ${targetVersion} must be greater than current version ${currentVersion}`,
  );
}
if (versionCodeMatches.length !== 1) {
  abort(
    `Android versionCode must occur exactly once; found ${versionCodeMatches.length}`,
  );
}
if (iosBundleVersionMatches.length !== 1) {
  abort(
    `iOS CFBundleVersion must occur exactly once; found ${iosBundleVersionMatches.length}`,
  );
}
if (iosProjectVersionMatches.length === 0) {
  abort("iOS CURRENT_PROJECT_VERSION was not found");
}

const androidVersionCode = Number(versionCodeMatches[0][1]);
const nextAndroidVersionCode = androidVersionCode + 1;
const iosBuildNumber = Number(iosBundleVersionMatches[0][1]);
if (
  iosProjectVersionMatches.some(
    (match) => Number(match[1]) !== iosBuildNumber,
  )
) {
  abort(
    "iOS CURRENT_PROJECT_VERSION values must match CFBundleVersion",
  );
}
const nextIosBuildNumber = iosBuildNumber + 1;
appConfig.expo.version = targetVersion;
packageJson.version = targetVersion;
packageLock.version = targetVersion;
packageLock.packages[""].version = targetVersion;

const updated = {
  appConfig: `${JSON.stringify(appConfig, null, 2)}\n`,
  package: `${JSON.stringify(packageJson, null, 2)}\n`,
  packageLock: `${JSON.stringify(packageLock, null, 2)}\n`,
  androidBuild: replaceExactlyOnce(
    "Android versionName",
    replaceExactlyOnce(
      "Android versionCode",
      original.androidBuild,
      /^(\s*versionCode\s+)\d+(\s*)$/gm,
      `$1${nextAndroidVersionCode}$2`,
    ),
    /^(\s*versionName\s+)"[^"]+"(\s*)$/gm,
    `$1"${targetVersion}"$2`,
  ),
  iosInfo: replaceExactlyOnce(
    "iOS CFBundleVersion",
    replaceExactlyOnce(
      "iOS CFBundleShortVersionString",
      original.iosInfo,
      /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/g,
      `$1${targetVersion}$2`,
    ),
    /(<key>CFBundleVersion<\/key>\s*<string>)\d+(<\/string>)/g,
    `$1${nextIosBuildNumber}$2`,
  ),
  iosProject: original.iosProject
    .replace(
      /MARKETING_VERSION = [^;]+;/g,
      `MARKETING_VERSION = ${targetVersion};`,
    )
    .replace(
      /CURRENT_PROJECT_VERSION = \d+;/g,
      `CURRENT_PROJECT_VERSION = ${nextIosBuildNumber};`,
    ),
};

if (dryRun) {
  console.log(
    `Would bump ${currentVersion} -> ${targetVersion}, Android versionCode ${androidVersionCode} -> ${nextAndroidVersionCode}, and iOS build ${iosBuildNumber} -> ${nextIosBuildNumber}.`,
  );
  process.exit(0);
}

for (const [key, path] of Object.entries(paths)) {
  writeFileSync(resolve(root, path), updated[key]);
}

if (!verifyNativeConfig()) {
  for (const [key, path] of Object.entries(paths)) {
    writeFileSync(resolve(root, path), original[key]);
  }
  abort("post-bump verification failed; restored the previous version files");
}

console.log(
  `Bumped ${currentVersion} -> ${targetVersion}, Android versionCode ${androidVersionCode} -> ${nextAndroidVersionCode}, and iOS build ${iosBuildNumber} -> ${nextIosBuildNumber}.`,
);
