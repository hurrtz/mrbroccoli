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
const easConfig = JSON.parse(readText("eas.json"));
const iosInfo = readText("ios/MrBroccoli/Info.plist");
const iosPodfile = readText("ios/Podfile");
const iosPodfileLock = readText("ios/Podfile.lock");
const iosPodfileProperties = JSON.parse(readText("ios/Podfile.properties.json"));
const iosProject = readText("ios/MrBroccoli.xcodeproj/project.pbxproj");
const iosProductionScheme = readText(
  "ios/MrBroccoli.xcodeproj/xcshareddata/xcschemes/MrBroccoli.xcscheme",
);
const iosStoreKitScheme = readText(
  "ios/MrBroccoli.xcodeproj/xcshareddata/xcschemes/MrBroccoli-StoreKit.xcscheme",
);
const iosStoreKitConfiguration = JSON.parse(
  readText("ios/MrBroccoli/MrBroccoli.storekit"),
);
const premiumConstants = readText("src/constants/premium.ts");
const premiumEntitlementContext = readText(
  "src/context/PremiumEntitlementContext.tsx",
);
const developmentEntitlement = readText(
  "src/services/developmentEntitlement.ts",
);
const premiumProductId = premiumConstants.match(
  /PREMIUM_PRODUCT_ID\s*=\s*\n?\s*"([^"]+)"/,
)?.[1];
const androidBuild = readText("android/app/build.gradle");
const androidGradleProperties = readText("android/gradle.properties");
const androidProguardRules = readText("android/app/proguard-rules.pro");
const androidManifest = readText(
  "android/app/src/main/AndroidManifest.xml",
);
const imagePickerPlugin = appConfig.plugins?.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === "expo-image-picker",
);
const imagePickerOptions = imagePickerPlugin?.[1] ?? {};
const androidStrings = readText(
  "android/app/src/main/res/values/strings.xml",
);
const androidDebugStrings = readText(
  "android/app/src/debug/res/values/strings.xml",
);
const androidInstrumentation = readText(
  "scripts/run-android-instrumentation.mjs",
);
const androidDiagnostics = readText(
  "android/app/src/main/java/com/tobiaswinkler/app/mrbroccoli/MrBroccoliDiagnosticsModule.kt",
);
const androidBackupCrypto = readText(
  "android/app/src/main/java/com/tobiaswinkler/app/mrbroccoli/MrBroccoliBackupCryptoModule.kt",
);
const androidNativePackage = readText(
  "android/app/src/main/java/com/tobiaswinkler/app/mrbroccoli/MrBroccoliNativeWaveformPackage.kt",
);
const iosDiagnostics = readText("ios/MrBroccoli/MrBroccoliDiagnostics.swift");
const iosDiagnosticsBridge = readText(
  "ios/MrBroccoli/MrBroccoliDiagnosticsBridge.m",
);
const iosArchiveDirectory = readText(
  "ios/MrBroccoli/MrBroccoliArchiveDirectory.m",
);
const iosBackupCrypto = readText("ios/MrBroccoli/MrBroccoliBackupCrypto.m");
const androidAdaptiveIcon = readText(
  "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml",
);
const iosAppIconContents = JSON.parse(
  readText("ios/MrBroccoli/Images.xcassets/AppIcon.appiconset/Contents.json"),
);
const iosDevelopmentAppIconContents = JSON.parse(
  readText(
    "ios/MrBroccoli/Images.xcassets/AppIconDev.appiconset/Contents.json",
  ),
);

const failures = [];
let checkCount = 0;

function assertIncludes(label, source, expected) {
  checkCount += 1;
  if (!source.includes(expected)) {
    failures.push(`${label}: expected ${JSON.stringify(expected)}`);
  }
}

function assertExcludes(label, source, unexpected) {
  checkCount += 1;
  if (source.includes(unexpected)) {
    failures.push(`${label}: did not expect ${JSON.stringify(unexpected)}`);
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
const iosDevelopmentBundleIdentifier = `${iosBundleIdentifier}.dev`;
const iosDeploymentTarget = appConfig.ios?.deploymentTarget;
const androidPackage = appConfig.android?.package;
const androidDevelopmentPackage = `${androidPackage}.dev`;
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
const iosBundleIdentifiers = [
  ...iosProject.matchAll(/PRODUCT_BUNDLE_IDENTIFIER = ([^;]+);/g),
].map((match) => match[1].replace(/^"(.*)"$/, "$1"));

assertIncludes(
  "iOS camera permission",
  iosInfo,
  `<key>NSCameraUsageDescription</key>\n\t<string>${imagePickerOptions.cameraPermission}</string>`,
);
assertIncludes(
  "iOS photo permission",
  iosInfo,
  `<key>NSPhotoLibraryUsageDescription</key>\n\t<string>${imagePickerOptions.photosPermission}</string>`,
);
assertIncludes(
  "Android camera permission",
  androidManifest,
  '<uses-permission android:name="android.permission.CAMERA"/>',
);
assertIncludes(
  "Android Debug application ID suffix",
  androidBuild,
  "buildTypes {\n        debug {\n            applicationIdSuffix '.dev'",
);
assertIncludes(
  "Android Maestro application ID suffix belongs to Release build type",
  androidBuild,
  "release {\n            if ((findProperty('mrBroccoliMaestroVariant') ?: 'false').toBoolean()) {\n                applicationIdSuffix '.maestro'",
);
assertExcludes(
  "Premium entitlement does not depend on __DEV__",
  premiumEntitlementContext,
  "__DEV__",
);
assertExcludes(
  "Premium entitlement does not depend on NODE_ENV",
  premiumEntitlementContext,
  "NODE_ENV",
);
assertIncludes(
  "Development entitlement is gated by application ID suffix",
  developmentEntitlement,
  "applicationId?.endsWith(DEVELOPMENT_APPLICATION_ID_SUFFIX) === true",
);
assertIncludes(
  "Maestro entitlement is gated by its isolated application ID suffix",
  developmentEntitlement,
  "applicationId?.endsWith(MAESTRO_APPLICATION_ID_SUFFIX) === true",
);
assertExcludes(
  "Development entitlement does not depend on __DEV__",
  developmentEntitlement,
  "__DEV__",
);
assertExcludes(
  "Development entitlement does not depend on NODE_ENV",
  developmentEntitlement,
  "NODE_ENV",
);
const iosDeploymentTargets = [
  ...iosProject.matchAll(/IPHONEOS_DEPLOYMENT_TARGET = ([^;]+);/g),
].map((match) => match[1]);
const sqlitePlugin = appConfig.plugins.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === "expo-sqlite",
);
const iapPlugin = appConfig.plugins.find(
  (plugin) =>
    plugin === "expo-iap" ||
    (Array.isArray(plugin) && plugin[0] === "expo-iap"),
);

assertEqual("package.json version", packageJson.version, appConfig.version);
assertEqual("EAS version source", easConfig.cli?.appVersionSource, "local");
assertEqual(
  "EAS production auto increment",
  easConfig.build?.production?.autoIncrement ?? false,
  false,
);
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
assertEqual(
  "Expo SQLite FTS plugin",
  sqlitePlugin?.[1]?.enableFTS,
  true,
);
assertEqual("Expo IAP plugin", Boolean(iapPlugin), true);
assertEqual(
  "Expo IAP package",
  packageJson.dependencies?.["expo-iap"],
  "^5.0.0",
);
assertEqual(
  "Expo IAP lockfile package",
  packageLock.packages?.["node_modules/expo-iap"]?.version,
  "5.0.0",
);
assertIncludes("iOS Expo IAP pod", iosPodfileLock, "- ExpoIap (5.0.0):");
assertIncludes("iOS OpenIAP pod", iosPodfileLock, "- openiap (3.0.0)");
assertIncludes(
  "iOS OpenIAP resource",
  iosProject,
  '"${PODS_ROOT}/openiap/openiap-versions.json"',
);
assertEqual(
  "Premium product ID",
  premiumProductId,
  "com.tobiaswinkler.app.mrbroccoli.premium.lifetime",
);
assertIncludes(
  "iOS In-App Purchase capability",
  iosProject,
  "com.apple.InAppPurchase = {",
);
assertIncludes(
  "iOS StoreKit configuration project reference",
  iosProject,
  "MrBroccoli.storekit",
);
assertEqual(
  "iOS StoreKit product count",
  iosStoreKitConfiguration.products?.length,
  1,
);
const premiumStoreKitProduct = iosStoreKitConfiguration.products?.[0];
assertEqual(
  "iOS StoreKit product ID",
  premiumStoreKitProduct?.productID,
  premiumProductId,
);
assertEqual(
  "iOS StoreKit product type",
  premiumStoreKitProduct?.type,
  "NonConsumable",
);
assertEqual(
  "iOS StoreKit product price",
  premiumStoreKitProduct?.displayPrice,
  "14.99",
);
assertIncludes(
  "iOS local StoreKit scheme",
  iosStoreKitScheme,
  'identifier = "../MrBroccoli/MrBroccoli.storekit"',
);
assertEqual(
  "iOS production scheme StoreKit isolation",
  iosProductionScheme.includes("StoreKitConfigurationFileReference"),
  false,
);
assertEqual(
  "iOS SQLite FTS build property",
  iosPodfileProperties["expo.sqlite.enableFTS"],
  "true",
);
assertIncludes(
  "Android SQLite FTS build property",
  androidGradleProperties,
  "expo.sqlite.enableFTS=true",
);
assertIncludes(
  "iOS configuration-specific display name",
  iosInfo,
  "<string>$(APP_DISPLAY_NAME)</string>",
);
assertIncludes(
  "iOS Debug display name",
  iosProject,
  `APP_DISPLAY_NAME = "${appConfig.name} Dev";`,
);
assertIncludes(
  "iOS Debug app icon",
  iosProject,
  "ASSETCATALOG_COMPILER_APPICON_NAME = AppIconDev;",
);
assertIncludes(
  "iOS Release display name",
  iosProject,
  `APP_DISPLAY_NAME = "${appConfig.name}$(MR_BROCCOLI_LOCAL_DISPLAY_SUFFIX)";`,
);
assertIncludes(
  "iOS Release app icon",
  iosProject,
  'ASSETCATALOG_COMPILER_APPICON_NAME = "$(MR_BROCCOLI_LOCAL_APP_ICON)";',
);
assertIncludes(
  "iOS Release local app icon defaults production",
  iosProject,
  "MR_BROCCOLI_LOCAL_APP_ICON = AppIcon;",
);
assertIncludes(
  "iOS Release local bundle suffix defaults empty",
  iosProject,
  'MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX = "";',
);
assertIncludes(
  "iOS Release local display suffix defaults empty",
  iosProject,
  'MR_BROCCOLI_LOCAL_DISPLAY_SUFFIX = "";',
);
assertIncludes(
  "Android display name",
  androidStrings,
  `>${appConfig.name}</string>`,
);
assertIncludes(
  "Android Debug display name",
  androidDebugStrings,
  `>${appConfig.name} Dev</string>`,
);
assertIncludes("iOS URL scheme", iosInfo, `<string>${scheme}</string>`);

// Background audio is what keeps an authorized voice turn speaking after the
// user leaves the app, and it is the exact key App Review asks about under
// guideline 2.5.4. It reached the plist as an expo-audio plugin default rather
// than a stated intent, which is how it went unnoticed; assert both sides so
// neither the declaration nor the capability can drift away silently.
const backgroundPlaybackEnabled = (appConfig.plugins ?? []).some(
  (plugin) =>
    Array.isArray(plugin) &&
    plugin[0] === "expo-audio" &&
    plugin[1]?.enableBackgroundPlayback === true,
);
assertEqual(
  "expo-audio background playback declared in app.json",
  backgroundPlaybackEnabled,
  true,
);
assertIncludes(
  "iOS background audio mode",
  iosInfo,
  "<key>UIBackgroundModes</key>",
);
assertIncludes("iOS background audio mode value", iosInfo, "<string>audio</string>");
assertIncludes(
  "Android URL scheme",
  androidManifest,
  `android:scheme="${scheme}"`,
);
assertEqual(
  "iOS configuration-specific bundle identifiers",
  JSON.stringify([...iosBundleIdentifiers].sort()),
  JSON.stringify(
    [
      `${iosBundleIdentifier}$(MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX)`,
      `${iosBundleIdentifier}$(MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX).liveactivity`,
      `${iosBundleIdentifier}.tests`,
      iosDevelopmentBundleIdentifier,
      `${iosDevelopmentBundleIdentifier}.liveactivity`,
      `${iosDevelopmentBundleIdentifier}.tests`,
    ].sort(),
  ),
);
assertIncludes(
  "iOS Podfile deployment target",
  iosPodfile,
  `platform :ios, podfile_properties['ios.deploymentTarget'] || '${iosDeploymentTarget}'`,
);
assertIncludes(
  "iOS unused Sherpa FFmpeg disabled",
  iosPodfile,
  "ENV['SHERPA_ONNX_DISABLE_FFMPEG'] = '1'",
);
assertAllEqual(
  "iOS project deployment target",
  iosDeploymentTargets,
  iosDeploymentTarget,
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
assertIncludes(
  "Android instrumentation application ID",
  androidInstrumentation,
  `const APP_PACKAGE = "${androidDevelopmentPackage}";`,
);
assertIncludes(
  "Android Play Billing permission",
  androidManifest,
  '<uses-permission android:name="com.android.vending.BILLING"/>',
);
assertIncludes(
  "Android OpenIAP Play dependency",
  androidBuild,
  'implementation "io.github.hyochan.openiap:openiap-google:3.0.0"',
);
assertIncludes(
  "Android OpenIAP Play dimension",
  androidBuild,
  'missingDimensionStrategy "platform", "play"',
);
assertIncludes(
  "Android OpenIAP Horizon disabled",
  androidGradleProperties,
  "horizonEnabled=false",
);
assertIncludes(
  "Android OpenIAP Fire OS disabled",
  androidGradleProperties,
  "fireOsEnabled=false",
);
assertIncludes(
  "Android unused Sherpa FFmpeg disabled",
  androidGradleProperties,
  "sherpaOnnxDisableFfmpeg=true",
);
assertIncludes(
  "Android release minification",
  androidGradleProperties,
  "android.enableMinifyInReleaseBuilds=true",
);
assertIncludes(
  "Android release resource shrinking",
  androidGradleProperties,
  "android.enableShrinkResourcesInReleaseBuilds=true",
);
assertIncludes(
  "Android optimized ProGuard baseline",
  androidBuild,
  'getDefaultProguardFile("proguard-android-optimize.txt")',
);
assertIncludes(
  "Android release native symbol table",
  androidBuild,
  "debugSymbolLevel 'SYMBOL_TABLE'",
);
assertIncludes(
  "Android Reanimated R8 keep rules",
  androidProguardRules,
  "-keep class com.swmansion.reanimated.** { *; }",
);
assertIncludes(
  "Android TurboModule R8 keep rules",
  androidProguardRules,
  "-keep class com.facebook.react.turbomodule.** { *; }",
);
assertIncludes(
  "Android diagnostics module implementation",
  androidDiagnostics,
  "getHistoricalProcessExitReasons",
);
assertIncludes(
  "Android application ID diagnostics",
  androidDiagnostics,
  "reactApplicationContext.packageName",
);
assertIncludes(
  "Android diagnostics module registration",
  androidNativePackage,
  "MrBroccoliDiagnosticsModule(reactContext)",
);
assertIncludes(
  "Android backup crypto background execution",
  androidBackupCrypto,
  "Executors.newSingleThreadExecutor",
);
assertIncludes(
  "Android backup crypto module registration",
  androidNativePackage,
  "MrBroccoliBackupCryptoModule(reactContext)",
);
assertIncludes(
  "iOS diagnostics source membership",
  iosProject,
  "MrBroccoliDiagnostics.swift",
);
assertIncludes(
  "iOS diagnostics bridge membership",
  iosProject,
  "MrBroccoliDiagnosticsBridge.m",
);
assertIncludes(
  "iOS MetricKit subscriber",
  iosDiagnostics,
  "MXMetricManagerSubscriber",
);
assertIncludes(
  "iOS application ID diagnostics",
  iosDiagnostics,
  "Bundle.main.bundleIdentifier",
);
assertIncludes(
  "iOS diagnostics bridge export",
  iosDiagnosticsBridge,
  "RCT_EXTERN_MODULE(MrBroccoliDiagnostics, NSObject)",
);
assertIncludes(
  "iOS application ID diagnostics bridge",
  iosDiagnosticsBridge,
  "getApplicationId:(RCTPromiseResolveBlock)resolve",
);
assertIncludes(
  "iOS archive directory source membership",
  iosProject,
  "MrBroccoliArchiveDirectory.m in Sources",
);
assertIncludes(
  "iOS archive directory bookmark persistence",
  iosArchiveDirectory,
  "bookmarkDataWithOptions:NSURLBookmarkCreationMinimalBookmark",
);
assertIncludes(
  "iOS archive directory bookmark resolution",
  iosArchiveDirectory,
  "URLByResolvingBookmarkData",
);
assertIncludes(
  "iOS backup crypto source membership",
  iosProject,
  "MrBroccoliBackupCrypto.m in Sources",
);
assertIncludes(
  "iOS backup crypto background queue",
  iosBackupCrypto,
  "com.tobiaswinkler.mrbroccoli.backup-crypto",
);
assertEqual(
  "Android release debug-signing fallback removed",
  androidBuild.includes(
    "signingConfig hasReleaseKeystore ? signingConfigs.release : signingConfigs.debug",
  ),
  false,
);
assertIncludes(
  "Android release signing validation",
  androidBuild,
  'tasks.register("validateReleaseSigning")',
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
assertEqual(
  "iOS development app icon asset",
  iosDevelopmentAppIconContents.images?.some(
    (image) => image.filename === "App-Icon-Dev-1024x1024@1x.png",
  ),
  true,
);
assertEqual(
  "iOS development app icon content",
  await pngFingerprint("assets/appIcon/android-monochrome.png"),
  await pngFingerprint(
    "ios/MrBroccoli/Images.xcassets/AppIconDev.appiconset/App-Icon-Dev-1024x1024@1x.png",
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
