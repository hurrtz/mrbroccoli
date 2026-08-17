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

- [ ] **Header block** (`WorkspaceHeader`, owner call 2026-08): the route byline and settings sentence become **one raised block of two 44pt rows** — surface fill, hairline border, hairline between the rows inset 12pt — sitting **14pt below the top bar**. Row one: provider mark (or `cpu`), model name in the display face, the effort word, caret. Row two: the settings sentence, truncating, with the sliders glyph at the trailing edge. Portrait only; landscape keeps the byline plus the icon-only sentence.
- [ ] The block is never an accent fill — pressable, not loud. If it competes with the orb, it is wrong.

- [ ] **Delete the introduction banner from the home screen** (owner call, 2026-08). The walkthrough is reached from App & diagnostics → Introduction, and opens by itself on a first launch. Nothing advertises on the home screen.
- [ ] **Delete every premium upsell surface** (the gold band and the upgrade sheet). Free edition shows locked rows and the editions row in App & diagnostics; that is the whole story.

## G. Hands free — the drive mode becomes a switch (owner call, 2026-08)

Drive mode is no longer a listening mode. Its whole behaviour — VAD against the ambient profile, silence window with spoken countdown, auto-submit, auto-continue — is one on/off wrapped around whichever input mode is chosen. It ships as the **fourth control in the composing row**: car glyph, “Hands free” captioned on two 12px rows, filled + accent when on.

- [ ] Delete the drive dock row (`DriveSessionControls.tssx` — Pause auto · Repeat last · Resume auto) AND the "Drive Session" entry in Listening's input-mode picker: two modes remain (push-to-talk, tap-to-talk).
- [ ] Add the Hands free switch to the composing row, trailing seat, uniform 20pt gaps — no divider, no scope gap. It is the row's one session-scoped control; the row is otherwise per-question only.
- [ ] The switch **stays live while a turn runs, in both directions** (the one exception to the row's 38% rest): off mid-answer ends the loop after Stop-like cleanup; on mid-answer arms it to continue when this answer finishes.
- [ ] Turning it on starts listening immediately. The orb keeps its ordinary phases — no new "armed" orb state; the filled car and the settings sentence ("Hands free: on") carry the armed state.
- [ ] The transport orbit is unchanged: Stop abandons the turn, never the loop. Remove `drive`/`driveAuto`/`onResume` usages — the component no longer has them.
- [ ] Headset / car-remote buttons toggle the switch; the orb keeps working as the manual press.
- [ ] Premium: in free edition the switch is present but locked, and says so on tap — no upsell sheet (retired).
- [ ] The silence countdown stays spoken only — no on-screen chip.
- [ ] Localise “Hands free” as a two-line caption in all 19 locales (the label may break differently or run one line per locale; two lines max).
- DS: `guidelines/surfaces/workspace.md` → Hands free; `components/workspace/OrbSatellite.jsx` (car glyph, two-line label).

## H2. Transport orbit — replaces the phase-owned ring (owner call, 2026-08)

The row under the orb no longer swaps. **It is composing at every phase**; the verbs that act on a running response orbit the orb. This supersedes the phase-owned ring in every earlier note — build `OrbTransport`, not a second row.

- [ ] The composing row (image, council, web, hands free) is permanent: the same controls at every phase, the per-question three dimmed to 38% and inert while a turn runs (Hands free stays live — see G). It never becomes transport, and **pausing changes nothing about it** — that flicker is the bug this removes.
- [ ] Four transport keys orbit the orb on a circle 34pt clear of its edge: **Back** at 180° and **Forward** at 0° (flanks), **Restart** at 135° and **Stop** at 45° (lower diagonals). Keys render for turn phases only — presence means a turn is running — but **the cluster's footprint is permanent**: `OrbTransport` mounts at every phase, idle included, reserving its box so the orb never moves when a turn starts. Mounting a bare `VoiceOrb` at idle and swapping is the 15pt orb-jump bug.
- [ ] Through transcribing → synthesizing the three seek verbs are `disabled` (0.38, inert); only **Stop** is live, abandoning the turn and returning to idle. In the speaking phase all four come alive; at the last word or on Stop the orb returns to idle.
- [ ] Back = start of the current paragraph, or the preceding paragraph inside the first two seconds. Forward = next paragraph. Restart = first word of the response. Every jump moves the orb's reading arc with the playhead; the orb tap stays pause/resume and keeps position.
- [ ] The cluster reserves its own footprint from the orb diameter — 328×227 at 196pt, which fits a 4.7″ column. Do **not** step the orb down for it; measure the stage and pass a diameter that fits (portrait 196, landscape 150, 156 under the intro banner).
- [ ] Landscape: same model, `labels={false}` — icon-only keys, so a drive session is stoppable there too.
- DS: `components/workspace/OrbTransport.jsx`, `guidelines/surfaces/workspace.md` → Satellites and the transport orbit.

## H2b. Satellite button treatment — the container describes location, never state

- [ ] Remove every well from the satellites: no fill and no border in either appearance, at rest or on. The orb is the only filled object on the stage.
- [ ] A switch that is on says so by **filling its glyph** and taking the accent, label with it (weight + hue, never colour alone). Load the Phosphor **fill** stylesheet next to the regular one; `PhosphorIcon` takes `weight="fill"`.
- [ ] Momentary actions never fill — that is what keeps Image and Council legible as different species now that the border is gone.
- [ ] Press state: a momentary `accent-soft` squircle under the thumb, and nothing at any other time. It is the only pressability cue a borderless target gets, so it is not optional.
- [ ] Drop the hairline divider that used to separate Image from the two switches — species are carried by behaviour now, not chrome.
- DS: `components/workspace/OrbSatellite.jsx`, `guidelines/foundations.md` → Control shape and size.

## H2c. Images live in the Image satellite (owner call, 2026-08)

Nothing is inserted between the orb and the composing row, at any count. There is no attachment strip, no tray and no second row.

- [ ] At rest the control is a plain `image` glyph captioned “Image”. Tapping it opens `AttachmentPopover` on its **empty state**: one line (“No images in this conversation yet.”) and one add action.
- [ ] The add action hands off to the **device's own picker** — camera or library, any number of pictures. Build no in-app browser for it.
- [ ] When the picker returns with images the popup **closes itself** (the only popup in the system that dismisses on a result rather than a tap), the glyph becomes the **deck** — one tile for one image, two for two, three for three and up, each layer behind the front one smaller and fainter — and the caption becomes the localised count (“1 IMAGE”, “9 IMAGES”). **No count badge on the control**; the caption is the number.
- [ ] Tapping the deck reopens the panel with **every** image in a horizontally scrolling row of 64pt thumbs, each with its own delete control (drawn 22pt, target 44pt), and the same add action under a 6pt band.
- [ ] Panel geometry: 252 wide, anchored 10pt above the row with its left edge on the satellite, `AnchoredMenu`'s surface, radius, shadow and transparent click-away, no backdrop dim. Its height is **constant** — three images and forty are the same panel; only the row's scroll length changes.
- [ ] The row's geometry does not change with the count: 232×58 at forty images exactly as at none, and the orb keeps its diameter. If adding an image resizes the orb, the deck has been built in the wrong place.
- [ ] While a turn runs or a drive session is open the whole composing row rests at 38%, deck included, and the panel is unreachable until it ends.
- [ ] Retire the scrolling 128×96 composer strip in `MessageImageAttachments`; the panel replaces it on the stage. The component's compact mode stays a candidate for the transcript, which is still an open decision (`explorations/images-1-to-4.html`).
- DS: `components/workspace/AttachmentPopover.jsx`, `components/workspace/OrbSatellite.jsx` (`thumbnails`), `guidelines/surfaces/workspace.md` → Images.

## H3. The orb's rings

- [ ] Anatomy, inside out: disc → a small gap that is only ever a gap (the screen reads through it, identical in every phase, ~3pt) → **one 12pt ring**. The inner/outer pair is merged (owner call, 2026-08).
- [ ] Ring colour: **slate in every phase** (`turn-ink` fill on `turn-track`). The ring is a fill meter, not a judgement — no green on it, ever; the phase colour lives in the disc alone. Red remains the overtime fill.
- [ ] Per phase, one meter: **idle** faded to the track, no clock; **recording** how much of the window is used before auto-submit; **transcribing → synthesizing** the whole turn against its estimate; **speaking** how much of the response has been read. Past the estimate it fills red.
- DS: `components/workspace/VoiceOrb.jsx`, `guidelines/surfaces/workspace.md` → The orb.

## H4. Status line — removed

- [ ] Remove the status line under the orb entirely (phase dot · activity · conversation meta). Phase feedback lives in the orb; the transcript handle's meta line owns conversation name and age. `WorkspaceStatusLine` is retired from the design system.

## H. Conversations drawer

- [ ] Trailing **"Archived"** section in the list itself, collapsed by default (keep the Data & privacy entry as the second route).
- [ ] [verify] Pinned/Earlier headers with clear separation between the last pinned row and the "Earlier" header once pins exist (capture shows only EARLIER).
- [ ] [verify] Forks are flat, first-class rows: no nesting, no fork lines; forked sessions carry a tappable root tag **on its own row** — root name + "›", 44pt target, no "Fork of" prefix, no quotes. Tapping jumps to the root.
- [ ] Session actions: replace the bottom sheet with the DS `AnchoredMenu` — anchored at the row’s kebab, no dim, groups Organize (pin, archive, private) / Identity (rename, name automatically) / Out (share, copy) / Delete (danger, alone). No “Show root conversation” item: the root tag on the row is the fork affordance.
- [ ] [verify] Provider icons in the meta row repeat per model — two models of one provider = that icon twice.
- [ ] [verify] Swipe-to-delete on rows (kebab exists; swipe is the staple).
- [ ] Park integrity review + conversation memory: remove both from the session actions surface (features parked, owner 2026-08; revisit later).
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
