import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { Modal } from "../overlays/Modal";

/** A label / value row that opens a modal list of options. */
export function AntPickerRow({ label, value, options, onChange, disabled = false, standalone = false }) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);
  const selectedLabel = selected ? selected.label : options.length === 1 ? options[0].label : value;
  const single = options.length === 1;
  const interactive = !single && !disabled;
  const row = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 46, padding: "10px 14px" }}>
      <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", color: disabled ? "var(--mb-color-text-muted)" : "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", textAlign: "right", color: disabled ? "var(--mb-color-text-muted)" : "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedLabel}</span>
        {interactive ? <PhosphorIcon name="down" size="compact" color="var(--mb-color-text-muted)" /> : null}
      </span>
    </div>
  );
  return (
    <>
      <div
        role={interactive ? "button" : undefined}
        aria-label={label + ". " + selectedLabel}
        onClick={interactive ? () => setOpen(true) : undefined}
        style={{
          minHeight: 46, margin: standalone ? 0 : "0 16px", borderRadius: "var(--mb-radius-control)",
          border: "1px solid var(--mb-color-border)", overflow: "hidden",
          background: interactive ? "var(--mb-color-surface)" : "var(--mb-color-surface-elevated)",
          cursor: interactive ? "pointer" : "default",
        }}
      >
        {row}
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
                onClick={() => { if (!option.disabled) { onChange(option.value); setOpen(false); } }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, minHeight: 50, padding: "12px 14px",
                  borderRadius: "var(--mb-radius-control)",
                  border: "1px solid " + (isSelected ? "var(--mb-color-border-strong)" : "var(--mb-color-border)"),
                  background: isSelected ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)",
                  opacity: option.disabled ? 0.5 : 1, cursor: option.disabled ? "default" : "pointer",
                }}
              >
                <span style={{ flex: 1, fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", color: option.disabled ? "var(--mb-color-text-muted)" : "var(--mb-color-text)" }}>{option.label}</span>
                {isSelected ? <PhosphorIcon name="check" size="control" color="var(--mb-color-accent)" /> : null}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
