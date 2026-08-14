const { AppWordmark, PhosphorIcon, IconButton, Input, ConversationDrawerItem } = window.MrBroccoliDesignSystem_62d510;
const IPAD_ASSETS = "../../assets/providers";

/** Regular width: permanent leading column. Never an overlay, never closes — there is no "open the drawer" gesture at this width. */
function IpadSidebar({ conversations, activeId, onSelect, width = 336 }) {
  const [query, setQuery] = React.useState("");
  const rows = conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={{ width, flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", borderRight: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 16px 12px" }}>
        <AppWordmark />
        <div style={{ flex: 1 }} />
        <button type="button" aria-label="New conversation" style={{ width: 44, height: 44, borderRadius: "var(--mb-radius-control)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)" }}>
          <PhosphorIcon name="plus" size="control" color="var(--mb-color-on-active-control)" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid var(--mb-color-border)" }}>
        {rows.map((c) => (
          <ConversationDrawerItem key={c.id} {...c} active={c.id === activeId} assetBase={IPAD_ASSETS} onSelect={() => onSelect(c)} onOpenActions={() => {}} onOpenRoot={() => {}} />
        ))}
      </div>
      <div style={{ padding: "10px 14px 14px", borderTop: "1px solid var(--mb-color-border)" }}>
        <Input value={query} onChange={setQuery} placeholder="Search conversations" ariaLabel="Search conversations" allowClear
          suffix={<span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}><PhosphorIcon name="search" size="compact" color="var(--mb-color-text-muted)" /></span>} />
      </div>
    </div>
  );
}

/** Compact width collapses the sidebar into exactly the phone's overlay drawer — a scrim plus a sliding panel, not a bespoke tablet treatment. */
function IpadDrawerOverlay({ conversations, activeId, onSelect, onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex" }}>
      <div style={{ width: "82%", maxWidth: 340, height: "100%", background: "var(--mb-color-surface)", display: "flex", flexDirection: "column", boxShadow: "8px 0 28px rgba(0,0,0,.28)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px" }}>
          <IconButton icon="close" accessibilityLabel="Close conversations" onClick={onClose} />
          <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 18, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Conversations</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid var(--mb-color-border)" }}>
          {conversations.map((c) => (
            <ConversationDrawerItem key={c.id} {...c} active={c.id === activeId} assetBase={IPAD_ASSETS} onSelect={() => { onSelect(c); onClose(); }} onOpenActions={() => {}} onOpenRoot={() => {}} />
          ))}
        </div>
      </div>
      <div role="button" tabIndex={0} aria-label="Close conversations" onClick={onClose} style={{ flex: 1, background: "var(--mb-color-overlay)" }} />
    </div>
  );
}

Object.assign(window, { IpadSidebar, IpadDrawerOverlay });
