import assert from "node:assert/strict";
import test from "node:test";

import {
  isApprovedLicense,
  noticePackageKeys,
  noticesCoverPackages,
  portablePlatformVariants,
  resolvedLicense,
} from "./verify-licenses.mjs";

test("accepts the deliberately reviewed license set", () => {
  assert.equal(isApprovedLicense("MIT"), true);
  assert.equal(isApprovedLicense("MPL-2.0"), true);
  assert.equal(isApprovedLicense("MIT AND OFL-1.1"), true);
  assert.equal(isApprovedLicense("(BSD-3-Clause OR GPL-2.0)"), true);
});

test("rejects strong copyleft and unknown dependency licenses", () => {
  assert.equal(isApprovedLicense("GPL-3.0-only"), false);
  assert.equal(isApprovedLicense("AGPL-3.0-only"), false);
  assert.equal(isApprovedLicense("UNKNOWN"), false);
});

test("uses reviewed package-specific license metadata overrides", () => {
  assert.equal(
    resolvedLicense({
      name: "jscodeshift",
      version: "0.11.0",
      license: undefined,
    }),
    "MIT",
  );
  assert.equal(
    resolvedLicense({
      name: "another-package",
      version: "1.0.0",
      license: "Apache-2.0",
    }),
    "Apache-2.0",
  );
});

test("accepts a portable notice inventory that is a superset of this platform", () => {
  const notices = [
    "### @scope/alpha@1.2.3",
    "License: MIT",
    "### beta@2.0.0",
    "Packages (2): beta@2.0.0, optional-wasm@3.0.0",
  ].join("\n");
  const packages = [
    { name: "@scope/alpha", version: "1.2.3" },
    { name: "beta", version: "2.0.0" },
  ];

  assert.deepEqual([...noticePackageKeys(notices)].sort(), [
    "@scope/alpha@1.2.3",
    "beta@2.0.0",
    "optional-wasm@3.0.0",
  ]);
  assert.equal(noticesCoverPackages(notices, packages), true);
  assert.equal(
    noticesCoverPackages(notices, [
      ...packages,
      { name: "new-runtime", version: "1.0.0" },
    ]),
    false,
  );
});

test("lists every platform variant of an installed optional binary", () => {
  const rootDir = "/repo";
  const packages = [
    {
      name: "css-engine",
      version: "1.0.0",
      license: "MPL-2.0",
      packagePath: "/repo/node_modules/css-engine",
    },
    {
      name: "css-engine-darwin-arm64",
      version: "1.0.0",
      license: "MPL-2.0",
      packagePath: "/repo/node_modules/css-engine-darwin-arm64",
    },
  ];
  const lockPackages = {
    "node_modules/css-engine": {
      version: "1.0.0",
      license: "MPL-2.0",
      optionalDependencies: {
        "css-engine-darwin-arm64": "1.0.0",
        "css-engine-linux-x64-gnu": "1.0.0",
        "css-engine-relicensed": "1.0.0",
        "plain-optional": "1.0.0",
      },
    },
    "node_modules/css-engine-darwin-arm64": {
      version: "1.0.0",
      license: "MPL-2.0",
      os: ["darwin"],
      optional: true,
    },
    "node_modules/css-engine-linux-x64-gnu": {
      version: "1.0.0",
      license: "MPL-2.0",
      os: ["linux"],
      cpu: ["x64"],
      optional: true,
    },
    "node_modules/css-engine-relicensed": {
      version: "1.0.0",
      license: "GPL-3.0-only",
      os: ["win32"],
      optional: true,
    },
    "node_modules/plain-optional": { version: "1.0.0", license: "MPL-2.0", optional: true },
  };

  assert.deepEqual(portablePlatformVariants(packages, lockPackages, rootDir), [
    {
      name: "css-engine-linux-x64-gnu",
      version: "1.0.0",
      license: "MPL-2.0",
      packagePath: "/repo/node_modules/css-engine",
    },
  ]);
});
