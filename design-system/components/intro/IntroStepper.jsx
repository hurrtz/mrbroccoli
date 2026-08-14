import React from "react";

/**
 * Progress through the introduction: dots for the steps, a dash for the
 * current one. A plain "step 4 of 6" told a reader where they were but nothing
 * about what they had passed or skipped; the shape does both at a glance.
 *
 * Each marker keeps a 44pt target while drawing at 8pt, so the row stays
 * visually quiet without becoming hard to hit, and every one is tappable so
 * the flow can be walked in either direction.
 */
export function IntroStepper({ count, index = 0, onSelect, style }) {
  return (
    <div role="tablist" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, ...style }}>
      {Array.from({ length: count }, (unused, step) => {
        const current = step === index;
        const visited = step < index;
        return (
          <span key={step} role="tab" aria-selected={current}
            aria-label={"Step " + (step + 1) + " of " + count}
            onClick={onSelect ? () => onSelect(step) : undefined}
            style={{
              height: 44, minWidth: 20, padding: "0 3px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <span style={{
              height: 8, width: current ? 26 : 8, borderRadius: "var(--mb-radius-pill)",
              background: current ? "var(--mb-color-accent)"
                : visited ? "var(--mb-color-border-strong)" : "var(--mb-color-border)",
            }} />
          </span>
        );
      })}
    </div>
  );
}
