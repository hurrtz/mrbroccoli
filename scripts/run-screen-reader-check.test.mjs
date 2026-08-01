import assert from "node:assert/strict";
import test from "node:test";

import {
  flattenHierarchy,
  validateScreenReaderHierarchy,
} from "./run-screen-reader-check.mjs";

const requiredControls = [
  ["main-conversations-button", "Conversations"],
  ["main-settings-button", "Settings"],
  [
    "provider-empty-state",
    "Configure credentials. Add credentials in Settings, then choose the routes you want to use.",
  ],
  ["route-web-search-container", "Web Search"],
  ["voice-input-surface", "Tap to speak"],
  ["show-voice-input", "Show voice input"],
  ["show-text-input", "Show text input"],
];

function hierarchyWithControls(overrides = []) {
  const children = requiredControls.map(([id, label]) =>
    id === "voice-input-surface"
      ? {
          attributes: {
            accessibilityText: "",
            clickable: "true",
            "resource-id": id,
          },
          children: [
            {
              attributes: {
                accessibilityText: label,
                clickable: "true",
                "resource-id": "",
              },
              children: [],
            },
          ],
        }
      : {
          attributes: {
            accessibilityText: label,
            clickable: "true",
            "resource-id": id,
          },
          children: [],
        },
  );
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
    (node) => node.attributes["resource-id"] === "show-text-input",
  ).attributes.clickable = "false";

  const result = validateScreenReaderHierarchy(hierarchy);

  assert.equal(
    result.errors.some((error) => error.includes("main-settings-button")),
    true,
  );
  assert.equal(
    result.errors.some((error) => error.includes("show-text-input")),
    true,
  );
  assert.equal(
    result.errors.some((error) => error.includes("phosphor-icon-close")),
    true,
  );
});
