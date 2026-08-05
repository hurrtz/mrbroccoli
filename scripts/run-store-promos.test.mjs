import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  parseConnectedAndroidDevices,
  parseStorePromoArguments,
  quoteAndroidShellArgument,
  readPngMetadata,
  selectLatestIosRuntime,
} from "./run-store-promos.mjs";

test("Android fixture URLs remain one device-shell argument", () => {
  assert.equal(
    quoteAndroidShellArgument(
      "mrbroccoli://store-promos?locale=de&scene=premium",
    ),
    "'mrbroccoli://store-promos?locale=de&scene=premium'",
  );
});

test("store promo arguments require an explicit locale", () => {
  assert.throws(() => parseStorePromoArguments([]), /--locale is required/);
  assert.deepEqual(parseStorePromoArguments(["--platform", "ios", "--locale", "de"]), {
    display: "6.8",
    help: false,
    locale: "de",
    platform: "ios",
    skipBuild: false,
    udid: null,
  });
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
            identifier:
              "com.apple.CoreSimulator.SimRuntime.iOS-26-3",
            isAvailable: true,
          },
          {
            identifier:
              "com.apple.CoreSimulator.SimRuntime.iOS-26-5",
            isAvailable: true,
          },
          {
            identifier:
              "com.apple.CoreSimulator.SimRuntime.iOS-27-0",
            isAvailable: false,
          },
        ],
      }),
    ).identifier,
    "com.apple.CoreSimulator.SimRuntime.iOS-26-5",
  );
});

test("PNG dimensions and alpha channels are read from IHDR", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "store-promo-png-"));
  const filePath = path.join(directory, "sample.png");
  const data = Buffer.alloc(26);
  Buffer.from("89504e470d0a1a0a", "hex").copy(data, 0);
  data.writeUInt32BE(1206, 16);
  data.writeUInt32BE(2622, 20);
  data.writeUInt8(8, 24);
  data.writeUInt8(2, 25);
  fs.writeFileSync(filePath, data);

  assert.deepEqual(readPngMetadata(filePath), {
    colorType: 2,
    hasAlphaChannel: false,
    height: 2622,
    width: 1206,
  });
  fs.rmSync(directory, { force: true, recursive: true });
});
