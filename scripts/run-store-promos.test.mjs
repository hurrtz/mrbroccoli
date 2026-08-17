import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { deflateSync } from "node:zlib";

import {
  createSourceProvenance,
  findDuplicateScreenshotGroups,
  parseAndroidDisplayDimensions,
  parseConnectedAndroidDevices,
  parseStorePromoArguments,
  quoteAndroidShellArgument,
  readArtifactVersion,
  readPngMetadata,
  resolveApkAnalyzerPath,
  selectLatestIosRuntime,
  setStorePromoColorScheme,
} from "./run-store-promos.mjs";
import {
  STORE_PROMO_ANDROID_FLOW_SCENES,
  STORE_PROMO_APP_IDS,
  STORE_PROMO_FLOWS,
} from "./store-promo-config.mjs";

test("store promo builds target each platform's isolated identity", () => {
  assert.deepEqual(STORE_PROMO_APP_IDS, {
    android: "com.tobiaswinkler.app.android.mrbroccoli.maestro",
    ios: "com.tobiaswinkler.app.mrbroccoli.maestro",
  });
});

test("Android maps its split flows to deterministic fixture scenes", () => {
  assert.deepEqual(STORE_PROMO_ANDROID_FLOW_SCENES, [
    "conversation",
    "conversation",
  ]);
  assert.equal(
    STORE_PROMO_ANDROID_FLOW_SCENES.length,
    STORE_PROMO_FLOWS.android.length,
  );
});

test("Android fixture URLs remain one device-shell argument", () => {
  assert.equal(
    quoteAndroidShellArgument(
      "mrbroccoli://store-promos?locale=de&scene=conversation",
    ),
    "'mrbroccoli://store-promos?locale=de&scene=conversation'",
  );
});

test("duplicate screenshots are grouped by exact pixel hash", () => {
  assert.deepEqual(
    findDuplicateScreenshotGroups([
      { file: "01.png", sha256: "one" },
      { file: "02.png", sha256: "two" },
      { file: "03.png", sha256: "one" },
    ]),
    [["01.png", "03.png"]],
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
      colorScheme: "both",
      display: "6.9",
      help: false,
      locale: "de",
      platform: "ios",
      skipBuild: false,
      udid: null,
    },
  );
});

test("Android display dimensions prefer an active tablet override", () => {
  assert.deepEqual(
    parseAndroidDisplayDimensions(
      "Physical size: 1080x2400\nOverride size: 1600x2560\n",
    ),
    { height: 2560, width: 1600 },
  );
  assert.deepEqual(parseAndroidDisplayDimensions("Physical size: 1080x2400"), {
    height: 2400,
    width: 1080,
  });
});

test("Android store promo arguments default to the phone profile", () => {
  assert.deepEqual(
    parseStorePromoArguments(["--platform", "android", "--locale", "de"]),
    {
      colorScheme: "both",
      display: "phone",
      help: false,
      locale: "de",
      platform: "android",
      skipBuild: false,
      udid: null,
    },
  );
});

test("store promo arguments can select one color scheme", () => {
  assert.equal(
    parseStorePromoArguments([
      "--platform",
      "ios",
      "--locale",
      "de",
      "--color-scheme",
      "dark",
    ]).colorScheme,
    "dark",
  );
});

test("store promo device chrome follows the captured color scheme", () => {
  const calls = [];
  const run = (command, args, options) => {
    calls.push({ command, args, options });
    return "";
  };

  setStorePromoColorScheme({
    colorScheme: "dark",
    cwd: "/repo",
    platform: "ios",
    run,
    udid: "IOS-UDID",
  });
  setStorePromoColorScheme({
    colorScheme: "light",
    cwd: "/repo",
    platform: "android",
    run,
    udid: "emulator-5554",
  });

  assert.deepEqual(calls, [
    {
      command: "xcrun",
      args: ["simctl", "ui", "IOS-UDID", "appearance", "dark"],
      options: { cwd: "/repo" },
    },
    {
      command: "adb",
      args: [
        "-s",
        "emulator-5554",
        "shell",
        "cmd",
        "uimode",
        "night",
        "no",
      ],
      options: { cwd: "/repo" },
    },
  ]);
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
