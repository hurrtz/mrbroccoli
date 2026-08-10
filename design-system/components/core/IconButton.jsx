import React from "react";
import { PhosphorIcon, MIN_ICON_TOUCH_TARGET } from "./PhosphorIcon";

/** The standard icon-only control. Always 44×44; the glyph inside is smaller. */
export function IconButton({ icon, iconNode, iconSize = "control", iconColor, active = false, disabled = false, onClick, accessibilityLabel, style }) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={accessibilityLabel}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: MIN_ICON_TOUCH_TARGET, height: MIN_ICON_TOUCH_TARGET,
        borderRadius: "var(--mb-radius-icon-button)",
        border: "1px solid " + (active ? "var(--mb-color-accent)" : "transparent"),
        background: pressed ? "var(--mb-color-surface-alt)" : active ? "var(--mb-color-accent-soft)" : "transparent",
        padding: 0, cursor: disabled ? "default" : "pointer",
        opacity: disabled ? "var(--mb-disabled-opacity-icon)" : 1,
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {iconNode || (icon ? <PhosphorIcon name={icon} size={iconSize} color={iconColor || (active ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)")} /> : null)}
    </button>
  );
}
