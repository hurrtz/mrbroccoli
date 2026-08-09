// Emits the .d.ts tree design-sync reads component props from.
//
//   node .design-sync/gen-types.mjs
//   -> .design-sync/.cache/types/   (gitignored)
//
// Mr Broccoli ships no library build, so the converter has no declarations to
// extract from and every `<Name>Props` collapses to `[key: string]: unknown` —
// a contract that tells the design agent nothing. This runs tsc in
// declaration-only mode over the curated entry surface to produce real ones.
//
// It also keeps .design-sync/package.json's version in step with the app's.
// That file exists to make .design-sync/ its own package root, which is what
// lets the declaration output live here instead of at the repository root;
// its `version` is what the generated README reports to the design agent, so
// a stale value would misdescribe the synced library.

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const appVersion = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf8"),
).version;
const pkgPath = join(HERE, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (pkg.version !== appVersion) {
  pkg.version = appVersion;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`synced .design-sync/package.json version -> ${appVersion}`);
}

const tsc = join(ROOT, "node_modules", ".bin", "tsc");
if (!existsSync(tsc)) {
  console.error("typescript not installed — run npm install");
  process.exit(1);
}

const res = spawnSync(tsc, ["-p", join(HERE, "tsconfig.dts.json")], {
  cwd: ROOT,
  stdio: "inherit",
});
if (res.status !== 0) process.exit(res.status ?? 1);

const entryDts = join(HERE, ".cache/types/.design-sync/entry.d.ts");
if (!existsSync(entryDts)) {
  console.error(`expected declarations at ${entryDts} — none emitted`);
  process.exit(1);
}
console.log(`declarations ready: ${entryDts.slice(ROOT.length + 1)}`);
