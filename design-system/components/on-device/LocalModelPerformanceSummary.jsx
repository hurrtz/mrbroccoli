import React from "react";

/** Two mono-adjacent lines summarising how a local model performs on this device. */
export function LocalModelPerformanceSummary({ evidence = "Estimated", fit = "Likely", details = [] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{evidence + " · " + fit}</span>
      <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)" }}>{details.join(" · ")}</span>
    </div>
  );
}
