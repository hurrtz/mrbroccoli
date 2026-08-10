import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * The first-run invitation above the workspace, and the one surface that does
 * not follow the app palette: violet so it cannot read as furniture.
 * `compact` collapses it to a single 48pt row for landscape, where the full
 * card would take nearly half the column.
 */
export function IntroBanner({ title, body, action, showDismiss = false, onOpen, onDismiss, visible = true, compact = false }) {
  if (!visible) return null;
  if (compact) {
    return (
      <div
        role="button"
        onClick={onOpen}
        style={{
          position: "relative", overflow: "hidden", cursor: "pointer", minHeight: 48,
          background: "var(--mb-color-intro-banner)", borderRadius: "var(--mb-radius-control)",
          padding: showDismiss ? "0 6px 0 60px" : "0 14px", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 10,
        }}
      >
        <span style={{ flex: 1, minWidth: 0, textAlign: "center", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, lineHeight: "19px", color: "var(--mb-color-intro-banner-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        {showDismiss ? (
          <button type="button" aria-label="Dismiss" onClick={(event) => { event.stopPropagation(); onDismiss && onDismiss(); }} style={{ width: 44, height: 44, flexShrink: 0, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhosphorIcon name="close" size="compact" color="var(--mb-color-intro-banner-dismiss)" />
          </button>
        ) : null}
      </div>
    );
  }
  return (
    <div
      role="button"
      onClick={onOpen}
      style={{
        position: "relative", overflow: "hidden", cursor: "pointer",
        background: "var(--mb-color-intro-banner)", borderRadius: "var(--mb-radius-panel)", padding: 18,
        display: "flex", flexDirection: "column", gap: 14, marginBottom: 12,
      }}
    >
      <div style={{ position: "absolute", top: -80, left: -50, width: 180, height: 180, borderRadius: 999, background: "var(--mb-color-intro-banner-glow)" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 18, lineHeight: "24px", color: "var(--mb-color-intro-banner-text)" }}>{title}</span>
          <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "19px", color: "var(--mb-color-intro-banner-text-secondary)" }}>{body}</span>
        </div>
        {showDismiss ? (
          <button type="button" aria-label="Dismiss" onClick={(event) => { event.stopPropagation(); onDismiss && onDismiss(); }} style={{ width: 44, height: 44, marginTop: -12, marginRight: -12, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhosphorIcon name="close" size="compact" color="var(--mb-color-intro-banner-dismiss)" />
          </button>
        ) : null}
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 40, padding: "0 16px", borderRadius: 999, background: "var(--mb-color-intro-banner-action)", color: "var(--mb-color-intro-banner-on-action)", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14 }}>
          {action}
          <PhosphorIcon name="right" size="compact" color="var(--mb-color-intro-banner-on-action)" />
        </span>
      </div>
    </div>
  );
}
