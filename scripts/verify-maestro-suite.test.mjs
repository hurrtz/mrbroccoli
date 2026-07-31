import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  countScreenshots,
  readAppLanguages,
  validateMaestroSuite,
} from "./verify-maestro-suite.mjs";
import { runFlow } from "./run-maestro-suite.mjs";

test("derives the complete locale order from the TypeScript registry", () => {
  const languages = readAppLanguages();

  assert.equal(languages.length, 19);
  assert.deepEqual(languages.slice(0, 3), ["en", "de", "uk"]);
  assert.deepEqual(languages.slice(-2), ["sv", "ur"]);
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
      },
      stderr: { write(message) { messages.push(message); } },
      udid: "emulator-5554",
      wait(milliseconds) { retryDelays.push(milliseconds); },
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
          stderr: { write() {} },
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
