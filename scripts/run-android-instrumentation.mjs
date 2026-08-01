import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const EMULATOR_SERIAL_ENV = "MR_BROCCOLI_ANDROID_EMULATOR_SERIAL";
const APP_PACKAGE = "com.tobiaswinkler.app.mrbroccoli";
const TEST_PACKAGE = `${APP_PACKAGE}.test`;
const TEST_RUNNER = `${TEST_PACKAGE}/androidx.test.runner.AndroidJUnitRunner`;

export function parseConnectedAndroidEmulators(output) {
  return output
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("emulator-"))
    .map((line) => line.split(/\s+/u))
    .filter(([, state]) => state === "device")
    .map(([serial]) => serial);
}

export function selectConnectedAndroidEmulator(available, environment) {
  const override = environment[EMULATOR_SERIAL_ENV]?.trim();

  if (override) {
    if (!available.includes(override)) {
      throw new Error(
        `${EMULATOR_SERIAL_ENV}=${override} is not a connected Android emulator`,
      );
    }
    return override;
  }

  if (available.length !== 1) {
    throw new Error(
      `Expected exactly one connected Android emulator, found ${available.length}. Set ${EMULATOR_SERIAL_ENV} to choose explicitly.`,
    );
  }

  return available[0];
}

/**
 * @param {string} command
 * @param {string[]} args
 * @param {{ allowFailure?: boolean; capture?: boolean; cwd?: string; environment?: NodeJS.ProcessEnv }} [options]
 */
function runCommand(
  command,
  args,
  { allowFailure = false, capture = false, cwd, environment } = {},
) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: environment,
    stdio: capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (!allowFailure && result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result.stdout ?? "";
}

export function runAndroidInstrumentation({
  captureCommand = (command, args, options) =>
    runCommand(command, args, { ...options, capture: true }),
  cwd = process.cwd(),
  environment = process.env,
  run = runCommand,
  runBestEffort = (command, args, options) =>
    runCommand(command, args, { ...options, allowFailure: true }),
} = {}) {
  const deviceOutput = captureCommand("adb", ["devices", "-l"], { cwd });
  const emulator = selectConnectedAndroidEmulator(
    parseConnectedAndroidEmulators(deviceOutput),
    environment,
  );

  run(
    "./android/gradlew",
    [
      "-p",
      "android",
      ":app:assembleDebug",
      ":app:assembleDebugAndroidTest",
    ],
    {
      cwd,
      environment: { ...environment, NODE_ENV: "test" },
    },
  );

  for (const packageName of [TEST_PACKAGE, APP_PACKAGE]) {
    runBestEffort("adb", ["-s", emulator, "uninstall", packageName], { cwd });
  }

  run(
    "adb",
    [
      "-s",
      emulator,
      "install",
      "-r",
      "android/app/build/outputs/apk/debug/app-debug.apk",
    ],
    { cwd },
  );
  run(
    "adb",
    [
      "-s",
      emulator,
      "install",
      "-r",
      "android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk",
    ],
    { cwd },
  );

  const instrumentationOutput = captureCommand(
    "adb",
    ["-s", emulator, "shell", "am", "instrument", "-w", TEST_RUNNER],
    { cwd },
  );
  if (!/\bOK \(\d+ tests?\)/u.test(instrumentationOutput)) {
    throw new Error(
      `Android instrumentation did not report a passing result on ${emulator}`,
    );
  }

  return emulator;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const emulator = runAndroidInstrumentation();
    process.stdout.write(
      `Android native runtime tests passed on ${emulator}.\n`,
    );
  } catch (error) {
    process.stderr.write(
      `Android native runtime tests failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
