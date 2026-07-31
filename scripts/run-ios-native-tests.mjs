import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { parseBootedIosSimulators } from "./run-maestro-prerelease.mjs";

const SIMULATOR_UDID_ENV = "MR_BROCCOLI_IOS_SIMULATOR_UDID";

export function selectBootedIosSimulator(available, environment) {
  const override = environment[SIMULATOR_UDID_ENV]?.trim();

  if (override) {
    if (!available.some(({ udid }) => udid === override)) {
      throw new Error(
        `${SIMULATOR_UDID_ENV}=${override} is not a booted iOS simulator`,
      );
    }
    return override;
  }

  if (available.length !== 1) {
    throw new Error(
      `Expected exactly one booted iOS simulator, found ${available.length}. Set ${SIMULATOR_UDID_ENV} to choose explicitly.`,
    );
  }

  return available[0].udid;
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ capture?: boolean; cwd?: string }} [options]
 */
function runCommand(command, args, { capture = false, cwd } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result.stdout ?? "";
}

export function runIosNativeTests({
  captureCommand = (command, args, options) =>
    runCommand(command, args, { ...options, capture: true }),
  cwd = process.cwd(),
  environment = process.env,
  run = runCommand,
} = {}) {
  const simulatorOutput = captureCommand(
    "xcrun",
    ["simctl", "list", "devices", "booted", "--json"],
    { cwd },
  );
  const simulator = selectBootedIosSimulator(
    parseBootedIosSimulators(simulatorOutput),
    environment,
  );

  run(
    "xcodebuild",
    [
      "-quiet",
      "-workspace",
      "ios/MrBroccoli.xcworkspace",
      "-scheme",
      "MrBroccoli",
      "-configuration",
      "Debug",
      "-sdk",
      "iphonesimulator",
      "-destination",
      `platform=iOS Simulator,id=${simulator}`,
      "-only-testing:MrBroccoliTests",
      "test",
    ],
    { cwd },
  );

  return simulator;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const simulator = runIosNativeTests();
    process.stdout.write(`iOS native lifecycle tests passed on ${simulator}.\n`);
  } catch (error) {
    process.stderr.write(
      `iOS native lifecycle tests failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
