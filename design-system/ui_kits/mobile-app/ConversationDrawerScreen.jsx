const { IconButton, PhosphorIcon, ConversationDrawerItem, ConversationRenameModal, AnchoredMenu, Input } = window.MrBroccoliDesignSystem_62d510;

const DRAWER_ASSETS = "../../assets/providers";

function SectionBand({ children, top, onClick, chevron }) {
  return (
    <div role={onClick ? "button" : undefined} onClick={onClick} style={{ marginTop: top ? 20 : 0, padding: "9px " + (chevron ? "8px" : "18px") + " 9px 18px", background: "var(--mb-color-surface-raised)", borderTop: "1px solid var(--mb-color-border)", borderBottom: "1px solid var(--mb-color-border)", display: "flex", alignItems: "center", cursor: onClick ? "pointer" : undefined }}>
      <span style={{ flex: 1, fontFamily: "var(--mb-font-body-medium)", fontWeight: 600, fontSize: 12, lineHeight: "16px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--mb-color-text-secondary)" }}>{children}</span>
      {chevron ? <span style={{ width: 44, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}><PhosphorIcon name={chevron} size="compact" color="var(--mb-color-text-secondary)" /></span> : null}
    </div>
  );
}

function ConversationDrawerScreen({ onClose, activeId, onSelect }) {
  const [query, setQuery] = React.useState("");
  const [archivedOpen, setArchivedOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState(() => window.MB_DATA.conversations.map((c) => ({ ...c })));
  const [actionId, setActionId] = React.useState(null);
  const [menuTop, setMenuTop] = React.useState(120);
  const [renaming, setRenaming] = React.useState(null);
  const [renameDraft, setRenameDraft] = React.useState("");
  const rootRef = React.useRef(null);
  const rowRefs = React.useRef({});
  const patch = (id, fn) => setConversations((all) => all.map((c) => (c.id === id ? { ...c, ...fn(c) } : c)));
  const openMenu = (id) => {
    const row = rowRefs.current[id]; const root = rootRef.current;
    if (row && root) {
      const top = row.getBoundingClientRect().top - root.getBoundingClientRect().top + 42;
      setMenuTop(Math.max(70, Math.min(top, root.clientHeight - 330)));
    }
    setActionId(id);
  };
  const q = query.toLowerCase();
  const all = conversations;
  const matches = (c) => c.title.toLowerCase().includes(q);
  const rows = all.filter((c) => !c.archived && matches(c));
  const archived = all.filter((c) => c.archived && matches(c));
  const pinned = rows.filter((c) => c.pinned);
  const earlier = rows.filter((c) => !c.pinned);
  const active = all.find((c) => c.id === actionId) || null;
  const item = (c) => (
    <div key={c.id} ref={(node) => { rowRefs.current[c.id] = node; }}>
      <ConversationDrawerItem {...c} active={c.id === activeId} assetBase={DRAWER_ASSETS}
        onSelect={() => onSelect(c)} onOpenActions={() => openMenu(c.id)}
        onOpenRoot={() => { const root = all.find((r) => r.title === c.forkOf); if (root) onSelect(root); }} />
    </div>
  );
  return (
    <div ref={rootRef} style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", background: "var(--mb-color-background)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "8px 18px 14px", borderBottom: "1px solid var(--mb-color-border)" }}>
        <IconButton icon="close" accessibilityLabel="Close conversations" onClick={onClose} />
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 20, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Conversations</span>
        </div>
        <button type="button" aria-label="New conversation" onClick={onClose} style={{ width: 44, height: 44, borderRadius: "var(--mb-radius-icon-button)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)", boxShadow: "0 2px 10px rgba(0,0,0,.18)" }}>
          <PhosphorIcon name="plus" size="control" color="var(--mb-color-on-active-control)" />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {rows.length === 0 && archived.length === 0 ? (
          <div style={{ padding: "26px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 28 }}>
            <span style={{ width: 46, height: 46, borderRadius: "var(--mb-radius-icon-button)", border: "1px solid var(--mb-color-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhosphorIcon name="inbox" size="navigation" color="var(--mb-color-text-secondary)" />
            </span>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, color: "var(--mb-color-text)" }}>Nothing matches</span>
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "21px", color: "var(--mb-color-text-secondary)" }}>Try a shorter search.</span>
          </div>
        ) : (
          <>
            {pinned.length ? <SectionBand>Pinned</SectionBand> : null}
            {pinned.map(item)}
            {earlier.length ? <SectionBand top={pinned.length > 0}>Earlier</SectionBand> : null}
            {earlier.map(item)}
            {archived.length ? (
              <SectionBand top onClick={() => setArchivedOpen(!archivedOpen)} chevron={archivedOpen ? "up" : "down"}>Archived · {archived.length}</SectionBand>
            ) : null}
            {archivedOpen ? archived.map(item) : null}
            <div style={{ height: 24 }} />
          </>
        )}
      </div>
      <div style={{ flexShrink: 0, padding: "10px 18px 26px", borderTop: "1px solid var(--mb-color-border)", background: "var(--mb-color-background)" }}>
        <Input value={query} onChange={setQuery} placeholder="Search titles, models, and message text" ariaLabel="Search conversations" allowClear
          suffix={<span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}><PhosphorIcon name="search" size="compact" color="var(--mb-color-text-muted)" /></span>} />
      </div>
      {AnchoredMenu && active ? (
        <AnchoredMenu inline onClose={() => setActionId(null)} style={{ top: menuTop, right: 12 }}
          groups={[
            [
              { icon: "pushpin", label: active.pinned ? "Unpin" : "Pin", onPress: () => patch(active.id, (c) => ({ pinned: !c.pinned })) },
              { icon: "inbox", label: active.archived ? "Unarchive" : "Archive", onPress: () => patch(active.id, (c) => ({ archived: !c.archived, pinned: false })) },
              { icon: active.isPrivate ? "global" : "lock", label: active.isPrivate ? "Include in knowledge" : "Mark private", onPress: () => patch(active.id, (c) => ({ isPrivate: !c.isPrivate })) },
            ],
            [
              { icon: "edit", label: "Rename", onPress: () => { setRenameDraft(active.title); setRenaming(active); } },
              { icon: "thunderbolt", label: "Name automatically", onPress: () => {} },
            ],
            [
              { icon: "share-alt", label: "Share", onPress: () => {} },
              { icon: "copy", label: "Copy", onPress: () => {} },
            ],
            [
              { icon: "delete", label: "Delete", danger: true, onPress: () => setConversations((cs) => cs.filter((c) => c.id !== active.id)) },
            ],
          ]} />
      ) : null}
      <ConversationRenameModal inline visible={!!renaming} title={renaming ? renaming.title : ""} value={renameDraft} onChange={setRenameDraft}
        onSubmit={() => { patch(renaming.id, () => ({ title: renameDraft.trim() })); setRenaming(null); setActionId(null); }}
        onClose={() => setRenaming(null)} />
    </div>
  );
}

Object.assign(window, { ConversationDrawerScreen });
