# Design-system and runtime reconciliation tasks

## A. Establish the baseline

- [x] Confirm the active checkout, local commit range, and unrelated worktree
  files.
- [x] Read the approved migration goal, completed migration report, design kit
  READMEs, root living specs, and current Obsidian project context.
- [x] Discover the four requested device classes and record immediate access
  blockers.
- [x] Create the original 64-export component/contract mapping and screen/flow
  coverage matrix.
- [x] Capture exact installed build identities and replace stale builds before
  accepting screenshots or behavior. The isolated Release identity is proven
  on both simulators, the Pixel 4a, and the fallback physical iPhone. The
  Wi-Fi iPhone remains a separately recorded developer-image blocker.

## B. Deterministic cross-platform presentation

- [x] Capture the approved workspace states on Android and iOS in light/dark,
  portrait/landscape, RTL, and accessibility-large text.
- [x] Capture the conversation drawer, transcript sheet, route picker,
  introduction, Premium hand-off, and every settings page.
- [x] Capture every orb phase, both progress rings at boundary values, overtime,
  blocked voice, speaking controls, and Drive Session countdown.
- [x] Compare screenshots and accessibility trees with the component prompts,
  type contracts, tokens, and kit compositions; record every deviation.

## C. Real app flows

- [x] Exercise all seven introduction steps, gestures, audio, closing/reopening,
  and modal hand-offs on Android and iOS.
- [x] Exercise settings navigation, controls, persistence, dialogs, Free/Premium
  gating, backup/restore entry points, and diagnostics.
- [x] Exercise voice/text input, route switching, conversation settings,
  images, Web, Model Council, transcript actions, conversation creation,
  search, branching, and rotation. Repository tests and deterministic native
  scenes cover the capability-gated routes without paid calls; the physical
  local voice turn covers real microphone, STT, response, persistence, and
  playback.

## D. On-device and voice runtime

- [x] Prove honest ineligibility and retry behavior on the low-memory Android
  emulator.
- [x] On physical Android, install and verify the selected profile, run the
  benchmark and a complete local voice turn, then test background/lifecycle
  and resume behavior.
- [ ] On physical iPhone, install and verify the selected profile, run the
  benchmark and a complete local voice turn, then test audio-session and
  background/lifecycle behavior.
- [x] Run Android instrumentation and iOS native tests on the applicable exact
  builds.

## E. Reconcile defects and close the goal

- [x] For each confirmed defect, add a failing regression test, implement the
  smallest coherent fix, update the living spec chain and changelog, and rerun
  the affected matrix cells.
- [x] Run the spend-free repository gates and a fresh-checkout validation.
- [x] Review every image in the reconciliation gallery manually, including the
  684-image locale contact sheet per platform, the current 13-scene smoke rows,
  the ten-state orb montages, layout/accessibility captures, and physical-device
  evidence.
- [x] Publish the final evidence matrix, intentional deviations, remaining
  blockers, commits, and artifact paths to the repository report and Obsidian.

## Reopened regression batch — 2026-08-11

- [x] Trace the startup CTA/composer and text-submit diversion through the
  workspace pager and `MainScreen`; restore the stable orb and direct blocked
  notices to the owning On-device settings page.
- [x] Remove the Free edition status link from the route selector, centre the
  sparse requirements introduction step, and restore persisted completed
  automatic setup as Ready only after current install/benchmark revalidation.
- [x] Make Piper VITS verification include its required phoneme pack and move
  orb estimate and overtime clocks from a 200ms JS tick to the UI thread.
- [x] Add focused regressions for each changed behavior and pass TypeScript and
  static analysis.
- [ ] Capture the remaining fresh Pixel 4a Release smoke flow. The current
  Android-emulator and iOS-simulator matrices have passed; the connected Pixel
  4a is screen-locked and must be unlocked before its 13 screenshots can be
  captured. Physical-iPhone local-model acceptance remains subject to the
  existing developer-image/signing prerequisite.

## Reopened design revision — 2026-08-13

- [x] Re-inventory the expanded 83-export design manifest and identify the new
  sessions, transcript, settings-row, and Premium-band contracts.
- [x] Reconcile the sessions drawer to the flat Pinned/Earlier/Archived model,
  root-session links, compact provider marks, bottom search, and complete
  action sheet.
- [x] Reconcile transcript messages to the folded script-row model, compact and
  expanded metadata, expanded-only actions, and swipe removal.
- [x] Reconcile the workspace revision: measured portrait orb, timing-only
  pager motion, explicit Normal effort, tone/length/voice summary, relative-age
  status and handle copy, constrained landscape controls, and the single-header
  transcript sheet.
- [x] Reconcile onboarding and announcement ownership: 44-point introduction
  controls, the Recommended setup divider, compact landscape invitation,
  Premium gold treatment, modal focus isolation, toast suspension behind
  secondary surfaces, setup task rows, and reply-owned fallback notices.
- [ ] Reconcile the seven-page settings hierarchy and its new row/group route
  primitives. Overview, Connections, Search, Listening, Speaking, Data,
  App, and the replacement Thinking implementation are source-complete;
  rebuilt native visual/interaction acceptance remains open.
- [ ] Rebuild the exact Release apps and repeat native visual and interaction
  acceptance for every changed surface.

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

### 2026-08-11 — Cross-platform Release matrix and physical-device follow-up

- [x] Exercised all 19 registered UI languages with 36 explicit screenshots
  each on Android and iOS, plus the current introduction smoke, three-route
  landscape, dark/high-contrast/large-text, TalkBack, and VoiceOver flows.
- [x] Replaced stale setup-wizard and home response-grid selectors with the
  current intro-banner, route-byline, route-picker, settings, and workspace
  contracts.
- [x] Added an isolated, bounded ten-state orb phase/progress fixture and
  reviewed matching Android and iOS montages, including both overtime tails.
- [x] Restored the approved final introduction action as a labelled Done button
  and covered it with a regression test and the complete smoke flow.
- [x] Passed Android native instrumentation, iOS native tests, and 235 focused
  onboarding, on-device, voice-pipeline, orb, STT, and TTS tests.
- [x] Passed the low-memory emulator setup rejection/retry/manual hand-off and
  the 13-scene current Release smoke flow on the Pixel 4a.
- [x] Finished the Pixel 4a profile after the interrupted transfer. Qwen3.5
  0.8B passed at 8.34 tok/s with 1.4x memory headroom; Whisper Small passed at
  0.89 realtime factor with 1.1x headroom. Piper failed honestly, retry excluded
  that durable failure, and the coherent profile completed with system speech.
- [x] Completed real physical text and microphone turns through Qwen, local
  Whisper, persisted replies, the Speaking orb, and system voice. The first
  microphone attempt exposed AAC/M4A capture at the Sherpa WAV boundary; the
  PCM-WAV native fix passed its regression test and the repeated 51-second
  Release flow.
- [x] Passed the full spend-free gate and a clean detached fresh-checkout at
  `01cbb99`: 193 suites passed, one suite was skipped, 1,783 tests passed, one
  test was skipped, and the global coverage floor remained green.
- [x] Recorded the work in atomic commits `a037be8`, `d1f91a8`, `72f27c3`,
  `12f61bf`, and `01cbb99`, then published this closeout and the matching
  Obsidian evidence note.
- [ ] Run the same real model/voice acceptance on a physical iPhone. The Wi-Fi
  iPhone cannot mount its developer image; a fallback iPhone accepted and
  launched the isolated Release build, but its wildcard profile cannot carry
  the extended-memory entitlements needed to count as a local-model verdict.
