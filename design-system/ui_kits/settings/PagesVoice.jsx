const { AntSectionIntro, AntSettingsCard, AntSwitchRow, AntPickerSection, AntPickerRow,
        AntPickerRows, AntRadioSection, AntButtonLabel, Button, IconButton, PhosphorIcon,
        LocalModelPerformanceSummary, AutoSetupCard } = window.MrBroccoliDesignSystem_62d510;

/** Providers the user has connected that can do this job — the pages receive
    selectableSttProviders / selectableTtsProviders, never the full set. */
function capableProviders(capability) {
  return window.MB_SETTINGS.providers
    .filter((provider) => provider.capabilities.includes(capability))
    .map((provider) => ({ value: provider.label, label: provider.label }));
}

/** Listening — input mode, recognition language, speech-to-text route. */
function ListeningPage({ onBack, onClose }) {
  const [mode, setMode] = React.useState("push-to-talk");
  const [route, setRoute] = React.useState("native");
  const [language, setLanguage] = React.useState("auto");
  const [sttProvider, setSttProvider] = React.useState("OpenAI");
  const [sttModel, setSttModel] = React.useState("whisper-1");
  return (
    <window.SettingsFrame title="Listening" onBack={onBack} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AntSectionIntro title="Voice Input" />
        <AntRadioSection
          label="Input Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "push-to-talk", label: "Push to Talk", description: "Hold the button while you speak, release to send." },
            { value: "toggle-to-talk", label: "Toggle to Talk", description: "Tap once to start, tap again when you are finished." },
            { value: "drive-session", label: "Drive Session", description: "Hands-free turns that continue until you stop them." },
          ]}
        />
        <AntPickerSection title="Recognition language" helperText="Choose a language to improve recognition, or leave it automatic for device or provider detection.">
          <AntPickerRow label="Language" value={language} onChange={setLanguage}
            options={[{ value: "auto", label: "Automatic" }, { value: "en", label: "English" }, { value: "de", label: "German" }, { value: "ar", label: "Arabic" }]} />
        </AntPickerSection>
        <AntRadioSection
          label="Speech to Text"
          value={route}
          onChange={setRoute}
          options={[
            { value: "native", label: "System Recognition", description: "The operating system transcribes on the device." },
            { value: "provider", label: "Provider", description: "Audio is sent to a provider you have connected." },
            { value: "local", label: "On-device AI", description: "Models that run without a network connection." },
          ]}
        />
        {route === "provider" ? (
          <AntPickerSection title="STT Provider">
            <AntPickerRows>
              <AntPickerRow label="Provider" value={sttProvider} options={capableProviders("STT")}
                onChange={(value) => { setSttProvider(value); setSttModel(window.MB_SETTINGS.sttModels[value][0]); }} />
              <AntPickerRow label="Model" value={sttModel}
                options={(window.MB_SETTINGS.sttModels[sttProvider] || []).map((value) => ({ value, label: value }))}
                onChange={setSttModel} />
            </AntPickerRows>
          </AntPickerSection>
        ) : null}
      </div>
    </window.SettingsFrame>
  );
}

/** Speaking — spoken replies, playback, text-to-speech route, replay cache. */
function SpeakingPage({ onBack, onClose }) {
  const [spoken, setSpoken] = React.useState(true);
  const [wait, setWait] = React.useState(false);
  const [route, setRoute] = React.useState("local");
  const [ttsProvider, setTtsProvider] = React.useState("ElevenLabs");
  const [ttsModel, setTtsModel] = React.useState("eleven_turbo_v2_5");
  return (
    <window.SettingsFrame title="Speaking" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Voice Output" extra={<IconButton icon="info-circle" accessibilityLabel="About voice output" onClick={() => {}} />} />
          <AntSettingsCard>
            <AntSwitchRow label="Spoken Replies" description="Replies are read aloud paragraph by paragraph." value={spoken} onChange={setSpoken} />
          </AntSettingsCard>
          <AntRadioSection
            label="Reply Playback"
            value={wait ? "complete" : "streaming"}
            onChange={(value) => setWait(value === "complete")}
            options={[
              { value: "streaming", label: "As it arrives", description: "Each paragraph is spoken as soon as it is ready." },
              { value: "complete", label: "When complete", description: "Playback starts once the whole answer has arrived." },
            ]}
          />
        </window.SectionGroup>

        <window.SectionGroup>
          <AntRadioSection
            label="Text to Speech"
            value={route}
            onChange={setRoute}
            options={[
              { value: "system", label: "System voice", description: "The operating system speaks with its own voices." },
              { value: "local", label: "On-device AI", description: "Kokoro runs on the device with no network." },
              { value: "provider", label: "Provider", description: "Text is sent to a provider you have connected." },
            ]}
          />
          {route === "local" ? (
            <AntPickerSection title="Local voices">
              <AntPickerRow label="Voice" value="heart" onChange={() => {}}
                options={[{ value: "heart", label: "Heart · American female" }, { value: "river", label: "River · British female" }, { value: "puck", label: "Puck · American male" }]} />
            </AntPickerSection>
          ) : null}
          {route === "provider" ? (
            <AntPickerSection title="TTS Provider">
              <AntPickerRows>
                <AntPickerRow label="Provider" value={ttsProvider} options={capableProviders("TTS")}
                  onChange={(value) => { setTtsProvider(value); setTtsModel(window.MB_SETTINGS.ttsModels[value][0]); }} />
                <AntPickerRow label="Model" value={ttsModel}
                  options={(window.MB_SETTINGS.ttsModels[ttsProvider] || []).map((value) => ({ value, label: value }))}
                  onChange={setTtsModel} />
              </AntPickerRows>
            </AntPickerSection>
          ) : null}
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSettingsCard title="Speech replay cache">
            <window.HelperText>Spoken replies are kept on the device so they can be replayed without synthesising again.</window.HelperText>
            <div style={{ alignSelf: "flex-start" }}>
              <Button size="small"><AntButtonLabel color="var(--mb-color-danger)" icon="delete" label="Clear speech replay cache" /></Button>
            </div>
          </AntSettingsCard>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

/**
 * On-device AI — automatic setup first, then the catalogue, install state and
 * languages.
 *
 * The automatic card leads because the page is otherwise a list of decisions a
 * new user has no way to make: three model names, three sizes and three
 * verdicts. Anyone who already knows what they want scrolls past it, which costs
 * them one swipe.
 */
function OnDevicePage({ onBack, onClose, auto }) {
  const [busy, setBusy] = React.useState(null);
  return (
    <window.SettingsFrame title="On-device AI" onBack={onBack} onClose={onClose}>
      <window.SectionPage>
        <window.SectionGroup>
          <AntSectionIntro title="Automatic setup" description="One tap measures this phone and installs a set that fits it." />
          <AutoSetupCard showHeader={false} {...(auto ? auto.cardProps : {})} />
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="Installed and available" description="Models that run without a network connection." />
          {window.MB_SETTINGS.localModels.map((model) => (
            <AntSettingsCard key={model.id} title={model.name}
              headerExtra={<PhosphorIcon name={model.state === "installed" ? "check-circle" : "download"} size="control" color={model.state === "installed" ? "var(--mb-color-success)" : "var(--mb-color-text-muted)"} />}>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <window.CapabilityTag>{model.capability}</window.CapabilityTag>
                <window.CapabilityTag>{model.size}</window.CapabilityTag>
              </div>
              {model.state === "installed" ? (
                <LocalModelPerformanceSummary evidence="Measured" fit="Viable" details={["14.2 tok/s", "Load 1.8 s", "Headroom 2.4×"]} />
              ) : (
                <window.HelperText>Not installed. Downloading keeps the model on the device permanently.</window.HelperText>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {model.state === "installed" ? (
                  <React.Fragment>
                    <Button size="small" onClick={() => setBusy(model.id)}><AntButtonLabel color="var(--mb-color-accent)" icon="thunderbolt" label={busy === model.id ? "Testing…" : "Test"} /></Button>
                    <Button size="small"><AntButtonLabel color="var(--mb-color-danger)" icon="delete" label="Remove" /></Button>
                  </React.Fragment>
                ) : (
                  <Button size="small" type="primary"><AntButtonLabel color="var(--mb-color-on-active-control)" icon="download" label="Download" /></Button>
                )}
              </div>
            </AntSettingsCard>
          ))}
        </window.SectionGroup>

        <window.SectionGroup>
          <AntSectionIntro title="Conversation languages" />
          <AntPickerSection helperText="On-device models carry their own languages. Adding one downloads the matching voice and recogniser.">
            <AntPickerRow label="Languages" value="en" onChange={() => {}}
              options={[{ value: "en", label: "English" }, { value: "de", label: "English, German" }, { value: "ar", label: "English, Arabic" }]} />
          </AntPickerSection>
        </window.SectionGroup>
      </window.SectionPage>
    </window.SettingsFrame>
  );
}

Object.assign(window, { ListeningPage, SpeakingPage, OnDevicePage });
