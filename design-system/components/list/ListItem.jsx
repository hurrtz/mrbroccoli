import React from "react";

function Brief({ children, style }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--mb-text-supporting-family)", fontSize: "var(--mb-text-supporting-size)", lineHeight: "var(--mb-text-supporting-line-height)", color: "var(--mb-color-text-secondary)", ...style }}>
      {children}
    </span>
  );
}

/** A 46pt row: optional thumb, content plus brief, optional trailing extra. */
export function ListItem({ children, brief, extra, thumb, onClick, disabled = false, style }) {
  const [pressed, setPressed] = React.useState(false);
  const nodes = React.Children.toArray(children);
  const briefNodes = nodes.filter((child) => React.isValidElement(child) && child.type === Brief);
  const contentNodes = nodes.filter((child) => !(React.isValidElement(child) && child.type === Brief));
  const row = (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 46, padding: "10px 16px" }}>
      {thumb}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        {contentNodes.length ? <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: "var(--mb-text-body-size)", lineHeight: "var(--mb-text-body-line-height)", color: "var(--mb-color-text)" }}>{contentNodes}</span> : null}
        {briefNodes}
        {brief ? <Brief>{brief}</Brief> : null}
      </div>
      {extra ? <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>{extra}</div> : null}
    </div>
  );
  if (!onClick) return <div style={style}>{row}</div>;
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{ cursor: disabled ? "default" : "pointer", opacity: disabled ? "var(--mb-disabled-opacity)" : pressed ? "var(--mb-press-opacity)" : 1, ...style }}
    >
      {row}
    </div>
  );
}

ListItem.Brief = Brief;
