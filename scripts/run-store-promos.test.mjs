import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { deflateSync } from "node:zlib";

import {
  createSourceProvenance,
  parseConnectedAndroidDevices,
  parseStorePromoArguments,
  quoteAndroidShellArgument,
  readArtifactVersion,
  readPngMetadata,
  resolveApkAnalyzerPath,
  selectLatestIosRuntime,
} from "./run-store-promos.mjs";
import {
  STORE_PROMO_ANDROID_FLOW_SCENES,
  STORE_PROMO_FLOWS,
} from "./store-promo-config.mjs";

test("Android maps its split flows to deterministic fixture scenes", () => {
  assert.deepEqual(STORE_PROMO_ANDROID_FLOW_SCENES, [
    "premium",
    "free",
    "onboarding",
    "premium",
  ]);
  assert.equal(
    STORE_PROMO_ANDROID_FLOW_SCENES.length,
    STORE_PROMO_FLOWS.android.length,
  );
});

test("Android fixture URLs remain one device-shell argument", () => {
  assert.equal(
    quoteAndroidShellArgument(
      "mrbroccoli://store-promos?locale=de&scene=premium",
    ),
    "'mrbroccoli://store-promos?locale=de&scene=premium'",
  );
});

test("store screenshot provenance distinguishes built and reused dirty source", () => {
  const built = createSourceProvenance({
    commit: "abc123",
    diff: "diff --git a/src/a.ts b/src/a.ts",
    skipBuild: false,
    status: " M src/a.ts\0?? src/new.ts\0",
    untrackedFileHashes: [["src/new.ts", "deadbeef"]],
  });
  const reused = createSourceProvenance({
    commit: "abc123",
    diff: "diff --git a/src/a.ts b/src/a.ts",
    skipBuild: true,
    status: " M src/a.ts\0?? src/new.ts\0",
    untrackedFileHashes: [["src/new.ts", "deadbeef"]],
  });

  assert.equal(built.sourceDirty, true);
  assert.equal(built.buildMode, "built");
  assert.equal(built.artifactSourceStateSha256, built.sourceStateSha256);
  assert.equal(reused.buildMode, "reused");
  assert.equal(reused.artifactSourceStateSha256, null);
  assert.equal(reused.sourceStateSha256, built.sourceStateSha256);
  assert.notEqual(
    createSourceProvenance({
      commit: "abc123",
      diff: "different",
      skipBuild: false,
      status: " M src/a.ts\0",
    }).sourceStateSha256,
    built.sourceStateSha256,
  );
});

test("Android version provenance is read from the exact hashed APK", () => {
  const calls = [];
  const artifactPath = "/tmp/build/app-release.apk";
  const version = readArtifactVersion({
    apkAnalyzerPath: "/sdk/cmdline-tools/latest/bin/apkanalyzer",
    artifactPath,
    cwd: "/repo",
    platform: "android",
    run(command, args, options) {
      calls.push({ args, command, options });
      return "3.2.0\n";
    },
  });

  assert.equal(version, "3.2.0");
  assert.deepEqual(calls, [
    {
      args: ["manifest", "version-name", artifactPath],
      command: "/sdk/cmdline-tools/latest/bin/apkanalyzer",
      options: { capture: true, cwd: "/repo" },
    },
  ]);
});

test("Android APK analysis resolves only an installed SDK tool", () => {
  const sdkRoot = "/sdk";
  assert.equal(
    resolveApkAnalyzerPath({
      androidSdkRoot: sdkRoot,
      exists: (candidate) =>
        candidate.toString().includes("cmdline-tools/latest"),
    }),
    "/sdk/cmdline-tools/latest/bin/apkanalyzer",
  );
  assert.throws(
    () =>
      resolveApkAnalyzerPath({ androidSdkRoot: sdkRoot, exists: () => false }),
    /apkanalyzer was not found/,
  );
});

test("store promo arguments require an explicit locale", () => {
  assert.throws(() => parseStorePromoArguments([]), /--locale is required/);
  assert.deepEqual(
    parseStorePromoArguments(["--platform", "ios", "--locale", "de"]),
    {
      display: "6.8",
      help: false,
      locale: "de",
      platform: "ios",
      skipBuild: false,
      udid: null,
    },
  );
});

test("Android store promo arguments default to the phone profile", () => {
  assert.deepEqual(
    parseStorePromoArguments(["--platform", "android", "--locale", "de"]),
    {
      display: "phone",
      help: false,
      locale: "de",
      platform: "android",
      skipBuild: false,
      udid: null,
    },
  );
});

test("store promo arguments reject unsupported display labels", () => {
  assert.throws(
    () =>
      parseStorePromoArguments([
        "--platform",
        "ios",
        "--locale",
        "de",
        "--display",
        "3.5",
      ]),
    /--display must be one of/,
  );
});

test("connected Android devices exclude unauthorized and offline entries", () => {
  assert.deepEqual(
    parseConnectedAndroidDevices(`List of devices attached
emulator-5554 device product:sdk model:Pixel_7
R58N123 offline transport_id:2
emulator-5556 unauthorized transport_id:3
`),
    [{ isEmulator: true, udid: "emulator-5554" }],
  );
});

test("the latest available iOS runtime is selected", () => {
  assert.equal(
    selectLatestIosRuntime(
      JSON.stringify({
        runtimes: [
          {
            identifier: "com.apple.CoreSimulator.SimRuntime.iOS-26-3",
            isAvailable: true,
          },
          {
            identifier: "com.apple.CoreSimulator.SimRuntime.iOS-26-5",
            isAvailable: true,
          },
          {
            identifier: "com.apple.CoreSimulator.SimRuntime.iOS-27-0",
            isAvailable: false,
          },
        ],
      }),
    ).identifier,
    "com.apple.CoreSimulator.SimRuntime.iOS-26-5",
  );
  assert.equal(
    selectLatestIosRuntime(
      JSON.stringify({
        runtimes: [
          {
            identifier: "com.apple.CoreSimulator.SimRuntime.iOS-16-4",
            isAvailable: true,
          },
          {
            identifier: "com.apple.CoreSimulator.SimRuntime.iOS-26-5",
            isAvailable: true,
          },
        ],
      }),
      16,
    ).identifier,
    "com.apple.CoreSimulator.SimRuntime.iOS-16-4",
  );
});

test("PNG dimensions and alpha channels are verified against decoded pixels", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "store-promo-png-"));
  const crc32 = (input) => {
    let crc = 0xffffffff;
    for (const byte of input) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit += 1) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, payload) => {
    const typeBytes = Buffer.from(type, "ascii");
    const output = Buffer.alloc(payload.length + 12);
    output.writeUInt32BE(payload.length, 0);
    typeBytes.copy(output, 4);
    payload.copy(output, 8);
    output.writeUInt32BE(
      crc32(Buffer.concat([typeBytes, payload])),
      output.length - 4,
    );
    return output;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1206, 0);
  ihdr.writeUInt32BE(2622, 4);
  ihdr.writeUInt8(8, 8);
  ihdr.writeUInt8(2, 9);
  const decodedPixels = Buffer.alloc(2622 * (1 + 1206 * 3));
  const data = Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(decodedPixels)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  const filePath = path.join(directory, "sample.png");
  fs.writeFileSync(filePath, data);

  try {
    assert.deepEqual(await readPngMetadata(filePath), {
      colorType: 2,
      hasAlphaChannel: false,
      height: 2622,
      width: 1206,
    });

    const transparentPath = path.join(directory, "transparent.png");
    fs.writeFileSync(
      transparentPath,
      Buffer.concat([
        Buffer.from("89504e470d0a1a0a", "hex"),
        chunk("IHDR", ihdr),
        chunk("tRNS", Buffer.alloc(6)),
        chunk("IDAT", deflateSync(decodedPixels)),
        chunk("IEND", Buffer.alloc(0)),
      ]),
    );
    assert.equal(
      (await readPngMetadata(transparentPath)).hasAlphaChannel,
      true,
    );

    const nonDecodablePath = path.join(directory, "non-decodable.png");
    fs.writeFileSync(
      nonDecodablePath,
      Buffer.concat([
        Buffer.from("89504e470d0a1a0a", "hex"),
        chunk("IHDR", ihdr),
        chunk("IDAT", Buffer.from([0x00, 0x01, 0x02, 0x03])),
        chunk("IEND", Buffer.alloc(0)),
      ]),
    );
    await assert.rejects(
      readPngMetadata(nonDecodablePath),
      /PNG pixel data could not be decoded/,
    );

    const truncatedPath = path.join(directory, "truncated.png");
    fs.writeFileSync(truncatedPath, data.subarray(0, 26));
    await assert.rejects(
      readPngMetadata(truncatedPath),
      /Truncated|Incomplete/,
    );
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});
