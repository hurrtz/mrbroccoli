import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { ProviderIcon } from "../brand/ProviderIcon";

/**
 * One message row. The rail on the outer edge — accent on the user's side,
 * strong border on the assistant's — is what tells the two apart, not a bubble.
 */
export function ChatBubble({ role, text, model, provider, timestamp, edited = false, actions, children, assetBase = "assets/providers" }) {
  const isUser = role === "user";
  return (
    <article
      style={{
        width: "100%", marginBottom: 8, padding: "14px 12px", overflow: "hidden", flexShrink: 0,
        borderRadius: "var(--mb-radius-chip)",
        background: isUser ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)",
        border: "1px solid " + (isUser ? "var(--mb-color-border-strong)" : "var(--mb-color-border)"),
        borderRightWidth: isUser ? "var(--mb-message-rail-width)" : undefined,
        borderRightColor: isUser ? "var(--mb-color-accent)" : undefined,
        borderLeftWidth: isUser ? undefined : "var(--mb-message-rail-width)",
        borderLeftColor: isUser ? undefined : "var(--mb-color-border-strong)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        {isUser ? (
          <>
            <span style={timestampStyle}>{edited ? timestamp + " · edited" : timestamp}</span>
            <span style={roleStyle}>YOU</span>
          </>
        ) : (
          <>
            <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
              {provider ? <ProviderIcon provider={provider} size="compact" color="var(--mb-color-accent)" assetBase={assetBase} /> : null}
              {model ? <span style={{ flexShrink: 1, fontFamily: "var(--mb-text-body-family)", fontSize: 11, color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{model}</span> : <span style={roleStyle}>ASSISTANT</span>}
            </span>
            <span style={timestampStyle}>{timestamp}</span>
          </>
        )}
      </div>
      <div style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "22px", color: "var(--mb-color-text)", whiteSpace: "pre-wrap" }}>{text}</div>
      {children}
      {actions && actions.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 4, marginTop: 14, marginLeft: -12, marginRight: -12, marginBottom: -14, padding: "6px 10px", borderTop: "1px solid var(--mb-color-border)" }}>
          {actions.map((action) => (
            <button key={action.icon + action.label} type="button" aria-label={action.label} onClick={action.onPress}
              style={{ minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", gap: 6, padding: action.label ? "0 10px" : 0, borderRadius: "var(--mb-radius-control)", border: "none", background: "none", cursor: "pointer" }}>
              <PhosphorIcon name={action.icon} size="compact" color="var(--mb-color-text-secondary)" />
              {action.showLabel ? <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>{action.label}</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

const timestampStyle = { flexShrink: 0, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: "0.2px", color: "var(--mb-color-text-muted)" };
const roleStyle = { fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 10, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--mb-color-accent)" };
