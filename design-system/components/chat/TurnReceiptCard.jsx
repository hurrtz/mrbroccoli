import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * What the turn actually did, as a disclosure under the reply. Collapsed it is
 * one quiet line; expanded it is label/value rows. Rail style: a hairline
 * section of the message row, never a box inside the box.
 */
export function TurnReceiptCard({ title = "Turn receipt", summary, rows = [], defaultExpanded = false, style }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  return (
    <section style={{ marginTop: 12, marginLeft: -12, marginRight: -12, padding: "0 12px", borderTop: "1px solid var(--mb-color-border)", ...style }}>
      <div role="button" tabIndex={0} aria-expanded={expanded} aria-label={(expanded ? "Collapse " : "Expand ") + title.toLowerCase()}
        onClick={() => setExpanded((current) => !current)}
        style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <PhosphorIcon name="line-chart" size="inline" color="var(--mb-color-accent)" />
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{title}</span>
        {summary ? <span style={{ flexShrink: 0, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.3px", color: "var(--mb-color-text-muted)" }}>{summary}</span> : null}
        <PhosphorIcon name={expanded ? "up" : "down"} size="compact" color="var(--mb-color-text-secondary)" />
      </div>
      {expanded ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 12 }}>
          {rows.map((row) => (
            <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
              <span style={{ flexShrink: 0, width: 78, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{row.label}</span>
              <span style={{ flex: 1, minWidth: 0, overflowWrap: "break-word",
                fontFamily: row.mono ? "var(--mb-font-mono)" : "var(--mb-text-body-family)",
                fontSize: row.mono ? 11 : 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
