import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** Icon + text inside a Button. Button does not style its own children. */
export function AntButtonLabel({ color, icon, iconSize = "compact", label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      {icon ? <PhosphorIcon name={icon} size={iconSize} color={color} /> : null}
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, lineHeight: "18px", color }}>{label}</span>
    </span>
  );
}
