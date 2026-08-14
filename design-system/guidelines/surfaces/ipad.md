# Surface: iPad

Adapts every screen to the iPad's width instead of scaling the phone layout. Settled direction for a not-yet-built form factor: nothing here is in the shipped app, which is phone-only today.

## Size classes

Two states, named after UIKit's regular/compact width classes — there is no third. **Regular** (roughly \u2265 680pt of window width: full screen on an 11"/13" iPad, or the wider side of Split View): the conversations sidebar is permanent. **Compact** (Slide Over, or the narrow side of Split View, roughly \u2264 420pt): the app collapses to exactly the phone's layout. There is no bespoke "narrow tablet" treatment — compact IS the phone design, reused wholesale, so the two can never drift apart.

The breakpoint is stated in size-class terms rather than a pixel number on purpose: the real threshold is whatever the system's split-view container picks on device, which is not this system's to invent.

## App shell

Regular width: `IpadSidebar` (336pt, 300pt in portrait where width is tighter) sits at the leading edge, always — never an overlay, never closes, no menu button to summon it. It carries the same `ConversationDrawerItem` rows, search field and new-conversation control as the phone drawer; there is no separate "drawer" mode. The content pane fills the rest: byline centred, the settings control at the trailing edge (icon-only, as landscape phone already does), the orb stage, the transcript handle. Nothing in the content pane changes between portrait and landscape — flex centring does the work.

Compact width: the content pane takes the full window; a menu button at the leading edge opens `IpadDrawerOverlay` — a scrim plus a sliding panel, the same interaction as the phone drawer.

## Transcript

**Landscape regular width docks it permanently as a third column** (`TranscriptColumn`, ~400pt, no handle, nothing to open or close) — sidebar, orb stage and transcript all visible at once, because at this width nothing needs to hide behind a tap. Portrait regular and compact width lack the room: there it stays a handle + sheet pulled up over the content pane (`TranscriptPanel`), same as the phone. This is the one place regular width has two different layouts depending on orientation — everywhere else in the app shell, orientation only changes column widths, never the pattern.

## Settings

Opens as a full-window replacement, same as the phone — one behaviour across form factors rather than a new modal-sheet pattern invented for the larger screen. Genuinely a different pattern from the app shell otherwise, by design (owner call): **sidebar master-detail** at regular width. `CategoryNav` groups the seven pages exactly as the phone's overview does (Conversation / Voice / Privacy & app), with a persistent tinted selection instead of a chevron — there is nothing to push, so the page itself withholds `onBack` and shows no back control. At compact width, settings collapses to the phone's own `SettingsOverview` → page push, mounted unmodified.

## Onboarding

A centred, fixed-width card (max 640pt) regardless of window size or orientation — `IntroFlow` itself is untouched. A focused first-run flow does not benefit from the whole screen; widening it would only lengthen the eye's travel.

## Out of scope

- Multi-window / multiple Split View instances of the app side by side — not proposed until the phone app itself supports more than one active conversation window.
