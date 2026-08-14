import React from "react";

/**
 * The dialog surface. `layout="dialog"` centres a 560pt card; `layout="sheet"`
 * pins a full-width card to the bottom edge and rounds only its top corners.
 * The body shrinks before the title and footer, so footer actions stay on-screen.
 */
export function Modal({ visible, title, children, footer = [], layout = "dialog", maskClosable = true, onClose, inline = false }) {
  if (!visible) return null;
  const sheet = layout === "sheet";
  return (
    <div
      style={{
        position: inline ? "absolute" : "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: sheet ? "flex-end" : "center", justifyContent: "center",
        padding: sheet ? 0 : 20, background: "var(--mb-color-overlay)",
      }}
    >
      {maskClosable ? <div onClick={onClose} style={{ position: "absolute", inset: 0 }} /> : null}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative", display: "flex", flexDirection: "column", gap: 16,
          width: sheet ? "100%" : "88%", maxWidth: sheet ? "100%" : "var(--mb-dialog-max-width)",
          maxHeight: sheet ? "85%" : "82%", overflow: "hidden", padding: 20,
          background: "var(--mb-color-surface-elevated)", border: "1px solid var(--mb-color-border)",
          borderRadius: sheet ? "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0" : "var(--mb-radius-dialog)",
          boxShadow: sheet ? "var(--mb-shadow-sheet)" : "var(--mb-shadow-dialog)",
          animation: sheet ? "mb-sheet-rise var(--mb-duration-sheet) var(--mb-ease-sheet-in)" : "none",
        }}
      >
        <style>{"@keyframes mb-sheet-rise{from{transform:translateY(100%)}to{transform:translateY(0)}}"}</style>
        {title ? (
          typeof title === "string" ? (
            <h2 style={{ margin: 0, fontFamily: "var(--mb-font-body)", fontWeight: 500, fontSize: 18, lineHeight: "24px", color: "var(--mb-color-text)" }}>{title}</h2>
          ) : title
        ) : null}
        <div style={{ flexShrink: 1, minHeight: 0, overflow: "auto", display: "flex", flexDirection: "column", gap: 12, color: "var(--mb-color-text)" }}>{children}</div>
        {footer.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {footer.map((action, index) => (
              <button
                key={action.text + index}
                type="button"
                disabled={action.disabled || action.loading}
                onClick={action.onPress}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 48, padding: "11px 16px",
                  borderRadius: "var(--mb-radius-control)", cursor: "pointer",
                  background: action.tone === "success" ? "var(--mb-color-success)" : "transparent",
                  border: "1px solid " + (action.tone === "success" ? "var(--mb-color-success)" : "var(--mb-color-border)"),
                  color: action.tone === "success" ? "var(--mb-color-on-active-control)" : "var(--mb-color-accent)",
                  fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15,
                  opacity: action.disabled || action.loading ? "var(--mb-disabled-opacity)" : 1,
                }}
              >
                {action.text}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
