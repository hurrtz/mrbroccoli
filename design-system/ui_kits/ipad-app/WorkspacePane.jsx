const { PhosphorIcon, IconButton, VoiceOrb, OrbSatellite, RouteByline, ConversationSettingsSummary, TranscriptHandle, TranscriptMessage } = window.MrBroccoliDesignSystem_62d510;
const IPAD_ASSETS = "../../assets/providers";

function Satellites() {
  const [council, setCouncil] = React.useState(false);
  const [web, setWeb] = React.useState(true);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 8 }}>
      <OrbSatellite icon="image" label="Image" accessibilityLabel="Add image" onPress={() => {}} />
      <span style={{ width: 1, height: 44, background: "var(--mb-color-border)", margin: "0 6px" }} />
      <OrbSatellite icon="council" label="Council" kind="toggle" active={council} accessibilityLabel="Model Council" onPress={() => setCouncil((v) => !v)} />
      <OrbSatellite icon="search" label="Web" kind="toggle" active={web} accessibilityLabel="Web search" onPress={() => setWeb((v) => !v)} />
    </div>
  );
}

const SAMPLE_TRANSCRIPT = [
  { role: "user", paragraphs: ["What's the earliest ferry that still gets us there before the tide turns?"], expanded: true },
  { role: "assistant", provider: "openai", model: "GPT-5", time: "14:12", expanded: true,
    paragraphs: ["The 10:20 crossing from the north quay is the last one before slack tide at 15:40 with enough margin to unload.", "Six ferries run today; two afternoon crossings may cancel if the forecast holds."],
    meta: "4.2 s · 640 tokens" },
];

/** The transcript pulled up over the content pane — the same sheet the phone uses, wider reading column, capped so lines don't run edge to edge. */
function TranscriptPanel({ onClose }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: "9%", background: "var(--mb-color-background)", borderTop: "1px solid var(--mb-color-border)", borderRadius: "20px 20px 0 0", boxShadow: "0 -12px 32px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid var(--mb-color-border)" }}>
        <span style={{ flex: 1, fontFamily: "var(--mb-font-headline)", fontSize: 17, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Tide tables</span>
        <IconButton icon="down" accessibilityLabel="Close transcript" onClick={onClose} />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 28px 28px" }}>
        <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
          {SAMPLE_TRANSCRIPT.map((m, i) => <TranscriptMessage key={i} {...m} assetBase={IPAD_ASSETS} />)}
        </div>
      </div>
    </div>
  );
}

/**
 * The content pane: byline + settings control, the orb stage, the transcript
 * handle. Identical at every width and orientation — flex centring does the
 * work — only the leading edge (a menu button, or nothing) changes.
 */
function IpadWorkspaceContent({ compact, onOpenDrawer, orbSize = 224, showHandle = true, transcriptOpen, onOpenTranscript, onCloseTranscript }) {
  return (
    <div style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px 6px" }}>
        {compact ? <IconButton icon="menu" accessibilityLabel="Conversations" onClick={onOpenDrawer} /> : <span style={{ width: 44, flexShrink: 0 }} />}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <RouteByline provider="anthropic" providerLabel="Anthropic" modelName="Claude Sonnet 4.5" effort="Medium" assetBase={IPAD_ASSETS} />
        </div>
        <ConversationSettingsSummary iconOnly summary="Balanced · Brief · Heart" onPress={() => {}} />
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
        <VoiceOrb size={orbSize} />
        <Satellites />
      </div>
      {showHandle ? <TranscriptHandle messageCount={12} meta="GPT-5 · 2 min ago" preview="Slack tide is at 15:40, so the earliest sensible cast is the 10:20 ferry." onPress={onOpenTranscript} style={{ margin: "0 20px 20px" }} /> : null}
      {showHandle && transcriptOpen ? <TranscriptPanel onClose={onCloseTranscript} /> : null}
    </div>
  );
}

/** Landscape regular width only: transcript docked as a permanent third column — no handle, no sheet, nothing to open or close. */
function TranscriptColumn({ width = 400 }) {
  return (
    <div style={{ width, flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", borderLeft: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)" }}>
      <div style={{ padding: "18px 20px 12px", borderBottom: "1px solid var(--mb-color-border)" }}>
        <span style={{ fontFamily: "var(--mb-font-headline)", fontSize: 18, letterSpacing: "-0.2px", color: "var(--mb-color-text)" }}>Tide tables</span>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {SAMPLE_TRANSCRIPT.map((m, i) => <TranscriptMessage key={i} {...m} assetBase={IPAD_ASSETS} />)}
      </div>
    </div>
  );
}

Object.assign(window, { IpadWorkspaceContent, TranscriptColumn });
