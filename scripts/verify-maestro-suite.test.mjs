import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  countScreenshots,
  findRetiredMaestroSelectors,
  readAppLanguages,
  readAppLocaleOptions,
  validateMaestroSuite,
} from "./verify-maestro-suite.mjs";
import {
  configureAccessibilityDisplay,
  localeNeedsSafeScroll,
  runFlow,
} from "./run-maestro-suite.mjs";
import {
  getOrbFixtureOpenCommand,
  getOrbFixtureStopCommand,
  ORB_MATRIX,
  parseOrbMatrixArguments,
} from "./run-orb-matrix.mjs";

test("derives the complete locale order from the TypeScript registry", () => {
  const languages = readAppLanguages();

  assert.equal(languages.length, 19);
  assert.deepEqual(languages.slice(0, 3), ["en", "de", "uk"]);
  assert.deepEqual(languages.slice(-2), ["sv", "ur"]);
});

test("derives native labels for exact locale selection", () => {
  const locales = readAppLocaleOptions();

  assert.deepEqual(locales.slice(7, 9), [
    { value: "pt", label: "Português" },
    { value: "pt-BR", label: "Português (Brasil)" },
  ]);
});

test("counts only explicit screenshot commands", () => {
  assert.equal(
    countScreenshots(`
- takeScreenshot:
    path: one
- assertVisible: example
- takeScreenshot:
    path: two
`),
    2,
  );
});

test("rejects selectors from the retired standalone Device page", () => {
  assert.deepEqual(
    findRetiredMaestroSelectors(`
- tapOn:
    id: settings-overview-row-local
- assertVisible:
    id: on-device-settings-page
- tapOn:
    id: local-model-download-whisper-tiny
`),
    ["settings-overview-row-local", "on-device-settings-page"],
  );
});

test("defines the complete deterministic orb boundary matrix", () => {
  assert.equal(ORB_MATRIX.length, 10);
  assert.deepEqual(ORB_MATRIX[0], ["01-idle-zero", "idle", 0, 0, 0]);
  assert.deepEqual(ORB_MATRIX.at(-1), [
    "10-thinking-overtime-full",
    "thinking",
    1,
    1,
    1,
  ]);
});

test("package-targets Android orb fixture URLs without a chooser", () => {
  const command = getOrbFixtureOpenCommand({
    appId: "com.example.maestro",
    platform: "android",
    udid: "emulator-5554",
    url: "mrbroccoli://store-promos?phase=idle&overtime=0",
  });

  assert.equal(command[0], "adb");
  assert.deepEqual(command[1].slice(-3), [
    "'mrbroccoli://store-promos?phase=idle&overtime=0'",
    "-p",
    "com.example.maestro",
  ]);
  assert.equal(command[1].at(-1), "com.example.maestro");
  assert.deepEqual(
    getOrbFixtureStopCommand({
      appId: "com.example.maestro",
      platform: "android",
      udid: "emulator-5554",
    }),
    [
      "adb",
      [
        "-s",
        "emulator-5554",
        "shell",
        "am",
        "force-stop",
        "com.example.maestro",
      ],
    ],
  );
});

test("requires a supported platform and explicit orb target", () => {
  assert.deepEqual(
    parseOrbMatrixArguments(["--platform", "ios", "--udid", "IOS-UDID"]),
    {
      appId: "com.tobiaswinkler.app.mrbroccoli.maestro",
      outputDirectory: null,
      platform: "ios",
      udid: "IOS-UDID",
    },
  );
  assert.throws(() => parseOrbMatrixArguments(["--platform", "web"]), /Usage/);
});

test("only nudges lower iOS locale rows into the safe tap area", () => {
  assert.equal(localeNeedsSafeScroll("ios", 9), false);
  assert.equal(localeNeedsSafeScroll("ios", 10), true);
  assert.equal(localeNeedsSafeScroll("android", 18), false);
});

test("verifies the repository Maestro matrix", () => {
  const result = validateMaestroSuite();

  assert.deepEqual(result.errors, []);
  assert.ok(result.localizedScreenshotCount >= 30);
});

test("rejects a locale registry that cannot be derived", () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-maestro-"),
  );
  fs.mkdirSync(path.join(directory, "src/i18n"), { recursive: true });
  fs.writeFileSync(
    path.join(directory, "src/i18n/localeRegistry.ts"),
    "export const SOMETHING_ELSE = {};",
  );

  assert.throws(
    () => readAppLanguages(directory),
    /Could not derive APP_LANGUAGES/,
  );
});

test("retries a transient Maestro flow failure exactly once", () => {
  const cwd = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-maestro-retry-"),
  );
  const outputDirectory = path.join(cwd, "artifacts/maestro/retry");
  const messages = [];
  const retryDelays = [];
  let attempts = 0;

  try {
    runFlow({
      cwd,
      environment: { PLATFORM: "android" },
      expectedScreenshotCount: 0,
      flow: ".maestro/fixture.yaml",
      outputDirectory,
      run() {
        attempts += 1;
        if (attempts === 1) {
          throw new Error("transient driver failure");
        }
        return "";
      },
      stderr: /** @type {any} */ ({
        write(message) { messages.push(message); return true; },
      }),
      udid: "emulator-5554",
      wait(milliseconds) { retryDelays.push(milliseconds); },
    });

    assert.equal(attempts, 2);
    assert.deepEqual(retryDelays, [3_000]);
    assert.match(messages.join(""), /failed once; retrying/);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("stops after a repeated Maestro flow failure", () => {
  const cwd = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-maestro-retry-"),
  );
  const outputDirectory = path.join(cwd, "artifacts/maestro/retry");
  let attempts = 0;

  try {
    assert.throws(
      () =>
        runFlow({
          cwd,
          environment: {},
          expectedScreenshotCount: 0,
          flow: ".maestro/fixture.yaml",
          outputDirectory,
          run() {
            attempts += 1;
            throw new Error("persistent failure");
          },
          stderr: /** @type {any} */ ({ write() { return true; } }),
          udid: "emulator-5554",
          wait() {},
        }),
      /persistent failure/,
    );
    assert.equal(attempts, 2);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("configures and restores iOS dark high-contrast large text", () => {
  const calls = [];
  const run = (command, args, options = {}) => {
    calls.push({ command, args, options });
    const option = args[3];
    if (options.capture && option === "appearance") return "light\n";
    if (options.capture && option === "increase_contrast") return "disabled\n";
    if (options.capture && option === "content_size") return "large\n";
    return "";
  };

  const restore = configureAccessibilityDisplay({
    cwd: "/repo",
    platform: "ios",
    run,
    udid: "IOS-UDID",
  });
  restore();

  assert.deepEqual(
    calls
      .filter(({ options }) => !options.capture)
      .map(({ args }) => args.slice(3)),
    [
      ["appearance", "dark"],
      ["increase_contrast", "enabled"],
      ["content_size", "accessibility-extra-large"],
      ["content_size", "large"],
      ["increase_contrast", "disabled"],
      ["appearance", "light"],
    ],
  );
});

test("configures and restores Android dark high-contrast large text", () => {
  const calls = [];
  const run = (command, args, options = {}) => {
    calls.push({ command, args, options });
    if (options.capture && args.includes("font_scale")) return "1.0\n";
    if (options.capture && args.includes("high_text_contrast_enabled")) {
      return "null\n";
    }
    if (options.capture && args.includes("uimode")) return "Night mode: no\n";
    return "";
  };

  const restore = configureAccessibilityDisplay({
    cwd: "/repo",
    platform: "android",
    run,
    udid: "emulator-5554",
  });
  restore();

  const mutations = calls
    .filter(({ options }) => !options.capture)
    .map(({ args }) => args.slice(3));
  assert.deepEqual(mutations, [
    ["settings", "put", "system", "font_scale", "1.3"],
    [
      "settings",
      "put",
      "secure",
      "high_text_contrast_enabled",
      "1",
    ],
    ["cmd", "uimode", "night", "yes"],
    ["settings", "put", "system", "font_scale", "1.0"],
    ["settings", "delete", "secure", "high_text_contrast_enabled"],
    ["cmd", "uimode", "night", "no"],
  ]);
});
