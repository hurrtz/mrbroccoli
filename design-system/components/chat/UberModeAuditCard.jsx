import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * Model Council's audit: who was called, who challenged, what the synthesis
 * kept. A disclosure in the same rail-style section as TurnReceiptCard.
 */
export function UberModeAuditCard({ title = "Model Council", summary, outcome, details = [], routesLabel = "Routes", routes = [], defaultExpanded = false, style }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  return (
    <section style={{ marginTop: 12, marginLeft: -12, marginRight: -12, padding: "0 12px", borderTop: "1px solid var(--mb-color-border)", ...style }}>
      <div role="button" tabIndex={0} aria-expanded={expanded} aria-label={(expanded ? "Collapse " : "Expand ") + title + " audit"}
        onClick={() => setExpanded((current) => !current)}
        style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <PhosphorIcon name="council" size="inline" color="var(--mb-color-accent)" />
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{title}</span>
          {summary ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "15px", color: "var(--mb-color-text-muted)" }}>{summary}</span> : null}
        </span>
        <PhosphorIcon name={expanded ? "up" : "down"} size="compact" color="var(--mb-color-text-secondary)" />
      </div>
      {expanded ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 7, paddingBottom: 12 }}>
          {outcome ? <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{outcome}</span> : null}
          {details.map((detail) => (
            <span key={detail} style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{detail}</span>
          ))}
          {routes.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 3 }}>
              <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{routesLabel}</span>
              {routes.map((route) => (
                <span key={route} style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{route}</span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
