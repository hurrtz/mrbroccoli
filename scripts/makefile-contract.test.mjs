import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

function parseMakeTargets(source) {
  return [...source.matchAll(/^([a-z][a-z0-9-]*):(?:\s|$)/gm)].map(
    (match) => match[1],
  );
}

function parsePhonyTargets(source) {
  const normalized = source.replace(/\\\r?\n/g, " ");
  const declaration = normalized.match(/^\.PHONY:\s*(.+)$/m);

  assert.ok(declaration, "Makefile must declare .PHONY targets");
  return declaration[1].trim().split(/\s+/);
}

test("declares every command target as phony", () => {
  const source = fs.readFileSync(new URL("../Makefile", import.meta.url), "utf8");
  const targets = parseMakeTargets(source);
  const phonyTargets = new Set(parsePhonyTargets(source));
  const missing = targets.filter((target) => !phonyTargets.has(target));

  assert.deepEqual(
    missing,
    [],
    `Make targets can be shadowed by same-named files: ${missing.join(", ")}`,
  );
});

test("release AAB rebuilds the matching external native-symbol archive", () => {
  const source = fs.readFileSync(new URL("../Makefile", import.meta.url), "utf8");
  const recipe = source.match(/^release-aab:\n((?:\t.*\n?)+)/m)?.[1] ?? "";

  assert.match(recipe, /:app:bundleRelease :app:assembleRelease/);
  assert.ok(
    recipe.indexOf(":app:assembleRelease") <
      recipe.indexOf("verify-android-release-artifacts.mjs"),
    "the external native-symbol archive must be refreshed before verification",
  );
});
