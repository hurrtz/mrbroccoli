import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/** The home-screen model cards. The selected card is the only filled control on the screen. */
export function ResponseModeToggle({ modes, selected, onSelect, compact = false, detailed = false, assetBase = "assets/providers" }) {
  const single = modes.length === 1;
  return (
    <div style={{ display: "flex", flexDirection: compact ? "column" : "row", gap: compact ? 5 : 6 }}>
      {modes.map((mode) => {
        const active = mode.id === selected;
        const highlighted = active && !single;
        const foreground = highlighted ? "var(--mb-color-on-active-control)" : active ? "var(--mb-color-text)" : "var(--mb-color-text-secondary)";
        const secondary = highlighted ? "var(--mb-color-on-active-control)" : "var(--mb-color-text-secondary)";
        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={active}
            disabled={mode.ready === false || single}
            onClick={() => onSelect && onSelect(mode.id)}
            style={{
              flex: compact ? "0 0 auto" : 1, minWidth: 0, width: compact ? "100%" : undefined,
              minHeight: compact ? 54 : single ? 80 : 82,
              borderRadius: "var(--mb-radius-card)", overflow: "hidden", cursor: "pointer",
              padding: detailed ? "9px 12px" : compact ? "8px 10px" : "9px 9px",
              background: highlighted ? "var(--mb-color-active-control)" : "var(--mb-color-surface-elevated)",
              border: "1px solid " + (highlighted ? "var(--mb-color-active-control)" : "var(--mb-color-inactive-control-border)"),
              opacity: mode.ready === false ? 0.5 : 1,
              display: "flex", alignItems: "center", gap: detailed ? 10 : 6,
              justifyContent: detailed || compact ? "flex-start" : "center",
              flexDirection: detailed || compact ? "row" : "column",
            }}
          >
            {mode.local ? (
              <PhosphorIcon name="cpu" size={detailed ? "feature" : "navigation"} color={highlighted ? "var(--mb-color-on-active-control)" : "var(--mb-color-text-secondary)"} />
            ) : (
              <span style={{ width: detailed ? 40 : 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ProviderIcon provider={mode.provider} label={mode.providerLabel} size={detailed ? "feature" : "navigation"} color={highlighted ? "var(--mb-color-on-active-control)" : "var(--mb-color-text-secondary)"} assetBase={assetBase} />
              </span>
            )}
            <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: detailed || compact ? "flex-start" : "center", gap: 1 }}>
              {detailed ? (
                <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 10, lineHeight: "13px", fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", color: secondary, opacity: highlighted ? 0.82 : 1 }}>{mode.providerLabel}</span>
              ) : null}
              <span style={{ fontFamily: detailed ? "var(--mb-font-display)" : "var(--mb-text-body-family)", fontWeight: detailed ? 600 : 400, fontSize: detailed ? 13 : 12, lineHeight: detailed ? "18px" : "15px", color: foreground, textAlign: detailed || compact ? "left" : "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{mode.modelLabel}</span>
              {detailed && mode.effortLabel ? (
                <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 10, lineHeight: "14px", color: secondary, opacity: highlighted ? 0.82 : 1 }}>{"Effort: " + mode.effortLabel}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
