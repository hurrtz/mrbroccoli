import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  MAESTRO_LOCALIZED_FLOW,
  MAESTRO_LAYOUT_FLOW,
  MAESTRO_MINIMUM_VERSION,
  MAESTRO_SMOKE_FLOW,
  countScreenshots,
  readAppLanguages,
  validateMaestroSuite,
} from "./verify-maestro-suite.mjs";

function parseArguments(argv) {
  const options = {
    outputDirectory: "artifacts/maestro",
    platform: null,
    suite: "all",
    locale: null,
    udid: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];

    if (argument === "--platform" && value) {
      options.platform = value;
      index += 1;
    } else if (argument === "--suite" && value) {
      options.suite = value;
      index += 1;
    } else if (argument === "--udid" && value) {
      options.udid = value;
      index += 1;
    } else if (argument === "--output-dir" && value) {
      options.outputDirectory = value;
      index += 1;
    } else if (argument === "--locale" && value) {
      options.locale = value;
      index += 1;
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
  }

  if (!["android", "ios"].includes(options.platform)) {
    throw new Error("--platform must be android or ios");
  }
  if (!["all", "smoke", "locales", "layout"].includes(options.suite)) {
    throw new Error("--suite must be all, smoke, locales, or layout");
  }
  if (!options.udid) {
    throw new Error("--udid is required");
  }
  if (
    options.locale &&
    (options.suite === "smoke" || options.suite === "layout")
  ) {
    throw new Error("--locale can only be used with all or locales");
  }

  return options;
}

function parseVersion(versionText) {
  const match = versionText.match(/(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    throw new Error(`Could not parse Maestro version: ${versionText.trim()}`);
  }

  return match.slice(1).map(Number);
}

function versionAtLeast(actualText, minimumText) {
  const actual = parseVersion(actualText);
  const minimum = parseVersion(minimumText);

  for (let index = 0; index < 3; index += 1) {
    if (actual[index] > minimum[index]) {
      return true;
    }
    if (actual[index] < minimum[index]) {
      return false;
    }
  }

  return true;
}

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: "true",
      MAESTRO_CLI_NO_ANALYTICS: "1",
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

function safelyResetDirectory(directory, cwd) {
  const artifactsRoot = path.resolve(cwd, "artifacts/maestro");
  const resolvedDirectory = path.resolve(directory);

  if (
    resolvedDirectory === artifactsRoot ||
    !resolvedDirectory.startsWith(`${artifactsRoot}${path.sep}`)
  ) {
    throw new Error(
      `Refusing to clear Maestro output outside ${artifactsRoot}`,
    );
  }

  fs.rmSync(resolvedDirectory, { recursive: true, force: true });
  fs.mkdirSync(resolvedDirectory, { recursive: true });
}

function countCapturedScreenshots(directory) {
  if (!fs.existsSync(directory)) {
    return 0;
  }

  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".png") &&
        entry.parentPath.split(path.sep).includes("takeScreenshot"),
    ).length;
}

export function runFlow({
  cwd,
  environment,
  expectedScreenshotCount,
  flow,
  outputDirectory,
  run = runCommand,
  stderr = process.stderr,
  udid,
}) {
  const envArgs = Object.entries(environment).flatMap(([key, value]) => [
    "-e",
    `${key}=${value}`,
  ]);

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    safelyResetDirectory(outputDirectory, cwd);

    try {
      run(
        "maestro",
        [
          "test",
          "--no-ansi",
          "--udid",
          udid,
          "--config",
          ".maestro/config.yaml",
          ...envArgs,
          "--test-output-dir",
          outputDirectory,
          flow,
        ],
        { cwd },
      );

      const actualScreenshotCount = countCapturedScreenshots(outputDirectory);

      if (actualScreenshotCount !== expectedScreenshotCount) {
        throw new Error(
          `Expected ${expectedScreenshotCount} screenshots from ${flow}, found ${actualScreenshotCount}`,
        );
      }
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      stderr.write(
        `Maestro flow failed once; retrying ${flow} on ${udid}.\n`,
      );
    }
  }
}

function main() {
  const cwd = process.cwd();
  const options = parseArguments(process.argv.slice(2));
  const verification = validateMaestroSuite(cwd);

  if (verification.errors.length > 0) {
    throw new Error(verification.errors.join("; "));
  }

  const maestroVersion = runCommand("maestro", ["--version"], {
    cwd,
    capture: true,
  });

  if (!versionAtLeast(maestroVersion, MAESTRO_MINIMUM_VERSION)) {
    throw new Error(
      `Maestro ${MAESTRO_MINIMUM_VERSION} or newer is required; found ${maestroVersion.trim()}`,
    );
  }

  const platformOutput = path.resolve(
    cwd,
    options.outputDirectory,
    options.platform,
  );

  if (options.suite === "all" || options.suite === "smoke") {
    const smokeText = fs.readFileSync(
      path.join(cwd, MAESTRO_SMOKE_FLOW),
      "utf8",
    );
    runFlow({
      cwd,
      environment: { PLATFORM: options.platform },
      expectedScreenshotCount: countScreenshots(smokeText),
      flow: MAESTRO_SMOKE_FLOW,
      outputDirectory: path.join(platformOutput, "smoke"),
      udid: options.udid,
    });
  }

  if (options.suite === "all" || options.suite === "layout") {
    const layoutText = fs.readFileSync(
      path.join(cwd, MAESTRO_LAYOUT_FLOW),
      "utf8",
    );
    runFlow({
      cwd,
      environment: { PLATFORM: options.platform },
      expectedScreenshotCount: countScreenshots(layoutText),
      flow: MAESTRO_LAYOUT_FLOW,
      outputDirectory: path.join(platformOutput, "layout"),
      udid: options.udid,
    });
  }

  if (options.suite === "all" || options.suite === "locales") {
    const configuredLanguages = readAppLanguages(cwd);
    const languages = options.locale
      ? configuredLanguages.filter((language) => language === options.locale)
      : configuredLanguages;

    if (languages.length === 0) {
      throw new Error(
        `--locale must be one of: ${configuredLanguages.join(", ")}`,
      );
    }

    for (const language of languages) {
      process.stdout.write(
        `Running ${options.platform} localized coverage: ${language}\n`,
      );
      runFlow({
        cwd,
        environment: {
          LOCALE: language,
          PLATFORM: options.platform,
        },
        expectedScreenshotCount: verification.localizedScreenshotCount,
        flow: MAESTRO_LOCALIZED_FLOW,
        outputDirectory: path.join(platformOutput, "locales", language),
        udid: options.udid,
      });
    }
  }

  process.stdout.write(
    `Maestro ${options.suite} suite passed on ${options.platform} (${options.udid}).\n`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    main();
  } catch (error) {
    process.stderr.write(
      `Maestro suite failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
