# Design-system and runtime reconciliation tasks

## A. Establish the baseline

- [x] Confirm the active checkout, local commit range, and unrelated worktree
  files.
- [x] Read the approved migration goal, completed migration report, design kit
  READMEs, root living specs, and current Obsidian project context.
- [x] Discover the four requested device classes and record immediate access
  blockers.
- [x] Create the 64-export component/contract mapping and screen/flow coverage
  matrix.
- [ ] Capture exact installed build identities and replace stale builds before
  accepting screenshots or behavior. Exact Release builds are proven on the
  Android emulator and iOS simulator; both physical-device cells remain open.

## B. Deterministic cross-platform presentation

- [ ] Capture the approved workspace states on Android and iOS in light/dark,
  portrait/landscape, RTL, and accessibility-large text.
- [ ] Capture the conversation drawer, transcript sheet, route picker,
  introduction, Premium hand-off, and every settings page.
- [ ] Capture every orb phase, both progress rings at boundary values, overtime,
  blocked voice, speaking controls, and Drive Session countdown.
- [ ] Compare screenshots and accessibility trees with the component prompts,
  type contracts, tokens, and kit compositions; record every deviation.

## C. Real app flows

- [ ] Exercise all seven introduction steps, gestures, audio, closing/reopening,
  and modal hand-offs on Android and iOS.
- [ ] Exercise settings navigation, controls, persistence, dialogs, Free/Premium
  gating, backup/restore entry points, and diagnostics.
- [ ] Exercise voice/text input, route switching, conversation settings,
  images, Web, Model Council, transcript actions, conversation creation,
  search, branching, and rotation.

## D. On-device and voice runtime

- [ ] Prove honest ineligibility and retry behavior on the low-memory Android
  emulator.
- [ ] On physical Android, install and verify the selected profile, run the
  benchmark and a complete local voice turn, then test background/lifecycle
  and resume behavior.
- [ ] On physical iPhone, install and verify the selected profile, run the
  benchmark and a complete local voice turn, then test audio-session and
  background/lifecycle behavior.
- [ ] Run Android instrumentation and iOS native tests on the applicable exact
  builds.

## E. Reconcile defects and close the goal

- [ ] For each confirmed defect, add a failing regression test, implement the
  smallest coherent fix, update the living spec chain and changelog, and rerun
  the affected matrix cells.
- [ ] Run the spend-free repository gates and a fresh-checkout validation.
- [ ] Review every image in the reconciliation gallery manually.
- [ ] Publish the final evidence matrix, intentional deviations, remaining
  blockers, commits, and artifact paths to the repository report and Obsidian.

## Completed batches

### 2026-08-11 — English portrait emulator/simulator baseline

- [x] Built the current checkout as Release for Android and iOS, scanned the
  resulting app artifacts for local secrets, and installed them on the target
  emulator/simulator.
- [x] Captured and manually reviewed eight Android and ten iOS deterministic
  scenes covering the workspace, transcript, introduction auto-setup step,
  conversation drawer, settings, Thinking, Speaking, on-device AI, and
  conversation settings.
- [x] Repaired stale deterministic flows so they follow the current transcript
  sheet, seven-step introduction, and conversation-settings entry point.
- [x] Fixed and regression-tested the status/composer mismatch that appeared
  when readiness settled after mount and automatically moved the workspace to
  text input.
