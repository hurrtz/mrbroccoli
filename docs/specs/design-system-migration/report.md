# Design-system migration report

Working report for the migration described in `design-system/migration-goal.md`.
Grows with each phase; §5 of the goal defines the final shape. Spend the words
on what is uncertain, not what worked.

## Phase 1 — Tokens

### Applied

- The voice pipeline phase palette in `src/theme/colors.ts`, both appearances,
  hexes verbatim from `design-system/tokens/colors.css`. This is the "bookends"
  ramp: synthesizing mirrors transcribing, speaking mirrors the recording
  track. A regression test pins the symmetry and every value.
- `turnTrack` / `turnInk` added to both ladders — new tokens for the orb's
  whole-turn ring (consumed from Phase 3 on).
- Recording keeps its per-appearance technique: translucent dark wash in light
  (deepened 0.08 → 0.14), solid darker green in dark (`#329F59` → `#1E6B3A`).

### Value disagreements found and how each was resolved

| Token(s) | App | Design | Resolution |
| --- | --- | --- | --- |
| All phase colours (light, and dark except `phaseRecordingTrack`) | pre-redesign ramp | bookends ramp | Design wins — phase 1 names these explicitly; taken verbatim |
| `sand*`, `premium*`, `mutedSoft`, intro-banner family | scoped to `src/components/introFlow/introTheme.ts` | global `--mb-color-*` tokens | **Values identical; placement differs.** Left scoped. Whether they should be promoted to `src/theme/` is an owner question; revisit when Phase 4 needs premium gold outside the intro |
| `activeControlIcon`, `activeControlIconBackground` | present | absent | App wins — kept; consumed by `PhaseAwareVoiceAction`, which survives the migration |
| `controlLabel` uppercase | baked into the text role | not in the token (applied at use sites) | No value change; noted so nobody "fixes" it |

### Not changed, deliberately

- Ladder colours (backgrounds, surfaces, text, accent, borders, semantic):
  byte-identical in both appearances — the design system was lifted from this
  codebase and the ladders did not drift.
- Typography roles: identical size/line-height/weight/tracking per role.
- Spacing/shape tokens describe existing per-feature geometry (`styles.ts`
  files), not `src/theme/`; each is verified at the phase that touches its
  surface.

### Open questions for the owner

- Settings kit README states a 68pt minimum header; `tokens/spacing.css` says
  `--mb-header-min-height: 62px`. Likely two different headers (main vs
  settings). Verify at Phase 4/5 against `features/settings/styles.ts`.

## Phase 2 — Iconography

### Applied

- `brain` (thinking phase, used by the orb from Phase 3) and `council`
  (Model Council, keyed by meaning exactly as the design system keys it) added
  to `src/design-system/PhosphorIcon.tsx`, with render tests.
- No CDN reference copied anywhere; the native `phosphor-react-native` package
  serves both glyphs, and the existing test suite enforces that every glyph
  stays regular-weight and on the shared wrapper.

### Duplicate audit

The whole map was audited programmatically. One glyph resolves from two keys:

- `SlidersHorizontalIcon` ← `control` (used by `TranscriptPreviewCard`) and
  `sliders` (used by `AntSettingsOverview`). Both mean "adjust settings" — the
  same meaning under two names, so it does not violate the rule that no glyph
  may mean two different things. Consolidating to one key would be a
  no-visual-change cleanup; left for the owner since neither key is named in
  the migration.
- The design keeps `robot` for the thinking phase on the surviving
  `PhaseAwareVoiceAction` bar and uses `brain` only on `VoiceOrb` — verified in
  the design sources, so both glyphs deliberately coexist and neither was
  rewired in this phase.

## Phase 3 — The five new components

### Applied

`VoiceOrb`, `OrbSatellite`, `ConversationSettingsSummary`,
`WorkspaceStatusLine`, and `TranscriptHandle` in `src/design-system/`, each
with a suite covering both appearances, geometry, and accessibility. The orb
is tested measurably circular at 120/196/220pt, its core clamps to the ring
below the ~107pt crossover, the idle orb draws the plain halo rather than two
empty tracks, and overtime fills both rings with red.

### Translation decisions (web → React Native)

- **Conic gradients have no RN equivalent.** The rings are `react-native-svg`
  arcs: a full track circle plus a progress arc via dash-array, rotated so
  progress starts at 12 o'clock; the overtime tail is an arc ending at
  12 o'clock that grows backwards, exactly the conic the design draws.
- **SVG attributes beat styles in react-native-svg**, the opposite of CSS, so
  the design's trick of scaling the orb glyph with a style override cannot
  work. `PhosphorIcon` gained an explicit `visualSize` escape hatch, documented
  in `src/design-system/SPEC.md` and `AGENTS.md` as the second deliberate
  exception to the semantic size scale (the first is `ProviderIcon`).
- **The design's English fallback strings do not exist in RN.** The `.d.ts`
  contracts make `label` optional with per-phase English fallbacks and build
  aria labels from counts internally; the nineteen-language rule forbids both.
  Every user-facing string is a required prop translated by the caller:
  `VoiceOrb.label`, `TranscriptHandle.emptyLabel`/`accessibilityLabel`,
  `ConversationSettingsSummary.accessibilityLabel`, and
  `WorkspaceStatusLine.info` became `{ accessibilityLabel, onPress }` so the
  control cannot render unlabelled. This is a deliberate contract deviation;
  the visual geometry is unchanged.
- The 16% `color-mix` tint is computed as an rgba of the phase ink at 0.16.

### Not done here, deliberately

- The screen-side measurement that derives the orb diameter (trap 2) belongs
  to Phase 5's layout; the component takes `size` and is tested at the sizes
  the screen will pass.
- No changelog entry yet: nothing here is user-visible until Phase 5 mounts
  the components.

## Phase 4 — Runtime readiness

### Applied

- `RuntimeReadiness` in `src/features/settings/settings-primitives/`, mounted
  on the Premium settings overview between the edition card and the groups.
  States derive from the existing `settings-core/readiness.ts` model; the
  capability lists come from the runtime manifest and `kokoroInstalled` from
  the Kokoro controller the settings modal already holds.
- The "connected step chain" existed only as dead styles — nothing mounted it,
  and a test pinned the grid's absence. The `readinessGrid`/`readinessStep*`
  blocks (22pt circles, 2pt connector lines) were removed from
  `features/settings/styles.ts`; the absence assertion stays and the new
  line's presence is asserted beside it.
- `premium` gold promoted into `src/theme/colors.ts` (light `#8A6A12`, dark
  `#C9A227`, from `tokens/colors.css`), with a test pinning ≥3:1 non-text
  contrast on canvas and card in both appearances. `introTheme.ts` keeps its
  own copy on purpose — its palette is deliberately independent.
- No new locale keys: the four labels, four state words, and the "Open
  {section}" hint all existed in all nineteen dictionaries. The accessible
  name composes label + state word from the same status object that draws the
  dot, honouring the one-source rule.
- Large text (fontScale ≥ 1.35) stacks the line into a column, matching the
  intent of the removed grid's large-text variant.

### Disagreements

- The design maps `attention` to premium gold and itself flags gold doing
  double duty as "paid" and "needs attention" as the weak point, suggesting a
  dedicated warning token. Followed the design as specified; the token
  question stays with the owner.
- Kit README's "68pt minimum header" vs `--mb-header-min-height: 62px`: the
  settings header is confirmed at 68 in `features/settings/styles.ts`, so the
  kit README and the app agree. The token's 62 matches no header found in the
  app; it appears to describe a different (possibly composed) surface. No
  conflict in shipped geometry; nothing changed. **Open question:** which
  surface the 62px token refers to.

## Phase 5 — The home screen

### Applied

- `RouteByline` (`MainScreenRouteByline`) replaces `ResponseModeToggle` on the
  home screen: one line at every model count, the model's own effort scale as
  dots, a credit line when only one model is configured, and `RoutePickerSheet`
  for switching. The free-edition chip and the provider empty state stay.
- The orb replaces the docked bar as the primary action. The pager keeps its
  two pages, its bar indicator (carets remain the owner question the goal
  already parks), its gesture, and the composer geometry untouched; only the
  voice page changed. The pager measures its viewport and fits the orb
  (min 96, ceiling 196/150), so the intro banner shrinks the orb naturally.
- `ConversationSettingsSummary` states tone · length under the byline and
  opens the conversation style sheet. Voice was left out of the line: the app
  has no stable short voice noun across its routing modes; question for the
  owner whether to add one.
- `WorkspaceStatusLine` with the phase dot and the session-details entry;
  `TranscriptHandle` + a portrait transcript sheet reusing the full
  `TranscriptPreviewCard` (copy, branch, edit, replay all intact). Landscape
  keeps the transcript inline, with the intro banner in the right pane per the
  kit's reasoning.
- Satellites: image (momentary), Council (`ulraMode`, "Model Council") and Web
  as toggles, availability rules unchanged (absent when never usable, disabled
  during a turn). Nineteen-locale keys added for the six new strings via a
  shared `workspaceTranslations` module.

### Translation decisions

- **Blocked and unavailable voice states keep the labelled bar** in the orb's
  slot. The design has no blocked orb, and a mute orb would hide the one thing
  worth saying; the bar centres in the same slot so nothing moves.
- **Stop and barge-in during speech move to the satellites row.** The bar
  carried them as sub-controls; the orb has one press (pause/resume as
  before). The design gives speech only "tap to stop" — that would delete the
  app's barge-in capability, so the row keeps both, appearing only while
  speaking.
- **Drive Session's silence countdown renders in the orb core** in place of
  the glyph, red at three seconds, exactly as the bar did.
- **The pager survives in landscape.** The kit sheds it ("no second input
  page"), but the app's contract routes users to the composer whenever voice
  cannot be pressed — removing text input in landscape would break that.
- **The orb's inner ring rests on the phase tint during processing phases.**
  The app has no per-phase estimates, only the speech-start estimate driving
  the outer ring; faking inner progress would violate the "real readings only"
  instinct the goal applies elsewhere.
- **The transcript handle's meta shows the model name without "2 min ago".**
  A relative-time system is nineteen new plural-aware keys and a ticking
  clock; deferred, and noted for the owner.

### For the owner

- Pager carets versus bar indicator: unchanged, bar indicator ships (§4 of the
  goal already parks this).
- Whether the settings summary line should include a third noun (voice), and
  what it should be per route.
- `MainScreen` still passes `onInterruptPlayback`/`onStopPlayback` into the
  voice stage for the retained bar's contract even though the orb path uses
  them from the satellites row; harmless duplication kept for the bar's sake.
