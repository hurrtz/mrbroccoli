import React from "react";

/**
 * Token usage for the turn, one quiet mono line. Not interactive, no icon,
 * no container — the quietest thing in the message.
 */
export function UsageCard({ text, style }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: 12, marginLeft: -12, marginRight: -12, padding: "8px 12px 0", borderTop: "1px solid var(--mb-color-border)", ...style }}>
      <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10.5, letterSpacing: "0.3px", color: "var(--mb-color-text-muted)" }}>{text}</span>
    </div>
  );
}
