import React from "react";

/** The quiet card settings are grouped into: title bar, hairline, content, optional footer. */
export function AntSettingsCard({ title, headerExtra, children, footer, fullBleed = false, style }) {
  return (
    <section style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface-elevated)", overflow: "hidden", ...style }}>
      {title ? (
        <header style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 50, padding: "12px 16px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {typeof title === "string" ? (
              <h3 style={{ margin: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)" }}>{title}</h3>
            ) : title}
          </div>
          {headerExtra ? <div style={{ flex: "0 0 auto" }}>{headerExtra}</div> : null}
        </header>
      ) : null}
      <div style={{
        padding: fullBleed ? 0 : "14px 16px", display: "flex", flexDirection: "column", gap: fullBleed ? 0 : 10,
        borderTop: title ? "1px solid var(--mb-color-border)" : "none",
      }}>
        {children}
      </div>
      {footer ? (
        <footer style={{ padding: "8px 16px", borderTop: "1px solid var(--mb-color-border)", display: "flex", justifyContent: "flex-end" }}>{footer}</footer>
      ) : null}
    </section>
  );
}
