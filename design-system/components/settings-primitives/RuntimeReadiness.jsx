import React from "react";

/**
 * The four capabilities a conversation needs, on one line: think, listen,
 * speak, search. Each is a 44pt target that opens the setting behind it.
 *
 * Steps and states come from settings-core/readiness.ts. That file defines no
 * colours, so the four states map onto the system's existing semantics.
 */
const STEPS = [
  { key: "think", label: "Think" },
  { key: "listen", label: "Listen" },
  { key: "speak", label: "Speak" },
  { key: "search", label: "Search" },
];

const INK = {
  ready: "var(--mb-color-success)",
  attention: "var(--mb-color-premium)",
  broken: "var(--mb-color-danger)",
  off: "var(--mb-color-text-muted)",
};

const WORD = { ready: "Ready", attention: "Attention", broken: "Broken", off: "Off" };

/**
 * Labels stay in body ink in every state. Gold on the warm off-white measures
 * 4.35:1, under AA, so colour lives in the dot and the word carries the state
 * for anyone who cannot separate the hues.
 */
export function RuntimeReadiness({ readiness = {}, onSelect, style }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "-10px -6px", ...style }}>
      {STEPS.map((step) => {
        const state = readiness[step.key] || "off";
        const filled = state === "ready" || state === "broken";
        return (
          <span
            key={step.key}
            role="button"
            tabIndex={0}
            aria-label={step.label + ". " + WORD[state] + ". Open " + step.label.toLowerCase() + " settings."}
            onClick={onSelect ? () => onSelect(step.key) : undefined}
            style={{
              height: 44, display: "flex", alignItems: "center", gap: 6, padding: "0 6px",
              cursor: onSelect ? "pointer" : "default", borderRadius: "var(--mb-radius-control)",
            }}
          >
            <span style={{
              width: 7, height: 7, borderRadius: 3.5, flexShrink: 0,
              background: filled ? INK[state] : "transparent",
              boxShadow: "inset 0 0 0 1.5px " + INK[state],
            }} />
            <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 12, lineHeight: "16px", color: "var(--mb-color-text)" }}>{step.label}</span>
          </span>
        );
      })}
    </div>
  );
}
