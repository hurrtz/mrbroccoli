const { AntSectionIntro, AntSettingsCard, AntDisclosureCard, AntSwitchRow, AntPickerSection,
        AntPickerRow, AntPickerRows, AntNumberInputRow, AntTextArea, AntButtonLabel,
        Button, IconButton, Input, PhosphorIcon, ProviderIcon } = window.MrBroccoliDesignSystem_62d510;

const KIT_ASSETS = "../../assets/providers";

/** Connections — one disclosure card per provider, key field inside. */
function ConnectionsPage({ onBack, onClose }) {
  const [open, setOpen] = React.useState("openai");
  const [revealed, setRevealed] = React.useState(false);
  return (
    <window.SettingsFrame title="Connections" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Providers" description="Provider keys, validation, and capabilities." />
          {window.MB_SETTINGS.providers.map((provider) => (
            <AntDisclosureCard
              key={provider.id}
              expanded={open === provider.id}
              onToggle={() => setOpen(open === provider.id ? null : provider.id)}
              toggleAccessibilityLabel={"Show " + provider.label + " settings"}
              header={
                <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-surface-alt)" }}>
                    <ProviderIcon provider={provider.id} label={provider.label} size="navigation" color="var(--mb-color-text)" assetBase={KIT_ASSETS} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 16, lineHeight: "21px", color: "var(--mb-color-text)" }}>{provider.label}</span>
                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                      <window.ProviderStatus health={provider.health} />
                      {provider.capabilities.map((capability) => <window.CapabilityTag key={capability}>{capability}</window.CapabilityTag>)}
                    </div>
                  </div>
                </div>
              }
            >
              <Input
                type={revealed ? "text" : "password"}
                value={provider.health === "none" ? "" : "sk-live-8f2c9d41ab"}
                placeholder="Paste the API key"
                onChange={() => {}}
                suffix={<IconButton icon={revealed ? "eye-invisible" : "eye"} accessibilityLabel={revealed ? "Hide key" : "Show key"} onClick={() => setRevealed(!revealed)} />}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="reload" label="Validate" /></Button>
                <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="info-circle" label="About" /></Button>
              </div>
              <window.HelperText>Keys are stored in the device keychain and never leave it.</window.HelperText>
            </AntDisclosureCard>
          ))}
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

/** Thinking — model selection, Model Council, system prompt. */
function ThinkingPage({ onBack, onClose }) {
  const [council, setCouncil] = React.useState(true);
  const [rounds, setRounds] = React.useState(2);
  const [prompt, setPrompt] = React.useState("Answer in full sentences. Never use lists or headings, because replies are read aloud.");
  const [modes, setModes] = React.useState(window.MB_SETTINGS.responseModes);
  // ThinkingSettingsPage receives a pre-filtered llmProviders prop — the page is
  // never handed the full set, so a TTS-only provider can never be picked here.
  const providerOptions = window.MB_SETTINGS.providers
    .filter((provider) => provider.capabilities.includes("LLM"))
    .map((provider) => ({ value: provider.label, label: provider.label }))
    .concat([{ value: "On device", label: "On device" }]);
  const setMode = (id, partial) => setModes(modes.map((mode) => (mode.id === id ? { ...mode, ...partial } : mode)));
  return (
    <window.SettingsFrame title="Thinking" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Model Selection" extra={<IconButton icon="info-circle" accessibilityLabel="About model selection" onClick={() => {}} />} />
          {modes.map((mode, index) => {
            const models = window.MB_SETTINGS.providerModels[mode.providerLabel] || [];
            return (
              <AntSettingsCard
                key={mode.id}
                title={"Model " + (index + 1)}
                headerExtra={<IconButton icon="delete" accessibilityLabel="Remove model" onClick={() => {}} />}
              >
                <AntPickerRows>
                  <AntPickerRow label="Provider" value={mode.providerLabel} options={providerOptions}
                    onChange={(value) => setMode(mode.id, { providerLabel: value, model: (window.MB_SETTINGS.providerModels[value] || [""])[0] })} />
                  <AntPickerRow label="Model" value={mode.model} options={models.map((value) => ({ value, label: value }))}
                    onChange={(value) => setMode(mode.id, { model: value })} />
                  {mode.providerLabel === "On device" ? null : (
                    <AntPickerRow label="Effort" value={mode.effort}
                      options={["Minimal", "Low", "Medium", "High", "Extra high"].map((value) => ({ value, label: value }))}
                      onChange={(value) => setMode(mode.id, { effort: value })} />
                  )}
                </AntPickerRows>
              </AntSettingsCard>
            );
          })}
          <div style={{ alignSelf: "flex-start", marginTop: 2 }}>
            <Button size="small"><AntButtonLabel color="var(--mb-color-accent)" icon="plus" label="Add model" /></Button>
          </div>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="Model Council" extra={<IconButton icon="info-circle" accessibilityLabel="About Model Council" onClick={() => {}} />} />
          <AntSettingsCard>
            <AntSwitchRow label="Show Model Council on the home screen" value={council} onChange={setCouncil} />
            {council ? <AntNumberInputRow label="Review rounds" value={rounds} onChange={setRounds} min={1} /> : null}
          </AntSettingsCard>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="System Prompt" extra={<IconButton icon="info-circle" accessibilityLabel="About the system prompt" onClick={() => {}} />} />
          <AntSettingsCard>
            <AntTextArea value={prompt} placeholder="Describe how replies should be written." onChange={setPrompt} />
          </AntSettingsCard>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

/** Search — provider, then an advanced disclosure of quality controls. */
function SearchPage({ onBack, onClose }) {
  const [advanced, setAdvanced] = React.useState(false);
  const [provider, setProvider] = React.useState("brave");
  const [count, setCount] = React.useState("5");
  return (
    <window.SettingsFrame title="Search" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Web Search" description="Web search provider and search quality controls."
            extra={<IconButton icon="info-circle" accessibilityLabel="About web search" onClick={() => {}} />} />
          <AntPickerSection title="Web Search Provider">
            <AntPickerRow label="Provider" value={provider} onChange={setProvider}
              options={[{ value: "brave", label: "Brave" }, { value: "exa", label: "Exa" }, { value: "tavily", label: "Tavily" }, { value: "perplexity", label: "Perplexity" }]} />
          </AntPickerSection>
        </window.SectionGroup>

        <window.SectionGroup>
          <AntDisclosureCard
            expanded={advanced}
            onToggle={() => setAdvanced(!advanced)}
            toggleAccessibilityLabel="Show advanced search controls"
            header={<span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, lineHeight: "21px", color: "var(--mb-color-text)" }}>Advanced Search Controls</span>}
          >
            <AntPickerRows>
              <AntPickerRow label="Result Count" value={count} onChange={setCount}
                options={["3", "5", "8", "10"].map((value) => ({ value, label: value }))} />
              <AntPickerRow label="Search Depth" value="standard" onChange={() => {}}
                options={[{ value: "standard", label: "Standard" }, { value: "deep", label: "Deep" }]} />
              <AntPickerRow label="Search Mode" value="balanced" onChange={() => {}}
                options={[{ value: "balanced", label: "Balanced" }, { value: "news", label: "News" }, { value: "academic", label: "Academic" }]} />
            </AntPickerRows>
          </AntDisclosureCard>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

Object.assign(window, { ConnectionsPage, ThinkingPage, SearchPage });
