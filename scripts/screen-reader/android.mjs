import {
  capture,
  captureHierarchy,
  runPrepFlow,
  wait,
} from "./runtime.mjs";

const TALKBACK_PACKAGE = "com.google.android.marvin.talkback";
const TALKBACK_SERVICE = `${TALKBACK_PACKAGE}/${TALKBACK_PACKAGE}.TalkBackService`;

function readSetting(execute, cwd, udid, namespace, key) {
  return capture(
    execute,
    "adb",
    ["-s", udid, "shell", "settings", "get", namespace, key],
    cwd,
  ).stdout.trim();
}

function restoreSetting(execute, cwd, udid, namespace, key, value) {
  const action =
    value === "null" || value === ""
      ? ["delete", namespace, key]
      : ["put", namespace, key, value];
  execute("adb", ["-s", udid, "shell", "settings", ...action], { cwd });
}

function setReader(execute, cwd, udid, enabled) {
  const serviceAction = enabled
    ? ["put", "secure", "enabled_accessibility_services", TALKBACK_SERVICE]
    : ["delete", "secure", "enabled_accessibility_services"];
  execute(
    "adb",
    ["-s", udid, "shell", "settings", ...serviceAction],
    { cwd },
  );
  execute(
    "adb",
    [
      "-s",
      udid,
      "shell",
      "settings",
      "put",
      "secure",
      "accessibility_enabled",
      enabled ? "1" : "0",
    ],
    { cwd },
  );
}

function notificationPermissionGranted(packageDump) {
  return /android\.permission\.POST_NOTIFICATIONS:\s+granted=true/.test(
    packageDump,
  );
}

export function runAndroidScreenReaderCheck({
  appId,
  cwd,
  execute,
  outputDirectory,
  udid,
}) {
  const previous = {
    enabled: readSetting(
      execute,
      cwd,
      udid,
      "secure",
      "accessibility_enabled",
    ),
    services: readSetting(
      execute,
      cwd,
      udid,
      "secure",
      "enabled_accessibility_services",
    ),
  };
  const packagePath = capture(
    execute,
    "adb",
    ["-s", udid, "shell", "pm", "path", TALKBACK_PACKAGE],
    cwd,
  ).stdout.trim();
  if (!packagePath.startsWith("package:")) {
    throw new Error(`TalkBack is not installed on Android device ${udid}`);
  }
  const packageDump = capture(
    execute,
    "adb",
    ["-s", udid, "shell", "dumpsys", "package", TALKBACK_PACKAGE],
    cwd,
  ).stdout;
  const notificationWasGranted = notificationPermissionGranted(packageDump);

  try {
    setReader(execute, cwd, udid, false);
    runPrepFlow({ appId, cwd, execute, outputDirectory, udid });
    execute(
      "adb",
      [
        "-s",
        udid,
        "shell",
        "pm",
        "grant",
        TALKBACK_PACKAGE,
        "android.permission.POST_NOTIFICATIONS",
      ],
      { allowFailure: true, cwd },
    );
    setReader(execute, cwd, udid, true);
    wait(1_500);

    const accessibilityDump = capture(
      execute,
      "adb",
      ["-s", udid, "shell", "dumpsys", "accessibility"],
      cwd,
    ).stdout;
    if (
      !accessibilityDump.includes("Service[label=TalkBack") ||
      !accessibilityDump.includes(TALKBACK_SERVICE)
    ) {
      throw new Error(`TalkBack did not bind on Android device ${udid}`);
    }

    return {
      hierarchy: captureHierarchy(execute, cwd, udid),
      readerState: { reader: "TalkBack", readerActive: true },
    };
  } finally {
    restoreSetting(
      execute,
      cwd,
      udid,
      "secure",
      "enabled_accessibility_services",
      previous.services,
    );
    restoreSetting(
      execute,
      cwd,
      udid,
      "secure",
      "accessibility_enabled",
      previous.enabled,
    );
    if (!notificationWasGranted) {
      execute(
        "adb",
        [
          "-s",
          udid,
          "shell",
          "pm",
          "revoke",
          TALKBACK_PACKAGE,
          "android.permission.POST_NOTIFICATIONS",
        ],
        { allowFailure: true, cwd },
      );
    }
  }
}
