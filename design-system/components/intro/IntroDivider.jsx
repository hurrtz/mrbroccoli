import React from "react";

/**
 * Marks a step as optional: a rule with the word set into it.
 *
 * A pill above the heading competed with the heading for the eye and read as a
 * status badge on the step. As a divider it does the same job in the reading
 * order it belongs to — a note about what follows, not a label on the title.
 */
export function IntroDivider({ label, style }) {
  const rule = { flex: 1, height: 1, background: "var(--mb-color-border)" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <span style={rule} />
      <span style={{
        fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 11,
        letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--mb-color-text-muted)",
      }}>{label}</span>
      <span style={rule} />
    </div>
  );
}
