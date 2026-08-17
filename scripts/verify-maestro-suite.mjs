import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import ts from "typescript";
import { parseAllDocuments } from "yaml";

export const MAESTRO_MINIMUM_VERSION = "2.7.0";
export const MAESTRO_COLOR_SCHEMES = Object.freeze(["light", "dark"]);
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
export const MAESTRO_LOCALIZED_SCREENSHOTS = Object.freeze([
  "language-picker",
  "settings-app-01",
  "settings-app-02",
  "theme-picker",
  "settings-overview-01",
  "settings-connections-01",
  "settings-thinking-01",
  "settings-listening-01",
  "settings-speaking-01",
  "settings-search-01",
  "settings-data-01",
  "home-portrait",
  "conversation-drawer",
  "home-landscape",
]);

export const RETIRED_MAESTRO_SELECTORS = Object.freeze([
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
  "auto-setup-card",
  "auto-setup-proposal",
  "auto-setup-install",
  "automatic-setup-group",
  "intro-banner",
  "intro-flow-content",
  "intro-welcome-play",
  "intro-welcome-stop",
  "intro-stepper-dot-1",
  "intro-stepper-dot-2",
  "intro-setup-step",
  "intro-try-step",
  "intro-auto-start",
  "intro-manual-switch",
  "intro-manual-catalogue",
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

function readCheckedInMaestroFiles(cwd) {
  const root = path.join(cwd, ".maestro");
  return fs
    .readdirSync(root, { recursive: true })
    .filter((entry) => /\.ya?ml$/.test(String(entry)))
    .map((entry) => path.join(root, String(entry)));
}

function readCheckedInMaestroSource(cwd) {
  return readCheckedInMaestroFiles(cwd)
    .map((filePath) => fs.readFileSync(filePath, "utf8"))
    .join("\n");
}

export function findMaestroYamlErrors(source, fileName = "Maestro YAML") {
  return parseAllDocuments(source, {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  }).flatMap((document, index) =>
    document.errors.map(
      (error) =>
        `${fileName} document ${index + 1} is invalid YAML: ${error.message}`,
    ),
  );
}

export function findUnsettledNativeModalDismissals(
  source,
  fileName = "Maestro YAML",
) {
  const errors = [];
  const dismissal =
    /^- tapOn:\r?\n {4}id: (conversation-drawer-close|settings-close-button)\r?\n/gm;
  for (const match of source.matchAll(dismissal)) {
    const dismissedSelector = match[1];
    const absentSelector =
      dismissedSelector === "settings-close-button"
        ? "settings-modal-title"
        : dismissedSelector;
    const boundary = new RegExp(
      `^- waitForAnimationToEnd\\r?\\n- assertNotVisible:\\r?\\n {4}id: ${absentSelector}\\r?\\n`,
    );
    const remainder = source.slice((match.index ?? 0) + match[0].length);
    if (!boundary.test(remainder)) {
      errors.push(
        `${fileName} must wait for ${dismissedSelector} to finish dismissing`,
      );
    }
  }
  return errors;
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
        if (
          !value ||
          !definition ||
          !ts.isObjectLiteralExpression(definition)
        ) {
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
  const configPath = path.join(cwd, ".maestro/config.yaml");

  for (const filePath of [
    localizedFlowPath,
    smokeFlowPath,
    layoutFlowPath,
    accessibilityFlowPath,
    screenReaderFlowPath,
    orbFlowPath,
    orbRunnerPath,
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
  const checkedInMaestroSource = readCheckedInMaestroSource(cwd);
  const maestroSource = [checkedInMaestroSource, orbRunner].join("\n");

  for (const filePath of readCheckedInMaestroFiles(cwd)) {
    const source = fs.readFileSync(filePath, "utf8");
    errors.push(
      ...findMaestroYamlErrors(source, path.relative(cwd, filePath)),
      ...findUnsettledNativeModalDismissals(
        source,
        path.relative(cwd, filePath),
      ),
    );
  }

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
    "provider-connection-sheet-anthropic-header-handle",
    "route-byline",
    "route-picker-list",
    "route-picker-row-mode-1",
    "route-picker-row-mode-2",
    "route-picker-row-mode-3",
    "satellite-stop",
    "landscape-left-pane",
    "landscape-right-pane",
  ]) {
    if (!layoutFlow.includes(selector)) {
      errors.push(
        `Landscape Maestro coverage is missing selector: ${selector}`,
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
    errors.push(
      "Parameterized orb Maestro flow must capture exactly one state",
    );
  }

  for (const selector of ["main-screen"]) {
    if (!screenReaderFlow.includes(selector)) {
      errors.push(`Screen-reader preparation is missing selector: ${selector}`);
    }
  }

  for (const selector of [
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

  if (localizedScreenshotCount !== MAESTRO_LOCALIZED_SCREENSHOTS.length) {
    errors.push(
      `Localized flow must capture ${MAESTRO_LOCALIZED_SCREENSHOTS.length} non-redundant surfaces, found ${localizedScreenshotCount}`,
    );
  }
  for (const screenshot of MAESTRO_LOCALIZED_SCREENSHOTS) {
    if (!localizedFlow.includes(`/locales/\${LOCALE}/${screenshot}`)) {
      errors.push(`Localized Maestro coverage is missing ${screenshot}`);
    }
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
