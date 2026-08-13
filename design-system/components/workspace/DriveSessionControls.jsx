import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * The drive-session controls above the composer: Repeat last + one
 * fixed-position Pause/Resume toggle whose accent fill means the hands-free
 * loop is live. A deliberate improvement over the upstream three-button row
 * (pause and resume as a pair with one always disabled): the toggle keeps one
 * position for muscle memory, and the freed width pays for legible labels and
 * an on-screen home for the silence countdown, which upstream only spoke.
 */
export function DriveSessionControls({
  running = true,
  canRepeat = false,
  disabled = false,
  countdownSeconds = null,
  countdownText,
  repeatLabel = "Repeat last",
  pauseLabel = "Pause auto",
  resumeLabel = "Resume auto",
  onToggle,
  onRepeat,
  style,
}) {
  const repeatDisabled = disabled || !canRepeat;
  const counting = running && countdownSeconds != null;
  const base = { flex: 1, minHeight: 48, borderRadius: "var(--mb-radius-card)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "6px 10px", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-elevated)" };
  const label = { fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text)" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 6, ...style }}>
      {counting ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span role="status" style={{ padding: "4px 11px", borderRadius: 99, fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: ".4px", color: "var(--mb-color-text)", background: "var(--mb-color-accent-soft)" }}>
            {countdownText || ("Sends in " + countdownSeconds + "\u2026")}
          </span>
        </div>
      ) : null}
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" aria-label={repeatLabel} disabled={repeatDisabled} onClick={() => onRepeat && onRepeat()}
          style={{ ...base, opacity: repeatDisabled ? .45 : 1, cursor: repeatDisabled ? "default" : "pointer" }}>
          <PhosphorIcon name="redo" size="compact" color="var(--mb-color-text)" />
          <span style={label}>{repeatLabel}</span>
        </button>
        <button type="button" aria-pressed={running ? "true" : "false"} aria-label={running ? pauseLabel : resumeLabel} disabled={disabled} onClick={() => onToggle && onToggle()}
          style={{ ...base, opacity: disabled ? .45 : 1, cursor: disabled ? "default" : "pointer",
            border: "1px solid " + (running ? "var(--mb-color-accent)" : "var(--mb-color-border)"),
            background: running ? "var(--mb-color-accent)" : "var(--mb-color-surface-elevated)" }}>
          <PhosphorIcon name={running ? "pause" : "play"} size="compact" color={running ? "var(--mb-color-on-accent)" : "var(--mb-color-text)"} />
          <span style={{ ...label, color: running ? "var(--mb-color-on-accent)" : "var(--mb-color-text)" }}>{running ? pauseLabel : resumeLabel}</span>
        </button>
      </div>
    </div>
  );
}
