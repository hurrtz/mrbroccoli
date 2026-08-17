const { PhosphorIcon } = window.MrBroccoliDesignSystem_62d510;

/** Grouped exactly as the phone's overview (Conversation / Voice / Privacy & app) — a persistent selection, not a push stack, so no chevrons and no "back". */
function CategoryNav({ active, onSelect }) {
  const { groups, rows } = window.MB_SETTINGS;
  return (
    <div style={{ width: 300, flexShrink: 0, height: "100%", overflowY: "auto", borderRight: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)" }}>
      <div style={{ padding: "22px 20px 10px" }}>
        <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 22, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Settings</span>
      </div>
      {groups.map((group) => (
        <div key={group.title} style={{ marginBottom: 6 }}>
          <div style={{ padding: "10px 20px 4px" }}>
            <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "0.9px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>{group.title}</span>
          </div>
          {group.pages.map((key) => {
            const row = rows[key];
            const isActive = key === active;
            return (
              <div key={key} role="button" tabIndex={0} onClick={() => onSelect(key)}
                style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 48, margin: "1px 10px", padding: "0 10px", borderRadius: "var(--mb-radius-control)", cursor: "pointer", background: isActive ? "var(--mb-color-accent-soft)" : "transparent" }}>
                <PhosphorIcon name={row.icon} size="control" color={isActive ? "var(--mb-color-accent)" : "var(--mb-color-text)"} />
                <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: isActive ? "var(--mb-color-accent)" : "var(--mb-color-text)" }}>{row.title}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const PAGES = {
  connections: window.ConnectionsPage, thinking: window.ThinkingPage, search: window.SearchPage,
  listening: window.ListeningPage, speaking: window.SpeakingPage, data: window.DataPrivacyPage, app: window.AppPage,
};

/** Regular width: sidebar master-detail. `onBack` is deliberately withheld from the page — selection happens in the list, there is nothing to back out of. */
function IpadSettingsRegular({ active, onSelect, isPremium, onClose }) {
  const Page = PAGES[active];
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <CategoryNav active={active} onSelect={onSelect} />
      <div style={{ flex: 1, position: "relative" }}>
        <Page onClose={onClose} isPremium={isPremium} />
      </div>
    </div>
  );
}

/** Compact width collapses to exactly the phone's own overview → page push — reused unmodified, not a bespoke narrow layout. */
function IpadSettingsCompact({ isPremium, onClose }) {
  const [page, setPage] = React.useState(null);
  if (!page) return <window.SettingsOverview isPremium={isPremium} onOpenPage={setPage} onOpenPremium={() => {}} onClose={onClose} />;
  const Page = PAGES[page];
  return <Page onBack={() => setPage(null)} onClose={onClose} isPremium={isPremium} />;
}

Object.assign(window, { IpadSettingsRegular, IpadSettingsCompact });
