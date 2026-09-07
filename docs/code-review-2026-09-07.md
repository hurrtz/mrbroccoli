# Repository review — 2026-09-07

Scope: current repository, including the reported web-search fallback and
Thinking add-model freeze, and all pre-existing dirty work. This is an audit
record; co-located living specifications remain authoritative.

## Findings and corrections

| Finding | Correction and regression evidence |
| --- | --- |
| Adding a Thinking provider replaces a closing native modal with another modal, leaving overlapping presentation | One persistent sheet for internal Thinking navigation. Test reproduced two visible native modals before the fix. iOS Release Maestro adds Google, edits its model, dismisses Settings, and returns home without restarting. |
| OpenAI search reasoning competes with its evidence brief for a 420-token output allowance | Reserve reasoning headroom and select manifest-supported low effort. Request contract regression verifies the actual outgoing search request. This is a supported explanation for missing briefs, not a claimed live reproduction of the user's provider account. |
| Search deadlines end at response headers; stalled bodies escape timeout/cancellation | Deadline and cancellation cover success/error body consumption, even when transport ignores abort. Deferred-body tests reproduce both cases. |
| Search connection validation accepts output that real turns reject | Validation uses the same normalization as a real search; completed tool calls without a usable brief fail validation. |
| Anthropic HTTP-200 embedded search errors are counted as evidence | Require the documented result-array shape; embedded-error regression rejects false evidence. |
| A transient database initialization failure remains cached forever | Clear rejected initialization promise so later save/read operations can recover. Regression failed before fix and round-trips afterward. |
| Locked conversation reads finish after foreground authorization is revoked | Recheck current authorization after storage resolves, both for selection and direct reads. Deferred-read regressions cover background revocation. |
| Failed database batches still publish successful restores/branches and unsaved records | Propagate batch rejection before metadata, active selection, imported settings, or success counts. Hook regressions inject disk-full failures into both paths. |
| Long dictation retains only the final segment; naive accumulation also loses repeated prefixes | Accumulate finalized segments, replace interim hypotheses, and honor explicit native segment markers before cumulative-prefix detection. File and live-recognition regressions preserve intentional repeats. |
| General system recognition is disabled when strict offline recognition is unavailable | Gate the general OS route on recognizer availability; retain strict on-device eligibility for routes that request it. Settings regression covers the distinction. |
| Dirty composer alignment clips text in short stages | Bound composer height/offset by its measured viewport; text chevrons follow the bounded center. Regression covers 96-, 120-, and 148-point viewports. |
| Council synthesis fallback replies retain the originally requested author identity | Record actual synthesis provider/model, then transport fallback, and persist the final receipt route. Pipeline and hook regressions cover cross-provider fallback. |
| Android decoder construction/start/resume throws outside the native promise boundary | Fail and release the item, advance safely, ignore obsolete callbacks, and drain exactly once. Four JVM regressions plus real-player valid/missing/valid instrumentation. |
| Wait-mode speech omits interparagraph pauses; cancellation during pause creation can emit late audio | Use ordered pause emission for buffered results and recheck cancellation after asynchronous pause preparation. Provider/native-fallback cadence and cancellation regressions. |
| A rejected competing iOS recording start cleans up the existing owner | Recorder-owned rollback begins only after its ownership guard. Real bridge regression reproduced owner loss before the fix; all seven native tests pass afterward. |
| Thinking and storage footers promise downloadable answering models despite BYOK-only routing | Correct both guidance strings in all 19 interface locales. All 38 localized regressions failed before the edits and pass afterward; the localization gate passes 299 tests. |

The search context handoff itself was intact: normalized search context reaches
both Council and final response preparation. Existing integration regressions
cover those boundaries.

## Dirty-state decisions

Retained and committed the useful speech, recognition-selection, workspace,
tests, living-spec updates, and product handover. Corrected repeated-dictation
loss and compact-composer clipping before committing those changes. Corrected
handover claims about locked-session retrieval and Council call counts, and
removed stale StoreKit/Premium claims from the iOS specification.

Two unrelated Omio Pixelmator sources were moved out of this repository and
preserved in `~/Downloads/omio-design-sources-2026-09-07/`.

Changes are split into focused commits on `main`. No push, version increment,
distributable release, or paid provider matrix was requested or performed.

## Verification

- Final `make pre-push`: 1,889 tests passed, one intentionally skipped paid
  provider-matrix test, with TypeScript, static analysis, native configuration,
  and coverage gates passing.
- Android queue JVM tests: nine passed; four new tests failed before the fix.
  `make android-instrumentation` passed on the dedicated Android emulator,
  including the real-player missing-file regression.
- iOS Release simulator build succeeded. Thinking add/edit/dismiss flow passed
  with network-free repository fixtures; screenshot reviewed. The reusable
  regression is `.maestro/flows/runtime/thinking-model-edit-ios.yaml`.
- `make ios-native-test`: all seven real native tests passed, including the
  recorder ownership regression that failed before the fix.

## Verification limits

Provider response behavior was tested with deterministic payloads and outgoing
request assertions. No chargeable provider calls were made. The user's exact
search provider was not supplied, so this review does not claim a live account
reproduction. Native verification uses simulators/emulators; this is not a
release or a claim of full physical-device/locale accessibility certification.
