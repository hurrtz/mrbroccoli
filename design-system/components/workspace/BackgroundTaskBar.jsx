import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

const TONE = {
  progress: "var(--mb-color-accent)",
  success: "var(--mb-color-success)",
  danger: "var(--mb-color-danger)",
};

/**
 * A job that outlives the screen it was started on, stated in one row under the
 * top bar.
 *
 * It is a status line that happens to be tappable, not a card and not a banner:
 * a download the user has already agreed to should not compete with the orb for
 * attention, and it should not be dismissible either — the work is still
 * running whether or not the row is there, and hiding it would only cost the
 * user the way back to it.
 *
 * The progress line sits on the bottom edge rather than inside the row, so the
 * reading is legible at a glance from across the room and the text is never
 * pushed around by it.
 */
export function BackgroundTaskBar({
  visible = true,
  icon = "cpu",
  title,
  detail,
  fraction = 0,
  tone = "progress",
  onPress,
  style,
}) {
  if (!visible) return null;
  const ink = TONE[tone] || TONE.progress;
  const percent = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={title + ". " + detail + ". Open on-device AI settings."}
      onClick={onPress}
      style={{
        position: "relative", display: "flex", alignItems: "center", gap: 10,
        minHeight: 46, padding: "0 12px", marginBottom: 8, overflow: "hidden",
        cursor: onPress ? "pointer" : "default",
        borderRadius: "var(--mb-radius-control)",
        border: "1px solid color-mix(in srgb, " + ink + " 30%, transparent)",
        background: tone === "progress" ? "var(--mb-color-accent-soft)" : "color-mix(in srgb, " + ink + " 9%, transparent)",
        ...style,
      }}
    >
      <PhosphorIcon name={icon} size="compact" color={ink} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 13, lineHeight: "18px", color: "var(--mb-color-text)" }}>{title}</span>
        <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-secondary)" }}>{detail}</span>
      </span>
      {onPress ? <PhosphorIcon name="right" size="compact" color="var(--mb-color-text-muted)" /> : null}
      {tone === "progress" ? (
        <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "color-mix(in srgb, " + ink + " 18%, transparent)" }}>
          <span style={{ display: "block", height: "100%", width: percent + "%", background: ink, transition: "width 200ms linear" }} />
        </span>
      ) : null}
    </div>
  );
}
