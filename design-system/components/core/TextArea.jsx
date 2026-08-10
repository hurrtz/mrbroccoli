import React from "react";

/** Multi-line field. Fixed 128pt box — it scrolls rather than growing. */
export function TextArea({ value, onChange, placeholder, rows = 5, disabled = false, ariaLabel, style }) {
  return (
    <textarea
      aria-label={ariaLabel}
      disabled={disabled}
      placeholder={placeholder}
      rows={rows}
      value={value}
      onChange={(event) => onChange && onChange(event.target.value)}
      style={{
        width: "100%", minHeight: 128, maxHeight: 128, resize: "none",
        background: "var(--mb-color-surface)", border: "1px solid var(--mb-color-border)",
        borderRadius: "var(--mb-radius-control)", color: "var(--mb-color-text)",
        fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px",
        padding: "12px", outline: "none", opacity: disabled ? 0.55 : 1, ...style,
      }}
    />
  );
}
