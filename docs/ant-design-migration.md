# Ant Design Native migration

This document is the parity checklist and exception register for replacing the
legacy hand-built UI with `@ant-design/react-native`.

## Strategy

1. The replacement lives in `src/features/settings/`; reusable behavior
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
  cards, section headings, card headings, confirmations, and Ant component
  text.
- Unica One is reserved for the Mr Broccoli wordmark and the major Settings
  page title in the modal header. Everything below that header uses Outfit.
- Monospace remains intentional for compact technical metadata.

## Settings parity checklist

### Shell and overview

- [x] Portrait full-screen and landscape contained modal layouts
- [x] Back, close, backdrop dismissal, keyboard avoidance, and scroll reset
- [x] Focus routing for provider, catalog provider, and legacy tab links
- [x] Guided setup shortcut
- [x] Horizontal Think, Listen, Speak, and Search readiness progression
- [x] Individually carded Connections, Thinking, Listening, Speaking, Search,
      and App navigation
- [x] Validation feedback rendered above the modal surface

### Connections

- [x] Alphabetical provider list
- [x] Horizontally scrolling capability filters for LLM, TTS, STT, Search, and
      Voices
- [x] Segmented provider cards with directional disclosure icons and
      focus-provider auto-expansion
- [x] Provider logo/name headers, expandable configuration bodies, and
      content-sized capability-tag footers that wrap naturally when needed
- [x] Header-level credential and provider-info actions followed by the
      disclosure control
- [x] API key and API test body sections with full-row individual test actions
      and Test all aligned to the right of the API test heading
- [x] Qwen region selector grouped directly with its API key, without redundant
      region headings or field labels
- [x] Borderless picker and validation rows inside provider-card bodies, while
      preserving the card-level header, body, and footer boundaries
- [x] Selectable picker rows rendered as input-like controls with a clear
      border, rounded corners, and form-field padding; single-option static
      values remain unboxed
- [x] Consistent provider-body typography with 16-point section headings,
      15-point copy and controls, plus 12-point caption styling for imprint
      guidance and capability states
- [x] Static, non-interactive capability badges in provider-card footers
- [x] Full-screen, scrollable provider-detail modals launched from the card
      header
- [x] Green compact cards with collapsed capability footers when every
      capability test is healthy
- [x] Successful LLM validation retained across model selection changes while
      failures remain scoped to the model that failed
- [x] Secure key editing, visibility, clearing, and persistence
- [x] Provider and per-capability health states
- [x] Per-capability and validate-all actions
- [x] OpenRouter onboarding explanation
- [x] Capability-specific models, regions, project IDs, and voice settings
- [x] Account voice refresh, manual voice entry, and restricted-key behavior

### Thinking

- [x] Add and remove up to ten model routes
- [x] Provider, model, and effort selection with route normalization
- [x] Disabled-provider repair behavior
- [x] Individually carded model routes with icon-only header delete actions
- [x] Model-selection guidance in an info modal
- [x] Always-visible full-width system prompt and multiline editing
- [x] System-prompt guidance in an info modal
- [x] Shared, scrollable information modal behavior with standard icon-button
      affordances

### Listening

- [x] Push-to-talk, toggle-to-talk, and drive-session selection
- [x] System versus provider STT selection
- [x] Provider and model selection
- [x] Language coverage and recording-limit notes

### Speaking

- [x] Spoken replies switch
- [x] Platform-native spoken-replies switch
- [x] Compact multi-select for English, German, and Simplified Chinese
      listening languages
- [x] Streaming versus full-reply playback
- [x] Native, Kokoro, and provider TTS selection
- [x] Explicit ordered fallback policy with add, remove, and reorder behavior
- [x] Provider model and instruction editing
- [x] Provider, native, and Kokoro voice selection and preview controls
- [x] Dynamic voice-directory refresh and manual fallback entry
- [x] Kokoro download, progress, delete, voice selection, and preview behavior
- [x] Global provider voice defaults plus compact per-language override cards

### Search

- [x] Search-provider selection
- [x] Static rendering when only one provider or control value is available
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
- [x] Explicit pressed feedback for visible Settings and response-route
      `Pressable` controls

## Intentional exceptions

| Current surface                            | Ant equivalent evaluated      | Why it stays bespoke                                                                                                                                                                                                           | Manual follow-up                                                                                   |
| ------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `AntSettingsModal` responsive shell        | `Modal`                       | Settings must be full-screen in portrait and contained in landscape. An in-tree overlay also prevents Ant Picker and confirmation portals from rendering behind a native modal.                                                | Recheck safe-area and portal behavior after Ant or React Native modal upgrades.                    |
| `ResponseModeToggle`                       | `Card`, `Grid`, `Picker`      | The 1/2/3-card layouts and 4+-route selector deliberately change composition, icon scale, effort placement, and overflow behavior with the available width.                                                                    | Keep screenshot coverage for route-count and orientation variants.                                 |
| `VoiceTextInputPager`                      | `Input`, `Button`, `Carousel` | Voice and text are two full-width faces of one swipeable control with gesture arbitration, keyboard focus, hold/toggle recording, and page indicators.                                                                         | Re-evaluate only if Ant adds a gesture-aware compound input.                                       |
| `PhaseAwareVoiceAction`                    | `Button`, `Progress`          | The primary CTA is a seven-phase recording/processing/playback surface with drive-session controls and custom motion, not a standard button.                                                                                   | Preserve phase-transition and accessibility tests.                                                 |
| `ChatTranscript` and chat bubbles          | `List`, `Result`              | Streaming messages, selection actions, replay, provenance, usage metadata, and incremental scrolling need transcript-specific virtualization and layout.                                                                       | Consider Ant only for isolated actions added inside a bubble.                                      |
| `ConversationDrawer`                       | `Drawer`, `List`, `SearchBar` | Conversation search, pinning, deletion, memory, responsive width, and keyboard behavior form a purpose-built navigation workspace.                                                                                             | Migrate isolated buttons and inputs when touched; do not flatten the workflow into a generic list. |
| `SetupGuideModal`                          | `Modal`, `Steps`              | The setup guide actively records speech and validates native, Kokoro, and provider routes; it is a test wizard rather than a passive step list.                                                                                | Revisit its shell after the core setup flow next changes.                                          |
| `StyleSheetModal` and `StatusDetailsModal` | `Modal`, `Drawer`             | Both use responsive sheet/card geometry tied to the current conversation. Their standard launch and close controls now use shared Ant buttons.                                                                                 | Migrate individual standard fields and actions when these surfaces are next redesigned.            |
| `Toast`                                    | `Toast`                       | The app toast supports tone-specific visuals, an optional retry action, explicit dismissal, screen-reader announcements, and in-tree placement above the active workflow. Ant's static Toast API does not cover that contract. | Keep it local; use Ant confirmations for ordinary destructive prompts.                             |

## Verification

- `npm test -- --runInBand`: 112 suites and 860 tests
  passed
- `npm run config:verify`: native configuration matched `app.json` across 19 checks
- `npx expo-doctor`: 18/18 checks passed
- `npm run typecheck`: passed
- Production Android export completed with Outfit 400/500/600/700 and Unica
  One 400 assets
- Android debug APK assembled successfully
- Clean iOS Release simulator build completed with 0 errors; the generated
  app installed, launched, and passed portrait Settings and accessibility
  inspection
- Android emulator interaction checks covered Settings navigation, pickers,
  confirmations, light/dark themes, English/German, portrait/landscape, the
  home controls, and the final font-metric layout
- The Settings entry point, responsive frame, page routing, and individual
  pages are separate components; home response-route layouts, voice/text
  input faces, conversation settings, and voice-session controllers are also
  split by responsibility.
