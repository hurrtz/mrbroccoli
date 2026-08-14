# Surface: the workspace (home screen)

The normative description of the home screen. The living demo is `ui_kits/mobile-app/`; component contracts are the `.d.ts` files next to each component; this document is where the decisions live.

## Composition

One column in portrait: top bar, introduction banner (until opened once), route byline, settings sentence, orb with satellites, transcript handle. In landscape, two panes with a hairline divider: controls left, transcript right.

- Top bar is 62pt, the wordmark absolutely centred, menu and settings icon buttons pinned to the edges so a long localised title never pushes them around.
- The top third stays quiet: wordmark, one-line byline, one line of settings. The orb is the screen's single loud element — never more than one loud thing per view.
- Three whole-screen compositions were explored (central orb, docked orb, split stage); the central orb won because it keeps the top third quiet and makes the transcript suggested rather than shown.
- `BackgroundTaskBar`, when an install is running, sits directly under the top bar; in landscape it belongs in the left pane, above the route byline.

## Route byline (`RouteByline`)

Who answers the next turn, at what effort, one line above the stage.

- It is **not** a button: no fill, no border, no card. A contained control here reads as a second CTA directly above the voice stage. The provider mark supplies the prominence; the closing hairline says the whole row is the target.
- Effort is named, not plotted: the mono effort word alone. The dot ladder is retired (owner call, 2026-08) — the name already says it, and a model with no effort control reads "Normal". No information.
- `switchable={false}` for a single configured model: caret and press target both go, and the row becomes a credit line. On-device routes take the `cpu` glyph, never a provider mark or letter fallback.
- It replaces the app's model switcher, which renders four different layouts for one, two, three and four-plus models. The byline is one treatment at every count, one line tall in both orientations. `ResponseModeToggle` stays in the system unchanged for anywhere else.

## Route picker (`RoutePicker`)

The model list the byline opens: a bottom sheet listing the configured routes **cheapest first**; picking one switches who answers the next turn. Sheet geometry follows the standard sheet rules (radius 20 top corners, 220ms symmetric rise).

## Settings sentence (`ConversationSettingsSummary`)

The conversation's settings as one line of muted text ("Balanced · Brief · Heart") with one icon button beside it, in a 44pt row. It replaces the strip of chips: settings are state, not actions, so they read as a sentence, and the single control is the only target.

## The orb (`VoiceOrb`)

The central voice control. Two concentric rings around a filled core carrying the phase glyph.

- **The glyph says what tapping does**, not what the machine is doing: `stop` while recording, `pause` while speaking, `mic` at rest. The disc takes the phase colour; the icon takes whichever of near-black or white measures higher contrast against it.
- **Ring anatomy, inside out:** the disc; a small gap that is only ever a gap — the screen reads through it, no fill, no interaction, identical in every phase; the inner ring; the outer ring flush against it, nothing between the two rings.
- **What the rings mean per phase.** Idle: both rings faded green — no clocks, never two empty tracks. Recording: both combine into one indicator — how much of the recording window is used before what was said auto-submits. Transcribing through synthesizing: two clocks — the outer ring is the whole turn against its estimate in a neutral (time, not phase); the inner ring is the current phase against itself in the phase’s own colour. Speaking: both combine again — how much of the response has been read; Back jumps to the start of the current paragraph (or the preceding one inside the first two seconds), Forward to the next, every jump moves the arc, and at the last word the orb falls back to idle. Past the estimate the rings fill red as the turn runs late.
- **Sizing.** 196 in portrait, 150 in landscape, stepped down to 156 while the introduction banner is up. Below about 120 the rings stop being legible, and there is no smaller variant — give the orb its room. The orb is sized to the space actually available: measure the container's **content box**, derive the diameter, clamp to a min and max. Never hardcode a size per layout; that constant was itself a bug.
- **Two implementation traps, both real bugs once:** (1) the core disc is a proportion of the whole orb but the rings shrink by fixed bands — below roughly 107pt the proportion overtakes the ring containing it and the orb goes oval; clamp the core to its parent ring and never let a ring shrink. (2) The orb must be measurably circular at min, default and max sizes.

## Satellites (`OrbSatellite`)

**The ring belongs to the phase.** At idle it carries the composing controls — image, council, web — the only moment they mean anything. When a turn starts they give way (gently, no reflow) to four transport verbs: Restart · Back · Forward · Stop. Through transcribing, searching, thinking and synthesising the three seek verbs are disabled and only **Stop** is live — it abandons the turn and returns to idle. In the speaking phase all four come alive; at the last word, or on Stop, the orb returns to idle and the composing three come back. Back returns to the start of the current paragraph (or the preceding one inside the first two seconds), Forward goes to the next, and both move the orb’s reading arc with the playhead; the orb tap remains pause/resume and keeps position.

Tone: the transport verbs tint their **glyph and label only** — Stop in danger, Resume in success, no fill and no border; everything else stays neutral. A row of 44pt controls with mono labels beneath the orb. Two species, deliberately drawn apart: **Image is momentary** — a bare glyph, an action; **Council and Web are state** — toggles that fill with `accent-soft` and take an accent border when on. Council takes `users-three` (`robot` already means the thinking phase). In landscape the labels go and the name moves onto the control (`aria-label`); the column has no room for captions.

## Status line — removed

The upstream status line (phase dot · activity · conversation meta under the orb) is removed from the product (owner call, 2026-08): it read as alien and duplicated what the orb’s phase states, the settings sentence and the transcript handle already carry. Phase feedback lives in the orb; the transcript handle’s meta line owns conversation name and age.
## Composer and pager

Voice and text input are two pager pages.

- **Composer geometry** (from `src/screens/main/`): radius 15, border 1.5, padding 16/9/8, gap 10, field capped at 116pt, with a 46pt circular send button. Attach sits under the orb, reachable from both pages.
- **Pager indicator** (from `src/screens/main/voiceTextInputPager/`): two 4pt-tall bars, active 16 wide, idle 5, each centred in a 44pt target, the pair pulled together by ±12px. This is what ships.
- **Open decision:** an explored alternative puts a caret on each flank of the orb — it sits beside the thing that swipes, and the lit one points at the page you are not on. Whether the pager keeps the bars, gains the carets, or has both is an owner decision.

## Transcript handle (`TranscriptHandle`)

The transcript demoted to a peeking card above the bottom edge. Three treatments were explored — a message count, a one-line last reply, and the peeking card — and the card won: it names the model and the age, gives one line of the answer, and reads as the top edge of a drawer rather than a control.

What it opens is a **sheet over the workspace**, not a new screen: the route and settings stay visible above it and dismissing returns you to the orb. The sheet header carries only the conversation name and a close control.

## Landscape

Landscape keeps the phase-owned ring — icon-only, no labels, but the same swap and the same rules, so a drive session can be stopped there too. The settings control floats over the stage's top-right corner rather than taking a row of its own (`iconOnly`): the words cost the orb height the narrow column cannot spare, and the orb then owns everything between the byline's hairline and the control row, centred in it. Beyond that it sheds what it does not need: no swipe pager, no attach control, no settings sentence — and because the right pane has room, the transcript stops hiding. The orb sits centred in its column at 150pt with the icon controls pinned to the column's right edge. The left column is roughly 300pt after gutters; everything in it must hold at that width, one line tall.

## Retired with this design

`ResponseModeToggle` (the four-layout model switcher) and `PhaseAwareVoiceAction` (the phase-coloured voice bar) were **deleted** from the system in 2026-08. The orb plus the route byline replace both, at every model count and every phase; there is no small-orb variant to fall back to — give the orb its room. `WorkspaceStatusLine` and `DriveSessionControls` are gone for the same reason: their jobs moved into the orb and its satellite ring.
## Drive mode

The third input mode ("Drive Session", premium): hands-free voice activity detection against an ambient acoustic profile, a silence window with spoken countdown cues, auto-submit, auto-continue. It adds **no controls of its own** — the satellite ring already carries everything. In a drive session the ring shows transport in every phase, idle included: a driver must be able to end the loop at rest, not only mid-turn. Stop ends the loop and becomes **Resume**, which starts it again; the three seek verbs follow the usual rule (live only while he speaks). The composing controls (image, council, web) are unavailable for the duration — hands-free is the point, and they are reachable again the moment the session ends. Headset and car-remote buttons map to the same two actions, and the orb keeps working as the manual press.

**Deliberate departures from upstream:** upstream’s `DriveSessionControls.tsx` ships a dock row of three equal buttons (Pause auto · Repeat last · Resume auto) with pause/resume as a pair, one always disabled. The system retires that row entirely (owner call, 2026-08): pause/resume collapse into the ring's Stop/Resume, and "Repeat last" is dropped because Restart already replays the response from its first word. One ring, one Stop, whatever the mode — nothing on screen competes for the same verb.
