import React from "react";
import { VoiceOrb } from "./VoiceOrb";
import { OrbSatellite } from "./OrbSatellite";

/**
 * The orb with its transport verbs in orbit: Back and Forward on the flanks,
 * where left and right already mean what they mean, Restart and Stop on the
 * lower diagonals, nearest the thumb.
 *
 * The verbs belong to the orb because the orb is the thing they act on — it
 * holds the reading arc, and its own tap is pause/resume. That leaves the row
 * beneath the orb permanently to composing, so one location never means two
 * things and a paused turn no longer rewrites the screen.
 *
 * **The footprint is permanent; the keys are not.** The cluster reserves its
 * box at every phase — idle included, when it draws nothing in it — so the orb
 * never moves when a turn starts. Keys appear for turn phases only: their
 * presence IS the signal that a turn is running. The hands-free loop has no
 * keys here; it is the Hands free switch in the composing row.
 *
 * Geometry, if you need to reserve the space yourself: keys sit on a circle
 * REACH clear of the orb's edge, so the cluster measures
 * `2 * (orbSize / 2 + REACH + 32)` wide and
 * `orbSize / 2 + max(orbSize / 2, 0.7071 * (orbSize / 2 + REACH) + 36)` tall
 * with labels (22 in place of 32 and 36 when `labels` is false). At 196pt that
 * is 328×227 — it holds inside a 4.7" column.
 */
const REACH = 34;
const KEYS = [
  { id: "restart", icon: "reload", label: "Restart", angle: 135, seek: true, accessibilityLabel: "Restart the response" },
  { id: "back", icon: "back", label: "Back", angle: 180, seek: true, accessibilityLabel: "Previous paragraph" },
  { id: "forward", icon: "arrow-right", label: "Forward", angle: 0, seek: true, accessibilityLabel: "Next paragraph" },
  { id: "stop", icon: "stop", label: "Stop", angle: 45, seek: false, tone: "danger", accessibilityLabel: "Stop this turn" },
];
const RAD = Math.PI / 180;

export function OrbTransport({
  phase = "idle",
  orbSize = 196,
  labels = true,
  phaseProgress,
  turnProgress,
  overtime,
  onOrbPress,
  onRestart,
  onBack,
  onForward,
  onStop,
  style,
}) {
  const showKeys = phase !== "idle";
  const speaking = phase === "speaking";
  const radius = orbSize / 2 + REACH;
  const wide = labels ? 32 : 22;
  const tall = labels ? 36 : 22;
  const width = Math.round(2 * (radius + wide));
  const height = Math.round(orbSize / 2 + Math.max(orbSize / 2, Math.sin(45 * RAD) * radius + tall));
  const centre = { x: width / 2, y: orbSize / 2 };
  const press = { restart: onRestart, back: onBack, forward: onForward, stop: onStop };
  return (
    <div style={{ position: "relative", width, height, flexShrink: 0, ...style }}>
      <div style={{ position: "absolute", left: centre.x - orbSize / 2, top: 0 }}>
        <VoiceOrb phase={phase} phaseProgress={phaseProgress} turnProgress={turnProgress} overtime={overtime}
          size={orbSize} onPress={onOrbPress} />
      </div>
      {showKeys ? KEYS.map((k) => (
        <div key={k.id} style={{
          position: "absolute",
          left: centre.x + Math.cos(k.angle * RAD) * radius - (labels ? 32 : 22),
          top: centre.y + Math.sin(k.angle * RAD) * radius - 22,
        }}>
          <OrbSatellite icon={k.icon} label={k.label} tone={k.tone} accessibilityLabel={k.accessibilityLabel}
            iconOnly={!labels} disabled={k.seek && !speaking} onPress={press[k.id]} />
        </div>
      )) : null}
    </div>
  );
}
