import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** One 52pt settings row: icon, label, current value, and a control or drill-in chevron. */
export function SettingsRow({ icon, label, value, control, danger = false, accent = false, onPress, last = false }) {
  const labelColor = danger ? "var(--mb-color-danger)" : accent ? "var(--mb-color-accent)" : "var(--mb-color-text)";
  const iconColor = danger ? "var(--mb-color-danger)" : accent ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)";
  return (
    <div role="button" onClick={onPress} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, padding: "0 14px", cursor: "pointer", borderBottom: last ? "none" : "1px solid var(--mb-color-border)" }}>
      {icon ? <PhosphorIcon name={icon} size="compact" color={iconColor} /> : null}
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: labelColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      {value ? <span style={{ flexShrink: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 14, color: "var(--mb-color-text-secondary)" }}>{value}</span> : null}
      {control !== undefined ? control : <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />}
    </div>
  );
}
