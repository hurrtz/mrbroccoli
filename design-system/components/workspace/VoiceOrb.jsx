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

/** The glyph says what tapping does at the ends of a turn (mic, stop, pause);
    through the middle it names the work in hand. Transcribing mirrors with the
    reading direction — the app passes `rtl` for right-to-left locales. */
const PHASE_ICON = {
  idle: "mic", recording: "stop", transcribing: "text-align-left", "thinking-briefly": "brain",
  searching: "global", thinking: "circuitry", synthesizing: "user-sound", speaking: "pause",
};

const PHASE_LABEL = {
  idle: "Tap to speak", recording: "Listening. Tap to stop.", transcribing: "Transcribing",
  "thinking-briefly": "Thinking", searching: "Searching the web", thinking: "Thinking",
  synthesizing: "Preparing speech", speaking: "Speaking. Tap to pause.",
};

const BAND = 6;

/**
 * The workspace's one loud element. Anatomy inside out: the disc; a small gap
 * that is only ever a gap — no fill, no meaning, identical in every phase; and
 * one 12pt ring around it.
 *
 * **One ring, one meter** (owner call, 2026-08 — the earlier inner/outer pair is
 * merged): it reports whatever you are waiting on. Idle: faded to the track, no
 * clock. Recording: how much of the window is used before auto-submit.
 * Transcribing through synthesizing: the whole turn against its estimate.
 * Speaking: how much of the response has been read; paragraph jumps move it.
 * Past the estimate it fills red — the one state that is a judgement.
 *
 * The ring is a fill meter, not a judgement, so it is slate — the neutral turn
 * tokens. The phase colour lives in the disc alone.
 */
export function VoiceOrb({
  phase = "idle",
  phaseProgress = 0,
  turnProgress = 0,
  overtime = 0,
  size = 196,
  rtl = false,
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
  const foreground = getAccessibleForeground(ink);
  const combined = phase === "recording" || phase === "speaking";
  const idle = phase === "idle";

  const arc = (progress, arcInk, track) => late > 0
    ? "conic-gradient(" + track + " 0deg " + remaining + "deg, var(--mb-color-danger) " + remaining + "deg 360deg)"
    : "conic-gradient(" + arcInk + " 0deg " + Math.round(clamp(progress) * 360) + "deg, " + track + " " + Math.round(clamp(progress) * 360) + "deg 360deg)";
  /* ONE ring (owner call, 2026-08): the two bands are merged into a single 12pt
     meter. With the rings slate rather than phase-coloured, an inner and an outer
     clock were two greys telling one story — the ring now reports the thing you
     are waiting on: the recording window, the turn against its estimate, then
     how much of the answer has been read. */
  const track = "var(--mb-color-turn-track)";
  const fill = "var(--mb-color-turn-ink)";
  const flat = "linear-gradient(" + track + ", " + track + ")";
  const ringPaint = idle ? flat : arc(combined ? phaseProgress : turnProgress, fill, track);

  const centre = { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", flexShrink: 0 };
  const ringHole = size - BAND * 4;
  // The disc is a proportion of the whole orb, capped so the gap survives at
  // small sizes — the rings sit close, but the gap is part of the anatomy and
  // is never squeezed out entirely (owner call, 2026-08: ~3pt, down from 9).
  const disc = Math.min(Math.floor(size * 0.86), ringHole - 6);

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={label || PHASE_LABEL[phase] || PHASE_LABEL.idle}
      onClick={onPress}
      style={{ ...centre, width: size, height: size, cursor: "pointer", background: ringPaint, ...style }}
    >
      {/* The gap: drawn in the screen colour so the workspace reads through. It never changes, whatever the phase. */}
      <div style={{ ...centre, width: ringHole, height: ringHole, background: "var(--mb-color-background)" }}>
        <div style={{ ...centre, width: disc, height: disc, background: ink }}>
          <PhosphorIcon name={rtl && phase === "transcribing" ? "text-align-right" : (PHASE_ICON[phase] || PHASE_ICON.idle)} size="hero" color={foreground}
            style={{ fontSize: Math.round(size * 0.3), width: Math.round(size * 0.3), height: Math.round(size * 0.3) }} />
        </div>
      </div>
    </div>
  );
}
