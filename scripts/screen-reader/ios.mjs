import {
  APP_ID,
  capture,
  captureHierarchy,
  runPrepFlow,
  wait,
} from "./runtime.mjs";

const ACCESSIBILITY_DOMAIN = "com.apple.Accessibility";
const READER_KEYS = [
  "VoiceOverTouchEnabled",
  "AccessibilityEnabled",
  "ApplicationAccessibilityEnabled",
];

function readPreference(execute, cwd, udid, key) {
  const result = capture(
    execute,
    "xcrun",
    [
      "simctl",
      "spawn",
      udid,
      "defaults",
      "read",
      ACCESSIBILITY_DOMAIN,
      key,
    ],
    cwd,
    true,
  );
  return result.status === 0
    ? { present: true, value: result.stdout.trim() }
    : { present: false, value: "" };
}

function writeBoolean(execute, cwd, udid, key, value) {
  execute(
    "xcrun",
    [
      "simctl",
      "spawn",
      udid,
      "defaults",
      "write",
      ACCESSIBILITY_DOMAIN,
      key,
      "-bool",
      value ? "true" : "false",
    ],
    { cwd },
  );
}

function restorePreference(execute, cwd, udid, key, state) {
  if (!state.present) {
    execute(
      "xcrun",
      [
        "simctl",
        "spawn",
        udid,
        "defaults",
        "delete",
        ACCESSIBILITY_DOMAIN,
        key,
      ],
      { allowFailure: true, cwd },
    );
    return;
  }

  writeBoolean(execute, cwd, udid, key, state.value === "1");
}

function rebootSimulator(execute, cwd, udid) {
  execute("xcrun", ["simctl", "shutdown", udid], {
    allowFailure: true,
    cwd,
  });
  execute("xcrun", ["simctl", "boot", udid], { cwd });
  execute("xcrun", ["simctl", "bootstatus", udid, "-b"], { cwd });
}

export function runIosScreenReaderCheck({
  cwd,
  execute,
  outputDirectory,
  udid,
}) {
  const previous = Object.fromEntries(
    READER_KEYS.map((key) => [key, readPreference(execute, cwd, udid, key)]),
  );
  const voiceOverWasEnabled =
    previous.VoiceOverTouchEnabled.present &&
    previous.VoiceOverTouchEnabled.value === "1";

  try {
    if (voiceOverWasEnabled) {
      for (const key of READER_KEYS) {
        writeBoolean(execute, cwd, udid, key, false);
      }
      rebootSimulator(execute, cwd, udid);
    }

    runPrepFlow({ cwd, execute, outputDirectory, udid });
    for (const key of READER_KEYS) {
      writeBoolean(execute, cwd, udid, key, true);
    }
    rebootSimulator(execute, cwd, udid);
    execute("xcrun", ["simctl", "launch", udid, APP_ID], { cwd });
    wait(1_500);

    const enabled = readPreference(
      execute,
      cwd,
      udid,
      "VoiceOverTouchEnabled",
    );
    if (!enabled.present || enabled.value !== "1") {
      throw new Error(`VoiceOver did not enable on iOS simulator ${udid}`);
    }

    return {
      hierarchy: captureHierarchy(execute, cwd, udid),
      readerState: { reader: "VoiceOver", readerActive: true },
    };
  } finally {
    for (const key of READER_KEYS) {
      restorePreference(execute, cwd, udid, key, previous[key]);
    }
    rebootSimulator(execute, cwd, udid);
  }
}
