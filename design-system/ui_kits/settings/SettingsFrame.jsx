const { IconButton, PhosphorIcon } = window.MrBroccoliDesignSystem_62d510;

/**
 * The settings modal chrome. Portrait fills the screen with no radius and no
 * border; landscape becomes a 22pt rounded card. Header geometry is
 * features/settings/styles.ts: 68pt minimum, 18pt sides, 14pt bottom pad,
 * children bottom-aligned, back on the leading edge only when drilled in.
 */
function SettingsFrame({ title, onBack, onClose, children }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: "var(--mb-color-surface)" }}>
      <div style={{ display: "flex", alignItems: "flex-end", minHeight: 68, padding: "0 18px 14px", borderBottom: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)", flexShrink: 0 }}>
        {onBack
          ? <IconButton icon="arrow-left" accessibilityLabel="Back to overview" onClick={onBack} />
          : <span style={{ width: 44, height: 44, flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 20, lineHeight: "26px", letterSpacing: "-0.2px", textAlign: "center", color: "var(--mb-color-text)" }}>{title}</span>
        </div>
        <IconButton icon="close" accessibilityLabel="Dismiss" onClick={onClose} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 760, margin: "0 auto", padding: "18px 16px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/** A page whose sections are spaced 24 apart rather than 16. */
function SectionPage({ children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</div>;
}

function SectionGroup({ children }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>;
}

function HelperText({ children }) {
  return <span style={{ fontFamily: "var(--mb-text-supporting-family)", fontSize: 13, lineHeight: "19px", color: "var(--mb-color-text-secondary)" }}>{children}</span>;
}

/** The status pill on a provider card. Tones are getStatusMeta in ProviderConnectionPanel.tsx. */
function ProviderStatus({ health }) {
  const meta = {
    failing: { label: "Invalid", bg: "color-mix(in srgb, var(--mb-color-danger) 9%, transparent)", border: "color-mix(in srgb, var(--mb-color-danger) 40%, transparent)", color: "var(--mb-color-danger)" },
    validating: { label: "Testing", bg: "var(--mb-color-surface-alt)", border: "var(--mb-color-border-strong)", color: "var(--mb-color-accent)" },
    healthy: { label: "Working", bg: "color-mix(in srgb, var(--mb-color-success) 9%, transparent)", border: "color-mix(in srgb, var(--mb-color-success) 53%, transparent)", color: "var(--mb-color-success)" },
    configured: { label: "Not tested", bg: "var(--mb-color-surface)", border: "var(--mb-color-border-strong)", color: "var(--mb-color-text-secondary)" },
    none: { label: "Not set up", bg: "var(--mb-color-surface)", border: "var(--mb-color-border)", color: "var(--mb-color-text-muted)" },
  }[health];
  return (
    <span style={{ height: 25, display: "inline-flex", alignItems: "center", padding: "0 15px", borderRadius: 3, border: "0.5px solid " + meta.border, background: meta.bg, fontFamily: "var(--mb-text-body-family)", fontSize: 12, color: meta.color, whiteSpace: "nowrap" }}>{meta.label}</span>
  );
}

/** A capability chip. 25pt tall, 3pt radius, half-pixel border — not a pill. */
function CapabilityTag({ children }) {
  return (
    <span style={{ height: 25, display: "inline-flex", alignItems: "center", padding: "0 15px", borderRadius: 3, border: "0.5px solid var(--mb-color-border)", fontFamily: "var(--mb-text-body-family)", fontSize: 12, color: "var(--mb-color-text-secondary)", whiteSpace: "nowrap" }}>{children}</span>
  );
}

Object.assign(window, { SettingsFrame, SectionPage, SectionGroup, HelperText, ProviderStatus, CapabilityTag });
