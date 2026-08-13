import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import ts from "typescript";

export const MAESTRO_MINIMUM_VERSION = "2.7.0";
export const MAESTRO_LOCALIZED_FLOW =
  ".maestro/templates/localized-coverage.yaml";
export const MAESTRO_SMOKE_FLOW = ".maestro/flows/smoke/home-and-settings.yaml";
export const MAESTRO_LAYOUT_FLOW =
  ".maestro/flows/visual/drive-three-routes-landscape.yaml";
export const MAESTRO_ACCESSIBILITY_FLOW =
  ".maestro/flows/visual/accessibility-display.yaml";
export const MAESTRO_SCREEN_READER_FLOW =
  ".maestro/flows/accessibility/screen-reader-home.yaml";
export const MAESTRO_ORB_FLOW =
  ".maestro/flows/runtime/orb-phase-progress.yaml";
export const MAESTRO_ANDROID_AUTO_SETUP_FLOW =
  ".maestro/flows/runtime/android-low-memory-auto-setup.yaml";
export const MAESTRO_ANDROID_ELIGIBLE_AUTO_SETUP_FLOW =
  ".maestro/flows/runtime/android-eligible-auto-setup.yaml";

export const RETIRED_MAESTRO_SELECTORS = Object.freeze([
  "settings-overview-row-local",
  "on-device-settings-page",
  "on-device-llm-disclosure",
  "on-device-stt-disclosure",
  "on-device-tts-disclosure",
  "on-device-language-selection",
  "on-device-download-",
  "on-device-test-",
  "on-device-performance-",
]);

export function findRetiredMaestroSelectors(source) {
  return RETIRED_MAESTRO_SELECTORS.filter((selector) =>
    source.includes(selector),
  );
}

function readCheckedInMaestroSource(cwd) {
  const root = path.join(cwd, ".maestro");
  return fs
    .readdirSync(root, { recursive: true })
    .filter((entry) => /\.ya?ml$/.test(String(entry)))
    .map((entry) => fs.readFileSync(path.join(root, String(entry)), "utf8"))
    .join("\n");
}

const REQUIRED_LOCALIZED_SELECTORS = [
  "app-language-picker-option-${LOCALE}",
  "app-settings-page-${LOCALE}",
  "settings-page-app",
  "settings-page-overview",
  "settings-page-connections",
  "settings-page-thinking",
  "settings-page-listening",
  "settings-page-speaking",
  "settings-page-search",
  "settings-page-data",
  "conversation-drawer-empty-state",
  "landscape-left-pane",
  "landscape-right-pane",
];

function propertyName(node) {
  if (
    ts.isIdentifier(node) ||
    ts.isStringLiteral(node) ||
    ts.isNumericLiteral(node)
  ) {
    return node.text;
  }

  return null;
}

export function readAppLocaleOptions(cwd = process.cwd()) {
  const registryPath = path.join(cwd, "src/i18n/localeRegistry.ts");
  const source = fs.readFileSync(registryPath, "utf8");
  const sourceFile = ts.createSourceFile(
    registryPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  /** @type {{value: string, label: string}[] | null} */
  let locales = null;

  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) {
      return;
    }

    node.declarationList.declarations.forEach((declaration) => {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== "APP_LOCALES" ||
        !declaration.initializer
      ) {
        return;
      }

      const initializer = ts.isAsExpression(declaration.initializer)
        ? declaration.initializer.expression
        : declaration.initializer;

      if (!ts.isObjectLiteralExpression(initializer)) {
        return;
      }

      locales = initializer.properties.flatMap((property) => {
        if (!ts.isPropertyAssignment(property)) {
          return [];
        }

        const value = propertyName(property.name);
        const definition = ts.isCallExpression(property.initializer)
          ? property.initializer.arguments[0]
          : null;
        if (!value || !definition || !ts.isObjectLiteralExpression(definition)) {
          return [];
        }

        const nativeNameProperty = definition.properties.find(
          (candidate) =>
            ts.isPropertyAssignment(candidate) &&
            propertyName(candidate.name) === "nativeName",
        );
        if (
          !nativeNameProperty ||
          !ts.isPropertyAssignment(nativeNameProperty) ||
          !ts.isStringLiteral(nativeNameProperty.initializer)
        ) {
          return [];
        }

        return [{ value, label: nativeNameProperty.initializer.text }];
      });
    });
  });

  if (!locales || locales.length === 0) {
    throw new Error("Could not derive APP_LANGUAGES from localeRegistry.ts");
  }

  return locales;
}

export function readAppLanguages(cwd = process.cwd()) {
  return readAppLocaleOptions(cwd).map(({ value }) => value);
}

export function countScreenshots(flowText) {
  return [...flowText.matchAll(/^\s*-\s+takeScreenshot:/gm)].length;
}

export function validateMaestroSuite(cwd = process.cwd()) {
  const errors = [];
  const languages = readAppLanguages(cwd);
  const localizedFlowPath = path.join(cwd, MAESTRO_LOCALIZED_FLOW);
  const smokeFlowPath = path.join(cwd, MAESTRO_SMOKE_FLOW);
  const layoutFlowPath = path.join(cwd, MAESTRO_LAYOUT_FLOW);
  const accessibilityFlowPath = path.join(cwd, MAESTRO_ACCESSIBILITY_FLOW);
  const screenReaderFlowPath = path.join(cwd, MAESTRO_SCREEN_READER_FLOW);
  const orbFlowPath = path.join(cwd, MAESTRO_ORB_FLOW);
  const orbRunnerPath = path.join(cwd, "scripts/run-orb-matrix.mjs");
  const androidAutoSetupFlowPath = path.join(
    cwd,
    MAESTRO_ANDROID_AUTO_SETUP_FLOW,
  );
  const androidEligibleAutoSetupFlowPath = path.join(
    cwd,
    MAESTRO_ANDROID_ELIGIBLE_AUTO_SETUP_FLOW,
  );
  const configPath = path.join(cwd, ".maestro/config.yaml");

  for (const filePath of [
    localizedFlowPath,
    smokeFlowPath,
    layoutFlowPath,
    accessibilityFlowPath,
    screenReaderFlowPath,
    orbFlowPath,
    orbRunnerPath,
    androidAutoSetupFlowPath,
    androidEligibleAutoSetupFlowPath,
    configPath,
  ]) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing Maestro file: ${path.relative(cwd, filePath)}`);
    }
  }

  if (errors.length > 0) {
    return {
      accessibilityScreenshotCount: 0,
      errors,
      languages,
      localizedScreenshotCount: 0,
    };
  }

  const localizedFlow = fs.readFileSync(localizedFlowPath, "utf8");
  const smokeFlow = fs.readFileSync(smokeFlowPath, "utf8");
  const layoutFlow = fs.readFileSync(layoutFlowPath, "utf8");
  const accessibilityFlow = fs.readFileSync(accessibilityFlowPath, "utf8");
  const screenReaderFlow = fs.readFileSync(screenReaderFlowPath, "utf8");
  const orbFlow = fs.readFileSync(orbFlowPath, "utf8");
  const orbRunner = fs.readFileSync(orbRunnerPath, "utf8");
  const androidAutoSetupFlow = fs.readFileSync(
    androidAutoSetupFlowPath,
    "utf8",
  );
  const androidEligibleAutoSetupFlow = fs.readFileSync(
    androidEligibleAutoSetupFlowPath,
    "utf8",
  );
  const checkedInMaestroSource = readCheckedInMaestroSource(cwd);
  const maestroSource = [checkedInMaestroSource, orbRunner].join("\n");

  for (const selector of findRetiredMaestroSelectors(checkedInMaestroSource)) {
    errors.push(`Maestro flows still reference retired selector: ${selector}`);
  }

  for (const selector of [
    "API key: Anthropic",
    'visible: "Cancel"',
    "Not tested",
    "hideKeyboard",
    "input-mode-picker",
    "input-mode-picker-option-drive-session",
    "provider-connection-close-anthropic",
    "route-byline",
    "route-picker-list",
    "route-picker-row-mode-1",
    "route-picker-row-mode-2",
    "route-picker-row-mode-3",
    "drive-session-controls",
    "landscape-left-pane",
    "landscape-right-pane",
  ]) {
    if (!layoutFlow.includes(selector)) {
      errors.push(`Landscape Maestro coverage is missing selector: ${selector}`);
    }
  }

  for (const selector of [
    "Recommended for this phone",
    "Download and install",
    "Installed and selected.",
    "thinking-slot-mode-1",
    "model-storage-group",
  ]) {
    if (!androidEligibleAutoSetupFlow.includes(selector)) {
      errors.push(
        `Android eligible automatic-setup coverage is missing selector: ${selector}`,
      );
    }
  }

  for (const selector of [
    "voice-stage-${PHASE}",
    "${ORB_ID}",
    "${SCREENSHOT_NAME}",
  ]) {
    if (!orbFlow.includes(selector)) {
      errors.push(`Orb Maestro coverage is missing state: ${selector}`);
    }
  }

  for (const state of [
    '"idle", 0, 0, 0',
    '"recording", 0.5, 0, 0',
    '"transcribing", 0, 0, 0',
    '"thinking-briefly", 0.5, 0.5, 0',
    '"searching", 0.75, 0.75, 0',
    '"thinking", 1, 1, 0',
    '"synthesizing", 0.25, 0.25, 0',
    '"speaking", 0, 1, 0',
    '"thinking", 1, 1, 0.5',
    '"thinking", 1, 1, 1',
  ]) {
    if (!orbRunner.includes(state)) {
      errors.push(`Orb matrix runner is missing state: ${state}`);
    }
  }

  if (countScreenshots(orbFlow) !== 1) {
    errors.push("Parameterized orb Maestro flow must capture exactly one state");
  }

  for (const selector of [
    "auto-setup-card",
    "No suitable set for this phone",
    "Try again",
    "auto-setup-manual",
    "settings-page-thinking",
    "thinking-add-model",
  ]) {
    if (!androidAutoSetupFlow.includes(selector)) {
      errors.push(
        `Android automatic-setup coverage is missing selector: ${selector}`,
      );
    }
  }

  for (const selector of [
    "intro-banner",
    "main-screen",
  ]) {
    if (!screenReaderFlow.includes(selector)) {
      errors.push(`Screen-reader preparation is missing selector: ${selector}`);
    }
  }

  for (const selector of [
    "intro-banner",
    "intro-flow-content",
    "intro-welcome-play",
    "intro-stepper-dot-3",
    "intro-stepper-dot-4",
    "intro-stepper-dot-5",
    "intro-stepper-dot-6",
    "auto-setup-card",
    "intro-done",
    "intro-back",
    "intro-close",
    "main-screen",
    "settings-page-overview",
    "settings-page-app",
    "landscape-left-pane",
    "landscape-right-pane",
  ]) {
    if (!smokeFlow.includes(selector)) {
      errors.push(`Smoke Maestro coverage is missing selector: ${selector}`);
    }
  }

  for (const selector of REQUIRED_LOCALIZED_SELECTORS) {
    if (!localizedFlow.includes(selector)) {
      errors.push(
        `Localized Maestro coverage is missing selector: ${selector}`,
      );
    }
  }

  for (const selector of [
    "intro-banner",
    "main-screen",
    "conversation-drawer-empty-state",
    "settings-page-overview",
    "settings-page-app",
    "landscape-left-pane",
    "landscape-right-pane",
  ]) {
    if (!accessibilityFlow.includes(selector)) {
      errors.push(
        `Accessibility Maestro coverage is missing selector: ${selector}`,
      );
    }
  }

  const accessibilityScreenshotCount = countScreenshots(accessibilityFlow);
  if (accessibilityScreenshotCount < 7) {
    errors.push(
      `Accessibility flow must capture at least 7 surfaces, found ${accessibilityScreenshotCount}`,
    );
  }

  const exactLanguageOptionSelectors = localizedFlow.match(
    /id:\s*\^app-language-picker-option-\$\{LOCALE\}\$/g,
  );
  if ((exactLanguageOptionSelectors?.length ?? 0) < 2) {
    errors.push(
      "Localized Maestro coverage must find and tap the exact requested-language selector",
    );
  }

  if (
    /id:\s*\^app-language-picker-option-\$\{LOCALE\}\$[\s\S]{0,160}centerElement:\s*true/.test(
      localizedFlow,
    )
  ) {
    errors.push(
      "Localized Maestro coverage must not center language rows because iOS can overscroll the requested option",
    );
  }

  if (
    !/LOCALE_NEEDS_SAFE_SCROLL[\s\S]{0,160}start:\s*50%,80%[\s\S]{0,80}end:\s*50%,65%/.test(
      localizedFlow,
    )
  ) {
    errors.push(
      "Localized Maestro coverage must move lower iOS language rows into the safe tap area",
    );
  }

  if (!/id:\s*\^app-settings-page-\$\{LOCALE\}\$/.test(localizedFlow)) {
    errors.push(
      "Localized Maestro coverage must assert the exact active language after selection",
    );
  }

  if (languages.length !== 19) {
    errors.push(
      `Expected 19 registered UI languages, found ${languages.length}`,
    );
  }

  if (
    /(?:API_KEY|TOKEN|PASSWORD|SECRET|MR_BROCCOLI_[A-Z_]*KEY)/.test(
      maestroSource,
    )
  ) {
    errors.push("Maestro files must not reference credentials or secrets");
  }

  const localizedScreenshotCount = countScreenshots(localizedFlow);

  if (localizedScreenshotCount < 30) {
    errors.push(
      `Localized flow must capture at least 30 surfaces, found ${localizedScreenshotCount}`,
    );
  }

  return {
    accessibilityScreenshotCount,
    errors,
    languages,
    localizedScreenshotCount,
  };
}

export function runMaestroSuiteVerification({
  cwd = process.cwd(),
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    const result = validateMaestroSuite(cwd);

    if (result.errors.length > 0) {
      stderr.write(
        [
          "Maestro suite verification failed:",
          ...result.errors.map((error) => `- ${error}`),
          "",
        ].join("\n"),
      );
      return 1;
    }

    stdout.write(
      `Maestro covers ${result.languages.length} UI languages across ${result.localizedScreenshotCount} localized screenshots per platform.\n`,
    );
    return 0;
  } catch (error) {
    stderr.write(
      `Maestro suite verification failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    return 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  process.exitCode = runMaestroSuiteVerification();
}
