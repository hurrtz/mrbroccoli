import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/** One conversation row in the drawer. The active row carries a 3pt accent rail. */
export function ConversationDrawerItem({ title, providers = [], models = [], messageCount, updatedAt, active = false, pinned = false, isPrivate = false, hasBranches = false, expanded = false, depth = 0, onSelect, onOpenActions, onToggleBranches, assetBase = "assets/providers" }) {
  return (
    <div style={{ position: "relative", borderBottom: "1px solid var(--mb-color-border)", overflow: "hidden", background: active ? "var(--mb-color-surface-alt)" : "transparent" }}>
      {active ? <div style={{ position: "absolute", top: 12, bottom: 12, left: 0, width: 3, borderRadius: 2, background: "var(--mb-color-accent)" }} /> : null}
      <button type="button" aria-label="Conversation actions" onClick={onOpenActions} style={{ position: "absolute", top: 9, right: 14, width: 44, height: 44, background: "none", border: "none", cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PhosphorIcon name="ellipsis-vertical" size="compact" color="var(--mb-color-text-secondary)" />
      </button>
      {hasBranches ? (
        <button type="button" aria-label="Branches" aria-expanded={expanded} onClick={onToggleBranches} style={{ position: "absolute", top: 8, right: 46, width: 44, height: 44, background: "none", border: "none", cursor: "pointer", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PhosphorIcon name={expanded ? "up" : "down"} size="compact" color="var(--mb-color-text-secondary)" />
        </button>
      ) : null}
      <div
        role="button"
        onClick={onSelect}
        style={{ padding: "15px 18px", paddingLeft: Math.min(depth, 4) * 14 + 22, paddingRight: hasBranches ? 96 : 54, cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          {pinned ? <PhosphorIcon name="pushpin" size="inline" color="var(--mb-color-accent)" /> : null}
          {isPrivate ? <PhosphorIcon name="lock" size="inline" color="var(--mb-color-text-secondary)" /> : null}
          <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 16, color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {providers.map((provider, index) => (
            <div key={provider} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ProviderIcon provider={provider} size="compact" color="var(--mb-color-text-secondary)" assetBase={assetBase} />
              <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{models[index]}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <PhosphorIcon name="message" size="inline" color="var(--mb-color-text-muted)" />
              <span style={footerTextStyle}>{messageCount}</span>
            </span>
            <span style={{ width: 3, height: 3, borderRadius: 2, background: "var(--mb-color-text-muted)" }} />
            <span style={footerTextStyle}>{updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const footerTextStyle = { fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "16px", color: "var(--mb-color-text-muted)" };
