import React from "react";

/** A selectable filter chip. 36pt tall, 8px radius — never a pill. */
export function Tag({ children, selected = false, onChange, style }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onChange}
      style={{
        minHeight: 36, padding: "8px 12px", borderRadius: "var(--mb-radius-tag)",
        border: "1px solid " + (selected ? "var(--mb-color-accent)" : "var(--mb-color-border)"),
        background: selected ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)",
        color: selected ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)",
        fontFamily: "var(--mb-text-supporting-family)", fontSize: "var(--mb-text-supporting-size)",
        cursor: "pointer", ...style,
      }}
    >
      {children}
    </button>
  );
}
