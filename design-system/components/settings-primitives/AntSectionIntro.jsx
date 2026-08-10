import React from "react";

/** A settings page section heading with an optional noun-phrase summary. */
export function AntSectionIntro({ title, description, extra }) {
  return (
    <div style={{ padding: "0 4px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, minHeight: 44 }}>
        <h2 style={{ flex: 1, margin: 0, fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 17, lineHeight: "23px", color: "var(--mb-color-text)" }}>{title}</h2>
        {extra}
      </div>
      {description ? (
        <p style={{ margin: 0, fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text-secondary)" }}>{description}</p>
      ) : null}
    </div>
  );
}
