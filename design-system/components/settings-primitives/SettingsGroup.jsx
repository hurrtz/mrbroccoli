import React from "react";

/** One settings section: an uppercase caption, a bordered card of rows, helper prose demoted to the footer. */
export function SettingsGroup({ title, footer, children, style }) {
  return (
    <div style={{ padding: "14px 16px 0", ...style }}>
      {title ? <p style={{ margin: "0 0 6px 14px", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{title}</p> : null}
      <div style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)", overflow: "hidden" }}>{children}</div>
      {footer ? <p style={{ margin: "6px 14px 0", fontFamily: "var(--mb-text-supporting-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-muted)" }}>{footer}</p> : null}
    </div>
  );
}
