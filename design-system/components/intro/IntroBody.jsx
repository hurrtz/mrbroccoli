import React from "react";

/** The paragraph under a step heading. Centred, secondary, generous leading. */
export function IntroBody({ children, style }) {
  return (
    <p style={{
      margin: 0, fontFamily: "var(--mb-font-body)", fontSize: 16, lineHeight: "24px",
      textAlign: "center", textWrap: "pretty", color: "var(--mb-color-text-secondary)", ...style,
    }}>{children}</p>
  );
}
