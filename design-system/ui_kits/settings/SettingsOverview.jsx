const { PhosphorIcon, List, ListItem, RuntimeReadiness } = window.MrBroccoliDesignSystem_62d510;

/** Each capability opens the page that configures it. */
const READINESS_PAGE = { think: "thinking", listen: "listening", speak: "speaking", search: "search" };

/**
 * The settings overview. Rows are grouped into three titled groups; the free
 * edition sees only the pages that are not premium, so its list collapses to
 * On-device AI, Data & privacy and App & diagnostics, and the on-device row is
 * tinted to point at what the edition can actually do.
 */
function SettingsOverview({ isPremium, onOpenPage, onOpenPremium, onClose }) {
  const rows = window.MB_SETTINGS.rows;
  const [showPremiumCard, setShowPremiumCard] = React.useState(true);
  const groups = window.MB_SETTINGS.groups
    .map((group) => ({ title: group.title, pages: group.pages.filter((page) => isPremium || !rows[page].premium) }))
    .filter((group) => group.pages.length > 0);

  return (
    <window.SettingsFrame title="Settings" onClose={onClose}>
      {isPremium && showPremiumCard ? (
        <div style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-premium-border)", background: "var(--mb-color-premium-soft)", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <PhosphorIcon name="check-circle" size="feature" color="var(--mb-color-premium)" />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 16, lineHeight: "22px", color: "var(--mb-color-text)" }}>Premium unlocked</span>
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text-secondary)" }}>Bring your own providers, cloud models, and web search.</span>
          </div>
          <IconButton icon="close" accessibilityLabel="Dismiss the Premium card" onClick={() => setShowPremiumCard(false)} />
        </div>
      ) : null}

      {isPremium ? (
        <RuntimeReadiness readiness={window.MB_SETTINGS.readiness}
          onSelect={(step) => onOpenPage(READINESS_PAGE[step])} />
      ) : null}

      {groups.map((group) => (
        <div key={group.title} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, lineHeight: "16px", letterSpacing: "0.8px", textTransform: "uppercase", padding: "0 4px", color: "var(--mb-color-text-secondary)" }}>{group.title}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {group.pages.map((page) => {
              const row = rows[page];
              const highlight = !isPremium && page === "local";
              return (
                <div key={page} style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: highlight ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface-elevated)", overflow: "hidden" }}>
                  <List>
                    <ListItem
                      onClick={() => onOpenPage(page)}
                      thumb={<span style={{ width: 34, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 15 }}><PhosphorIcon name={row.icon} size="feature" color={highlight ? "var(--mb-color-accent)" : "var(--mb-color-text)"} /></span>}
                      extra={<PhosphorIcon name="right" size="control" color="var(--mb-color-text-muted)" />}
                      style={{ background: "transparent", border: "none", padding: "12px 16px" }}
                    >
                      {row.title}
                      <ListItem.Brief>{row.summary}</ListItem.Brief>
                    </ListItem>
                  </List>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {!isPremium ? (
        <div role="button" tabIndex={0} onClick={onOpenPremium} aria-label="Upgrade to Premium"
          style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-premium-border)", background: "var(--mb-color-premium-soft)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 16, lineHeight: "22px", color: "var(--mb-color-text)" }}>Upgrade to Premium</span>
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text-secondary)" }}>Bring your own providers, cloud models, and web search.</span>
          </div>
          <span style={{ minHeight: 44, display: "flex", alignItems: "center", padding: "0 16px", borderRadius: "var(--mb-radius-control)", background: "var(--mb-color-premium)", fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 14, color: "var(--mb-color-on-premium)", whiteSpace: "nowrap" }}>Upgrade</span>
        </div>
      ) : null}

      <span style={{ fontFamily: "var(--mb-text-caption-family)", fontSize: "var(--mb-text-caption-size)", lineHeight: "var(--mb-text-caption-line-height)", textAlign: "center", paddingBottom: 4, color: "var(--mb-color-text-muted)" }}>Version {window.MB_SETTINGS.version}</span>
    </window.SettingsFrame>
  );
}

Object.assign(window, { SettingsOverview });
