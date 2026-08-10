# Mr Broccoli — mobile app UI kit

A click-through recreation of the iOS/Android app, built from
`MrBroccoli/src/screens/main/**` and `MrBroccoli/src/features/settings/**`,
with the model switcher and the voice stage replaced by the orb composition
(see "Departures" below).

Three frames render side by side — light portrait, dark portrait, and
landscape — so both appearances and both orientations can be compared. Neither
appearance is the "real" one.

## Files

| File | What it recreates |
| --- | --- |
| `index.html` | The three device shells and the route between screens |
| `Workspace.jsx` | `MainScreenPresentation` — top bar, intro banner, route byline, settings sentence, orb, satellites, status line and transcript handle, in `Workspace` (portrait) and `LandscapeWorkspace` (two-pane) |
| `ConversationDrawerScreen.jsx` | `ConversationDrawer` — search, new conversation, branch rows |
| `../settings/*` | Settings is its own kit; this one loads it for the settings route |
| `data.js` | Fixture conversations, models, providers and settings sections |

## What is interactive

- The violet introduction banner above the route byline opens the six-step
  introduction: welcome, what setup actually requires, the one requirement,
  speech in, speech out, and Premium. Every step is reachable from the header
  stepper as well as the arrows, and the last step's forward action becomes a
  finish action.
- Tapping the orb runs the real phase script — recording, transcribing,
  searching, thinking, synthesizing, speaking — and appends a turn to the
  transcript in the active model's name. The inner ring fills through each
  phase; the outer ring fills through the whole turn.
- The carets either side of the orb swap to the text composer and back. Typing
  and sending appends a turn the same way.
- Council and Web are per-question switches; Image is a momentary action.
- The transcript handle at the bottom edge opens the transcript as a sheet over
  the workspace, so the route and settings stay visible above it.
- Tapping the route byline opens `RoutePicker`, a bottom sheet listing the
  configured routes cheapest first; picking one switches who answers next.
- The menu icon opens the conversation drawer; picking a conversation returns
  to the workspace with that title.
- The gear opens Settings; Connections and Speaking drill in and back.

## Departures from what ships today

Two intentional, both from explorations run in this project and approved by the
product owner, plus one web adaptation.

`RouteByline` replaces `ResponseModeToggle`. The app's own switcher renders
four different layouts for one, two, three and four-plus models; the byline is
one treatment at every count, one line tall in both orientations, with the
model list moved into a sheet. See `explorations/model-switcher.html`.

`VoiceOrb` replaces the docked `PhaseAwareVoiceAction` bar. The voice control
moves to the centre of the screen and becomes the one loud element; the
transcript demotes to a drawer that peeks above the bottom edge; the
conversation's quick settings become a line of text rather than a strip of
chips. See `explorations/calm-orb.html` and `explorations/orb-in-use.html`, and
`explorations/phase-palettes.html` for the phase ramp the rings use. Both
replaced components remain in the design system unchanged.

`IntroFlow` cannot be swiped. `IntroFlowScreen.tsx` puts the six steps in a
horizontally paged `ScrollView`, so they can be swiped as well as driven from
the header arrow and the stepper; `IntroFlow` renders only the current step, so
the arrows and the stepper are the whole navigation. Both directions still
work, which was the point of the paged view — the gesture is what is missing.

`IntroFlow`'s header controls carry a larger target than the source. The app's
`headerButton` style is 40×40, below the 44pt minimum the system states
elsewhere. The circle is still drawn at 40 so the header looks identical, but
the button around it is 44×44 with a −2 margin, so the touch area meets the
rule without moving the control.

## What is left out

Everything below the presentation layer: the actual voice pipeline, provider
routing, persistence, branching, Premium purchase, Model Council, and
on-device model downloads. Turn receipts, web-search references and usage cards
are supported by `ChatBubble` but not populated here. The orb's overtime state
is built and specimened on the component card, but the kit's phase script never
runs late, so it does not appear in the walkthrough. The introduction's audio
examples are not wired: the play controls toggle their own state but no clip
plays, and the language picker changes the label only. The orb steps down from
196 to 156 while the introduction banner is up, so the column still fits.
