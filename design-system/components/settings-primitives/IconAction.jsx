import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** A quiet 36pt squircle icon action in a 44pt target — the single state-driven action on a model row. */
export function IconAction({ icon, label, danger = false, spin = false, onPress }) {
  return (
    <span role="button" aria-label={label} onClick={(e) => { e.stopPropagation(); if (onPress) onPress(); }}
      style={{ width: 44, height: 44, margin: "-7px -8px -7px 0", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ width: 36, height: 36, borderRadius: 11, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid " + (danger ? "var(--mb-color-danger)" : "var(--mb-color-border-strong)"), background: "var(--mb-color-surface)" }}>
        <style>{"@keyframes mb-spin{to{transform:rotate(360deg)}}"}</style>
        <span style={{ display: "inline-flex", animation: spin ? "mb-spin 1s linear infinite" : "none" }}>
          <PhosphorIcon name={icon} size="compact" color={danger ? "var(--mb-color-danger)" : "var(--mb-color-accent)"} />
        </span>
      </span>
    </span>
  );
}
