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
