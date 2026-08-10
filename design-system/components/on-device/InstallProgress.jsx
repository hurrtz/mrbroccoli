import React from "react";

const META = { fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", letterSpacing: "0.2px", color: "var(--mb-color-text-muted)", whiteSpace: "nowrap" };

/**
 * A determinate install bar with both readings the user might want: how far
 * through the queue it is, and how long is left. Neither alone is enough —
 * "step 3 of 5" says nothing about a 900 MB step, and a time estimate alone
 * gives no sense of what is actually happening.
 *
 * The fill runs linear against a real deadline, never eased: an eased progress
 * bar reports a speed the download does not have.
 */
export function InstallProgress({ label, step, stepCount, remaining, fraction = 0, tone = "var(--mb-color-accent)", style }) {
  const clamped = Math.max(0, Math.min(1, fraction));
  const percent = Math.round(clamped * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
        {step ? <span style={META}>{"Step " + step + " of " + stepCount}</span> : null}
      </div>
      <div role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}
        style={{ height: 6, borderRadius: 3, overflow: "hidden", background: "var(--mb-color-surface-alt)", border: "1px solid var(--mb-color-border)" }}>
        <div style={{ height: "100%", width: percent + "%", background: tone, transition: "width 200ms linear" }} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span style={META}>{remaining}</span>
        <span style={META}>{percent + "%"}</span>
      </div>
    </div>
  );
}
