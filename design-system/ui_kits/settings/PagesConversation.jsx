const { SettingsGroup, SettingsRow, RouteOptionRow, IconAction, PremiumBand, ProviderIcon, PhosphorIcon } = window.MrBroccoliDesignSystem_62d510;
const CONN_ASSETS = "../../assets/providers";

/** The single state-driven action at a model row's edge. */
function modelAction(kind) {
  if (kind === "download") return <IconAction icon="download" label="Download" />;
  if (kind === "cancel") return <IconAction icon="close" label="Cancel download" danger />;
  if (kind === "test") return <IconAction icon="egg" label="Test on this phone" />;
  if (kind === "testing") return <IconAction icon="loading" label="Testing" spin />;
  if (kind === "retest") return <IconAction icon="egg-cracked" label="Test again" />;
  if (kind === "update") return <IconAction icon="reload" label="Update" />;
  return null;
}
window.modelAction = modelAction;

/** Connections — resource page: keys and their health. Free edition: same page, contents locked. */
function ConnectionsPage({ onBack, onClose, isPremium = true }) {
  const tone = { healthy: ["Working", "var(--mb-color-success)", "rgba(60,140,80,.1)"], configured: ["Not tested", "var(--mb-color-text-secondary)", "var(--mb-color-surface-raised)"], failing: ["Failing", "var(--mb-color-danger)", "rgba(200,70,50,.1)"], none: ["No key", "var(--mb-color-text-muted)", "var(--mb-color-surface-raised)"] };
  return (
    <window.SettingsFrame title="Connections" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Providers" footer="Keys stay in the device keychain and are sent only to their own provider." style={{ padding: 0 }}>
        {window.MB_SETTINGS.providers.map((provider, index) => {
          const [label, color, bg] = tone[provider.health];
          const last = index === window.MB_SETTINGS.providers.length - 1;
          if (!isPremium) return <RouteOptionRow key={provider.id} locked label={provider.label} meta={provider.capabilities} last={last} />;
          return (
            <div key={provider.id} role="button" style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 60, padding: "9px 14px", cursor: "pointer", borderBottom: last ? "none" : "1px solid var(--mb-color-border)" }}>
              <ProviderIcon provider={provider.id} size="control" color="var(--mb-color-text)" assetBase={CONN_ASSETS} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)" }}>{provider.label}</span>
                <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>{provider.capabilities}</span>
              </span>
              <span style={{ flexShrink: 0, padding: "4px 10px", borderRadius: 99, fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, color, background: bg }}>{label}</span>
              <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />
            </div>
          );
        })}
        {!isPremium ? <PremiumBand copy="Bring your own provider keys. One purchase, no subscription." /> : null}
      </SettingsGroup>
    </window.SettingsFrame>
  );
}

/** Thinking — answering models as coexisting slots; Council; system prompt. */
function ThinkingPage({ onBack, onClose }) {
  const [slotSheet, setSlotSheet] = React.useState(null);
  return (
    <window.SettingsFrame title="Thinking" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Answering models" footer="Up to four; the home screen switches who answers the next turn. A model you don't have yet is downloaded or connected right here." style={{ padding: 0 }}>
        {window.MB_SETTINGS.slots.map((slot) => (
          <div key={slot.n} role="button" onClick={() => setSlotSheet(slot)} style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 56, padding: "9px 14px", cursor: "pointer", borderBottom: "1px solid var(--mb-color-border)" }}>
            <span style={{ width: 24, height: 24, borderRadius: 12, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--mb-color-border-strong)", fontFamily: "var(--mb-font-mono)", fontSize: 11, color: "var(--mb-color-text-secondary)" }}>{slot.n}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slot.name}</span>
              <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>{slot.meta}</span>
            </span>
            <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />
          </div>
        ))}
        <SettingsRow icon="plus" label="Add a model" accent control={null} last />
      </SettingsGroup>
      <SettingsGroup title="Model Council" footer="Several models answer, review each other, and one synthesises." style={{ padding: 0 }}>
        <SettingsRow icon="council" label="Council" value="On · 3 models" last />
      </SettingsGroup>
      <SettingsGroup title="System prompt" style={{ padding: 0 }}>
        <SettingsRow icon="file-text" label="System prompt" value="Custom" last />
      </SettingsGroup>
      {slotSheet ? <window.SlotSheet slot={slotSheet} onClose={() => setSlotSheet(null)} /> : null}
    </window.SettingsFrame>
  );
}

/** The slot sheet: configure one answering model — provider, model, the model's own effort ladder, remove. */
function SlotSheet({ slot, onClose }) {
  const chip = (label, on) => <span key={label} role="button" aria-pressed={on ? "true" : "false"} style={{ minHeight: 34, padding: "6px 13px", borderRadius: 99, cursor: "pointer", display: "inline-flex", alignItems: "center", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 13, border: "1px solid " + (on ? "var(--mb-color-accent)" : "var(--mb-color-border)"), background: on ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface)", color: on ? "var(--mb-color-text)" : "var(--mb-color-text-secondary)" }}>{label}</span>;
  const value = (label, val) => (
    <div role="button" style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, cursor: "pointer" }}>
      <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, color: "var(--mb-color-text-secondary)" }}>{label}</span><span style={{ flex: 1 }} />
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text)" }}>{val}</span>
      <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "var(--mb-color-overlay)" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", background: "var(--mb-color-background)", borderRadius: "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0", border: "1px solid var(--mb-color-surface-raised-border)", borderBottom: "none", boxShadow: "var(--mb-shadow-sheet)", padding: "10px 18px 22px" }}>
        <span style={{ display: "block", width: 38, height: 4, borderRadius: 2, margin: "0 auto 10px", background: "var(--mb-color-border-strong)" }} />
        <div style={{ marginBottom: 8 }}>
          <span style={{ display: "block", fontFamily: "var(--mb-font-headline)", fontSize: 17, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Answering model {slot.n}</span>
          <span style={{ display: "block", marginTop: 2, fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>Switchable from the home screen byline</span>
        </div>
        {value("Provider", "Anthropic")}
        {value("Model", slot.name)}
        <div style={{ margin: "10px 0 4px" }}>
          <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--mb-color-text-muted)" }}>Effort · this model's own ladder</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{chip("Low", false)}{chip("Medium", true)}{chip("High", false)}</div>
        </div>
        <div role="button" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 48, cursor: "pointer", marginTop: 6, borderTop: "1px solid var(--mb-color-border)" }}>
          <PhosphorIcon name="delete" size="compact" color="var(--mb-color-danger)" />
          <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-danger)" }}>Remove this answering model</span>
        </div>
      </div>
    </div>
  );
}

/** Search — who searches + quality. */
function SearchPage({ onBack, onClose }) {
  return (
    <window.SettingsFrame title="Search" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Who searches" footer="Search runs inside an answer when the model decides it needs the web. Providers appear once connected under Connections." style={{ padding: 0 }}>
        <RouteOptionRow label="Nobody" meta="Answers use the model alone" />
        <RouteOptionRow selected label="OpenAI" meta="Via provider · your key" last />
      </SettingsGroup>
      <SettingsGroup title="Quality" style={{ padding: 0 }}>
        <SettingsRow icon="line-chart" label="Results per query" value="5" />
        <SettingsRow icon="check-circle" label="Prefer recent sources" control={<window.KitSwitch on />} last />
      </SettingsGroup>
    </window.SettingsFrame>
  );
}

Object.assign(window, { ConnectionsPage, ThinkingPage, SearchPage, SlotSheet });
