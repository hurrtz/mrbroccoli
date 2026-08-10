import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** The scrolling message list, with the empty state the workspace opens on. */
export function ChatTranscript({ children, emptyTitle, emptyDescription, isEmpty = false, style }) {
  if (isEmpty) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "26px 20px", textAlign: "center", ...style }}>
        <span style={{ width: 46, height: 46, borderRadius: 23, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)" }}>
          <PhosphorIcon name="message" size="navigation" color="var(--mb-color-text-secondary)" />
        </span>
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, color: "var(--mb-color-text)" }}>{emptyTitle}</span>
        <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "21px", color: "var(--mb-color-text-secondary)", maxWidth: 360 }}>{emptyDescription}</span>
      </div>
    );
  }
  return <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", padding: "8px 4px 18px", ...style }}>{children}</div>;
}
