import assert from "node:assert/strict";
import test from "node:test";

import {
  runIosNativeTests,
  selectBootedIosSimulator,
} from "./run-ios-native-tests.mjs";

const simulators = [
  { name: "iPhone 17 Pro", udid: "SIMULATOR-ONE" },
  { name: "iPhone 17", udid: "SIMULATOR-TWO" },
];

test("selects the only booted iOS simulator", () => {
  assert.equal(selectBootedIosSimulator(simulators.slice(0, 1), {}), "SIMULATOR-ONE");
});

test("requires an explicit override when multiple simulators are booted", () => {
  assert.throws(
    () => selectBootedIosSimulator(simulators, {}),
    /Expected exactly one booted iOS simulator, found 2/,
  );
  assert.equal(
    selectBootedIosSimulator(simulators, {
      MR_BROCCOLI_IOS_SIMULATOR_UDID: "SIMULATOR-TWO",
    }),
    "SIMULATOR-TWO",
  );
});

test("runs only the native lifecycle target on the selected simulator", () => {
  const calls = [];
  const selected = runIosNativeTests({
    captureCommand(command, args) {
      calls.push({ args, command, kind: "capture" });
      return JSON.stringify({
        devices: {
          runtime: [
            {
              isAvailable: true,
              name: "iPhone 17 Pro",
              state: "Booted",
              udid: "SIMULATOR-ONE",
            },
          ],
        },
      });
    },
    cwd: "/repo",
    environment: {},
    run(command, args) {
      calls.push({ args, command, kind: "run" });
      return "";
    },
  });

  assert.equal(selected, "SIMULATOR-ONE");
  assert.deepEqual(calls[0], {
    args: ["simctl", "list", "devices", "booted", "--json"],
    command: "xcrun",
    kind: "capture",
  });
  assert.equal(calls[1].command, "xcodebuild");
  assert.ok(calls[1].args.includes("platform=iOS Simulator,id=SIMULATOR-ONE"));
  assert.ok(calls[1].args.includes("-only-testing:MrBroccoliTests"));
});
