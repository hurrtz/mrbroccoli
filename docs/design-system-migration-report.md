# Design system migration — report

Status of the migration described in the design system's `migration-goal.md`.
Written for the owner. It spends its words on what is uncertain rather than on
what worked.

| Phase | State |
| --- | --- |
| 1 — Tokens | Complete |
| 2 — Iconography | Complete |
| 3 — Five new components | Complete |
| 4 — Runtime readiness | Complete, but the phase's premise did not hold |
| 5 — Home screen | Complete |
| 6 — Sweep | Automated checks in place; no device verification |

---

## 1. What changed, by phase

### Phase 1 — Tokens

`src/theme/colors.ts` took the new voice-pipeline ramp verbatim, both
appearances, plus `turnTrack` / `turnInk` for the orb's turn ring.
`DESIGN.md` records the palindrome and the per-appearance authoring as a
decision beside the phase-callback description it belongs to.

The base palettes needed **no changes at all**. Every surface, text, border,
accent, overlay and glow value in `tokens/colors.css` already matched, in both
ladders, and every one of the twelve type roles in `tokens/typography.css`
matched `src/theme/typography.ts` exactly. The design system really was lifted
from this codebase.

### Phase 2 — Iconography

`brain` and `council` added to `src/design-system/PhosphorIcon.tsx`, following
the map's own convention that a key is a meaning rather than a glyph name.

### Phase 3 — Five new components

`VoiceOrb`, `OrbSatellite`, `WorkspaceStatusLine`,
`ConversationSettingsSummary`, `TranscriptHandle` in `src/design-system/`, plus
`voicePhase.ts` for the phase-to-colour-and-glyph mapping they share.

### Phase 4 — Runtime readiness

`RuntimeReadiness` added and rendered on the settings overview, on the neutral
surface, with no card and no connectors.

### Phase 5 — Home screen

Both replacements ship.

`RouteByline` replaces `ResponseModeToggle`. Its route sheet was extracted from
`ResponseModeOverflowSelector` into `ResponseModeSheet` so both triggers can open
it; the selector's own nineteen tests pass unchanged.

`OrbVoiceStage` replaces the docked `PhaseAwareVoiceAction` bar, at rest and
while a turn runs. The bar's two progress drawings became the orb's two rings,
its words became `WorkspaceStatusLine`, and its stop action became a satellite.
The per-question switches became satellites, the conversation's settings became
a sentence, and the transcript became `TranscriptHandle` plus a drawer that
opens over the workspace.

Both replaced components are retained and exported. `PhaseAwareVoiceAction` now
has its own test file — it previously had none, having been covered only through
a screen that no longer renders it.

---

## 2. Value disagreements, and how each was resolved

### Resolved in favour of the design system

The sixteen phase colours and the light recording wash's alpha (0.08 → 0.14).
These are the intended Phase 1 change.

### Resolved in favour of the app

**Spacing, shape and motion have no counterpart module.** The app carries these
values inline per component; there is no `src/theme/spacing.ts`. No value in
`tokens/{spacing,shape,motion}.css` disagrees with the app, so nothing was
overwritten. Creating the three modules in Phase 1 would have failed
`npm run static:verify`: Knip reports unused files and `src/**` is in its
`project` glob, so a token module with no importer reads as dead code. They
should arrive with their first consumer.

**Copy does not live in `src/design-system/`.** That directory's `SPEC.md`
forbids it, so the five new components take their strings as props instead of
falling back to the internal per-phase sentences the `.d.ts` files describe.
`VoiceOrb`'s `label` is therefore **required**, not optional. This is a
deviation from the published contract and it is deliberate: it forces the
accessible name and the visible status line to be the same value, which is the
exact failure the composition is meant to fix.

**`sand`, `premium`, `mutedSoft` and the violet banner were already correct**
in `src/components/introFlow/introTheme.ts` and were not duplicated into
`src/theme/colors.ts`. AGENTS.md records that palette as deliberately
independent.

### Resolved by promotion

**`premium` moved into `src/theme/colors.ts`.** Runtime readiness needs the gold
for its "attention" state, outside the introduction. `introTheme.ts` now reads
it from the theme rather than repeating the literal. Values unchanged in both
appearances.

---

## 3. For the owner

### 3.1 Premium reads two ways — and the dark value fails contrast

Parked in the goal, but there is a measurement worth having before deciding.

`introTheme.ts` uses `onPremium: "#FFFFFF"` in **both** appearances. The design
system uses `#FFFFFF` in light and `#1A1405` in dark. White on the dark gold
`#C9A227` measures **2.42:1** — a clear AA failure on a filled control. The
design system's near-black measures **7.57:1**.

This is a real contrast failure in shipped code, in a component I was not asked
to change. **Recommend adopting `#1A1405` for dark**, independently of the
violet-versus-gold question.

### 3.2 A light phase colour misses 3:1 against the canvas

`transcribing` and `synthesizing` share `#2FA39B` in light. Against the light
canvas `#FCFBF8` that is **2.97:1**, just under the 3:1 a meaning-carrying
non-text element needs. Against the white `surface` it is 3.07:1 and passes.

The orb's ring sits on the canvas, so this is the failing case. I did **not**
change it: the goal says to take the hexes verbatim. Every other phase value
clears 3:1 on both surfaces, and all fourteen clear the existing 4.5:1
foreground guard in `__tests__/theme/colors.test.ts`.

It is the same class of failure §6 of the goal warns about, inverted: a colour
that holds on a card and fails on the canvas behind it. A very small darkening
fixes it.

### 3.3 One glyph already means two things

`control` and `sliders` both map to `SlidersHorizontalIcon`, so "open style
sheet" (`TranscriptPreviewCard`) and "App & diagnostics" (`AntSettingsOverview`)
draw the same icon. Collapsing the two keys would not fix it — the ambiguity is
one glyph serving two meanings, and resolving it means choosing a different
glyph for one of them, which is a design decision.

`__tests__/design-system/PhosphorIcon.test.tsx` now freezes this as the only
known collision and fails on any new one.

### 3.4 The two voice controls disagree about the thinking glyph

`PhaseAwareVoiceAction` uses `robot` for the thinking phase; the design system's
orb uses `brain`. The goal says to keep `PhaseAwareVoiceAction` unchanged, so
both now ship. If they are meant to stay visually consistent, one of them should
move.

### 3.5 `council` has no consumer

Added as instructed, but Model Council is explicitly out of scope, so the glyph
is currently unused. Harmless, but it will look like dead weight in review.

### 3.6 The orb's glyph is 40pt, not 30% of the diameter

The web component sizes the glyph at `size * 0.3` — about 59pt in a 196pt orb.
The app forbids raw numeric glyph sizes (`AGENTS.md`, and
`src/design-system/SPEC.md`), so the orb uses `hero`, the largest semantic size,
at 40pt. The glyph is therefore proportionally smaller than the design shows.

Resolving it needs either a new entry on the semantic size scale or an explicit
exception to the numeric-size rule. I did not invent either.

### 3.7 The satellite label is 9pt

`OrbSatellite`'s mono label is 9pt per the design system, below the app's
smallest existing role (`caption` 12, `controlLabel` 11). It scales with the
system font setting, but it is worth a look at the largest accessibility size.

### 3.8 The pager indicator question is still open

Untouched, and still needs an owner decision: bar indicator, carets, or both.

Worth knowing before deciding: the kit's portrait workspace puts a 44pt caret on
each side of the orb *and* uses them as the whole pager affordance, while the
app ships the two-bar indicator below the composer. They are not additive as
drawn — the carets sit in the orb's row and eat 96pt of its width, which is why
the kit's orb measures `useFitSize(196, 96, 96)`.

### 3.9 The orb's minimum disagrees with its own prompt

`VoiceOrb.prompt.md` says the rings stop being legible below about 120 and to
use `PhaseAwareVoiceAction` instead. The kit composes the orb at a minimum of
**96** in portrait and **84** in landscape. I followed the kit, since it is the
composition that actually has to fit, and made the range a prop. The geometry
clamp that keeps the orb circular is independent and is tested at 84.

---

## 4. Where the goal document and the codebase disagree

### 4.1 There is no connected step chain

Phase 4 says to replace "the connected step chain in `src/features/settings/`".
There is none. `getSettingsReadiness` in `src/features/settings-core/readiness.ts`
computes all four capabilities and is covered by
`__tests__/components/settingsReadiness.test.ts`, but **nothing rendered it**.
An earlier readiness grid was already removed —
`__tests__/components/SettingsOverview.test.tsx` still asserts that
`settings-readiness-grid` is absent.

So Phase 4 wired up existing unused logic rather than replacing a component. The
outcome the phase describes is delivered; the deletion it describes had already
happened.

### 4.2 Premium gating needed no new decision

The four readiness capabilities open pages that are premium-gated. That is
already handled: `AntSettingsPageContent` routes a free edition to
`LockedSettingsPage`, which offers the upgrade. The line needs no edition branch.

---

## 5. What I could not do, and why

### What the orb replacement actually cost

Worth recording, because the first attempt at it was wrong.

Swapping `VoiceOrb` into the docked bar's slot on its own broke sixteen tests,
and they were not layout assertions. `PhaseAwareVoiceAction` owned behaviour the
design system's orb contract never mentions: the recording-capacity fill, the
adaptive speech timeline and its overtime layer, throttled phase announcements,
pause and resume with a separate Stop, and the Drive silence countdown.

The design system's kit is a mock — it says so — and its phase script never runs
late, so it had nowhere to put any of that. The answer was not to drop it but to
notice that the orb's two rings *are* the bar's two progress drawings, and that
`WorkspaceStatusLine` is where its words go. Everything survived:

| The bar drew | It is now |
| --- | --- |
| a fill sweeping its width | the orb's phase ring |
| a timeline traced round its border | the orb's turn ring, and `overtime` |
| the phase title, prompt and ETA | `WorkspaceStatusLine` |
| the Drive countdown, in growing digits | the status line's detail |
| a Stop action inside the bar | an `OrbSatellite` |
| tap-to-interrupt while speaking | the orb itself |

The first attempt was reverted rather than committed with its tests deleted. The
second kept the behaviour and rewrote the tests around where it now lives.

### The retained components would have gone quiet

`PhaseAwareVoiceAction` had **no tests of its own**. It was covered entirely
through `MainScreenVoiceStage`, so the moment it stopped being that screen's
control it would have become unverified code that the goal nonetheless requires
be kept. Knip caught it as an unused file, which is what surfaced this. It now
has its own suite covering the behaviour listed above.

### Phase 6 has its automated half only

`__tests__/design-system/orbCompositionSweep.test.ts` checks all seven migrated
components for the three failures that can be caught without a device: a hard
side (`paddingLeft`, `marginRight` and friends, which React Native does not flip
for a right-to-left locale), an opt-out of Dynamic Type, and a hex literal in a
component. `__tests__/theme/colors.test.ts` checks the readiness dots against
the canvas, the surface *and* the tinted surface, and the orb's turn ring
against its own track.

**None of it has been seen on a device.** RTL direction, the largest system text
size and both appearances still need eyes, and the orb half of Phase 5 has to
land before that sweep is worth running on the home screen.

Note also that `AGENTS.md` now requires any Maestro regression flow to be
registered in `scripts/verify-maestro-suite.mjs` and counted in
`scripts/verify-maestro-artifacts.mjs`; an unregistered flow never runs and
reads as coverage that does not exist.

---

## 6. Verification

Every commit was made with `npx tsc --noEmit` clean, `npm run static:verify`
clean (ESLint at zero tolerated warnings plus Knip), and the full Jest suite
green — **1760 passing, 1 skipped** at the last full run.

No device or simulator verification has been run. Nothing here has been seen on
a phone, in either appearance, in either orientation, or in a right-to-left
locale.
