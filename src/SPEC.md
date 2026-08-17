---
status: active
code_paths:
  - src/**
dependencies:
  - app/
  - android/
  - ios/
validations:
  - npm run typecheck
  - npm run static:verify
  - npm run test:coverage -- --runInBand --watchman=false
provenance:
  intent: history-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Source Tree Specification

## Purpose

`src/` contains product behavior shared by iOS and Android. The tree separates
static contracts, persistent React state, runtime services, feature surfaces,
and presentation so changes can be validated at the closest reliable layer.

## Stable Boundaries

| Boundary         | Ownership                                                                         |
| ---------------- | --------------------------------------------------------------------------------- |
| `catalog/`       | Typed access to imported provider research data                                   |
| `components/`    | Reusable product components and focused subcomponents                             |
| `constants/`     | Curated runtime manifests, defaults, model catalogues, and static policies        |
| `context/`       | Root settings React context                                                       |
| `design-system/` | Dependency-light native controls, typography, and icon semantics                  |
| `features/`      | Complete secondary surfaces, currently Settings and its shared core               |
| `hooks/`         | React lifecycle controllers plus settings/conversation persistence adapters       |
| `i18n/`          | Locale registry, typed translation schema, and all dictionaries                   |
| `screens/`       | Main workspace composition and presentation                                       |
| `services/`      | Provider, local-model, speech, backup, diagnostic, and native-bridge runtime work |
| `theme/`         | Semantic color and theme context                                                  |
| `types.ts`       | Canonical public settings, conversation, message, route, receipt, and phase types |
| `utils/`         | Pure cross-boundary transformations with a clear existing owner                   |

## Dependency Direction

- Screens and features may compose hooks, services, constants, and shared
  controls.
- Hooks may coordinate service calls and persistence but should not own large
  provider request implementations.
- Services must not depend on screen components.
- Provider/model availability is derived from the runtime manifest, not copied
  into feature-local lists.
- Persisted public shape is declared in `types.ts` and normalized by the owning
  settings or conversation hook before feature code consumes it.
- Native access is wrapped by TypeScript services so UI code does not reach
  directly into `NativeModules`.

**Decision:** `MainScreen` remains the product composition root, not the home
for implementation detail. Focused controllers under `screens/main/`, hooks,
and services exist so recording, requests, persistence, setup, and playback can
be reasoned about and tested independently of the full render tree.

## Cross-Cutting Change Rules

- Changing `Settings` requires defaults, normalization/migration, persistence,
  affected UI, runtime consumers, backups, and tests to remain aligned.
- Changing provider capabilities requires the runtime manifest, public helpers,
  response-mode validation, settings readiness, request services, and release
  matrix to remain aligned.
- Changing `Conversation` or `Message` requires metadata normalization,
  backup/restore validation, archive formatting, knowledge indexing, and tests
  to be reviewed.
- User-visible copy changes require all registered dictionaries.
- Any privacy-sensitive payload must cross its sanitizer or allow-list before
  storage, logs, clipboard, provider requests, or export.
- Platform-specific behavior belongs behind a service boundary and must be
  validated against both native projects.
- Resize-sensitive presentation policy belongs in a pure shared resolver under
  `utils/`; screens consume that result instead of inventing independent iPad
  breakpoints or copying runtime state into form-factor-specific trees.

## Deep Specs

Use [`../DOCS_INDEX.md`](../DOCS_INDEX.md) to select the nearest documented
boundary. Child specs refine this file and must not duplicate the whole source
map.
