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
- `VoiceOrb.tsx`, `OrbSatellite.tsx`, `WorkspaceStatusLine.tsx`,
  `ConversationSettingsSummary.tsx`, and `TranscriptHandle.tsx` own the orb
  composition the workspace is built from. `voicePhase.ts` maps a
  `VoiceVisualPhase` to the colour and glyph every one of them shares.
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
- Dialog footer actions stay on-screen regardless of content height: the card
  clips overflow and the body shrinks before the title and footer, so oversized
  content scrolls inside the card instead of pushing actions off-screen.
  Dialog content that can grow tall must itself shrink (for example a
  ScrollView with `flexShrink`) so scrolling covers the full content.
- `Modal` accepts `layout="sheet"` for surfaces that benefit from full width and
  from leaving the page behind them partly visible. The sheet pins to the
  bottom edge, spans the full width, and caps its height at
  `min(85% of the window, window minus the top safe-area inset)`. It renders
  only in portrait; in landscape the centred dialog renders instead, because a
  full-width sheet there is a wide, short strip whose top gap costs the height
  that keeps footer actions on-screen. The sheet rises and falls symmetrically
  and skips both animations under reduce motion. The default layout is
  `"dialog"`. Because the sheet's card sits flush against the physical bottom
  edge, its bottom padding adds the bottom safe-area inset on top of the
  dialog's flat `20`, so footer actions never land inside the home-indicator
  gesture band. The centred dialog keeps flat `20` padding on every edge.
- `Modal` calls `useSafeAreaInsets()` unconditionally for every layout, not
  only `"sheet"`. Every dialog therefore depends on a `SafeAreaProvider`
  ancestor; in this app that is supplied by Expo Router's `ExpoRoot`. Do not
  remove that assumption without adding an explicit provider.
- That ancestor only reaches surfaces presented inside the root window. A
  React Native `Modal` with `presentationStyle="fullScreen"` is its own view
  controller on iOS, outside it, where insets resolve to zero: a header lands
  under the Dynamic Island and a footer under the home indicator. Every
  full-screen modal therefore mounts its own `SafeAreaProvider`, seeded with
  `initialWindowMetrics` so the first frame is not empty while it measures.
  Transparent dialogs are presented over the root window and need none of
  this, which is why only the two full-screen surfaces carry it.
- **Assumption:** the sheet's motion is only partly pinned by tests. They prove
  the animated `transform` and `opacity` are present in sheet layout, absent in
  dialog layout, and that the container's own animation stays `"none"`, but
  they cannot prove the values are still bound to the driving animation:
  replacing the interpolation with a hard-coded settled value keeps every test
  green. React Native resolves animated style reads to plain numbers before a
  test can inspect them, and a native-driver value never advances under Jest's
  fake timers, so closing this would mean moving the interpolation off the
  native driver purely for testability. Verify the rise and fall visually when
  changing it.
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

**Decision:** A map key is a meaning, not a glyph name, so a later change of
glyph does not rename every call site. One glyph carrying two meanings makes two
different things look identical on screen;
`__tests__/design-system/PhosphorIcon.test.tsx` fails on any new collision.

**Open question:** `control` and `sliders` both draw `SlidersHorizontalIcon`, so
"open style sheet" and "App & diagnostics" are indistinguishable. Resolving it
means choosing a different glyph for one of them. Owner decision.

## Orb Composition

`VoiceOrb` is the workspace's single loud element; never render two in one view.

- The orb sizes itself to the space it is given rather than to a constant per
  layout. It measures its container and clamps to
  `[MIN_ORB_DIAMETER, MAX_ORB_DIAMETER]`. A container narrower than the minimum
  should render `PhaseAwareVoiceAction` instead, which stays correct wherever
  the voice action sits in a bar rather than owning the screen.
- Ring bands are fixed while the core is a proportion, so `getOrbGeometry`
  clamps the core to the ring holding it. Without that clamp the proportion
  overtakes its ring below about 107pt and the orb stops being circular.
- At rest neither ring means anything, so the idle orb draws a plain halo
  rather than two empty tracks, which would claim a turn was running.
- The glyph says what tapping does, not what the machine is doing. The phase is
  carried by the ring colour and stated in words by `WorkspaceStatusLine`.

**Decision:** these components take their copy as props rather than translating
internally, because this directory holds no strings. It also makes the accessible
name and the visible state one value: `TranscriptHandle` picks both from a single
`empty` test, and `VoiceOrb` requires the label the status line already shows.

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
