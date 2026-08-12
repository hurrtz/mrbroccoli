import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * A failed turn, on the user's own message: what failed, why, and the way to
 * retry. The one message section that leads with danger.
 */
export function ReplyFailureCard({ title = "Reply failed", message, hint, retryLabel = "Retry", onRetry, style }) {
  return (
    <section style={{ marginTop: 12, marginLeft: -12, marginRight: -12, padding: "10px 12px 12px", borderTop: "1px solid var(--mb-color-danger)", display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <PhosphorIcon name="exclamation-circle" size="inline" color="var(--mb-color-danger)" />
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-danger)" }}>{title}</span>
      </span>
      {message ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{message}</span> : null}
      {hint ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)" }}>{hint}</span> : null}
      {onRetry ? (
        <button type="button" aria-label={retryLabel} onClick={onRetry}
          style={{ alignSelf: "flex-start", minHeight: 44, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", marginTop: 2, cursor: "pointer",
            borderRadius: "var(--mb-radius-control)", border: "1px solid var(--mb-color-border-strong)", background: "var(--mb-color-accent-soft)" }}>
          <PhosphorIcon name="reload" size="inline" color="var(--mb-color-accent)" />
          <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 13, color: "var(--mb-color-accent)" }}>{retryLabel}</span>
        </button>
      ) : null}
    </section>
  );
}
