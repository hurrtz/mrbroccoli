---
status: active
code_paths:
  - src/context/**
dependencies:
  - src/hooks/settings/
  - expo-iap
  - expo-secure-store
validations:
  - npm test -- --runInBand --watchman=false __tests__/components/PremiumEntitlementContext.test.tsx __tests__/services/premiumEntitlement.test.ts
  - npm run typecheck:app
provenance:
  intent: owner-confirmed and history-backfilled
  validation: test-backed
last_validated_sha: 7db5c94
---

# Shared Context Specification

## Ownership

`src/context/` exposes the two pieces of root state needed throughout the app:

- `SettingsContext` owns one shared `useSettings` instance; and
- `PremiumEntitlementContext` owns store connection, product discovery,
  entitlement state, purchase, restore, and development simulation.

Context providers expose state and actions. Persistence, normalization, and
product-feature behavior remain in their owning hooks and services.

## Settings Context

`SettingsProvider` prevents independent screens or modals from creating
separate settings stores. Consumers use `useSharedSettings`, which fails when
called outside the provider rather than silently creating defaults.

**Decision:** Settings wrap localization and theme because language and theme
are themselves persisted settings. Root consumers must tolerate the initial
default snapshot until `loaded` becomes true.

## Premium Entitlement

The only owned product is
`com.tobiaswinkler.app.mrbroccoli.premium.lifetime`.

Entitlement startup proceeds in two authorities:

1. load an exact development override only when the native application ID ends
   in `.dev` or `.maestro`; otherwise
2. load the last verified SecureStore cache for immediate state, connect to the
   platform store, fetch the product, and reconcile available purchases.

An owned purchase must match the exact product ID and have purchase state
`purchased`. Pending, cancelled, unavailable, and failed states remain
distinct user outcomes.

**Decision:** Grant the local entitlement before finishing the non-consumable
transaction. If finalization fails, keep the verified entitlement and allow
the store to replay the unfinished transaction for a later retry.

**Decision:** Store reconciliation is fail-closed for ownership. When the store
successfully reports no owned product, the local cache is cleared and the app
returns to Free. A temporary store connection failure does not independently
prove that a previously verified purchase disappeared.

Purchase and restore actions are serialized through the context's busy and
in-flight guards. App foregrounding may refresh store state, but overlapping
reconciliation must not run.

## Development Isolation

The Free/Premium selector is a test facility, not a store substitute.

- It is available only to the exact `.dev` and `.maestro` identities returned
  by native diagnostics.
- Store purchase events are ignored while an override is active.
- The override is persisted separately from real store ownership.
- Production identity must never interpret a stored development value.

## Evidence

- [`SettingsContext.tsx`](./SettingsContext.tsx)
- [`PremiumEntitlementContext.tsx`](./PremiumEntitlementContext.tsx)
- [`../services/premiumEntitlement.ts`](../services/premiumEntitlement.ts)
- [`../services/developmentEntitlement.ts`](../services/developmentEntitlement.ts)
- [`../../__tests__/components/PremiumEntitlementContext.test.tsx`](../../__tests__/components/PremiumEntitlementContext.test.tsx)
- [`../../__tests__/services/premiumEntitlement.test.ts`](../../__tests__/services/premiumEntitlement.test.ts)
