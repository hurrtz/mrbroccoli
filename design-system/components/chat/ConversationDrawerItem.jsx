import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/** One conversation row in the drawer — flat model: forks are first-class rows marked by a tappable root tag. */
export function ConversationDrawerItem({ title, models = [], messageCount, updatedAt, forkOf, active = false, pinned = false, isPrivate = false, onSelect, onOpenActions, onOpenRoot, assetBase = "assets/providers" }) {
  return (
    <div style={{ position: "relative", borderBottom: "1px solid var(--mb-color-border)", background: active ? "var(--mb-color-surface-alt)" : "transparent" }}>
      <div role="button" onClick={onSelect} style={{ display: "flex", alignItems: "flex-start", padding: "10px 4px 10px 18px", cursor: "pointer" }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4, paddingTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            {pinned ? <PhosphorIcon name="pushpin" size="inline" color="var(--mb-color-accent)" /> : null}
            {isPrivate ? <PhosphorIcon name="lock" size="inline" color="var(--mb-color-text-secondary)" /> : null}
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 8, rowGap: 4 }}>
            <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "18px", color: "var(--mb-color-text-muted)" }}>{updatedAt} · {messageCount} messages{models.length ? " ·" : ""}</span>
            {models.length ? (
              <span style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap", columnGap: 6, rowGap: 4 }}>
                {models.map((model, index) => <ProviderIcon key={index} provider={model.provider} size="inline" color="var(--mb-color-text-secondary)" assetBase={assetBase} />)}
              </span>
            ) : null}
          </div>
          {forkOf ? (
            <span role="button" aria-label={"Go to root session: " + forkOf} onClick={(e) => { e.stopPropagation(); if (onOpenRoot) onOpenRoot(); }}
              style={{ display: "inline-flex", alignItems: "center", alignSelf: "flex-start", maxWidth: "100%", minWidth: 0, minHeight: 44, margin: "-4px 0", padding: "6px 0", cursor: "pointer" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, minWidth: 0, minHeight: 32, padding: "5px 10px 5px 13px", borderRadius: 99, border: "1px solid var(--mb-color-border-strong)", background: "var(--mb-color-surface-raised)" }}>
                <span style={{ fontSize: 13, lineHeight: "16px", fontWeight: 500, color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{forkOf}</span>
                <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-secondary)" />
              </span>
            </span>
          ) : null}
        </div>
        <button type="button" aria-label="Conversation actions" onClick={(e) => { e.stopPropagation(); if (onOpenActions) onOpenActions(); }} style={{ width: 44, height: 44, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhosphorIcon name="ellipsis-vertical" size="compact" color="var(--mb-color-text-secondary)" />
        </button>
      </div>
    </div>
  );
}
