import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * Page two of the workspace pager: the text composer. It fills the orb's slot
 * so the controls below never move when the pager swaps.
 * Geometry from src/screens/main/: radius 15, border 1.5, padding 16/9/8,
 * gap 10, field capped at 116pt, 46pt circular send button.
 */
export function Composer({ value = "", onChange, onSend, height, placeholder = "Type a message", accessibilityLabel = "Message", style }) {
  const canSend = !!value;
  return (
    <div style={{ width: "100%", height, maxHeight: height ? undefined : 116, display: "flex", flexDirection: "column", justifyContent: "flex-end",
      borderRadius: 15, borderWidth: 1.5, borderStyle: "solid", borderColor: "var(--mb-color-accent)",
      background: "var(--mb-color-surface)", padding: "8px 9px 8px 16px", gap: 10,
      boxShadow: "0 4px 12px var(--mb-color-glow)", ...style }}>
      <textarea value={value} onChange={(event) => onChange && onChange(event.target.value)} placeholder={placeholder}
        aria-label={accessibilityLabel}
        style={{ flex: 1, minHeight: 24, width: "100%", resize: "none", border: "none", outline: "none", background: "transparent",
          fontFamily: "var(--mb-font-body)", fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)", padding: 0 }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span role="button" aria-label="Send" aria-disabled={!canSend} onClick={canSend ? onSend : undefined}
          style={{ width: 46, height: 46, borderRadius: "var(--mb-radius-icon-button)", flexShrink: 0, cursor: canSend ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: canSend ? "var(--mb-color-accent)" : "var(--mb-color-surface-alt)" }}>
          <PhosphorIcon name="arrow-up" size="control" color={canSend ? "var(--mb-color-on-active-control)" : "var(--mb-color-text-muted)"} />
        </span>
      </div>
    </div>
  );
}
