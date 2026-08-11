# Design-system and runtime reconciliation requirements

## Goal

Reconcile the shipped React Native application with the approved vendored
`design-system/` and prove that the complete user experience works on Android
and iOS. Visual similarity alone is not acceptance: every represented control,
state, transition, navigation path, and native capability must remain usable.

## Authorities

- `design-system/` is the source of truth for the approved visual intent. It is
  a read-only web mirror and must not be imported by or hand-edited for the app.
- The root and subtree `SPEC.md` / `DESIGN.md` files are the source of truth for
  product behavior, state flow, privacy, persistence, and failure handling.
- The current checkout and live native builds are the source of truth for what
  is implemented. Static render tests or the web kit do not prove native
  behavior.
- `design-system/migration-goal.md` and
  `docs/specs/design-system-migration/report.md` are the completed migration
  baseline. This goal verifies and corrects that baseline rather than repeating
  it.

## Visual acceptance

1. Map every component in `design-system/_ds_manifest.json` to its React Native
   implementation or document why it is specimen-only.
2. Reconcile the workspace, conversation drawer, introduction, all settings
   pages, overlays, chat content, and on-device setup with their design-system
   definitions.
3. Check every affected surface in light and dark appearances, portrait and
   landscape, one RTL locale, and accessibility-large text.
4. Preserve the token values, type roles, spacing, radii, icon semantics,
   minimum 44-point targets, semantic colours, contrast, and modal focus rules.
5. Treat fixture screenshots as deterministic reference evidence, not as proof
   that a real navigation or native capability works.

## Functional acceptance

The following flows must work end to end where the target supports them:

- seven-step introduction, swipe/header/stepper navigation, localized audio,
  close/reopen, provider and Premium hand-offs, and return-to-origin behavior;
- automatic on-device setup from both introduction and Settings, including real
  readings, proposal-before-install, background continuation, progress,
  cancellation, failure, resume without re-download, and final profile use;
- manual local-model catalogue, download, checksum verification, benchmark,
  selection, test, removal, storage reporting, and device-specific readiness;
- Settings overview and all eight pages, Free/Premium gating, pickers, dialogs,
  validation, backup/restore entry points, diagnostics, and persistence;
- voice/text pager, route byline and picker, conversation settings, image,
  Search and Model Council controls, conversation drawer, transcript sheet,
  message actions, and portrait/landscape transitions;
- voice orb idle/recording/transcribing/thinking-briefly/searching/thinking/
  synthesizing/speaking states, press semantics, Drive Session countdown,
  phase ring, estimated-turn ring, and overtime rendering;
- a complete on-device voice turn through STT, local response generation, TTS,
  playback controls, persistence, background/lifecycle transitions, and the
  next-turn reset.

Hosted-provider live calls are not part of this goal unless the user separately
authorizes a new-version release. Deterministic fixtures may exercise provider
presentation and routing UI without spending quota.

## Device matrix

| Target | Required evidence |
| --- | --- |
| Android emulator | deterministic visual states, navigation, locale/theme/orientation/accessibility coverage, honest low-memory local-model failure, Android instrumentation |
| Physical Android | successful eligible local-model install/benchmark, microphone/STT, local LLM, TTS/playback, background service, lifecycle, thermal/memory evidence |
| iOS simulator | deterministic visual states, navigation, locale/theme/orientation/accessibility coverage, iOS native tests that support a simulator |
| Physical iPhone | microphone/speech/audio session, eligible local-model install/benchmark, local LLM/TTS, background/lifecycle behavior, provisioning/entitlement evidence |

An unavailable, locked, unpaired, or ineligible target is a recorded blocker,
not a pass and not a reason to weaken the matrix.

## Evidence and completion

- Keep sanitized screenshots, hierarchy dumps, logs, and manifests under the
  ignored `artifacts/design-system-reconciliation/` tree.
- Record the exact commit, build identity, device identifier/model/OS,
  appearance, locale, orientation, text/accessibility settings, and test result.
- Every confirmed defect receives the closest reliable automated regression
  test before its fix.
- Update affected living specs and the changelog with user-visible fixes.
- Completion requires all non-blocked matrix cells to pass, manual review of
  every captured image, and explicit unresolved blockers for any remaining
  physical-device or external dependency.
