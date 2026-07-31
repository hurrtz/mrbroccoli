import assert from "node:assert/strict";
import test from "node:test";

import {
  BUNDLE_MAPPING_ENTRY,
  BUNDLE_NATIVE_SYMBOL_PREFIX,
  inspectBundleMetadataEntries,
  parseAndroidVersionCode,
  verifyExternalNativeSymbols,
} from "./verify-android-release-artifacts.mjs";

test("reads the Android store build number", () => {
  assert.equal(
    parseAndroidVersionCode(`android {\n  defaultConfig {\n    versionCode 17\n  }\n}`),
    17,
  );
});

test("requires both R8 mapping and native symbols in the AAB", () => {
  const arm64 = `${BUNDLE_NATIVE_SYMBOL_PREFIX}arm64-v8a/libexample.so.sym`;
  const x64 = `${BUNDLE_NATIVE_SYMBOL_PREFIX}x86_64/libexample.so.sym`;

  assert.deepEqual(
    inspectBundleMetadataEntries([BUNDLE_MAPPING_ENTRY, arm64, x64]),
    {
      abis: ["arm64-v8a", "x86_64"],
      nativeSymbolEntries: [arm64, x64],
    },
  );
  assert.throws(
    () => inspectBundleMetadataEntries([arm64]),
    /does not contain the R8 mapping/,
  );
  assert.throws(
    () => inspectBundleMetadataEntries([BUNDLE_MAPPING_ENTRY]),
    /does not contain native debug symbol tables/,
  );
});

test("requires the external native-symbol archive to match the AAB", () => {
  const embedded = [
    `${BUNDLE_NATIVE_SYMBOL_PREFIX}arm64-v8a/libexample.so.sym`,
    `${BUNDLE_NATIVE_SYMBOL_PREFIX}x86_64/libexample.so.sym`,
  ];

  assert.doesNotThrow(() =>
    verifyExternalNativeSymbols(embedded, [
      "arm64-v8a/libexample.so.sym",
      "x86_64/libexample.so.sym",
    ]),
  );
  assert.throws(
    () =>
      verifyExternalNativeSymbols(embedded, ["arm64-v8a/libexample.so.sym"]),
    /missing 1 symbol table/,
  );
});
