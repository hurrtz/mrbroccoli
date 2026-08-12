const { PhosphorIcon, IconButton, RuntimeReadiness, PremiumBand, SettingsGroup } = window.MrBroccoliDesignSystem_62d510;

/** Each capability opens the page that configures it. */
const READINESS_PAGE = { think: "thinking", listen: "listening", speak: "speaking", search: "search" };

/**
 * The settings overview. Same structure in both editions — the free edition
 * keeps every row and page; premium contents unlock in place. Rows report
 * LIVE STATE ("Kokoro · Heart · as it arrives"), so most visits end here.
 */
function SettingsOverview({ isPremium, onOpenPage, onOpenPremium, onClose }) {
  const rows = window.MB_SETTINGS.rows;
  const free = window.MB_SETTINGS.freeRows;
  const [showPremiumCard, setShowPremiumCard] = React.useState(true);
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

      <RuntimeReadiness readiness={window.MB_SETTINGS.readiness} onSelect={(step) => onOpenPage(READINESS_PAGE[step])} />

      {window.MB_SETTINGS.groups.map((group) => (
        <SettingsGroup key={group.title} title={group.title} style={{ padding: 0 }}>
          {group.pages.map((page, index) => {
            const row = rows[page];
            const state = isPremium ? row.state : ((free[page] && free[page].state) || row.state);
            return (
              <div key={page} role="button" onClick={() => onOpenPage(page)} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 64, padding: "0 14px", cursor: "pointer", borderBottom: index === group.pages.length - 1 ? "none" : "1px solid var(--mb-color-border)" }}>
                <PhosphorIcon name={row.icon} size="control" color="var(--mb-color-text)" />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)" }}>{row.title}</span>
                  <span style={{ display: "block", fontFamily: "var(--mb-text-supporting-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{state}</span>
                </span>
                <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />
              </div>
            );
          })}
        </SettingsGroup>
      ))}

      {!isPremium ? (
        <div style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-premium-border)", overflow: "hidden" }}>
          <PremiumBand copy="Every provider, web search, Model Council, premium voices." onPress={onOpenPremium} />
        </div>
      ) : null}

      <span style={{ fontFamily: "var(--mb-text-caption-family)", fontSize: "var(--mb-text-caption-size)", lineHeight: "var(--mb-text-caption-line-height)", textAlign: "center", paddingBottom: 4, color: "var(--mb-color-text-muted)" }}>Version {window.MB_SETTINGS.version}</span>
    </window.SettingsFrame>
  );
}

Object.assign(window, { SettingsOverview });
