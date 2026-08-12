import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";
import { Modal } from "../overlays/Modal";

/**
 * The sheet the route byline opens: every configured route, cheapest first.
 * Picking one switches who answers the next turn and closes the sheet.
 */
export function RoutePicker({ visible, onClose, routes = [], selected, onSelect, title = "Answer the next turn with", assetBase }) {
  return (
    <Modal inline visible={visible} onClose={onClose} layout="sheet" title={title}
      footer={[{ text: "Done", onPress: onClose }]}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="radiogroup" aria-label={title}>
        {routes.map((route) => {
          const active = route.id === selected;
          return (
            <div key={route.id} role="radio" aria-checked={active}
              aria-label={route.providerLabel + ". " + route.modelLabel + ". " + (route.effortLabel || "")}
              onClick={() => { if (onSelect) onSelect(route.id); if (onClose) onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, padding: "10px 12px", cursor: "pointer",
                borderRadius: "var(--mb-radius-panel)",
                border: "1px solid " + (active ? "var(--mb-color-border-strong)" : "var(--mb-color-border)"),
                background: active ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)" }}>
              {route.local
                ? <PhosphorIcon name="cpu" size="feature" color="var(--mb-color-text)" />
                : <ProviderIcon provider={route.provider} label={route.providerLabel} size="feature" color="var(--mb-color-text)" assetBase={assetBase} />}
              <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 10, lineHeight: "13px", fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--mb-color-text-secondary)" }}>{route.providerLabel}</span>
                <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{route.modelLabel}</span>
                {route.effortLabel ? <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)" }}>{route.effortLabel}</span> : null}
              </span>
              {active ? <PhosphorIcon name="check" size="control" color="var(--mb-color-accent)" /> : null}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
