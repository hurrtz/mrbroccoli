# Implementation gap list — Mr Broccoli app vs design system

Date: 2026-08-13 · Compared: 26 screenshots of build 3.2.0 against the design system charters (`guidelines/`), components (`components/`) and kits (`ui_kits/`). The design system is the source of truth; file references below are relative to its root (the synced copy in the repo).

How to use: each unchecked box is one work item with its acceptance criterion. **[verify]** marks behavior a static screenshot cannot prove — confirm it, fix if absent. Lines starting with ✓ already match; keep them as regression anchors.

## A. Global sweeps

- [ ] Purge "On-device AI" from user-facing copy — the page was retired in the settings restructure. Seen live: auto-setup card footer "You can change any of it later in On-device AI." (intro step 2 and App & diagnostics) → "…later in Settings." (DS: `components/on-device/AutoSetupCard.jsx`).
- [ ] Drop the "· On-device AI" suffix from model names in Listening, Speaking and the Data & privacy storage list ("Whisper Small", not "Whisper Small · On-device AI") — the meta line already disambiguates ("Test passed · 925 MB" vs "Provider · gpt-4o-mini-transcribe").
- [ ] Intro nav controls are bare borderless glyphs on 44pt targets: back is **arrow-left** (not a chevron), close is the plain X — remove the filled circles behind them (DS: `components/intro/IntroFlow.jsx`, `guidelines/surfaces/intro.md`).
- [ ] Replace the git-branch fork glyph in message actions — it reads developer-only; use the DS transcript's settled fork action icon (see `components/transcript/`).
- [ ] Persona pronoun sweep, all 19 locales: Mr Broccoli is "he", never "it"; the app says "I" when speaking as itself (`guidelines/content.md` → Persona pronoun).
- [ ] Sentence-case sweep on option labels and echoes: "Paragraphs Arrive" → "Paragraphs arrive"; voice names title-cased where echoed ("Cosmo", not "cosmo").

## B. Introduction · Step 1 — Welcome

- [ ] Headline is **"Welcome"** alone — the name lives in the dialogue; "Welcome to Mr Broccoli" doubles the name with the bubbles.
- [ ] The dialogue **emerges from blur** beneath the headline: earlier turns at blur 4px/opacity .50 → 2.4px/.65 → 1.1px/.85 plus a vertical mask fading toward the headline (`linear-gradient(to bottom, transparent 2%, rgba(0,0,0,.4) 30%, #000 68%)`). Currently all four bubbles render crisp.
- [ ] Bottom-anchor the dialogue so it ends just above the play button; currently top-pinned under the headline with dead space before the button.
- [ ] The crisp final bubble is the user's challenge that play answers — canonical: "Prove it, Mr Broccoli — say hello in your own voice." ("How does this application work?" doesn't set up play-as-answer.) Align the whole dialogue to `INTRO_COPY` or consciously promote the app's lines into the DS — one source of truth.
- [ ] Blurred turns are decoration: `aria-hidden`; only the crisp query, the play button and the language switch are announced.
- [ ] [verify] After play, the whitespace takes the "···" separator (mono, letter-spaced) plus the voice-honesty note: "This voice was generated off-device by a partner provider. On-device voices sound different: simpler, free, one download away." No premium pitch on this step.
- [ ] [verify] The language switch swaps the on-screen dialogue AND the recording together, per language.
- [ ] [verify] The welcome dialogue ships as the real stored "intro session", openable like any conversation (`guidelines/surfaces/intro.md`).

## C. Introduction · Step 2 — Don't panic

- [ ] Idle state shows the uncontained hero with ONE green action, labeled **"Set up automatically"** — the recommendation/progress card (`AutoSetupCard`) appears only once the job is non-idle. Currently the full card with measured stats and "Check this phone" renders immediately.
- [ ] Reconcile CTA vocabulary with the DS `AutoSetupCard` state labels ("Check this phone" is not in the settled vocabulary).
- [ ] heroBody: canonical is "Mr Broccoli measures what this phone can run, shows you the set that fits, and installs it in one go. Nothing downloads before you say so." The app ships a shorter line — align one way or the other (see P).
- [ ] Manual setup shows **every route at a glance — no second layer of drawers**: per group, the system route ("Your phone", no description — already correct), concrete on-device model rows (name + "Not installed · size" + download squircle; radio disabled until tested) and the provider row as a locked ghost in free. "Choose a model ›" reintroduces the drawer the charter removed. If the full catalogue is too long, inline the recommended model + system route and keep one "More models…" row — the default decision must be takable on this screen.
- [ ] Required/Optional pills: Required = accent ring + accent-soft fill; Optional = quiet border + raised surface (screenshot's REQUIRED pill looks solid-filled — check tokens).
- [ ] Forward orb gating (first run): disabled at 40% opacity until a reasoning model is actually running. Currently enabled while "He thinks" has nothing selected.
- [ ] [verify] "Show manual setup" resets to off on every open of the intro.
- ✓ Title/body ("Don't panic" / "One required download and it works."), divider, "Let's get you started", pipeline glyphs He listens · He thinks · He answers (mic/cpu/sound), switch label in regular body weight, right-aligned tags, "Manual setup" section headline.

## D. Introduction · Step 3 — Try it out!

- [ ] Done gating (first run): disabled at 40% until one successful test turn exists — screenshot shows it enabled over an empty transcript.
- [ ] Title carries the exclamation: "Try it out!" — align or update the DS string.
- [ ] tryBody: canonical "…Not happy with it? Step back, change it, try again." (app drops "with it") — align or update DS.
- [ ] [verify] Test turn UI: own words as accent-soft bubble, reply as incoming bubble, then the meta row "N.N s to first word · [sound] Replay" — latency measured release-to-first-word, standard separator dot, Replay is an accent text-button with the loudspeaker.
- [ ] [verify] The test conversation is ephemeral — nothing saved, no session created.
- [ ] Mic button: DS spec is 76pt with "Hold to talk" beneath — the build's looks materially larger; align (or consciously update the DS).
- ✓ No close control on step 3; back present; full-width Done; divider under the intro copy; no redundant empty-state hint.

## E. Introduction — first-run integrity

- [ ] firstRun: **no close control on any step** (captures show X on steps 1–2 — legitimate only if these are re-entry via the App & diagnostics "Introduction" toggle; prove the gating is wired, not just styled).
- [ ] Re-entry (`firstRun=false`): close returns on steps 1–2 only (never step 3), both gates unlocked.
- ✓ Back hidden on step 1.

## F. Home screen & intro banner

- [ ] Banner background: violet **gradient** `--mb-color-intro-banner-grad-a → -b` (135deg) with the slow sheen (3.6s loop; shared vocabulary with PremiumBand) — currently flat violet, no sheen. Shadow `0 6px 20px --mb-color-intro-banner-shadow`.
- [ ] Orb steps down **196 → 156** while the banner is visible — the build keeps the orb full-size under it.
- [ ] [verify] Dismiss (X) is withheld until the intro has been opened at least once; before that the banner ends in a chevron.
- [ ] [verify] The whole banner is one pressable; the play circle is a drawn affordance, not a separate target.
- [ ] [verify] Landscape collapses the banner to the single 48pt compact row.
- ✓ Banner copy ("Set up Mr Broccoli" / "A minute of setup gets him thinking, hearing you and speaking back."), hairline play circle, placement above the orb.

## G. Drive mode

- [ ] Replace the three-button row (Pause auto · Repeat last · Resume auto, one always disabled) with the DS `DriveSessionControls`: **Repeat last** (quiet) + ONE fixed-position **Pause/Resume toggle** whose accent fill means the loop is live (filled + pause glyph while running; quiet + play glyph when paused). Positions never swap.
- [ ] The silence countdown gets an on-screen home: "Sends in N…" chip (accent-soft, mono, `role="status"`) above the toggle while the window runs — today it is only spoken.
- [ ] 48pt targets, 14px labels; `disabled` (pipeline busy) dims both buttons, never removes them.
- [ ] Headset / car-remote buttons map to the same two actions.
- DS: `components/workspace/DriveSessionControls.jsx`, `guidelines/surfaces/workspace.md` → Drive mode.

## H. Conversations drawer

- [ ] Trailing **"Archived"** section in the list itself, collapsed by default (keep the Data & privacy entry as the second route).
- [ ] [verify] Pinned/Earlier headers with clear separation between the last pinned row and the "Earlier" header once pins exist (capture shows only EARLIER).
- [ ] [verify] Forks are flat, first-class rows: no nesting, no fork lines; forked sessions carry a tappable root tag **on its own row** — root name + "›", 44pt target, no "Fork of" prefix, no quotes. Tapping jumps to the root.
- [ ] Session actions sheet gains **"Show root conversation"** on forked sessions.
- [ ] [verify] Provider icons in the meta row repeat per model — two models of one provider = that icon twice.
- [ ] [verify] Swipe-to-delete on rows (kebab exists; swipe is the staple).
- [ ] Actions sheet style: one grouped card with hairline dividers, not one outlined card per action.
- ✓ Search bar docked at the bottom (no fade above it), prominent green + in the header, row meta "date · N messages · icons", close at top-left.

## I. Transcript

- [ ] Fork action glyph (see A).
- [ ] [verify] Collapse rules: every message clamps to 3 rows with ellipsis; the latest message of an ongoing session lands expanded; entering an old session, all collapsed; tapping toggles.
- [ ] Meta line: usage stats ON → expandable stats block (matches ✓); usage stats OFF → **no meta line at all** [verify].
- [ ] [verify] Council replies read "council of" + one provider icon per member (duplicates allowed) — never "council of N".
- [ ] [verify] Swipe a message to delete it from context (no attention sign in the affordance).
- ✓ Chevron right-aligned on the name/date line; expandable usage stats (route, reasoning, timing, token estimate); YOU/model margin speakers.

## J. Settings — overview

- [ ] Row summaries: replace mid-word truncation ("Alibaba / Qwen not…") with two named statuses + "+N".
- [ ] Casing in echoes: "xAI · Cosmo · Paragraphs arrive".
- ✓ Seven-page structure, readiness dots, CONVERSATION / VOICE / PRIVACY & APP groups, gold premium state, version footer.

## K. Settings — route pages

- [ ] Model names without the "· On-device AI" suffix (see A).
- [ ] System route descriptions: one line at most — "System Recognition" currently carries a paragraph.
- [ ] Decide below-target selectability once, then implement consistently in Listening + Speaking: Kokoro "Works, but slower than recommended" — either below-target is non-viable (radio stays locked, detail line explains) or viable-with-warning (radio unlocks, warning stays). Record the rule in `guidelines/surfaces/settings.md`.
- [ ] [verify] Egg lifecycle end-to-end: download → egg (test) → cracked egg + retry on failure → radio unlocks on pass; swipe removes installed models on the route pages.
- [ ] [verify] Voice picker: flat list with an inline test-play per voice — no container-in-container.
- [ ] "Speech delivery instructions" when the route doesn't support it: a single explanatory line, not a disabled ghost textarea (also in the conversation settings modal, see M).
- ✓ Thinking (roster of up to 4, council gate, system prompt), Search ("Who searches" + Nobody), Connections (capability tags, Working/Invalid/Not tested pills, keychain footer), egg footer copy, provider rows expanding inline with Model/Voice sub-rows, Clear speech cache + 14-day note.

## L. Settings — Data & privacy / App & diagnostics

- [ ] Stale auto-setup footer copy (see A).
- [ ] [verify] Free edition renders the identical seven-page tree — provider routes as locked ghosts, gold upgrade path; every capture here is premium.
- ✓ Storage-in-models list with Remove + "this list only frees space" footer; encrypted backup import/export with exclusions note; past-conversation-knowledge toggle + explainer; Introduction re-open toggle; usage-stats toggle; diagnostics group.

## M. Conversation settings modal

- [ ] TTS voice: flatten the card-in-card picker to a standard picker row (Speaking-page vocabulary).
- [ ] Unsupported speech-delivery instructions: one line, no dead textarea.
- ✓ Adaptive length segmented control, tone chips, thinking instructions, full-width Done; rename + "Name automatically" live in the session actions sheet.

## N. Premium surfaces

- [ ] [verify] Free edition: PremiumBand (gold, sheen) is the teaser; every surface that sells premium in detail states the keys-honesty rule — "your own keys, billed by the provider; no models, voices or credits included" (`guidelines/content.md` → Premium honesty).
- [ ] [verify] Premium appears nowhere inside the intro flow.
- [ ] Animation-as-ornament stays reserved for exactly two surfaces: intro banner + premium band.

## O. Localization

- [ ] Every changed string above lands in all 19 locales; the intro dialogue and challenge line are localized in lockstep with the per-language recordings so text and audio always match.

## P. Parked decisions (owner calls — do not build yet)

- Intro session in the conversations drawer: visible from day one vs only after first opened from the welcome step (designer lean: after).
- Copy source of truth where the app diverges (heroBody, tryBody, welcome dialogue): align app → DS canonical, or promote the app's lines into the DS defaults. Pick one; don't maintain two.
