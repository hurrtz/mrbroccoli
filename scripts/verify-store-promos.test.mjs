import assert from "node:assert/strict";
import test from "node:test";

import {
  readStorePromoScreenshotNames,
  validateStorePromoSetup,
} from "./verify-store-promos.mjs";
import { STORE_PROMO_SCREENSHOT_NAMES } from "./store-promo-config.mjs";

test("the checked-in store-promo setup is complete", () => {
  const result = validateStorePromoSetup();

  assert.deepEqual(result.errors, []);
  assert.equal(result.languages.length, 19);
  assert.deepEqual(result.screenshotNames, STORE_PROMO_SCREENSHOT_NAMES);
});

test("screenshot name extraction preserves capture order", () => {
  assert.deepEqual(
    readStorePromoScreenshotNames(`
- takeScreenshot:
    path: 01-first
- tapOn: Next
- takeScreenshot:
    path: 02-second
`),
    ["01-first", "02-second"],
  );
});
