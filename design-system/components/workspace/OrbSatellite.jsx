import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * A 44pt control with a quiet label beneath it, sitting under the orb.
 * Toggles carry a round well and tint when on; actions are momentary and
 * stay borderless. The label never carries the state — the well does — so it
 * can hold a legible neutral in both appearances.
 */
export function OrbSatellite({
  icon,
  label,
  accessibilityLabel,
  kind = "action",
  tone = "neutral",
  active = false,
  disabled = false,
  onPress,
  style,
}) {
  const toggle = kind === "toggle";
  const toneInk = tone === "danger" ? "var(--mb-color-danger)" : tone === "success" ? "var(--mb-color-success)" : null;
  const tint = toneInk || (active ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 64, opacity: disabled ? .38 : 1, ...style }}>
      <span
        role={toggle ? "switch" : "button"}
        aria-checked={toggle ? !!active : undefined}
        aria-disabled={disabled ? "true" : undefined}
        aria-label={accessibilityLabel || label}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onPress}
        style={{
          width: 44, height: 44, cursor: disabled ? "default" : "pointer",
          borderRadius: "var(--mb-radius-icon-button)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid " + (toggle ? (active ? "var(--mb-color-accent)" : "var(--mb-color-border)") : "transparent"),
          background: toggle && active ? "var(--mb-color-accent-soft)" : "transparent",
        }}
      >
        <PhosphorIcon name={icon} size="control" color={tint} />
      </span>
      <span style={{
        fontFamily: "var(--mb-font-mono)", fontSize: 9, letterSpacing: "0.75px", textTransform: "uppercase",
        color: toneInk || "var(--mb-color-text-secondary)", textAlign: "center",
      }}>{label}</span>
    </div>
  );
}
