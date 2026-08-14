import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * Quick verbs anchored where the tap happened — the light alternative to a
 * bottom sheet. No backdrop dim: a transparent click-away layer only. Groups
 * are the hierarchy: hairlines inside a group, a 6px band between groups,
 * danger last and alone.
 */
export function AnchoredMenu({ visible = true, groups = [], onClose, width = 252, style, inline = false }) {
  if (!visible) return null;
  const shown = groups.filter((group) => group && group.length);
  return (
    <div style={{ position: inline ? "absolute" : "fixed", inset: 0, zIndex: 40 }}>
      <div aria-hidden="true" onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div role="menu" style={{ position: "absolute", width, borderRadius: "var(--mb-radius-panel)", overflow: "hidden", border: "1px solid var(--mb-color-surface-raised-border)", background: "var(--mb-color-surface-elevated)", boxShadow: "0 12px 34px rgba(0,0,0,.28)", ...style }}>
        {shown.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex ? <div aria-hidden="true" style={{ height: 6, background: "var(--mb-color-border)", opacity: .55 }} /> : null}
            {group.map((item, itemIndex) => (
              <button key={item.label} type="button" role="menuitem" onClick={() => { if (item.onPress) item.onPress(); if (onClose) onClose(); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", minHeight: 44, padding: "0 14px", border: "none", borderTop: itemIndex ? "1px solid var(--mb-color-border)" : "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                <span style={{ flex: 1, fontFamily: "var(--mb-text-body-family)", fontSize: 15, color: item.danger ? "var(--mb-color-danger)" : "var(--mb-color-text)" }}>{item.label}</span>
                <PhosphorIcon name={item.icon} size="compact" color={item.danger ? "var(--mb-color-danger)" : "var(--mb-color-text-secondary)"} />
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
