import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { AntSettingsCard } from "./AntSettingsCard";

/** A card of mutually exclusive rows. Selection is a radio glyph in the accent, not a fill. */
export function AntRadioSection({ label, options, value, onChange, headerExtra }) {
  return (
    <AntSettingsCard title={label} headerExtra={headerExtra} fullBleed>
      <div role="radiogroup" aria-label={label}>
        {options.map((option, index) => {
          const selected = option.value === value;
          return (
            <div
              key={option.value}
              role="radio"
              aria-checked={selected}
              aria-disabled={option.disabled || undefined}
              onClick={option.disabled ? undefined : () => onChange(option.value)}
              style={{
                display: "flex", alignItems: "center", gap: 12, minHeight: 46, padding: "12px 16px",
                borderBottom: index === options.length - 1 ? "none" : "1px solid var(--mb-color-border)",
                opacity: option.disabled ? 0.55 : 1, cursor: option.disabled ? "default" : "pointer",
              }}
            >
              <span style={{ flex: 1, fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", color: option.disabled ? "var(--mb-color-text-muted)" : "var(--mb-color-text)" }}>{option.label}</span>
              <PhosphorIcon name={selected ? "radio-selected" : "radio-unselected"} size="control" color={selected ? "var(--mb-color-accent)" : "var(--mb-color-text-muted)"} />
            </div>
          );
        })}
      </div>
    </AntSettingsCard>
  );
}
