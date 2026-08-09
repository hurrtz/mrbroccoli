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
| 5 — Home screen | Partial: the route byline ships; the orb does not |
| 6 — Sweep | Not started |

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

### Phase 5 — Home screen (partial)

`RouteByline` replaces `ResponseModeToggle` on the home screen. Its route sheet
was extracted from `ResponseModeOverflowSelector` into `ResponseModeSheet` so
both triggers can open it; the selector's own nineteen tests pass unchanged.
`ResponseModeToggle` is untouched and still exported.

**The orb replacement is not done.** See §5.

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

### Phase 5 is incomplete, and the orb half has a real obstacle

The byline replacement is complete. The orb replacement is not, and it is worth
being precise about why rather than calling it "large".

**`VoiceOrb` cannot replace `PhaseAwareVoiceAction` one-for-one.** I tried the
direct swap — orb as the pager's voice page, orb as the active overlay — and
sixteen tests in `__tests__/screens/main/MainScreenVoiceStage.test.tsx` failed.
They were not layout assertions. They cover behaviour the docked bar owns and
the design system's orb contract does not mention:

- the recording-capacity fill, continued from the actual recording start
- the adaptive speech timeline and its red overtime layer
- phase changes announced without announcing every ETA tick
- pause and resume on the primary action with a **separate** Stop action
- the increasingly urgent Drive silence countdown
- the blocked-prompt call to action, and the on-device setup action it becomes

In the design system's own kit, most of this has somewhere else to live:
`WorkspaceStatusLine` carries the phase title and the detail line, and the
satellite row carries the secondary actions. So the replacement is not "swap the
control" — it is "build the composition, and re-home the behaviour the bar
currently carries alone". Doing the first without the second is a regression in
accessibility announcements and in playback control, which is why the attempt
was reverted rather than committed with the tests updated.

Kept from the attempt, because both are correct independently: `VoiceOrb` now
has `onPressIn`/`onPressOut`/`disabled`, and `src/screens/main/orbProgress.ts`
maps `VoicePhaseProgress` onto the orb's two rings and its overtime.

What remains:

1. **Recompose the workspace around the orb.** `MainScreenWorkspace` currently
   renders top bar → intro banner → route card → voice stage + route controls →
   transcript pane. The orb composition needs the orb centred, the satellite
   row under it, `WorkspaceStatusLine` and `ConversationSettingsSummary` around
   it, and the transcript demoted to `TranscriptHandle` plus a drawer, in both
   orientations.
2. **Re-home what the docked bar carries** — the six behaviours listed above —
   onto the status line, the satellite row and a separate stop control, then
   replace `PhaseAwareVoiceAction` in `VoiceTextInputPager`'s active overlay.
   The pager, its bar indicator and the composer geometry all stay: the goal
   names those values explicitly.
3. **A transcript drawer.** There is no expanded transcript surface to reuse —
   `TranscriptPreviewCard` has only `card` and `canvas` presentations — so the
   drawer `TranscriptHandle` opens has to be built.
4. **Update the existing suites** that assert the current workspace
   (`MainScreenWorkspace.test.tsx`, `MainScreenVoiceStage.test.tsx`,
   `TranscriptPreviewCard` coverage and others).

The copy is **done**: `src/i18n/workspaceTranslations.ts` carries the six new
strings in all nineteen languages, and the satellite labels, phase words and
`showTranscript` were already there.

This is a large change to a shipping home screen, and doing it badly is worse
than not doing it yet. I stopped at a green checkpoint rather than leaving a
half-swapped workspace behind.

### Phase 6 not started

The RTL pass, the largest-text pass and the contrast sweep all need the migrated
screens to exist first. The contrast findings in §3.1 and §3.2 came out of
Phases 1 and 4 rather than a systematic sweep.

Note also that `AGENTS.md` now requires any Maestro regression flow to be
registered in `scripts/verify-maestro-suite.mjs` and counted in
`scripts/verify-maestro-artifacts.mjs`; an unregistered flow never runs.

---

## 6. Verification

Every phase above was committed with `npx tsc --noEmit` clean,
`npm run static:verify` clean (ESLint at zero warnings plus Knip), and the full
Jest suite green — 1713 passing, 1 skipped, at the last full run.

No device or simulator verification has been run. Nothing here has been seen on
a phone.
