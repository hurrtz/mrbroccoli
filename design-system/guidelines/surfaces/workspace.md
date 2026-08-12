# Surface: the workspace (home screen)

The normative description of the home screen. The living demo is `ui_kits/mobile-app/`; component contracts are the `.d.ts` files next to each component; this document is where the decisions live.

## Composition

One column in portrait: top bar, introduction banner (until opened once), route byline, settings sentence, orb with satellites, status line, transcript handle. In landscape, two panes with a hairline divider: controls left, transcript right.

- Top bar is 62pt, the wordmark absolutely centred, menu and settings icon buttons pinned to the edges so a long localised title never pushes them around.
- The top third stays quiet: wordmark, one-line byline, one line of settings. The orb is the screen's single loud element — never more than one loud thing per view.
- Three whole-screen compositions were explored (central orb, docked orb, split stage); the central orb won because it keeps the top third quiet and makes the transcript suggested rather than shown.
- `BackgroundTaskBar`, when an install is running, sits directly under the top bar; in landscape it belongs in the left pane, above the route byline.

## Route byline (`RouteByline`)

Who answers the next turn, at what effort, one line above the stage.

- It is **not** a button: no fill, no border, no card. A contained control here reads as a second CTA directly above the voice stage. The provider mark supplies the prominence; the closing hairline says the whole row is the target.
- The effort dots are that model's **own** ladder, so the count varies — four steps on GPT-5, three on Sonnet. A model with no effort control reads "Normal" with no dots; one dot would carry no information.
- `switchable={false}` for a single configured model: caret and press target both go, and the row becomes a credit line. On-device routes take the `cpu` glyph, never a provider mark or letter fallback.
- It replaces `ResponseModeToggle` on this screen only. The app's switcher renders four different layouts for one, two, three and four-plus models; the byline is one treatment at every count, one line tall in both orientations. `ResponseModeToggle` stays in the system unchanged for anywhere else.

## Route picker (`RoutePicker`)

The model list the byline opens: a bottom sheet listing the configured routes **cheapest first**; picking one switches who answers the next turn. Sheet geometry follows the standard sheet rules (radius 20 top corners, 220ms symmetric rise).

## Settings sentence (`ConversationSettingsSummary`)

The conversation's settings as one line of muted text ("Balanced · Brief · Heart") with one icon button beside it, in a 44pt row. It replaces the strip of chips: settings are state, not actions, so they read as a sentence, and the single control is the only target.

## The orb (`VoiceOrb`)

The central voice control. Two concentric rings around a filled core carrying the phase glyph.

- **The glyph says what tapping does**, not what the machine is doing: `stop` while recording, `pause` while speaking, `mic` at rest. The disc takes the phase colour; the icon takes whichever of near-black or white measures higher contrast against it.
- **Two rings, two clocks.** The outer ring is the whole turn against its estimate, drawn in a neutral so it reads as time. The inner ring is the current phase against itself, in the phase's own colour. Past the estimate, `overtime` rises and both rings fill red as it runs — a full lap late is a fully red orb.
- **Idle draws a plain halo.** At rest there is no turn and no phase, so neither ring means anything — never two empty tracks.
- **Sizing.** 196 in portrait, 150 in landscape, stepped down to 156 while the introduction banner is up. Below about 120 the rings stop being legible — use `PhaseAwareVoiceAction` instead. The orb is sized to the space actually available: measure the container's **content box**, derive the diameter, clamp to a min and max. Never hardcode a size per layout; that constant was itself a bug.
- **Two implementation traps, both real bugs once:** (1) the core disc is a proportion of the whole orb but the rings shrink by fixed bands — below roughly 107pt the proportion overtakes the ring containing it and the orb goes oval; clamp the core to its parent ring and never let a ring shrink. (2) The orb must be measurably circular at min, default and max sizes.

## Satellites (`OrbSatellite`)

A row of 44pt controls with mono labels beneath the orb. Two species, deliberately drawn apart: **Image is momentary** — a bare glyph, an action; **Council and Web are state** — round toggles that fill with `accent-soft` and take an accent border when on. Council takes `users-three` (`robot` already means the thinking phase). In landscape the labels go and the name moves onto the control (`aria-label`); the column has no room for captions.

## Status line (`WorkspaceStatusLine`)

Phase dot, what is happening, what the conversation is. It carries the conversation name and age in every transcript-handle treatment, so the handle never has to.

## Composer and pager

Voice and text input are two pager pages.

- **Composer geometry** (from `src/screens/main/`): radius 15, border 1.5, padding 16/9/8, gap 10, field capped at 116pt, with a 46pt circular send button. Attach sits under the orb, reachable from both pages.
- **Pager indicator** (from `src/screens/main/voiceTextInputPager/`): two 4pt-tall bars, active 16 wide, idle 5, each centred in a 44pt target, the pair pulled together by ±12px. This is what ships.
- **Open decision:** an explored alternative puts a caret on each flank of the orb — it sits beside the thing that swipes, and the lit one points at the page you are not on. Whether the pager keeps the bars, gains the carets, or has both is an owner decision.

## Transcript handle (`TranscriptHandle`)

The transcript demoted to a peeking card above the bottom edge. Three treatments were explored — a message count, a one-line last reply, and the peeking card — and the card won: it names the model and the age, gives one line of the answer, and reads as the top edge of a drawer rather than a control.

What it opens is a **sheet over the workspace**, not a new screen: the route and settings stay visible above it and dismissing returns you to the orb. The sheet header carries only the conversation name and a close control.

## Landscape

Landscape sheds what it does not need: no swipe pager, no attach control, no settings sentence — and because the right pane has room, the transcript stops hiding. The orb sits centred in its column at 150pt with the icon controls pinned to the column's right edge. The left column is roughly 300pt after gutters; everything in it must hold at that width, one line tall.

## Kept unchanged

`ResponseModeToggle` and `PhaseAwareVoiceAction` remain in the system and the codebase. They are still correct anywhere the voice action sits in a bar rather than owning the screen. The orb composition is a replacement on this one screen, not a deletion.
