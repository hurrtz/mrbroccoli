import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { IntroTitle } from "./IntroTitle";
import { IntroBody } from "./IntroBody";
import { IntroStepper } from "./IntroStepper";
import { AutoSetupCard } from "../on-device/AutoSetupCard";
import { RouteOptionRow } from "../settings-primitives/RouteOptionRow";
import { Switch } from "../core/Switch";
import { IconAction } from "../settings-primitives/IconAction";

export const INTRO_STEPS = ["welcome", "setup", "try"];

/** English defaults — the canonical strings. Pass `copy` to translate; every string is overridable. */
export const INTRO_COPY = {
  welcomeTitle: "Welcome",
  dialogueFar: "Happy to. Ask me anything — out loud or typed, whichever fits the moment.",
  dialogueQuestion: "And everything stays on my phone?",
  dialogueNear: "If you want it to. I can think, listen and speak right here — no account, no cloud.",
  welcomeQuery: "Prove it, Mr Broccoli — say hello in your own voice.",
  playAnswer: "Play the answer",
  voiceNote: "This voice was generated off-device by a partner provider. On-device voices sound different: simpler, free, one download away.",
  setupTitle: "Don't panic",
  setupBody: "One required download and it works.",
  heroTitle: "Let's get you started",
  heroBody: "Mr Broccoli measures what this phone can run, shows you the set that fits, and installs it in one go. Nothing downloads before you say so.",
  glyphListen: "He listens", glyphThink: "He thinks", glyphAnswer: "He answers",
  autoAction: "Set up automatically",
  manualSwitch: "Show manual setup",
  manualTitle: "Manual setup",
  tagRequired: "Required", tagOptional: "Optional",
  tryTitle: "Try it out!",
  tryBody: "Your setup is running — ask something and hear how he answers. Not happy with it? Step back, change it, try again.",
  holdToTalk: "Hold to talk",
  toFirstWord: "to first word",
  replay: "Replay",
  done: "Done", back: "Back", next: "Next", dismiss: "Dismiss introduction",
};

/** The manual-setup catalogue, pipeline-ordered. Override via `manualGroups` to mirror the real device state. */
export const DEFAULT_MANUAL_GROUPS = [
  { label: "He listens", rows: [
    { id: "listen-phone", label: "Your phone", selected: true },
    { id: "listen-whisper", label: "Whisper Small", meta: "Not installed · 466 MB", disabled: true, action: "download" },
  ] },
  { label: "He thinks", required: true, rows: [
    { id: "think-qwen", label: "Qwen 2.5 1.5B", meta: "Not installed · 934 MB", disabled: true, action: "download" },
    { id: "think-provider", label: "A provider you already use", meta: "Via provider · your key", locked: true },
  ] },
  { label: "He answers", rows: [
    { id: "answer-phone", label: "Your phone", selected: true },
    { id: "answer-kokoro", label: "Kokoro 82M", meta: "Not installed · 312 MB", disabled: true, action: "download" },
  ] },
];

/** The sample turn a preview mic-press produces when no live runtime is wired. */
export const DEMO_TURN = {
  question: "How long would it take me to count to a million?",
  answer: "About 23 days without sleeping — one number a second, and the long numbers slow you down.",
  latency: "2.4 s",
};

const bodyText = { fontFamily: "var(--mb-text-body-family)", fontSize: 14, lineHeight: "20px", color: "var(--mb-color-text)" };
const supText = { fontFamily: "var(--mb-text-supporting-family)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-secondary)" };
const metaText = { fontFamily: "var(--mb-font-mono)", fontSize: 10, letterSpacing: ".4px", color: "var(--mb-color-text-muted)" };
const heroTitleText = { fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 18, letterSpacing: "-0.1px", color: "var(--mb-color-text)" };
const Divider = () => <div aria-hidden="true" style={{ height: 1, flexShrink: 0, background: "var(--mb-color-border)", margin: "6px 0 0" }} />;

function Bubble({ me, blur, opacity, hidden, children }) {
  return (
    <div aria-hidden={hidden ? "true" : undefined} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", filter: blur ? "blur(" + blur + "px)" : "none", opacity: opacity || 1 }}>
      <div style={{ maxWidth: "84%", padding: "11px 14px", borderRadius: me ? "18px 18px 5px 18px" : "18px 18px 18px 5px", background: me ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface-raised)", border: me ? "none" : "1px solid var(--mb-color-border)" }}>
        <span style={bodyText}>{children}</span>
      </div>
    </div>
  );
}

/**
 * Step one: the stored intro session, emerging from blur under the headline.
 * The dialogue is real — it ships on the device and can be opened like any
 * conversation — so the crisp final query earns the play button as its answer.
 * The blurred turns are decoration to a screen reader (aria-hidden); only the
 * query, the play button and the language switch are announced.
 */
function WelcomeStep({ copy, played, onPlay, language, onChangeLanguage }) {
  const mask = "linear-gradient(to bottom, transparent 2%, rgba(0,0,0,.4) 30%, #000 68%)";
  return (
    <React.Fragment>
      <IntroTitle>{copy.welcomeTitle}</IntroTitle>
      <div style={{ flex: 1, position: "relative", minHeight: 0, margin: "0 -4px" }}>
        <div style={{ position: "absolute", left: 4, right: 4, top: -4, bottom: "calc(50% + 82px)", display: "flex", flexDirection: "column", gap: 9, justifyContent: "flex-end", overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}>
          <Bubble hidden blur={4} opacity={.5}>{copy.dialogueFar}</Bubble>
          <Bubble hidden me blur={2.4} opacity={.65}>{copy.dialogueQuestion}</Bubble>
          <Bubble hidden blur={1.1} opacity={.85}>{copy.dialogueNear}</Bubble>
          <Bubble me>{copy.welcomeQuery}</Bubble>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: "translateY(-64px)" }}>
          <button type="button" aria-label={copy.playAnswer} onClick={onPlay}
            style={{ width: 128, height: 128, borderRadius: 999, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)", boxShadow: "0 8px 24px var(--mb-color-glow-strong)" }}>
            <PhosphorIcon name="play" size="hero" color="var(--mb-color-on-accent)" />
          </button>
          <button type="button" onClick={onChangeLanguage} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, minHeight: 44, padding: "5px 12px", borderRadius: "var(--mb-radius-control)", border: "none", background: "none", cursor: "pointer" }}>
            <span style={{ ...metaText, fontSize: 11 }}>{language}</span>
            <PhosphorIcon name="down" size="inline" color="var(--mb-color-text-muted)" />
          </button>
          {played ? (
            <React.Fragment>
              <span aria-hidden="true" style={{ margin: "18px 0", fontFamily: "var(--mb-font-mono)", fontSize: 13, letterSpacing: "9px", paddingLeft: 9, color: "var(--mb-color-text-muted)" }}>···</span>
              <span style={{ ...supText, maxWidth: 288, textAlign: "center", color: "var(--mb-color-text-muted)" }}>{copy.voiceNote}</span>
            </React.Fragment>
          ) : null}
        </div>
      </div>
    </React.Fragment>
  );
}

function FlowSwitch({ on, onToggle, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 11, minHeight: 44, padding: "0 2px" }}>
      <span style={bodyText}>{label}</span>
      <Switch value={on} onChange={onToggle} accessibilityLabel={label} />
    </div>
  );
}

/**
 * Step two: "Don't panic". One green action does everything (the automatic job
 * measures first — nothing downloads unseen); the manual catalogue waits behind
 * an off-by-default switch so the screen greets rather than interrogates.
 */
function SetupStep({ copy, autoSetup, manualOpen, onToggleManual, groups, onSelectRoute, onDownloadModel }) {
  const auto = autoSetup || {};
  const autoActive = auto.state && auto.state !== "idle";
  const glyphs = [["mic", copy.glyphListen], ["cpu", copy.glyphThink], ["sound", copy.glyphAnswer]];
  return (
    <React.Fragment>
      <IntroTitle>{copy.setupTitle}</IntroTitle>
      <IntroBody>{copy.setupBody}</IntroBody>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "10px 2px 0" }}>
        <span style={heroTitleText}>{copy.heroTitle}</span>
        <span style={{ ...supText, fontSize: 13, lineHeight: "19px" }}>{copy.heroBody}</span>
        <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 4px 10px" }}>
          {glyphs.map(([icon, label]) => (
            <span key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <PhosphorIcon name={icon} size="control" color="var(--mb-color-text-secondary)" />
              <span style={{ ...metaText, fontSize: 10 }}>{label}</span>
            </span>
          ))}
        </div>
        {autoActive ? (
          <AutoSetupCard {...auto} showHeader={false} />
        ) : (
          <button type="button" onClick={auto.onStart}
            style={{ minHeight: 48, borderRadius: "var(--mb-radius-control)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)" }}>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, color: "var(--mb-color-on-accent)" }}>{copy.autoAction}</span>
          </button>
        )}
        <FlowSwitch on={manualOpen} onToggle={onToggleManual} label={copy.manualSwitch} />
      </div>
      {manualOpen ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 6 }}>
          <span style={heroTitleText}>{copy.manualTitle}</span>
          {groups.map((group) => (
            <div key={group.label}>
              <p style={{ margin: "0 0 6px 2px", display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 12, letterSpacing: ".8px", textTransform: "uppercase", color: "var(--mb-color-text)" }}>{group.label}</span>
                <span style={{ padding: "2px 9px", borderRadius: "var(--mb-radius-pill)", fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 10, letterSpacing: ".5px", textTransform: "uppercase", border: "1px solid " + (group.required ? "var(--mb-color-accent)" : "var(--mb-color-border)"), background: group.required ? "var(--mb-color-accent-soft)" : "var(--mb-color-surface-raised)", color: group.required ? "var(--mb-color-text)" : "var(--mb-color-text-muted)" }}>{group.required ? copy.tagRequired : copy.tagOptional}</span>
              </p>
              <div style={{ borderRadius: "var(--mb-radius-card)", border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)", overflow: "hidden" }}>
                {group.rows.map((row, index) => (
                  <RouteOptionRow key={row.id} selected={!!row.selected} disabled={!!row.disabled} locked={!!row.locked}
                    label={row.label} meta={row.meta} last={index === group.rows.length - 1}
                    onSelect={() => onSelectRoute && onSelectRoute(row.id)}
                    action={row.action === "download" ? <IconAction icon="download" label={"Download " + row.label} onPress={() => onDownloadModel && onDownloadModel(row.id)} /> : null} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </React.Fragment>
  );
}

/**
 * Step three: the ephemeral test. Speak, read your own transcript, hear the
 * reply (latency to first word · replay), and go back if it isn't right.
 * Nothing here is saved.
 */
function TryStep({ copy, turn, onPressMic }) {
  return (
    <React.Fragment>
      <IntroTitle>{copy.tryTitle}</IntroTitle>
      <IntroBody>{copy.tryBody}</IntroBody>
      <Divider />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
        {turn ? (
          <React.Fragment>
            <Bubble me>{turn.question}</Bubble>
            <Bubble>{turn.answer}</Bubble>
            <span style={{ display: "flex", alignItems: "center", gap: 7, alignSelf: "flex-start", minHeight: 32, padding: "4px 2px" }}>
              <span style={metaText}>{turn.latency} {copy.toFirstWord}</span>
              <span style={metaText}>·</span>
              <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", border: "none", background: "none", padding: 0 }}>
                <PhosphorIcon name="sound" size="inline" color="var(--mb-color-accent)" />
                <span style={{ ...metaText, color: "var(--mb-color-accent)" }}>{copy.replay}</span>
              </button>
            </span>
          </React.Fragment>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 6 }}>
        <button type="button" aria-label={copy.holdToTalk} onClick={onPressMic}
          style={{ width: 76, height: 76, borderRadius: "var(--mb-radius-icon-button)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)", boxShadow: "0 8px 24px var(--mb-color-glow-strong)" }}>
          <PhosphorIcon name="mic" size="feature" color="var(--mb-color-on-accent)" />
        </button>
        <span style={metaText}>{copy.holdToTalk}</span>
      </div>
    </React.Fragment>
  );
}

/**
 * The introduction: three steps — a welcome that demonstrates instead of
 * describing, one setup screen with a single green path, and an ephemeral test
 * where the user judges the result before anything is asked of them.
 *
 * First-run integrity: no close control (the steps are the way in), step 2's
 * forward action stays disabled until a reasoning model actually runs, and
 * step 3's Done unlocks only after one successful test turn. A re-entry
 * (`firstRun={false}`) gets the close control back on steps 1–2 and an
 * always-enabled Done; step 3 never shows close — Done is the exit.
 */
export function IntroFlow({
  visible = true,
  initialStep = 0,
  firstRun = true,
  thinkingReady = false,
  demoTurn = null,
  copy: overrides,
  autoSetup,
  manualGroups = DEFAULT_MANUAL_GROUPS,
  language = "English",
  onChangeLanguage,
  onClose,
  onPressMic,
  onSelectRoute,
  onDownloadModel,
  style,
}) {
  const copy = React.useMemo(() => ({ ...INTRO_COPY, ...overrides }), [overrides]);
  const [index, setIndex] = React.useState(initialStep);
  const [played, setPlayed] = React.useState(false);
  const [manualOpen, setManualOpen] = React.useState(false);
  const [localTurn, setLocalTurn] = React.useState(null);

  React.useEffect(() => {
    if (visible) { setIndex(initialStep); setPlayed(false); setManualOpen(false); setLocalTurn(null); }
  }, [initialStep, visible]);
  if (!visible) return null;

  const turn = demoTurn || localTurn;
  const goTo = (next) => setIndex(Math.max(0, Math.min(INTRO_STEPS.length - 1, next)));
  const isFirst = index === 0;
  const isLast = index === INTRO_STEPS.length - 1;
  const showClose = !firstRun && !isLast;
  const forwardDisabled = index === 1 && firstRun && !thinkingReady;
  const doneDisabled = firstRun && !turn;
  const navButton = { width: 44, height: 44, flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", padding: 0 };

  const step = INTRO_STEPS[index];
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", flexDirection: "column", background: "var(--mb-color-background)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 52, padding: "0 12px" }}>
        <button type="button" aria-label={copy.back} disabled={isFirst} onClick={() => goTo(index - 1)}
          style={{ ...navButton, opacity: isFirst ? 0 : 1, pointerEvents: isFirst ? "none" : "auto" }}>
          <PhosphorIcon name="back" size="control" color="var(--mb-color-text-secondary)" />
        </button>
        <IntroStepper count={INTRO_STEPS.length} index={index} onSelect={goTo} />
        {showClose ? (
          <button type="button" aria-label={copy.dismiss} onClick={onClose} style={navButton}>
            <PhosphorIcon name="close" size="control" color="var(--mb-color-text-secondary)" />
          </button>
        ) : <span aria-hidden="true" style={{ width: 44, height: 44, flexShrink: 0 }} />}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: "100%", padding: "6px 22px 24px", boxSizing: "border-box" }}>
          {step === "welcome" ? <WelcomeStep copy={copy} played={played} onPlay={() => setPlayed(true)} language={language} onChangeLanguage={onChangeLanguage} /> : null}
          {step === "setup" ? <SetupStep copy={copy} autoSetup={autoSetup} manualOpen={manualOpen} onToggleManual={() => setManualOpen(!manualOpen)} groups={manualGroups} onSelectRoute={onSelectRoute} onDownloadModel={onDownloadModel} /> : null}
          {step === "try" ? <TryStep copy={copy} turn={turn} onPressMic={onPressMic || (() => setLocalTurn(DEMO_TURN))} /> : null}
        </div>
      </div>

      {isLast ? (
        <div style={{ padding: "6px 22px 14px" }}>
          <button type="button" aria-disabled={doneDisabled ? "true" : "false"} onClick={doneDisabled ? undefined : onClose}
            style={{ minHeight: 48, width: "100%", boxSizing: "border-box", borderRadius: "var(--mb-radius-control)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: doneDisabled ? "default" : "pointer", background: "var(--mb-color-accent)", opacity: doneDisabled ? .4 : 1 }}>
            <span style={{ fontFamily: "var(--mb-font-display)", fontWeight: 600, fontSize: 15, color: "var(--mb-color-on-accent)" }}>{copy.done}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
          <button type="button" aria-label={copy.next} aria-disabled={forwardDisabled ? "true" : "false"} onClick={forwardDisabled ? undefined : () => goTo(index + 1)}
            style={{ width: 58, height: 58, borderRadius: "var(--mb-radius-icon-button)", border: "none", cursor: forwardDisabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)", opacity: forwardDisabled ? .4 : 1 }}>
            <PhosphorIcon name="right" size="navigation" color="var(--mb-color-on-accent)" />
          </button>
        </div>
      )}
    </div>
  );
}
