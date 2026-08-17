import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { applicationIdentifierFor } from "./application-identifiers.mjs";

const FLOW = ".maestro/flows/runtime/orb-phase-progress.yaml";

/** @type {readonly (readonly [string, string, number, number, number])[]} */
export const ORB_MATRIX = [
  ["01-idle-zero", "idle", 0, 0, 0],
  ["02-recording-half", "recording", 0.5, 0, 0],
  ["03-transcribing-zero", "transcribing", 0, 0, 0],
  ["04-thinking-briefly-half", "thinking-briefly", 0.5, 0.5, 0],
  ["05-searching-three-quarters", "searching", 0.75, 0.75, 0],
  ["06-thinking-full", "thinking", 1, 1, 0],
  ["07-synthesizing-quarter", "synthesizing", 0.25, 0.25, 0],
  ["08-speaking-complete-turn", "speaking", 0, 1, 0],
  ["09-thinking-overtime-half", "thinking", 1, 1, 0.5],
  ["10-thinking-overtime-full", "thinking", 1, 1, 1],
];

function usage() {
  return "Usage: node scripts/run-orb-matrix.mjs --platform <android|ios> --udid <device> [--app-id <id>] [--output-dir <path>]";
}

export function parseOrbMatrixArguments(argv) {
  const options = {
    appId: null,
    outputDirectory: null,
    platform: null,
    udid: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === "--platform" && value) {
      options.platform = value;
      index += 1;
    } else if (argument === "--udid" && value) {
      options.udid = value;
      index += 1;
    } else if (argument === "--app-id" && value) {
      options.appId = value;
      index += 1;
    } else if (argument === "--output-dir" && value) {
      options.outputDirectory = value;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}\n${usage()}`);
    }
  }

  if (!options.udid || !["android", "ios"].includes(options.platform)) {
    throw new Error(usage());
  }
  options.appId ??= applicationIdentifierFor(options.platform, "maestro");

  return options;
}

function quoteAndroidShellArgument(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

/** @returns {[string, string[]]} */
export function getOrbFixtureOpenCommand({ platform, udid, appId, url }) {
  if (platform === "android") {
    return [
      "adb",
      [
        "-s",
        udid,
        "shell",
        "am",
        "start",
        "-W",
        "-a",
        "android.intent.action.VIEW",
        "-c",
        "android.intent.category.BROWSABLE",
        "-d",
        quoteAndroidShellArgument(url),
        "-p",
        appId,
      ],
    ];
  }

  return ["xcrun", ["simctl", "openurl", udid, url]];
}

/** @returns {[string, string[]]} */
export function getOrbFixtureStopCommand({ platform, udid, appId }) {
  return platform === "android"
    ? ["adb", ["-s", udid, "shell", "am", "force-stop", appId]]
    : ["xcrun", ["simctl", "terminate", udid, appId]];
}

function run(command, args, { cwd }) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: process.env,
    stdio: "inherit",
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }
}

export function runOrbMatrix({ argv = process.argv.slice(2), cwd = process.cwd() } = {}) {
  const options = parseOrbMatrixArguments(argv);
  const outputRoot = path.resolve(
    cwd,
    options.outputDirectory ??
      path.join("artifacts", "design-system-reconciliation", "current", options.platform, "orb"),
  );
  fs.mkdirSync(outputRoot, { recursive: true });

  for (const [name, phase, phaseProgress, turnProgress, overtime] of ORB_MATRIX) {
    const url =
      `mrbroccoli://store-promos?locale=en&scene=conversation&phase=${phase}` +
      `&phaseProgress=${phaseProgress}&turnProgress=${turnProgress}&overtime=${overtime}`;
    const commandInput = {
      appId: options.appId,
      platform: options.platform,
      udid: options.udid,
      url,
    };
    const [stopCommand, stopArgs] = getOrbFixtureStopCommand(commandInput);
    const stopResult = spawnSync(stopCommand, stopArgs, {
      cwd,
      encoding: "utf8",
      env: process.env,
      stdio: "ignore",
    });
    if (stopResult.error) {
      throw stopResult.error;
    }
    const [openCommand, openArgs] = getOrbFixtureOpenCommand(commandInput);
    run(openCommand, openArgs, { cwd });
    run(
      "maestro",
      [
        "test",
        "--no-ansi",
        "--udid",
        options.udid,
        "--config",
        ".maestro/config.yaml",
        "-e",
        `APP_ID=${options.appId}`,
        "-e",
        `ORB_ID=${phase === "idle" ? "voice-orb-idle" : "voice-orb-active"}`,
        "-e",
        `PHASE=${phase}`,
        "-e",
        `PLATFORM=${options.platform}`,
        "-e",
        `SCREENSHOT_NAME=${name}`,
        "--test-output-dir",
        path.join(outputRoot, name),
        FLOW,
      ],
      { cwd },
    );
  }

  process.stdout.write(`Voice orb matrix passed on ${options.platform}: ${outputRoot}\n`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = runOrbMatrix();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
