# Design-system reconciliation matrix

Audit implementation: `db1d59b4c8ff56fea3ee8ab66cb1ba57c2174ffa`, after
the 63-entry vendored design update at
`2bc0da877ddf20b0a56696a519bce7cd0bce6151`. The manifest SHA-256 is
`b8f6f5f0c7013be81f5f8c544786f297c0f169d3dc3b4eda6e26923a0cf3174a`.

`mapped` locates current ownership only. `pending-validation` marks a visible
candidate awaiting rebuilt native apps and image review. The spend-free gate
is green for the implementation SHA; no current row is accepted by static
evidence alone.

## Manifest entries: 63 of 63

### Brand (1)

| Entry          | Design source                       | Native authority                  | Current audit status |
| -------------- | ----------------------------------- | --------------------------------- | -------------------- |
| `ProviderIcon` | `components/brand/ProviderIcon.jsx` | `src/components/ProviderIcon.tsx` | mapped               |

### Chat (13)

| Entry                     | Design source                                 | Native authority                                                                                                 | Current audit status                                      |
| ------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `ChatBubble`              | `components/chat/ChatBubble.jsx`              | `src/components/ChatBubble.tsx`; `src/components/chatBubble/`                                                    | mapped                                                    |
| `ChatTranscript`          | `components/chat/ChatTranscript.jsx`          | `src/components/ChatTranscript.tsx`                                                                              | pending-validation: empty-state geometry changed          |
| `ConversationDrawerItem`  | `components/chat/ConversationDrawerItem.jsx`  | `src/components/conversationDrawer/ConversationDrawerItem.tsx`; list composition in `ConversationDrawerList.tsx` | pending-validation: drawer composition/styles changed     |
| `ConversationRenameModal` | `components/chat/ConversationRenameModal.jsx` | `src/components/conversationDrawer/ConversationRenameModal.tsx`                                                  | mapped                                                    |
| `MessageBranchIndicator`  | `components/chat/MessageBranchIndicator.jsx`  | `src/components/chatBubble/MessageBranchIndicator.tsx`                                                           | pending-validation: 30pt tag inside 44pt target           |
| `MessageImageAttachments` | `components/chat/MessageImageAttachments.jsx` | `src/components/MessageImageAttachments.tsx`                                                                     | pending-validation: remove-well geometry changed          |
| `PipelineNotices`         | `components/chat/PipelineNotices.jsx`         | `src/components/chatBubble/PipelineNotices.tsx`; shared `chatBubble/styles.ts`                                   | pending-validation: flat ruled rail and recovery controls |
| `ReplyFailureCard`        | `components/chat/ReplyFailureCard.jsx`        | `src/components/chatBubble/ReplyFailureCard.tsx`; shared `chatBubble/styles.ts`                                  | pending-validation: flat danger rail and retry control    |
| `TranscriptMessage`       | `components/chat/TranscriptMessage.jsx`       | `src/components/TranscriptMessage.tsx`                                                                           | pending-validation: disclosure target changed             |
| `TurnReceiptCard`         | `components/chat/TurnReceiptCard.jsx`         | `src/components/chatBubble/TurnReceiptCard.tsx`                                                                  | mapped; standalone detail contract retained               |
| `UberModeAuditCard`       | `components/chat/UberModeAuditCard.jsx`       | `src/components/chatBubble/UberModeAuditCard.tsx`                                                                | mapped; standalone detail contract retained               |
| `UsageCard`               | `components/chat/UsageCard.jsx`               | `src/components/chatBubble/UsageCard.tsx`                                                                        | mapped; standalone detail contract retained               |
| `WebSearchReferences`     | `components/chat/WebSearchReferences.jsx`     | `src/components/chatBubble/WebSearchReferences.tsx`                                                              | mapped; standalone detail contract retained               |

### Core (10)

| Entry                   | Design source                      | Native authority                       | Current audit status                      |
| ----------------------- | ---------------------------------- | -------------------------------------- | ----------------------------------------- |
| `Button`                | `components/core/Button.jsx`       | `src/design-system/NativeControls.tsx` | pending-validation: 48pt current geometry |
| `IconButton`            | `components/core/IconButton.jsx`   | `src/design-system/IconButton.tsx`     | mapped                                    |
| `Input`                 | `components/core/Input.jsx`        | `src/design-system/NativeControls.tsx` | mapped                                    |
| `ICON_SIZE`             | `components/core/PhosphorIcon.jsx` | `src/design-system/PhosphorIcon.tsx`   | mapped to semantic icon scale             |
| `MIN_ICON_TOUCH_TARGET` | `components/core/PhosphorIcon.jsx` | `src/design-system/PhosphorIcon.tsx`   | mapped to 44pt target contract            |
| `PHOSPHOR_ICONS`        | `components/core/PhosphorIcon.jsx` | `src/design-system/PhosphorIcon.tsx`   | mapped to native glyph registry           |
| `PhosphorIcon`          | `components/core/PhosphorIcon.jsx` | `src/design-system/PhosphorIcon.tsx`   | mapped                                    |
| `Switch`                | `components/core/Switch.jsx`       | `src/design-system/Switch.tsx`         | mapped                                    |
| `Tag`                   | `components/core/Tag.jsx`          | `src/design-system/NativeControls.tsx` | pending-validation: 44pt current target   |
| `TextArea`              | `components/core/TextArea.jsx`     | `src/design-system/NativeControls.tsx` | mapped                                    |

### Introduction (8)

| Entry                   | Design source                       | Native authority                                                                                                                             | Current audit status                                                             |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `IntroBody`             | `components/intro/IntroBody.jsx`    | `src/components/introFlow/IntroPrimitives.tsx`                                                                                               | pending-validation: primitive file was reduced to retained exports               |
| `INTRO_STEPS`           | `components/intro/IntroFlow.jsx`    | `src/components/introFlow/introSteps.tsx`                                                                                                    | mapped: exactly `welcome`, `setup`, `try`                                        |
| `INTRO_COPY`            | `components/intro/IntroFlow.jsx`    | `src/i18n/introTranslations.ts`; `src/components/introFlow/introSteps.tsx`                                                                   | mapped; welcome/hero/try copy blocked-owner                                      |
| `DEFAULT_MANUAL_GROUPS` | `components/intro/IntroFlow.jsx`    | live manual catalogue in `src/components/introFlow/introSteps.tsx`, backed by local-model and speech catalogues plus install/benchmark state | mapped; specimen rows are not copied constants                                   |
| `DEMO_TURN`             | `components/intro/IntroFlow.jsx`    | `src/screens/main/useIntroTestTurn.ts`; try-step rendering in `src/components/introFlow/introSteps.tsx`                                      | pending-validation: native path uses a real ephemeral turn, not fixture output   |
| `IntroFlow`             | `components/intro/IntroFlow.jsx`    | `src/components/introFlow/IntroFlowScreen.tsx`                                                                                               | pending-validation: navigation/control geometry and concurrent test-turn changes |
| `IntroStepper`          | `components/intro/IntroStepper.jsx` | `src/components/introFlow/IntroStepper.tsx`                                                                                                  | pending-validation: 44pt step targets                                            |
| `IntroTitle`            | `components/intro/IntroTitle.jsx`   | `src/components/introFlow/IntroPrimitives.tsx`                                                                                               | pending-validation: retained primitive file changed                              |

### List (2)

| Entry      | Design source                  | Native authority                       | Current audit status |
| ---------- | ------------------------------ | -------------------------------------- | -------------------- |
| `List`     | `components/list/List.jsx`     | `src/design-system/NativeControls.tsx` | mapped               |
| `ListItem` | `components/list/ListItem.jsx` | `src/design-system/NativeControls.tsx` | mapped               |

### On-device setup (8)

| Entry                          | Design source                                           | Native authority                                                                                | Current audit status                                               |
| ------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `AUTO_SETUP_COPY`              | `components/on-device/AutoSetupCard.jsx`                | `src/i18n/autoSetupTranslations.ts` and registered locale dictionaries                          | mapped; localized rather than copied                               |
| `AUTO_SETUP_PLAN`              | `components/on-device/AutoSetupCard.jsx`                | real profile plan in `src/screens/main/useAutoSetupJob.ts`; `src/components/autoSetup/types.ts` | pending-validation: concurrent setup-job changes                   |
| `AUTO_SETUP_FACTS`             | `components/on-device/AutoSetupCard.jsx`                | live device facts in `src/screens/main/useAutoSetupJob.ts`                                      | pending-validation: real readings, never specimen numbers          |
| `AutoSetupStepReading`         | `components/on-device/AutoSetupCard.jsx`                | type in `src/components/autoSetup/types.ts`; value in `src/screens/main/useAutoSetupJob.ts`     | pending-validation: concurrent job changes                         |
| `AutoSetupCard`                | `components/on-device/AutoSetupCard.jsx`                | `src/components/autoSetup/AutoSetupCard.tsx`                                                    | pending-validation: cancellation controls and job behavior changed |
| `AutoSetupPlanRow`             | `components/on-device/AutoSetupPlanRow.jsx`             | `src/components/autoSetup/AutoSetupPlanRow.tsx`                                                 | mapped                                                             |
| `InstallProgress`              | `components/on-device/InstallProgress.jsx`              | `src/components/autoSetup/InstallProgressBar.tsx`                                               | mapped; native name differs                                        |
| `LocalModelPerformanceSummary` | `components/on-device/LocalModelPerformanceSummary.jsx` | `src/components/LocalModelPerformanceSummary.tsx`                                               | mapped                                                             |

### Overlays (3)

| Entry          | Design source                          | Native authority                                                                                                    | Current audit status                                                                        |
| -------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `AnchoredMenu` | `components/overlays/AnchoredMenu.jsx` | `src/components/conversationDrawer/ConversationActionMenu.tsx`, composed by `src/components/ConversationDrawer.tsx` | mapped; native name differs                                                                 |
| `Modal`        | `components/overlays/Modal.jsx`        | `src/design-system/NativeControls.tsx`                                                                              | mapped                                                                                      |
| `Toast`        | `components/overlays/Toast.jsx`        | `src/components/Toast.tsx`                                                                                          | pending-validation: current stripe-free component geometry; vendored prose conflict remains |

### Settings primitives (6)

| Entry              | Design source                                         | Native authority                                                 | Current audit status                           |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| `IconAction`       | `components/settings-primitives/IconAction.jsx`       | `src/features/settings/settings-primitives/IconAction.tsx`       | pending-validation: icon-well geometry changed |
| `PremiumBand`      | `components/settings-primitives/PremiumBand.jsx`      | `src/features/settings/settings-primitives/PremiumBand.tsx`      | pending-validation: badge geometry changed     |
| `RouteOptionRow`   | `components/settings-primitives/RouteOptionRow.jsx`   | `src/features/settings/settings-primitives/RouteOptionRow.tsx`   | mapped                                         |
| `RuntimeReadiness` | `components/settings-primitives/RuntimeReadiness.jsx` | `src/features/settings/settings-primitives/RuntimeReadiness.tsx` | mapped                                         |
| `SettingsGroup`    | `components/settings-primitives/SettingsGroup.jsx`    | `src/features/settings/settings-primitives/SettingsGroup.tsx`    | mapped                                         |
| `SettingsRow`      | `components/settings-primitives/SettingsRow.jsx`      | `src/features/settings/settings-primitives/SettingsRow.tsx`      | mapped                                         |

### Workspace (12)

| Entry                         | Design source                                          | Native authority                                                                                           | Current audit status                                     |
| ----------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `AppWordmark`                 | `components/workspace/AppWordmark.jsx`                 | `src/components/AppWordmark.tsx`                                                                           | mapped                                                   |
| `BackgroundTaskBar`           | `components/workspace/BackgroundTaskBar.jsx`           | `src/design-system/BackgroundTaskBar.tsx`                                                                  | mapped; setup-job behavior remains pending               |
| `Composer`                    | `components/workspace/Composer.jsx`                    | `src/screens/main/voiceTextInputPager/InputSurfacePages.tsx`; pager ownership in `VoiceTextInputPager.tsx` | pending-validation: current input-surface styles changed |
| `ConversationSettingsSummary` | `components/workspace/ConversationSettingsSummary.jsx` | `src/design-system/ConversationSettingsSummary.tsx`                                                        | mapped                                                   |
| `IntroBanner`                 | `components/workspace/IntroBanner.jsx`                 | `src/components/IntroBanner.tsx`                                                                           | pending-validation: play-well geometry changed           |
| `OrbSatellite`                | `components/workspace/OrbSatellite.jsx`                | `src/design-system/OrbSatellite.tsx`; phase composition in `src/screens/main/MainScreenWorkspace.tsx`      | mapped; gentle transition unresolved                     |
| `Picker`                      | `components/workspace/Picker.jsx`                      | `src/components/Picker.tsx`                                                                                | mapped                                                   |
| `PremiumUpgradeModal`         | `components/workspace/PremiumUpgradeModal.jsx`         | `src/components/PremiumUpgradeModal.tsx`                                                                   | mapped                                                   |
| `RouteByline`                 | `components/workspace/RouteByline.jsx`                 | `src/screens/main/MainScreenRouteByline.tsx`                                                               | mapped; native name differs                              |
| `RoutePicker`                 | `components/workspace/RoutePicker.jsx`                 | `src/screens/main/RoutePickerSheet.tsx`                                                                    | mapped; ordering is blocked-owner                        |
| `TranscriptHandle`            | `components/workspace/TranscriptHandle.jsx`            | `src/design-system/TranscriptHandle.tsx`                                                                   | mapped                                                   |
| `VoiceOrb`                    | `components/workspace/VoiceOrb.jsx`                    | `src/design-system/VoiceOrb.tsx`; state/progress in `src/screens/main/useOrbTurnProgress.ts`               | pending-validation: anatomy and live clocks changed      |

## Surface and state inventory

| Surface                    | States that require fresh evidence                                                                                                                                                                                             | Current disposition                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Workspace                  | free/premium, usable/blocked route, portrait/landscape, intro banner, text/voice pages, idle and all seven active orb phases, ring boundaries/overtime, compose/transport/Drive satellites, transcript handle, background task | pending-validation; satellite transition unresolved; transport availability contract needs owner reconciliation |
| Introduction               | first run/re-entry; welcome before/during/after playback and language switch; setup offer/scanning/proposal/installing/done/failed/manual; try idle/recording/running/success/replay/abort; step gates                         | pending-validation; copy, recordings, and stored-session timing blocked-owner                                   |
| Chat, transcript, drawer   | empty/search, pinned/earlier/archived, fork/root, anchored actions/rename/delete, folded/open/latest rows, images, metadata cards, branch tags, reply failure and pipeline warnings/actions                                    | pending-validation; unread marker blocked-owner                                                                 |
| Settings                   | free/premium overview, all seven pages, ready/unready/error routes, pickers, lifecycle actions, validation, backup/import, diagnostics, modal keyboard/orientation/accessibility                                               | mapped; requires complete fresh native matrix                                                                   |
| On-device setup            | offer, scanning, proposal, installing, done, failed; cancel, retry, resume, honest ineligibility, persistent task bar, real device facts and benchmarks                                                                        | pending-validation; partial-fit and metered-retry policies blocked-owner                                        |
| Overlays and announcements | modal/sheet focus and dismissal, anchored menu placement/click-away, toast info/success/danger/retry/replace/suspend/dismiss, no duplicate turn-level announcement                                                             | pending-validation; vendored Toast prose needs upstream correction                                              |

## Retired and non-contract names

The following names are absent from the 63-entry manifest. The retired source
names also have no current reference under `src/`, `app/`, or `__tests__/`.

| Name(s)                                                                        | Current disposition                                                                             |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `ResponseModeToggle`, `PhaseAwareVoiceAction`                                  | retired; route byline and orb/satellites own their former jobs                                  |
| `WorkspaceStatusLine`, `DriveSessionControls`                                  | retired; transcript handle and phase-owned satellites own their former jobs; no drawn countdown |
| `ConversationActionSheet`                                                      | retired; `AnchoredMenu` maps to native `ConversationActionMenu`                                 |
| `ConversationIntegrityModal`, `ConversationMemoryModal`                        | retired/parked; no current drawer or manifest contract                                          |
| `IntroVoicePicker`                                                             | retired; the three-step flow owns its inline language picker                                    |
| `IntroButton`, `IntroDivider`, `IntroPanel`, `IntroPanelDivider`, `IntroPoint` | retired and removed from the current native primitive file                                      |
| historical `Ant*` component names                                              | not design contracts; retained native prefixes, where present, exist only for import stability  |
| `brandFonts`                                                                   | manifest metadata, not one of the 63 component/export entries                                   |

## Historical exact-SHA evidence

| Exact SHA                                  | Historical evidence retained                                                                                              | Limitation                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `01cbb99695a0b20d613f80dea82403df0f467067` | Recorded clean detached `make fresh-checkout`: 193 suites and 1,783 tests passed, one suite/test skipped, coverage green. | Gate evidence for that SHA only; predates the current design import and worktree. |
| `363a71d3cb6c30093c5297c266b282b647562d30` | Recorded freshly rebuilt iOS Release targeted eight-scene accessibility-large pass after the workspace layout fix.        | Targeted iOS evidence for that SHA only; not a current full matrix.               |

The former 1,429-image and physical-device narratives are not carried forward
as acceptance because the inspected artifact manifests do not identify their
source SHA. They may remain useful historical artifacts, but they cannot prove
this checkout.

## Evidence still required for a current verdict

1. Reproduce the green spend-free gate from a clean detached checkout; the
   scoped implementation commit and manifest hash are already frozen above.
2. Rebuild Android and iOS Release apps from that SHA and run applicable native
   instrumentation/tests.
3. Capture the complete surface/state inventory across appearances,
   orientations, all locales including RTL, increased contrast, large text,
   TalkBack, and VoiceOver; manually review every image.
4. Run physical Android and iPhone microphone, local STT/LLM/TTS, playback and
   paragraph seek, automatic-setup lifecycle, background, and cold-start flows.
5. Record unavailable devices and all unresolved owner decisions as blockers;
   issue only evidence-scoped `accepted@<sha>` verdicts.
