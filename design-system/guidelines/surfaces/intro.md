# Surface: the introduction

The normative description of the first-launch walkthrough. Living demo: `ui_kits/intro/`. Component: `components/intro/IntroFlow.jsx` (steps, copy defaults, manual catalogue, gating).

## Steps

Three — `INTRO_STEPS = ["welcome", "setup", "try"]` — replacing the earlier seven-page wizard (2026-08): a walkthrough that demonstrates instead of describing, one setup screen with a single green path, and a live test where the user judges the result. The old requirements / auto / llm / stt / tts / premium pages collapse into step 2; premium appears nowhere in the flow (the first premium surface a new user meets is the settings overview, after the app has proven itself).

## First-run integrity

On a first run there is no close control — the three steps are the way in. Step 2's forward action stays disabled until a reasoning model is actually running (the one hard requirement; speech routes default to the system). Step 3 ends in a full-width **Done** that stays disabled until one successful test turn. A re-entry (`firstRun={false}`) restores the close control on steps 1–2 and unlocks both gates; step 3 never shows close — Done is the exit. Navigation controls are borderless bare glyphs (44pt targets): `back` (arrow-left), `close` (x), the accent forward orb.

## Step 1 · Welcome

Under the headline, the **stored intro session** emerges from blur (4 → 2.4 → 1.1 px, plus a mask fade): three earlier turns in the app's messenger anatomy, culminating in the crisp query *"Prove it, Mr Broccoli — say hello in your own voice."* The centered play button answers it with the localized recording (`intro-<lang>.m4a`, 19 languages); the delicate language switch sits beneath, and switching must swap the on-screen dialogue with the audio so the pairing holds. After play, the whitespace takes a `···`-separated **informational voice note** (off-device partner voice vs on-device difference — no premium pitch). The blurred turns are `aria-hidden`; user bubbles use the accent-soft tint, not filled accent. The dialogue is not theater: it ships as a real stored session. **Open decision (owner):** when that session appears in the conversations drawer — from day one, or only after the user first opens it from here (designer's lean: the latter).

## Step 2 · Don't panic

Title "Don't panic", body "One required download and it works.", hairline divider. The uncontained hero: "Let's get you started", the promise in prose (measuring first — nothing downloads unseen), the three pipeline glyphs (**He listens · He thinks · He answers** — persona pronoun per `guidelines/content.md`), and one green **Set up automatically** button that hands off to the auto-setup job (any non-idle state renders `AutoSetupCard`, `showHeader={false}`; the device probe lives inside that job's measure step). Beneath, right-aligned: **"Show manual setup"** in regular body type with an OS-native switch — off by default, reset on every open. Toggled on, a "Manual setup" headline introduces the pipeline-ordered groups, each captioned with a right-aligned Required/Optional tag pill and built from the settings primitives (`RouteOptionRow` + `IconAction`): system routes are plain "Your phone" rows (selected, no meta), models carry name + "Not installed · size" + the download squircle, the provider route is a locked ghost. The settings lifecycle applies verbatim: download → test → radio unlocks; removal by swipe.

## Step 3 · Try it out!

Body: "Your setup is running — ask something and hear how he answers. Not happy with it? Step back, change it, try again." Divider, then the **ephemeral test**: hold-to-talk mic (76pt, "Hold to talk" beneath), the user's words transcribed as an accent-soft bubble, the spoken reply as an incoming bubble, and a meta row "**2.4 s to first word · 🔊 Replay**" (latency = release-to-speech; the number that improves when routes change). Nothing is saved. A turn that completes unlocks Done. Integration note: the test turn runs on the user's configured model — free and local on the default path; show a caution only if a provider key is already active.

## The way in — no banner

The walkthrough is reached from **App & diagnostics → Introduction**, and on a first launch it opens by itself. The violet `IntroBanner` that used to advertise it on the home screen is retired (owner call, 2026-08): the home screen advertises nothing. The violet/gold question dies with it.

## Superseded

`IntroBanner`, and before it the seven-step wizard (welcome / requirements / auto / llm / stt / tts / premium) with its step-layout parts — `IntroPanel`, `IntroPanelDivider`, `IntroPoint`, `IntroDivider`, `IntroButton`, `IntroVoicePicker` — are retired: all of them were **deleted** from the system in 2026-08 (removed 2026-08) are superseded by this design. The primitives remain compiled for specimen cards and ad-hoc use until the app migration retires them. Upstream `IntroFlowScreen.tsx` swipe-paging maps to three pages now.
