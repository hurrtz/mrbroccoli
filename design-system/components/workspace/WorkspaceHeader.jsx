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
 *
 * `running` is the whole block's second life. Neither choice can be changed
 * while a turn is in flight, so the block goes disabled the moment voice is
 * submitted: it keeps its shape, its fill and its hairline exactly — nothing
 * moves, nothing is removed — and drops to disabled strength, which is what
 * says the caret and the settings control are unavailable.
 *
 * `council` then reuses the two rows rather than inventing a progress strip:
 * the answering model above, the count and the round below, both centred, with
 * the effort word, the caret and the settings control gone — none is available
 * or true mid-council. With no controls left to disable, the dimming lifts:
 * these two lines are the only report of a wait that runs for minutes, so they
 * must not be the faintest thing on the screen.
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
  running = false,
  council = false,
  style,
}) {
  const row = { display: "flex", alignItems: "center", gap: 10, minHeight: 44, padding: "0 12px", background: "transparent", border: "none", width: "100%", textAlign: "left" };
  const reporting = running && council;
  if (running && !reporting) row.opacity = "var(--mb-disabled-opacity)";
  if (reporting) { row.justifyContent = "center"; row.textAlign = "center"; }
  const Row = running ? "div" : "button";
  const rowProps = running ? (reporting ? {} : { "aria-disabled": "true" }) : { type: "button" };
  const openRoute = !running && switchable;
  return (
    <div role={running ? "status" : undefined} aria-live={running ? "polite" : undefined} style={{
      background: "var(--mb-color-surface)", border: "1px solid var(--mb-color-border)",
      borderRadius: "var(--mb-radius-card)", overflow: "hidden", ...style,
    }}>
      <Row {...rowProps} onClick={openRoute ? onSwitchRoute : undefined}
        aria-label={running ? undefined : "Answering model: " + modelName + (effort ? ", " + effort : "")}
        style={{ ...row, cursor: openRoute ? "pointer" : "default" }}>
        {local
          ? <PhosphorIcon name="cpu" size="control" color="var(--mb-color-text)" />
          : <ProviderIcon provider={provider} label={providerLabel} size="control" color="var(--mb-color-text)" assetBase={assetBase} />}
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{modelName}</span>
        {effort && !reporting ? <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 9, letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-secondary)", flexShrink: 0 }}>{effort}</span> : null}
        {reporting ? null : <span style={{ flex: 1 }} />}
        {switchable && !reporting ? <PhosphorIcon name="down" size="compact" color="var(--mb-color-text-muted)" /> : null}
      </Row>
      <div aria-hidden="true" style={{ height: 1, background: "var(--mb-color-border)", margin: "0 12px" }} />
      <Row {...rowProps} onClick={running ? undefined : onOpenSettings}
        aria-label={running ? undefined : "Conversation settings. " + (summary || "")}
        style={{ ...row, cursor: running ? "default" : "pointer" }}>
        <span style={{ flex: reporting ? "0 1 auto" : 1, minWidth: 0, fontFamily: "var(--mb-font-body)", fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text-secondary)", textAlign: reporting ? "center" : "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summary}</span>
        {reporting ? null : <PhosphorIcon name="control" size="compact" color="var(--mb-color-text-muted)" />}
      </Row>
    </div>
  );
}
