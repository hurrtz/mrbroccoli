import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { runFreshCheckoutValidation } from "./run-fresh-checkout-validation.mjs";

function silentOutput() {
  return /** @type {any} */ ({ write() { return true; } });
}

test("rejects a dirty source worktree before creating a checkout", () => {
  const calls = [];
  const run = (command, args) => {
    calls.push({ command, args });
    if (args.includes("--show-toplevel")) {
      return "/repo\n";
    }
    if (args.includes("--porcelain")) {
      return " M src/example.ts\n";
    }
    return "";
  };

  assert.throws(
    () =>
      runFreshCheckoutValidation({
        cwd: "/repo",
        run,
        stdout: silentOutput(),
      }),
    /requires a clean worktree/,
  );
  assert.equal(
    calls.some(({ args }) => args.includes("worktree")),
    false,
  );
});

test("installs and validates detached HEAD before removing its worktree", () => {
  const calls = [];
  const removed = [];
  const temporaryRoot = "/tmp/mrbroccoli-fresh-checkout-fixture";
  const checkout = path.join(temporaryRoot, "checkout");
  const run = (command, args, options = {}) => {
    calls.push({ command, args, cwd: options.cwd });
    if (args.includes("--show-toplevel")) {
      return "/repo\n";
    }
    if (args.includes("--porcelain")) {
      return "";
    }
    if (args[0] === "rev-parse" && args[1] === "HEAD") {
      return "abc123\n";
    }
    return "";
  };

  const result = runFreshCheckoutValidation({
    cwd: "/repo",
    makeTemporaryDirectory: () => temporaryRoot,
    removeDirectory: (directory) => removed.push(directory),
    run,
    stdout: silentOutput(),
  });

  assert.equal(result, 0);
  assert.deepEqual(
    calls.slice(3).map(({ command, args, cwd }) => ({ command, args, cwd })),
    [
      {
        command: "git",
        args: ["worktree", "add", "--detach", checkout, "abc123"],
        cwd: "/repo",
      },
      {
        command: "npm",
        args: ["ci"],
        cwd: checkout,
      },
      { command: "make", args: ["pre-push"], cwd: checkout },
      {
        command: "git",
        args: ["worktree", "remove", "--force", checkout],
        cwd: "/repo",
      },
    ],
  );
  assert.deepEqual(removed, [temporaryRoot]);
});

test("removes the detached worktree after a validation failure", () => {
  const calls = [];
  const removed = [];
  const temporaryRoot = "/tmp/mrbroccoli-fresh-checkout-failure";
  const run = (command, args) => {
    calls.push({ command, args });
    if (args.includes("--show-toplevel")) {
      return "/repo\n";
    }
    if (args.includes("--porcelain")) {
      return "";
    }
    if (args[0] === "rev-parse" && args[1] === "HEAD") {
      return "abc123\n";
    }
    if (command === "make") {
      throw new Error("fixture failure");
    }
    return "";
  };

  assert.throws(
    () =>
      runFreshCheckoutValidation({
        cwd: "/repo",
        makeTemporaryDirectory: () => temporaryRoot,
        removeDirectory: (directory) => removed.push(directory),
        run,
        stdout: silentOutput(),
      }),
    /fixture failure/,
  );
  assert.equal(
    calls.some(
      ({ command, args }) =>
        command === "git" && args[0] === "worktree" && args[1] === "remove",
    ),
    true,
  );
  assert.deepEqual(removed, [temporaryRoot]);
});
