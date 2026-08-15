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
- `Switch.tsx` is the product's one switch: a 46x28 track inside a 44pt
  target. It was promoted here from settings once the introduction needed it
  too — a control used by two features is no longer feature-specific.
- `VoiceOrb.tsx`, `OrbSatellite.tsx`, `ConversationSettingsSummary.tsx`,
  and `TranscriptHandle.tsx` own the orb-centred
  workspace controls introduced by the approved design system. They are
  presentation-only: every string arrives translated from the caller, and the
  orb's diameter is passed in by the screen that measured its space.
  `OrbSatellite` and `ConversationSettingsSummary` also expose icon-only compact
  forms that preserve their labelled 44-point control when the owning layout
  cannot safely render optional visible copy. The conversation summary's full
  visible row is its one press target; the trailing control glyph is
  decorative rather than a smaller nested action. `TranscriptHandle` shows a
  grip plus the translated stable transcript label; conversation name, route,
  age, and reply previews belong elsewhere in the workspace.
- `PhosphorIcon.tsx` is the application glyph boundary and maps semantic sizes
  to Phosphor's regular-weight icons.
- `AppFontProvider.tsx` owns app-font loading and the typography provider.
- Settings-specific cards, fields, and pickers remain in
  `src/features/settings/settings-primitives/`; promote them here only when
  their contract is truly cross-feature.

## Interaction Invariants

- `VoiceOrb` is the stable home-stage affordance, including blocked states; it
  must not be exchanged for a legacy full-width CTA. Its ring footprint can
  represent a whole-turn estimate and current-phase clock, with a track plus red
  counter-clockwise tail after the estimate. Interpolation belongs on the
  Reanimated UI thread so streamed-content renders cannot reduce ring frame
  rate; callers provide semantic values and remaining durations, never a JS
  animation interval. A timing may target a measured boundary short of one, so
  speaking can interpolate within the current clip without claiming an
  incomplete reply is finished. Its approved anatomy is core disc,
  screen-coloured gap, inner phase ring, then the outer whole-turn ring flush
  against it; no tinted halo may occupy the gap. When both bands carry the same
  state and progress, they render as one double-width stroke centred over that
  exact footprint so adjacent SVG edges cannot expose a raster seam. They split
  into two strokes only while they carry different clocks.
- Every interactive target is at least 44 by 44 points, including icon-only
  buttons. A smaller decorative glyph may sit inside that target.
- Pressed, disabled, selected, destructive, loading, error, and focus states
  must remain visually distinguishable without color being the only signal.
- Controls expose role, label, state, hint, and value where applicable.
- Modals isolate screen-reader focus, keep backdrop-only dismiss layers out of
  the accessibility tree, and retain a labelled close action.
- `Modal` forwards the native dismissal callback. Callers that replace one
  modal with a sibling surface wait for that callback on iOS and provide their
  own Android fallback; hiding React state alone does not prove the native view
  controller has left the modal stack.
- Dialog footer actions stay on-screen regardless of content height: the card
  clips overflow and the body shrinks before the title and footer, so oversized
  content scrolls inside the card instead of pushing actions off-screen.
  Dialog content that can grow tall must itself shrink (for example a
  ScrollView with `flexShrink`) so scrolling covers the full content.
- Dialogs with text-entry footers opt into `Modal.keyboardAvoiding`. On iOS the
  complete card, including its footer, moves above the keyboard; moving only
  the body would still leave the commit action unreachable. Other dialogs keep
  their existing geometry.
- `Modal` accepts `layout="sheet"` for surfaces that benefit from full width and
  from leaving the page behind them partly visible. The sheet pins to the
  bottom edge, spans the full width, and caps its height at
  `min(85% of the window, window minus the top safe-area inset)`. It renders
  only in portrait; in landscape the centred dialog renders instead, because a
  full-width sheet there is a wide, short strip whose top gap costs the height
  that keeps footer actions on-screen. The sheet rises and falls symmetrically
  and skips both animations under reduce motion. Its backdrop mounts fully
  formed before the card rises and stays fixed while the card moves; the
  backdrop is never translated or faded with the sheet. The default layout is
  `"dialog"`. Because the sheet's card sits flush against the physical bottom
  edge, its bottom padding adds the bottom safe-area inset on top of the
  dialog's flat `20`, so footer actions never land inside the home-indicator
  gesture band. The centred dialog keeps flat `20` padding on every edge.
  A downward drag on the sheet's handle follows the finger and closes past 96
  points or a fast flick, springing back otherwise; the gesture claims only
  after slop, so a tap on the handle still closes the sheet outright.
  **Decision:** the handle owns pull-to-close and the card does not. A sheet
  may hold a scroll view, where a downward drag is how the reader goes back
  through what is already there — the same motion that closes the sheet, and
  nothing in the touch separates the two intentions. Rejected alternative: a
  top band of the card, which cannot tell a drag beginning over the first row
  of a scrolling list from one on the chrome above it. A sheet therefore
  carries a title or grabber to be draggable at all; one without either keeps
  its backdrop and its own actions. Dialogs never drag.
- `SheetHeader` is the shared drawer headline. It centres the headline type and
  optional supporting copy with deliberate space around them. In portrait its
  visible grabber sits near the sheet edge inside a labelled 44-point tap target;
  the sheet card adds no separate top inset, and the parent sheet attaches
  pull-down dismissal to that header. There is no redundant close icon. In
  landscape, where the sheet becomes a dialog and cannot drag, the header
  substitutes a labelled close icon.
- `Modal.cardStyle` is the narrow escape hatch for an approved feature canvas
  whose sheet deliberately does not use the generic elevated dialog surface or
  padding. The caller still owns safe-area clearance and must keep the default
  modal behavior unchanged for every other surface.
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

## Control Shape and Size

- Every control is a squircle on the radius scale. Two exceptions, both about
  the voice: the workspace orb and the introduction's play action. Toggles
  included — state reads from border and fill, not from shape.
- Pills belong to things that are not buttons: status tags, selection chips,
  the fork tag, stepper dots, badges. Every button takes the control radius.
- One commit button: the full-width primary action is 48pt on the control
  radius wherever it appears, dialog footers included, where actions stack
  full width rather than sitting right-aligned in a row.
- 44 is the floor for every control, `Button size="small"` included.

## Icon Contract

Application glyphs use `PhosphorIcon` with regular weight and semantic size
tokens. Raw numeric glyph sizes and direct imports from another icon family are
not supported. Two intentional exceptions exist: the official provider-brand
SVGs in `ProviderIcon.tsx` use the semantic visual-size scale but retain their
official brand geometry, and the voice orb passes its proportionally computed
glyph size through `PhosphorIcon`'s `visualSize`, because the orb's diameter is
measured at runtime and no static token can name a proportion of it.

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
