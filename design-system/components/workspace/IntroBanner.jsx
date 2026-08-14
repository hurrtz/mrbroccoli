import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * The first-run invitation above the workspace, and the one surface that does
 * not follow the app palette: violet so it cannot read as furniture. The play
 * affordance promises the walkthrough is spoken; the whole banner is one
 * pressable. `compact` collapses it to a single 48pt row for landscape, where
 * the full card would take nearly half the column.
 */
export function IntroBanner({
  title = "Set up Mr Broccoli",
  body = "A minute of setup gets him thinking, hearing you and speaking back.",
  showDismiss = false, onOpen, onDismiss, visible = true, compact = false,
}) {
  if (!visible) return null;
  const gradient = "linear-gradient(135deg, var(--mb-color-intro-banner-grad-a), var(--mb-color-intro-banner-grad-b))";
  const sheen = (
    <React.Fragment>
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: "-30%", width: "30%", height: "100%", background: "linear-gradient(105deg, transparent, rgba(255,255,255,.28), transparent)", transform: "skewX(-18deg)", animation: "mb-sheen 3.6s ease-in-out infinite" }} />
      <style>{"@keyframes mb-sheen{0%,55%{left:-32%}85%,100%{left:130%}}"}</style>
    </React.Fragment>
  );
  const dismissButton = (size) => (
    <button type="button" aria-label="Dismiss" onClick={(event) => { event.stopPropagation(); onDismiss && onDismiss(); }} style={{ width: 44, height: 44, margin: -2, flexShrink: 0, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <PhosphorIcon name="close" size={size} color="var(--mb-color-intro-banner-dismiss)" />
    </button>
  );
  if (compact) {
    return (
      <div role="button" onClick={onOpen}
        style={{ position: "relative", overflow: "hidden", cursor: "pointer", minHeight: 48, background: gradient, borderRadius: "var(--mb-radius-control)", padding: showDismiss ? "0 6px 0 14px" : "0 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 14px var(--mb-color-intro-banner-shadow)" }}>
        {sheen}
        <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: "var(--mb-radius-control)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.5)" }}>
          <PhosphorIcon name="play" size="inline" color="var(--mb-color-intro-banner-text)" />
        </span>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, lineHeight: "19px", color: "var(--mb-color-intro-banner-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        {showDismiss ? dismissButton("compact") : <PhosphorIcon name="right" size="inline" color="var(--mb-color-intro-banner-dismiss)" />}
      </div>
    );
  }
  return (
    <div role="button" onClick={onOpen}
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: gradient, borderRadius: "var(--mb-radius-panel)", padding: "13px 15px", marginBottom: 12, display: "flex", alignItems: "center", gap: 13, boxShadow: "0 6px 20px var(--mb-color-intro-banner-shadow)" }}>
      {sheen}
      <span aria-hidden="true" style={{ width: 44, height: 44, margin: -2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ width: 40, height: 40, borderRadius: "var(--mb-radius-icon-button)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.5)" }}>
          <PhosphorIcon name="play" size="control" color="var(--mb-color-intro-banner-text)" />
        </span>
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, color: "var(--mb-color-intro-banner-text)" }}>{title}</span>
        <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-text-supporting-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-intro-banner-text-secondary)" }}>{body}</span>
      </span>
      {showDismiss ? dismissButton("compact") : <PhosphorIcon name="right" size="inline" color="var(--mb-color-intro-banner-dismiss)" />}
    </div>
  );
}
