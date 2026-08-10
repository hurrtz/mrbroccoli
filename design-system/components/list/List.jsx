import React from "react";

/** A plain vertical container. It renders what you put in it and nothing else. */
export function List({ children, style }) {
  return <div style={{ display: "flex", flexDirection: "column", ...style }}>{children}</div>;
}
