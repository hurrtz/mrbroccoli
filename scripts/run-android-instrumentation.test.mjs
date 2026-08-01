import assert from "node:assert/strict";
import test from "node:test";

import {
  parseConnectedAndroidEmulators,
  runAndroidInstrumentation,
  selectConnectedAndroidEmulator,
} from "./run-android-instrumentation.mjs";

const deviceList = `List of devices attached
emulator-5554 device product:sdk_gphone model:Pixel device:emu transport_id:1
192.168.1.10:5555 device product:phone model:Phone device:phone transport_id:2
emulator-5556 offline transport_id:3
`;

test("selects connected emulators without including physical devices", () => {
  assert.deepEqual(parseConnectedAndroidEmulators(deviceList), ["emulator-5554"]);
  assert.equal(
    selectConnectedAndroidEmulator(["emulator-5554"], {}),
    "emulator-5554",
  );
});

test("requires an explicit override when multiple emulators are connected", () => {
  const available = ["emulator-5554", "emulator-5556"];
  assert.throws(
    () => selectConnectedAndroidEmulator(available, {}),
    /Expected exactly one connected Android emulator, found 2/u,
  );
  assert.equal(
    selectConnectedAndroidEmulator(available, {
      MR_BROCCOLI_ANDROID_EMULATOR_SERIAL: "emulator-5556",
    }),
    "emulator-5556",
  );
});

test("resets only the emulator app before running instrumentation", () => {
  const calls = [];
  const selected = runAndroidInstrumentation({
    captureCommand(command, args) {
      calls.push({ args, command, kind: "capture" });
      if (args[0] === "devices") {
        return deviceList;
      }
      return "Time: 7.2\n\nOK (3 tests)\n";
    },
    cwd: "/repo",
    environment: {},
    run(command, args, options) {
      calls.push({ args, command, kind: "run", options });
      return "";
    },
    runBestEffort(command, args) {
      calls.push({ args, command, kind: "best-effort" });
      return "";
    },
  });

  assert.equal(selected, "emulator-5554");
  assert.deepEqual(
    calls.filter(({ kind }) => kind === "best-effort").map(({ args }) => args),
    [
      [
        "-s",
        "emulator-5554",
        "uninstall",
        "com.tobiaswinkler.app.mrbroccoli.test",
      ],
      [
        "-s",
        "emulator-5554",
        "uninstall",
        "com.tobiaswinkler.app.mrbroccoli",
      ],
    ],
  );
  assert.equal(
    calls.some(({ args }) => args.includes("192.168.1.10:5555")),
    false,
  );
  assert.ok(
    calls.some(
      ({ args }) =>
        args.includes(":app:assembleDebug") &&
        args.includes(":app:assembleDebugAndroidTest"),
    ),
  );
});

test("rejects instrumentation output without a passing summary", () => {
  assert.throws(
    () =>
      runAndroidInstrumentation({
        captureCommand(_command, args) {
          return args[0] === "devices" ? deviceList : "FAILURES!!!\n";
        },
        environment: {},
        run() {
          return "";
        },
        runBestEffort() {
          return "";
        },
      }),
    /did not report a passing result/u,
  );
});
