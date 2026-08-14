const { SettingsGroup, SettingsRow, AutoSetupCard, PhosphorIcon } = window.MrBroccoliDesignSystem_62d510;

/** Data & privacy — everything the app keeps on disk: knowledge, archive, backups, models. */
function DataPrivacyPage({ onBack, onClose }) {
  return (
    <window.SettingsFrame title="Data & privacy" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Conversation knowledge" footer="Private conversations are always excluded." style={{ padding: 0 }}>
        <SettingsRow icon="brain" label="Use past conversations" control={<window.KitSwitch on />} last />
      </SettingsGroup>
      <SettingsGroup title="Archive" style={{ padding: 0 }}>
        <SettingsRow icon="inbox" label="Archived conversations" value="2" last />
      </SettingsGroup>
      <SettingsGroup title="Backup" footer="Encrypted with your passphrase; provider keys never leave the keychain." style={{ padding: 0 }}>
        <SettingsRow icon="export" label="Export encrypted backup" />
        <SettingsRow icon="download" label="Import backup" last />
      </SettingsGroup>
      <SettingsGroup title="Storage · 2.8 GB in models" footer="Download, test and choice live in Thinking, Listening and Speaking; this list only frees space." style={{ padding: 0 }}>
        {window.MB_SETTINGS.storage.map((model, index) => (
          <div key={model.name} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 52, padding: "8px 14px", borderBottom: index === window.MB_SETTINGS.storage.length - 1 ? "none" : "1px solid var(--mb-color-border)" }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{model.name}</span>
              <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>{model.cap} · {model.size}</span>
            </span>
            <span role="button" style={{ minHeight: 44, padding: "6px 13px", borderRadius: "var(--mb-radius-control)", cursor: "pointer", display: "inline-flex", alignItems: "center", flexShrink: 0, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 13, border: "1px solid var(--mb-color-danger)", color: "var(--mb-color-danger)" }}>{model.state === "downloading" ? "Cancel" : "Remove"}</span>
          </div>
        ))}
      </SettingsGroup>
    </window.SettingsFrame>
  );
}

/** App & diagnostics — appearance, home-screen toggles, diagnostics. */
function AppPage({ onBack, onClose, auto }) {
  return (
    <window.SettingsFrame title="App & diagnostics" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Automatic setup" footer="Measures this phone and installs an on-device set that fits it. Also offered from the introduction." style={{ padding: 0 }}>
        <div style={{ padding: "12px 14px" }}><AutoSetupCard showHeader={false} {...(auto ? auto.cardProps : {})} /></div>
      </SettingsGroup>
      <SettingsGroup title="Appearance" style={{ padding: 0 }}>
        <SettingsRow icon="eye" label="Theme" value="Dark" />
        <SettingsRow icon="global" label="App language" value="English" last />
      </SettingsGroup>
      <SettingsGroup title="Home screen" style={{ padding: 0 }}>
        <SettingsRow icon="info-circle" label="Introduction banner" control={<window.KitSwitch />} />
        <SettingsRow icon="line-chart" label="Usage stats in transcripts" control={<window.KitSwitch on />} last />
      </SettingsGroup>
      <SettingsGroup title="Diagnostics" style={{ padding: 0 }}>
        <SettingsRow icon="audio" label="Speech diagnostics" value="3 recent" />
        <SettingsRow icon="bug" label="Debug log button" control={<window.KitSwitch />} />
        <SettingsRow icon="cpu" label="Runtime overrides" value="None" last />
      </SettingsGroup>
    </window.SettingsFrame>
  );
}

Object.assign(window, { DataPrivacyPage, AppPage });
