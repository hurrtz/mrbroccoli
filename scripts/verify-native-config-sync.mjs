import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import parsePng from "parse-png";

const root = process.cwd();
const readText = (path) => readFileSync(resolve(root, path), "utf8");
const readBytes = (path) => readFileSync(resolve(root, path));
const appConfig = JSON.parse(readText("app.json")).expo;
const packageJson = JSON.parse(readText("package.json"));
const packageLock = JSON.parse(readText("package-lock.json"));
const iosInfo = readText("ios/MrBroccoli/Info.plist");
const iosProject = readText("ios/MrBroccoli.xcodeproj/project.pbxproj");
const androidBuild = readText("android/app/build.gradle");
const androidManifest = readText(
  "android/app/src/main/AndroidManifest.xml",
);
const androidStrings = readText(
  "android/app/src/main/res/values/strings.xml",
);
const androidAdaptiveIcon = readText(
  "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml",
);
const iosAppIconContents = JSON.parse(
  readText("ios/MrBroccoli/Images.xcassets/AppIcon.appiconset/Contents.json"),
);

const failures = [];
let checkCount = 0;

function assertIncludes(label, source, expected) {
  checkCount += 1;
  if (!source.includes(expected)) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}`);
  }
}

function assertEqual(label, actual, expected) {
  checkCount += 1;
  if (actual !== expected) {
    failures.push(
      `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}

function assertAllEqual(label, actual, expected) {
  checkCount += 1;
  if (actual.length === 0) {
    failures.push(`${label}: no values found`);
    return;
  }

  const mismatches = actual.filter((value) => value !== expected);
  if (mismatches.length > 0) {
    failures.push(
      `${label}: expected every value to be ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function pngFingerprint(path) {
  const image = await parsePng(readBytes(path));
  return `${image.width}x${image.height}:${sha256(image.data)}`;
}

const iosBundleIdentifier = appConfig.ios?.bundleIdentifier;
const androidPackage = appConfig.android?.package;
const scheme = appConfig.scheme;
const iconPath = appConfig.icon?.replace(/^\.\//, "");
const iosIconPath = appConfig.ios?.icon?.replace(/^\.\//, "");
const androidIconPath = appConfig.android?.icon?.replace(/^\.\//, "");
const adaptiveForegroundPath =
  appConfig.android?.adaptiveIcon?.foregroundImage?.replace(/^\.\//, "");
const adaptiveBackgroundPath =
  appConfig.android?.adaptiveIcon?.backgroundImage?.replace(/^\.\//, "");
const adaptiveMonochromePath =
  appConfig.android?.adaptiveIcon?.monochromeImage?.replace(/^\.\//, "");
const iosMarketingVersions = [
  ...iosProject.matchAll(/MARKETING_VERSION = ([^;]+);/g),
].map((match) => match[1]);
const iosBundleVersion =
  iosInfo.match(
    /<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/,
  )?.[1] ?? null;
const iosProjectVersions = [
  ...iosProject.matchAll(/CURRENT_PROJECT_VERSION = ([^;]+);/g),
].map((match) => match[1]);

assertEqual("package.json version", packageJson.version, appConfig.version);
assertEqual("package-lock.json version", packageLock.version, appConfig.version);
assertEqual(
  'package-lock.json packages[""] version',
  packageLock.packages?.[""]?.version,
  appConfig.version,
);
assertEqual(
  "supported platforms",
  JSON.stringify(appConfig.platforms),
  JSON.stringify(["ios", "android"]),
);
assertIncludes(
  "iOS display name",
  iosInfo,
  `<string>${appConfig.name}</string>`,
);
assertIncludes(
  "Android display name",
  androidStrings,
  `>${appConfig.name}</string>`,
);
assertIncludes("iOS URL scheme", iosInfo, `<string>${scheme}</string>`);
assertIncludes(
  "Android URL scheme",
  androidManifest,
  `android:scheme="${scheme}"`,
);
assertIncludes(
  "iOS bundle identifier",
  iosProject,
  `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleIdentifier};`,
);
assertIncludes(
  "iOS Live Activity bundle identifier",
  iosProject,
  `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleIdentifier}.liveactivity;`,
);
assertIncludes(
  "Android namespace",
  androidBuild,
  `namespace '${androidPackage}'`,
);
assertIncludes(
  "Android application ID",
  androidBuild,
  `applicationId '${androidPackage}'`,
);
assertAllEqual(
  "iOS marketing version",
  iosMarketingVersions,
  appConfig.version,
);
assertIncludes(
  "iOS short version",
  iosInfo,
  `<string>${appConfig.version}</string>`,
);
assertIncludes(
  "Android version",
  androidBuild,
  `versionName "${appConfig.version}"`,
);
assertEqual(
  "iOS bundle version format",
  /^\d+$/.test(iosBundleVersion ?? ""),
  true,
);
assertAllEqual(
  "iOS project build version",
  iosProjectVersions,
  iosBundleVersion,
);
assertEqual("shared and iOS icon path", iosIconPath, iconPath);
assertEqual("shared and Android legacy icon path", androidIconPath, iconPath);
assertEqual(
  "Android adaptive foreground path",
  adaptiveForegroundPath,
  "assets/appIcon/android-adaptive-foreground.png",
);
assertEqual(
  "Android adaptive background path",
  adaptiveBackgroundPath,
  "assets/appIcon/android-background.png",
);
assertEqual(
  "Android adaptive monochrome path",
  adaptiveMonochromePath,
  "assets/appIcon/android-adaptive-monochrome.png",
);
const adaptiveForeground = await parsePng(readBytes(adaptiveForegroundPath));
const adaptiveBackground = await parsePng(readBytes(adaptiveBackgroundPath));
const adaptiveMonochrome = await parsePng(readBytes(adaptiveMonochromePath));
assertEqual(
  "Android adaptive icon dimensions",
  JSON.stringify([
    adaptiveForeground.width,
    adaptiveForeground.height,
    adaptiveBackground.width,
    adaptiveBackground.height,
    adaptiveMonochrome.width,
    adaptiveMonochrome.height,
  ]),
  JSON.stringify([1024, 1024, 1024, 1024, 1024, 1024]),
);
assertEqual(
  "Android adaptive monochrome transparency",
  adaptiveMonochrome.data.some(
    (value, index) => index % 4 === 3 && value < 255,
  ),
  true,
);
assertIncludes(
  "Android adaptive background resource",
  androidAdaptiveIcon,
  '@mipmap/ic_launcher_background',
);
assertIncludes(
  "Android adaptive foreground resource",
  androidAdaptiveIcon,
  '@mipmap/ic_launcher_foreground',
);
assertIncludes(
  "Android adaptive monochrome resource",
  androidAdaptiveIcon,
  '@mipmap/ic_launcher_monochrome',
);
assertEqual(
  "iOS app icon asset",
  iosAppIconContents.images?.some(
    (image) => image.filename === "App-Icon-1024x1024@1x.png",
  ),
  true,
);
assertEqual(
  "iOS app icon content",
  await pngFingerprint(iconPath),
  await pngFingerprint(
    "ios/MrBroccoli/Images.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png",
  ),
);

if (failures.length > 0) {
  console.error("Native configuration is out of sync with app.json:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Native configuration matches app.json across ${checkCount} checks.`,
  );
}
