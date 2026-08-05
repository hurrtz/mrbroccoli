import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { readAppLanguages } from "./verify-maestro-suite.mjs";
import {
  STORE_PROMO_ANDROID_DISPLAYS,
  STORE_PROMO_FLOWS,
  STORE_PROMO_IOS_DISPLAYS,
  STORE_PROMO_SCREENSHOT_COUNT,
  STORE_PROMO_SCREENSHOT_NAMES,
} from "./store-promo-config.mjs";

export function readStorePromoScreenshotNames(flowText) {
  return [...flowText.matchAll(/^\s+path:\s+([^\s]+)\s*$/gm)].map(
    ([, name]) => name,
  );
}

export function validateStorePromoSetup(cwd = process.cwd()) {
  const errors = [];
  const flowPaths = Object.entries(STORE_PROMO_FLOWS).flatMap(
    ([platform, flows]) =>
      flows.map((flow) => [platform, path.join(cwd, flow)]),
  );
  const routePath = path.join(cwd, "app/store-promos.tsx");
  const fixturePath = path.join(
    cwd,
    "src/services/storePromoFixtures.ts",
  );
  const runnerPath = path.join(cwd, "scripts/run-store-promos.mjs");

  for (const filePath of [
    ...flowPaths.map(([, flowPath]) => flowPath),
    routePath,
    fixturePath,
    runnerPath,
  ]) {
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing store-promo file: ${path.relative(cwd, filePath)}`);
    }
  }
  if (errors.length > 0) {
    return { errors, languages: [], screenshotNames: [] };
  }

  const route = fs.readFileSync(routePath, "utf8");
  const fixture = fs.readFileSync(fixturePath, "utf8");
  const runner = fs.readFileSync(runnerPath, "utf8");
  const languages = readAppLanguages(cwd);
  let screenshotNames = [];
  for (const platform of Object.keys(STORE_PROMO_FLOWS)) {
    const platformFlows = flowPaths
      .filter(([flowPlatform]) => flowPlatform === platform)
      .map(([, flowPath]) => fs.readFileSync(flowPath, "utf8"));
    const platformScreenshotNames = platformFlows.flatMap((flow) =>
      readStorePromoScreenshotNames(flow),
    );
    const combinedFlow = platformFlows.join("\n");
    if (platform === "ios") {
      screenshotNames = platformScreenshotNames;
    }
    if (platformScreenshotNames.length !== STORE_PROMO_SCREENSHOT_COUNT) {
      errors.push(
        `Expected ${STORE_PROMO_SCREENSHOT_COUNT} ${platform} store screenshots, found ${platformScreenshotNames.length}`,
      );
    }
    if (
      JSON.stringify(platformScreenshotNames) !==
      JSON.stringify(STORE_PROMO_SCREENSHOT_NAMES)
    ) {
      errors.push(
        `${platform} store screenshot names or ordering differ from the contract`,
      );
    }
    for (const selector of [
      "conversation-drawer-empty-state",
      "selectable-message-promo-assistant-2",
      "uber-audit-toggle-promo-assistant-2",
      "conversation-drawer-item-promo-branch",
      "settings-page-thinking",
      "settings-page-speaking",
      "settings-page-data",
    ]) {
      if (!combinedFlow.includes(selector)) {
        errors.push(
          `${platform} store screenshot flow is missing selector: ${selector}`,
        );
      }
    }
    if (!combinedFlow.includes("store-promo-fixture-ready")) {
      errors.push(
        `${platform} store screenshot flow does not wait for fixture persistence`,
      );
    }
  }
  if (!route.includes("seedStorePromoFixture")) {
    errors.push("Store screenshot route does not seed the fixture");
  }
  if (
    !fixture.includes("MAESTRO_APPLICATION_ID_SUFFIX") ||
    !fixture.includes("isStorePromoApplicationId")
  ) {
    errors.push("Store screenshot fixture is not guarded by app identity");
  }
  if (!fixture.includes("Record<AppLanguage, StorePromoCopy>")) {
    errors.push("Store screenshot fixture copy is not exhaustive by locale");
  }
  if (!runner.includes("artifacts\", \"store-promos\", platform")) {
    errors.push("Store screenshot runner does not use platform-specific output");
  }
  if (
    !runner.includes('"android.intent.action.VIEW"') ||
    !runner.includes('"-p",\n              STORE_PROMO_APP_ID')
  ) {
    errors.push(
      "Android fixture deep link is not targeted to the isolated application ID",
    );
  }
  if (!Object.hasOwn(STORE_PROMO_IOS_DISPLAYS, "6.8")) {
    errors.push("Store screenshot display matrix is missing 6.8");
  }
  if (!Object.hasOwn(STORE_PROMO_ANDROID_DISPLAYS, "phone")) {
    errors.push("Store screenshot Android display matrix is missing phone");
  }
  if (languages.length !== 19) {
    errors.push(`Expected 19 registered locales, found ${languages.length}`);
  }

  return { errors, languages, screenshotNames };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const result = validateStorePromoSetup();
  if (result.errors.length > 0) {
    process.stderr.write(`${result.errors.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      `Store-promo setup covers ${result.languages.length} locales with ${result.screenshotNames.length} ordered screenshots each.\n`,
    );
  }
}
