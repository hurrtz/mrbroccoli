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

export function readAppLanguages(cwd = process.cwd()) {
  const registryPath = path.join(cwd, "src/i18n/localeRegistry.ts");
  const source = fs.readFileSync(registryPath, "utf8");
  const sourceFile = ts.createSourceFile(
    registryPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  let languages = null;

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

      languages = initializer.properties
        .map((property) =>
          "name" in property ? propertyName(property.name) : null,
        )
        .filter(Boolean);
    });
  });

  if (!languages || languages.length === 0) {
    throw new Error("Could not derive APP_LANGUAGES from localeRegistry.ts");
  }

  return languages;
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
  const configPath = path.join(cwd, ".maestro/config.yaml");

  for (const filePath of [
    localizedFlowPath,
    smokeFlowPath,
    layoutFlowPath,
    configPath,
  ]) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing Maestro file: ${path.relative(cwd, filePath)}`);
    }
  }

  if (errors.length > 0) {
    return { errors, languages, localizedScreenshotCount: 0 };
  }

  const localizedFlow = fs.readFileSync(localizedFlowPath, "utf8");
  const smokeFlow = fs.readFileSync(smokeFlowPath, "utf8");
  const layoutFlow = fs.readFileSync(layoutFlowPath, "utf8");
  const maestroSource = [
    localizedFlow,
    smokeFlow,
    layoutFlow,
    fs.readFileSync(configPath, "utf8"),
  ].join("\n");

  for (const selector of [
    "API key: Anthropic",
    "input-mode-picker-drive-session",
    "response-mode-option-mode-1",
    "response-mode-option-mode-2",
    "response-mode-option-mode-3",
    "drive-session-controls",
    "landscape-left-pane",
    "landscape-right-pane",
  ]) {
    if (!layoutFlow.includes(selector)) {
      errors.push(`Landscape Maestro coverage is missing selector: ${selector}`);
    }
  }

  for (const selector of REQUIRED_LOCALIZED_SELECTORS) {
    if (!localizedFlow.includes(selector)) {
      errors.push(
        `Localized Maestro coverage is missing selector: ${selector}`,
      );
    }
  }

  if (
    !/id:\s*\^app-language-picker-option-\$\{LOCALE\}\$[\s\S]{0,160}centerElement:\s*true/.test(
      localizedFlow,
    )
  ) {
    errors.push(
      "Localized Maestro coverage must center an exact requested-language selector before selecting it",
    );
  }

  const exactLanguageOptionSelectors = localizedFlow.match(
    /id:\s*\^app-language-picker-option-\$\{LOCALE\}\$/g,
  );
  if ((exactLanguageOptionSelectors?.length ?? 0) < 2) {
    errors.push(
      "Localized Maestro coverage must use exact requested-language selectors for scrolling and tapping",
    );
  }

  if (!/id:\s*\^app-settings-page-\$\{LOCALE\}\$/.test(localizedFlow)) {
    errors.push(
      "Localized Maestro coverage must assert the exact active language after selection",
    );
  }

  if (
    !/id:\s*settings-guided-setup[\s\S]{0,160}centerElement:\s*true/.test(
      localizedFlow,
    )
  ) {
    errors.push(
      "Localized Maestro coverage must center guided setup below the fixed Settings header",
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

  return { errors, languages, localizedScreenshotCount };
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
