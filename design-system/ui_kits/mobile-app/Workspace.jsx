const { AppWordmark, IconButton, PhosphorIcon, RouteByline, VoiceOrb, OrbSatellite,
        ConversationSettingsSummary, WorkspaceStatusLine, TranscriptHandle,
        ChatBubble, ChatTranscript, TranscriptMessage, Toast, Modal, ProviderIcon, BackgroundTaskBar,
        IntroBanner, IntroFlow, RoutePicker, Composer } = window.MrBroccoliDesignSystem_62d510;

const ASSETS = "../../assets/providers";
const ORB = 196;

/**
 * The orb takes the space the column actually leaves it rather than a size
 * guessed from what else is on screen. Anything that shortens the column — the
 * introduction banner, a landscape split, a longer byline — simply makes the
 * orb smaller instead of pushing it over its neighbours.
 */
function useFitSize(max, min, insetWidth = 0, insetHeight = 0) {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState(max);
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const measure = () => {
      // clientHeight/clientWidth are the content box: the stage's own padding is
      // already excluded, so an inset is never counted twice.
      const fits = Math.min(max, node.clientHeight - insetHeight, node.clientWidth - insetWidth);
      setSize(Math.max(min, fits));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [max, min, insetWidth, insetHeight]);
  return [ref, size];
}

/** Each step carries where it ends in the whole turn, so the outer ring can interpolate. */
const PHASE_SCRIPT = [
  { phase: "recording", title: "Listening", detail: "Tap the orb when done", ms: 6000, turn: 0.10 },
  { phase: "transcribing", title: "Transcribing", detail: "Turning speech into text", ms: 900, turn: 0.24 },
  { phase: "searching", title: "Searching", detail: "Reading the web", ms: 1500, turn: 0.52 },
  { phase: "thinking", title: "Thinking", detail: "Working through the answer", ms: 1800, turn: 0.70 },
  { phase: "synthesizing", title: "Preparing speech", detail: "Converting the answer to audio", ms: 1400, turn: 0.86 },
  { phase: "speaking", title: "Speaking", detail: "Tap the orb to stop", ms: 2600, turn: 1 },
];

function useTurnScript(onCommit) {
  const [step, setStep] = React.useState(-1);
  const [progress, setProgress] = React.useState(0);
  const running = step >= 0;
  React.useEffect(() => {
    if (!running) return undefined;
    const total = PHASE_SCRIPT[step].ms;
    const started = Date.now();
    setProgress(0);
    const tick = setInterval(() => setProgress(Math.min(1, (Date.now() - started) / total)), 80);
    if (step === 0) return () => clearInterval(tick);
    const timer = setTimeout(() => {
      if (step === PHASE_SCRIPT.length - 1) { onCommit(); setStep(-1); return; }
      setStep(step + 1);
    }, total);
    return () => { clearInterval(tick); clearTimeout(timer); };
  }, [running, step]);

  const current = running ? PHASE_SCRIPT[step] : null;
  const previousTurn = step > 0 ? PHASE_SCRIPT[step - 1].turn : 0;
  return {
    current,
    running,
    phaseProgress: running ? progress : 0,
    turnProgress: running ? previousTurn + (current.turn - previousTurn) * progress : 0,
    start: () => setStep(running ? (step === 0 ? 1 : -1) : 0),
  };
}

/** The caret is lit on the side the other page lives, spent on the side you are on. */
function SwipeArrow({ direction, enabled, label, onPress }) {
  return (
    <span role="button" aria-label={label} aria-disabled={!enabled} onClick={enabled ? onPress : undefined}
      style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        cursor: enabled ? "pointer" : "default", opacity: enabled ? 1 : 0.22 }}>
      <PhosphorIcon name={direction} size="control" color="var(--mb-color-text-muted)" />
    </span>
  );
}

function useConversation() {
  const [mode, setMode] = React.useState("deep");
  const [messages, setMessages] = React.useState(window.MB_DATA.messages);
  const [picking, setPicking] = React.useState(false);
  const active = window.MB_DATA.modes.find((entry) => entry.id === mode);
  const commit = (prompt) => setMessages((list) => list.concat([
    { id: "u" + list.length, role: "user", timestamp: "09.08.26 · 14:19", text: prompt || "Will the weather hold for the weekend?" },
    { id: "a" + list.length, role: "assistant", provider: active.provider, model: active.modelLabel, timestamp: "09.08.26 · 14:19", text: window.MB_DATA.reply },
  ]));
  return { mode, setMode, messages, picking, setPicking, active, commit };
}

function Byline({ conversation }) {
  const { active } = conversation;
  return (
    <RouteByline provider={active.provider} providerLabel={active.providerLabel} modelName={active.modelLabel}
      effort={active.effortLabel} effortLevels={active.effortLevels} local={active.local}
      switchable={window.MB_DATA.modes.length > 1} onPress={() => conversation.setPicking(true)} assetBase={ASSETS} />
  );
}

/** One spoken-script row with kit-local fold state; the latest message arrives expanded. */
function TranscriptRow({ message, isLast }) {
  const [open, setOpen] = React.useState(isLast);
  return <TranscriptMessage role={message.role} paragraphs={message.paragraphs || [message.text]}
    model={message.model} provider={message.provider} council={message.council} time={message.timestamp}
    expanded={open} onToggle={() => setOpen(!open)} meta={message.meta} last={isLast} assetBase={ASSETS}
    actions={message.role === "assistant" ? [{ icon: "branch", label: "Branch here" }, { icon: "copy", label: "Copy" }, { icon: "share-alt", label: "Share" }, { icon: "sound", label: "Speak again" }] : null} />;
}

/** The sheet the handle opens: over the workspace, not a new screen. */
function TranscriptSheet({ visible, title, messages, onClose }) {
  if (!visible) return null;
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--mb-color-overlay)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "85%", display: "flex", flexDirection: "column",
        borderRadius: "var(--mb-radius-sheet-top) var(--mb-radius-sheet-top) 0 0", background: "var(--mb-color-background)",
        border: "1px solid var(--mb-color-surface-raised-border)", borderBottom: "none", boxShadow: "var(--mb-shadow-sheet)", overflow: "hidden" }}>
        <div style={{ flexShrink: 0, padding: "10px 8px 8px 14px", borderBottom: "1px solid var(--mb-color-border)" }}>
          <span style={{ display: "block", width: 38, height: 4, borderRadius: 2, margin: "0 auto 8px", background: "var(--mb-color-border-strong)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--mb-font-headline)", fontSize: 17, letterSpacing: "-0.2px", color: "var(--mb-color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
            <IconButton icon="close" accessibilityLabel="Hide transcript" onClick={onClose} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 16px 20px" }}>
          {messages.map((message, index) => (
            <TranscriptRow key={message.id} message={message} isLast={index === messages.length - 1} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

/**
 * The one row on the home screen that reports work the user started somewhere
 * else. Nothing renders while nothing is running.
 */
function AutoSetupIndicator({ auto, onOpen }) {
  if (!auto) return null;
  if (auto.state === "installing") {
    return <BackgroundTaskBar title="Installing on-device AI"
      detail={"Step " + auto.reading.step + " of " + auto.reading.stepCount + " · " + auto.reading.remaining}
      fraction={auto.fraction} onPress={onOpen} />;
  }
  if (auto.state === "failed") {
    return <BackgroundTaskBar tone="danger" icon="warning" title="On-device install stopped"
      detail="Tap to see what failed" onPress={onOpen} />;
  }
  return null;
}

function Workspace({ onOpenDrawer, onOpenSettings, onOpenLocalModels, conversationTitle, toast, onDismissToast, auto, introVisible, onIntroVisible, initialTranscript }) {
  const conversation = useConversation();
  const turn = useTurnScript(conversation.commit);
  const [surface, setSurface] = React.useState("voice");
  const [draft, setDraft] = React.useState("");
  const [council, setCouncil] = React.useState(false);
  const [web, setWeb] = React.useState(true);
  const [transcript, setTranscript] = React.useState(!!initialTranscript);
  const [banner, setBanner] = React.useState(true);
  const [localIntro, setLocalIntro] = React.useState(false);
  const intro = introVisible === undefined ? localIntro : introVisible;
  const setIntro = onIntroVisible || setLocalIntro;
  const [introOpened, setIntroOpened] = React.useState(false);

  const [stageRef, orbSize] = useFitSize(ORB, 96, 96);

  const last = conversation.messages[conversation.messages.length - 1];
  const send = () => { conversation.commit(draft); setDraft(""); setSurface("voice"); };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%", background: "var(--mb-color-background)" }}>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 62, paddingTop: 8, paddingBottom: 10 }}>
          <IconButton icon="menu" accessibilityLabel="Conversations" onClick={onOpenDrawer} />
          <AppWordmark />
          <IconButton icon="setting" accessibilityLabel="Settings" onClick={onOpenSettings} />
        </div>

        <IntroBanner visible={banner} title="New here?"
          body="See what Mr Broccoli does and pick how to power it." action="Take a look"
          showDismiss={introOpened} onDismiss={() => setBanner(false)}
          onOpen={() => { setIntro(true); setIntroOpened(true); }} />

        <AutoSetupIndicator auto={auto} onOpen={onOpenLocalModels} />

        <Byline conversation={conversation} />
        <ConversationSettingsSummary summary="Balanced · Brief · Heart" onPress={onOpenSettings} />

        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div ref={stageRef} style={{ flex: "1 1 auto", minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
            <SwipeArrow direction="left" enabled={surface === "text"} label="Show voice input" onPress={() => setSurface("voice")} />
            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {surface === "voice"
                ? <VoiceOrb size={orbSize} phase={turn.current ? turn.current.phase : "idle"}
                    phaseProgress={turn.phaseProgress} turnProgress={turn.turnProgress} onPress={turn.start} />
                : <Composer value={draft} onChange={setDraft} onSend={send} height={orbSize} />}
            </div>
            <SwipeArrow direction="right" enabled={surface === "voice"} label="Show text input" onPress={() => setSurface("text")} />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8 }}>
            <OrbSatellite icon="image" label="Image" accessibilityLabel="Add image" />
            <span style={{ width: 1, height: 44, background: "var(--mb-color-border)", margin: "0 6px" }} />
            <OrbSatellite icon="council" label="Council" kind="toggle" active={council}
              accessibilityLabel="Model Council" onPress={() => setCouncil((on) => !on)} />
            <OrbSatellite icon="search" label="Web" kind="toggle" active={web}
              accessibilityLabel="Web search" onPress={() => setWeb((on) => !on)} />
          </div>
        </div>

        <WorkspaceStatusLine phase={turn.current ? turn.current.phase : "idle"}
          title={turn.current ? turn.current.title : surface === "text" ? "Type and send" : "Tap to speak"}
          detail={turn.current ? turn.current.detail : conversationTitle + " · " + conversation.messages.length + " messages"}
          onInfo={() => {}} />
      </div>

      <TranscriptHandle messageCount={conversation.messages.length}
        meta={last ? conversation.active.modelLabel + " · 2 min ago" : null}
        preview={last ? last.text : null} onPress={() => setTranscript(true)} />

      <RoutePicker visible={conversation.picking} onClose={() => conversation.setPicking(false)}
        routes={window.MB_DATA.modes} selected={conversation.mode} onSelect={conversation.setMode} assetBase={ASSETS} />

      <TranscriptSheet visible={transcript} title={conversationTitle}
        messages={conversation.messages} onClose={() => setTranscript(false)} />

      <IntroFlow visible={intro} onClose={() => setIntro(false)} autoSetup={auto ? auto.cardProps : undefined}
        onInstallLocal={onOpenLocalModels} onConnectProvider={() => setIntro(false)}
        onOpenPremium={() => setIntro(false)} onOpenStt={onOpenSettings} onOpenTts={onOpenSettings} />

      {toast ? (
        <div style={{ position: "absolute", top: 60, left: 16, right: 16 }}>
          <Toast inline tone={toast.tone} message={toast.message} onDismiss={onDismissToast} />
        </div>
      ) : null}
    </div>
  );
}

/** Icon-only in landscape: the column has no room for labels. */
function LandscapeControl({ icon, label, toggle, active, onPress }) {
  const tint = active ? "var(--mb-color-accent)" : "var(--mb-color-text-secondary)";
  return (
    <span role={toggle ? "switch" : "button"} aria-checked={toggle ? !!active : undefined} aria-label={label} onClick={onPress}
      style={{ width: 44, height: 44, cursor: "pointer", borderRadius: toggle ? 22 : "var(--mb-radius-icon-button)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid " + (toggle ? (active ? "var(--mb-color-accent)" : "var(--mb-color-border)") : "transparent"),
        background: toggle && active ? "var(--mb-color-accent-soft)" : "transparent" }}>
      <PhosphorIcon name={icon} size="control" color={tint} />
    </span>
  );
}

/**
 * Landscape sheds only the swipe pager, because there is no second input page
 * to swipe to. The settings sentence and the attach control stay: an orientation
 * is not a reason to make an action unreachable or to leave an icon unexplained.
 *
 * The introduction banner lives in the right pane here, not the left. Compact or
 * not, it renders ~156pt tall in a ~320pt-wide column, which is half the control
 * column's height — stacking it there leaves the orb and its controls nothing to
 * occupy. The right pane is wider, and on a fresh session the transcript beneath
 * it is empty anyway.
 */
function LandscapeWorkspace({ onOpenDrawer, onOpenSettings, onOpenLocalModels, conversationTitle, auto }) {
  const conversation = useConversation();
  const turn = useTurnScript(conversation.commit);
  const [council, setCouncil] = React.useState(false);
  const [web, setWeb] = React.useState(true);
  const [banner, setBanner] = React.useState(true);
  const [intro, setIntro] = React.useState(false);
  const [introOpened, setIntroOpened] = React.useState(false);
  // The stage holds the orb and the control row beneath it, so 54pt of its
  // height (44 control + 10 gap) is spoken for before the orb gets any.
  const [landscapeStageRef, landscapeOrb] = useFitSize(150, 84, 0, 54);
  return (
    <div style={{ position: "relative", display: "flex", height: "100%", padding: "0 12px 8px", background: "var(--mb-color-background)" }}>
      <div style={{ flex: "0.9 1 0", minWidth: 0, paddingRight: 12, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 62, paddingTop: 8, paddingBottom: 10 }}>
          <IconButton icon="menu" accessibilityLabel="Conversations" onClick={onOpenDrawer} />
          <AppWordmark />
          <IconButton icon="setting" accessibilityLabel="Settings" onClick={onOpenSettings} />
        </div>
        <AutoSetupIndicator auto={auto} onOpen={onOpenLocalModels} />
        <Byline conversation={conversation} />
        <ConversationSettingsSummary summary="Balanced · Brief · Heart" onPress={onOpenSettings} />
        <div ref={landscapeStageRef} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, paddingTop: 4 }}>
          <div style={{ flexShrink: 0 }}>
            <VoiceOrb size={landscapeOrb} phase={turn.current ? turn.current.phase : "idle"}
              phaseProgress={turn.phaseProgress} turnProgress={turn.turnProgress} onPress={turn.start} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <LandscapeControl icon="image" label="Add image" onPress={() => {}} />
            <div style={{ width: 1, alignSelf: "stretch", background: "var(--mb-color-border)" }} />
            <LandscapeControl icon="council" label="Model Council" toggle active={council} onPress={() => setCouncil((on) => !on)} />
            <LandscapeControl icon="search" label="Web search" toggle active={web} onPress={() => setWeb((on) => !on)} />
          </div>
        </div>
        <WorkspaceStatusLine phase={turn.current ? turn.current.phase : "idle"}
          title={turn.current ? turn.current.title : "Tap to speak"}
          detail={turn.current ? turn.current.detail : conversationTitle + " · " + conversation.messages.length + " messages"} />
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "var(--mb-color-border)" }} />
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 12, paddingTop: 10, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <IntroBanner visible={banner} compact title="New here?"
          body="See what Mr Broccoli does and pick how to power it." action="Take a look"
          showDismiss={introOpened} onDismiss={() => setBanner(false)}
          onOpen={() => { setIntro(true); setIntroOpened(true); }} />
        <ChatTranscript style={{ flex: 1, paddingBottom: 8 }}>
          {conversation.messages.map((message, index) => (
            <TranscriptRow key={message.id} message={message} isLast={index === conversation.messages.length - 1} />
          ))}
        </ChatTranscript>
      </div>
      <RoutePicker visible={conversation.picking} onClose={() => conversation.setPicking(false)}
        routes={window.MB_DATA.modes} selected={conversation.mode} onSelect={conversation.setMode} assetBase={ASSETS} />

      <IntroFlow visible={intro} onClose={() => setIntro(false)} onOpenStt={onOpenSettings} onOpenTts={onOpenSettings} />
    </div>
  );
}

Object.assign(window, { Workspace, LandscapeWorkspace });
