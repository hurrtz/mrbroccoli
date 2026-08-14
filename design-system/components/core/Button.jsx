import React from "react";

/**
 * The shared action control. Ghost by default; primary carries the accent;
 * warning carries danger. Button does not style its children — put an
 * AntButtonLabel or a bare PhosphorIcon inside.
 */
export function Button({ children, type = "ghost", size, loading = false, disabled = false, onClick, style, ariaLabel, ...rest }) {
  const [pressed, setPressed] = React.useState(false);
  const unavailable = disabled || loading;
  const background = type === "primary" ? "var(--mb-color-accent)" : type === "warning" ? "var(--mb-color-danger)" : "transparent";
  const borderColor = type === "ghost" ? "var(--mb-color-border)" : background;
  const small = size === "small";
  return (
    <button
      {...rest}
      type="button"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      disabled={unavailable}
      onClick={unavailable ? undefined : onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        minHeight: small ? "var(--mb-touch-target)" : 48,
        padding: small ? "8px 12px" : "10px 16px",
        borderRadius: "var(--mb-radius-control)",
        border: "1px solid " + borderColor,
        background, cursor: unavailable ? "default" : "pointer",
        opacity: unavailable ? "var(--mb-disabled-opacity)" : pressed ? "var(--mb-press-opacity)" : 1,
        font: "inherit", color: "inherit", WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {loading ? <Spinner color={type === "ghost" ? "var(--mb-color-accent)" : "var(--mb-color-on-active-control)"} /> : null}
      {children}
    </button>
  );
}

function Spinner({ color }) {
  return (
    <span style={{ width: 16, height: 16, borderRadius: 8, border: "2px solid " + color, borderTopColor: "transparent", display: "inline-block", animation: "mb-spin 0.8s linear infinite" }}>
      <style>{"@keyframes mb-spin{to{transform:rotate(360deg)}}"}</style>
    </span>
  );
}
