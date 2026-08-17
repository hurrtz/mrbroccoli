# Mr Broccoli — mobile app UI kit

A click-through recreation of the iOS/Android app, built from `MrBroccoli/src/screens/main/**` and `MrBroccoli/src/features/settings/**`. The screen it demonstrates is specified in `guidelines/surfaces/workspace.md` — including the two approved departures from what ships today (`RouteByline` for `ResponseModeToggle`, the orb composition for the docked voice bar). This README covers only what is specific to the recreation.

Three frames render side by side — light portrait, dark portrait, and landscape — so both appearances and both orientations can be compared.

## Files

| File | What it recreates |
| --- | --- |
| `index.html` | The three device shells and the route between screens |
| `Workspace.jsx` | `MainScreenPresentation` — top bar, byline, settings sentence, orb, satellites, status line, transcript handle; `Workspace` (portrait) and `LandscapeWorkspace` (two-pane) |
| `ConversationDrawerScreen.jsx` | `ConversationDrawer` — flat session list, fork tags, section bands, archived group, bottom search |
| `sessions.card.html` | The drawer as its own card, both appearances plus the landscape panel |
| `transcript.card.html` | The transcript drawer, spoken-script: fold, meta disclosure, swipe to remove |
| `../settings/*` | Settings is its own kit; loaded for the settings route |
| `../intro/*` | The introduction is its own kit; opened from App & diagnostics |
| `data.js` | Fixture conversations, models, providers and settings sections |

## What is interactive

- Tapping the orb runs the real phase script — recording, transcribing, searching, thinking, synthesizing, speaking — and appends a turn in the active model's name; both rings fill as specified.
- The carets either side of the orb swap to the text composer and back; typing and sending appends a turn.
- Council and Web are per-question switches; Image is a momentary action.
- The transcript handle opens the transcript as a sheet over the workspace.
- Tapping the byline opens `RoutePicker`; picking a route switches who answers next.
- The menu icon opens the conversation drawer; the gear opens Settings.

## Web adaptations and limits

- Everything below the presentation layer is left out: the voice pipeline, provider routing, persistence, branching, Premium purchase, Model Council, on-device downloads.
- Turn receipts, web-search references and usage cards are supported by `ChatBubble` but not populated here.
- The orb's overtime state is specimened on the component card; the kit's phase script never runs late.
- The orb holds 196 wherever the column allows it; nothing on this screen steps it down.
