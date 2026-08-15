import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

import {
  MAESTRO_ACCESSIBILITY_FLOW,
  MAESTRO_COLOR_SCHEMES,
  MAESTRO_LOCALIZED_FLOW,
  MAESTRO_LAYOUT_FLOW,
  MAESTRO_MINIMUM_VERSION,
  MAESTRO_SMOKE_FLOW,
  countScreenshots,
  readAppLanguages,
  readAppLocaleOptions,
  validateMaestroSuite,
} from "./verify-maestro-suite.mjs";

const DEFAULT_APP_ID = "com.tobiaswinkler.app.mrbroccoli";

export function parseMaestroArguments(argv) {
  const options = {
    appId: DEFAULT_APP_ID,
    colorScheme: "both",
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
    } else if (argument === "--color-scheme" && value) {
      options.colorScheme = value;
      index += 1;
    } else if (argument === "--app-id" && value) {
      options.appId = value;
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
  if (
    !["all", "smoke", "locales", "layout", "accessibility"].includes(
      options.suite,
    )
  ) {
    throw new Error(
      "--suite must be all, smoke, locales, layout, or accessibility",
    );
  }
  if (!options.udid) {
    throw new Error("--udid is required");
  }
  if (![...MAESTRO_COLOR_SCHEMES, "both"].includes(options.colorScheme)) {
    throw new Error("--color-scheme must be light, dark, or both");
  }
  if (
    options.locale &&
    ["smoke", "layout", "accessibility"].includes(options.suite)
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

export function localeNeedsSafeScroll(platform, configuredIndex) {
  return platform === "ios" && configuredIndex >= 10;
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

export function findExactDuplicateScreenshotGroups(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const byHash = new Map();
  for (const entry of fs.readdirSync(directory, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (
      !entry.isFile() ||
      !entry.name.endsWith(".png") ||
      !entry.parentPath.split(path.sep).includes("takeScreenshot")
    ) {
      continue;
    }
    const filePath = path.join(entry.parentPath, entry.name);
    const hash = createHash("sha256")
      .update(fs.readFileSync(filePath))
      .digest("hex");
    const matches = byHash.get(hash) ?? [];
    matches.push(path.relative(directory, filePath));
    byHash.set(hash, matches);
  }

  return [...byHash.values()].filter((files) => files.length > 1);
}

function waitForRetry(milliseconds) {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  Atomics.wait(signal, 0, 0, milliseconds);
}

function captureTrimmed(run, command, args, cwd) {
  return run(command, args, { capture: true, cwd }).trim();
}

function restoreAndroidSetting({ cwd, key, namespace, run, udid, value }) {
  const action = value === "null" || value === ""
    ? ["delete", namespace, key]
    : ["put", namespace, key, value];
  run("adb", ["-s", udid, "shell", "settings", ...action], { cwd });
}

export function configureAccessibilityDisplay({
  cwd,
  platform,
  run = runCommand,
  udid,
}) {
  if (platform === "ios") {
    const previous = {
      appearance: captureTrimmed(
        run,
        "xcrun",
        ["simctl", "ui", udid, "appearance"],
        cwd,
      ),
      contrast: captureTrimmed(
        run,
        "xcrun",
        ["simctl", "ui", udid, "increase_contrast"],
        cwd,
      ),
      contentSize: captureTrimmed(
        run,
        "xcrun",
        ["simctl", "ui", udid, "content_size"],
        cwd,
      ),
    };

    if (
      !["light", "dark"].includes(previous.appearance) ||
      !["enabled", "disabled"].includes(previous.contrast) ||
      ["unknown", "unsupported", ""].includes(previous.contentSize)
    ) {
      throw new Error(
        `Could not capture restorable iOS accessibility display state for ${udid}`,
      );
    }

    run("xcrun", ["simctl", "ui", udid, "appearance", "dark"], { cwd });
    run(
      "xcrun",
      ["simctl", "ui", udid, "increase_contrast", "enabled"],
      { cwd },
    );
    run(
      "xcrun",
      [
        "simctl",
        "ui",
        udid,
        "content_size",
        "accessibility-extra-large",
      ],
      { cwd },
    );

    return () => {
      run(
        "xcrun",
        ["simctl", "ui", udid, "content_size", previous.contentSize],
        { cwd },
      );
      run(
        "xcrun",
        ["simctl", "ui", udid, "increase_contrast", previous.contrast],
        { cwd },
      );
      run(
        "xcrun",
        ["simctl", "ui", udid, "appearance", previous.appearance],
        { cwd },
      );
    };
  }

  const fontScale = captureTrimmed(
    run,
    "adb",
    ["-s", udid, "shell", "settings", "get", "system", "font_scale"],
    cwd,
  );
  const contrast = captureTrimmed(
    run,
    "adb",
    [
      "-s",
      udid,
      "shell",
      "settings",
      "get",
      "secure",
      "high_text_contrast_enabled",
    ],
    cwd,
  );
  const nightOutput = captureTrimmed(
    run,
    "adb",
    ["-s", udid, "shell", "cmd", "uimode", "night"],
    cwd,
  );
  const nightMode = nightOutput.match(/night mode:\s*(yes|no|auto)/i)?.[1];

  if (!nightMode) {
    throw new Error(
      `Could not capture restorable Android night mode for ${udid}: ${nightOutput}`,
    );
  }

  run(
    "adb",
    ["-s", udid, "shell", "settings", "put", "system", "font_scale", "1.3"],
    { cwd },
  );
  run(
    "adb",
    [
      "-s",
      udid,
      "shell",
      "settings",
      "put",
      "secure",
      "high_text_contrast_enabled",
      "1",
    ],
    { cwd },
  );
  run("adb", ["-s", udid, "shell", "cmd", "uimode", "night", "yes"], {
    cwd,
  });

  return () => {
    restoreAndroidSetting({
      cwd,
      key: "font_scale",
      namespace: "system",
      run,
      udid,
      value: fontScale,
    });
    restoreAndroidSetting({
      cwd,
      key: "high_text_contrast_enabled",
      namespace: "secure",
      run,
      udid,
      value: contrast,
    });
    run(
      "adb",
      ["-s", udid, "shell", "cmd", "uimode", "night", nightMode.toLowerCase()],
      { cwd },
    );
  };
}

export function configureColorScheme({
  colorScheme,
  cwd,
  platform,
  run = runCommand,
  udid,
}) {
  if (platform === "ios") {
    const previous = captureTrimmed(
      run,
      "xcrun",
      ["simctl", "ui", udid, "appearance"],
      cwd,
    );
    if (!MAESTRO_COLOR_SCHEMES.includes(previous)) {
      throw new Error(
        `Could not capture restorable iOS color scheme for ${udid}: ${previous}`,
      );
    }
    run("xcrun", ["simctl", "ui", udid, "appearance", colorScheme], {
      cwd,
    });
    return () => {
      run("xcrun", ["simctl", "ui", udid, "appearance", previous], { cwd });
    };
  }

  const nightOutput = captureTrimmed(
    run,
    "adb",
    ["-s", udid, "shell", "cmd", "uimode", "night"],
    cwd,
  );
  const previous = nightOutput.match(/night mode:\s*(yes|no|auto)/i)?.[1];
  if (!previous) {
    throw new Error(
      `Could not capture restorable Android color scheme for ${udid}: ${nightOutput}`,
    );
  }
  run(
    "adb",
    [
      "-s",
      udid,
      "shell",
      "cmd",
      "uimode",
      "night",
      colorScheme === "dark" ? "yes" : "no",
    ],
    { cwd },
  );
  return () => {
    run(
      "adb",
      [
        "-s",
        udid,
        "shell",
        "cmd",
        "uimode",
        "night",
        previous.toLowerCase(),
      ],
      { cwd },
    );
  };
}

export function runFlow({
  cwd,
  environment,
  expectedScreenshotCount,
  flow,
  outputDirectory,
  rejectExactDuplicates = false,
  run = runCommand,
  stderr = process.stderr,
  udid,
  wait = waitForRetry,
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
      if (rejectExactDuplicates) {
        const duplicateGroups =
          findExactDuplicateScreenshotGroups(outputDirectory);
        if (duplicateGroups.length > 0) {
          throw new Error(
            `Exact duplicate screenshots from ${flow}: ${duplicateGroups
              .map((files) => files.join(", "))
              .join("; ")}`,
          );
        }
      }
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      stderr.write(
        `Maestro flow failed once; retrying ${flow} on ${udid}.\n`,
      );
      wait(3_000);
    }
  }
}

function main() {
  const cwd = process.cwd();
  const options = parseMaestroArguments(process.argv.slice(2));
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
  const colorSchemes =
    options.colorScheme === "both"
      ? MAESTRO_COLOR_SCHEMES
      : [options.colorScheme];

  const runSchemedFlow = ({
    environment,
    expectedScreenshotCount,
    flow,
    outputParts,
    rejectExactDuplicates = false,
  }) => {
    for (const colorScheme of colorSchemes) {
      const restoreColorScheme = configureColorScheme({
        colorScheme,
        cwd,
        platform: options.platform,
        udid: options.udid,
      });
      try {
        runFlow({
          cwd,
          environment: { ...environment, COLOR_SCHEME: colorScheme },
          expectedScreenshotCount,
          flow,
          outputDirectory: path.join(
            platformOutput,
            colorScheme,
            ...outputParts,
          ),
          rejectExactDuplicates,
          udid: options.udid,
        });
      } finally {
        restoreColorScheme();
      }
    }
  };

  if (options.suite === "all" || options.suite === "smoke") {
    const smokeText = fs.readFileSync(
      path.join(cwd, MAESTRO_SMOKE_FLOW),
      "utf8",
    );
    runSchemedFlow({
      environment: { APP_ID: options.appId, PLATFORM: options.platform },
      expectedScreenshotCount: countScreenshots(smokeText),
      flow: MAESTRO_SMOKE_FLOW,
      outputParts: ["smoke"],
    });
  }

  if (options.suite === "all" || options.suite === "layout") {
    const layoutText = fs.readFileSync(
      path.join(cwd, MAESTRO_LAYOUT_FLOW),
      "utf8",
    );
    runSchemedFlow({
      environment: { APP_ID: options.appId, PLATFORM: options.platform },
      expectedScreenshotCount: countScreenshots(layoutText),
      flow: MAESTRO_LAYOUT_FLOW,
      outputParts: ["layout"],
    });
  }

  if (options.suite === "all" || options.suite === "accessibility") {
    const accessibilityText = fs.readFileSync(
      path.join(cwd, MAESTRO_ACCESSIBILITY_FLOW),
      "utf8",
    );
    const restoreDisplay = configureAccessibilityDisplay({
      cwd,
      platform: options.platform,
      udid: options.udid,
    });

    try {
      runFlow({
        cwd,
        environment: { APP_ID: options.appId, PLATFORM: options.platform },
        expectedScreenshotCount: countScreenshots(accessibilityText),
        flow: MAESTRO_ACCESSIBILITY_FLOW,
        outputDirectory: path.join(platformOutput, "accessibility"),
        udid: options.udid,
      });
    } finally {
      restoreDisplay();
    }
  }

  if (options.suite === "all" || options.suite === "locales") {
    const configuredLocales = readAppLocaleOptions(cwd);
    const locales = options.locale
      ? configuredLocales.filter(({ value }) => value === options.locale)
      : configuredLocales;

    if (locales.length === 0) {
      throw new Error(
        `--locale must be one of: ${readAppLanguages(cwd).join(", ")}`,
      );
    }

    for (const { value: language } of locales) {
      const configuredIndex = configuredLocales.findIndex(
        ({ value }) => value === language,
      );
      process.stdout.write(
        `Running ${options.platform} localized coverage: ${language}\n`,
      );
      runSchemedFlow({
        environment: {
          APP_ID: options.appId,
          LOCALE: language,
          LOCALE_NEEDS_SAFE_SCROLL: localeNeedsSafeScroll(
            options.platform,
            configuredIndex,
          )
            ? "true"
            : "false",
          PLATFORM: options.platform,
        },
        expectedScreenshotCount: verification.localizedScreenshotCount,
        flow: MAESTRO_LOCALIZED_FLOW,
        outputParts: ["locales", language],
        rejectExactDuplicates: true,
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
