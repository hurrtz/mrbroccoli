import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
  findRetiredMaestroSelectors,
  readAppLanguages,
} from "./verify-maestro-suite.mjs";
import {
  STORE_PROMO_ANDROID_DISPLAYS,
  STORE_PROMO_ANDROID_FLOW_SCENES,
  STORE_PROMO_FLOWS,
  STORE_PROMO_IOS_DISPLAYS,
  STORE_PROMO_SCREENSHOT_COUNTS,
  STORE_PROMO_SCREENSHOT_NAMES,
} from "./store-promo-config.mjs";

export function readStorePromoScreenshotNames(flowText) {
  return [
    ...flowText.matchAll(
      /^\s*-\s+takeScreenshot:\s*\n\s+path:\s+([^\s]+)\s*$/gm,
    ),
  ].map(([, name]) => name);
}

function readTopLevelActions(flowText) {
  return flowText
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.startsWith("- "));
}

export function findStorePromoDrawerBoundaryErrors(platform, flowTexts) {
  const flow = flowTexts.find(
    (source) =>
      source.includes("conversation-drawer-close") &&
      source.includes("main-settings-button"),
  );
  if (!flow) {
    return [
      `${platform} store-promo flow is missing the drawer-to-Settings path`,
    ];
  }

  const serializedBoundary =
    /^- tapOn:\r?\n {4}id: conversation-drawer-close\r?\n- waitForAnimationToEnd\r?\n- assertNotVisible:\r?\n {4}id: conversation-drawer-close\r?\n- tapOn:\r?\n {4}id: main-settings-button$/m;
  return serializedBoundary.test(flow)
    ? []
    : [
        `${platform} store-promo flow must wait for the conversation drawer to dismiss before opening Settings`,
      ];
}

export function findStorePromoSceneBoundaryErrors(platform, flowTexts) {
  if (platform === "android") {
    return flowTexts.slice(0, -1).flatMap((flow, index) => {
      const actions = readTopLevelActions(flow);
      return actions.at(-1) === "- stopApp"
        ? []
        : [`android store-promo flow ${index + 1} must stop before reseeding`];
    });
  }

  const actions = readTopLevelActions(flowTexts.join("\n"));
  const sceneSeeds = actions
    .map((action, index) => (action.startsWith("- openLink:") ? index : -1))
    .filter((index) => index >= 0);
  return sceneSeeds
    .slice(1)
    .flatMap((seedIndex, index) =>
      actions[seedIndex - 1] === "- stopApp"
        ? []
        : [`ios store-promo scene ${index + 2} must stop before reseeding`],
    );
}

export function validateStorePromoSetup(cwd = process.cwd()) {
  const errors = [];
  const flowPaths = Object.entries(STORE_PROMO_FLOWS).flatMap(
    ([platform, flows]) =>
      flows.map((flow) => [platform, path.join(cwd, flow)]),
  );
  const routePath = path.join(cwd, "app/store-promos.tsx");
  const fixturePath = path.join(cwd, "src/services/storePromoFixtures.ts");
  const presentationPath = path.join(
    cwd,
    "src/services/storePromoPresentation.ts",
  );
  const runnerPath = path.join(cwd, "scripts/run-store-promos.mjs");

  for (const filePath of [
    ...flowPaths.map(([, flowPath]) => flowPath),
    routePath,
    fixturePath,
    presentationPath,
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
  const presentation = fs.readFileSync(presentationPath, "utf8");
  const runner = fs.readFileSync(runnerPath, "utf8");
  const languages = readAppLanguages(cwd);
  const screenshotNames = {};
  for (const platform of Object.keys(STORE_PROMO_FLOWS)) {
    const platformFlows = flowPaths
      .filter(([flowPlatform]) => flowPlatform === platform)
      .map(([, flowPath]) => fs.readFileSync(flowPath, "utf8"));
    const platformScreenshotNames = platformFlows.flatMap((flow) =>
      readStorePromoScreenshotNames(flow),
    );
    const combinedFlow = platformFlows.join("\n");
    errors.push(...findStorePromoSceneBoundaryErrors(platform, platformFlows));
    errors.push(...findStorePromoDrawerBoundaryErrors(platform, platformFlows));
    const expectedScenes = STORE_PROMO_ANDROID_FLOW_SCENES;
    const sceneReadiness = [
      ...combinedFlow.matchAll(
        /store-promo-fixture-ready-(premium|free|onboarding)/g,
      ),
    ];
    const actualScenes = sceneReadiness.map((match) => match[1]);
    const localeMarkers = [
      ...combinedFlow.matchAll(/id:\s*\^app-locale-\$\{LOCALE\}\$/g),
    ];
    const clearStateOffsets = [
      ...combinedFlow.matchAll(/clearState:\s*true/g),
    ].map((match) => match.index);
    for (const selector of findRetiredMaestroSelectors(combinedFlow)) {
      errors.push(
        `${platform} store screenshot flow references retired selector: ${selector}`,
      );
    }
    screenshotNames[platform] = platformScreenshotNames;
    if (
      platformScreenshotNames.length !== STORE_PROMO_SCREENSHOT_COUNTS[platform]
    ) {
      errors.push(
        `Expected ${STORE_PROMO_SCREENSHOT_COUNTS[platform]} ${platform} store screenshots, found ${platformScreenshotNames.length}`,
      );
    }
    if (
      JSON.stringify(platformScreenshotNames) !==
      JSON.stringify(STORE_PROMO_SCREENSHOT_NAMES[platform])
    ) {
      errors.push(
        `${platform} store screenshot names or ordering differ from the contract`,
      );
    }
    if (JSON.stringify(actualScenes) !== JSON.stringify(expectedScenes)) {
      errors.push(
        `${platform} store screenshot fixtures must load premium, free, onboarding, premium in order`,
      );
    }
    const allowedInitialClearState =
      platform === "ios" &&
      clearStateOffsets.length === 1 &&
      clearStateOffsets[0] < (sceneReadiness[0]?.index ?? 0);
    if (
      (platform === "ios" && !allowedInitialClearState) ||
      (platform === "android" && clearStateOffsets.length > 0)
    ) {
      errors.push(
        `${platform} store screenshot flows must not clear the seeded locale between scenes`,
      );
    }
    if (localeMarkers.length !== expectedScenes.length) {
      errors.push(
        `${platform} store screenshot flow must prove the requested locale after all ${expectedScenes.length} scene relaunches`,
      );
    } else if (sceneReadiness.length === expectedScenes.length) {
      sceneReadiness.forEach((ready, index) => {
        const marker = localeMarkers[index];
        const nextReady = sceneReadiness[index + 1];
        const nextReadyOffset = nextReady?.index ?? combinedFlow.length;
        const firstCapture = combinedFlow.indexOf(
          "takeScreenshot:",
          ready.index,
        );
        if (
          marker.index <= ready.index ||
          marker.index >= nextReadyOffset ||
          firstCapture < 0 ||
          firstCapture >= nextReadyOffset ||
          marker.index >= firstCapture
        ) {
          errors.push(
            `${platform} store screenshot scene ${index + 1} does not prove its locale before capture`,
          );
        }
      });
    }
    for (const selector of [
      "voice-stage-thinking",
      "voice-stage-idle",
      "intro-banner",
      "intro-stepper-dot-1",
      "intro-setup-step",
      "auto-setup-card",
      "auto-setup-proposal",
      "store-promo-fixture-ready-onboarding",
      "transcript-handle",
      "conversation-drawer-item-promo-branch",
      "settings-page-thinking",
      "settings-page-app",
      "automatic-setup-group",
      "settings-modal-title",
      "settings-close-button",
      "conversation-settings-summary-control",
      "conversation-settings-drawer",
    ]) {
      if (!combinedFlow.includes(selector)) {
        errors.push(
          `${platform} store screenshot flow is missing selector: ${selector}`,
        );
      }
    }
    if (
      platform === "ios" &&
      (!combinedFlow.includes("selectable-message-promo-assistant-2") ||
        !combinedFlow.includes("uber-audit-toggle-promo-assistant-2") ||
        !combinedFlow.includes("settings-page-speaking"))
    ) {
      errors.push(
        "iOS store screenshot flow is missing its Premium-only surfaces",
      );
    }
    if (combinedFlow.includes("intro-close")) {
      errors.push(
        `${platform} store screenshot flow must reseed directly instead of closing onboarding`,
      );
    }
    if (
      platform === "ios" &&
      combinedFlow.indexOf("transcript-handle") >
        combinedFlow.indexOf("selectable-message-promo-assistant-2")
    ) {
      errors.push(
        "iOS store screenshot flow must open the transcript before using message actions",
      );
    }
    if (!/id:\s*\^app-settings-page-\$\{LOCALE\}\$/.test(combinedFlow)) {
      errors.push(
        `${platform} automatic-setup capture does not prove its localized Settings page`,
      );
    }
  }
  if (!route.includes("seedStorePromoFixture")) {
    errors.push("Store screenshot route does not seed the fixture");
  }
  if (
    !fixture.includes("STORE_PROMO_SCENE_STORAGE_KEY") ||
    !fixture.includes("isStorePromoApplicationId")
  ) {
    errors.push("Store screenshot fixture is not guarded by app identity");
  }
  if (!fixture.includes("Record<AppLanguage, StorePromoCopy>")) {
    errors.push("Store screenshot fixture copy is not exhaustive by locale");
  }
  if (
    !presentation.includes("applyStorePromoAutoSetupJob") ||
    !presentation.includes('scene !== "onboarding"')
  ) {
    errors.push(
      "Store screenshot presentation does not own a guarded onboarding proposal",
    );
  }
  if (!runner.includes('artifacts", "store-promos", platform')) {
    errors.push(
      "Store screenshot runner does not use platform-specific output",
    );
  }
  if (
    !runner.includes('"android.intent.action.VIEW"') ||
    !runner.includes('"-p",\n              STORE_PROMO_APP_ID')
  ) {
    errors.push(
      "Android fixture deep link is not targeted to the isolated application ID",
    );
  }
  if (
    STORE_PROMO_ANDROID_FLOW_SCENES.length !==
      STORE_PROMO_FLOWS.android.length ||
    JSON.stringify(STORE_PROMO_ANDROID_FLOW_SCENES) !==
      JSON.stringify(["premium", "free", "onboarding", "premium"])
  ) {
    errors.push(
      "Android store screenshot flows do not have deterministic scenes",
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
      `Store-promo setup covers ${result.languages.length} locales with ${result.screenshotNames.ios.length} iOS and ${result.screenshotNames.android.length} Android screenshots.\n`,
    );
  }
}
