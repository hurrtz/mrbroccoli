import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { runLiveProviderMatrix } from "./run-live-provider-matrix.mjs";

function withFixture(callback) {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "mrbroccoli-live-provider-"),
  );

  try {
    fs.mkdirSync(path.join(directory, "node_modules", "jest", "bin"), {
      recursive: true,
    });
    return callback(directory);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

function writeCompleteFixture(directory) {
  const contract = [
    "MR_BROCCOLI_OPENAI_API_KEY=",
    "MR_BROCCOLI_QWEN_REGION=singapore",
    "MR_BROCCOLI_PRERELEASE_MAX_USD=",
    "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
  ].join("\n");
  const local = [
    "MR_BROCCOLI_OPENAI_API_KEY=fixture-secret",
    "MR_BROCCOLI_QWEN_REGION=singapore",
    "MR_BROCCOLI_PRERELEASE_MAX_USD=1",
    "MR_BROCCOLI_ANDROID_KEYSTORE_PROPERTIES_FILE=keystore.properties",
  ].join("\n");
  const keystore = [
    "storeFile=release.jks",
    "storePassword=fixture-secret",
    "keyAlias=release",
    "keyPassword=fixture-secret",
  ].join("\n");

  fs.writeFileSync(path.join(directory, ".env"), contract);
  fs.writeFileSync(path.join(directory, ".env.local"), local);
  fs.writeFileSync(path.join(directory, "keystore.properties"), keystore);
}

test("does not start Jest when the zero-network preflight fails", () => {
  withFixture((directory) => {
    fs.writeFileSync(
      path.join(directory, ".env"),
      "MR_BROCCOLI_OPENAI_API_KEY=\n",
    );
    fs.writeFileSync(
      path.join(directory, ".env.local"),
      "MR_BROCCOLI_OPENAI_API_KEY=\n",
    );
    let spawnCalls = 0;

    const status = runLiveProviderMatrix({
      cwd: directory,
      spawn: () => {
        spawnCalls += 1;
        return { status: 0 };
      },
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    });

    assert.equal(status, 1);
    assert.equal(spawnCalls, 0);
  });
});

test("starts only the dedicated live suite with the ignored local values", () => {
  withFixture((directory) => {
    writeCompleteFixture(directory);
    const calls = [];

    const status = runLiveProviderMatrix({
      cwd: directory,
      spawn: (...args) => {
        calls.push(args);
        return { status: 0 };
      },
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    });

    assert.equal(status, 0);
    assert.equal(calls.length, 1);
    const [command, args, options] = calls[0];
    assert.equal(command, process.execPath);
    assert.ok(
      args.includes("__tests__/live/providerMatrix.live.test.ts"),
    );
    assert.equal(options.env.MR_BROCCOLI_RUN_LIVE_PROVIDER_MATRIX, "1");
    assert.equal(
      options.env.MR_BROCCOLI_OPENAI_API_KEY,
      "fixture-secret",
    );
  });
});
