import React from "react";

/** The app title set in Unica One. There is no lockup — the name is the mark. */
export function AppWordmark({ name = "Mr Broccoli", color = "var(--mb-color-text)", compact = false, style }) {
  if (compact) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 2, padding: "10px 12px", borderRadius: "var(--mb-radius-pill)",
        background: "var(--mb-color-surface)", border: "1px solid var(--mb-color-border)",
        fontFamily: "var(--mb-font-headline)", fontSize: 14, letterSpacing: "0.6px", color, ...style,
      }}>{name}</span>
    );
  }
  return (
    <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 26, lineHeight: "32px", letterSpacing: "-0.25px", color, whiteSpace: "nowrap", ...style }}>{name}</span>
  );
}
