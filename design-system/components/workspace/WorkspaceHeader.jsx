import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/**
 * The workspace's header: who answers the next turn, and what this conversation
 * is set to — one raised block of two 44pt rows with a hairline between them.
 *
 * One object, two targets. The containment is deliberate (owner call, 2026-08,
 * reversing the earlier "no contained control above the stage" line): the rows
 * have to read as pressable, and the block gives the model — the most
 * consequential choice on the screen — a mark at proper size and room for its
 * effort word. It stays on the quiet surface fill with a hairline, never an
 * accent fill, so it reads pressable rather than loud: the orb is still the
 * screen's only loud element.
 *
 * It sits 14pt below the top bar. The two rows are deliberately unequal in
 * content but equal in silhouette — the model row leads because it changes the
 * answer; the settings row states the conversation and opens the sheet.
 */
export function WorkspaceHeader({
  provider,
  providerLabel,
  modelName,
  effort,
  local = false,
  switchable = true,
  assetBase,
  onSwitchRoute,
  summary,
  onOpenSettings,
  style,
}) {
  const row = { display: "flex", alignItems: "center", gap: 10, minHeight: 44, padding: "0 12px", background: "transparent", border: "none", width: "100%", textAlign: "left" };
  return (
    <div style={{
      background: "var(--mb-color-surface)", border: "1px solid var(--mb-color-border)",
      borderRadius: "var(--mb-radius-card)", overflow: "hidden", ...style,
    }}>
      <button type="button" onClick={switchable ? onSwitchRoute : undefined}
        aria-label={"Answering model: " + modelName + (effort ? ", " + effort : "")}
        style={{ ...row, cursor: switchable ? "pointer" : "default" }}>
        {local
          ? <PhosphorIcon name="cpu" size="control" color="var(--mb-color-text)" />
          : <ProviderIcon provider={provider} label={providerLabel} size="control" color="var(--mb-color-text)" assetBase={assetBase} />}
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{modelName}</span>
        {effort ? <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 9, letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-secondary)", flexShrink: 0 }}>{effort}</span> : null}
        <span style={{ flex: 1 }} />
        {switchable ? <PhosphorIcon name="down" size="compact" color="var(--mb-color-text-muted)" /> : null}
      </button>
      <div aria-hidden="true" style={{ height: 1, background: "var(--mb-color-border)", margin: "0 12px" }} />
      <button type="button" onClick={onOpenSettings} aria-label={"Conversation settings. " + (summary || "")}
        style={{ ...row, cursor: "pointer" }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body)", fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summary}</span>
        <PhosphorIcon name="control" size="compact" color="var(--mb-color-text-muted)" />
      </button>
    </div>
  );
}
