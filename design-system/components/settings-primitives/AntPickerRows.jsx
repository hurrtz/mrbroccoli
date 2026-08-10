import React from "react";

/** The full-bleed group picker rows sit in, plus an optional helper line. */
export function AntPickerRows({ children, helperText }) {
  return (
    <>
      <div style={{ background: "var(--mb-color-surface-elevated)", display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>{children}</div>
      {helperText ? (
        <div style={{ padding: "2px 16px 12px" }}>
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{helperText}</span>
        </div>
      ) : null}
    </>
  );
}
