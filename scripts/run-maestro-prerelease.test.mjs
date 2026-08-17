import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  parseAdbDevices,
  parseBootedIosSimulators,
  runMaestroPrerelease,
} from "./run-maestro-prerelease.mjs";

test("separates connected Android emulators from physical devices", () => {
  assert.deepEqual(
    parseAdbDevices(`List of devices attached
emulator-5554 device product:sdk model:Pixel transport_id:1
192.168.1.20:41231 device product:phone model:Phone transport_id:2
offline-device offline transport_id:3
`),
    [
      { kind: "emulator", udid: "emulator-5554" },
      { kind: "physical", udid: "192.168.1.20:41231" },
    ],
  );
});

test("derives only booted, available iOS simulators", () => {
  assert.deepEqual(
    parseBootedIosSimulators(
      JSON.stringify({
        devices: {
          "com.apple.CoreSimulator.SimRuntime.iOS-26-5": [
            {
              isAvailable: true,
              name: "iPhone 17 Pro",
              state: "Booted",
              udid: "BOOTED-UDID",
            },
            {
              isAvailable: true,
              name: "iPhone 17",
              state: "Shutdown",
              udid: "SHUTDOWN-UDID",
            },
          ],
        },
      }),
    ),
    [{ name: "iPhone 17 Pro", udid: "BOOTED-UDID" }],
  );
});

test("disables dotenv for Release builds and scans both artifacts", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "mrbroccoli-maestro-runner-"));
  const calls = [];

  try {
    const run = (command, args, options = {}) => {
      calls.push({ command, args, options });

      if (args.includes(":app:assembleRelease")) {
        const apk = path.join(
          cwd,
          "android/app/build/outputs/apk/release/app-release.apk",
        );
        fs.mkdirSync(path.dirname(apk), { recursive: true });
        fs.writeFileSync(apk, "fixture");
      }

      if (command === "xcodebuild") {
        const app = path.join(
          cwd,
          "artifacts/maestro/release-ios-derived-data/Build/Products/Release-iphonesimulator/MrBroccoli.app",
        );
        fs.mkdirSync(app, { recursive: true });
      }

      return "";
    };
    const captureCommand = (command, args) => {
      if (command === "adb" && args[0] === "devices") {
        return `List of devices attached
emulator-5554 device product:sdk model:Pixel transport_id:1
192.168.1.20:41231 device product:phone model:Phone transport_id:2
`;
      }

      if (command === "adb") {
        return `package:/data/app/${args[1]}/base.apk\n`;
      }

      return JSON.stringify({
        devices: {
          runtime: [
            {
              isAvailable: true,
              name: "iPhone 17 Pro",
              state: "Booted",
              udid: "IOS-UDID",
            },
          ],
        },
      });
    };

    runMaestroPrerelease({
      cwd,
      captureCommand,
      environment: {},
      run,
      stdout: /** @type {any} */ ({ write() { return true; } }),
    });

    const androidBuild = calls.find(({ args }) =>
      args.includes(":app:assembleRelease"),
    );
    const iosBuild = calls.find(({ command }) => command === "xcodebuild");
    const secretScan = calls.find(({ args }) =>
      args.includes("scripts/verify-release-artifact-secrets.mjs"),
    );
    const screenReaderChecks = calls.filter(({ args }) =>
      args.includes("scripts/run-screen-reader-check.mjs"),
    );
    const androidUninstalls = calls.filter(
      ({ command, args }) => command === "adb" && args.includes("uninstall"),
    );
    const androidInstalls = calls.filter(
      ({ command, args }) => command === "adb" && args.includes("install"),
    );

    assert.deepEqual(androidBuild.options.env, {
      EXPO_NO_DOTENV: "1",
      NODE_ENV: "production",
    });
    assert.deepEqual(iosBuild.options.env, {
      EXPO_NO_DOTENV: "1",
      NODE_ENV: "production",
    });
    assert.ok(secretScan);
    assert.deepEqual(
      screenReaderChecks.map(({ args }) => args[4]),
      ["android", "ios"],
    );
    assert.deepEqual(
      screenReaderChecks.map(({ args }) => args[2]),
      [
        "com.tobiaswinkler.app.android.mrbroccoli.maestro",
        "com.tobiaswinkler.app.mrbroccoli.maestro",
      ],
    );
    assert.ok(androidBuild.args.includes("-PmrBroccoliMaestroVariant=true"));
    assert.ok(iosBuild.args.includes("MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX=.maestro"));
    assert.equal(secretScan.args.at(-2).endsWith("app-release.apk"), true);
    assert.equal(secretScan.args.at(-1).endsWith("MrBroccoli.app"), true);
    assert.deepEqual(
      androidUninstalls.map(({ args }) => args.slice(0, 3)),
      [
        ["-s", "emulator-5554", "uninstall"],
        ["-s", "192.168.1.20:41231", "uninstall"],
      ],
    );
    assert.deepEqual(
      androidInstalls.map(({ args }) => args.slice(0, 3)),
      [
        ["-s", "emulator-5554", "install"],
        ["-s", "192.168.1.20:41231", "install"],
      ],
    );
    assert.equal(androidInstalls.every(({ args }) => !args.includes("-r")), true);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
