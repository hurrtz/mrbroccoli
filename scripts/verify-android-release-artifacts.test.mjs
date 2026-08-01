import assert from "node:assert/strict";
import test from "node:test";

import {
  BUNDLE_MAPPING_ENTRY,
  BUNDLE_NATIVE_SYMBOL_PREFIX,
  inspectBundleMetadataEntries,
  inspectAndroidBundleSize,
  parseArchiveSizeListing,
  parseAndroidVersionCode,
  verifyExternalNativeSymbols,
} from "./verify-android-release-artifacts.mjs";

const sizeBudget = {
  schemaVersion: 1,
  android: {
    aabMaxBytes: 200,
    arm64NativeMaxBytes: 100,
    bundledOnnxMaxBytes: 50,
  },
};

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

test("parses uncompressed archive entry sizes", () => {
  assert.deepEqual(
    parseArchiveSizeListing(`Archive: fixture.aab
  Length      Date    Time    Name
---------  ---------- -----   ----
       42  01-01-1981 01:01   base/lib/arm64-v8a/libexample.so
        8  01-01-1981 01:01   base/assets/testModels/example.onnx
---------                     -------
       50                     2 files
`),
    [
      { bytes: 42, path: "base/lib/arm64-v8a/libexample.so" },
      { bytes: 8, path: "base/assets/testModels/example.onnx" },
    ],
  );
});

test("enforces bundle, arm64 native, and optional model budgets", () => {
  const entries = [
    { bytes: 42, path: "base/lib/arm64-v8a/libexample.so" },
    { bytes: 10, path: "base/lib/x86_64/libexample.so" },
    { bytes: 8, path: "base/assets/testModels/example.onnx" },
  ];

  assert.deepEqual(
    inspectAndroidBundleSize({
      budget: sizeBudget,
      bundleBytes: 150,
      entries,
    }),
    {
      bundleBytes: 150,
      bundledOnnxBytes: 8,
      nativeBytesByAbi: { "arm64-v8a": 42, x86_64: 10 },
    },
  );
  assert.throws(
    () =>
      inspectAndroidBundleSize({
        budget: sizeBudget,
        bundleBytes: 201,
        entries,
      }),
    /AAB is 201 bytes/,
  );
  assert.throws(
    () =>
      inspectAndroidBundleSize({
        budget: sizeBudget,
        bundleBytes: 150,
        entries: [{ bytes: 101, path: "base/lib/arm64-v8a/liblarge.so" }],
      }),
    /arm64 native payload is 101 bytes/,
  );
  assert.throws(
    () =>
      inspectAndroidBundleSize({
        budget: sizeBudget,
        bundleBytes: 150,
        entries: [{ bytes: 51, path: "base/assets/model.onnx" }],
      }),
    /bundled ONNX payload is 51 bytes/,
  );
  assert.throws(
    () =>
      inspectAndroidBundleSize({
        budget: sizeBudget,
        bundleBytes: 150,
        entries: [{ bytes: 1, path: "base/assets/kokoro/model.bin" }],
      }),
    /Kokoro model asset must not be bundled/,
  );
});
