import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

const THUMB = 64;

/**
 * The image attachments of the next question, anchored to the Image satellite
 * that holds them. `AnchoredMenu`'s geometry — 252 wide, panel radius, elevated
 * surface, a 6pt band before the action row, a transparent click-away and no
 * backdrop dim — with a horizontally scrolling row of thumbs in place of menu
 * rows, or one line of copy when nothing is attached.
 *
 * Position it yourself through `style` (the workspace hangs it 10pt above the
 * row, left edge aligned to the satellite). Its height never changes with the
 * count: forty images scroll sideways.
 *
 * It closes itself when the picker returns with images — the one popup in the
 * system that dismisses on a result rather than a tap.
 */
export function AttachmentPopover({
  visible = true,
  attachments = [],
  onRemove,
  onAdd,
  emptyLabel = "No images in this conversation yet.",
  addLabel = "Add images",
  onClose,
  width = 252,
  inline = true,
  style,
}) {
  if (!visible) return null;
  return (
    <div style={{ position: inline ? "absolute" : "fixed", inset: 0, zIndex: 40 }}>
      <div aria-hidden="true" onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", width, borderRadius: "var(--mb-radius-panel)", overflow: "hidden",
        border: "1px solid var(--mb-color-surface-raised-border)", background: "var(--mb-color-surface-elevated)",
        boxShadow: "0 12px 34px rgba(0,0,0,.28)", ...style,
      }}>
        {attachments.length ? (
          <div role="list" style={{ display: "flex", gap: 8, padding: 12, overflowX: "auto" }}>
            {attachments.map((attachment, index) => (
              <div key={attachment.id || index} role="listitem" style={{ position: "relative", width: THUMB, height: THUMB, flexShrink: 0 }}>
                {attachment.uri ? (
                  <img alt={"Image " + (index + 1) + " of " + attachments.length} src={attachment.uri}
                    style={{ width: THUMB, height: THUMB, objectFit: "cover", display: "block", borderRadius: 10, border: "1px solid var(--mb-color-border)" }} />
                ) : (
                  <div style={{ width: THUMB, height: THUMB, borderRadius: 10, border: "1px solid var(--mb-color-border)", background: "color-mix(in srgb, var(--mb-color-text-muted) 12%, var(--mb-color-surface))" }} />
                )}
                <button type="button" aria-label={"Remove image " + (index + 1)}
                  onClick={() => onRemove && onRemove(attachment.id, index)}
                  style={{ position: "absolute", right: -10, top: -10, width: 44, height: 44, padding: 0, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ width: 22, height: 22, borderRadius: "var(--mb-radius-chip)", background: "var(--mb-color-overlay)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhosphorIcon name="close" size="inline" color="var(--mb-color-surface)" style={{ fontSize: 11, width: 11, height: 11 }} />
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "14px 14px 12px" }}>
            <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 14, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{emptyLabel}</span>
          </div>
        )}
        <div aria-hidden="true" style={{ height: 6, background: "var(--mb-color-border)", opacity: .55 }} />
        <button type="button" onClick={onAdd}
          style={{ minHeight: 44, width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
          <PhosphorIcon name="plus" size="compact" color="var(--mb-color-accent)" />
          <span style={{ flex: 1, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-accent)" }}>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}
