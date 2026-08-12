import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/**
 * Warnings the pipeline raised mid-turn — speech in, speech out, search,
 * council, interruption. One flat row per notice; errors get danger ink and,
 * for speech output, in-place recovery actions.
 */
export function PipelineNotices({ notices = [], style }) {
  if (!notices.length) return null;
  return (
    <div style={{ marginTop: 12, marginLeft: -12, marginRight: -12, ...style }}>
      {notices.map((notice, index) => {
        const danger = notice.level === "error";
        const ink = danger ? "var(--mb-color-danger)" : "var(--mb-color-accent)";
        return (
          <div key={notice.stageLabel + notice.message + index}
            style={{ display: "flex", gap: 10, padding: "10px 12px", borderTop: "1px solid " + (danger ? "var(--mb-color-danger)" : "var(--mb-color-border)") }}>
            <span style={{ flexShrink: 0, paddingTop: 1 }}>
              <PhosphorIcon name={danger ? "warning" : "info-circle"} size="inline" color={ink} />
            </span>
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 11, letterSpacing: "0.5px", textTransform: "uppercase", color: danger ? "var(--mb-color-danger)" : "var(--mb-color-text)" }}>{notice.stageLabel}</span>
              <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" }}>{notice.message}</span>
              {notice.detail ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 11, lineHeight: "15px", color: "var(--mb-color-text-muted)" }}>{notice.detail}</span> : null}
              {notice.actions && notice.actions.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {notice.actions.map((action) => {
                    const primary = action.tone !== "quiet";
                    return (
                      <button key={action.label} type="button" aria-label={action.label} onClick={action.onPress}
                        style={{ minHeight: 44, display: "flex", alignItems: "center", gap: 6, padding: "0 12px", cursor: "pointer",
                          borderRadius: "var(--mb-radius-control)",
                          border: "1px solid " + (primary ? "var(--mb-color-accent)" : "var(--mb-color-border)"),
                          background: primary ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)" }}>
                        {action.icon ? <PhosphorIcon name={action.icon} size="compact" color={primary ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)"} /> : null}
                        <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, color: primary ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)" }}>{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
