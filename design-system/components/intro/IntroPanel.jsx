import React from "react";

/** Grouped content on its own paper, inside an introduction step. */
export function IntroPanel({ children, style }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 16, padding: 18,
      borderRadius: "var(--mb-radius-panel)", border: "1px solid var(--mb-color-border)",
      background: "var(--mb-color-surface)", ...style,
    }}>{children}</div>
  );
}

/** A hairline between grouped points inside a panel. */
export function IntroPanelDivider({ style }) {
  return <span style={{ height: 1, background: "var(--mb-color-border)", ...style }} />;
}
