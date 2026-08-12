import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * One route in a stage page's unified picker (System / on this device / via provider).
 * The radio stays disabled until an on-device model has tested viable.
 */
export function RouteOptionRow({ selected = false, disabled = false, locked = false, label, meta, action, sub, onSelect, last = false }) {
  if (locked) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, padding: "11px 14px", opacity: .5, borderBottom: last ? "none" : "1px solid var(--mb-color-border)" }}>
        <span style={{ width: 20, height: 20, borderRadius: 10, flexShrink: 0, border: "2px solid var(--mb-color-border-strong)" }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          {meta ? <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>{meta}</span> : null}
        </span>
        <PhosphorIcon name="lock" size="compact" color="var(--mb-color-text-muted)" />
      </div>
    );
  }
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid var(--mb-color-border)", padding: "11px 14px" }}>
      <div role="button" aria-disabled={disabled ? "true" : undefined} onClick={disabled ? undefined : onSelect} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", minHeight: 30 }}>
        <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 10, flexShrink: 0, opacity: disabled ? .4 : 1, border: "2px solid " + (selected ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)"), display: "flex", alignItems: "center", justifyContent: "center" }}>
          {selected ? <span style={{ width: 10, height: 10, borderRadius: 5, background: "var(--mb-color-accent)" }} /> : null}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          {meta ? <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>{meta}</span> : null}
        </span>
        {action || null}
      </div>
      {sub ? <div style={{ marginTop: 8, marginLeft: 32 }}>{sub}</div> : null}
    </div>
  );
}
