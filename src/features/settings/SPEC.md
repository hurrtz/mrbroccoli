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
There is no standalone device page. On-device acquisition and selection belong
to the stage that uses each model, bulk setup belongs to App & diagnostics and
the introduction, languages belong to Listening, and model cleanup belongs to
Data & privacy.

The historical `Ant` filename prefix remains for import stability. The app does
not depend on Ant Design; controls are React Native-owned and come from the
shared design system and settings primitives.

## Structure

- `AntSettingsModal.tsx` owns modal lifecycle and page navigation.
- `AntSettingsFrame.tsx` owns the accessible frame, title, back/close actions,
  keyboard behavior, and focus containment.
- `AntSettingsPageContent.tsx` routes pages, enforces edition access, and owns
  the modal-scoped local-model controller.
- `AntSettingsOverview.tsx` groups the seven primary pages into Conversation,
  Voice, and Privacy & app, with a live summary on every row.
- `pages/` owns one drill-in product area per file.
- `settings-primitives/` owns cards, fields, picker controls, and the compact
  inset-row vocabulary used by the approved native Settings design:
  `SettingsGroup`, `SettingsRow`, `SettingsChoiceRow`,
  `SettingsMultiChoiceRow`, `RouteOptionRow`, `LocalModelRouteGroup`,
  `VoicePickerSheet`, `SettingsSheet`, `SettingsSwitch`,
  `SettingsPillAction`, `IconAction`, and `PremiumBand`.
- `settings-core/` owns reusable non-visual normalization, readiness,
  validation, voice-preview, local-model lifecycle, and controller behavior.

## Edition Boundary

Free and Premium users see the same seven-page overview and the same structure
inside every page. Free sees cloud provider routes and Premium-only controls as
locked rows followed by a Premium band, while system and on-device routes stay
fully usable. Premium unlocks those controls in place.

**Decision:** Edition checks live in page routing or within a route group;
overview visibility is never an authorization boundary.

Callers may name any of the seven landing pages directly. The target is
recomputed each time the modal opens, and a closed modal clears it so the next
plain open cannot inherit the preceding deep link.

## Readiness and Validation

Settings readiness is capability-specific. One provider key may validly support
speech while lacking voice-directory permission or a working LLM route.

The Premium overview surfaces derived readiness as `RuntimeReadiness`: the four
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
  summaries. Premium opens credentials, provider information, and
  capability-specific connection tests in a modal sheet; Free keeps every
  provider visible as a locked route.
- Thinking: up to four numbered coexisting answering-model slots. Each opens a
  focused sheet for provider/local route, exact model, and that model's effort
  ladder. Local acquisition, benchmark, selection, and swipe-removal happen in
  the model chooser; Model Council and the system prompt live in quiet sheets.
- Listening: input mode, conversation languages, and a unified system, local,
  or provider recognition route group. Downloaded local models cannot be
  selected until a successful device benchmark marks them viable.
- Speaking: playback timing and provider-supported delivery instructions,
  followed by one native/local/provider route group. A selected route exposes
  its model and voice as inset subrows; voice selection opens one searchable,
  focus-isolated sheet whose rows can preview the exact voice without first
  changing the saved selection. Download, cancel, benchmark, selection, and
  swipe-removal for local voices stay in this route group. Speech replay-cache
  removal is the only Storage action on this page.
- Search: a Nobody route plus search-provider routes, with result count, depth,
  and provider-specific search mode shown only for the active route. Nobody
  remains usable in both editions; Free keeps provider routes visibly locked.
- Data & privacy: the knowledge opt-in, archived-conversation entry point,
  portable archive management, encrypted/readable backup and restore, and a
  storage janitor that may remove or cancel local models without duplicating
  their download and selection controls.
- App & diagnostics: the shared automatic-setup job, appearance, intro and
  transcript-usage visibility, debug capture access, speech diagnostics,
  runtime overrides, and isolated entitlement simulation.

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
  checkbox semantics, isolate screen-reader focus, and keep a labelled close or
  Done action.
- Modal content isolates screen-reader focus and always provides a labelled
  close action. Backdrop-only dismissal layers remain outside the
  accessibility tree.
- Dynamic validation, download, and preview state is announced only on
  meaningful changes.
- A local-model download, removal, or benchmark failure remains on the owning
  route row until that model action is retried. Speech replay-cache completion
  or failure remains on its Storage row. Neither outcome opens a platform
  alert that obscures the setting it describes.
- Text inputs preserve keyboard-safe layout and should not cause page headers
  or primary actions to disappear.
- Provider credential sheets release secure-field focus before any close path
  dismisses the nested modal, so the parent Settings page remains interactive
  while the keyboard is visible.
- Every page uses semantic colors, centralized typography, and shared icon
  tokens.
- Free local-model changes are applied as one ready profile. A stage may record
  a pending preference while a required artifact is absent or untested, but it
  must not display or persist that choice as the active Free runtime until the
  complete LLM/STT/TTS profile is installed and viable. Hosted slots survive
  Free mode for entitlement restoration, within the same four-slot limit.
- Settings groups use one bordered inset surface with row dividers rather than
  nesting a separate card around every row. Route choices expose native radio
  semantics; local-model removal remains an explicit swipe action. Removing a
  selected speech model atomically returns that capability to its system route.
- Provider connection rows expose capability and aggregate health at a glance;
  credential inputs and detailed validation belong to the selected provider's
  focus-isolated sheet rather than expanding the overview list in place.
- `PremiumBand` is the one deliberately decorative Settings primitive. Its
  gradients and sheen use theme tokens, its upgrade action remains at least 44
  points, and Reduce Motion disables the recurring sheen animation.

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
