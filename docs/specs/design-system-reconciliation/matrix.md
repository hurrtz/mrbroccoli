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
| Workspace, light/dark portrait | light English pass; dark pending | blocked: not visible to `adb` | light English pass; dark pending | blocked while device access is unavailable/locked |
| Workspace landscape | pending exact rebuild | blocked | pending exact rebuild | blocked |
| Orb states and progress rings | deterministic thinking pass; full phase/ring boundaries pending | pending real turn | deterministic thinking pass; full phase/ring boundaries pending | pending real turn |
| Introduction and audio | auto-setup step presentation pass; complete flow/audio pending | pending | auto-setup step presentation pass; complete flow/audio pending | pending |
| Automatic setup | Free intro setup presentation pass; live low-memory retry pending | pending eligible install | setup presentation pass | pending eligible install |
| Settings overview and eight pages | overview, Thinking, on-device AI pass; complete page matrix pending | pending | overview, Thinking, Speaking, on-device AI pass; complete page matrix pending | pending |
| Transcript, drawer, route picker, chat actions | transcript, drawer, conversation settings pass; remaining actions pending | pending | transcript/message audit, drawer, conversation settings pass; remaining actions pending | pending |
| RTL and accessibility-large text | pending | pending representative smoke | pending | pending representative smoke |
| Native audio/model/lifecycle tests | Android instrumentation pending | pending | iOS native tests pending | pending |

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

## Initial environment facts — 2026-08-11

- Checkout: `e5e6e18`, branch `main`, ten commits ahead of `origin/main` when
  the goal started.
- Android emulator: `emulator-5554`, Google arm64 AVD, Android 17, 1080×2400 at
  420 dpi.
- iOS simulator: iPhone 17 Pro, iOS 26.4,
  `A57F05FB-C492-4E7A-9AA7-2B542FC9D289`.
- Wi-Fi iPhone discovered as iPhone 15 Pro,
  `D870BA3B-66F3-566D-9F12-A97DD4F0F0ED`; the initial developer image mount
  failed because the device was locked.
- A second paired iPhone 17 Pro Max was visible over a wired CoreDevice
  transport and already contained production and development 3.2.0 builds.
- No physical Android transport or pairing appeared in `adb devices`, mDNS, or
  the Mac USB inventory during initial discovery.
