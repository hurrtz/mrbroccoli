const { AntSectionIntro, AntSettingsCard, AntSwitchRow, AntPickerSection, AntPickerRow,
        AntPickerRows, AntButtonLabel, Button, IconButton, PhosphorIcon } = window.MrBroccoliDesignSystem_62d510;

/** Data & privacy — knowledge, archive, and app data backup. */
function DataPrivacyPage({ onBack, onClose }) {
  const [knowledge, setKnowledge] = React.useState(false);
  return (
    <window.SettingsFrame title="Data & privacy" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Past conversation knowledge" />
          <AntSettingsCard>
            <AntSwitchRow label="Use past conversation knowledge" description="Earlier conversations on this device can inform new answers." value={knowledge} onChange={setKnowledge} />
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="AI conversation archive" />
          <AntSettingsCard>
            <window.HelperText>No folder connected. Conversations stay in the app until you choose somewhere to keep them.</window.HelperText>
            <div style={{ alignSelf: "flex-start" }}>
              <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="folder-open" label="Choose folder" /></Button>
            </div>
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="App data backup" />
          <AntSettingsCard>
            <window.HelperText>A backup carries settings, conversations, and provider keys. The readable form is not encrypted.</window.HelperText>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="export" label="Export readable backup" /></Button>
              <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="lock" label="Export encrypted backup" /></Button>
            </div>
          </AntSettingsCard>
          <AntSectionIntro title="Import backup" />
          <AntSettingsCard>
            <div style={{ alignSelf: "flex-start" }}>
              <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="download" label="Import backup" /></Button>
            </div>
          </AntSettingsCard>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

/** App & diagnostics — appearance, language, usage, and recent speech activity. */
function AppPage({ onBack, onClose }) {
  const [theme, setTheme] = React.useState("system");
  const [language, setLanguage] = React.useState("en");
  const [banner, setBanner] = React.useState(true);
  const [debug, setDebug] = React.useState(false);
  return (
    <window.SettingsFrame title="App & diagnostics" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntPickerSection title="Appearance">
            <AntPickerRows>
              <AntPickerRow label="Theme" value={theme} onChange={setTheme}
                options={[{ value: "system", label: "Follow the system" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
              <AntPickerRow label="Language" value={language} onChange={setLanguage}
                options={[{ value: "en", label: "English" }, { value: "de", label: "German" }, { value: "ar", label: "Arabic" }, { value: "ja", label: "Japanese" }]} />
            </AntPickerRows>
          </AntPickerSection>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSettingsCard title="Usage Stats">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <window.HelperText>This month</window.HelperText>
              <window.HelperText>412 turns · 1.9 M tokens</window.HelperText>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <window.HelperText>Spoken aloud</window.HelperText>
              <window.HelperText>3 h 12 m</window.HelperText>
            </div>
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSettingsCard>
            <AntSwitchRow label="Show guided setup in Settings" description="Show or hide the guided setup shortcut on the Settings overview." value={banner} onChange={setBanner} />
            <AntSwitchRow label="Debug Log Button" description="Adds a capture control to the workspace top bar." value={debug} onChange={setDebug} />
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="Recent Speech Activity" extra={<IconButton icon="delete" accessibilityLabel="Clear speech diagnostics" onClick={() => {}} />} />
          <AntSettingsCard>
            {window.MB_SETTINGS.speechActivity.map((entry, index) => (
              <div key={entry.at} style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: index === 0 ? 0 : 10, borderTop: index === 0 ? "none" : "1px solid var(--mb-color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "0.4px", color: "var(--mb-color-text-muted)" }}>{entry.at}</span>
                  <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 11, letterSpacing: "0.4px", color: "var(--mb-color-text-muted)" }}>{entry.route}</span>
                </div>
                <window.HelperText>{entry.detail}</window.HelperText>
              </div>
            ))}
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSettingsCard title="Runtime compatibility">
            <window.HelperText>No overrides recorded. Overrides appear when a provider reports a capability it cannot deliver.</window.HelperText>
          </AntSettingsCard>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

Object.assign(window, { DataPrivacyPage, AppPage });
