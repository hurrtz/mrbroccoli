const { IconButton, PhosphorIcon, ConversationDrawerItem, Input } = window.MrBroccoliDesignSystem_62d510;

const DRAWER_ASSETS = "../../assets/providers";

function ConversationDrawerScreen({ onClose, activeId, onSelect }) {
  const [query, setQuery] = React.useState("");
  const rows = window.MB_DATA.conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--mb-color-background)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 18px 14px", borderBottom: "1px solid var(--mb-color-border)" }}>
        <IconButton icon="close" accessibilityLabel="Close conversations" onClick={onClose} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 20, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Conversations</span>
        </div>
        <span style={{ width: 44 }} />
      </div>
      <button type="button" onClick={onClose} style={{ margin: "14px 18px", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: "var(--mb-radius-card)", border: "none", background: "var(--mb-color-accent)", cursor: "pointer" }}>
        <PhosphorIcon name="plus" size="compact" color="#F4F8FF" />
        <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, color: "#F4F8FF" }}>New conversation</span>
      </button>
      <div style={{ margin: "0 18px 14px" }}>
        <Input value={query} onChange={setQuery} placeholder="Search conversations" ariaLabel="Search conversations" allowClear
          suffix={<span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}><PhosphorIcon name="search" size="compact" color="var(--mb-color-text-muted)" /></span>} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", borderTop: "1px solid var(--mb-color-border)" }}>
        {rows.length === 0 ? (
          <div style={{ padding: "26px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 28 }}>
            <span style={{ width: 46, height: 46, borderRadius: 23, border: "1px solid var(--mb-color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhosphorIcon name="inbox" size="navigation" color="var(--mb-color-text-secondary)" />
            </span>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, color: "var(--mb-color-text)" }}>Nothing matches</span>
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "21px", color: "var(--mb-color-text-secondary)" }}>Try a shorter search.</span>
          </div>
        ) : rows.map((conversation) => (
          <ConversationDrawerItem key={conversation.id} {...conversation} active={conversation.id === activeId}
            assetBase={DRAWER_ASSETS} onSelect={() => onSelect(conversation)} onOpenActions={() => {}} onToggleBranches={() => {}} />
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ConversationDrawerScreen });
