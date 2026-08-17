import assert from "node:assert/strict";
import test from "node:test";

import {
  flattenHierarchy,
  validateScreenReaderHierarchy,
} from "./run-screen-reader-check.mjs";
import { launchSimulatorApp } from "./screen-reader/ios.mjs";

const requiredControls = [
  ["main-conversations-button", "Conversations"],
  ["main-settings-button", "Settings"],
  [
    "prompt-blocked-notice",
    "Add credentials in Settings before starting a voice session. Configure credentials",
  ],
  ["transcript-handle", "Show transcript. No messages yet"],
  ["conversation-settings-summary-control", "Open conversation settings"],
  [
    "voice-orb-idle",
    "Add credentials in Settings before starting a voice session.",
  ],
  ["pager-chevron-left", "Show text input"],
  ["pager-chevron-right", "Show text input"],
  ["satellite-image", "Add image"],
  ["satellite-council", "Model Council"],
  ["satellite-web", "Web Search"],
];

function hierarchyWithControls(overrides = []) {
  const children = requiredControls.map(([id, label]) => ({
    attributes: {
      accessibilityText: label,
      clickable: "true",
      "resource-id": id,
    },
    children: [],
  }));
  children.push(...overrides);
  return { attributes: {}, children };
}

test("flattens nested Maestro hierarchy nodes", () => {
  const hierarchy = {
    attributes: { "resource-id": "root" },
    children: [
      {
        attributes: { "resource-id": "child" },
        children: [],
      },
    ],
  };

  assert.deepEqual(
    flattenHierarchy(hierarchy).map(
      (node) => node.attributes["resource-id"],
    ),
    ["root", "child"],
  );
});

test("accepts the complete labelled home control hierarchy", () => {
  const result = validateScreenReaderHierarchy(hierarchyWithControls());

  assert.deepEqual(result.errors, []);
  assert.equal(result.controls.length, requiredControls.length);
});

test("rejects missing labels, non-interactive controls, and exposed icons", () => {
  const hierarchy = hierarchyWithControls([
    {
      attributes: {
        "important-for-accessibility": "true",
        "resource-id": "phosphor-icon-close",
      },
      children: [],
    },
  ]);
  hierarchy.children.find(
    (node) => node.attributes["resource-id"] === "main-settings-button",
  ).attributes.accessibilityText = "";
  hierarchy.children.find(
    (node) => node.attributes["resource-id"] === "pager-chevron-right",
  ).attributes.clickable = "false";

  const result = validateScreenReaderHierarchy(hierarchy);

  assert.equal(
    result.errors.some((error) => error.includes("main-settings-button")),
    true,
  );
  assert.equal(
    result.errors.some((error) => error.includes("pager-chevron-right")),
    true,
  );
  assert.equal(
    result.errors.some((error) => error.includes("phosphor-icon-close")),
    true,
  );
});

test("retries an iOS app launch after the simulator reports a transient failure", () => {
  const calls = [];
  const pauses = [];
  let launchAttempts = 0;
  const execute = (command, args, options) => {
    calls.push({ args, command, options });
    if (args[1] === "launch") {
      launchAttempts += 1;
      return { status: launchAttempts === 1 ? 124 : 0 };
    }
    return { status: 0 };
  };

  launchSimulatorApp(
    execute,
    "/repo",
    "simulator-udid",
    "com.example.app",
    (milliseconds) => pauses.push(milliseconds),
  );

  assert.equal(launchAttempts, 2);
  assert.deepEqual(pauses, [1_500]);
  assert.deepEqual(
    calls.map(({ args }) => args.slice(0, 2)),
    [
      ["simctl", "launch"],
      ["simctl", "bootstatus"],
      ["simctl", "launch"],
    ],
  );
});
