import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import {
  connectedPhysicalIphones,
  createXcodeBuildArgs,
  parseArgs,
  selectDevice,
  standaloneAppPaths,
} from "./run-ios-standalone.mjs";

function device({
  name,
  udid,
  identifier = `${udid}-core-device`,
  platform = "iOS",
  reality = "physical",
  connected = true,
  paired = true,
}) {
  return {
    identifier,
    connectionProperties: {
      pairingState: paired ? "paired" : "unpaired",
      tunnelState: connected ? "connected" : "unavailable",
    },
    deviceProperties: {
      ddiServicesAvailable: connected,
      name,
    },
    hardwareProperties: { platform, reality, udid },
  };
}

test("parses an optional physical-device selector", () => {
  assert.deepEqual(parseArgs([]), { device: null, help: false });
  assert.deepEqual(parseArgs(["--device", "My iPhone"]), {
    device: "My iPhone",
    help: false,
  });
  assert.throws(() => parseArgs(["--device"]), /requires an iPhone/);
});

test("selects only a connected physical iPhone", () => {
  const connectedIphone = device({ name: "Phone", udid: "phone-1" });
  const devices = [
    connectedIphone,
    device({ name: "Offline", udid: "phone-2", connected: false }),
    device({
      name: "Simulator",
      udid: "sim-1",
      reality: "virtual",
    }),
    device({ name: "Watch", udid: "watch-1", platform: "watchOS" }),
  ];

  assert.deepEqual(connectedPhysicalIphones(devices), [connectedIphone]);
  assert.equal(selectDevice(devices, null), connectedIphone);
  assert.equal(selectDevice(devices, "Phone"), connectedIphone);
  assert.equal(selectDevice(devices, "phone-1"), connectedIphone);
});

test("selects a paired iPhone before its developer services are active", () => {
  const dormantIphone = device({ name: "Dormant iPhone", udid: "phone-1" });
  dormantIphone.connectionProperties.tunnelState = "disconnected";
  dormantIphone.deviceProperties.ddiServicesAvailable = false;

  assert.deepEqual(connectedPhysicalIphones([dormantIphone]), [dormantIphone]);
  assert.equal(selectDevice([dormantIphone], "Dormant iPhone"), dormantIphone);
});

test("rejects an unpaired physical iPhone", () => {
  const unpairedIphone = device({
    name: "Unpaired iPhone",
    paired: false,
    udid: "phone-1",
  });

  assert.deepEqual(connectedPhysicalIphones([unpairedIphone]), []);
});

test("requires an explicit selector when multiple iPhones are connected", () => {
  const devices = [
    device({ name: "First", udid: "phone-1" }),
    device({ name: "Second", udid: "phone-2" }),
  ];

  assert.throws(
    () => selectDevice(devices, null),
    /Expected exactly one connected physical iPhone, found 2/,
  );
  assert.equal(selectDevice(devices, "Second"), devices[1]);
});

test("builds the Release runtime with local-only .dev overrides", () => {
  const args = createXcodeBuildArgs("phone-1", "/tmp/derived-data");

  assert.deepEqual(args.slice(0, 8), [
    "-workspace",
    "ios/MrBroccoli.xcworkspace",
    "-scheme",
    "MrBroccoli",
    "-configuration",
    "Release",
    "-destination",
    "id=phone-1",
  ]);
  assert.ok(args.includes("MR_BROCCOLI_LOCAL_APP_ICON=AppIconDev"));
  assert.ok(args.includes("MR_BROCCOLI_LOCAL_BUNDLE_SUFFIX=.dev"));
  assert.ok(args.includes("MR_BROCCOLI_LOCAL_DISPLAY_SUFFIX= Dev"));
  assert.equal(args.includes("Debug"), false);
});

test("resolves the embedded bundle and extension under Release-iphoneos", () => {
  const paths = standaloneAppPaths("/tmp/derived-data");

  assert.equal(
    paths.appPath,
    path.join(
      "/tmp/derived-data",
      "Build",
      "Products",
      "Release-iphoneos",
      "MrBroccoli.app",
    ),
  );
  assert.equal(paths.bundlePath, path.join(paths.appPath, "main.jsbundle"));
  assert.equal(
    paths.liveActivityInfoPath,
    path.join(
      paths.appPath,
      "PlugIns",
      "MrBroccoliLiveActivity.appex",
      "Info.plist",
    ),
  );
});
