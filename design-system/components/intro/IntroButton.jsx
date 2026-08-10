import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** Primary, secondary or premium action inside an introduction step. */
export function IntroButton({ label, icon, tone = "primary", onPress, style }) {
  const filled = tone !== "secondary";
  const background = tone === "premium" ? "var(--mb-color-premium)"
    : tone === "primary" ? "var(--mb-color-accent)" : "transparent";
  const labelColor = filled
    ? (tone === "premium" ? "var(--mb-color-on-premium)" : "var(--mb-color-on-accent)")
    : "var(--mb-color-text)";
  return (
    <button type="button" onClick={onPress} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      minHeight: 52, padding: "0 22px", cursor: "pointer",
      borderRadius: "var(--mb-radius-control)",
      border: "1px solid " + (filled ? "transparent" : "var(--mb-color-border-strong)"),
      background, color: labelColor,
      fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 16, ...style,
    }}>
      {icon ? <PhosphorIcon name={icon} size="control" color={labelColor} /> : null}
      {label}
    </button>
  );
}
