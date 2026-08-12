import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * The sources a searching turn used: a disclosure with the query, the search
 * summary, and one chip per source. Same rail-style section as TurnReceiptCard.
 */
export function WebSearchReferences({ title = "Web search", countLabel, query, summary, sources = [], onOpenSource, defaultExpanded = false, style }) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const heading = { fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.7px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" };
  return (
    <section style={{ marginTop: 12, marginLeft: -12, marginRight: -12, padding: "0 12px", borderTop: "1px solid var(--mb-color-border)", ...style }}>
      <div role="button" tabIndex={0} aria-expanded={expanded} aria-label={(expanded ? "Collapse " : "Expand ") + "web search details"}
        onClick={() => setExpanded((current) => !current)}
        style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <PhosphorIcon name="global" size="inline" color="var(--mb-color-accent)" />
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{title}</span>
        {countLabel ? <span style={{ flexShrink: 0, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.3px", color: "var(--mb-color-text-muted)" }}>{countLabel}</span> : null}
        <PhosphorIcon name={expanded ? "up" : "down"} size="compact" color="var(--mb-color-text-secondary)" />
      </div>
      {expanded ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 12 }}>
          {query ? <span style={heading}>Search query</span> : null}
          {query ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text)" }}>{query}</span> : null}
          {summary ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{summary}</span> : null}
          {sources.length ? <span style={{ ...heading, marginTop: 4 }}>Sources</span> : null}
          {sources.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {sources.map((source) => (
                <span key={source.url || source.title} role="link" tabIndex={0} aria-label={"Open source: " + source.title}
                  onClick={onOpenSource ? () => onOpenSource(source) : undefined}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", minHeight: 30, padding: "0 10px",
                    margin: "7px 0", boxSizing: "border-box", cursor: "pointer", borderRadius: "var(--mb-radius-tag)",
                    border: "1px solid var(--mb-color-border)", background: "var(--mb-color-background)" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--mb-text-body-family)", fontSize: 12, color: "var(--mb-color-text)" }}>{source.title}</span>
                  <PhosphorIcon name="export" size="inline" color="var(--mb-color-text-secondary)" />
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
