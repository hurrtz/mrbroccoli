---
status: active
code_paths:
  - app/**
dependencies:
  - Expo Router
  - src/context/
  - src/screens/
validations:
  - npm run typecheck:app
  - npm run config:verify
provenance:
  intent: history-backfilled
  validation: source-backed
last_validated_sha: 7db5c94
---

# App Entry Specification

## Ownership

`app/` owns route registration and root provider composition. It does not own
conversation behavior, persistence, provider routing, or presentation policy.

## Routes

- `_layout.tsx` initializes diagnostics, gesture handling, shared settings,
  localization, theme, typography, and the router stack.
- `index.tsx` is the production entry and renders `MainScreen`.
- `store-promos.tsx` is the isolated deterministic screenshot entry used only
  by the exact Maestro application identity for its platform:
  `com.tobiaswinkler.app.mrbroccoli.maestro` on iOS and
  `com.tobiaswinkler.app.android.mrbroccoli.maestro` on Android.

**Decision:** Expo Router is the only JavaScript entry mechanism. Historical
template `App.tsx` and bare `index.ts` stubs remain absent so there is one
unambiguous composition path.

## Provider Order

Settings must load before localization and theme can consume them. Localization
wraps the screen tree so the selected language is available before feature
controllers are created.

## Store-Promo Isolation

The promo route may select a locale, deterministic scene, and bounded voice-orb
phase/progress values, but fixture state must remain inaccessible to the
production package and `.dev` package. Runtime identity verification in the
fixture/presentation services is the authority; the existence of a route alone
must never enable fixtures. Every orb fraction is validated within zero and one
before it can replace the live presentation clock.

The route owns one `conversation` scene. It seeds the requested locale,
provider response modes, branched conversation fixtures, and deterministic
presentation state without reading credentials or calling a provider. The
scene accepts only an explicit light or dark fixture theme; the device chrome
is set to the same scheme by the capture runner. Its campaign phase may be idle
so Maestro can open the real transcript, Council, and conversation-settings
surfaces without synthesizing a turn.

Evidence:

- [`app/_layout.tsx`](./_layout.tsx)
- [`app/index.tsx`](./index.tsx)
- [`app/store-promos.tsx`](./store-promos.tsx)
- [`../__tests__/services/storePromoFixtures.test.ts`](../__tests__/services/storePromoFixtures.test.ts)
- [`../scripts/verify-native-config-sync.mjs`](../scripts/verify-native-config-sync.mjs)
