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
conversation surface. It covers connections, response routes, listening,
speaking, on-device models, search, data/privacy, and app diagnostics.

The historical `Ant` filename prefix remains for import stability. The app does
not depend on Ant Design; controls are React Native-owned and come from the
shared design system and settings primitives.

## Structure

- `AntSettingsModal.tsx` owns modal lifecycle and page navigation.
- `AntSettingsFrame.tsx` owns the accessible frame, title, back/close actions,
  keyboard behavior, and focus containment.
- `AntSettingsPageContent.tsx` routes pages and enforces edition access.
- `AntSettingsOverview.tsx` groups pages into Conversation, Voice & models, and
  Privacy & app.
- `pages/` owns one drill-in product area per file.
- `settings-primitives/` owns cards, fields, and picker controls.
- `settings-core/` owns reusable non-visual normalization, readiness,
  validation, voice-preview, and controller behavior.

## Edition Boundary

Free users can access On-device, Data & privacy, and App & diagnostics.
Connections, Thinking, Listening, Speaking, and Search are Premium pages.

The overview hides Premium-only rows for Free. Direct navigation to a locked
page still renders an upgrade explanation rather than exposing the underlying
controls.

**Decision:** Edition checks exist both in navigation visibility and page
routing. Hiding a row is not an authorization boundary.

Callers may name a landing page directly, which is how the introduction reaches
the on-device page the tabs do not name. The landing page is recomputed each
time the modal opens and a Free caller naming a Premium page lands on the
overview, so a deep link can never become a way past the edition boundary. A
closed modal clears its focus target: the next plain open would otherwise
inherit wherever the last deep link went.

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

- Connections: credentials, provider capability health, and connection tests.
- Thinking: response modes, provider/local route, model, and supported effort.
- Listening: native, local, or provider recognition and language.
- Speaking: spoken reply behavior, native/local/provider voice, instructions,
  previews, and explicit fallback order.
- On-device: device assessment, curated artifacts, download/test/removal, Free
  profile choices, and advanced viable overrides. Its Local responses, local
  speech recognition, and local voices catalogues are collapsed by default so
  the device assessment and chosen languages stay legible; starting a download
  expands the owning catalogue to keep progress and recovery visible.
- Search: search mode, provider, and provider-specific options.
- Data & privacy: knowledge privacy, backup/restore, and Premium archives.
- App & diagnostics: appearance, intro banner visibility, debug capture access,
  runtime overrides, release information, and isolated entitlement simulation.

## Interaction Rules

- Picker sheets remain above their parent modal.
- Modal content isolates screen-reader focus and always provides a labelled
  close action.
- Dynamic validation, download, and preview state is announced only on
  meaningful changes.
- Text inputs preserve keyboard-safe layout and should not cause page headers
  or primary actions to disappear.
- Every page uses semantic colors, centralized typography, and shared icon
  tokens.

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
