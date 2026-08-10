import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { Modal } from "../overlays/Modal";

/** The workspace dropdown: a control label above the value, with a round caret well. */
export function Picker({ label, value, options, onChange, dropdownLabel, hideLabel = false, hideDropdownLabel = false, placeholder, disabled = false, style }) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {hideLabel ? null : (
        <div style={{ marginBottom: 10, fontFamily: "var(--mb-text-control-label-family)", fontSize: "var(--mb-text-control-label-size)", lineHeight: "var(--mb-text-control-label-line-height)", fontWeight: 600, letterSpacing: "var(--mb-text-control-label-tracking)", textTransform: "uppercase", color: "var(--mb-color-text-secondary)" }}>{label}</div>
      )}
      <div
        role="button"
        aria-expanded={open}
        onClick={disabled ? undefined : () => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 14,
          borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)",
          background: disabled ? "var(--mb-color-surface)" : "var(--mb-color-surface-elevated)",
          opacity: disabled ? 0.55 : 1, cursor: disabled ? "default" : "pointer",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {hideDropdownLabel ? null : (
            <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10, lineHeight: "14px", fontWeight: 600, letterSpacing: "0.75px", textTransform: "uppercase", color: "var(--mb-color-text-secondary)" }}>{dropdownLabel || "Selection"}</span>
          )}
          <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--mb-color-text)" }}>
            {selected ? selected.label : placeholder || value}
          </span>
        </div>
        <span style={{ width: 34, height: 34, borderRadius: 17, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent-soft)", border: "1px solid var(--mb-color-border)" }}>
          <PhosphorIcon name="down" size="compact" color="var(--mb-color-accent)" />
        </span>
      </div>
      <Modal visible={open} title={label} onClose={() => setOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                onClick={() => { onChange(option.value); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  padding: 14, borderRadius: "var(--mb-radius-control)",
                  border: "1px solid " + (isSelected ? "var(--mb-color-border-strong)" : "var(--mb-color-border)"),
                  background: isSelected ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)", cursor: "pointer",
                }}
              >
                <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, color: "var(--mb-color-text)" }}>{option.label}</span>
                {isSelected ? <PhosphorIcon name="check" size="compact" color="var(--mb-color-accent)" /> : null}
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
