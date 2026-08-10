import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** Transient status. Info keeps the neutral border; success and danger tint it. */
export function Toast({ message, visible = true, tone = "info", onRetry, onDismiss, inline = false }) {
  if (!visible) return null;
  const toneColor = tone === "danger" ? "var(--mb-color-danger)" : tone === "success" ? "var(--mb-color-success)" : "var(--mb-color-accent)";
  const toneBackground = tone === "info" ? "var(--mb-color-accent-soft)" : "color-mix(in srgb, " + toneColor + " 12%, transparent)";
  return (
    <div
      role="alert"
      style={{
        position: inline ? "relative" : "absolute", top: inline ? undefined : 60, left: inline ? undefined : 16, right: inline ? undefined : 16,
        display: "flex", alignItems: "center", gap: 12, overflow: "hidden",
        padding: "14px 14px 14px 0", borderRadius: "var(--mb-radius-panel)",
        border: "1px solid " + (tone === "info" ? "var(--mb-color-border)" : toneColor),
        background: "var(--mb-color-surface-elevated)", boxShadow: "var(--mb-shadow-toast)", zIndex: 40,
      }}
    >
      <div style={{ alignSelf: "stretch", width: 5, background: toneColor }} />
      <div style={{ width: 34, height: 34, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", background: toneBackground, border: "1px solid " + toneColor }}>
        <PhosphorIcon name={tone === "success" ? "check" : "exclamation-circle"} size="compact" color={toneColor} />
      </div>
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text)" }}>{message}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {onRetry ? (
          <button type="button" onClick={onRetry} style={{ minHeight: 44, padding: "0 12px", borderRadius: "var(--mb-radius-control)", border: "1px solid " + toneColor, background: toneBackground, color: toneColor, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Retry</button>
        ) : null}
        <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ width: 44, height: 44, borderRadius: 22, border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <PhosphorIcon name="close" size="compact" color="var(--mb-color-text-secondary)" />
        </button>
      </div>
    </div>
  );
}
