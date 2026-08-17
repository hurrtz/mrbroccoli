import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";
import { Modal } from "../overlays/Modal";

/**
 * One transcript row, spoken-script style: margin speaker with a thread line, no boxes.
 * Collapsed messages clamp to three lines; the fold chevron sits on the name line.
 * The action row is always present. The meta line is a 44pt target ending in an
 * info mark: it opens the turn receipt as a modal, never as an inline panel.
 */
export function TranscriptMessage({ role, paragraphs = [], model, provider, council, time, edited = false, last = false, expanded, onToggle, meta, metrics, metricsOpen, onOpenMetrics, onCloseMetrics, metricsTitle = "Turn receipt", metricsDoneLabel = "Done", metricsInline = false, actions, assetBase = "assets/providers" }) {
  const [overflows, setOverflows] = React.useState(false);
  const clampRef = React.useRef(null);
  React.useEffect(() => { const el = clampRef.current; if (el) setOverflows(el.scrollHeight > el.clientHeight + 1); }, []);
  const isUser = role === "user";
  const canFold = paragraphs.length > 1 || overflows;
  const hasMetrics = !!(metrics && metrics.length);
  const mono = { fontFamily: "var(--mb-font-mono)", fontSize: 10, lineHeight: "15px", letterSpacing: ".4px", color: "var(--mb-color-text-muted)" };
  const bodyStyle = { fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: isUser ? "var(--mb-color-text-secondary)" : "var(--mb-color-text)", fontStyle: isUser ? "italic" : "normal" };
  return (
    <div style={{ display: "flex", gap: 12, padding: "12px 0" }}>
      <div style={{ width: 34, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2 }} aria-hidden="true">
        {isUser
          ? <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 9, lineHeight: "14px", letterSpacing: ".6px", color: "var(--mb-color-accent)" }}>YOU</span>
          : <ProviderIcon provider={provider} size="compact" color="var(--mb-color-text-secondary)" assetBase={assetBase} />}
        <span style={{ width: 1.5, flex: 1, background: last ? "transparent" : "var(--mb-color-border)" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div role={canFold ? "button" : undefined} aria-expanded={canFold ? (expanded ? "true" : "false") : undefined} onClick={canFold ? onToggle : undefined} style={{ cursor: canFold ? "pointer" : "default" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, minHeight: 18, marginBottom: 2 }}>
            {!isUser ? (council
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, alignSelf: "center" }}>
                  <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>Council of</span>
                  {council.map((p, index) => <ProviderIcon key={index} provider={p} size="inline" color="var(--mb-color-text-secondary)" assetBase={assetBase} />)}
                </span>
              : <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>{model}</span>) : null}
            <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10, lineHeight: "16px", flexShrink: 0, color: "var(--mb-color-text-muted)" }}>{edited && time ? time + " · edited" : time}</span>
            {canFold ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", alignSelf: "center" }}><PhosphorIcon name={expanded ? "up" : "down"} size="inline" color="var(--mb-color-text-muted)" /></span> : null}
          </div>
          {expanded
            ? paragraphs.map((p, index) => <p key={index} style={{ margin: index ? "8px 0 0" : 0, ...bodyStyle }}>{p}</p>)
            : <div ref={clampRef} style={{ ...bodyStyle, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{paragraphs.join(" ")}</div>}
        </div>
        {meta && (expanded || !canFold) ? (
          <div role={hasMetrics ? "button" : undefined} onClick={hasMetrics ? onOpenMetrics : undefined}
            style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, marginBottom: -5, minHeight: 44, cursor: hasMetrics ? "pointer" : "default" }}>
            <span style={mono}>{meta}</span>
            {hasMetrics ? <PhosphorIcon name="info-circle" size="inline" color="var(--mb-color-text-muted)" /> : null}
          </div>
        ) : null}
        {actions && actions.length ? (
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: -6, marginLeft: -12 }}>
            {actions.map((action) => (
              <button key={action.icon + action.label} type="button" aria-label={action.label} onClick={action.onPress}
                style={{ width: 44, height: 44, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhosphorIcon name={action.icon} size="compact" color="var(--mb-color-text-muted)" />
              </button>
            ))}
          </div>
        ) : null}
        <Modal visible={!!metricsOpen && hasMetrics} title={metricsTitle} inline={metricsInline} onClose={onCloseMetrics}
          footer={[{ text: metricsDoneLabel, onPress: onCloseMetrics }]}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 8, maxHeight: "60vh", overflowY: "auto" }}>
            {(metrics || []).map((row, index) => (
              <div key={row.label + index} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ ...mono, flexShrink: 0, width: 76, textTransform: "uppercase", letterSpacing: ".6px" }}>{row.label}</span>
                <span style={{ flex: 1, fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </div>
  );
}
