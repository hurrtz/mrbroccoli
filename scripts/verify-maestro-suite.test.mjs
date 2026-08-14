import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  countScreenshots,
  findMaestroYamlErrors,
  findRetiredMaestroSelectors,
  findUnsettledNativeModalDismissals,
  MAESTRO_ANDROID_ELIGIBLE_AUTO_SETUP_FLOW,
  MAESTRO_SMOKE_FLOW,
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

test("rejects malformed Maestro YAML even when expected selectors remain", () => {
  const errors = findMaestroYamlErrors(
    `
appId: com.example.maestro
---
- tapOn:
    id: intro-banner
- assertVisible: [intro-setup-step
`,
    "fixture.yaml",
  );

  assert.equal(errors.length, 1);
  assert.match(errors[0], /fixture\.yaml document 2 is invalid YAML/);
});

test("requires native drawers and Settings to settle before the next action", () => {
  const settled = `
- tapOn:
    id: conversation-drawer-close
- waitForAnimationToEnd
- assertNotVisible:
    id: conversation-drawer-close
- tapOn:
    id: main-settings-button
- tapOn:
    id: settings-close-button
- waitForAnimationToEnd
- assertNotVisible:
    id: settings-modal-title
- setOrientation: LANDSCAPE_LEFT
`;
  assert.deepEqual(findUnsettledNativeModalDismissals(settled), []);

  assert.deepEqual(
    findUnsettledNativeModalDismissals(
      settled.replace(
        /- waitForAnimationToEnd\n- assertNotVisible:\n {4}id: settings-modal-title\n/,
        "",
      ),
      "fixture.yaml",
    ),
    ["fixture.yaml must wait for settings-close-button to finish dismissing"],
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

test("rejects retired intro selectors, screenshots, and titles", () => {
  assert.deepEqual(
    findRetiredMaestroSelectors(`
- extendedWaitUntil:
    visible: "Playing — tap to stop"
- tapOn:
    id: free-edition-status
- tapOn:
    id: intro-stepper-dot-3
- tapOn:
    id: intro-stepper-dot-4
- tapOn:
    id: intro-stepper-dot-5
- tapOn:
    id: intro-stepper-dot-6
- assertVisible:
    id: intro-requirements-step
- assertVisible:
    id: intro-back-face
- assertVisible:
    id: intro-close-face
- tapOn:
    id: auto-setup-manual
- tapOn:
    id: intro-install-local
- tapOn:
    id: intro-connect-provider
- tapOn:
    id: intro-open-stt
- tapOn:
    id: intro-open-tts
- tapOn:
    id: intro-open-premium
- tapOn:
    id: intro-voice-record
- takeScreenshot:
    path: intro-02-requirements
- takeScreenshot:
    path: intro-03-auto-setup
- takeScreenshot:
    path: intro-04-thinking-route
- takeScreenshot:
    path: intro-05-listening
- takeScreenshot:
    path: intro-06-speaking
- takeScreenshot:
    path: intro-07-premium
- assertVisible: "What you actually need"
- assertVisible: "Pick something to think with"
- assertVisible: "Let it hear you"
- assertVisible: "Let it speak back"
- assertVisible: "That is everything"
`),
    [
      "Playing — tap to stop",
      "free-edition-status",
      "intro-stepper-dot-3",
      "intro-stepper-dot-4",
      "intro-stepper-dot-5",
      "intro-stepper-dot-6",
      "intro-requirements-step",
      "intro-back-face",
      "intro-close-face",
      "auto-setup-manual",
      "intro-install-local",
      "intro-connect-provider",
      "intro-open-stt",
      "intro-open-tts",
      "intro-open-premium",
      "intro-voice-",
      "intro-02-requirements",
      "intro-03-auto-setup",
      "intro-04-thinking-route",
      "intro-05-listening",
      "intro-06-speaking",
      "intro-07-premium",
      "What you actually need",
      "Pick something to think with",
      "Let it hear you",
      "Let it speak back",
      "That is everything",
    ],
  );
});

test("smoke covers Welcome and Setup, then restarts without claiming Try", () => {
  const smokeFlow = fs.readFileSync(
    path.join(process.cwd(), MAESTRO_SMOKE_FLOW),
    "utf8",
  );

  for (const selector of [
    "intro-welcome-play",
    "intro-welcome-stop",
    "intro-stepper-dot-1",
    "intro-setup-step",
    "intro-auto-start",
    "intro-manual-switch",
    "intro-manual-catalogue",
    "stopApp",
    "launchApp",
    "intro-banner-dismiss",
  ]) {
    assert.match(smokeFlow, new RegExp(selector));
  }
  assert.doesNotMatch(smokeFlow, /intro-stepper-dot-2|intro-try-step/);
  const stopApp = smokeFlow.indexOf("stopApp");
  const relaunch = smokeFlow.indexOf("launchApp", stopApp);
  assert.ok(stopApp < relaunch);
  assert.ok(relaunch < smokeFlow.indexOf("intro-banner-dismiss"));
  assert.ok(
    smokeFlow.indexOf("intro-banner-dismiss") <
      smokeFlow.indexOf("main-settings-button"),
  );
});

test("eligible setup restarts after Ready without claiming a stale completion action", () => {
  const eligibleFlow = fs.readFileSync(
    path.join(process.cwd(), MAESTRO_ANDROID_ELIGIBLE_AUTO_SETUP_FLOW),
    "utf8",
  );
  const proposal = eligibleFlow.indexOf("auto-setup-proposal");
  const proposalLabel = eligibleFlow.indexOf(
    '"Recommended for this phone"',
    proposal,
  );
  const scrollToInstall = eligibleFlow.indexOf("scrollUntilVisible", proposal);
  const installLabel = eligibleFlow.indexOf(
    '"Download and install"',
    scrollToInstall,
  );
  const installSelector = eligibleFlow.indexOf(
    "auto-setup-install",
    scrollToInstall,
  );
  const installTap = eligibleFlow.indexOf(
    "auto-setup-install",
    installSelector + 1,
  );
  const installingScreenshot = eligibleFlow.indexOf(
    "auto-setup-installing",
    installTap,
  );
  const readyScreenshot = eligibleFlow.indexOf("auto-setup-ready");
  const doneState = eligibleFlow.indexOf("auto-setup-done-state", installTap);
  const scrollToDone = eligibleFlow.indexOf("scrollUntilVisible", doneState);
  const doneScrollTarget = eligibleFlow.indexOf(
    "auto-setup-done",
    scrollToDone,
  );
  const stopApp = eligibleFlow.indexOf("stopApp", readyScreenshot);
  const launchApp = eligibleFlow.indexOf("launchApp", stopApp);
  const dismissBanner = eligibleFlow.indexOf("intro-banner-dismiss", launchApp);
  const settings = eligibleFlow.indexOf("main-settings-button", dismissBanner);

  assert.ok(proposal < proposalLabel);
  assert.ok(proposalLabel < scrollToInstall);
  assert.doesNotMatch(
    eligibleFlow.slice(proposal, scrollToInstall),
    /"Download and install"/,
  );
  assert.ok(scrollToInstall < installSelector);
  assert.ok(installSelector < installLabel);
  assert.ok(installLabel < installTap);
  assert.ok(installSelector < installTap);
  assert.ok(installTap < installingScreenshot);
  assert.ok(installTap < doneState);
  assert.ok(doneState < scrollToDone);
  assert.ok(scrollToDone < doneScrollTarget);
  assert.ok(doneScrollTarget < readyScreenshot);
  assert.ok(readyScreenshot < stopApp);
  assert.ok(stopApp < launchApp);
  assert.ok(launchApp < dismissBanner);
  assert.ok(dismissBanner < settings);
  assert.doesNotMatch(eligibleFlow, /tapOn: "Done"|intro-close|intro-try-step/);
});

test("low-memory setup reaches Thinking through the current Intro manual catalogue", () => {
  const lowMemoryFlow = fs.readFileSync(
    path.join(
      process.cwd(),
      ".maestro/flows/runtime/android-low-memory-auto-setup.yaml",
    ),
    "utf8",
  );
  const retry = lowMemoryFlow.lastIndexOf(
    'visible: "No suitable set for this phone"',
  );
  const manualSwitch = lowMemoryFlow.indexOf("intro-manual-switch", retry);
  const manualCatalogue = lowMemoryFlow.indexOf(
    "intro-manual-catalogue",
    manualSwitch,
  );
  const scrollToManualLlm = lowMemoryFlow.indexOf(
    "scrollUntilVisible",
    manualCatalogue,
  );
  const manualLlmScroll = lowMemoryFlow.indexOf(
    "intro-manual-llm",
    scrollToManualLlm,
  );
  const manualLlmTap = lowMemoryFlow.indexOf(
    "intro-manual-llm",
    manualLlmScroll + 1,
  );
  const thinkingPage = lowMemoryFlow.indexOf(
    "settings-page-thinking",
    manualLlmTap,
  );

  assert.ok(retry < manualSwitch);
  assert.ok(manualSwitch < manualCatalogue);
  assert.ok(manualCatalogue < scrollToManualLlm);
  assert.ok(scrollToManualLlm < manualLlmScroll);
  assert.ok(manualLlmScroll < manualLlmTap);
  assert.ok(manualLlmTap < thinkingPage);
  assert.doesNotMatch(lowMemoryFlow, /auto-setup-manual/);
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
        write(message) {
          messages.push(message);
          return true;
        },
      }),
      udid: "emulator-5554",
      wait(milliseconds) {
        retryDelays.push(milliseconds);
      },
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
          stderr: /** @type {any} */ ({
            write() {
              return true;
            },
          }),
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
    ["settings", "put", "secure", "high_text_contrast_enabled", "1"],
    ["cmd", "uimode", "night", "yes"],
    ["settings", "put", "system", "font_scale", "1.0"],
    ["settings", "delete", "secure", "high_text_contrast_enabled"],
    ["cmd", "uimode", "night", "no"],
  ]);
});
