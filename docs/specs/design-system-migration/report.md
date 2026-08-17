# Design-system migration report

> Historical implementation record. It describes the migration-time design
> and code snapshot, not the current approved design contract. Use
> `design-system/_ds_manifest.json` and the living specs for current product
> intent. The former reconciliation work spec was retired after its product
> surfaces were deliberately removed.

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

| Token(s)                                                         | App                                                | Design                                  | Resolution                                                                                                                                                                            |
| ---------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| All phase colours (light, and dark except `phaseRecordingTrack`) | pre-redesign ramp                                  | bookends ramp                           | Design wins — phase 1 names these explicitly; taken verbatim                                                                                                                          |
| `sand*`, `premium*`, `mutedSoft`, intro-banner family            | scoped to `src/components/introFlow/introTheme.ts` | global `--mb-color-*` tokens            | **Values identical; placement differs.** Left scoped. Whether they should be promoted to `src/theme/` is an owner question; revisit when Phase 4 needs premium gold outside the intro |
| `activeControlIcon`, `activeControlIconBackground`               | present                                            | absent                                  | App wins — kept; consumed by `PhaseAwareVoiceAction`, which survives the migration                                                                                                    |
| `controlLabel` uppercase                                         | baked into the text role                           | not in the token (applied at use sites) | No value change; noted so nobody "fixes" it                                                                                                                                           |

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

## Phase 6 — Automatic on-device setup

### The spike came back positive

The goal instructs stopping if the catalogue cannot answer "which of these
will run on this phone". It can: `selectOfflineProfile` already picks one
LLM, one STT and one TTS from per-model device requirements,
`automaticPriority`, language filtering and benchmarks, and
`prepareOfflineProfile` already implements the install queue with
skip-verified resume, abort, and per-step progress. Phase 6 is presentation
plus one job controller over machinery that existed.

### Applied

- `AutoSetupCard`, `AutoSetupPlanRow`, `InstallProgressBar` under
  `src/components/autoSetup/`; `BackgroundTaskBar` in `src/design-system/`.
- `useAutoSetupJob` at the composition root: the job lives above every screen
  that shows it. Offer → scanning (staged ~2.5s reveal of real readings) →
  proposal → installing → done | failed; install is only reachable from a
  seen proposal; retry re-runs `prepareOfflineProfile`, which skips verified
  models — resume, not restart. Keep-awake held while installing; the
  existing per-model download path already runs under the Android foreground
  service.
- The introduction gains the `auto` step after `requirements`; `INTRO_STEPS`
  is seven ids and `IntroStepper` took the count without changes. On-device
  AI settings leads with the full card; the home screen shows the
  `BackgroundTaskBar` while installing or failed, tapping through to the
  On-device page, with no dismiss control on purpose.
- On success the profile is applied with configured provider modes preserved,
  the same reversibility rule as Free setup.
- Roughly forty new strings in all nineteen locales via a shared
  `autoSetupTranslations` module, with formatted (reorderable) time and step
  readings.

### Translation decisions

- **The RN card is always controlled.** The web card's self-driving demo mode
  exists for specimens; an install that must survive leaving the screen needs
  the host to own the clock, so the demo mode was not ported.
- **The proposal shows total size but no pre-install time estimate.** The
  design's "about 4 min on Wi-Fi" before any transfer would be a number the
  app has not measured. The time reading appears once installing, from the
  same estimator the Free flow uses, and counts down against reality.
- **The queue reads download and test steps only.** The design inserts
  "Preparing"/"Verifying" bookend steps; the app's queue emits real steps
  (per-model download, per-model benchmark) and inventing two more would
  decouple the reading from the work.
- **Toast suppression is surface-level.** The rule is card-or-toast, never
  both; the app suppresses the toast while the introduction or the settings
  modal is open. Detecting the exact settings _page_ would mean lifting the
  modal's internal navigation state; with settings open on another page the
  outcome is currently not toasted. **Open question** for the owner whether
  that narrower case warrants the refactor.
- A capability the selection routes to the device's own recognizer or voice
  shows as a plan row named with the existing native-route labels rather than
  a model and size — the honest answer to the §4 question about phones that
  cannot run all three jobs, pending the owner's ruling.

### For the owner (goal §4)

- Metered-connection retry behaviour is unchanged: retry is manual.
- The proposal's language comes from the interface language; a multilingual
  listener may want the plan to cover `localLanguages` instead.

## Phase 7 — Sweep

### Contrast, automated

`__tests__/theme/designSystemContrast.test.ts` checks every pairing the
migrated surfaces actually use — ink against the surface it sits on, both
appearances, 3:1 graphical and 4.5:1 text. It caught three real findings:

- **Fixed:** the auto-setup card's filled action used the design's raw
  accent with white ink — 3.28:1 in light, 2.24:1 in dark, both under the
  text floor. It now uses the app's own `activeControl`/`onActiveControl`
  pairing (4.62 / 7.94), which is exactly what that pairing exists for.
- **Reported, design-owned:** the light transcribing/synthesizing teal
  `#2FA39B` measures 2.97:1 on the canvas — a hairline miss of the 3:1
  graphical floor, in a hex Phase 1 was instructed to take verbatim. Its
  bookend pairing means one corrected hex fixes two phases.
- **Reported, pre-existing:** the light accent-on-accentSoft glyph pairing
  (2.87:1) that the satellite toggle wells inherit is the same pairing
  `IconButton` has always used; changing it is an app-wide decision, not a
  migration one.

Both reported shortfalls are pinned in a dedicated test block that fails the
moment a palette change fixes them, prompting their promotion into the main
sweep.

### RTL and large text, audited statically; device sweep deferred

- Every new component lays out with direction-agnostic flexbox and start/end
  spacing; the only left/right literals are symmetric (sheet corner radii,
  the task bar's full-width progress line). Time and step readings are
  formatted through locale functions, so RTL locales can reorder them.
- Large text: `RuntimeReadiness` stacks to a column at fontScale ≥ 1.35;
  truncating labels keep their full accessible names.
- The on-device visual sweep — every touched screen in one RTL locale and at
  the largest text size — is deliberately not simulated here: the repository
  runs exactly that matrix (every registered language, dark mode, increased
  contrast, accessibility-large text, VoiceOver/TalkBack) in
  `make pre-release-maestro`, and its review gallery remains the visual
  verdict before release.

## What could not be done, and why

- Pixel-verification against the running app (both appearances, both
  orientations, RTL, large text) needs the device gates above; everything
  checkable without a device or paid quota has an automated check.
- The blocked/unavailable voice states, barge-in during speech, and the
  landscape composer have no design-system equivalent; each kept the app's
  behaviour and is recorded under its phase.

## Emulator verification (Android)

A device pass on the project AVD (2 GB, arm64) exercised the recomposed home
screen in both appearances and orientations, the seven-step introduction, the
auto-setup scan, the transcript sheet, settings, and the On-device page, plus
`make android-instrumentation`. It found and fixed three defects:

- **The scan's staged reveal showed nothing.** The device snapshot only
  landed with the verdict, so the reveal ticked over an empty list. The
  snapshot now lands first and the readings appear one at a time (verified
  on-device: memory, storage, processors revealed mid-scan).
- **A failed scan wore the install-failure words.** "Install did not finish /
  The download stopped" on a phone where nothing was ever downloaded. Scan
  failures now carry their own copy in all nineteen locales ("No suitable set
  for this phone…"), drop the phantom plan rows, and their retry re-runs the
  scan.
- **A failed scan leaked onto the home screen as a background task.** The
  task bar reported "On-device install stopped" for a job that never ran;
  it now appears only while installing or after an install-phase failure.

The 2 GB emulator legitimately fails selection — every catalogue LLM needs
more memory — which is exactly the honest-failure path the goal's §4
question describes, now with honest words. Known environment condition, not
migration-related: the debug build logs `Cannot find native module 'ExpoIap'`
once per cold start (store billing absent on the emulator).

1. Premium reads two ways: the intro banner is violet, Premium gold (parked
   in the goal; unchanged).
2. Pager: bar indicator ships; carets remain optional.
3. Gold doing double duty as "paid" and "needs attention" — dedicated warning
   token question (Phase 4).
4. Whether the settings summary line gains a third noun for voice (Phase 5).
5. Transcript-handle relative-time reading, deferred with reasons (Phase 5).
6. Toast suppression granularity while settings is open on another page
   (Phase 6).
7. Proposal language scope: interface language vs `localLanguages` (Phase 6).
8. Metered-connection auto-retry (goal §4; unchanged, manual).
9. The two light-appearance contrast shortfalls above (Phase 7).
10. The `--mb-header-min-height: 62px` token matches no surface found in the
    app (Phase 1/4 note).
11. `sand`/`premium`/intro-banner token placement: global in the design,
    scoped to `introTheme.ts` (plus the promoted `premium`) in the app.

## Cross-platform verification (Android + iOS)

A second device pass compared both platforms against the design system as
the status quo: the premium fixture scene on the Android emulator (route
byline with effort dots, route picker sheet, credential-guard toast,
conversation settings summary, status line, transcript handle, settings
overview with the live readiness line, On-device page, landscape split
view, dark appearance) and the dev build on the iOS simulator (portrait
and landscape, dark appearance, empty-conversation workspace). Orb ring
geometry was measured from screenshots by scanline: track ~5.3 dp, gap
~2.7 dp, phase ring ~5 dp, halo ~7.3 dp, core ~116 dp at S≈166 dp —
matching the specimen's 6/3/6/8/72% within rounding. The premium promo
scene stages the thinking phase through `getStorePromoPhase`, which gave
the tinted-core, brain-glyph, and status-dot renders a deterministic
on-device check in both appearances.

One defect found and fixed:

- **The transcript sheet opened empty.** Title and "Hide transcript"
  footer rendered with zero messages between them, on both platforms,
  while the handle preview showed content. `transcriptShell` carries
  `flex: 1`, i.e. `flexBasis: 0`, and inside a flex parent Yoga lets
  `flexBasis` beat a plain `height` on the main axis. The sheet dialog's
  auto-height body has no free space to distribute, so the card resolved
  to zero height and `overflow: hidden` swallowed the clipped children.
  The `preferredHeight` prop now sets `flexBasis` itself (grow 0,
  shrink 1), keeping the requested height in an auto-height parent while
  still letting a capped sheet shrink the card. A style-contract
  regression test pins the basis semantics — the failure was invisible
  to RNTL because a zero-height view still "contains" its children.
  Verified on the rebuilt Android fixture APK (full transcript, message
  actions, scrolling) and the iOS dev client (empty state centred in a
  full-height card).

Verification hygiene note: the iOS check initially kept rendering the
collapsed sheet because a long-running `expo start` instance predating
the migration served a stale module graph to warm clients while
fresh query combinations got current code. Restarting Metro resolved
it; screenshots alone cannot distinguish a stale bundle from a wrong
fix — the accessibility-frame dump (`idb ui describe-all`) was the
reliable signal.

The pass also repaired two type errors that had slipped into test files
(`VoiceOrb.test.tsx` flatten typing, `MainScreenWorkspace.test.tsx`
missing required `backgroundTask` prop) — Jest compiles through Babel
and never sees them, so `npm run typecheck` is the only gate that does.
