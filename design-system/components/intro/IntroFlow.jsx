import React from "react";
import { PhosphorIcon } from "../core/PhosphorIcon";
import { IntroTitle } from "./IntroTitle";
import { IntroBody } from "./IntroBody";
import { IntroDivider } from "./IntroDivider";
import { IntroPanel, IntroPanelDivider } from "./IntroPanel";
import { IntroPoint } from "./IntroPoint";
import { IntroButton } from "./IntroButton";
import { IntroStepper } from "./IntroStepper";
import { IntroVoicePicker } from "./IntroVoicePicker";
import { AutoSetupCard } from "../on-device/AutoSetupCard";

export const INTRO_STEPS = ["welcome", "requirements", "auto", "llm", "stt", "tts", "premium"];

/** English defaults. Pass `copy` to translate; every string is overridable. */
export const INTRO_COPY = {
  welcomeTitle: "Welcome to Mr Broccoli",
  welcomePlay: "Hear what it sounds like",
  welcomePlaying: "Playing — tap to stop",
  welcomeBody: "Speak naturally, and get back an answer worth listening to. The next few screens show what the app needs to run and what it can do. It takes a minute, and you can leave at any point.",

  needsTitle: "What you actually need",
  needsBody: "One thing, and it is a download rather than a decision. Everything else is optional and can wait.",
  needsLlmTitle: "A model that thinks",
  needsLlmBody: "One or two downloads, or a key from a provider you already use. This is the only requirement.",
  needsSttTitle: "Speaking to it — optional",
  needsSttBody: "You can always type instead.",
  needsTtsTitle: "It speaking back — optional",
  needsTtsBody: "Your phone can already read answers aloud.",

  autoTitle: "Let the app pick",
  autoBody: "Mr Broccoli can measure what this phone is able to run, then pick one model to think with, one to hear you and one to speak back. You see the list before anything downloads, and you can change any of it later.",
  recommended: "Recommended",

  llmTitle: "Pick something to think with",
  llmBody: "Two ways, and you can change your mind later or use both.",
  llmLocalTitle: "Run it on this phone",
  llmLocalBody: "One download, then it costs nothing and works with no signal at all.",
  llmProviderTitle: "Use a provider you already have",
  llmProviderBody: "Paste a key from OpenAI, Anthropic, Google and others. You pay them directly for what you use.",
  startLocal: "Install on-device AI",
  startProvider: "Connect a provider",

  sttTitle: "Let it hear you",
  sttBody: "This is a voice app, and talking to it is the whole point.",
  sttWhyTitle: "Why it is worth it",
  sttWhyBody: "Speaking is faster than typing and works while your hands are busy. It is the difference between using the app and reading it.",
  sttSkipTitle: "If you skip it",
  sttSkipBody: "You can type every message instead. Nothing breaks.",

  ttsTitle: "Let it speak back",
  ttsBody: "Hearing an answer is very different from reading one. Try it below.",
  ttsListenLabel: "Hear a real answer",
  ttsSkipTitle: "If you skip it",
  ttsSkipBody: "Your phone's built-in voice reads answers aloud. It works, it is just plainer than this.",
  hearDisclaimer: "Pre-recorded example. What you hear depends on the models and voices you choose.",

  wrapTitle: "That is everything",
  wrapBody: "The app is yours to use from here. Premium exists if you want more than the basics.",
  premiumProvidersTitle: "Every provider, your keys",
  premiumProvidersBody: "Frontier models from OpenAI, Anthropic, Google and more, billed by them, never marked up.",
  premiumToolsTitle: "Web search and images",
  premiumToolsBody: "Ask about things that happened today, or show it a photo.",
  premiumCouncilTitle: "Model Council",
  premiumCouncilBody: "Several models answer, review each other, and converge on something better than any one of them.",
  premiumOnceTitle: "Paid once, not monthly",
  premiumOnceBody: "A single purchase, no account, no subscription.",
  upgrade: "Upgrade to Premium",

  optional: "Optional",
  openSpeaking: "Open speech settings",
  back: "Back",
  next: "Next",
  dismiss: "Dismiss introduction",
  done: "Done",
};

/**
 * Step one: the greeting.
 *
 * A single large play button carries the whole screen. Someone who has just
 * installed a voice app should be able to hear it before reading anything, and
 * a control this size needs no explanation. It never autoplays — a voice
 * starting by itself is startling.
 */
function WelcomeStep({ copy }) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: "24px 0" }}>
      <button type="button" onClick={() => setPlaying((on) => !on)}
        aria-label={playing ? "Stop" : copy.welcomePlay}
        style={{
          width: 148, height: 148, borderRadius: 999, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: playing ? "var(--mb-color-surface-alt)" : "var(--mb-color-accent)",
          border: "2px solid " + (playing ? "var(--mb-color-accent)" : "transparent"),
          boxShadow: "0 8px 24px var(--mb-color-glow-strong)",
        }}>
        <PhosphorIcon name={playing ? "pause" : "audio"} size="hero"
          color={playing ? "var(--mb-color-accent)" : "var(--mb-color-on-accent)"} />
      </button>
      <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 14, letterSpacing: "0.3px", color: "var(--mb-color-accent)" }}>
        {playing ? copy.welcomePlaying : copy.welcomePlay}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 6 }}>
        <IntroTitle>{copy.welcomeTitle}</IntroTitle>
        <IntroBody>{copy.welcomeBody}</IntroBody>
      </div>
    </div>
  );
}

/**
 * Step two: the honest shape of setup.
 *
 * The single most useful thing a new user can learn is how little is actually
 * required. One model download and the app works; everything else is an
 * improvement they can make later or never.
 */
function RequirementsStep({ copy }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.needsTitle}</IntroTitle>
      <IntroBody>{copy.needsBody}</IntroBody>
      <IntroPanel>
        <IntroPoint icon="cpu" title={copy.needsLlmTitle} body={copy.needsLlmBody} />
        <IntroPanelDivider />
        <IntroPoint icon="mic" title={copy.needsSttTitle} body={copy.needsSttBody} tone="neutral" />
        <IntroPoint icon="sound" title={copy.needsTtsTitle} body={copy.needsTtsBody} tone="neutral" />
      </IntroPanel>
    </div>
  );
}

/**
 * Step three: the offer to do the whole thing.
 *
 * It sits before the manual routes rather than after them, because the manual
 * routes are the fallback now. Someone who takes this tap never needs to read
 * the three screens that follow; someone who declines it has lost nothing but a
 * swipe. The card keeps no header of its own here — the step title and body are
 * already saying what it is.
 */
function AutoSetupStep({ copy, autoSetup, onNext }) {
  const host = autoSetup || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.autoTitle}</IntroTitle>
      <IntroDivider label={copy.recommended} />
      <IntroBody>{copy.autoBody}</IntroBody>
      <AutoSetupCard {...host} showHeader={false}
        onManual={host.onManual || onNext}
        onContinue={host.onContinue || onNext}
        onFinish={host.onFinish || onNext} />
    </div>
  );
}

/** Step four: the one requirement, and the two ways to satisfy it. */
function LlmStep({ copy, onConnectProvider, onInstallLocal }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.llmTitle}</IntroTitle>
      <IntroBody>{copy.llmBody}</IntroBody>
      <IntroPanel>
        <IntroPoint icon="download" title={copy.llmLocalTitle} body={copy.llmLocalBody} />
        <IntroButton icon="download" label={copy.startLocal} onPress={onInstallLocal} />
        <IntroPanelDivider />
        <IntroPoint icon="key" title={copy.llmProviderTitle} body={copy.llmProviderBody} tone="premium" />
        {/* Provider keys are a Premium capability, so this carries the Premium
            tone and leads where the capability is actually obtained. */}
        <IntroButton label={copy.startProvider} tone="premium" onPress={onConnectProvider} />
      </IntroPanel>
    </div>
  );
}

/** Step five: speech in. Optional, but the app is built around it. */
function SttStep({ copy, onOpenStt }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.sttTitle}</IntroTitle>
      <IntroDivider label={copy.optional} />
      <IntroBody>{copy.sttBody}</IntroBody>
      <IntroPanel>
        <IntroPoint icon="mic" title={copy.sttWhyTitle} body={copy.sttWhyBody} />
        <IntroPanelDivider />
        <IntroPoint icon="edit" title={copy.sttSkipTitle} body={copy.sttSkipBody} tone="neutral" />
        <IntroButton label={copy.openSpeaking} tone="secondary" onPress={onOpenStt} />
      </IntroPanel>
    </div>
  );
}

/**
 * Step six: speech out, with the evidence attached.
 *
 * Claiming the app sounds good is worth less than letting someone hear it, so
 * the picker sits directly under the claim.
 */
function TtsStep({ copy, onOpenTts, language, onChangeLanguage }) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.ttsTitle}</IntroTitle>
      <IntroDivider label={copy.optional} />
      <IntroBody>{copy.ttsBody}</IntroBody>
      <IntroPanel>
        <span style={{ fontFamily: "var(--mb-font-body-medium)", fontWeight: 500, fontSize: 15, color: "var(--mb-color-text)" }}>{copy.ttsListenLabel}</span>
        <IntroVoicePicker value={language} onChange={onChangeLanguage}
          playing={playing} onTogglePlay={() => setPlaying((on) => !on)} />
        <span style={{ fontFamily: "var(--mb-font-body)", fontSize: 12, lineHeight: "17px", color: "var(--mb-color-text-muted)" }}>{copy.hearDisclaimer}</span>
        <IntroPanelDivider />
        <IntroPoint icon="sound" title={copy.ttsSkipTitle} body={copy.ttsSkipBody} tone="neutral" />
        <IntroButton label={copy.openSpeaking} tone="secondary" onPress={onOpenTts} />
      </IntroPanel>
    </div>
  );
}

/** Step seven: what paying buys, stated as capability rather than as a plea. */
function PremiumStep({ copy, onOpenPremium }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <IntroTitle>{copy.wrapTitle}</IntroTitle>
      <IntroBody>{copy.wrapBody}</IntroBody>
      <IntroPanel>
        <IntroPoint icon="key" title={copy.premiumProvidersTitle} body={copy.premiumProvidersBody} tone="premium" />
        <IntroPoint icon="global" title={copy.premiumToolsTitle} body={copy.premiumToolsBody} tone="premium" />
        <IntroPoint icon="branch" title={copy.premiumCouncilTitle} body={copy.premiumCouncilBody} tone="premium" />
        <IntroPoint icon="lock" title={copy.premiumOnceTitle} body={copy.premiumOnceBody} tone="premium" />
      </IntroPanel>
      <IntroButton label={copy.upgrade} tone="premium" onPress={onOpenPremium} />
    </div>
  );
}

const STEP_CONTENT = {
  welcome: WelcomeStep, requirements: RequirementsStep, auto: AutoSetupStep, llm: LlmStep,
  stt: SttStep, tts: TtsStep, premium: PremiumStep,
};

/**
 * The introduction: seven steps covering what the app is, what setup actually
 * requires, the offer to configure the device automatically, the one thing that
 * is required, the two things that are not, and what Premium adds.
 *
 * It owns the whole display because it is the only thing a first-time user
 * should be dealing with, and it follows the app's light or dark appearance
 * rather than carrying its own. An earlier version was permanently dark so it
 * would read as a distinct place; in a light app that landed as two products
 * stitched together. Distinctness belongs to the one surface that has to
 * interrupt — the workspace banner — and the flow behind it is simply the app.
 */
export function IntroFlow({
  visible = true,
  initialStep = 0,
  copy: overrides,
  autoSetup,
  onClose,
  onConnectProvider,
  onInstallLocal,
  onOpenPremium,
  onOpenStt,
  onOpenTts,
  style,
}) {
  const copy = React.useMemo(() => ({ ...INTRO_COPY, ...overrides }), [overrides]);
  const [index, setIndex] = React.useState(initialStep);
  const [language, setLanguage] = React.useState();

  React.useEffect(() => { if (visible) setIndex(initialStep); }, [initialStep, visible]);
  if (!visible) return null;

  const goTo = (next) => setIndex(Math.max(0, Math.min(INTRO_STEPS.length - 1, next)));
  const isFirst = index === 0;
  const isLast = index === INTRO_STEPS.length - 1;
  // The source draws a 40pt circle; the target around it is grown to 44 so the
  // glyph never defines the touch area. Negative margins keep the optical position.
  const headerButton = {
    width: 44, height: 44, margin: -2, flexShrink: 0, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "none", background: "none", padding: 0,
  };
  const headerButtonFace = {
    width: 40, height: 40, borderRadius: 999,
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "1px solid var(--mb-color-border)", background: "var(--mb-color-surface)",
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, display: "flex", flexDirection: "column", background: "var(--mb-color-background)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, minHeight: 52, padding: "0 18px" }}>
        <button type="button" aria-label={copy.back} disabled={isFirst} onClick={() => goTo(index - 1)}
          style={{ ...headerButton, opacity: isFirst ? 0 : 1, pointerEvents: isFirst ? "none" : "auto" }}>
          <span style={headerButtonFace}>
            <PhosphorIcon name="left" size="control" color="var(--mb-color-text-secondary)" />
          </span>
        </button>
        <IntroStepper count={INTRO_STEPS.length} index={index} onSelect={goTo} />
        <button type="button" aria-label={copy.dismiss} onClick={onClose} style={headerButton}>
          <span style={headerButtonFace}>
            <PhosphorIcon name="close" size="control" color="var(--mb-color-text-secondary)" />
          </span>
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden" }}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 16, minHeight: "100%",
          padding: "6px 22px 24px", boxSizing: "border-box",
        }}>
          {React.createElement(STEP_CONTENT[INTRO_STEPS[index]], {
            copy, language, onChangeLanguage: setLanguage, autoSetup,
            onNext: () => goTo(index + 1),
            onConnectProvider: () => onConnectProvider && onConnectProvider(index),
            onInstallLocal, onOpenStt, onOpenTts,
            onOpenPremium: () => onOpenPremium && onOpenPremium(index),
          })}
        </div>
      </div>

      {/* The forward action becomes a finish action on the last step. It used to
          retire into an empty spacer, on the reasoning that the close control
          was already an exit — but testers read the resulting gap as a missing
          button. An ending needs to look like an ending, in the place the
          button has occupied for five screens. */}
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
        <button type="button" aria-label={isLast ? copy.done : copy.next}
          onClick={isLast ? onClose : () => goTo(index + 1)}
          style={{
            width: 58, height: 58, borderRadius: 999, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", background: "var(--mb-color-accent)",
          }}>
          <PhosphorIcon name={isLast ? "check" : "right"} size="navigation" color="var(--mb-color-on-accent)" />
        </button>
      </div>
    </div>
  );
}
