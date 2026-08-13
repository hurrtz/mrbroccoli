# Design-system reconciliation matrix

Status vocabulary: `mapped` means the production implementation and primary
test boundary have been located; it does not yet mean native visual or
functional acceptance. Device verdicts are added as the goal progresses.

## Components

| Design component | React Native implementation | Baseline |
| --- | --- | --- |
| `ProviderIcon` | `src/components/ProviderIcon.tsx` | mapped |
| `ChatBubble` | `src/components/ChatBubble.tsx` and `src/components/chatBubble/` | retained legacy composition; no longer the transcript row |
| `ChatTranscript` | `src/components/ChatTranscript.tsx` | mapped |
| `TranscriptMessage` | `src/components/TranscriptMessage.tsx` | mapped to folded script row; unit acceptance passed |
| `ConversationActionSheet` | `src/components/conversationDrawer/ConversationActionSheet.tsx` | source/unit parity; bottom sheet geometry, 48-point rows, hidden backdrop, and labelled close action |
| `ConversationDrawerItem` | `src/components/conversationDrawer/ConversationDrawerItem.tsx` | mapped |
| `ConversationIntegrityModal` | `src/components/conversationDrawer/ConversationIntegrityModal.tsx` | mapped |
| `ConversationMemoryModal` | `src/components/ConversationMemoryModal.tsx` | mapped |
| `ConversationRenameModal` | `src/components/conversationDrawer/ConversationRenameModal.tsx` | mapped |
| `MessageBranchIndicator` | `src/components/chatBubble/MessageBranchIndicator.tsx` | mapped |
| `MessageImageAttachments` | `src/components/MessageImageAttachments.tsx` | mapped |
| `PipelineNotices` | `src/components/chatBubble/PipelineNotices.tsx` | source/unit parity; search and speech degradation retained inline without duplicate toast |
| `ReplyFailureCard` | `src/components/chatBubble/ReplyFailureCard.tsx` | mapped |
| `TurnReceiptCard` | `src/components/chatBubble/TurnReceiptCard.tsx` | retained detail composition; transcript consolidates it |
| `UberModeAuditCard` | `src/components/chatBubble/UberModeAuditCard.tsx` | retained detail composition; transcript consolidates it |
| `UsageCard` | `src/components/chatBubble/UsageCard.tsx` | retained detail composition; transcript consolidates it |
| `WebSearchReferences` | `src/components/chatBubble/WebSearchReferences.tsx` | retained detail composition; transcript consolidates it |
| `Button` | `src/design-system/NativeControls.tsx` | mapped |
| `IconButton` | `src/design-system/IconButton.tsx` | mapped |
| `Input` | `src/design-system/NativeControls.tsx` | mapped |
| `TextArea` | `Input.TextArea` in `src/design-system/NativeControls.tsx` | mapped |
| `Tag` | `src/design-system/NativeControls.tsx` | mapped |
| `PhosphorIcon` | `src/design-system/PhosphorIcon.tsx` | mapped |
| `IntroBody` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroButton` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroDivider` | `src/components/introFlow/IntroPrimitives.tsx` | source/unit parity; Optional and Recommended reading-order rules |
| `IntroFlow` | `src/components/introFlow/IntroFlowScreen.tsx` | source/unit parity; 40-point faces within 44-point targets |
| `IntroPanel` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroPoint` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroStepper` | `src/components/introFlow/IntroStepper.tsx` | mapped |
| `IntroTitle` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroVoicePicker` | `src/components/introFlow/IntroVoicePicker.tsx` | source/unit parity; isolated modal focus and labelled 44-point close action |
| `List` | `src/design-system/NativeControls.tsx` | mapped |
| `ListItem` | `List.Item` in `src/design-system/NativeControls.tsx` | mapped |
| `AutoSetupCard` | `src/components/autoSetup/AutoSetupCard.tsx` | mapped |
| `AutoSetupPlanRow` | `src/components/autoSetup/AutoSetupPlanRow.tsx` | mapped |
| `InstallProgress` | `src/components/autoSetup/InstallProgressBar.tsx` | mapped, native name differs |
| `LocalModelPerformanceSummary` | `src/components/LocalModelPerformanceSummary.tsx` | mapped |
| `Modal` | `src/design-system/NativeControls.tsx` | source/unit parity; focus isolation, hidden dismissal backdrops, explicit close actions, and dismissal-before-sibling hand-offs |
| `Toast` | `src/components/Toast.tsx` | source/unit parity; pending interval is suspended behind secondary surfaces |
| `AntButtonLabel` | `src/features/settings/settings-primitives/SettingsCards.tsx` | mapped |
| `AntDisclosureCard` | `src/features/settings/settings-primitives/SettingsCards.tsx` | mapped |
| `AntNumberInputRow` | `src/features/settings/settings-primitives/SettingsFields.tsx` | mapped |
| `AntPickerRow` | `src/features/settings/settings-primitives/SettingsPickerControls.tsx` | mapped |
| `AntPickerRows` | `src/features/settings/settings-primitives/SettingsPickerControls.tsx` | mapped |
| `AntPickerSection` | `src/features/settings/settings-primitives/SettingsPickerControls.tsx` | mapped |
| `AntRadioSection` | `src/features/settings/settings-primitives/SettingsCards.tsx` | mapped |
| `AntSectionIntro` | `src/features/settings/settings-primitives/SettingsCards.tsx` | mapped |
| `AntSettingsCard` | `src/features/settings/settings-primitives/SettingsCards.tsx` | mapped |
| `AntSwitchRow` | `src/features/settings/settings-primitives/SettingsFields.tsx` | mapped |
| `AntTextArea` | `src/features/settings/settings-primitives/SettingsFields.tsx` | mapped |
| `IconAction` | `src/features/settings/settings-primitives/IconAction.tsx` | mapped |
| `PremiumBand` | `src/features/settings/settings-primitives/PremiumBand.tsx` | mapped |
| `RouteOptionRow` | `src/features/settings/settings-primitives/RouteOptionRow.tsx` | mapped |
| `RuntimeReadiness` | `src/features/settings/settings-primitives/RuntimeReadiness.tsx` | mapped |
| `SettingsGroup` | `src/features/settings/settings-primitives/SettingsGroup.tsx` | mapped |
| `SettingsRow` | `src/features/settings/settings-primitives/SettingsRow.tsx` | mapped |
| `AppWordmark` | `src/components/AppWordmark.tsx` | mapped |
| `BackgroundTaskBar` | `src/design-system/BackgroundTaskBar.tsx` | source/unit parity; automatic setup progress, success, and failure ownership |
| `Composer` | `src/screens/main/voiceTextInputPager/InputSurfacePages.tsx` | mapped through native composer composition |
| `ConversationSettingsSummary` | `src/design-system/ConversationSettingsSummary.tsx` | source/unit parity; portrait-only workspace ownership |
| `IntroBanner` | `src/components/IntroBanner.tsx` | source/unit parity; full portrait and 48-point title-only landscape forms |
| `OrbSatellite` | `src/design-system/OrbSatellite.tsx` | mapped |
| `PhaseAwareVoiceAction` | `src/screens/main/PhaseAwareVoiceAction.tsx` | mapped, retained off-home |
| `Picker` | `src/components/Picker.tsx` | mapped |
| `PremiumUpgradeModal` | `src/components/PremiumUpgradeModal.tsx` | source/unit parity; Premium gold hero, benefits, and value band |
| `ResponseModeToggle` | `src/components/ResponseModeToggle.tsx` | mapped, retained off-home |
| `RouteByline` | `src/screens/main/MainScreenRouteByline.tsx` | source/unit parity; native composition name differs |
| `RoutePicker` | `src/screens/main/RoutePickerSheet.tsx` | mapped, native composition name differs |
| `TranscriptHandle` | `src/design-system/TranscriptHandle.tsx` | source/unit/device parity; latest model and localized relative age, with a compact localized timestamp fallback when Hermes omits relative-time formatting |
| `VoiceOrb` | `src/design-system/VoiceOrb.tsx` and `src/screens/main/useOrbTurnProgress.ts` | source/unit parity; measured stage and timing-only pager motion |
| `WorkspaceStatusLine` | `src/design-system/WorkspaceStatusLine.tsx` | source/unit/device parity; idle conversation age derived by a non-throwing view model formatter |

## Manifest data exports

The remaining entries in the 83-export manifest are contracts or specimen
data, not separate visual components.

| Design export | Native authority | Baseline |
| --- | --- | --- |
| `ICON_SIZE`, `MIN_ICON_TOUCH_TARGET`, `PHOSPHOR_ICONS` | `src/design-system/PhosphorIcon.tsx` | mapped; compare semantic scale and key set |
| `INTRO_STEPS`, `INTRO_COPY` | `src/components/introFlow/introSteps.tsx` plus localized dictionaries | mapped; native copy must stay localized |
| `INTRO_LANGUAGES` | locale registry and `src/components/introFlow/IntroVoicePicker.tsx` | mapped |
| `AUTO_SETUP_COPY` | `src/i18n/autoSetupTranslations.ts` | mapped; native copy must stay localized |
| `AUTO_SETUP_PLAN`, `AUTO_SETUP_FACTS`, `AutoSetupStepReading` | `src/screens/main/useAutoSetupJob.ts`, `src/components/autoSetup/types.ts`, and live device diagnostics | mapped; native values must be real rather than specimen data |
| `brandFonts` | `src/theme/typography.ts` and `src/design-system/AppFontProvider.tsx` | mapped |

## Screen and flow verdicts

| Surface or flow | Android emulator | Physical Android | iOS simulator | Physical iPhone |
| --- | --- | --- | --- | --- |
| Workspace, light/dark portrait | exact Release pass | exact Release smoke pass | exact Release pass plus post-fix accessibility-large pass | current exact Release pass with selected local profile and persisted local transcript |
| Workspace landscape | exact Release pass | exact Release smoke rotation pass | exact Release pass plus post-fix accessibility-large pass | not automated |
| Orb states and progress rings | pass: ten deterministic phases/boundaries | pass: real recording, transcribing, thinking, speaking plus deterministic overtime | pass: ten deterministic phases/boundaries | pass: isolated overtime plus real native recording and local transcription; audible playback intentionally replaced by silent Piper benchmark |
| Introduction and audio | pass: seven steps, swipe, bundled audio, Back/Done/reopen/close | pass: same 13-scene smoke | pass: same 13-scene smoke | first-launch banner captured; interaction not automated |
| Automatic setup | pass: honest low-memory rejection, retry, manual hand-off | pass: Qwen and Whisper viable; Piper failure excluded on retry; system-voice profile Ready | presentation and controller tests pass | pass: app-owned background transfer/resume proved; SHA-verified artifacts completed the slow transfer; Granite, Parakeet, and Piper viable, Kokoro honestly below target |
| Settings overview and seven pages | exact Release pass across every page | representative exact Release smoke pass | exact Release pass across every page | representative current Release overview/Speaking/profile/cold-start pass |
| Transcript, drawer, route picker, chat actions | exact Release pass | representative exact Release smoke pass | exact Release pass | current Release transcript creation, persisted status, and timestamp fallback pass |
| RTL and accessibility-large text | 19-locale sweep and accessibility pass | representative exact Release smoke pass | 19-locale sweep plus post-fix accessibility pass | not automated |
| Native audio/model/lifecycle tests | Android instrumentation pass | pass: interrupted transfer recovery plus real PCM-WAV capture, local Whisper/Qwen, system playback | iOS native tests pass | pass: background download continuation, cold readiness, native PCM recording, local Parakeet STT, Granite/Parakeet/Piper benchmarks, and exact Hermes Release regression |

## Run evidence — 2026-08-13

- The exact Release matrix passed on Android emulator `emulator-5554`, the USB
  Pixel 4a `09081JEC210280`, and the iPhone 17 Pro Max iOS 26.5 simulator
  `D6B394CE-F257-4496-B7AC-DD6F09A1C318`. It verified 1,429 screenshots: 708
  per simulator platform plus 13 physical-Android smoke captures.
- Both simulator platforms completed all 19 registered UI languages with 36
  captures per language, the introduction smoke, three-route landscape,
  dark/high-contrast/accessibility-large layouts, and TalkBack or VoiceOver
  hierarchy checks covering nine labelled home controls.
- Manual review covered all 38 locale contact sheets and the general flow
  sheets. The only new defect was an iOS accessibility-large overlap in the
  constrained workspace. Commit `363a71d3` gives compact chrome and the blocked
  route card stable accessible names; the rebuilt iOS Release app then passed
  the targeted eight-scene accessibility flow in portrait and landscape.
- Commit `2b227949` corrected the Settings keyboard regression test to model a
  native React Native subscription. The complete spend-free `make pre-push`
  gate then passed with 197 suites and 1,846 tests passing (1 intentionally
  skipped), plus TypeScript, ESLint/Knip, coverage, native-config parity,
  license, and diff-hygiene checks.
- The wired iPhone 17 Pro Max on iOS 26.6 accepted the current standalone
  Release `.dev` app with extended-address-space and increased-memory
  entitlements. Its app-managed Parakeet download continued while backgrounded
  and resumed the same setup job. Because the connection delivered only about
  15 KB/s, exact SHA-verified model archives were then side-loaded into the app
  container to complete runtime acceptance without misrepresenting that step
  as an app download.
- Granite 4.0 1B passed at 44.04 tok/s with 2.9x memory headroom; Parakeet
  passed at 0.189 realtime factor with 1.9x headroom; Piper Kristin passed at
  0.540 realtime factor and remained Ready after a cold launch. Kokoro ran
  correctly but reported its 2.057 realtime factor below the 1.5 target, so it
  remained an honest non-viable choice for this phone.
- The first successful physical local transcription exposed a Release-only
  Hermes crash: `Intl.RelativeTimeFormat` was absent when the new conversation
  timestamp rendered. A regression test first reproduced the missing API,
  `mainScreenViewModel.ts` gained a localized compact date/time fallback, and
  the freshly rebuilt physical Release app then transcribed a checksum-verified
  fixture, persisted the conversation, and rendered `10:49 AM` without a
  crash. Evidence is under
  `artifacts/design-system-reconciliation/current/ios-physical/2026-08-13-local-profile/`.
- Audible end-to-end Piper replay was not repeated after the user asked that
  the speakers remain quiet; synthesis is covered by the physical Piper
  benchmark and the integrated native playback gates. No paid provider
  request, release, push, or store action was performed.

## Run evidence — 2026-08-11

### Reopened regression batch (current worktree)

- Source and focused native-presentation tests now cover an orb-first blocked
  startup, text submission that cannot route into introduction, absent Free
  edition status link, centred requirements step, persisted Ready revalidation,
  Piper phoneme-pack verification, and UI-thread orb clocks.
- Android `emulator-5554` exact Release matrix passed: 19 UI languages with 36
  captures each, 13 smoke captures, three-route landscape, dark/high-contrast/
  large-text, and TalkBack hierarchy. The 708 screenshots are under
  `artifacts/maestro/release/android/`.
- iOS exact Release matrix passed on the iPhone 14 Plus iOS 26.3 simulator
  (`47F04ABD-CC99-400C-BFE8-61658B927D67`): the equivalent 708 screenshots,
  including the landscape assertion, and VoiceOver hierarchy evidence are
  under `artifacts/maestro/release/ios/` and
  `artifacts/maestro/release/screen-reader/ios/`. The iPhone 17 Pro iOS 26.4
  simulator's automation driver reported a successful orientation change while
  leaving app content portrait; the same flow passed on 26.3, so 26.4 was not
  accepted as evidence for this batch.
- Manual review of the current Android and iOS contact sheets, the landscape
  flow, and Arabic/Urdu home screens found no clipping, overlap, missing
  content, or RTL-direction defect. The home screenshot confirms the central
  orb and direct inline Settings action rather than a composer or legacy CTA.
- A fresh physical Android smoke run remains blocked by the attached Pixel 4a
  lock screen (`mWakefulness=Dozing`); no lock-screen bypass was attempted.
  Therefore `verify-maestro-artifacts` correctly rejects the current artifact
  set solely for its missing 13 physical screenshots. Earlier physical evidence
  is retained as history, not substituted for this exact Release run.
- No paid provider or quota-consuming request was made.

## Final repository verification — 2026-08-11

- Atomic implementation and tooling commits are `a037be8`, `d1f91a8`,
  `72f27c3`, `12f61bf`, and `01cbb99`; this report is the documentation
  closeout that follows them.
- The complete spend-free `make pre-push` gate passed after the native and
  application fixes: static checks, TypeScript, 193 passing Jest suites, 1,783
  passing tests, and the checked-in global coverage floor.
- `make android-unit`, `make android-instrumentation`, and
  `make ios-native-test` passed on the applicable emulator/simulator targets.
- `make fresh-checkout` then passed from a clean detached checkout of
  `01cbb99695a0b20d613f80dea82403df0f467067`, proving the result does not rely
  on ignored dependencies or the working tree.
- No paid provider or quota-consuming request was made, and no release or push
  was performed as part of this goal.

## Expanded Release evidence — 2026-08-11

- The Android and iOS locale sweeps each passed 19 languages with 36 explicit
  captures per language (684 per platform). The review contact sheets are
  `artifacts/design-system-reconciliation/current/android/localized-contact-sheet.png`
  and the corresponding `ios/` path. No clipping, overlap, missing section, or
  incorrect RTL direction was found in the reviewed sheets.
- The current introduction smoke passed with 13 captures each on the Android
  emulator, iOS simulator, and Pixel 4a. The three-row review sheet is
  `artifacts/design-system-reconciliation/current/smoke-contact-sheet.png`.
  It covers the banner, all seven steps, playing bundled audio, Back, Done,
  reopen/close, App settings, and landscape.
- Layout passed three explicit scenes per simulator platform. Dark mode,
  increased contrast, and accessibility-large text passed eight captures per
  platform. TalkBack and VoiceOver were active and exposed the same nine
  labelled home controls; evidence is under
  `artifacts/maestro/reconciliation/screen-reader/`.
- The ten-state orb matrix passed from exact isolated Release builds on both
  simulator platforms. The reviewed montages under
  `artifacts/design-system-reconciliation/current/{android,ios}/orb-matrix-final/`
  cover idle, recording, transcribing, short thinking, search, full thinking,
  synthesis, speaking, and half/full overtime.
- Android instrumentation passed on `emulator-5554`; iOS native tests passed on
  `A57F05FB-C492-4E7A-9AA7-2B542FC9D289`. Seventeen focused suites also passed
  235 tests covering onboarding, automatic setup, local model management and
  benchmarks, voice pipeline, orb timing, STT, and TTS.
- The Pixel 4a accepted the current isolated Release APK and passed all 13 smoke
  scenes. After a USB-interrupted transfer was cleaned and retried, Qwen3.5
  0.8B measured 8.34 tok/s, 1489 ms load, and 1.4x memory headroom; Whisper
  Small measured 0.89 realtime factor, 4709 ms load, and 1.1x headroom. Piper
  failed its device test without crashing, retry excluded the durable failure,
  and automatic setup reached Ready with Qwen, Whisper, and system speech.
- The completed profile produced a persisted local text reply in 48 seconds and
  a real physical microphone turn in 44 seconds. The first microphone attempt
  proved that Android AAC/M4A capture could not enter Sherpa's file recognizer;
  after switching native capture to mono 16 kHz PCM WAV, the exact Release flow
  passed recording, local Whisper transcription, Qwen response, Speaking orb,
  system playback, and a two-message transcript in 51 seconds. Evidence is in
  `artifacts/design-system-reconciliation/current/android-physical/resumed-auto-setup/`,
  especially `voice-turn/2026-08-11_0736-wav/` and the Ready/profile-turn
  capture directories.
- The Wi-Fi iPhone 15 Pro is paired but Xcode cannot mount its developer disk
  image. The wired fallback iPhone 17 Pro Max accepted the isolated Release app
  alongside production and produced current first-launch and full-overtime
  screenshots under `artifacts/design-system-reconciliation/current/ios-physical/manual/`.
  That build intentionally omitted extended-memory entitlements because the
  available wildcard profile cannot sign them, so it is UI evidence only and
  not a local-model result.
- No paid provider or quota-consuming request was made.

## Initial environment facts — 2026-08-11

- Checkout: `e5e6e18`, branch `main`, ten commits ahead of `origin/main` when
  the goal started.
- Android emulator: `emulator-5554`, Google arm64 AVD, Android 17, 1080×2400 at
  420 dpi.
- iOS simulator: iPhone 17 Pro, iOS 26.4,
  `A57F05FB-C492-4E7A-9AA7-2B542FC9D289`.
- Wi-Fi iPhone discovered as iPhone 15 Pro,
  `D870BA3B-66F3-566D-9F12-A97DD4F0F0ED`; even after it became available and
  paired, the developer image could not be mounted.
- A second paired iPhone 17 Pro Max was visible over a wired CoreDevice
  transport and already contained production and development 3.2.0 builds.
- No physical Android transport appeared during initial discovery. The Pixel
  4a later attached as `09081JEC210280`, accepted the isolated Release APK, and
  became the physical Android target described above.
