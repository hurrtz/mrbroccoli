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
The on-device model catalogue remains available as a direct setup target while
model acquisition and selection are also presented in the stage that uses each
model.

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
  `VoicePickerSheet`, `IconAction`, and `PremiumBand`.
- `settings-core/` owns reusable non-visual normalization, readiness,
  validation, voice-preview, local-model lifecycle, and controller behavior.

## Edition Boundary

Free and Premium users see the same seven-page overview. Connections, Search,
Listening, and Speaking keep the same route structure in both editions: Free
sees cloud provider routes as locked ghost rows followed by one Premium band,
while still retaining usable local or disabled choices. The pages listed by
`PREMIUM_SETTINGS_PAGES` still render an upgrade explanation for Free instead
of exposing their controls. Data & privacy, App & diagnostics, and the direct
on-device catalogue remain available to both editions.

**Decision:** Edition checks live in page routing or within a route group;
overview visibility is never an authorization boundary.

Callers may name a landing page directly, which is how setup reaches the
on-device catalogue the overview does not name. The landing page is recomputed
each time the modal opens and a Free caller naming a page-level Premium target
lands on the overview, so a deep link can never become a way past the edition
boundary. A closed modal clears its focus target: the next plain open would
otherwise inherit wherever the last deep link went.

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
- Thinking: response modes, provider/local route, model, and supported effort.
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
- On-device: device assessment, curated artifacts, download/test/removal, Free
  profile choices, and advanced viable overrides. Its Local responses, local
  speech recognition, and local voices catalogues are collapsed by default so
  the device assessment and chosen languages stay legible; starting a download
  expands the owning catalogue to keep progress and recovery visible.
- Search: a Nobody route plus search-provider routes, with result count, depth,
  and provider-specific search mode shown only for the active route. Nobody
  remains usable in both editions; Free keeps provider routes visibly locked.
- Data & privacy: knowledge privacy, backup/restore, and Premium archives.
- App & diagnostics: appearance, intro banner visibility, debug capture access,
  runtime overrides, release information, and isolated entitlement simulation.

## Interaction Rules

- Picker sheets remain above their parent modal.
- Speaking always retains one active speech route. The retired spoken-replies
  toggle is migrated to enabled, while the runtime continues to honor only
  explicitly persisted fallback policies and never invents a hidden fallback.
- Single- and multi-choice rows open bottom sheets, retain native radio or
  checkbox semantics, isolate screen-reader focus, and keep a labelled close or
  Done action.
- Modal content isolates screen-reader focus and always provides a labelled
  close action.
- Dynamic validation, download, and preview state is announced only on
  meaningful changes.
- Text inputs preserve keyboard-safe layout and should not cause page headers
  or primary actions to disappear.
- Every page uses semantic colors, centralized typography, and shared icon
  tokens.
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
