import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** A settings card whose content collapses. The whole header toggles it. */
export function AntDisclosureCard({ header, headerExtra, expanded, onToggle, children, footer, toggleAccessibilityLabel, style }) {
  return (
    <section style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-elevated)", overflow: "hidden", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 50, padding: "12px 16px" }}>
        <div
          role="button"
          aria-expanded={expanded}
          onClick={onToggle}
          style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, minHeight: 44, cursor: "pointer" }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {headerExtra}
          <button type="button" aria-label={toggleAccessibilityLabel} aria-expanded={expanded} onClick={onToggle} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
            <PhosphorIcon name={expanded ? "up" : "down"} size="control" color="var(--mb-color-text-secondary)" />
          </button>
        </div>
      </div>
      {expanded ? (
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--mb-color-border)" }}>{children}</div>
      ) : null}
      {footer ? <footer style={{ padding: "8px 16px", borderTop: "1px solid var(--mb-color-border)" }}>{footer}</footer> : null}
    </section>
  );
}
