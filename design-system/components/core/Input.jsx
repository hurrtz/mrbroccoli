import React from "react";
import { PhosphorIcon } from "./PhosphorIcon";

/** Single-line text field. Hairline border on the surface colour, 46pt tall. */
export function Input({ value, onChange, placeholder, type = "text", disabled = false, allowClear = false, suffix, ariaLabel, style }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", minHeight: 46,
      background: "var(--mb-color-surface)", border: "1px solid var(--mb-color-border)",
      borderRadius: "var(--mb-radius-control)", opacity: disabled ? "var(--mb-disabled-opacity)" : 1,
      paddingLeft: 12, ...style,
    }}>
      <input
        aria-label={ariaLabel}
        disabled={disabled}
        placeholder={placeholder}
        type={type === "password" ? "password" : "text"}
        value={value}
        onChange={(event) => onChange && onChange(event.target.value)}
        style={{
          flex: 1, minWidth: 0, minHeight: 44, border: "none", outline: "none", background: "transparent",
          color: "var(--mb-color-text)", fontFamily: "var(--mb-text-body-family)", fontSize: "var(--mb-text-body-size)",
          padding: "10px 0",
        }}
      />
      {allowClear && value ? (
        <button type="button" aria-label="Clear" onClick={() => onChange && onChange("")} style={clearStyle}>
          <PhosphorIcon name="close" size="compact" color="var(--mb-color-text-muted)" />
        </button>
      ) : null}
      {suffix ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44 }}>{suffix}</div> : null}
    </div>
  );
}

const clearStyle = { display: "flex", alignItems: "center", justifyContent: "center", minWidth: 44, minHeight: 44, background: "none", border: "none", cursor: "pointer", padding: 0 };
