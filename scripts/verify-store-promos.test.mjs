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
  STORE_PROMO_ANDROID_FLOW_ORB_QUERIES,
  STORE_PROMO_FLOWS,
  STORE_PROMO_SCREENSHOT_NAMES,
} from "./store-promo-config.mjs";

function readFlows(platform) {
  return STORE_PROMO_FLOWS[platform].map((flow) =>
    fs.readFileSync(path.join(process.cwd(), flow), "utf8"),
  );
}

test("the checked-in store-promo setup tells one seven-screen BYOK story", () => {
  const result = validateStorePromoSetup();

  assert.deepEqual(result.errors, []);
  assert.equal(result.languages.length, 19);
  assert.deepEqual(result.screenshotNames, STORE_PROMO_SCREENSHOT_NAMES);
  for (const platform of ["android", "ios"]) {
    assert.deepEqual(result.screenshotNames[platform], [
      "01-home-idle",
      "02-transcript-last-response",
      "03-conversations",
      "04-settings-connections",
      "05-settings-thinking",
      "06-council",
      "07-conversation-settings",
    ]);
  }
});

test("screenshot name extraction preserves capture order", () => {
  assert.deepEqual(
    readStorePromoScreenshotNames(`
- takeScreenshot:
    path: 01-first
- runFlow:
    path: helpers/not-a-screenshot.yaml
- takeScreenshot:
    path: 02-second
`),
    ["01-first", "02-second"],
  );
});

test("every Android split flow stops before the next fixture seed", () => {
  const flows = readFlows("android");
  assert.deepEqual(findStorePromoSceneBoundaryErrors("android", flows), []);

  const withoutStop = flows[0].replace(/\n- stopApp\s*$/, "");
  assert.match(
    findStorePromoSceneBoundaryErrors("android", [
      withoutStop,
      ...flows.slice(1),
    ]).join("\n"),
    /flow 1 must stop/,
  );
});

test("iOS scene changes require a stopped native surface", () => {
  const valid = "- openLink: first\n- stopApp\n- openLink: second";
  const invalid = "- openLink: first\n- openLink: second";

  assert.deepEqual(findStorePromoSceneBoundaryErrors("ios", [valid]), []);
  assert.match(
    findStorePromoSceneBoundaryErrors("ios", [invalid]).join("\n"),
    /scene 2 must stop/,
  );
});

test("store captures follow the current transcript and idle-settings contracts", () => {
  for (const platform of ["android", "ios"]) {
    const combined = readFlows(platform).join("\n");
    assert.doesNotMatch(combined, /transcript-sheet-header-close/, platform);
    assert.doesNotMatch(
      combined,
      /conversation-settings-summary-control/,
      platform,
    );
    assert.match(combined, /workspace-header-settings/, platform);
    assert.match(combined, /transcript-toggle-promo-assistant-2/, platform);
    assert.match(combined, /settings-page-connections/, platform);
    assert.match(combined, /council-popover/, platform);
    assert.match(combined, /council-model-mode-1/, platform);
    assert.match(combined, /council-model-mode-2/, platform);
    assert.match(combined, /council-model-mode-3/, platform);
    assert.ok(combined.split("council-model-mode-2").length - 1 >= 2, platform);
    assert.ok(combined.split("council-model-mode-3").length - 1 >= 2, platform);
    if (platform === "android") {
      assert.ok(
        STORE_PROMO_ANDROID_FLOW_ORB_QUERIES.some((query) =>
          query.includes("phase=idle"),
        ),
        platform,
      );
    } else {
      assert.match(combined, /phase=idle/, platform);
    }
    assert.match(combined, /voice-stage-idle/, platform);
  }
});

test("captures wait for the conversation drawer before opening Settings", () => {
  for (const platform of ["android", "ios"]) {
    const flows = readFlows(platform);
    assert.deepEqual(
      findStorePromoDrawerBoundaryErrors(platform, flows),
      [],
      platform,
    );

    const drawerFlowIndex = flows.findIndex((flow) =>
      flow.includes("conversation-drawer-close"),
    );
    const withoutDismissWait = flows[drawerFlowIndex].replace(
      /\s*- waitForAnimationToEnd\n\s*- assertNotVisible:\n\s+id: conversation-drawer-close\n/,
      "",
    );
    const mutatedFlows = [...flows];
    mutatedFlows[drawerFlowIndex] = withoutDismissWait;
    assert.match(
      findStorePromoDrawerBoundaryErrors(platform, mutatedFlows).join("\n"),
      /must wait for the conversation drawer to dismiss/,
      platform,
    );
  }
});
