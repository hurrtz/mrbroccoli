import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { runAndroidScreenReaderCheck } from "./screen-reader/android.mjs";
import {
  flattenHierarchy,
  validateScreenReaderHierarchy,
} from "./screen-reader/hierarchy.mjs";
import { runIosScreenReaderCheck } from "./screen-reader/ios.mjs";
import { executeCommand } from "./screen-reader/runtime.mjs";
import { DEFAULT_APP_ID } from "./screen-reader/runtime.mjs";

export { flattenHierarchy, validateScreenReaderHierarchy };

function parseArguments(argv) {
  const options = {
    appId: DEFAULT_APP_ID,
    outputDirectory: "artifacts/maestro/screen-reader",
    platform: "",
    udid: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--app-id" && value) {
      options.appId = value;
      index += 1;
    } else if (argument === "--platform" && value) {
      options.platform = value;
      index += 1;
    } else if (argument === "--udid" && value) {
      options.udid = value;
      index += 1;
    } else if (argument === "--output-dir" && value) {
      options.outputDirectory = value;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }

  if (!["android", "ios"].includes(options.platform)) {
    throw new Error("--platform must be android or ios");
  }
  if (!options.udid) {
    throw new Error("--udid is required");
  }

  return options;
}

export function runScreenReaderCheck({
  appId = DEFAULT_APP_ID,
  cwd = process.cwd(),
  execute = executeCommand,
  outputDirectory,
  platform,
  stdout = process.stdout,
  udid,
}) {
  const platformOutput = path.resolve(cwd, outputDirectory, platform);
  fs.mkdirSync(platformOutput, { recursive: true });
  const result =
    platform === "android"
      ? runAndroidScreenReaderCheck({
          appId,
          cwd,
          execute,
          outputDirectory: platformOutput,
          udid,
        })
      : runIosScreenReaderCheck({
          appId,
          cwd,
          execute,
          outputDirectory: platformOutput,
          udid,
        });
  const validation = validateScreenReaderHierarchy(result.hierarchy);

  if (validation.errors.length > 0) {
    throw new Error(
      `Screen-reader hierarchy failed on ${platform}: ${validation.errors.join("; ")}`,
    );
  }

  const evidence = {
    checkedAt: new Date().toISOString(),
    controls: validation.controls,
    platform,
    reader: result.readerState.reader,
    readerActive: result.readerState.readerActive,
    udid,
  };
  fs.writeFileSync(
    path.join(platformOutput, "hierarchy.json"),
    `${JSON.stringify(result.hierarchy, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(platformOutput, "evidence.json"),
    `${JSON.stringify(evidence, null, 2)}\n`,
  );
  stdout.write(
    `${evidence.reader} hierarchy passed ${validation.controls.length} labelled controls on ${platform} (${udid}).\n`,
  );
  return evidence;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const options = parseArguments(process.argv.slice(2));
    runScreenReaderCheck({
      appId: options.appId,
      outputDirectory: options.outputDirectory,
      platform: options.platform,
      udid: options.udid,
    });
  } catch (error) {
    process.stderr.write(
      `Screen-reader check failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
