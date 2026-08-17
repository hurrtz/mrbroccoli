# Surface: the workspace (home screen)

The normative description of the home screen. The living demo is `ui_kits/mobile-app/`; component contracts are the `.d.ts` files next to each component; this document is where the decisions live.

## Composition

One column in portrait: top bar, the header block, the orb with its transport orbit, the composing row, transcript handle. In landscape, two panes with a hairline divider: controls left, transcript right.

- Top bar is 62pt, the wordmark absolutely centred, menu and settings icon buttons pinned to the edges so a long localised title never pushes them around.
- The top third stays quiet: wordmark, one-line byline, one line of settings. The orb is the screen's single loud element — never more than one loud thing per view.
- Three whole-screen compositions were explored (central orb, docked orb, split stage); the central orb won because it keeps the top third quiet and makes the transcript suggested rather than shown.
- `BackgroundTaskBar`, when an install is running, sits directly under the top bar; in landscape it belongs in the left pane, above the route byline.
- **Retired from this surface (owner call, 2026-08):** the violet `IntroBanner` and every premium upsell surface (`PremiumBand`, `PremiumUpgradeModal`). The introduction is reachable from App & diagnostics; premium gating shows as locked rows in settings and nothing else. Nothing advertises on the home screen.

## Header (`WorkspaceHeader`)

Who answers the next turn, and what this conversation is set to — **one raised block of two 44pt rows** with a hairline between them, sitting **14pt below the top bar**.

- The containment **reverses the earlier “no contained control above the stage” call** (owner, 2026-08). Three complaints drove it: the byline and sentence sat tight under the top bar and read as part of the headline; neither looked pressable; and the model — the most consequential choice on the screen — got one thin line. The block answers all three.
- It stays on the **quiet surface fill with a hairline**, never an accent fill. Pressable, not loud: the orb is still the screen's only loud element, and the top third stays quiet.
- **Row one leads** because it changes the answer: provider mark (or `cpu` for on-device), model name in the display face, the effort **word** — named, never plotted; the dot ladder stays retired — and a caret. `switchable={false}` for a single configured model drops the caret and the press target; the row becomes a credit line.
- **Row two** states the conversation as "Label: value" pairs and opens the settings sheet. It truncates at the end rather than wrapping, so a narrow screen shows less. Settings are state, not actions — that principle survives; what changed is that the row now looks like the target it always was.
- Two rows, one silhouette: unequal in content, equal in shape. Evenly sized cards were explored and rejected — they imply the two choices are equally important, and they are not.

Landscape keeps `RouteByline` and the icon-only `ConversationSettingsSummary` instead: the ~300pt column has no room for a block, and the settings control floats over the stage's top-right corner there. Both components stay in the system for that use.

## Route byline (`RouteByline`) — landscape and iPad

Who answers the next turn, at what effort, one line above the stage.

- It is **not** a button in this form: no fill, no border, no card. The provider mark supplies the prominence; the closing hairline says the whole row is the target. In portrait this treatment is superseded by `WorkspaceHeader`; the byline remains the landscape and iPad form, where the column is too narrow for a block.
- Effort is named, not plotted: the mono effort word alone. The dot ladder is retired (owner call, 2026-08) — the name already says it, and a model with no effort control reads "Normal". No information.
- `switchable={false}` for a single configured model: caret and press target both go, and the row becomes a credit line. On-device routes take the `cpu` glyph, never a provider mark or letter fallback.
- It replaces the app's model switcher, which renders four different layouts for one, two, three and four-plus models. The byline is one treatment at every count, one line tall in both orientations. `ResponseModeToggle` stays in the system unchanged for anywhere else.

## Route picker (`RoutePicker`)

The model list the byline opens: a bottom sheet listing the configured routes **cheapest first**; picking one switches who answers the next turn. Sheet geometry follows the standard sheet rules (radius 20 top corners, 220ms symmetric rise).

## Settings sentence (`ConversationSettingsSummary`) — landscape and iPad

The conversation's settings as one line of muted text — every quick setting worth stating, not trimmed to two or three, as "Label: value" pairs ("Hands free: on · Length: Brief · Voice: Heart") — with one icon button at the trailing edge, in a 44pt row. Longer is fine: it truncates at the end rather than wrapping, so a narrow screen simply shows less. It replaces the strip of chips: settings are state, not actions, so they read as a sentence, and the single control is the only target.

## The orb (`VoiceOrb`)

The central voice control. Two concentric rings around a filled core carrying the phase glyph.

- **The glyph says what tapping does** at the ends of a turn — `stop` while recording, `pause` while speaking, `mic` at rest. Through the middle it names the work in hand instead: `text-align-left` transcribing (mirrored to `text-align-right` in right-to-left locales), `brain` for a brief think, `global` searching, `circuitry` thinking, `user-sound` synthesising — there the orb tap has no defined action, and abandoning the turn belongs to the orbit's Stop key. The disc takes the phase colour; the icon takes whichever of near-black or white measures higher contrast against it.
- **Anatomy, inside out:** the disc; a small gap that is only ever a gap — the screen reads through it, no fill, no interaction, identical in every phase, held at ~3pt so the ring sits close against the disc (owner call, 2026-08; was 9); **one 12pt ring**. The earlier inner/outer pair is merged (owner call, 2026-08): once the ring went slate, two concentric greys told one story.
- **What the ring means per phase.** It is a fill meter, not a judgement, so it is **slate in every phase** — the neutral `turn-ink` / `turn-track` tokens; the phase colour lives in the disc alone, and green appears nowhere on the ring (owner call, 2026-08). Idle: faded to the track, no clock. Recording: how much of the recording window is used before what was said auto-submits. Transcribing through synthesizing: the whole turn against its estimate — one number, the one you are waiting on. Speaking: how much of the response has been read; Back jumps to the start of the current paragraph (or the preceding one inside the first two seconds), Forward to the next, every jump moves the arc, and at the last word the orb falls back to idle. Past the estimate it fills red as the turn runs late — the one state that is a judgement.
- **Sizing.** 196 in portrait, 150 in landscape. Below about 120 the rings stop being legible, and there is no smaller variant — give the orb its room. The orb is sized to the space actually available: measure the container's **content box**, derive the diameter, clamp to a min and max. Never hardcode a size per layout; that constant was itself a bug.
- **Two implementation traps, both real bugs once:** (1) the core disc is a proportion of the whole orb but the rings shrink by fixed bands — below roughly 107pt the proportion overtakes the ring containing it and the orb goes oval; clamp the core to its parent ring and never let a ring shrink. (2) The orb must be measurably circular at min, default and max sizes.

## Satellites (`OrbSatellite`) and the transport orbit (`OrbTransport`)

**One location, one meaning.** The row under the orb is the composing controls — image, council, web, hands free — at **every** phase. It never becomes anything else. The verbs that act on a running response orbit the orb instead: **Back** and **Forward** on the flanks, where left and right already mean what they look like, **Restart** and **Stop** on the lower diagonals, nearest the thumb, on a circle 34pt clear of the orb's edge. The keys render for turn phases only — their presence is the signal that a turn is running — but **the cluster's footprint is permanent**: `OrbTransport` mounts at every phase and reserves its box at idle too, drawing nothing in it, so the orb never moves when a turn starts. Never mount a bare `VoiceOrb` at idle and swap; that is a 15pt orb jump at exactly the wrong moment.

The verbs belong to the orb because the orb is what they act on: it holds the reading arc and its own tap is pause/resume. Three things follow, and all three were the point (owner call, 2026-08 — the row-swap this replaces is retired):

- **A paused turn looks like a turn.** Pausing is not the end of one, so nothing about the bottom of the screen changes when you pause; previously the composing three came back and a second tap took them away again.
- **The composing row dims rather than disappears** while a turn runs (38%, inert) — with one exception, Hands free, which stays live in both directions (see Hands free below).
- **The hands-free loop is a switch, not a mode**, so the orbit never has to stay up at rest for it — the keys-at-idle exception is gone (see Hands free below).

Through transcribing, searching, thinking and synthesising the three seek verbs are disabled and only Stop is live. In the speaking phase all four come alive; at the last word, or on Stop, the orb returns to idle. Back returns to the start of the current paragraph (or the preceding one inside the first two seconds), Forward goes to the next, and both move the orb's reading arc with the playhead.

**Sizing.** The cluster reserves its own footprint from the orb diameter: `2 × (orb/2 + 34 + 32)` wide and `orb/2 + max(orb/2, 0.7071 × (orb/2 + 34) + 36)` tall with labels — 328×227 at a 196pt orb, which holds inside a 4.7″ column with room to spare. It never steps the orb down; measure the stage and pass a diameter that fits.

**Button treatment — the container describes location, never state.** No satellite has a fill or a border in either appearance; the orb is the only filled object on the stage. A switch says it is on by **filling its glyph** and taking the accent, label with it — weight and hue together, so the state never rides on colour alone, and since nothing else in the product fills a glyph, a filled glyph can only mean on. This needs the Phosphor **fill** stylesheet loaded next to the regular one. The only container a satellite ever shows is a momentary `accent-soft` press disc under the thumb, which is the whole pressability cue a borderless target gets. Tone still tints glyph and label together — Stop in danger, Resume in success — and never a fill.

Two species remain, but they are drawn apart by behaviour rather than chrome: **Image is momentary** (its glyph can never fill), **Council, Web and Hands free are switches** (they can). Council takes `users-three` (`robot` already means the thinking phase); Hands free takes `car`. In landscape the labels go and the name moves onto the control (`iconOnly`, `labels={false}`); the column has no room for captions.

## Images (`OrbSatellite` deck + `AttachmentPopover`)

Images are the one composing control that produces content rather than a setting, and they live **inside the Image satellite** — nothing is inserted between the orb and the row, at any count (owner call, 2026-08).

- **At rest:** a plain `image` glyph captioned “Image”.
- **Tapped:** a small panel anchored to the satellite, on its empty state — one line (“No images in this conversation yet.”) and one action.
- **Adding** hands off to the **device's own picker** — camera or library, any number of pictures. The app draws nothing here.
- **On return** the panel closes itself and the glyph becomes the **deck**: the pictures themselves, one tile for one image, two for two, three for three and up, each layer behind the front one a little smaller and a little fainter. The caption becomes the count — “1 IMAGE”, “9 IMAGES” — so depth never has to count past three and **there is no badge**.
- **Tapped again:** the same panel, now holding every image in a row that **scrolls sideways**, each with its own delete control, and the same add action underneath.

Why this and not a strip or a tray: the deck fits the satellite's existing 44pt well inside its existing 64pt column, so the row measures 232×58 at forty images exactly as it does at none, the orb keeps its full diameter, and the stage never reflows as images come and go. The panel's height is constant too — one row of 64pt thumbs, three in view and the fourth as a sliver — so the count has no ceiling and needs no rule.

Attachments are **content, not state**: the deck replaces the glyph, but the glyph still never fills. Filling stays the switch's signal.

The panel follows `AnchoredMenu` (252 wide, panel radius, elevated surface, 6pt band before the action row, transparent click-away, no backdrop dim) and hangs 10pt above the row with its left edge on the satellite, so it opens out of the thing that was pressed. While a turn runs or a drive session is open the whole row rests at 38%, deck included, and the panel is unreachable until it ends.

**Still open:** how a message with images renders in the transcript — see `explorations/images-1-to-4.html`. `MessageImageAttachments` keeps its compact mode for that decision; its scrolling 128×96 composer strip is superseded here.

## Status line — removed

The upstream status line (phase dot · activity · conversation meta under the orb) is removed from the product (owner call, 2026-08): it read as alien and duplicated what the orb’s phase states, the settings sentence and the transcript handle already carry. Phase feedback lives in the orb; the transcript handle’s meta line owns conversation name and age.
## Composer and pager

Voice and text input are two pager pages.

- **Composer geometry** (from `src/screens/main/`): radius 15, border 1.5, padding 16/9/8, gap 10, field capped at 116pt, with a 46pt circular send button. Attach sits under the orb, reachable from both pages.
- **Pager indicator** (from `src/screens/main/voiceTextInputPager/`): two 4pt-tall bars, active 16 wide, idle 5, each centred in a 44pt target, the pair pulled together by ±12px. This is what ships.
- **Open decision:** an explored alternative puts a caret on each flank of the orb — it sits beside the thing that swipes, and the lit one points at the page you are not on. Whether the pager keeps the bars, gains the carets, or has both is an owner decision.

## Transcript handle (`TranscriptHandle`)

The transcript demoted to a peeking card above the bottom edge, reduced to a grip and the single word “Transcript” — no model, no age, no preview of the last reply. The route byline above the orb already names the conversation; repeating any of it on the handle read as noise once both existed on screen together, so the handle states only what it does (opens the transcript), not what is in it.

What it opens is a **sheet over the workspace**, not a new screen: the route and settings stay visible above it and dismissing returns you to the orb. The sheet header carries the same headline, “Transcript,” and nothing else — dismiss by pulling it down or tapping the backdrop.

## Landscape

Landscape keeps the same model — one composing row, transport in orbit, permanent footprint — icon-only, no labels, so a hands-free session can be ended there too. The settings control floats over the stage's top-right corner rather than taking a row of its own (`iconOnly`): the words cost the orb height the narrow column cannot spare, and the orb then owns everything between the byline's hairline and the control row, centred in it. Beyond that it sheds what it does not need: no swipe pager, no attach control, no settings sentence — and because the right pane has room, the transcript stops hiding. The orb sits centred in its column at 150pt with the icon controls pinned to the column's right edge. The left column is roughly 300pt after gutters; everything in it must hold at that width, one line tall.

## Retired with this design

`ResponseModeToggle` (the four-layout model switcher) and `PhaseAwareVoiceAction` (the phase-coloured voice bar) were **deleted** from the system in 2026-08. The orb plus the route byline replace both, at every model count and every phase; there is no small-orb variant to fall back to — give the orb its room. `WorkspaceStatusLine` and `DriveSessionControls` are gone for the same reason: their jobs moved into the orb and its satellite ring.
## Hands free

The hands-free loop (formerly "Drive Session", premium): voice activity detection against an ambient acoustic profile, a silence window with spoken countdown cues, auto-submit, auto-continue. **It is a switch, not a listening mode** (owner call, 2026-08): it wraps whichever input mode is chosen — push-to-talk or tap-to-talk — and turning it off resumes that mode. It sits in the composing row as the fourth control: the **car glyph**, captioned **“Hands free” on two 12px rows**, filling and taking the accent when on like every switch. No divider and no gap sets it apart — by species the boundary would fall after Image, by scope before Hands free, and one line cannot draw both — so the boundary is carried by behaviour instead.

- **It is the row's one deliberate session-scoped outlier.** Image, Council and Web describe the next question; Hands free describes the session. The row is otherwise per-question only, and the next session-scoped control that wants in has to find its own home, not cite this one.
- **It stays live while a turn runs, in both directions** — the exception to the row's 38% rest. On, it must be switchable off while he is still talking, because that is how the loop ends. Off, switching it on mid-answer means “keep going when this one finishes.”
- **Turning it on starts the loop at once**: he listens for you immediately. The orb keeps its ordinary phase appearances — idle between turns, recording when speech is detected — and the armed state is stated by the filled car and by the settings sentence (“Hands free: on”), never by a new orb state.
- **The orbit is unchanged by it.** Stop abandons the current turn; the switch owns the loop. Two verbs, two places, no overlap. Headset and car-remote hardware buttons toggle the switch, and the orb keeps working as the manual press.
- **Premium**: the switch is present in free edition and offers the upgrade on tap — more honest than a hidden third mode.
- The silence countdown stays spoken only — no on-screen chip.

**Deliberate departures from upstream:** upstream’s `DriveSessionControls.tsx` ships a dock row of three equal buttons (Pause auto · Repeat last · Resume auto) with pause/resume as a pair, one always disabled. The system retires the row, the mode, and the orbit's keys-at-idle exception with it (owner call, 2026-08): the loop collapsed into this one switch, and "Repeat last" was already covered by Restart, which replays the response from its first word.
