import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";

/* The pile recedes down and to the left: each tile behind the front one is a
   little smaller and a little fainter, so depth reads at 44pt without a
   numeral. One tile for one image, two for two, three for three and up — the
   exact number is the label's job. */
const LAYERS = [
  { size: 26, left: 10, top: 0, opacity: .5 },
  { size: 29, left: 5, top: 4, opacity: .75 },
  { size: 32, left: 0, top: 8, opacity: 1 },
];

function Deck({ thumbnails }) {
  const shown = thumbnails.slice(0, 3);
  const layers = LAYERS.slice(3 - shown.length);
  return (
    <div style={{ position: "relative", width: 36, height: 40 }}>
      {layers.map((layer, index) => {
        /* Front layer is the first attachment; the pile grows behind it. */
        const uri = shown[layers.length - 1 - index];
        return (
          <div key={layer.size} style={{ position: "absolute", left: layer.left, top: layer.top, opacity: layer.opacity }}>
            {uri ? (
              <img alt="" src={uri} style={{ width: layer.size, height: layer.size, objectFit: "cover", display: "block", borderRadius: 7, border: "1px solid var(--mb-color-border)" }} />
            ) : (
              <div style={{ width: layer.size, height: layer.size, borderRadius: 7, border: "1px solid var(--mb-color-border)", background: "color-mix(in srgb, var(--mb-color-text-muted) 12%, var(--mb-color-surface))" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A 44pt control with a quiet mono label beneath it, for the row under the orb
 * and for the transport cluster around it.
 *
 * The container describes location, never state: a satellite has no fill and no
 * border in either appearance. A switch says it is on by **filling its glyph**
 * and taking the accent, label with it — two channels, weight and hue, so the
 * state never depends on colour alone. Nothing else in the product fills a
 * glyph, so a filled glyph can only mean on.
 *
 * `thumbnails` replaces the glyph with the pictures themselves — the Image
 * satellite's deck. Content, not state: the glyph still never fills.
 *
 * The squircle appears only under the thumb: a momentary accent-soft press disc,
 * which is the whole pressability cue a borderless target gets.
 */
export function OrbSatellite({
  icon,
  label,
  accessibilityLabel,
  kind = "action",
  tone = "neutral",
  active = false,
  disabled = false,
  iconOnly = false,
  thumbnails,
  onPress,
  style,
}) {
  const [pressed, setPressed] = React.useState(false);
  const toggle = kind === "toggle";
  const on = toggle && !!active;
  const deck = thumbnails && thumbnails.length ? thumbnails : null;
  const toneInk = tone === "danger" ? "var(--mb-color-danger)" : tone === "success" ? "var(--mb-color-success)" : null;
  const ink = toneInk || (on ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)");
  const release = () => setPressed(false);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      width: iconOnly ? 44 : 64, opacity: disabled ? .38 : 1, ...style,
    }}>
      <span
        role={toggle ? "switch" : "button"}
        aria-checked={toggle ? on : undefined}
        aria-disabled={disabled ? "true" : undefined}
        aria-label={accessibilityLabel || label}
        tabIndex={disabled ? -1 : 0}
        onClick={disabled ? undefined : onPress}
        onPointerDown={disabled ? undefined : () => setPressed(true)}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        style={{
          width: 44, height: 44, cursor: disabled ? "default" : "pointer",
          borderRadius: "var(--mb-radius-icon-button)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: pressed && !disabled ? "var(--mb-color-accent-soft)" : "transparent",
          transition: "background var(--mb-duration-press) ease-out",
        }}
      >
        {deck
          ? <Deck thumbnails={deck} />
          : <PhosphorIcon name={icon} size="control" weight={on ? "fill" : "regular"} color={ink} />}
      </span>
      {iconOnly || !label ? null : (
        <span style={{
          fontFamily: "var(--mb-font-mono)", fontSize: 9, lineHeight: "12px", letterSpacing: "0.75px",
          textTransform: "uppercase", color: ink, textAlign: "center", whiteSpace: "pre-line",
        }}>{label}</span>
      )}
    </div>
  );
}
