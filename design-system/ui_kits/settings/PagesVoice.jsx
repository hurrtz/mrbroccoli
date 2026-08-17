const { SettingsGroup, SettingsRow, RouteOptionRow, IconAction, PhosphorIcon, Switch } = window.MrBroccoliDesignSystem_62d510;

/** Kit wrapper: local state around the system Switch, with the raw track as fallback. */
function KitSwitch({ on }) {
  const [state, setState] = React.useState(!!on);
  if (Switch) return <Switch value={state} onChange={setState} />;
  return (
    <span role="switch" aria-checked={state ? "true" : "false"} onClick={(e) => { e.stopPropagation(); setState(!state); }}
      style={{ width: 46, minHeight: 44, flexShrink: 0, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <span aria-hidden="true" style={{ width: 46, height: 28, borderRadius: 14, position: "relative", display: "block", background: state ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)", transition: "background .15s" }}>
        <span style={{ position: "absolute", top: 2, left: state ? 20 : 2, width: 24, height: 24, borderRadius: 12, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.25)", transition: "left .15s" }} />
      </span>
    </span>
  );
}
window.KitSwitch = KitSwitch;

/** The searchable voice picker sheet — scales to provider catalogues with dozens of voices. */
function VoiceSheet({ onClose }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "var(--mb-color-overlay)" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", maxHeight: "78%", background: "var(--mb-color-background)", borderRadius: "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0", border: "1px solid var(--mb-color-surface-raised-border)", borderBottom: "none", boxShadow: "var(--mb-shadow-sheet)" }}>
        <div style={{ flexShrink: 0, padding: "10px 18px 10px" }}>
          <span style={{ display: "block", width: 38, height: 4, borderRadius: 2, margin: "0 auto 10px", background: "var(--mb-color-border-strong)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1, fontFamily: "var(--mb-font-headline)", fontSize: 17, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Voice · Kokoro</span>
            <span style={{ fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" }}>54 voices</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, minHeight: 44, marginTop: 8, padding: "0 13px", borderRadius: "var(--mb-radius-control)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)" }}>
            <PhosphorIcon name="search" size="compact" color="var(--mb-color-text-muted)" />
            <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, color: "var(--mb-color-text-muted)" }}>Search voices</span>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 6px 18px 18px" }}>
          {window.MB_SETTINGS.voices.map((voice, index) => (
            <div key={voice.n} role="button" aria-pressed={voice.on ? "true" : "false"} style={{ display: "flex", alignItems: "center", gap: 11, minHeight: 50, cursor: "pointer", borderBottom: index === window.MB_SETTINGS.voices.length - 1 ? "none" : "1px solid var(--mb-color-border)" }}>
              <span style={{ width: 20, height: 20, borderRadius: 10, flexShrink: 0, border: "2px solid " + (voice.on ? "var(--mb-color-accent)" : "var(--mb-color-border-strong)"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                {voice.on ? <span style={{ width: 10, height: 10, borderRadius: 5, background: "var(--mb-color-accent)" }} /> : null}
              </span>
              <span style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text)" }}>{voice.n}</span>
                <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 12, color: "var(--mb-color-text-secondary)" }}>{voice.d}</span>
              </span>
              <span role="button" aria-label={"Test " + voice.n} style={{ width: 44, height: 44, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                <PhosphorIcon name="play-circle" size="control" color="var(--mb-color-accent)" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Listening — input + the unified "Who listens" picker with every lifecycle state. */
function ListeningPage({ onBack, onClose }) {
  return (
    <window.SettingsFrame title="Listening" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Input" footer="The languages you speak. Recognition follows them, and on-device models, voices and recognisers are offered to match — adding a language downloads what it needs." style={{ padding: 0 }}>
        <SettingsRow icon="mic" label="Input mode" value="Push to talk" />
        <SettingsRow icon="global" label="Languages" value="English, German" last />
      </SettingsGroup>
      <SettingsGroup title="Who listens" footer="One choice across every runtime. A radio unlocks only after a viable test — testing is the egg, and it cracks when a model fails. Removing an installed model is a swipe. Provider routes appear once connected under Connections." style={{ padding: 0 }}>
        {window.MB_SETTINGS.listenModels.map((model, index) => (
          <RouteOptionRow key={model.id} selected={!!model.selected} disabled={!!model.disabled}
            label={model.label} meta={model.meta} action={window.modelAction(model.action)}
            last={index === window.MB_SETTINGS.listenModels.length - 1} />
        ))}
      </SettingsGroup>
    </window.SettingsFrame>
  );
}

/** Speaking — playback + the unified "Who speaks" picker; free edition ghosts the provider routes. */
function SpeakingPage({ onBack, onClose, isPremium = true }) {
  const [voiceSheet, setVoiceSheet] = React.useState(false);
  const voiceRow = (
    <div role="button" onClick={() => setVoiceSheet(true)} style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, cursor: "pointer" }}>
      <span style={{ fontFamily: "var(--mb-text-body-family)", fontSize: 14, color: "var(--mb-color-text-secondary)" }}>Voice</span><span style={{ flex: 1 }} />
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, color: "var(--mb-color-text)" }}>Heart</span>
      <PhosphorIcon name="right" size="inline" color="var(--mb-color-text-muted)" />
    </div>
  );
  return (
    <window.SettingsFrame title="Speaking" onBack={onBack} onClose={onClose}>
      <SettingsGroup title="Playback" style={{ padding: 0 }}>
        <SettingsRow icon="play-circle" label="Start speaking" value="As it arrives" />
        <SettingsRow icon="edit" label="Speaking instructions" value="Off" last />
      </SettingsGroup>
      <SettingsGroup title="Who speaks" footer="One choice across every runtime. On-device downloads happen right here; provider routes appear once their key is connected under Connections." style={{ padding: 0 }}>
        {window.MB_SETTINGS.speakModels.map((model, index) => {
          const last = index === window.MB_SETTINGS.speakModels.length - 1 && isPremium;
          if (model.providerOnly && !isPremium) return <RouteOptionRow key={model.id} locked label={model.label} meta={model.meta} last={false} />;
          return <RouteOptionRow key={model.id} selected={!!model.selected} disabled={!!model.disabled}
            label={model.label} meta={model.meta} action={window.modelAction(model.action)}
            sub={model.voice ? voiceRow : null} last={last} />;
        })}
        </SettingsGroup>
      <SettingsGroup title="Storage" footer="Spoken replies are kept so they can be replayed without synthesising again." style={{ padding: 0 }}>
        <SettingsRow icon="delete" label="Clear speech replay cache" danger control={null} last />
      </SettingsGroup>
      {voiceSheet ? <VoiceSheet onClose={() => setVoiceSheet(false)} /> : null}
    </window.SettingsFrame>
  );
}

Object.assign(window, { ListeningPage, SpeakingPage, VoiceSheet });
