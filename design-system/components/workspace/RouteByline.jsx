import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/**
 * The route byline: who is answering the next turn, and at what effort.
 *
 * Deliberately not a button — no fill, no border, no card — so it cannot be
 * mistaken for the voice stage directly below it. The provider mark carries the
 * prominence; the closing hairline says the whole row is the target, not just
 * the caret.
 */
export function RouteByline({ provider, providerLabel, modelName, effort = "Normal", effortLevels = [], local = false, switchable = true, onPress, assetBase = "assets/providers", style }) {
  const index = effortLevels.indexOf(effort);
  const showDots = effortLevels.length > 1 && index >= 0;
  return (
    <div
      role={switchable ? "button" : undefined}
      aria-label={switchable ? modelName + ". " + effort : undefined}
      onClick={switchable ? onPress : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 12, minHeight: 48, paddingBottom: 8,
        borderBottom: "1px solid var(--mb-color-border)",
        cursor: switchable ? "pointer" : "default", ...style,
      }}
    >
      {local
        ? <PhosphorIcon name="cpu" size="feature" color="var(--mb-color-text)" />
        : <ProviderIcon provider={provider} label={providerLabel} size="feature" color="var(--mb-color-text)" assetBase={assetBase} />}
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{modelName}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)", whiteSpace: "nowrap" }}>{effort}</span>
        {showDots ? (
          <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            {effortLevels.map((level, position) => (
              <span key={level} style={{ width: 5, height: 5, borderRadius: 3, background: position <= index ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)" }} />
            ))}
          </span>
        ) : null}
        {switchable ? (
          <span style={{ width: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PhosphorIcon name="down" size="compact" color="var(--mb-color-text-muted)" />
          </span>
        ) : null}
      </span>
    </div>
  );
}
