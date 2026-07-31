import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  parseEnvText,
  runPrereleaseEnvironmentCheck,
} from "./verify-prerelease-env.mjs";

export function loadPrereleaseLocalEnvironment(cwd = process.cwd()) {
  const filePath = path.join(cwd, ".env.local");
  const parsed = parseEnvText(
    fs.readFileSync(filePath, "utf8"),
    ".env.local",
  );

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors.join("\n"));
  }

  return Object.fromEntries(parsed.entries);
}

export function runLiveProviderMatrix({
  cwd = process.cwd(),
  spawn = spawnSync,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  const preflightStatus = runPrereleaseEnvironmentCheck({
    cwd,
    stdout,
    stderr,
  });

  if (preflightStatus !== 0) {
    return preflightStatus;
  }

  const localEnvironment = loadPrereleaseLocalEnvironment(cwd);
  const jestBin = path.join(cwd, "node_modules", "jest", "bin", "jest.js");
  const result = spawn(
    process.execPath,
    [
      jestBin,
      "__tests__/live/providerMatrix.live.test.ts",
      "--runInBand",
      "--watchman=false",
    ],
    {
      cwd,
      env: {
        ...process.env,
        ...localEnvironment,
        MR_BROCCOLI_RUN_LIVE_PROVIDER_MATRIX: "1",
      },
      stdio: "inherit",
    },
  );

  if (result.error) {
    stderr.write(`Live provider matrix could not start: ${result.error.message}\n`);
    return 1;
  }

  return result.status ?? 1;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = runLiveProviderMatrix();
}
