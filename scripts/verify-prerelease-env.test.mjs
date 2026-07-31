import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  parseEnvText,
  validatePrereleaseEnvironment,
} from "./verify-prerelease-env.mjs";

function withFixture(callback) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-prerelease-env-"),
  );

  try {
    return callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("parses comments, quoted values, and empty values without exposing them", () => {
  const result = parseEnvText(
    [
      "# comment",
      "MR_BROCCOLI_ONE=",
      'MR_BROCCOLI_TWO="secret value"',
    ].join("\n"),
    ".env.local",
  );

  assert.deepEqual(result.errors, []);
  assert.equal(result.entries.get("MR_BROCCOLI_ONE"), "");
  assert.equal(result.entries.get("MR_BROCCOLI_TWO"), "secret value");
});

test("reports every missing value before provider tests can start", () => {
  withFixture((directory) => {
    fs.writeFileSync(
      path.join(directory, ".env"),
      [
        "MR_BROCCOLI_OPENAI_API_KEY=",
        "MR_BROCCOLI_QWEN_REGION=singapore",
        "MR_BROCCOLI_PRERELEASE_MAX_USD=",
        "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
      ].join("\n"),
    );
    fs.writeFileSync(
      path.join(directory, ".env.local"),
      [
        "MR_BROCCOLI_OPENAI_API_KEY=",
        "MR_BROCCOLI_QWEN_REGION=singapore",
        "MR_BROCCOLI_PRERELEASE_MAX_USD=",
        "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
      ].join("\n"),
    );

    const errors = validatePrereleaseEnvironment({
      contractPath: path.join(directory, ".env"),
      localPath: path.join(directory, ".env.local"),
      cwd: directory,
    });

    assert.ok(
      errors.includes(
        "Required pre-release value is missing: MR_BROCCOLI_OPENAI_API_KEY",
      ),
    );
    assert.ok(
      errors.includes(
        "Required pre-release value is missing: MR_BROCCOLI_PRERELEASE_MAX_USD",
      ),
    );
    assert.equal(
      errors.includes(
        "MR_BROCCOLI_PRERELEASE_MAX_USD must be a positive number",
      ),
      false,
    );
    assert.ok(
      errors.some((error) =>
        error.startsWith(
          "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE does not exist:",
        ),
      ),
    );
  });
});

test("accepts a complete local override and configured release keystore", () => {
  withFixture((directory) => {
    fs.writeFileSync(
      path.join(directory, ".env"),
      [
        "MR_BROCCOLI_OPENAI_API_KEY=",
        "MR_BROCCOLI_QWEN_REGION=singapore",
        "MR_BROCCOLI_PRERELEASE_MAX_USD=",
        "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
      ].join("\n"),
    );
    fs.writeFileSync(
      path.join(directory, ".env.local"),
      [
        "MR_BROCCOLI_OPENAI_API_KEY=secret",
        "MR_BROCCOLI_QWEN_REGION=beijing",
        "MR_BROCCOLI_PRERELEASE_MAX_USD=1.50",
        "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
      ].join("\n"),
    );
    fs.writeFileSync(
      path.join(directory, "keystore.properties"),
      [
        "storeFile=release.jks",
        "storePassword=secret",
        "keyAlias=release",
        "keyPassword=secret",
      ].join("\n"),
    );

    const errors = validatePrereleaseEnvironment({
      contractPath: path.join(directory, ".env"),
      localPath: path.join(directory, ".env.local"),
      cwd: directory,
    });

    assert.deepEqual(errors, []);
  });
});
