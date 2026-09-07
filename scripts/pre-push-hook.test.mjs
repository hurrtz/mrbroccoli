import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
import test from "node:test";
import { fileURLToPath } from "node:url";

const hookSource = fileURLToPath(new URL("../.githooks/pre-push", import.meta.url));
// The regression harness itself must never inherit the real caller's Git state.
const isolatedEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")),
);

function run(cwd, args, env = isolatedEnv) {
  const result = spawnSync("git", args, { cwd, env, encoding: "utf8" });
  assert.equal(result.status, 0, `${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
}

test("a linked-worktree push cannot redirect fixture Git commands into the caller", (t) => {
  const directory = mkdtempSync(path.join(tmpdir(), "mrbroccoli-push-hook-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const repo = path.join(directory, "repo");
  const linked = path.join(directory, "linked");
  const remote = path.join(directory, "remote.git");
  const bin = path.join(directory, "bin");
  const foreign = path.join(directory, "foreign");
  mkdirSync(repo);
  mkdirSync(bin);
  mkdirSync(foreign);
  run(repo, ["init", "--initial-branch=main"]);
  run(repo, ["config", "user.name", "Hook Owner"]);
  run(repo, ["config", "user.email", "hook-owner@example.invalid"]);
  mkdirSync(path.join(repo, ".githooks"));
  mkdirSync(path.join(repo, "scripts"));
  copyFileSync(hookSource, path.join(repo, ".githooks/pre-push"));
  chmodSync(path.join(repo, ".githooks/pre-push"), 0o755);
  writeFileSync(path.join(repo, "tracked.txt"), "original content\n");
  writeFileSync(path.join(repo, "scripts/pre-push-spec-review.sh"), "#!/bin/sh\nexit 0\n");
  chmodSync(path.join(repo, "scripts/pre-push-spec-review.sh"), 0o755);
  run(repo, ["add", "."]);
  run(repo, ["commit", "-m", "original"]);
  run(repo, ["init", "--bare", remote]);
  run(repo, ["worktree", "add", "-b", "linked", linked]);
  run(repo, ["config", "core.hooksPath", ".githooks"]);

  // Exercise the same init/config/add/commit pattern as the spec-review suite.
  writeFileSync(path.join(foreign, "fixture.txt"), "fixture content\n");
  const make = path.join(bin, "make");
  writeFileSync(make, `#!/bin/sh
set -eu
git init --initial-branch=main "$HOOK_TEST_FOREIGN"
git -C "$HOOK_TEST_FOREIGN" config user.name 'Fixture Owner'
git -C "$HOOK_TEST_FOREIGN" config user.email fixture@example.invalid
git -C "$HOOK_TEST_FOREIGN" add .
git -C "$HOOK_TEST_FOREIGN" commit -m fixture
git init --bare "$HOOK_TEST_FOREIGN/remote.git"
`);
  chmodSync(make, 0o755);

  const head = run(linked, ["rev-parse", "HEAD"]);
  const index = run(linked, ["ls-files", "--stage"]);
  const gitDir = run(linked, ["rev-parse", "--absolute-git-dir"]);
  const push = spawnSync("git", ["push", remote, "HEAD:main"], {
    cwd: linked,
    encoding: "utf8",
    env: {
      ...isolatedEnv,
      PATH: `${bin}${path.delimiter}${isolatedEnv.PATH}`,
      HOOK_TEST_FOREIGN: foreign,
      GIT_DIR: gitDir,
      GIT_COMMON_DIR: path.join(repo, ".git"),
      GIT_WORK_TREE: linked,
      GIT_INDEX_FILE: path.join(gitDir, "index"),
    },
  });

  assert.equal(run(linked, ["rev-parse", "HEAD"]), head, "caller HEAD changed");
  assert.equal(run(linked, ["ls-files", "--stage"]), index, "caller index changed");
  assert.equal(run(repo, ["config", "user.name"]), "Hook Owner");
  assert.equal(run(repo, ["config", "user.email"]), "hook-owner@example.invalid");
  assert.equal(run(repo, ["config", "core.bare"]), "false");
  assert.equal(push.status, 0, push.stderr);
  assert.equal(run(foreign, ["log", "-1", "--format=%s"]), "fixture");
  assert.equal(run(repo, ["--git-dir", remote, "rev-parse", "main"]), head);
});
