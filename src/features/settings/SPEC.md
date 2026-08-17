---
status: active
code_paths:
  - src/features/settings/**
  - src/features/settings-core/**
dependencies:
  - src/hooks/settings/
  - src/context/
  - src/constants/providers/
validations:
  - npm test -- --runInBand --watchman=false __tests__/components/settingsReadiness.test.ts __tests__/components/settingsRules.test.ts __tests__/components/settings/providerSupport.test.ts
  - npm run typecheck:app
provenance:
  intent: history-backfilled
  validation: test-backed
last_validated_sha: 7db5c94
---

# Settings Feature Specification

## Purpose

Settings exposes deep control without placing provider machinery on the main
conversation surface. Its overview has seven primary pages: Connections,
Thinking, Search, Listening, Speaking, Data & privacy, and App & diagnostics.
There is no standalone device page. Optional on-device speech acquisition and
selection belong to Listening and Speaking, languages belong to Listening, and
model cleanup belongs to Data & privacy.

The historical `Ant` filename prefix remains for import stability. The app does
not depend on Ant Design; controls are React Native-owned and come from the
shared design system and settings primitives.

## Structure

- `AntSettingsModal.tsx` owns modal lifecycle and page navigation.
- `AntSettingsFrame.tsx` owns the accessible frame, title, back/close actions,
  keyboard behavior, and focus containment.
- `AntSettingsPageContent.tsx` routes pages and owns
  the modal-scoped local-model controller.
- `AntSettingsOverview.tsx` groups the seven primary pages into Conversation,
  Voice, and Privacy & app, with a live summary on every row.
- `pages/` owns one drill-in product area per file.
- `settings-primitives/` owns cards, fields, picker controls, and the compact
  inset-row vocabulary used by the approved native Settings design:
  `SettingsGroup`, `SettingsRow`, `SettingsChoiceRow`,
  `SettingsMultiChoiceRow`, `RouteOptionRow`, `LocalModelRouteGroup`,
  `VoicePickerSheet`, `SettingsSheet`,
  `SettingsPillAction`, and `IconAction`.
- `settings-core/` owns reusable non-visual normalization, readiness,
  validation, voice-preview, local-model lifecycle, and controller behavior.

## Adaptive Presentation

Phones and compact iPad windows use the existing full-window overview followed
by a pushed detail page. Regular iPad remains a full-window replacement but
uses a 300pt persistent category rail and one detail pane. The rail reuses the
overview's exact seven pages, icons, and Conversation / Voice / Privacy & app
groups, marks one row selected, and has no chevrons or back action because
nothing is pushed. A plain regular open selects Connections; a deep link
selects its requested page directly. The detail body remains capped at 760pt.

Resizing preserves the selected detail. Entering regular width from the compact
overview selects Connections; returning to compact keeps the current detail
and restores its normal back-to-overview control. RTL places the rail on the
leading right edge and mirrors each row's leading/trailing arrangement without
changing page ownership.

On iOS, compact detail pages also expose the native leading-edge back gesture:
swiping inward from the left in LTR or the right in RTL returns to the Settings
overview. The gesture is deliberately edge-bound and horizontally dominant so
vertical Settings scrolling and controls away from that edge keep ownership of
their touches. Android keeps its system-back behavior and regular iPad keeps
the persistent category rail instead of a back gesture.

## Product Boundary

All seven pages belong to the paid app. There is no edition gate, upsell row,
purchase surface, or entitlement-dependent route. Provider features are ready
only when their own credentials and capability checks are ready.

Callers may name any of the seven landing pages directly. The target is
recomputed each time the modal opens, and a closed modal clears it so the next
plain open cannot inherit the preceding deep link.

## Readiness and Validation

Settings readiness is capability-specific. One provider key may validly support
speech while lacking voice-directory permission or a working LLM route.

The overview surfaces derived readiness as `RuntimeReadiness`: the four
capabilities (think, listen, speak, search) on one quiet line, each a 44pt
target opening the page that configures it. It is deliberately not a stepper —
the four are independent, so there are no connectors, no card, and no heading.
Colour lives in the dot (ready fills green, broken fills red, attention draws a
hollow gold ring, off a hollow muted ring); the label stays in body ink and the
accessible name carries the state word, so the states separate without colour.

- Connection health is tracked independently for LLM, STT, TTS, search, and
  voice discovery.
- Picker options derive from the runtime manifest and device runtime overrides.
- Invalid or unavailable selections are normalized before they reach the main
  screen.
- Voice preview has explicit idle, generating, and playing phases and must stop
  when the modal or relevant page closes.
- Restricted ElevenLabs keys retain a premade voice fallback even when account
  voice listing is forbidden.

**Decision:** A successful generic provider check does not make every provider
capability healthy. The UI shows the capability that was actually tested.

## Page Ownership

- Connections: one manifest-ordered provider list with capability and health
  summaries. Each provider opens credentials, provider information, and
  capability-specific connection tests in a modal sheet. Its footer states the security boundary:
  keys remain in the device keychain and are sent only to their own provider.
- Thinking: the `Answering models` group owns an open-ended ordered list of
  numbered coexisting answering-model slots. Each opens a focused sheet for provider route,
  exact model, and that model's effort ladder. Its Conversation defaults group
  owns the length and tone inherited by sessions without overrides. Local
  acquisition, benchmark, selection, and swipe-removal happen in the model
  chooser; Model Council and the system prompt live in quiet sheets. Local
  response models are not offered.
- Listening: the persisted manual input mode (`push-to-talk` or
  `toggle-to-talk`), conversation languages, and one `Who listens`
  system, local, or provider recognition route group. Downloaded local models
  cannot be selected until a successful device benchmark marks them viable.
  Hands free is deliberately not a third persisted input mode: it is the
  session-scoped home-screen loop layered over either manual capture mode.
- **Decision:** a below-target but functional speech benchmark remains
  selectable in Listening and Speaking, and the row's detail line keeps the
  performance warning visible. A failed benchmark remains locked. This keeps
  optional local speech under the user's control without presenting a broken
  route as usable. `isLocalModelViable` encodes the rule once for both route
  groups.
- Speaking: playback timing and provider-supported delivery instructions,
  followed by one native/local/provider route group. A selected route exposes
  its model and voice as inset subrows; voice selection opens one searchable,
  focus-isolated sheet whose rows can preview the exact voice without first
  changing the saved selection. Download, cancel, benchmark, selection, and
  swipe-removal for local voices stay in this route group. Speech replay-cache
  removal is the only Storage action on this page.
- Search: one `Who searches` group with a Nobody route plus search-provider
  routes, with result count, depth, and provider-specific search mode shown
  only for the active route. Nobody
  remains usable without configuring a search provider.
- Data & privacy: the knowledge opt-in, archived-conversation entry point,
  portable archive management, encrypted/readable backup and restore, and a
  storage janitor that may remove or cancel local models without duplicating
  their download and selection controls.
- App & diagnostics: appearance, transcript-usage visibility, debug capture
  access, speech diagnostics, and runtime overrides.

## Interaction Rules

- Picker sheets remain above their parent modal.
- A Settings action that opens a sibling modal first dismisses every nested
  Settings sheet, then the Settings modal, and presents the destination only
  after native dismissal. Android drains both handoffs through bounded
  fallbacks because it does not deliver `Modal.onDismiss`.
- Speaking always retains one active speech route. The retired spoken-replies
  toggle is migrated to enabled, while the runtime continues to honor only
  explicitly persisted fallback policies and never invents a hidden fallback.
- Single- and multi-choice rows open bottom sheets, retain native radio or
  checkbox semantics, and isolate screen-reader focus. Every portrait Settings
  sheet mounts its completed backdrop before the card rises and uses the shared
  centred headline plus 44-point grabber target; the grabber is the labelled
  tap-and-pull close action, so no redundant close icon is shown.
- Modal content isolates screen-reader focus and always provides a labelled
  close action. Backdrop-only dismissal layers remain outside the
  accessibility tree.
- Regular-iPad Settings has no backdrop: its full-window master-detail frame is
  the isolated secondary surface and retains the same labelled close action.
- Dynamic validation, download, and preview state is announced only on
  meaningful changes.
- A local-model download, removal, or benchmark failure remains on the owning
  route row until that model action is retried. Speech replay-cache completion
  or failure remains on its Storage row. Neither outcome opens a platform
  alert that obscures the setting it describes.
- Text inputs preserve keyboard-safe layout and should not cause page headers
  or primary actions to disappear.
- Provider credential sheets release secure-field focus before any close path
  dismisses the nested modal. On iOS, a visible keyboard must finish its
  `keyboardDidHide` transition before the sheet unmounts; a bounded fallback
  completes the close if UIKit omits that event. This keeps the parent Settings
  page interactive and avoids overlapping keyboard and modal teardown.
- Every page uses semantic colors, centralized typography, and shared icon
  tokens.
- Local speech-model choices become active only after the required artifact is
  installed, verified, and functionally benchmarked on the current device.
  Below-target results remain explicit warnings; failed results block use.
  Local speech never creates a response route or alters the provider-only
  answering slots.
- Settings groups use one bordered inset surface with row dividers rather than
  nesting a separate card around every row. Route choices expose native radio
  semantics; local-model removal remains an explicit swipe action. Removing a
  selected speech model atomically returns that capability to its system route.
- Provider connection rows expose capability and aggregate health at a glance;
  credential inputs and detailed validation belong to the selected provider's
  focus-isolated sheet rather than expanding the overview list in place.

## Change Contract

Settings UI changes frequently affect `Settings`, normalization, readiness,
provider capabilities, route configuration, translations, and setup. Read the
settings persistence and provider manifest specs in addition to this file.

## Evidence

- [`AntSettingsModal.tsx`](./AntSettingsModal.tsx)
- [`AntSettingsPageContent.tsx`](./AntSettingsPageContent.tsx)
- [`../settings-core/types.ts`](../settings-core/types.ts)
- [`../settings-core/readiness.ts`](../settings-core/readiness.ts)
- [`../../../__tests__/components/settingsReadiness.test.ts`](../../../__tests__/components/settingsReadiness.test.ts)
