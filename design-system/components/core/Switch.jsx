import React from "react";

/**
 * The one switch in the product. The track keeps its native 46×28 drawing;
 * the pressable around it is a full 44pt target, the same trick IconAction and
 * the fork tag use — the visual size stays, the tap does not.
 */
export function Switch({ value = false, onChange, accessibilityLabel, disabled = false, style }) {
  return (
    <span
      role="switch"
      aria-checked={value ? "true" : "false"}
      aria-disabled={disabled ? "true" : undefined}
      aria-label={accessibilityLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : (event) => { event.stopPropagation(); if (onChange) onChange(!value); }}
      style={{
        width: 46, minHeight: "var(--mb-touch-target)", flexShrink: 0, cursor: disabled ? "default" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? "var(--mb-disabled-opacity)" : 1, ...style,
      }}
    >
      <span aria-hidden="true" style={{ width: 46, height: 28, borderRadius: 14, position: "relative", display: "block", transition: "background .15s", background: value ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)" }}>
        <span style={{ position: "absolute", top: 2, left: value ? 20 : 2, width: 24, height: 24, borderRadius: 12, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .15s" }} />
      </span>
    </span>
  );
}
