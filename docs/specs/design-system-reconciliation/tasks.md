# Design-system reconciliation tasks

## Inventory complete for this audit revision

- [x] Count the current `_ds_manifest.json`: 63 entries across nine
      boundaries.
- [x] Confirm the current introduction contract is three steps:
      `welcome`, `setup`, `try`.
- [x] Map all 63 entries to current native source or runtime/localization
      authority in `matrix.md`.
- [x] Remove obsolete prior-count, prior-intro, `Ant*`, status-line,
      integrity/memory, legacy intro-primitive, response-toggle, and phase-action
      mappings.
- [x] Confirm the retired names listed in `requirements.md` have no current
      reference under `src/`, `app/`, or `__tests__/`.
- [x] Reclassify all current worktree fixes as pending validation and retain
      only prior evidence tied to an explicit full SHA.

These checks describe the documentation audit only. They do not validate the
current app.

## Committed implementation candidates: native validation still required

- [ ] Validate the revised `VoiceOrb` anatomy and its live phase/turn clocks:
      two flush ring bands, one screen-colour core gap, proportional core, correct
      recording/middle/speaking/overtime progress, and no extra halo.
- [ ] Validate the flat ruled `ReplyFailureCard` and `PipelineNotices`, their
      Phosphor controls, 44-point recovery actions, announcements, retry behavior,
      and absence of duplicate toasts.
- [ ] Validate the 30-point `MessageBranchIndicator` tag inside its 44-point
      target, including unavailable-source and child-branch states.
- [ ] Validate the stripe-free current `Toast` geometry, all three tones,
      retry persistence, four-second non-actionable dismissal, replacement,
      suspension behind secondary surfaces, and labeled dismissal.
- [ ] Validate the current control-shape and target sweep: shared button/tag,
      intro navigation/stepper/mic/banner, attachment remove well, transcript and
      drawer empty states, transcript disclosure, settings icon/action surfaces,
      and Premium band.
- [ ] Validate deletion of unused intro primitives and retired drive/countdown
      styles through static analysis as well as source search.
- [ ] Validate concurrent automatic-setup cancellation/resume/failure work and
      the intro test-turn/replay path against behavior specs before assigning a
      parity verdict.
- [ ] Validate Piper/VITS synthesis on the native streaming worker, including
      responsive UI, abort, WAV output, and cleanup on both platforms.

## Fresh static evidence

- [x] Freeze the implementation at
      `db1d59b4c8ff56fea3ee8ab66cb1ba57c2174ffa` and record manifest SHA-256
      `b8f6f5f0c7013be81f5f8c544786f297c0f169d3dc3b4eda6e26923a0cf3174a`.
- [x] Re-run the manifest count and source/reference check: 63 unique entries,
      no missing/duplicate/extra mapping, and no current reference to the
      retired names.
- [x] Run focused regressions for the orb, playback, intro, automatic setup,
      modal handoffs, fixtures, settings, transcript, and drawer boundaries.
      The final focused contracts include Maestro 20/20 and store-promo 16/16;
      all 21 executable Maestro YAML files also pass `maestro check-syntax`.
- [x] Run `npm run typecheck` across app, tests, and scripts.
- [x] Run `npm run static:verify` with zero ESLint, Knip, unresolved-import, or
      dependency-cycle findings.
- [x] Run `git diff --check`.
- [x] Run `make pre-push`: 199 suites and 1,919 tests passed, one suite/test was
      deliberately skipped; global coverage is 85.12% statements, 74.66%
      branches, 90.06% functions, and 85.36% lines.
- [ ] Run `make fresh-checkout` from a clean detached checkout. The shared
      worktree retains unrelated local changes, so no clean-checkout claim is
      made here.

## Fresh native and visual evidence

The owner explicitly deferred this section until after the code,
documentation, and spend-free pre-push closeout. These items do not block that
development milestone, but they still block a current design-parity or release
acceptance verdict.

- [ ] Build exact-SHA Release apps for Android and iOS; record package, version,
      build, signing/provisioning identity, and artifact checksum.
- [ ] Run Android instrumentation and iOS native tests on the exact builds.
- [ ] Capture and manually review every retained surface/state in light/dark,
      portrait/landscape, all registered locales, Arabic and Urdu RTL, increased
      contrast, and accessibility-large text.
- [ ] Capture every orb phase, progress boundary, overtime state, satellite
      swap, Drive Session rest/running state, replay, paragraph seek, and reset.
- [ ] Exercise the three-step intro as first run and re-entry, including all
      gates, localized recording/dialogue pairing, setup hand-offs, ephemeral test
      turn, abort, and replay.
- [ ] Exercise drawer, transcript, route picker, settings, on-device setup,
      failure/notices/toast, modal focus, TalkBack, and VoiceOver states.
- [ ] On physical Android and iPhone, prove microphone/STT, local response,
      TTS/playback, setup download/cancel/resume/failure/readiness, background and
      lifecycle behavior on the exact build.
- [ ] Publish only scoped `accepted@<sha>` verdicts; leave unavailable hardware
      or external prerequisites as explicit blockers.

## Owner decisions and unresolved gaps

- [ ] Choose the source of truth for the welcome challenge, `heroBody`, and
      `tryBody`. Adopting the design-system welcome challenge requires new matching
      recordings in all 19 languages.
- [ ] Decide when the real stored intro session appears in the drawer: from day
      one or after the welcome is opened. Current app behavior does not store it.
- [ ] Define a non-price route order or provide an authoritative cost ranking;
      the design says “cheapest first” while pricing was removed and the app keeps
      persisted response-mode order.
- [ ] Decide whether the hollow drawer marker has unread semantics; the app
      omits it while the meaning is unresolved.
- [ ] Decide how automatic setup behaves when only one or two pipeline jobs fit
      and whether a failed metered install retries on Wi-Fi or waits for the user.
- [ ] Reconcile “all four transports come alive” in the design with the living
      behavior that Back/Forward require multiple paragraphs.
- [ ] Implement and validate the specified gentle no-reflow transition between
      composing and transport satellites; the current conditional swap is
      immediate.
- [ ] Correct the vendored internal conflicts listed in `design.md` through the
      design source, not by hand-editing `design-system/`.

## Admissible historical evidence

- `01cbb99695a0b20d613f80dea82403df0f467067`: repository records a clean
  detached `make fresh-checkout` pass with 193 suites, 1,783 tests, one skipped
  suite/test, and coverage green. This is historical gate evidence only.
- `363a71d3cb6c30093c5297c266b282b647562d30`: repository records a freshly
  rebuilt iOS Release targeted eight-scene accessibility-large pass after the
  workspace fix. This is historical targeted iOS evidence only.

Older screenshot/device narratives whose artifact manifests do not identify a
source SHA are intentionally excluded from acceptance. Neither historical row
proves the current worktree.
