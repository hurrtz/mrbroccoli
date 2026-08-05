import assert from "node:assert/strict";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const scriptSource = fileURLToPath(
  new URL("./pre-push-spec-review.sh", import.meta.url),
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env ?? process.env,
    input: options.input,
  });
  if (options.expectSuccess !== false && result.status !== 0) {
    throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  }
  return result;
}

function commit(repo, subject, body) {
  run("git", ["add", "."], { cwd: repo });
  const args = ["commit", "-m", subject];
  if (body) args.push("-m", body);
  run("git", args, { cwd: repo });
  return run("git", ["rev-parse", "HEAD"], { cwd: repo }).stdout.trim();
}

function createRepository(t) {
  const repo = mkdtempSync(path.join(tmpdir(), "mrbroccoli-spec-review-"));
  t.after(() => rmSync(repo, { recursive: true, force: true }));
  mkdirSync(path.join(repo, "scripts"));
  mkdirSync(path.join(repo, "src"));
  copyFileSync(scriptSource, path.join(repo, "scripts/pre-push-spec-review.sh"));
  chmodSync(path.join(repo, "scripts/pre-push-spec-review.sh"), 0o755);
  writeFileSync(path.join(repo, "SPEC.md"), "# Root spec\n");
  writeFileSync(path.join(repo, "DESIGN.md"), "# Root design\n");
  writeFileSync(path.join(repo, "src/SPEC.md"), "# Source spec\n");
  writeFileSync(path.join(repo, "src/example.ts"), "export const value = 1;\n");
  run("git", ["init", "--initial-branch=main"], { cwd: repo });
  run("git", ["config", "user.email", "spec-review@example.invalid"], {
    cwd: repo,
  });
  run("git", ["config", "user.name", "Spec Review Test"], { cwd: repo });
  const baseline = commit(repo, "initial");
  return { baseline, repo };
}

function runGate(repo, baseline, acknowledgement) {
  const localSha = run("git", ["rev-parse", "HEAD"], { cwd: repo }).stdout.trim();
  const env = { ...process.env };
  delete env.SPEC_REVIEW_ACK;
  if (acknowledgement !== undefined) env.SPEC_REVIEW_ACK = acknowledgement;
  return run("bash", ["scripts/pre-push-spec-review.sh"], {
    cwd: repo,
    env,
    expectSuccess: false,
    input: `refs/heads/main ${localSha} refs/heads/main ${baseline}\n`,
  });
}

test("blocks code pushes until the living-spec review is acknowledged", (t) => {
  const { baseline, repo } = createRepository(t);
  writeFileSync(path.join(repo, "src/example.ts"), "export const value = 2;\n");
  commit(repo, "change code");

  const blocked = runGate(repo, baseline);
  const output = `${blocked.stdout}\n${blocked.stderr}`;
  assert.equal(blocked.status, 1);
  assert.match(output, /LIVING SPEC REVIEW REQUIRED/);
  assert.match(output, /src\/SPEC\.md/);

  const tooShort = runGate(repo, baseline, "ok");
  assert.equal(tooShort.status, 1);
  assert.match(tooShort.stderr, /at least 10 characters/);

  const acknowledged = runGate(
    repo,
    baseline,
    "reviewed source contract",
  );
  assert.equal(acknowledged.status, 0);
});

test("accepts a durable Spec-Review trailer from the pushed commits", (t) => {
  const { baseline, repo } = createRepository(t);
  writeFileSync(path.join(repo, "src/example.ts"), "export const value = 3;\n");
  commit(
    repo,
    "change documented behavior",
    "Spec-Review: updated source behavior and rationale",
  );

  const result = runGate(repo, baseline);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /acknowledged via Spec-Review trailer/);
});

test("skips documentation-only pushes", (t) => {
  const { baseline, repo } = createRepository(t);
  writeFileSync(path.join(repo, "README.md"), "# Documentation only\n");
  commit(repo, "update docs");

  const result = runGate(repo, baseline);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /no code, native, build, or script files/);
});

test("classifies toolchain configuration files as code", (t) => {
  const toolchainFiles = [
    "eslint.config.js",
    "jest.setup.js",
    ".githooks/pre-push",
  ];
  for (const file of toolchainFiles) {
    const { baseline, repo } = createRepository(t);
    mkdirSync(path.join(repo, path.dirname(file)), { recursive: true });
    writeFileSync(path.join(repo, file), "// toolchain change\n");
    commit(repo, `change ${file}`);

    const blocked = runGate(repo, baseline);
    assert.equal(
      blocked.status,
      1,
      `${file} must require living-spec review, got: ${blocked.stdout}${blocked.stderr}`,
    );
    assert.match(`${blocked.stdout}\n${blocked.stderr}`, /LIVING SPEC REVIEW REQUIRED/);
  }
});
