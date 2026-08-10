import React from "react";

/** Label, optional helper, and a switch. 58pt tall so the copy can wrap. */
export function AntSwitchRow({ label, description, value, onChange, disabled = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 58, opacity: disabled ? "var(--mb-disabled-opacity)" : 1 }}>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)" }}>{label}</span>
        {description ? (
          <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{description}</span>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!value)}
        style={{
          flexShrink: 0, width: 51, height: 31, borderRadius: 16, padding: 2, border: "none", cursor: disabled ? "default" : "pointer",
          background: value ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)",
          display: "flex", justifyContent: value ? "flex-end" : "flex-start", alignItems: "center",
          transition: "background var(--mb-duration-toast) ease",
        }}
      >
        <span style={{ width: 27, height: 27, borderRadius: 14, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.22)" }} />
      </button>
    </div>
  );
}
