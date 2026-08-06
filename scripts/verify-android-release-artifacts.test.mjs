import assert from "node:assert/strict";
import test from "node:test";

import {
  BUNDLE_MAPPING_ENTRY,
  BUNDLE_NATIVE_SYMBOL_PREFIX,
  ESPEAK_MARKERS,
  findEspeakMarkers,
  inspectBundleMetadataEntries,
  inspectAndroidBundleSize,
  parseArchiveSizeListing,
  parseAndroidVersionCode,
  verifyExternalNativeSymbols,
  verifySherpaJniMapping,
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

test("rejects release mappings that rename Sherpa JNI configuration classes", () => {
  const preserved = `com.k2fsa.sherpa.onnx.GeneratedAudio -> com.k2fsa.sherpa.onnx.GeneratedAudio:
    float[] samples -> samples
    int sampleRate -> sampleRate
com.k2fsa.sherpa.onnx.GenerationConfig -> com.k2fsa.sherpa.onnx.GenerationConfig:
    float silenceScale -> silenceScale
    float speed -> speed
    int sid -> sid
    float[] referenceAudio -> referenceAudio
    int referenceSampleRate -> referenceSampleRate
    java.lang.String referenceText -> referenceText
    int numSteps -> numSteps
    java.util.Map extra -> extra
com.k2fsa.sherpa.onnx.OfflineTts -> com.k2fsa.sherpa.onnx.OfflineTts:
    com.k2fsa.sherpa.onnx.OfflineTtsConfig config -> config
    long ptr -> ptr
com.k2fsa.sherpa.onnx.OfflineTtsConfig -> com.k2fsa.sherpa.onnx.OfflineTtsConfig:
    com.k2fsa.sherpa.onnx.OfflineTtsModelConfig model -> model
    java.lang.String ruleFsts -> ruleFsts
    java.lang.String ruleFars -> ruleFars
    int maxNumSentences -> maxNumSentences
    float silenceScale -> silenceScale
com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig -> com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig:
    java.lang.String model -> model
    java.lang.String voices -> voices
    java.lang.String tokens -> tokens
    java.lang.String dataDir -> dataDir
    java.lang.String lexicon -> lexicon
    java.lang.String lang -> lang
    java.lang.String dictDir -> dictDir
    float lengthScale -> lengthScale
com.k2fsa.sherpa.onnx.OfflineTtsModelConfig -> com.k2fsa.sherpa.onnx.OfflineTtsModelConfig:
    com.k2fsa.sherpa.onnx.OfflineTtsVitsModelConfig vits -> vits
    com.k2fsa.sherpa.onnx.OfflineTtsMatchaModelConfig matcha -> matcha
    com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig kokoro -> kokoro
    com.k2fsa.sherpa.onnx.OfflineTtsZipVoiceModelConfig zipvoice -> zipvoice
    com.k2fsa.sherpa.onnx.OfflineTtsKittenModelConfig kitten -> kitten
    com.k2fsa.sherpa.onnx.OfflineTtsPocketModelConfig pocket -> pocket
    com.k2fsa.sherpa.onnx.OfflineTtsSupertonicModelConfig supertonic -> supertonic
    int numThreads -> numThreads
    boolean debug -> debug
    java.lang.String provider -> provider`;

  assert.doesNotThrow(() => verifySherpaJniMapping(preserved));
  assert.throws(
    () =>
      verifySherpaJniMapping(
        preserved.replace(
          "com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig -> com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig:",
          "com.k2fsa.sherpa.onnx.OfflineTtsKokoroModelConfig -> H8.w:",
        ),
      ),
    /R8 renamed Sherpa JNI class/,
  );
  assert.throws(
    () =>
      verifySherpaJniMapping(
        preserved.replace(
          "java.lang.String model -> model",
          "java.lang.String model -> a",
        ),
      ),
    /R8 renamed Sherpa JNI field/,
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

test("detects the GPL eSpeak NG runtime in a shipped library", () => {
  const contaminated = Buffer.concat([
    Buffer.from([0x7f, 0x45, 0x4c, 0x46]),
    Buffer.from("ESPEAK_DATA_PATH\0/usr/share/espeak-ng-data\0", "latin1"),
  ]);

  assert.deepEqual(findEspeakMarkers(contaminated), [
    "ESPEAK_DATA_PATH",
    "/usr/share/espeak-ng-data",
  ]);
});

test("does not flag sherpa's own Apache-licensed espeak diagnostics", () => {
  // The espeak-free build still ships this sentence from sherpa's sources; a
  // naive "espeak-ng-data" grep would fail the release on a clean library.
  const clean = Buffer.concat([
    Buffer.from([0x7f, 0x45, 0x4c, 0x46]),
    Buffer.from(
      "You need to follow our examples to copy the espeak-ng-data directory " +
        "from the assets folder to an external storage directory.\0" +
        "libphonemize\0",
      "latin1",
    ),
  ]);

  assert.deepEqual(findEspeakMarkers(clean), []);
});

test("detects piper's eSpeak phonemizer implementation", () => {
  assert.ok(ESPEAK_MARKERS.includes("phonemize_eSpeak"));
  assert.deepEqual(
    findEspeakMarkers(Buffer.from("piper::phonemize_eSpeak(", "latin1")),
    ["phonemize_eSpeak"],
  );
});
