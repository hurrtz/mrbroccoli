---
status: active
code_paths:
  - src/context/**
dependencies:
  - src/hooks/settings/
validations:
  - npm run typecheck:app
  - npm test -- --runInBand --watchman=false __tests__/hooks/useSettings.test.ts
provenance:
  intent: owner-confirmed
  validation: source-and-test-backed
last_validated_sha: e03c931a
---

# Shared Context Specification

## Ownership

`src/context/` exposes the shared `SettingsContext` and localization context
needed throughout the app. There is no runtime product, purchase, or edition
context: Apple and Google sell the complete app before launch.

`SettingsProvider` owns one shared `useSettings` instance. Consumers use
`useSharedSettings`, which fails outside the provider rather than silently
creating independent defaults.

**Decision:** Settings wrap localization and theme because language and theme
are persisted settings. Root consumers tolerate the initial default snapshot
until `loaded` becomes true.

## Evidence

- [`SettingsContext.tsx`](./SettingsContext.tsx)
- [`LocalizationContext.tsx`](./LocalizationContext.tsx)
- [`../hooks/useSettings.ts`](../hooks/useSettings.ts)
- [`../../__tests__/hooks/useSettings.test.ts`](../../__tests__/hooks/useSettings.test.ts)
