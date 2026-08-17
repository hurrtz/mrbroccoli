The three-step introduction — the app's only onboarding, never a blocking wizard. Reached from App & diagnostics → Introduction, and it opens itself on a first launch.

```jsx
<IntroFlow visible={intro} onClose={() => setIntro(false)}
  thinkingReady={llmRunning} setupGroups={routesFromDeviceState}
  onDownloadModel={downloadModel} onSelectRoute={selectRoute}
  onPressMic={startTestTurn} onChangeLanguage={cycleIntroLanguage} />
```

Steps: **welcome** (the stored intro session emerges from blur under the headline; play answers the crisp query "Prove it, Mr Broccoli — say hello in your own voice."; after play, an informational voice note fills the whitespace), **setup** ("Don't panic" — the promise in prose, the three pipeline glyphs, then the routes themselves: pipeline-ordered groups He listens / He thinks / He answers built from `RouteOptionRow` + `IconAction`, with the one required reasoning-model download and the phone already answering the other two), **try** (ephemeral test: hold to talk, own words transcribed, spoken reply with "2.4 s to first word · Replay", full-width Done).

First-run integrity (`firstRun`, default true): no close control anywhere; step 2's forward orb stays disabled until `thinkingReady`; Done stays disabled until one test turn exists. Re-entry (`firstRun={false}`) restores close on steps 1–2 (never step 3 — Done is the exit) and unlocks both gates.

Nothing in step 2 downloads on its own — a download starts when the user taps its squircle, and the settings lifecycle applies verbatim (download → test → the radio unlocks). Pass `setupGroups` to mirror the real device state; `DEFAULT_SETUP_GROUPS` is a specimen, not a device reading.

Persona: Mr Broccoli is a "he" (see guidelines/content.md); premium appears nowhere in the flow. Copy defaults are canonical — override `copy` only to translate, and swap the on-screen dialogue with the audio language so the "say hello" pairing holds.
