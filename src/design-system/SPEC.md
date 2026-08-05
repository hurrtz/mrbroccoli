---
status: active
code_paths:
  - src/design-system/**
dependencies:
  - react-native
  - phosphor-react-native
validations:
  - npm run typecheck:app
  - npm run static:verify
provenance:
  intent: source-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Native Design-System Specification

## Purpose

The design system provides dependency-light, accessible React Native controls
and consistent icon and typography semantics. It exists to make important
interaction behavior uniform without introducing a separate component
framework or hiding platform behavior behind excessive abstraction.

## Ownership

- `NativeControls.tsx` owns shared buttons, text inputs, list rows, dialogs,
  tags, switches, and related control primitives.
- `IconButton.tsx` owns the standard icon-only interactive control.
- `PhosphorIcon.tsx` is the application glyph boundary and maps semantic sizes
  to Phosphor's regular-weight icons.
- `AppFontProvider.tsx` owns app-font loading and the typography provider.
- Settings-specific cards, fields, and pickers remain in
  `src/features/settings/settings-primitives/`; promote them here only when
  their contract is truly cross-feature.

## Interaction Invariants

- Every interactive target is at least 44 by 44 points, including icon-only
  buttons. A smaller decorative glyph may sit inside that target.
- Pressed, disabled, selected, destructive, loading, error, and focus states
  must remain visually distinguishable without color being the only signal.
- Controls expose role, label, state, hint, and value where applicable.
- Modals isolate screen-reader focus, keep backdrop-only dismiss layers out of
  the accessibility tree, and retain a labelled close action.
- Dynamic status uses live-region or announcement behavior only at meaningful
  state changes.
- Keyboard, safe-area, font-scale, contrast, RTL, and platform back behavior
  are part of the control contract.

## Icon Contract

Application glyphs use `PhosphorIcon` with regular weight and semantic size
tokens. Raw numeric glyph sizes and direct imports from another icon family are
not supported. The official provider-brand SVGs in `ProviderIcon.tsx` are the
intentional exception; they use the same semantic visual-size scale but retain
their official brand geometry.

**Decision:** Semantic icon size describes visual importance, while the control
defines the touch target. Conflating the two produces inaccessible compact
buttons.

## Styling Rules

- Theme colors come from `src/theme/`; shared controls do not embed
  feature-specific colors or copy.
- Prefer React Native-owned primitives with predictable native accessibility
  behavior.
- Keep variants finite and meaning-based. A one-off feature appearance belongs
  with the feature until it proves reusable.
- Typography must survive accessibility-large text without clipping or
  replacing essential controls with inaccessible ellipses.

See [`../../docs/native-controls.md`](../../docs/native-controls.md) for usage
guidance.
