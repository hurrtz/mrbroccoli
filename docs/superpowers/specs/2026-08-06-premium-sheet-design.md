# Premium upgrade sheet — design

2026-08-06

## Problem

The Premium upgrade dialog reads as a narrow strip. The shared `Modal` centres
its card inside an overlay with `padding: 20`, caps it at `maxWidth: 560`, and
gives it `padding: 20` of its own, so on a phone the usable content column is
much narrower than the screen. Nothing about the Premium content wants that
shape: it is a vertical list of benefits plus two footer actions.

The dialog also floats in the middle of a dimmed screen, which hides the page
behind it and costs the user the context they opened it from.

## Intent

Present Premium as a bottom sheet: full width, anchored to the bottom edge,
rising into place, and stopping short of the top so the underlying page
headline stays visible through the backdrop.

## Decision: an opt-in layout on the shared modal

**Decision:** add `layout?: "dialog" | "sheet"` to the shared `Modal` in
`src/design-system/NativeControls.tsx`, defaulting to `"dialog"`.

Seventeen components render that `Modal`. Changing its default would restyle
every dialog in the app as a side effect of a Premium change. An opt-in prop
keeps the blast radius at exactly one caller while putting the sheet in the
design system, where the next caller can reach it.

Rejected: a bespoke sheet inside `PremiumUpgradeModal`. It would duplicate the
title, footer, backdrop, and focus handling the shared modal already owns, and
those are precisely the parts with accessibility rules attached.

`PremiumUpgradeModal` already passes `title` and `footer` to the shared modal,
so it opts in with one prop and needs no changes to its own content.

## Behaviour

**Portrait.** The sheet spans the full window width, sits flush against the
bottom edge, rounds only its top two corners, and drops the overlay padding and
the `maxWidth: 560` cap. Its maximum height is
`min(windowHeight * 0.85, windowHeight - topSafeAreaInset)` — whichever leaves
more room at the top wins, so on a device with a tall notch the inset governs
and on every other device the 85% cap does. Roughly 15% of the screen, about
120pt on a typical phone, stays uncovered.

**Landscape.** The existing centred card renders unchanged.

**Decision:** orientation selects the layout, via `height > width` from
`useWindowDimensions()`. A full-width sheet on a landscape window is a wide,
short strip, and the top gap eats the height that commit `36f7ecf` reclaimed
when Premium's Buy and Restore actions were pushed off-screen in iPad
compatibility mode. Re-introducing that risk to gain consistency is a bad
trade. Using window dimensions means rotation re-evaluates for free.

## Motion

**Decision:** animate only the card. The React Native `Modal`'s own
`animationType="slide"` would carry the dimmed backdrop up with the card, which
reads wrong; the backdrop should fade while the card rises. The container keeps
`animationType="fade"` and an `Animated.Value` drives the card's `translateY`
from its capped height to zero over ~220ms with an ease-out, started when
`visible` becomes true. `AntSettingsModal` already animates a modal surface
this way.

On close the existing backdrop fade carries the sheet out. Playing a slide-down
would require holding the modal mounted after `visible` goes false, and the
extra state is not worth a dismissal animation.

**Assumption:** the asymmetry between a rising open and a fading close is not
noticeable enough to matter. If it reads as abrupt in use, the fix is a
`rendered` state that defers unmount until the outward animation finishes.

When `AccessibilityInfo.isReduceMotionEnabled()` reports true, the sheet appears
at its final position with no translate.

## What must stay true

- The backdrop stays out of the accessibility tree (`accessible={false}`,
  `importantForAccessibility="no"`), and dismissal for screen-reader users runs
  through the labelled close action. This is a design-system SPEC rule, not an
  implementation detail.
- `accessibilityViewIsModal` continues to isolate screen-reader focus.
- The body keeps `flexShrink` and its internal scroll, so footer actions cannot
  be pushed off-screen — the guarantee `36f7ecf` established.
- The sixteen other dialogs render exactly as before.

## Verification

| Layer | Case |
| --- | --- |
| `__tests__/design-system/NativeControls.test.tsx` | Sheet pins to the bottom and caps at 85% in portrait |
| | Falls back to the centred card in landscape |
| | Backdrop stays out of the accessibility tree in sheet layout |
| `__tests__/components/PremiumUpgradeModal.test.tsx` | Opts into the sheet layout |
| | Buy and Restore stay reachable — regression guard for `36f7ecf` |
| Existing suite | The other sixteen dialogs are unchanged, proving the default is intact |

## Files

- `src/design-system/NativeControls.tsx` — the `layout` prop, sheet styles, card
  animation, reduce-motion branch
- `src/design-system/SPEC.md` — document the variant and when to use it
- `src/components/PremiumUpgradeModal.tsx` — pass `layout="sheet"`
- `__tests__/design-system/NativeControls.test.tsx`,
  `__tests__/components/PremiumUpgradeModal.test.tsx` — coverage above
- `CHANGELOG.md` — entry under `Unreleased`

## Out of scope

Swipe-down-to-dismiss. It needs gesture-versus-scroll arbitration inside a
scrolling sheet, and backdrop tap plus the labelled close action already cover
dismissal. Migrating the other sixteen dialogs to the sheet layout is also out
of scope; each is its own judgement about whether a sheet suits that surface.
