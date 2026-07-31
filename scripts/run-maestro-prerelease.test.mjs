import assert from "node:assert/strict";
import test from "node:test";

import {
  parseAdbDevices,
  parseBootedIosSimulators,
} from "./run-maestro-prerelease.mjs";

test("separates connected Android emulators from physical devices", () => {
  assert.deepEqual(
    parseAdbDevices(`List of devices attached
emulator-5554 device product:sdk model:Pixel transport_id:1
192.168.1.20:41231 device product:phone model:Phone transport_id:2
offline-device offline transport_id:3
`),
    [
      { kind: "emulator", udid: "emulator-5554" },
      { kind: "physical", udid: "192.168.1.20:41231" },
    ],
  );
});

test("derives only booted, available iOS simulators", () => {
  assert.deepEqual(
    parseBootedIosSimulators(
      JSON.stringify({
        devices: {
          "com.apple.CoreSimulator.SimRuntime.iOS-26-5": [
            {
              isAvailable: true,
              name: "iPhone 17 Pro",
              state: "Booted",
              udid: "BOOTED-UDID",
            },
            {
              isAvailable: true,
              name: "iPhone 17",
              state: "Shutdown",
              udid: "SHUTDOWN-UDID",
            },
          ],
        },
      }),
    ),
    [{ name: "iPhone 17 Pro", udid: "BOOTED-UDID" }],
  );
});
