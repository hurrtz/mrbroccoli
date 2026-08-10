import React from "react";

/** Label plus a right-aligned integer field, 82pt wide. */
export function AntNumberInputRow({ label, value, onChange, min = 1 }) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const parsed = Number(draft);
    if (Number.isSafeInteger(parsed) && parsed >= min) { onChange(parsed); setDraft(String(parsed)); return; }
    setDraft(String(value));
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, minHeight: 52 }}>
      <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)" }}>{label}</span>
      <input
        aria-label={label}
        inputMode="numeric"
        value={draft}
        onBlur={commit}
        onChange={(event) => setDraft(event.target.value.replace(/[^0-9]/g, ""))}
        style={{
          width: 82, minHeight: 44, textAlign: "right", padding: "0 12px",
          border: "1px solid var(--mb-color-border)", borderRadius: "var(--mb-radius-control)",
          background: "var(--mb-color-surface)", color: "var(--mb-color-text)",
          fontFamily: "var(--mb-text-body-family)", fontSize: 15, lineHeight: "21px", outline: "none",
        }}
      />
    </div>
  );
}
