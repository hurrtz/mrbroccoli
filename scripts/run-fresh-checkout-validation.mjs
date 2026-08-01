import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      EXPO_NO_DOTENV: "1",
      ...options.env,
    },
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}`);
  }

  return result.stdout ?? "";
}

export function runFreshCheckoutValidation({
  cwd = process.cwd(),
  makeTemporaryDirectory = (prefix) => fs.mkdtempSync(prefix),
  removeDirectory = (directory) =>
    fs.rmSync(directory, { force: true, recursive: true }),
  run = runCommand,
  stdout = process.stdout,
} = {}) {
  const repositoryRoot = run(
    "git",
    ["rev-parse", "--show-toplevel"],
    { capture: true, cwd },
  ).trim();
  const status = run(
    "git",
    ["status", "--porcelain", "--untracked-files=all"],
    { capture: true, cwd: repositoryRoot },
  ).trim();

  if (status) {
    throw new Error(
      "Fresh-checkout validation requires a clean worktree so HEAD is the exact source under test",
    );
  }

  const head = run("git", ["rev-parse", "HEAD"], {
    capture: true,
    cwd: repositoryRoot,
  }).trim();
  const temporaryRoot = makeTemporaryDirectory(
    path.join(os.tmpdir(), "mrbroccoli-fresh-checkout-"),
  );
  const checkout = path.join(temporaryRoot, "checkout");
  let worktreeAdded = false;

  try {
    run("git", ["worktree", "add", "--detach", checkout, head], {
      cwd: repositoryRoot,
    });
    worktreeAdded = true;
    run("npm", ["ci"], { cwd: checkout });
    run("make", ["pre-push"], { cwd: checkout });
  } finally {
    if (worktreeAdded) {
      run("git", ["worktree", "remove", "--force", checkout], {
        cwd: repositoryRoot,
      });
    }
    removeDirectory(temporaryRoot);
  }

  stdout.write(`Fresh-checkout validation passed for ${head}.\n`);
  return 0;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    process.exitCode = runFreshCheckoutValidation();
  } catch (error) {
    process.stderr.write(
      `Fresh-checkout validation failed: ${
        error instanceof Error ? error.message : String(error)
      }\n`,
    );
    process.exitCode = 1;
  }
}
