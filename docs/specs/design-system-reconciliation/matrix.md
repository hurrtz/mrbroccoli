# Design-system reconciliation matrix

Status vocabulary: `mapped` means the production implementation and primary
test boundary have been located; it does not yet mean native visual or
functional acceptance. Device verdicts are added as the goal progresses.

## Components

| Design component | React Native implementation | Baseline |
| --- | --- | --- |
| `ProviderIcon` | `src/components/ProviderIcon.tsx` | mapped |
| `ChatBubble` | `src/components/ChatBubble.tsx` and `src/components/chatBubble/` | mapped |
| `ChatTranscript` | `src/components/ChatTranscript.tsx` | mapped |
| `ConversationDrawerItem` | `src/components/conversationDrawer/ConversationDrawerItem.tsx` | mapped |
| `MessageImageAttachments` | `src/components/MessageImageAttachments.tsx` | mapped |
| `Button` | `src/design-system/NativeControls.tsx` | mapped |
| `IconButton` | `src/design-system/IconButton.tsx` | mapped |
| `Input` | `src/design-system/NativeControls.tsx` | mapped |
| `TextArea` | `Input.TextArea` in `src/design-system/NativeControls.tsx` | mapped |
| `Tag` | `src/design-system/NativeControls.tsx` | mapped |
| `PhosphorIcon` | `src/design-system/PhosphorIcon.tsx` | mapped |
| `IntroBody` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroButton` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroDivider` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroFlow` | `src/components/introFlow/IntroFlowScreen.tsx` | mapped |
| `IntroPanel` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroPoint` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroStepper` | `src/components/introFlow/IntroStepper.tsx` | mapped |
| `IntroTitle` | `src/components/introFlow/IntroPrimitives.tsx` | mapped |
| `IntroVoicePicker` | `src/components/introFlow/IntroVoicePicker.tsx` | mapped |
| `List` | `src/design-system/NativeControls.tsx` | mapped |
| `ListItem` | `List.Item` in `src/design-system/NativeControls.tsx` | mapped |
| `AutoSetupCard` | `src/components/autoSetup/AutoSetupCard.tsx` | mapped |
| `AutoSetupPlanRow` | `src/components/autoSetup/AutoSetupPlanRow.tsx` | mapped |
| `InstallProgress` | `src/components/autoSetup/InstallProgressBar.tsx` | mapped, native name differs |
| `LocalModelPerformanceSummary` | `src/components/LocalModelPerformanceSummary.tsx` | mapped |
| `Modal` | `src/design-system/NativeControls.tsx` | mapped |
| `Toast` | `src/components/Toast.tsx` | mapped |
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
| `RuntimeReadiness` | `src/features/settings/settings-primitives/RuntimeReadiness.tsx` | mapped |
| `AppWordmark` | `src/components/AppWordmark.tsx` | mapped |
| `BackgroundTaskBar` | `src/design-system/BackgroundTaskBar.tsx` | mapped |
| `ConversationSettingsSummary` | `src/design-system/ConversationSettingsSummary.tsx` | mapped |
| `IntroBanner` | `src/components/IntroBanner.tsx` | mapped |
| `OrbSatellite` | `src/design-system/OrbSatellite.tsx` | mapped |
| `PhaseAwareVoiceAction` | `src/screens/main/PhaseAwareVoiceAction.tsx` | mapped, retained off-home |
| `Picker` | `src/components/Picker.tsx` | mapped |
| `PremiumUpgradeModal` | `src/components/PremiumUpgradeModal.tsx` | mapped |
| `ResponseModeToggle` | `src/components/ResponseModeToggle.tsx` | mapped, retained off-home |
| `RouteByline` | `src/screens/main/MainScreenRouteByline.tsx` | mapped, native composition name differs |
| `TranscriptHandle` | `src/design-system/TranscriptHandle.tsx` | mapped |
| `VoiceOrb` | `src/design-system/VoiceOrb.tsx` and `src/screens/main/useOrbTurnProgress.ts` | mapped |
| `WorkspaceStatusLine` | `src/design-system/WorkspaceStatusLine.tsx` | mapped |

## Manifest data exports

The remaining entries in the 64-export manifest are contracts or specimen
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
| Workspace, light/dark portrait | pass: default plus dark/high-contrast/large text | pass: isolated Release smoke | pass: default plus dark/high-contrast/large text | launch pass on fallback iPhone; Wi-Fi target blocked |
| Workspace landscape | pass: split panes and active route byline | pass: smoke rotation | pass: split panes and active route byline | not automated |
| Orb states and progress rings | pass: ten deterministic phases/boundaries | pass: real recording, transcribing, thinking, speaking plus deterministic overtime | pass: ten deterministic phases/boundaries | full-overtime isolated fixture pass; real turn blocked |
| Introduction and audio | pass: seven steps, swipe, bundled audio, Back/Done/reopen/close | pass: same 13-scene smoke | pass: same 13-scene smoke | first-launch banner captured; interaction not automated |
| Automatic setup | pass: honest low-memory rejection, retry, manual hand-off | pass: Qwen and Whisper viable; Piper failure excluded on retry; system-voice profile Ready | presentation and controller tests pass | blocked by signing/memory entitlement prerequisite |
| Settings overview and eight pages | pass across 19 locales | overview/App/on-device navigation pass | pass across 19 locales | first-launch Settings entry visible; interaction not automated |
| Transcript, drawer, route picker, chat actions | deterministic scenes and route-picker landscape pass | pass: smoke, local text turn, local voice turn, persisted transcript | deterministic scenes and route-picker landscape pass | not automated |
| RTL and accessibility-large text | Arabic/Urdu plus large-text pass | representative smoke pass | Arabic/Urdu plus large-text pass | not automated |
| Native audio/model/lifecycle tests | Android instrumentation pass | pass: interrupted transfer recovery plus real PCM-WAV capture, local Whisper/Qwen, system playback | iOS native tests pass | blocked |

## Run evidence — 2026-08-11

- Android exact Release specimen: eight of eight flows passed on
  `emulator-5554`; artifacts are under
  `artifacts/store-promos/android/phone/en/`. The post-fix Free screenshot
  proves the text composer and “Type and send” status agree.
- iOS exact Release specimen: ten of ten flows passed on the iPhone 17 Pro iOS
  26.4 simulator; artifacts are under
  `artifacts/store-promos/ios/6.3/en/` at the required 1206×2622 pixels.
- Both runs exercised current accessibility identifiers for transcript access,
  the introduction auto-setup step, settings titles, close actions, and the
  conversation-settings drawer.
- Manual raster review found no release-blocking defect in these English light
  portrait scenes after the workspace status fix. The iOS Thinking header
  remains a comparison item because its raster framing differs from adjacent
  settings captures even though its title and close-action visibility checks
  pass.
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
