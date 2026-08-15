import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  findStorePromoDrawerBoundaryErrors,
  findStorePromoSceneBoundaryErrors,
  readStorePromoScreenshotNames,
  validateStorePromoSetup,
} from "./verify-store-promos.mjs";
import {
  STORE_PROMO_FLOWS,
  STORE_PROMO_SCREENSHOT_NAMES,
} from "./store-promo-config.mjs";

test("the checked-in store-promo setup is complete", () => {
  const result = validateStorePromoSetup();

  assert.deepEqual(result.errors, []);
  assert.equal(result.languages.length, 19);
  assert.deepEqual(result.screenshotNames, STORE_PROMO_SCREENSHOT_NAMES);
  for (const platform of ["android", "ios"]) {
    assert.ok(
      result.screenshotNames[platform].includes("02-transcript-drawer"),
    );
    assert.ok(
      result.screenshotNames[platform].includes("11-premium-speaking"),
    );
    assert.ok(
      result.screenshotNames[platform].includes("12-automatic-setup"),
    );
  }
  assert.ok(
    Object.values(result.screenshotNames)
      .flat()
      .every((name) => !name.includes("on-device-ai")),
  );
});

test("both platforms capture the deterministic priced Premium sheet", () => {
  for (const [platform, flows] of Object.entries(STORE_PROMO_FLOWS)) {
    const combinedFlow = flows
      .map((flow) => fs.readFileSync(path.join(process.cwd(), flow), "utf8"))
      .join("\n");

    assert.match(combinedFlow, /premium-upgrade-scroll/, platform);
    assert.match(combinedFlow, /premium-value-card/, platform);
    assert.match(combinedFlow, /premium-price/, platform);
    assert.ok(
      combinedFlow.indexOf("free-conversation") <
        combinedFlow.indexOf("premium-price"),
      platform,
    );
    assert.ok(
      combinedFlow.indexOf("premium-price") <
        combinedFlow.indexOf("onboarding-welcome"),
      platform,
    );
  }
});

test("screenshot name extraction preserves capture order", () => {
  assert.deepEqual(
    readStorePromoScreenshotNames(`
- takeScreenshot:
    path: 01-first
- runFlow:
    path: helpers/not-a-screenshot.yaml
- tapOn: Next
- takeScreenshot:
    path: 02-second
`),
    ["01-first", "02-second"],
  );
});

test("every subsequent fixture scene stops the previous native surface first", () => {
  for (const [platform, flows] of Object.entries(STORE_PROMO_FLOWS)) {
    const flowSources = flows.map((flow) =>
      fs.readFileSync(path.join(process.cwd(), flow), "utf8"),
    );
    assert.deepEqual(
      findStorePromoSceneBoundaryErrors(platform, flowSources),
      [],
      platform,
    );

    if (platform === "ios") {
      const withoutStop = flowSources[0].replace(
        "- stopApp\n\n# Free story",
        "\n# Free story",
      );
      assert.match(
        findStorePromoSceneBoundaryErrors(platform, [withoutStop]).join("\n"),
        /scene 2 must stop/,
      );
    } else {
      const withoutStop = flowSources[0].replace(/\n- stopApp\s*$/, "");
      assert.match(
        findStorePromoSceneBoundaryErrors(platform, [
          withoutStop,
          ...flowSources.slice(1),
        ]).join("\n"),
        /flow 1 must stop/,
      );
    }
  }
});

test("store captures wait for the conversation drawer to dismiss before Settings", () => {
  for (const [platform, flows] of Object.entries(STORE_PROMO_FLOWS)) {
    const flowSources = flows.map((flow) =>
      fs.readFileSync(path.join(process.cwd(), flow), "utf8"),
    );
    assert.deepEqual(
      findStorePromoDrawerBoundaryErrors(platform, flowSources),
      [],
      platform,
    );

    const drawerFlowIndex = flowSources.findIndex((flow) =>
      flow.includes("conversation-drawer-close"),
    );
    const withoutDismissWait = flowSources[drawerFlowIndex].replace(
      /\s*- waitForAnimationToEnd\n\s*- assertNotVisible:\n\s+id: conversation-drawer-close\n/,
      "",
    );
    const mutatedFlows = [...flowSources];
    mutatedFlows[drawerFlowIndex] = withoutDismissWait;
    assert.match(
      findStorePromoDrawerBoundaryErrors(platform, mutatedFlows).join("\n"),
      /must wait for the conversation drawer to dismiss/,
      platform,
    );
  }
});

test("store-promo flows reseed a deterministic localized onboarding proposal", () => {
  for (const [platform, flows] of Object.entries(STORE_PROMO_FLOWS)) {
    const flowSources = flows.map((flow) =>
      fs.readFileSync(path.join(process.cwd(), flow), "utf8"),
    );
    const combinedFlow = flowSources.join("\n");

    for (const selector of [
      "store-promo-fixture-ready-premium",
      "store-promo-fixture-ready-free",
      "store-promo-fixture-ready-onboarding",
      "store-promo-fixture-ready-onboarding-ready",
      "intro-banner",
      "intro-welcome-step",
      "intro-stepper-dot-1",
      "intro-stepper-dot-2",
      "intro-setup-step",
      "intro-try-step",
      "auto-setup-card",
      "auto-setup-proposal",
      "stopApp",
      "^app-locale-${LOCALE}$",
      "^app-settings-page-${LOCALE}$",
    ]) {
      assert.ok(combinedFlow.includes(selector), `${platform}: ${selector}`);
    }
    assert.doesNotMatch(
      combinedFlow,
      /free-edition-status|intro-close/,
      platform,
    );

    const freeConversation = combinedFlow.indexOf("free-conversation");
    const onboardingReady = combinedFlow.indexOf(
      "store-promo-fixture-ready-onboarding",
      freeConversation,
    );
    const stopBeforeSeed = combinedFlow.lastIndexOf("stopApp", onboardingReady);
    const introBanner = combinedFlow.indexOf("intro-banner", onboardingReady);
    const setupDot = combinedFlow.indexOf("intro-stepper-dot-1", introBanner);
    const proposal = combinedFlow.indexOf("auto-setup-proposal", setupDot);
    const welcomeScreenshot = combinedFlow.indexOf(
      "onboarding-welcome",
      introBanner,
    );
    const onboardingScreenshot = combinedFlow.indexOf(
      "onboarding-setup",
      proposal,
    );
    const stopAfterScreenshot = combinedFlow.indexOf(
      "stopApp",
      onboardingScreenshot,
    );
    const nextPremium = combinedFlow.indexOf(
      "store-promo-fixture-ready-premium",
      combinedFlow.indexOf("store-promo-fixture-ready-onboarding-ready"),
    );
    const onboardingSegment = combinedFlow.slice(stopBeforeSeed, nextPremium);

    assert.ok(freeConversation < stopBeforeSeed, platform);
    assert.ok(stopBeforeSeed < onboardingReady, platform);
    assert.ok(onboardingReady < introBanner, platform);
    assert.ok(introBanner < welcomeScreenshot, platform);
    assert.ok(introBanner < setupDot, platform);
    assert.ok(setupDot < proposal, platform);
    assert.ok(proposal < onboardingScreenshot, platform);
    assert.ok(onboardingScreenshot < stopAfterScreenshot, platform);
    assert.ok(stopAfterScreenshot < nextPremium, platform);
    assert.equal(
      combinedFlow.match(/id:\s*\^app-locale-\$\{LOCALE\}\$/g)?.length,
      5,
      platform,
    );
    assert.doesNotMatch(
      onboardingSegment,
      /intro-auto-start|app-language-picker|clearState: true/,
      platform,
    );
  }
});
