import assert from "node:assert/strict";
import test from "node:test";

import { findSecretNames } from "./verify-release-artifact-secrets.mjs";

test("finds exact configured secrets without returning their values", () => {
  const secretValue = "fixture-do-not-print";

  assert.deepEqual(
    findSecretNames(Buffer.from(`prefix-${secretValue}-suffix`), [
      { name: "MR_BROCCOLI_FIXTURE_API_KEY", value: Buffer.from(secretValue) },
    ]),
    ["MR_BROCCOLI_FIXTURE_API_KEY"],
  );
});

test("does not report partial secret matches", () => {
  assert.deepEqual(
    findSecretNames(Buffer.from("fixture-do-not"), [
      {
        name: "MR_BROCCOLI_FIXTURE_API_KEY",
        value: Buffer.from("fixture-do-not-print"),
      },
    ]),
    [],
  );
});
