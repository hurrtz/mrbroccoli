import React from "react";
import { IconButton } from "../core/IconButton";

const PHASE_TOKEN = {
  idle: "--mb-color-accent",
  recording: "--mb-color-phase-recording-track",
  transcribing: "--mb-color-phase-transcribing",
  "thinking-briefly": "--mb-color-phase-thinking-briefly",
  searching: "--mb-color-phase-searching",
  thinking: "--mb-color-phase-thinking",
  synthesizing: "--mb-color-phase-synthesizing",
  speaking: "--mb-color-phase-speaking",
};

/**
 * The line under the orb: a phase dot, what is happening, and what the
 * conversation is. The detail line carries the conversation name and its age
 * at rest, and the instruction for the current phase while a turn runs.
 */
export function WorkspaceStatusLine({ title, detail, phase = "idle", onInfo, style }) {
  const dot = "var(" + (PHASE_TOKEN[phase] || PHASE_TOKEN.idle) + ")";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 44, ...style }}>
      <span style={{ width: 8, height: 8, borderRadius: 4, background: dot, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <span style={{
          fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 16, lineHeight: "21px",
          color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{title}</span>
        {detail ? (
          <span style={{
            fontFamily: "var(--mb-font-mono)", fontSize: 11, lineHeight: "16px", color: "var(--mb-color-text-muted)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{detail}</span>
        ) : null}
      </span>
      {onInfo ? <IconButton icon="info-circle" accessibilityLabel="Session details" onPress={onInfo} /> : null}
    </div>
  );
}
