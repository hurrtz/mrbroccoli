# Ant Design Native migration

This document is the parity checklist and exception register for replacing the
legacy hand-built UI with `@ant-design/react-native`.

## Strategy

1. The replacement lives in `src/features/settings-antd/`; reusable behavior
   that is not UI-specific lives in `src/features/settings-core/`.
2. Settings was reimplemented as a clean surface rather than progressively
   restyling the old component tree.
3. The replacement is wired into the app and the legacy Settings UI has been
   deleted.
4. The shared Ant provider, theme, typography, and primitives also serve the
   app shell and the obvious home-screen controls.
5. Functional parity is covered by focused tests and Android interaction
   checks; bespoke surfaces are registered below instead of being disguised as
   partial Ant migrations.

## Typography

- Outfit is the default family for body copy, control labels, inputs, model
  cards, and Ant component text.
- Unica One is reserved for the Mr Broccoli wordmark, Settings page titles,
  section headings, and confirmation headings.
- Monospace remains intentional for compact technical metadata.

## Settings parity checklist

### Shell and overview

- [x] Portrait full-screen and landscape contained modal layouts
- [x] Back, close, backdrop dismissal, keyboard avoidance, and scroll reset
- [x] Focus routing for provider, catalog provider, and legacy tab links
- [x] Guided setup shortcut
- [x] Think, Listen, Speak, and Search readiness indicators
- [x] Connections, Thinking, Listening, Speaking, Search, and App navigation
- [x] Validation feedback rendered above the modal surface

### Connections

- [x] Alphabetical provider list
- [x] Capability filters for LLM, TTS, STT, Search, and Voices
- [x] Provider expansion and focus-provider auto-expansion
- [x] Secure key editing, visibility, clearing, and persistence
- [x] Provider and per-capability health states
- [x] Per-capability and validate-all actions
- [x] OpenRouter onboarding explanation
- [x] Capability-specific models, regions, project IDs, and voice settings
- [x] Account voice refresh, manual voice entry, and restricted-key behavior

### Thinking

- [x] Add and remove up to ten response routes
- [x] Provider, model, and effort selection with route normalization
- [x] Disabled-provider repair behavior
- [x] Collapsible system prompt and multiline editing

### Listening

- [x] Push-to-talk, toggle-to-talk, and drive-session selection
- [x] System versus provider STT selection
- [x] Provider and model selection
- [x] Language coverage and recording-limit notes

### Speaking

- [x] Spoken replies switch
- [x] English, German, and Simplified Chinese listening-language selection
- [x] Streaming versus full-reply playback
- [x] Native, Kokoro, and provider TTS selection
- [x] Explicit ordered fallback policy with add, remove, and reorder behavior
- [x] Provider model and instruction editing
- [x] Provider, native, and Kokoro voice selection and preview controls
- [x] Dynamic voice-directory refresh and manual fallback entry
- [x] Kokoro download, progress, delete, voice selection, and preview behavior

### Search

- [x] Search-provider selection
- [x] Missing-provider state
- [x] Provider-specific result count, depth, and search-mode controls

### App and diagnostics

- [x] Light, dark, and system themes
- [x] English and German app language
- [x] Usage-statistics visibility
- [x] Debug-log-button visibility and explanation
- [x] Speech diagnostics list and destructive clear confirmation

## Home-screen candidates

- [x] Standard icon buttons and modal-header close controls
- [x] Settings and conversation-settings launch controls
- [x] Web Search switch
- [x] Standard text fields and supporting actions evaluated
- [x] Toast, confirmation, and generic status surfaces evaluated

## Intentional exceptions

| Current surface | Ant equivalent evaluated | Why it stays bespoke | Manual follow-up |
| --- | --- | --- | --- |
| `AntSettingsModal` responsive shell | `Modal` | Settings must be full-screen in portrait and contained in landscape. An in-tree overlay also prevents Ant Picker and confirmation portals from rendering behind a native modal. | Recheck safe-area and portal behavior after Ant or React Native modal upgrades. |
| `ResponseModeToggle` | `Card`, `Grid`, `Picker` | The 1/2/3-card layouts and 4+-route selector deliberately change composition, icon scale, effort placement, and overflow behavior with the available width. | Keep screenshot coverage for route-count and orientation variants. |
| `VoiceTextInputPager` | `Input`, `Button`, `Carousel` | Voice and text are two full-width faces of one swipeable control with gesture arbitration, keyboard focus, hold/toggle recording, and page indicators. | Re-evaluate only if Ant adds a gesture-aware compound input. |
| `PhaseAwareVoiceAction` | `Button`, `Progress` | The primary CTA is a seven-phase recording/processing/playback surface with drive-session controls and custom motion, not a standard button. | Preserve phase-transition and accessibility tests. |
| `ChatTranscript` and chat bubbles | `List`, `Result` | Streaming messages, selection actions, replay, provenance, usage metadata, and incremental scrolling need transcript-specific virtualization and layout. | Consider Ant only for isolated actions added inside a bubble. |
| `ConversationDrawer` | `Drawer`, `List`, `SearchBar` | Conversation search, pinning, deletion, memory, responsive width, and keyboard behavior form a purpose-built navigation workspace. | Migrate isolated buttons and inputs when touched; do not flatten the workflow into a generic list. |
| `SetupGuideModal` | `Modal`, `Steps` | The setup guide actively records speech and validates native, Kokoro, and provider routes; it is a test wizard rather than a passive step list. | Revisit its shell after the core setup flow next changes. |
| `StyleSheetModal` and `StatusDetailsModal` | `Modal`, `Drawer` | Both use responsive sheet/card geometry tied to the current conversation. Their standard launch and close controls now use shared Ant buttons. | Migrate individual standard fields and actions when these surfaces are next redesigned. |
| `Toast` | `Toast` | The app toast supports tone-specific visuals, an optional retry action, explicit dismissal, screen-reader announcements, and in-tree placement above the active workflow. Ant's static Toast API does not cover that contract. | Keep it local; use Ant confirmations for ordinary destructive prompts. |

## Verification

- `npx tsc --noEmit`
- `npm test -- --runInBand`: 109 suites and 798 tests passed
- `npm run config:verify`: native configuration matched `app.json` across 19 checks
- `npx expo-doctor`: 18/18 checks passed
- Production Android export completed with Outfit 400/500/600/700 and Unica
  One 400 assets
- Android debug APK assembled successfully
- Android emulator interaction checks covered Settings navigation, pickers,
  confirmations, light/dark themes, English/German, portrait/landscape, the
  home controls, and the final font-metric layout
