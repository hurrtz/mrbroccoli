const REQUIRED_HOME_CONTROLS = [
  { id: "main-conversations-button", label: "Conversations" },
  { id: "main-settings-button", label: "Settings" },
  { id: "intro-banner", label: "Set up Mr Broccoli" },
  {
    id: "prompt-blocked-notice",
    label:
      "Add credentials in Settings before starting a voice session. Configure credentials",
  },
  { id: "transcript-handle", label: "Show transcript. No messages yet" },
  {
    id: "conversation-settings-summary-control",
    label: "Open conversation settings",
  },
  {
    id: "voice-orb-idle",
    label: "Add credentials in Settings before starting a voice session.",
  },
  { id: "pager-chevron-left", label: "Show text input" },
  { id: "pager-chevron-right", label: "Show text input" },
  { id: "satellite-image", label: "Add image" },
  { id: "satellite-council", label: "Model Council" },
  { id: "satellite-web", label: "Web Search" },
];

export function flattenHierarchy(root) {
  if (!root || typeof root !== "object") {
    return [];
  }

  return [
    root,
    ...((Array.isArray(root.children) ? root.children : []).flatMap((child) =>
      flattenHierarchy(child),
    )),
  ];
}

function accessibleName(attributes) {
  return String(attributes.accessibilityText || attributes.text || "").trim();
}

export function validateScreenReaderHierarchy(hierarchy) {
  const nodes = flattenHierarchy(hierarchy);
  const errors = [];
  const controls = [];

  for (const required of REQUIRED_HOME_CONTROLS) {
    const matches = nodes.filter(
      (node) => node.attributes?.["resource-id"] === required.id,
    );
    const candidates = required.descendant
      ? matches.flatMap((node) => flattenHierarchy(node))
      : matches;
    const match = candidates.find(
      (node) => accessibleName(node.attributes) === required.label,
    );

    if (!match) {
      errors.push(`${required.id} is missing the label ${required.label}`);
      continue;
    }
    if (
      Object.hasOwn(match.attributes, "clickable") &&
      match.attributes.clickable !== "true"
    ) {
      errors.push(`${required.id} is not exposed as an interactive control`);
      continue;
    }

    controls.push({ id: required.id, label: required.label });
  }

  const exposedDecorativeIcons = nodes
    .filter((node) => {
      const id = String(node.attributes?.["resource-id"] ?? "");
      return (
        (id.startsWith("phosphor-icon-") || id.startsWith("provider-icon-")) &&
        node.attributes?.["important-for-accessibility"] === "true"
      );
    })
    .map((node) => node.attributes["resource-id"]);

  if (exposedDecorativeIcons.length > 0) {
    errors.push(
      `Decorative icons remain exposed to screen readers: ${[
        ...new Set(exposedDecorativeIcons),
      ].join(", ")}`,
    );
  }

  return { controls, errors };
}
