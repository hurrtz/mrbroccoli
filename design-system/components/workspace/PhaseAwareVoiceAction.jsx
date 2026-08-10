import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

const PHASE_ICON = {
  recording: "stop", transcribing: "file-text", "thinking-briefly": "thunderbolt", searching: "global",
  thinking: "robot", synthesizing: "customer-service", speaking: "pause", idle: "audio",
};

const PHASE_TOKEN = {
  recording: "--mb-color-phase-recording-track", transcribing: "--mb-color-phase-transcribing",
  "thinking-briefly": "--mb-color-phase-thinking-briefly", searching: "--mb-color-phase-searching",
  thinking: "--mb-color-phase-thinking", synthesizing: "--mb-color-phase-synthesizing",
  speaking: "--mb-color-phase-speaking", idle: "--mb-color-bubble-user",
};

function luminance(hex) {
  const channels = hex.replace("#", "").match(/.{2}/g);
  if (!channels || channels.length !== 3) return 0;
  const [r, g, b] = channels.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function contrast(a, b) {
  const high = Math.max(luminance(a), luminance(b));
  const low = Math.min(luminance(a), luminance(b));
  return (high + 0.05) / (low + 0.05);
}

/** Picks the phase foreground the same way the app does — by measured contrast. */
export function getAccessibleForeground(background) {
  return contrast(background, "#030712") > contrast(background, "#FFFFFF") ? "#030712" : "#FFFFFF";
}

/**
 * The one loud element on the screen. A full-width 68pt bar that takes the
 * colour of the current voice phase, so progress is legible without reading.
 */
export function PhaseAwareVoiceAction({ visualPhase = "idle", prompt, title, detail, recordingProgress = 0, playbackPaused = false, onPress, style }) {
  const ref = React.useRef(null);
  const [phaseColor, setPhaseColor] = React.useState("#44A055");
  React.useEffect(() => {
    if (!ref.current) return;
    const resolved = getComputedStyle(ref.current).getPropertyValue(PHASE_TOKEN[visualPhase] || PHASE_TOKEN.idle).trim();
    if (resolved) setPhaseColor(resolved);
  }, [visualPhase]);
  const foreground = getAccessibleForeground(phaseColor);
  const icon = visualPhase === "speaking" && playbackPaused ? "play-circle" : PHASE_ICON[visualPhase] || "audio";
  return (
    <div
      ref={ref}
      role="button"
      aria-label={[title, prompt].filter(Boolean).join(". ")}
      onClick={onPress}
      style={{
        position: "relative", width: "100%", minHeight: "var(--mb-voice-stage-min-height)",
        borderRadius: "var(--mb-radius-voice-stage)", overflow: "hidden", cursor: "pointer",
        background: phaseColor, display: "flex", alignItems: "center", justifyContent: "space-between",
        containerType: "inline-size",
        transition: "background var(--mb-duration-phase) ease", ...style,
      }}
    >
      {visualPhase === "recording" ? (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: Math.min(100, recordingProgress * 100) + "%", background: "var(--mb-color-phase-recording)" }} />
      ) : null}
      <div style={{ position: "relative", width: "34%", padding: "0 8px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mb-text-body-family)", fontSize: "clamp(11px, 3.4cqw, 13px)", lineHeight: "16px", color: foreground, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prompt}</div>
      </div>
      <div style={{
        position: "relative", width: 42, height: 42, borderRadius: 21, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", background: foreground,
      }}>
        <PhosphorIcon name={icon} size="control" color={phaseColor} />
      </div>
      <div style={{ position: "relative", width: "34%", padding: "0 8px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mb-text-body-family)", fontWeight: 600, fontSize: "clamp(11px, 3.7cqw, 14px)", lineHeight: "17px", color: foreground, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        {detail ? <div style={{ fontFamily: "var(--mb-text-body-family)", fontSize: "clamp(9px, 2.9cqw, 11px)", lineHeight: "14px", color: foreground, opacity: 0.84, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{detail}</div> : null}
      </div>
    </div>
  );
}
