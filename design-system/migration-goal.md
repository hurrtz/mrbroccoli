# Goal: migrate the Mr Broccoli design system into the React Native app

You are implementing an approved design system into the Mr Broccoli codebase.
Work slowly and thoroughly. There is no time pressure. Prefer stopping to ask
over guessing, but where this document gives you an answer, follow it rather
than asking.

---

## 0. What you have, and what it is not

The design system is a **web** artifact: React JSX styled with CSS custom
properties. The app is **React Native**. Nothing in the design system can be
copied into the app.

Your job is **translation, not porting**:

- CSS custom properties → values in the app's `src/theme/` objects
- JSX + inline styles → RN components + `StyleSheet.create`
- `<div>`/`<span>` → `View`/`Text`
- `cursor`, `:hover`, `box-shadow` spread across appearances → RN equivalents
  (`TouchableOpacity` `activeOpacity`, `shadow*`/`elevation`, or nothing —
  see the shadow rule in §1)

Read these first, in this order:

1. `readme.md` — brand context, content fundamentals, visual foundations,
   iconography, and the component index
2. `ui_kits/mobile-app/README.md` — **the "Departures" section is the actual
   specification of what changes in the app**
3. `ui_kits/settings/README.md`
4. Every `*.prompt.md` next to a component you are asked to build
5. Every `*.d.ts` next to it — that is the props contract, and it is normative

The `explorations/` folder records *why* the design is what it is. Read the one
named in a task before doing that task. Do not treat explorations as specs —
they contain rejected options as well as chosen ones. The chosen option is
stated in the design system's README and in the kit READMEs.

---

## 1. Non-negotiables

These hold for every phase. Violating one is a defect even if the screen looks
right.

**Two equal appearances.** Light and dark are both real. Never hardcode a
colour; always resolve through the theme. Light is a warm off-white
(`#FCFBF8`), never pure white. Dark is a warm near-black (`#16181D`), never
true black. In dark, surfaces step **up** in lightness rather than casting
shadows — a shadow on a near-black canvas is invisible. Check every change in
both appearances before calling it done.

**One accent.** Green marks the active route, the primary action, and
confirmation. If a screen looks green, something is wrong. Red is destructive
and error only. Gold is Premium.

**44pt minimum touch targets.** Icons never define the target. Where a visual
control is smaller than 44 (the intro header's 40pt circles, for example), keep
the drawn size and wrap it in a 44pt target with a negative margin so the
layout does not move. There is precedent for this in the design system; follow
it rather than inventing a second approach.

**Nineteen interface languages, including right-to-left.** Every new string
needs a key in every locale file — no English fallbacks left in place. Never
build a layout that depends on a short English string. Test at least one RTL
locale on every screen you touch.

**Accessible name and visible state come from one value.** This bit the design
system three separate times: a component showed "no messages" while announcing
"12 messages", because the label was built from a different variable than the
text. Derive both from a single source. Where you find this pattern already in
the app, fix it.

**Copy is plain and declarative.** Sentence case, full stops, no exclamation
marks, no marketing language. Settings summaries are noun phrases. Spoken
replies never contain markdown, bullets or headings. Match the existing tone
exactly — read neighbouring strings before writing a new one.

---

## 2. Phases

Do these in order. Each phase must build, run, and be verifiable on its own.
Commit at the end of each phase with a message naming the phase.

### Phase 1 — Tokens

Lowest risk, and everything else depends on it.

- Read `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css`,
  `tokens/shape.css`, `tokens/motion.css`.
- Update `src/theme/` to match. Most values already agree — the design system
  was lifted from this codebase — so **diff before you write**, and treat any
  disagreement as a question rather than an overwrite. Report every
  disagreement you find.
- The one genuinely new thing is the **voice pipeline palette**. The design
  system ships a "bookends" ramp: green at recording and speaking, travelling
  through teal, blue, indigo to violet at the deepest thinking and back. Each
  phase has a distinct value per appearance — the dark set is authored, not the
  light set brightened. Take the hexes verbatim from `tokens/colors.css`; do
  not interpolate or round them.
- Note that recording uses a different **technique** per appearance, not just a
  different value: a dark wash in light, a solid darker green in dark. Preserve
  that.

**Done when:** the app builds, every existing screen looks unchanged except the
voice pipeline phases, and both appearances are checked.

### Phase 2 — Iconography

- The app uses Phosphor (`phosphor-react-native`), regular weight. The design
  system loads Phosphor from a CDN, which is wrong for a shipping app —
  irrelevant to you, since RN uses the native package, but do not copy the CDN
  reference anywhere.
- Add the two glyphs the design system introduced: `brain` and `users-three`.
  In the design system's icon map these are keyed as `brain` and **`council`** —
  the key is not the glyph name. Follow whatever key convention the app's own
  icon map already uses.
- `brain` marks the thinking phase. `council` marks Model Council. Neither
  should collide with an existing phase glyph — check the whole map for
  duplicates while you are in there, and report any you find.

**Done when:** both glyphs render in both appearances, and no glyph in the map
means two different things.

### Phase 3 — The five new components

These do not exist upstream. Build them in whatever directory the app keeps its
design-system components (`src/design-system/`), following the file and naming
conventions already there.

| Component | What it is |
| --- | --- |
| `VoiceOrb` | The central voice control. Two concentric rings — inner carries the current phase, outer carries the whole turn against its estimate — around a filled core with the phase glyph. |
| `OrbSatellite` | A 44pt control with a mono label beneath it. Momentary action or toggle. |
| `ConversationSettingsSummary` | The conversation's settings as one line of muted text, with a control beside it. |
| `WorkspaceStatusLine` | Phase dot, what is happening, and what the conversation is. |
| `TranscriptHandle` | The transcript demoted to a peeking card above the bottom edge. |

Read each `.d.ts` and `.prompt.md`. The props contracts are deliberate.

**Two traps in `VoiceOrb`, both of which were real bugs in the design system:**

1. Its core disc is a proportion of the whole orb, but the rings shrink by
   fixed bands. Below roughly 107pt the proportion overtakes the ring
   containing it and the orb goes oval. Clamp the core to its parent ring, and
   never let any ring shrink.
2. The orb must stay circular at every size. It is sized to fit the space
   actually available, not to a constant — measure the container's **content
   box** and derive the diameter, clamped to a min and max. Do not hardcode a
   size per layout; that constant was itself the bug.

At rest there is no turn and no phase, so neither ring means anything — the
idle orb draws a plain halo, not two empty tracks.

**Done when:** each component renders in isolation in both appearances, the orb
is measurably circular at its minimum, default and maximum sizes, and every
interactive element has a 44pt target and an accessible name.

### Phase 4 — Runtime readiness

Replace the connected step chain in `src/features/settings/` with
`RuntimeReadiness`: the four capabilities (think, listen, speak, search) on one
line, each a dot plus its label, each a 44pt target that opens the setting
behind it.

The chain of circles connected by hairlines is being removed deliberately — it
reads as a progress stepper, which promises a sequence, and these are four
independent capabilities. Nothing is step 1 of 4.

`explorations/runtime-readiness.html` shows six treatments and records why this
one won. The state words (Ready / Attention / Broken / Off) already exist in
the app's locale files; reuse those keys.

**Done when:** all four states render legibly in both appearances, each opens
the right settings page, and the component works on the neutral surface (it no
longer sits on the Premium card).

### Phase 5 — The home screen

The largest change and the one with judgement in it. **Read
`ui_kits/mobile-app/README.md` "Departures" in full before starting.**

Two replacements:

- `RouteByline` replaces `ResponseModeToggle` on the home screen. The app's
  switcher renders four different layouts for one, two, three and four-plus
  models; the byline is one treatment at every count, one line tall in both
  orientations, with the model list moved into a sheet.
- `VoiceOrb` replaces the docked `PhaseAwareVoiceAction` bar. The voice control
  moves to the centre and becomes the one loud element; the quick settings
  become a line of text rather than a strip of chips; the transcript demotes to
  a drawer.

**Keep `ResponseModeToggle` and `PhaseAwareVoiceAction` in the codebase.** They
are unchanged and still correct anywhere the voice action sits in a bar rather
than owning the screen. This is a replacement on one screen, not a deletion.

Preserve from the current implementation:

- The **pager** between voice and text input, and its indicator: two 4pt-tall
  bars, active 16 wide, idle 5, each centred in a 44pt target, the pair pulled
  together by ±12px. Take the values from
  `src/screens/main/voiceTextInputPager/`. The design system also shows carets
  either side of the orb as an alternative affordance — the bar indicator is
  what ships; treat carets as optional and raise it with the owner.
- The text composer's own geometry: radius 15, border 1.5, padding 16/9/8, gap
  10, capped at 116pt, with a 46pt circular send button.
- Landscape as a two-pane split, with the orb sized down to fit its column.

**Done when:** a full turn runs end to end in both appearances and both
orientations, the introduction banner still fits above the orb without pushing
anything off screen, and the transcript drawer opens over the workspace with
the route and settings still visible above it.

### Phase 6 — Automatic on-device setup

New functionality, approved after the rest of this document was written. It is
the one phase here that is not purely presentational: the install has to keep
running after the screen that started it is gone.

Read `components/on-device/AutoSetupCard.prompt.md` and all four `.d.ts` files
before starting.

| Component | What it is |
| --- | --- |
| `AutoSetupCard` | The whole flow in one card: offer, measuring, proposal, installing, done, failed. |
| `AutoSetupPlanRow` | One chosen model, with the job it was chosen for reading before its name. |
| `InstallProgress` | Step *n* of *m*, time left, percentage, linear bar. |
| `BackgroundTaskBar` | The install seen from the home screen: one row under the top bar. |

**The job lives above every screen that shows it.** The card appears in two
places — step three of the introduction and the top of On-device AI settings —
and the home-screen row is a third view of the same job. So the state cannot
live in any of them. Put it wherever the app already keeps work that outlives a
screen, expose `state`, `fraction` and `scanned`, and pass them down. The card
runs itself when no `state` is passed; that mode is for specimens, not for the
app.

**Six states, in this order:** `offer` → `scanning` → `proposal` →
`installing` → `done` | `failed`.

**Never install without the proposal step.** The app has just told the user it
can decide for them, so spending 1.7 GB of their storage before they have seen
the list is the one thing that would make that untrustworthy. The proposal names
one model to think with, one to hear the user and one to speak back, each with
its evidence-first verdict, plus the total size and an estimate.

**The measuring pause is deliberate and stays.** The real check is
near-instant. Hold it at roughly 2.5 seconds and reveal the device readings one
at a time, because a verdict that lands before the user has finished reading the
offer reads as a canned answer rather than a measurement. Every fact shown must
be a real reading — if the app cannot measure one of them, drop that line rather
than writing a plausible number.

**Where the outcome is announced depends on where the user is.** In the
introduction or on the On-device AI page, the card states it in full and there is
no toast. Anywhere else, a toast — success, or danger with a retry. Never both:
the design system had this as a rule precisely because two announcements of one
event read as two events.

**A failure leaves what finished in place.** The failed state marks the model
that stopped, shows the ones before it as installed, and the ones after it as
waiting. Retry resumes the queue rather than starting over, and it must not
re-download a model that already completed.

**`BackgroundTaskBar` has no dismiss control, on purpose.** The work continues
either way; removing the row would only cost the user the route back to it. It
always leads to the page that owns the job. In landscape it belongs in the left
pane, above the route byline.

Strings: every one of them is a new locale key in all nineteen files, including
the step labels (`Preparing`, `Downloading <model>`, `Verifying`) and the two
time formats (`about 3 min left`, `about 40 s left`). The time readings are
formatted, not concatenated — an RTL locale must be able to reorder them.

The introduction gains a step: `INTRO_STEPS` goes from six ids to seven, with
`auto` inserted after `requirements` and before `llm`. It sits before the manual
routes because the manual routes are the fallback now — someone who takes the
tap never needs the three screens that follow, and someone who declines has lost
a swipe. The card's own header is hidden there; the step title and body already
say what it is. `IntroStepper` takes the new count without changes.

**Done when:** the flow runs end to end in both appearances; leaving the
introduction mid-install shows the home-screen row with a live reading; tapping
that row lands on On-device AI with the same install in progress; the toast
appears in neither of those two places and does appear elsewhere; a failure and
a retry both behave as described; and every string is keyed in all nineteen
locales and checked in one RTL locale.

### Phase 7 — Sweep

- Every screen you touched, in one RTL locale.
- Every screen you touched, at the largest system text size.
- Contrast: non-text graphical elements that carry meaning need 3:1, text needs
  4.5:1, in **both** appearances. The design system had four separate failures
  here, every one of them in dark, and every one because a colour tuned against
  the canvas was reused on a tinted surface. Check state colours against the
  surface they actually sit on.

---

## 3. Do not

- Do not delete `ResponseModeToggle` or `PhaseAwareVoiceAction`.
- Do not invent components. If something seems missing, it is either
  intentionally out of scope or a question for the owner.
- Do not redesign anything. Where the design system and the app disagree on a
  value, the design system wins **only** for the components and screens named
  in phases 3–6. Everywhere else the app wins, and the disagreement is a
  question.
- Do not round or snap values to a 4/8px grid. If a source says 15, write 15.
- Do not add emoji.
- Do not touch the voice pipeline, provider routing, persistence, branching,
  Premium purchase or Model Council. Everything outside phase 6 is a
  presentation-layer migration.
- Phase 6 is the exception: it needs the real on-device download and install
  machinery, and the device measurement behind the recommendation. Do not fake
  either — no seeded plan, no simulated progress, no invented device readings.
  If the catalogue cannot yet answer "which of these will run on this phone",
  stop and report that rather than shipping a card that guesses.

---

## 4. Leave for the owner

Collect these as you go and report them at the end rather than deciding:

- **Premium reads two ways.** The introduction banner is violet; the Premium
  button is gold. One of them is wrong and the owner has parked the decision.
- Any value where the design system and the app disagree outside the migrated
  screens.
- Any accessible-name or contrast failure you find in code you were not asked
  to change.
- Whether the pager keeps its bar indicator, gains the carets, or has both.
- What the automatic recommendation should do on a phone that can only run one
  or two of the three jobs. The design system shows three models chosen; it does
  not say whether a two-model result is a proposal with a gap, a refusal, or a
  proposal that routes the third job to the system voice or recogniser.
- Whether an install that fails on a metered connection should retry
  automatically when Wi-Fi returns, or wait for the user.

---

## 5. How to report

At the end, write a short document covering:

- What you changed, by phase
- Every value disagreement you found, and which way you resolved it
- Everything in §4
- What you could not do, and why

Do not summarise what worked. Spend the words on what is uncertain.
