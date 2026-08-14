import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
/** Near-black or white, whichever measures higher contrast against the phase colour. */
function getAccessibleForeground(background) {
  const hex = String(background || "").trim();
  const parsed = /^#?([0-9a-f]{6})$/i.exec(hex.replace("#", "#"));
  if (!parsed) return "#FFFFFF";
  const value = parseInt(parsed[1], 16);
  const channel = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const luminance = 0.2126 * channel((value >> 16) & 255) + 0.7152 * channel((value >> 8) & 255) + 0.0722 * channel(value & 255);
  return (luminance + 0.05) / 0.05 > 1.05 / (luminance + 0.05) ? "#16181D" : "#FFFFFF";
}

/** Phase to the colour token that phase owns. Recording reads the track, not the wash. */
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

/** The glyph says what tapping does, not what the machine is doing. */
const PHASE_ICON = {
  idle: "mic", recording: "stop", transcribing: "file-text", "thinking-briefly": "thunderbolt",
  searching: "global", thinking: "brain", synthesizing: "customer-service", speaking: "pause",
};

const PHASE_LABEL = {
  idle: "Tap to speak", recording: "Listening. Tap to stop.", transcribing: "Transcribing",
  "thinking-briefly": "Thinking", searching: "Searching the web", thinking: "Thinking",
  synthesizing: "Preparing speech", speaking: "Speaking. Tap to stop.",
};

const BAND = 6;

/**
 * The workspace's one loud element. Anatomy inside out: the disc; a small gap
 * that is only ever a gap — no fill, no meaning, identical in every phase; the
 * inner ring; the outer ring flush against it, no separation between the two.
 *
 * What the rings mean per phase — idle: both faded green, no clocks.
 * Recording: both combine into ONE indicator, how much of the recording window
 * is used before auto-submit. Transcribing through synthesizing: outer = the
 * whole turn against its estimate (neutral, reads as time), inner = the
 * current phase against itself (phase colour). Speaking: both combine again —
 * how much of the response has been read; paragraph jumps move the arc. Past
 * the estimate both rings fill red as the turn runs late.
 */
export function VoiceOrb({
  phase = "idle",
  phaseProgress = 0,
  turnProgress = 0,
  overtime = 0,
  size = 196,
  label,
  onPress,
  style,
}) {
  const ref = React.useRef(null);
  const [ink, setInk] = React.useState("#44A055");
  const token = PHASE_TOKEN[phase] || PHASE_TOKEN.idle;

  React.useEffect(() => {
    if (!ref.current) return;
    const value = getComputedStyle(ref.current).getPropertyValue(token).trim();
    if (value) setInk(value);
  }, [token]);

  const clamp = (n) => Math.max(0, Math.min(1, n || 0));
  const late = clamp(overtime);
  const remaining = Math.round((1 - late) * 360);
  const tint = "color-mix(in srgb, " + ink + " 16%, transparent)";
  const foreground = getAccessibleForeground(ink);
  const combined = phase === "recording" || phase === "speaking";
  const idle = phase === "idle";

  const arc = (progress, arcInk, track) => late > 0
    ? "conic-gradient(" + track + " 0deg " + remaining + "deg, var(--mb-color-danger) " + remaining + "deg 360deg)"
    : "conic-gradient(" + arcInk + " 0deg " + Math.round(clamp(progress) * 360) + "deg, " + track + " " + Math.round(clamp(progress) * 360) + "deg 360deg)";
  const flat = "linear-gradient(" + tint + ", " + tint + ")";
  const phaseArc = arc(phaseProgress, ink, tint);
  /* Combined phases paint the SAME conic on both ring layers; concentric
     conics share a centre, so the two bands read as one 12pt indicator. */
  const outerPaint = idle ? flat : combined ? phaseArc : arc(turnProgress, "var(--mb-color-turn-ink)", "var(--mb-color-turn-track)");
  const innerPaint = idle ? flat : phaseArc;

  const centre = { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", flexShrink: 0 };
  const ringHole = size - BAND * 4;
  // The disc is a proportion of the whole orb, capped so the gap survives at
  // small sizes — the gap is part of the anatomy, never squeezed out.
  const disc = Math.min(Math.floor(size * 0.79), ringHole - 6);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={label || PHASE_LABEL[phase] || PHASE_LABEL.idle}
      onClick={onPress}
      style={{ ...centre, width: size, height: size, cursor: "pointer", background: outerPaint, ...style }}
    >
      <div style={{ ...centre, width: size - BAND * 2, height: size - BAND * 2, backgroundColor: "var(--mb-color-background)", backgroundImage: innerPaint }}>
        {/* The gap: drawn in the screen colour so the workspace reads through. It never changes, whatever the phase. */}
        <div style={{ ...centre, width: ringHole, height: ringHole, background: "var(--mb-color-background)" }}>
          <div style={{ ...centre, width: disc, height: disc, background: ink }}>
            <PhosphorIcon name={PHASE_ICON[phase] || PHASE_ICON.idle} size="hero" color={foreground}
              style={{ fontSize: Math.round(size * 0.3), width: Math.round(size * 0.3), height: Math.round(size * 0.3) }} />
          </div>
        </div>
      </div>
    </div>
  );
}
