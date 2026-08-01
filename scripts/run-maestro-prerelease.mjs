import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const APP_ID = "com.tobiaswinkler.app.mrbroccoli";

export function parseAdbDevices(output) {
  return output
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [udid, state] = line.split(/\s+/, 2);
      return state === "device"
        ? [{ kind: udid.startsWith("emulator-") ? "emulator" : "physical", udid }]
        : [];
    });
}

export function parseBootedIosSimulators(output) {
  const parsed = JSON.parse(output);
  const devices = parsed.devices ?? {};

  return Object.values(devices)
    .flat()
    .filter(
      (device) =>
        device &&
        typeof device === "object" &&
        device.state === "Booted" &&
        device.isAvailable !== false &&
        typeof device.udid === "string",
    )
    .map((device) => ({ name: device.name, udid: device.udid }));
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ...options.env,
    },
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result.stdout ?? "";
}

function selectDevice({
  available,
  environment,
  environmentName,
  kind,
  label,
}) {
  const override = environment[environmentName]?.trim();
  const candidates = available.filter((device) => device.kind === kind);

  if (override) {
    if (!candidates.some((device) => device.udid === override)) {
      throw new Error(
        `${environmentName}=${override} is not a connected ${label}`,
      );
    }
    return override;
  }

  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one connected ${label}, found ${candidates.length}. Set ${environmentName} to choose explicitly.`,
    );
  }

  return candidates[0].udid;
}

function selectIosSimulator(available, environment) {
  const environmentName = "MR_BROCCOLI_IOS_SIMULATOR_UDID";
  const override = environment[environmentName]?.trim();

  if (override) {
    if (!available.some((device) => device.udid === override)) {
      throw new Error(
        `${environmentName}=${override} is not a booted iOS simulator`,
      );
    }
    return override;
  }

  if (available.length !== 1) {
    throw new Error(
      `Expected exactly one booted iOS simulator, found ${available.length}. Set ${environmentName} to choose explicitly.`,
    );
  }

  return available[0].udid;
}

function runMaestroSuite({
  cwd,
  outputDirectory,
  platform,
  run = runCommand,
  suite,
  udid,
}) {
  run(
    process.execPath,
    [
      "scripts/run-maestro-suite.mjs",
      "--platform",
      platform,
      "--suite",
      suite,
      "--udid",
      udid,
      "--output-dir",
      outputDirectory,
    ],
    { cwd },
  );
}

function uninstallExistingAndroidApp({ captureCommand, cwd, run, udid }) {
  const installedPath = captureCommand(
    "adb",
    ["-s", udid, "shell", "pm", "path", APP_ID],
    { capture: true, cwd },
  ).trim();

  if (installedPath) {
    run("adb", ["-s", udid, "uninstall", APP_ID], { cwd });
  }
}

export function runMaestroPrerelease({
  cwd = process.cwd(),
  captureCommand = runCommand,
  environment = process.env,
  run = runCommand,
  stdout = process.stdout,
} = {}) {
  run(process.execPath, ["scripts/verify-prerelease-env.mjs"], { cwd });

  const adbOutput = captureCommand("adb", ["devices", "-l"], {
    capture: true,
    cwd,
  });
  const androidDevices = parseAdbDevices(adbOutput);
  const androidEmulator = selectDevice({
    available: androidDevices,
    environment,
    environmentName: "MR_BROCCOLI_ANDROID_EMULATOR_UDID",
    kind: "emulator",
    label: "Android emulator",
  });
  const androidPhysical = selectDevice({
    available: androidDevices,
    environment,
    environmentName: "MR_BROCCOLI_ANDROID_PHYSICAL_UDID",
    kind: "physical",
    label: "physical Android device",
  });
  const simulatorOutput = captureCommand(
    "xcrun",
    ["simctl", "list", "devices", "booted", "--json"],
    { capture: true, cwd },
  );
  const iosSimulator = selectIosSimulator(
    parseBootedIosSimulators(simulatorOutput),
    environment,
  );

  stdout.write(
    `Maestro release devices: Android emulator ${androidEmulator}, Android physical ${androidPhysical}, iOS simulator ${iosSimulator}.\n`,
  );

  run(
    path.join(cwd, "android", "gradlew"),
    ["-p", "android", ":app:assembleRelease"],
    {
      cwd,
      env: { EXPO_NO_DOTENV: "1", NODE_ENV: "production" },
    },
  );

  const releaseApk = path.join(
    cwd,
    "android",
    "app",
    "build",
    "outputs",
    "apk",
    "release",
    "app-release.apk",
  );

  if (!fs.existsSync(releaseApk)) {
    throw new Error(`Android release APK was not created: ${releaseApk}`);
  }

  for (const udid of [androidEmulator, androidPhysical]) {
    // The spend-free instrumentation phase intentionally installs a
    // debug-signed APK on the emulator. Remove any existing test installation
    // before installing the release-signed app so the following phase cannot
    // fail with INSTALL_FAILED_UPDATE_INCOMPATIBLE.
    uninstallExistingAndroidApp({ captureCommand, cwd, run, udid });
    run("adb", ["-s", udid, "install", releaseApk], { cwd });
    run("adb", ["-s", udid, "shell", "pm", "path", APP_ID], { cwd });
  }

  const derivedData = path.join(
    cwd,
    "artifacts",
    "maestro",
    "release-ios-derived-data",
  );
  run(
    "xcodebuild",
    [
      "-workspace",
      "ios/MrBroccoli.xcworkspace",
      "-scheme",
      "MrBroccoli",
      "-configuration",
      "Release",
      "-sdk",
      "iphonesimulator",
      "-destination",
      `platform=iOS Simulator,id=${iosSimulator}`,
      "-derivedDataPath",
      derivedData,
      "build",
    ],
    { cwd, env: { EXPO_NO_DOTENV: "1", NODE_ENV: "production" } },
  );

  const iosApp = path.join(
    derivedData,
    "Build",
    "Products",
    "Release-iphonesimulator",
    "MrBroccoli.app",
  );

  if (!fs.existsSync(iosApp)) {
    throw new Error(`iOS Release simulator app was not created: ${iosApp}`);
  }

  run("xcrun", ["simctl", "install", iosSimulator, iosApp], { cwd });
  run(
    "xcrun",
    ["simctl", "get_app_container", iosSimulator, APP_ID, "app"],
    { cwd },
  );

  run(
    process.execPath,
    [
      "scripts/verify-release-artifact-secrets.mjs",
      releaseApk,
      iosApp,
    ],
    { cwd },
  );

  runMaestroSuite({
    cwd,
    outputDirectory: "artifacts/maestro/release",
    platform: "android",
    run,
    suite: "all",
    udid: androidEmulator,
  });
  runMaestroSuite({
    cwd,
    outputDirectory: "artifacts/maestro/release",
    platform: "ios",
    run,
    suite: "all",
    udid: iosSimulator,
  });
  for (const [platform, udid] of [
    ["android", androidEmulator],
    ["ios", iosSimulator],
  ]) {
    run(
      process.execPath,
      [
        "scripts/run-screen-reader-check.mjs",
        "--platform",
        platform,
        "--udid",
        udid,
        "--output-dir",
        "artifacts/maestro/release/screen-reader",
      ],
      { cwd },
    );
  }
  runMaestroSuite({
    cwd,
    outputDirectory: "artifacts/maestro/release-physical",
    platform: "android",
    run,
    suite: "smoke",
    udid: androidPhysical,
  });
  run(process.execPath, ["scripts/verify-maestro-artifacts.mjs"], { cwd });

  stdout.write("Cross-platform Maestro pre-release suite passed.\n");
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    process.exitCode = runMaestroPrerelease();
  } catch (error) {
    process.stderr.write(
      `Maestro pre-release suite failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
