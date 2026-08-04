#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const DEVELOPMENT_BUNDLE_IDENTIFIER =
  "com.tobiaswinkler.app.mrbroccoli.dev";
export const DEVELOPMENT_LIVE_ACTIVITY_BUNDLE_IDENTIFIER =
  `${DEVELOPMENT_BUNDLE_IDENTIFIER}.liveactivity`;

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
const DERIVED_DATA_PATH = path.join(
  PROJECT_ROOT,
  "artifacts",
  "ios-standalone",
  "DerivedData",
);

export function parseArgs(argv) {
  const options = { device: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    if (argument === "--device") {
      const device = argv[index + 1];
      if (!device) {
        throw new Error("--device requires an iPhone name or UDID");
      }
      options.device = device;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }
  return options;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: PROJECT_ROOT,
    stdio: "inherit",
    ...options,
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
  return result;
}

export function connectedPhysicalIphones(devices) {
  return devices.filter(
    (device) =>
      device.hardwareProperties?.platform === "iOS" &&
      device.hardwareProperties?.reality === "physical" &&
      device.connectionProperties?.pairingState === "paired" &&
      device.connectionProperties?.tunnelState !== "unavailable",
  );
}

export function selectDevice(devices, requestedDevice) {
  const connectedDevices = connectedPhysicalIphones(devices);
  if (requestedDevice) {
    const matchedDevice = connectedDevices.find(
      (device) =>
        device.identifier === requestedDevice ||
        device.hardwareProperties?.udid === requestedDevice ||
        device.deviceProperties?.name === requestedDevice,
    );
    if (!matchedDevice) {
      throw new Error(
        `Connected physical iPhone not found: ${requestedDevice}`,
      );
    }
    return matchedDevice;
  }
  if (connectedDevices.length !== 1) {
    const names = connectedDevices
      .map((device) => device.deviceProperties?.name ?? device.identifier)
      .join(", ");
    throw new Error(
      `Expected exactly one connected physical iPhone, found ${connectedDevices.length}${names ? `: ${names}` : ""}. Pass --device <name-or-udid>.`,
    );
  }
  return connectedDevices[0];
}

function loadDevices() {
  const temporaryDirectory = mkdtempSync(
    path.join(tmpdir(), "mrbroccoli-ios-devices-"),
  );
  const jsonPath = path.join(temporaryDirectory, "devices.json");
  try {
    run("xcrun", [
      "devicectl",
      "list",
      "devices",
      "--json-output",
      jsonPath,
      "--quiet",
    ]);
    return JSON.parse(readFileSync(jsonPath, "utf8")).result?.devices ?? [];
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

export function createXcodeBuildArgs(deviceUdid, derivedDataPath) {
  return [
    "-workspace",
    "ios/MrBroccoli.xcworkspace",
    "-scheme",
    "MrBroccoli",
    "-configuration",
    "Release",
    "-destination",
    `id=${deviceUdid}`,
    "-derivedDataPath",
    derivedDataPath,
    "MR_BROCCOLI_LOCAL_APP_ICON=AppIconDev",
    "MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX=.dev",
    "MR_BROCCOLI_LOCAL_DISPLAY_SUFFIX= Dev",
    "-allowProvisioningUpdates",
    "-allowProvisioningDeviceRegistration",
    "build",
  ];
}

export function standaloneAppPaths(derivedDataPath) {
  const appPath = path.join(
    derivedDataPath,
    "Build",
    "Products",
    "Release-iphoneos",
    "MrBroccoli.app",
  );
  return {
    appPath,
    appInfoPath: path.join(appPath, "Info.plist"),
    bundlePath: path.join(appPath, "main.jsbundle"),
    liveActivityInfoPath: path.join(
      appPath,
      "PlugIns",
      "MrBroccoliLiveActivity.appex",
      "Info.plist",
    ),
  };
}

function readPlistValue(plistPath, key) {
  const result = spawnSync(
    "/usr/libexec/PlistBuddy",
    ["-c", `Print :${key}`, plistPath],
    { encoding: "utf8" },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `Could not read ${key}`);
  }
  return result.stdout.trim();
}

export function validateStandaloneApp(paths) {
  if (!existsSync(paths.bundlePath) || statSync(paths.bundlePath).size === 0) {
    throw new Error("Standalone iOS build does not contain main.jsbundle");
  }
  const appBundleIdentifier = readPlistValue(
    paths.appInfoPath,
    "CFBundleIdentifier",
  );
  const liveActivityBundleIdentifier = readPlistValue(
    paths.liveActivityInfoPath,
    "CFBundleIdentifier",
  );
  if (appBundleIdentifier !== DEVELOPMENT_BUNDLE_IDENTIFIER) {
    throw new Error(`Unexpected app bundle identifier: ${appBundleIdentifier}`);
  }
  if (
    liveActivityBundleIdentifier !==
    DEVELOPMENT_LIVE_ACTIVITY_BUNDLE_IDENTIFIER
  ) {
    throw new Error(
      `Unexpected Live Activity bundle identifier: ${liveActivityBundleIdentifier}`,
    );
  }
}

export function main(argv = process.argv.slice(2)) {
  const options = parseArgs(argv);
  if (options.help) {
    console.log(
      "Usage: npm run ios:standalone -- [--device <name-or-udid>]",
    );
    return;
  }

  const requestedDevice =
    options.device ?? process.env.MR_BROCCOLI_IOS_DEVICE_UDID ?? null;
  const device = selectDevice(loadDevices(), requestedDevice);
  const deviceUdid = device.hardwareProperties?.udid ?? device.identifier;
  const deviceName = device.deviceProperties?.name ?? deviceUdid;
  console.log(`Building standalone Mr Broccoli Dev for ${deviceName}...`);

  run(
    "xcodebuild",
    createXcodeBuildArgs(deviceUdid, DERIVED_DATA_PATH),
    {
      env: {
        ...process.env,
        EXPO_NO_DOTENV: "1",
        NODE_ENV: "production",
      },
    },
  );

  const paths = standaloneAppPaths(DERIVED_DATA_PATH);
  validateStandaloneApp(paths);
  run("xcrun", [
    "devicectl",
    "device",
    "install",
    "app",
    "--device",
    deviceUdid,
    paths.appPath,
  ]);
  run("xcrun", [
    "devicectl",
    "device",
    "process",
    "launch",
    "--device",
    deviceUdid,
    "--terminate-existing",
    DEVELOPMENT_BUNDLE_IDENTIFIER,
  ]);
  console.log(
    `Installed ${DEVELOPMENT_BUNDLE_IDENTIFIER} with embedded JavaScript; Metro is not required.`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
