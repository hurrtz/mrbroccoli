import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  STORE_PROMO_ANDROID_DISPLAYS,
  STORE_PROMO_ANDROID_FLOW_SCENES,
  STORE_PROMO_APP_ID,
  STORE_PROMO_FLOWS,
  STORE_PROMO_IOS_DISPLAYS,
  STORE_PROMO_SCREENSHOT_COUNTS,
  STORE_PROMO_SCREENSHOT_NAMES,
} from "./store-promo-config.mjs";
import {
  localeNeedsSafeScroll,
} from "./run-maestro-suite.mjs";
import { readAppLocaleOptions } from "./verify-maestro-suite.mjs";

function usage() {
  return [
    "Usage: node scripts/run-store-promos.mjs --platform <ios|android> --locale <locale|all> [options]",
    "",
    "Options:",
    "  --display <label>  Output/device class (iOS: 6.8, Android: phone)",
    "  --udid <udid>      Use an existing compatible simulator/emulator",
    "  --skip-build       Reuse the existing isolated Release app",
  ].join("\n");
}

export function parseStorePromoArguments(arguments_) {
  const options = {
    display: null,
    locale: null,
    platform: null,
    skipBuild: false,
    udid: null,
  };

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    const value = arguments_[index + 1];
    if (argument === "--platform" && value) {
      options.platform = value;
      index += 1;
    } else if (argument === "--display" && value) {
      options.display = value;
      index += 1;
    } else if (argument === "--locale" && value) {
      options.locale = value;
      index += 1;
    } else if (argument === "--udid" && value) {
      options.udid = value;
      index += 1;
    } else if (argument === "--skip-build") {
      options.skipBuild = true;
    } else if (argument === "--help" || argument === "-h") {
      return { help: true, ...options };
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}\n${usage()}`);
    }
  }

  if (!options.locale) {
    throw new Error(`--locale is required\n${usage()}`);
  }
  if (options.platform !== "ios" && options.platform !== "android") {
    throw new Error(`--platform must be ios or android\n${usage()}`);
  }
  options.display ??= options.platform === "ios" ? "6.8" : "phone";
  const displays =
    options.platform === "ios"
      ? STORE_PROMO_IOS_DISPLAYS
      : STORE_PROMO_ANDROID_DISPLAYS;
  if (!Object.hasOwn(displays, options.display)) {
    throw new Error(
      `--display must be one of: ${Object.keys(displays).join(", ")}`,
    );
  }

  return { help: false, ...options };
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
  if (result.status !== 0 && !options.allowFailure) {
    const detail = options.capture
      ? `: ${(result.stderr || result.stdout || "").trim()}`
      : "";
    throw new Error(`${command} exited with status ${result.status}${detail}`);
  }
  return options.capture ? (result.stdout ?? "") : "";
}

export function quoteAndroidShellArgument(value) {
  return `'${value.replaceAll("'", `'\\''`)}'`;
}

function compareRuntimeIdentifiers(left, right) {
  const version = (identifier) =>
    identifier
      .match(/iOS-(\d+)-(\d+)/)?.slice(1)
      .map(Number) ?? [0, 0];
  const [leftMajor, leftMinor] = version(left.identifier);
  const [rightMajor, rightMinor] = version(right.identifier);
  return rightMajor - leftMajor || rightMinor - leftMinor;
}

export function selectLatestIosRuntime(runtimeJson) {
  const runtimes = JSON.parse(runtimeJson).runtimes ?? [];
  const available = runtimes
    .filter(
      (runtime) =>
        runtime?.isAvailable !== false &&
        typeof runtime?.identifier === "string" &&
        runtime.identifier.includes("SimRuntime.iOS-"),
    )
    .sort(compareRuntimeIdentifiers);
  const runtime = available[0];
  if (!runtime) {
    throw new Error("No available iOS Simulator runtime was found");
  }
  return runtime;
}

function findSimulator(devicesJson, runtimeIdentifier, name, udid) {
  const devices = JSON.parse(devicesJson).devices ?? {};
  const available = Object.entries(devices).flatMap(([runtime, entries]) =>
    (entries ?? []).flatMap((device) =>
      device?.isAvailable !== false && typeof device?.udid === "string"
        ? [{ ...device, runtime }]
        : [],
    ),
  );

  if (udid) {
    const selected = available.find((device) => device.udid === udid);
    if (!selected) {
      throw new Error(`--udid ${udid} is not an available simulator`);
    }
    return selected;
  }

  return available.find(
    (device) =>
      device.runtime === runtimeIdentifier && device.name === name,
  );
}

function ensureSimulator({ cwd, display, requestedUdid, run = runCommand }) {
  const runtime = selectLatestIosRuntime(
    run("xcrun", ["simctl", "list", "runtimes", "--json"], {
      capture: true,
      cwd,
    }),
  );
  const simulatorName = `Mr Broccoli Store Promos ${display}`;
  let simulator = findSimulator(
    run("xcrun", ["simctl", "list", "devices", "--json"], {
      capture: true,
      cwd,
    }),
    runtime.identifier,
    simulatorName,
    requestedUdid,
  );
  const target = STORE_PROMO_IOS_DISPLAYS[display];

  if (!simulator) {
    const udid = run(
      "xcrun",
      [
        "simctl",
        "create",
        simulatorName,
        target.deviceType,
        runtime.identifier,
      ],
      { capture: true, cwd },
    ).trim();
    simulator = { name: simulatorName, runtime: runtime.identifier, state: "Shutdown", udid };
  }

  if (simulator.state !== "Booted") {
    run("xcrun", ["simctl", "boot", simulator.udid], { cwd });
  }
  run("xcrun", ["simctl", "bootstatus", simulator.udid, "-b"], { cwd });
  run("xcrun", ["simctl", "ui", simulator.udid, "appearance", "light"], {
    cwd,
  });
  run(
    "xcrun",
    [
      "simctl",
      "status_bar",
      simulator.udid,
      "override",
      "--time",
      "9:41",
      "--batteryState",
      "charged",
      "--batteryLevel",
      "100",
      "--wifiBars",
      "3",
      "--cellularBars",
      "4",
    ],
    { allowFailure: true, cwd },
  );

  return { ...simulator, runtime: runtime.identifier };
}

export function parseConnectedAndroidDevices(adbOutput) {
  return adbOutput
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("*"))
    .flatMap((line) => {
      const [udid, state] = line.split(/\s+/, 2);
      return state === "device" ? [{ udid, isEmulator: udid.startsWith("emulator-") }] : [];
    });
}

function ensureAndroidEmulator({ cwd, requestedUdid, run = runCommand }) {
  const devices = parseConnectedAndroidDevices(
    run("adb", ["devices", "-l"], { capture: true, cwd }),
  );
  const emulators = devices.filter(({ isEmulator }) => isEmulator);
  const selected = requestedUdid
    ? emulators.find(({ udid }) => udid === requestedUdid)
    : emulators.length === 1
      ? emulators[0]
      : null;

  if (!selected) {
    const detail = requestedUdid
      ? `Android emulator ${requestedUdid} is not connected`
      : `Expected exactly one connected Android emulator, found ${emulators.length}`;
    throw new Error(`${detail}; start one or pass --udid`);
  }

  run("adb", ["-s", selected.udid, "wait-for-device"], { cwd });
  run("adb", ["-s", selected.udid, "shell", "wm", "size", "reset"], {
    allowFailure: true,
    cwd,
  });
  run("adb", ["-s", selected.udid, "shell", "wm", "density", "reset"], {
    allowFailure: true,
    cwd,
  });
  run(
    "adb",
    ["-s", selected.udid, "shell", "cmd", "uimode", "night", "no"],
    { allowFailure: true, cwd },
  );
  run(
    "adb",
    ["-s", selected.udid, "shell", "settings", "put", "system", "font_scale", "1.0"],
    { allowFailure: true, cwd },
  );
  run(
    "adb",
    ["-s", selected.udid, "shell", "settings", "put", "system", "accelerometer_rotation", "0"],
    { allowFailure: true, cwd },
  );
  run(
    "adb",
    ["-s", selected.udid, "shell", "settings", "put", "system", "user_rotation", "0"],
    { allowFailure: true, cwd },
  );
  run(
    "adb",
    ["-s", selected.udid, "shell", "settings", "put", "global", "sysui_demo_allowed", "1"],
    { allowFailure: true, cwd },
  );
  for (const extras of [
    ["command", "enter"],
    ["command", "clock", "hhmm", "0941"],
    ["command", "battery", "level", "100", "plugged", "true"],
    ["command", "network", "wifi", "show", "level", "4", "mobile", "hide"],
    ["command", "notifications", "visible", "false"],
  ]) {
    const args = ["-s", selected.udid, "shell", "am", "broadcast", "-a", "com.android.systemui.demo"];
    for (let index = 0; index < extras.length; index += 2) {
      args.push("-e", extras[index], extras[index + 1]);
    }
    run("adb", args, { allowFailure: true, cwd });
  }

  const sizeOutput = run(
    "adb",
    ["-s", selected.udid, "shell", "wm", "size"],
    { capture: true, cwd },
  );
  const match = sizeOutput.match(/Physical size:\s*(\d+)x(\d+)/);
  if (!match) {
    throw new Error(`Unable to read Android emulator dimensions: ${sizeOutput.trim()}`);
  }
  return {
    ...selected,
    height: Number(match[2]),
    width: Number(match[1]),
  };
}

function exitAndroidDemoMode({ cwd, udid }) {
  runCommand(
    "adb",
    [
      "-s",
      udid,
      "shell",
      "am",
      "broadcast",
      "-a",
      "com.android.systemui.demo",
      "-e",
      "command",
      "exit",
    ],
    { allowFailure: true, cwd },
  );
}

function safeResetDirectory(directory, allowedRoot) {
  const resolvedDirectory = path.resolve(directory);
  const resolvedRoot = path.resolve(allowedRoot);
  if (
    resolvedDirectory === resolvedRoot ||
    !resolvedDirectory.startsWith(`${resolvedRoot}${path.sep}`)
  ) {
    throw new Error(`Refusing to clear output outside ${resolvedRoot}`);
  }
  fs.rmSync(resolvedDirectory, { recursive: true, force: true });
  fs.mkdirSync(resolvedDirectory, { recursive: true });
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
  });
}

export function readPngMetadata(filePath) {
  const data = fs.readFileSync(filePath);
  const signature = data.subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a" || data.length < 26) {
    throw new Error(`Not a valid PNG: ${filePath}`);
  }
  const colorType = data.readUInt8(25);
  return {
    colorType,
    hasAlphaChannel: colorType === 4 || colorType === 6,
    height: data.readUInt32BE(20),
    width: data.readUInt32BE(16),
  };
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function captureMaestroFlow({ cwd, locale, outputDirectory, platform, udid }) {
  const configuredLocales = readAppLocaleOptions(cwd);
  const localeIndex = configuredLocales.findIndex(
    ({ value }) => value === locale,
  );
  if (localeIndex < 0) {
    throw new Error(
      `Unknown locale ${locale}; expected one of ${configuredLocales.map(({ value }) => value).join(", ")}`,
    );
  }

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    safeResetDirectory(
      outputDirectory,
      path.join(cwd, "artifacts", "store-promos", ".maestro-runs"),
    );
    try {
      if (platform === "android") {
        runCommand(
          "adb",
          ["-s", udid, "shell", "pm", "clear", STORE_PROMO_APP_ID],
          { cwd },
        );
      }
      for (const [flowIndex, flow] of STORE_PROMO_FLOWS[platform].entries()) {
        if (platform === "android") {
          const scene = STORE_PROMO_ANDROID_FLOW_SCENES[flowIndex];
          if (!scene) {
            throw new Error(`Missing Android fixture scene for ${flow}`);
          }
          runCommand(
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
              quoteAndroidShellArgument(
                `mrbroccoli://store-promos?locale=${locale}&scene=${scene}`,
              ),
              "-p",
              STORE_PROMO_APP_ID,
            ],
            { cwd },
          );
        }
        runCommand(
          "maestro",
          [
            "test",
            "--no-ansi",
            "--udid",
            udid,
            "--config",
            ".maestro/config.yaml",
            "-e",
            `APP_ID=${STORE_PROMO_APP_ID}`,
            "-e",
            `LOCALE=${locale}`,
            "-e",
            `LOCALE_NEEDS_SAFE_SCROLL=${localeNeedsSafeScroll(platform, localeIndex) ? "true" : "false"}`,
            "--test-output-dir",
            outputDirectory,
            flow,
          ],
          { cwd },
        );
      }
      return;
    } catch (error) {
      if (attempt === 2) {
        throw error;
      }
      process.stderr.write(
        `Store-promo flow failed once; retrying ${platform} locale ${locale}.\n`,
      );
    }
  }
}

function collectScreenshots({ cwd, display, locale, platform, rawOutput }) {
  const outputRoot = path.join(cwd, "artifacts", "store-promos", platform);
  const destination = path.join(outputRoot, display, locale);
  const target =
    platform === "ios"
      ? STORE_PROMO_IOS_DISPLAYS[display]
      : STORE_PROMO_ANDROID_DISPLAYS[display];
  const captured = walkFiles(rawOutput).filter(
    (filePath) =>
      filePath.endsWith(".png") &&
      filePath.split(path.sep).includes("takeScreenshot"),
  );
  const byName = new Map(
    captured.map((filePath) => [path.basename(filePath, ".png"), filePath]),
  );
  const screenshotNames = STORE_PROMO_SCREENSHOT_NAMES[platform];
  const screenshotCount = STORE_PROMO_SCREENSHOT_COUNTS[platform];

  if (captured.length !== screenshotCount) {
    throw new Error(
      `Expected ${screenshotCount} captured PNGs for ${locale}, found ${captured.length}`,
    );
  }
  for (const name of screenshotNames) {
    if (!byName.has(name)) {
      throw new Error(`Missing store screenshot ${name} for ${locale}`);
    }
  }

  safeResetDirectory(destination, outputRoot);
  const screenshots = screenshotNames.map((name) => {
    const source = byName.get(name);
    const output = path.join(destination, `${name}.png`);
    fs.copyFileSync(source, output);
    const metadata = readPngMetadata(output);
    const accepted = target.acceptedPortraitDimensions.some(
      ([width, height]) =>
        width === metadata.width && height === metadata.height,
    );
    if (!accepted) {
      throw new Error(
        `${name}.png has ${metadata.width}x${metadata.height}; expected ${target.acceptedPortraitDimensions.map(([width, height]) => `${width}x${height}`).join(" or ")}`,
      );
    }
    if (metadata.hasAlphaChannel) {
      throw new Error(`${name}.png contains an alpha channel`);
    }
    return {
      file: `${name}.png`,
      bytes: fs.statSync(output).size,
      sha256: sha256(output),
      width: metadata.width,
      height: metadata.height,
    };
  });
  const appJson = JSON.parse(fs.readFileSync(path.join(cwd, "app.json"), "utf8"));
  const commit = runCommand("git", ["rev-parse", "HEAD"], {
    capture: true,
    cwd,
  }).trim();
  const manifest = {
    schemaVersion: 1,
    platform,
    applicationId: STORE_PROMO_APP_ID,
    version: appJson.expo.version,
    commit,
    locale,
    outputDisplayLabel: display,
    ...(platform === "ios"
      ? { appleDisplayClass: target.appleDisplayClass }
      : {}),
    simulatorDevice: target.deviceName,
    screenshotCount: screenshots.length,
    screenshots,
  };
  fs.writeFileSync(
    path.join(destination, "screenshots.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  const cards = screenshots
    .map(
      ({ file, height, width }) =>
        `<figure><img src="${file}" alt="${file}"><figcaption>${file}<br>${width} × ${height}</figcaption></figure>`,
    )
    .join("\n");
  fs.writeFileSync(
    path.join(destination, "review-gallery.html"),
    `<!doctype html><html><head><meta charset="utf-8"><title>Mr Broccoli ${locale} store promos</title><style>body{background:#eee;color:#222;font:14px -apple-system,sans-serif;margin:24px}main{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}figure{background:white;border-radius:16px;margin:0;padding:12px;box-shadow:0 2px 14px #0002}img{display:block;height:auto;width:100%}figcaption{line-height:1.5;padding-top:10px;word-break:break-all}</style></head><body><h1>Mr Broccoli · ${locale} · ${display}</h1><p>Review all ten images for localization, clipping, state accuracy and store suitability.</p><main>${cards}</main></body></html>`,
  );

  fs.rmSync(rawOutput, { recursive: true, force: true });
  return { destination, manifest };
}

function buildIsolatedApp({ cwd, derivedData, target, udid }) {
  runCommand(
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
      `platform=iOS Simulator,id=${udid}`,
      "-derivedDataPath",
      derivedData,
      "MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX=.maestro",
      "MR_BROCCOLI_LOCAL_DISPLAY_SUFFIX= Store Promos",
      "build",
    ],
    {
      cwd,
      env: { EXPO_NO_DOTENV: "1", NODE_ENV: "production" },
    },
  );
  if (!fs.existsSync(target)) {
    throw new Error(`iOS store-promo app was not created: ${target}`);
  }
  runCommand(
    process.execPath,
    ["scripts/verify-release-artifact-secrets.mjs", target],
    { cwd },
  );
}

function buildIsolatedAndroidApp({ cwd, target }) {
  runCommand(
    path.join(cwd, "android", "gradlew"),
    [
      "-p",
      "android",
      "-PmrBroccoliMaestroVariant=true",
      ":app:assembleRelease",
    ],
    {
      cwd,
      env: { EXPO_NO_DOTENV: "1", NODE_ENV: "production" },
    },
  );
  if (!fs.existsSync(target)) {
    throw new Error(`Android store-promo APK was not created: ${target}`);
  }
  runCommand(
    process.execPath,
    ["scripts/verify-release-artifact-secrets.mjs", target],
    { cwd },
  );
}

function installAndroidApp({ cwd, target, udid }) {
  const installed = runCommand(
    "adb",
    ["-s", udid, "shell", "pm", "path", STORE_PROMO_APP_ID],
    { allowFailure: true, capture: true, cwd },
  ).trim();
  if (installed) {
    runCommand("adb", ["-s", udid, "uninstall", STORE_PROMO_APP_ID], {
      cwd,
    });
  }
  runCommand("adb", ["-s", udid, "install", target], { cwd });
  runCommand(
    "adb",
    ["-s", udid, "shell", "pm", "path", STORE_PROMO_APP_ID],
    { cwd },
  );
}

export function runStorePromos({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
} = {}) {
  const options = parseStorePromoArguments(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return 0;
  }
  runCommand(process.execPath, ["scripts/verify-store-promos.mjs"], { cwd });
  runCommand("maestro", ["--version"], { cwd });

  const configuredLocales = readAppLocaleOptions(cwd);
  const locales =
    options.locale === "all"
      ? configuredLocales.map(({ value }) => value)
      : [options.locale];
  for (const locale of locales) {
    if (!configuredLocales.some(({ value }) => value === locale)) {
      throw new Error(`Unknown locale: ${locale}`);
    }
  }

  let device;
  let cleanup = () => {};
  if (options.platform === "ios") {
    const simulator = ensureSimulator({
      cwd,
      display: options.display,
      requestedUdid: options.udid,
    });
    const derivedData = path.join(
      cwd,
      "artifacts",
      "store-promos",
      ".build",
      "ios",
      options.display,
    );
    const iosApp = path.join(
      derivedData,
      "Build",
      "Products",
      "Release-iphonesimulator",
      "MrBroccoli.app",
    );
    if (!options.skipBuild) {
      buildIsolatedApp({
        cwd,
        derivedData,
        target: iosApp,
        udid: simulator.udid,
      });
    } else if (!fs.existsSync(iosApp)) {
      throw new Error(`--skip-build app does not exist: ${iosApp}`);
    }
    runCommand("xcrun", ["simctl", "install", simulator.udid, iosApp], {
      cwd,
    });
    runCommand(
      "xcrun",
      [
        "simctl",
        "get_app_container",
        simulator.udid,
        STORE_PROMO_APP_ID,
        "app",
      ],
      { cwd },
    );
    device = simulator;
  } else {
    const emulator = ensureAndroidEmulator({
      cwd,
      requestedUdid: options.udid,
    });
    const target = STORE_PROMO_ANDROID_DISPLAYS[options.display];
    const accepted = target.acceptedPortraitDimensions.some(
      ([width, height]) => width === emulator.width && height === emulator.height,
    );
    if (!accepted) {
      throw new Error(
        `Android ${options.display} emulator has ${emulator.width}x${emulator.height}; expected ${target.acceptedPortraitDimensions.map(([width, height]) => `${width}x${height}`).join(" or ")}`,
      );
    }
    const androidApk = path.join(
      cwd,
      "android",
      "app",
      "build",
      "outputs",
      "apk",
      "release",
      "app-release.apk",
    );
    if (!options.skipBuild) {
      buildIsolatedAndroidApp({ cwd, target: androidApk });
    } else if (!fs.existsSync(androidApk)) {
      throw new Error(`--skip-build APK does not exist: ${androidApk}`);
    }
    installAndroidApp({ cwd, target: androidApk, udid: emulator.udid });
    device = emulator;
    cleanup = () => exitAndroidDemoMode({ cwd, udid: emulator.udid });
  }

  try {
    for (const locale of locales) {
      const rawOutput = path.join(
        cwd,
        "artifacts",
        "store-promos",
        ".maestro-runs",
        options.platform,
        options.display,
        locale,
      );
      captureMaestroFlow({
        cwd,
        locale,
        outputDirectory: rawOutput,
        platform: options.platform,
        udid: device.udid,
      });
      const result = collectScreenshots({
        cwd,
        display: options.display,
        locale,
        platform: options.platform,
        rawOutput,
      });
      process.stdout.write(
        `Store promos complete: ${result.destination} (${result.manifest.screenshotCount} screenshots).\n`,
      );
    }
  } finally {
    cleanup();
  }

  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    process.exitCode = runStorePromos();
  } catch (error) {
    process.stderr.write(
      `Store-promo capture failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
