import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/** A horizontal strip of approved prompt images. 128×96, or 88×66 when compact. */
export function MessageImageAttachments({ attachments = [], onRemove, compact = false }) {
  if (!attachments.length) return null;
  return (
    <div role="list" style={{ display: "flex", gap: 8, padding: "4px 0", overflowX: "auto" }}>
      {attachments.map((attachment, index) => (
        <div key={attachment.id} style={{ position: "relative", flexShrink: 0 }}>
          <img
            alt={"Attached image " + (index + 1) + " of " + attachments.length}
            src={attachment.uri}
            style={{ width: compact ? 88 : 128, height: compact ? 66 : 96, objectFit: "cover", borderRadius: "var(--mb-radius-icon-button)", border: "1px solid var(--mb-color-border)", display: "block" }}
          />
          {onRemove ? (
            <button type="button" aria-label={"Remove image " + (index + 1)} onClick={() => onRemove(attachment.id)}
              style={{ position: "absolute", right: 0, top: 0, width: 44, height: 44, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 0 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "var(--mb-color-overlay)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhosphorIcon name="close" size="compact" color="var(--mb-color-surface)" />
              </span>
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
