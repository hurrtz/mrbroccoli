import React from "react";

export const ICON_SIZE = { inline: 14, compact: 16, control: 20, navigation: 24, prominent: 28, feature: 32, hero: 40 };

export const MIN_ICON_TOUCH_TARGET = 44;

/** The application glyph boundary. Semantic names only — never a raw Phosphor class. */
export const PHOSPHOR_ICONS = {
  "arrow-down": "arrow-down", "arrow-left": "arrow-left", "arrow-right": "arrow-right", "arrow-up": "arrow-up",
  audio: "waveform", check: "check", "check-circle": "check-circle", "checkbox-checked": "check-square",
  "checkbox-unchecked": "square", close: "x", control: "sliders-horizontal", copy: "copy",
  "customer-service": "headset", delete: "trash", down: "caret-down", download: "download-simple",
  edit: "pencil-simple", "ellipsis-vertical": "dots-three-vertical", "exclamation-circle": "warning-circle",
  export: "export", eye: "eye", "eye-invisible": "eye-slash", "file-text": "file-text", "folder-open": "folder-open",
  global: "globe-hemisphere-west", branch: "git-branch", bug: "bug", headphones: "headphones", inbox: "tray",
  image: "image", "info-circle": "info", key: "key", left: "caret-left", "line-chart": "chart-line-up",
  loading: "spinner-gap", lock: "lock", menu: "list", message: "chat-circle", mic: "microphone", pause: "pause",
  "play-circle": "play-circle", plus: "plus", pushpin: "push-pin", redo: "repeat", "radio-selected": "radio-button",
  "radio-unselected": "circle", reload: "arrow-clockwise", right: "caret-right", robot: "robot",
  "safety-certificate": "shield-check", search: "magnifying-glass", send: "paper-plane-tilt", setting: "gear",
  "share-alt": "share-network", sliders: "sliders-horizontal", sound: "speaker-high", stop: "stop",
  thunderbolt: "lightning", up: "caret-up", warning: "warning", cpu: "cpu",
  brain: "brain", council: "users-three",
};

export function resolveIconSize(size) {
  return ICON_SIZE[size] || ICON_SIZE.control;
}

export function PhosphorIcon({ name, size = "control", color = "currentColor", style }) {
  const px = resolveIconSize(size);
  const glyph = PHOSPHOR_ICONS[name] || "circle";
  return (
    <i
      aria-hidden="true"
      className={"ph ph-" + glyph}
      style={{ fontSize: px, lineHeight: 1, width: px, height: px, color, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...style }}
    />
  );
}
