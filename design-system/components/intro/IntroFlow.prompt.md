The three-step introduction that `IntroBanner` opens — the app's only onboarding, never a blocking wizard.

```jsx
<IntroBanner onOpen={() => setIntro(true)} />
<IntroFlow visible={intro} onClose={() => setIntro(false)}
  autoSetup={auto.cardProps} thinkingReady={llmRunning}
  onPressMic={startTestTurn} onChangeLanguage={cycleIntroLanguage} />
```

Steps: **welcome** (the stored intro session emerges from blur under the headline; play answers the crisp query "Prove it, Mr Broccoli — say hello in your own voice."; after play, an informational voice note fills the whitespace), **setup** ("Don't panic" — one green "Set up automatically" action; "Show manual setup" switch reveals the pipeline-ordered groups He listens / He thinks / He answers built from `RouteOptionRow` + `IconAction`), **try** (ephemeral test: hold to talk, own words transcribed, spoken reply with "2.4 s to first word · Replay", full-width Done).

First-run integrity (`firstRun`, default true): no close control anywhere; step 2's forward orb stays disabled until `thinkingReady`; Done stays disabled until one test turn exists. Re-entry (`firstRun={false}`) restores close on steps 1–2 (never step 3 — Done is the exit) and unlocks both gates. The manual switch resets to off on every open.

Persona: Mr Broccoli is a "he" (see guidelines/content.md); premium appears nowhere in the flow. Copy defaults are canonical — override `copy` only to translate, and swap the on-screen dialogue with the audio language so the "say hello" pairing holds.
