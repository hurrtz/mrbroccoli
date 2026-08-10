import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { getAccessibleForeground } from "./PhaseAwareVoiceAction";

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
const GAP = 3;

/**
 * The workspace's one loud element. Two concentric rings carry two different
 * clocks: the outer one is the whole turn against its estimate, the inner one is
 * the current phase against itself. Past the estimate both rings fill with red
 * as they run, so a late turn is legible without reading anything.
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
  /* At rest there is no turn and no phase, so neither ring means anything.
     Both fall back to the plain halo rather than drawing empty tracks. */
  const quiet = phase === "idle" && !clamp(turnProgress) && !clamp(phaseProgress) && !late;

  const turnRing = quiet
    ? "var(--mb-color-background)"
    : late > 0
    ? "conic-gradient(var(--mb-color-turn-track) 0deg " + remaining + "deg, var(--mb-color-danger) " + remaining + "deg 360deg)"
    : "conic-gradient(var(--mb-color-turn-ink) 0deg " + Math.round(clamp(turnProgress) * 360) + "deg, var(--mb-color-turn-track) " + Math.round(clamp(turnProgress) * 360) + "deg 360deg)";

  const phaseRing = quiet
    ? "linear-gradient(" + tint + ", " + tint + ")"
    : late > 0
    ? "conic-gradient(" + tint + " 0deg " + remaining + "deg, var(--mb-color-danger) " + remaining + "deg 360deg)"
    : "conic-gradient(" + ink + " 0deg " + Math.round(clamp(phaseProgress) * 360) + "deg, " + tint + " " + Math.round(clamp(phaseProgress) * 360) + "deg 360deg)";

  const centre = { display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", flexShrink: 0 };
  const hole = size - BAND * 2;
  const inner = hole - GAP * 2;
  const innerHole = inner - BAND * 2;
  // The core is a proportion of the whole orb, but it can never exceed the ring
  // holding it: the rings shrink by fixed bands while the proportion shrinks
  // linearly, so below ~107pt the proportion overtakes the ring it sits in.
  const disc = Math.min(innerHole, Math.floor(size * 0.72));

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={label || PHASE_LABEL[phase] || PHASE_LABEL.idle}
      onClick={onPress}
      style={{ ...centre, width: size, height: size, cursor: "pointer", background: turnRing, ...style }}
    >
      <div style={{ ...centre, width: hole, height: hole, background: "var(--mb-color-background)" }}>
        <div style={{ ...centre, width: inner, height: inner, backgroundColor: "var(--mb-color-background)", backgroundImage: phaseRing }}>
          <div style={{ ...centre, width: innerHole, height: innerHole, background: quiet ? tint : "var(--mb-color-background)" }}>
            <div style={{ ...centre, width: disc, height: disc, background: ink, boxShadow: "0 0 0 8px " + tint }}>
              <PhosphorIcon name={PHASE_ICON[phase] || PHASE_ICON.idle} size="hero" color={foreground}
                style={{ fontSize: Math.round(size * 0.3), width: Math.round(size * 0.3), height: Math.round(size * 0.3) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
