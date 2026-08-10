import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

const TONE = {
  accent: "var(--mb-color-accent)",
  neutral: "var(--mb-color-text-muted)",
  premium: "var(--mb-color-premium)",
};

/** A single fact or benefit with a leading glyph in a round well. */
export function IntroPoint({ icon, title, body, tone = "accent", style }) {
  const color = TONE[tone] || TONE.accent;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, ...style }}>
      <span style={{
        width: 30, height: 30, flexShrink: 0, borderRadius: 999,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid color-mix(in srgb, " + color + " 25%, transparent)",
      }}>
        <PhosphorIcon name={icon} size="compact" color={color} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{
          fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15,
          lineHeight: "21px", color: "var(--mb-color-text)",
        }}>{title}</span>
        {body ? (
          <span style={{
            fontFamily: "var(--mb-font-body)", fontSize: 14, lineHeight: "20px",
            textWrap: "pretty", color: "var(--mb-color-text-secondary)",
          }}>{body}</span>
        ) : null}
      </span>
    </div>
  );
}
