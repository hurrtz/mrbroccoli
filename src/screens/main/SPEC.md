---
status: active
code_paths:
  - src/screens/MainScreen.tsx
  - src/screens/main/**
dependencies:
  - src/hooks/**
  - src/services/voicePipeline/**
  - src/features/settings/**
validations:
  - npm run typecheck:app
  - npm test -- --runInBand --watchman=false
provenance:
  intent: history-backfilled
  validation: source-and-test-backed
last_validated_sha: 7db5c94
---

# Main Conversation Workspace Specification

## Purpose

The main workspace keeps a spoken conversation understandable and controllable
while many independent concerns are active: recording, transcription,
reasoning, search, streaming, speech playback, persistence, Hands free,
provider readiness, and secondary surfaces.

`MainScreen.tsx` is the composition root. Focused controllers under this
directory own lifecycle and interaction behavior; presentation components
receive already-derived state and callbacks.

## User Contract

- The primary action is the voice orb, the workspace's one loud element. It
  always represents the current voice phase: idle, recording, transcribing,
  brief thinking, searching, thinking, synthesizing, or speaking. One thick
  continuous ring says one thing at a time: the recording window, the complete
  turn from submission to first speech, then the spoken reply's read position.
  Individual processing-phase estimates are not visualized. Past the turn
  estimate the ring fills with red. Pausing speech preserves the measured read
  position and holds its interpolation until playback resumes. The gap between
  the core disc and the ring is only ever a gap: the screen reads through it in
  every phase. The orb is sized from the space the
  column actually leaves it, clamped between 120pt and its surface ceiling (196
  phone portrait, 150 phone landscape; 204-224 across regular-iPad states), so
  a transcript dock or landscape split simply makes it smaller.
- In portrait, left and right 44pt chevrons flank the measured orb. They make
  the voice/text pager discoverable without competing with the voice action.
  **Decision:** the pager is a closed circle — every decisive swipe and every
  chevron leaves the current surface, in either direction, so no navigation
  gesture is ever a dead end. With two pages that circle is a toggle, which is
  why both chevrons on a page carry the same destination and neither is
  permanently disabled; each chevron's accessible name states its destination
  rather than its direction. Both directions follow the finger and land the
  incoming surface on the side the swipe came from: the page that would
  otherwise sit off the far edge is drawn one whole cycle around, so a
  wrapping swipe shows the other surface rather than empty canvas. Rejected
  alternative: clamping the track between the two pages, which answered a
  wrapping drag with nothing moving and made a circle that existed only in the
  release handler. The chevrons sit in a stable sibling layer outside the pan
  recognizer, so an ordinary tap owns exactly one completed transition. The
  pressed side owns the incoming direction on every cycle: repeated right-arrow
  taps always bring the next surface from the right, and repeated left-arrow
  taps always bring it from the left. While visible, both keep their full
  active treatment and never inherit route readiness; during an active turn the
  layer is hidden and non-interactive rather than shown disabled. Image attach,
  Model Council,
  and Web Search stay in the satellite
  row below the stage and show their unavailable state instead of changing the
  workspace geometry.
- The orb remains in its measured slot even when a route is blocked or
  unavailable. It becomes disabled with the translated reason as its accessible
  name; an explicit notice beneath the stage is the only setup action and
  opens the owning settings page.
- Portrait places route and conversation settings in one quiet raised block,
  14pt below the top bar: two equal 44pt rows separated by a hairline. The
  leading row states who answers the next turn and at what effort; the second
  row states the effective conversation settings and is one complete press
  target. Landscape and regular iPad retain the uncontained route byline plus
  compact settings control because their narrow control columns cannot carry
  the block. The model list opens in a scrolling sheet; tapping an available
  model commits and closes immediately, with no Done step. With one configured
  model the first row becomes a credit line;
  effort is named, not plotted — the word alone carries it and routes without
  an adjustable effort read `Normal`;
  when no route is usable it renders nothing rather than another credential or
  setup card.
- The conversation's quick settings read as one muted line of labelled values,
  ordered as the sheet presents them. Hands free is prefixed while enabled.
  The complete 44pt row opens the conversation style sheet; its trailing glyph
  is decorative. Landscape floats that compact control over the stage's
  top-right corner as an icon instead of giving it a row: the words cost the
  orb height the narrow column cannot spare. At accessibility-large text,
  portrait keeps that labelled control but omits the decorative sentence and
  makes the satellite row icon-only. This preserves the complete blocked-route
  warning, status, and transcript affordance without overlap. Landscape keeps
  the same interactions and the warning's complete accessible name, but the
  constrained blocked-route card shows only its actionable label.
- **Decision:** one location has one meaning. The composing row permanently
  holds Image, Council, Web, and Hands free. Image, Council, and Web stay visible
  but rest at 38% during a turn or Hands-free loop; Hands free remains live in
  both directions. Turn transport orbits the orb: Back and Forward on its
  flanks, Restart and Stop on the lower diagonals, 34pt clear of the edge. The
  orbit reserves its full footprint even at idle, but its keys render only
  during a turn, so the orb never jumps when work begins. Stop is live through
  every turn phase; the three seek controls become live only while speaking.
  Transport verbs tint glyph and label only, and the silence countdown remains
  spoken rather than drawn.
- Restart rewinds the active playback reel to the response's first word without
  requiring the voice session to stop first, and is live only while he speaks.
- Back and Forward move between the reply's paragraphs. Back means the start of
  the paragraph being read, unless it began under two seconds ago, when it
  means the paragraph before; Forward always means the next paragraph's start.
  Both are live only once the reply holds more than one paragraph.
- **Decision:** paragraph seek is built in JavaScript rather than in the native
  queue. That queue takes whole clips (`prepare`, `enqueue`, `start`, `pause`,
  `resume`, `stop`) and cannot seek inside one, but it is chunk-based and
  reports the item it starts, so
  [`usePlaybackReel`](../../hooks/audioPlayer/usePlaybackReel.ts) remembers the
  reply's clips, tracks which is playing, and replays the tail from the chosen
  paragraph. Rejected alternative: a native seek API, which would have needed
  matching iOS and Android work for a control the queue already makes
  expressible.
- While he speaks, the orb's arc carries how much of the reply has been read,
  weighted by what each paragraph says, so a seek moves the ring by the
  paragraph it skips rather than by an even step. The measured position still
  advances at real clip boundaries, while a UI-thread linear estimate moves
  continuously from that position to the active clip's measured end. The
  estimate uses spoken character weight only as presentation timing and is
  corrected by every playback-start callback; it never controls or claims the
  native clip duration. The arc only runs backwards when the listener sends it
  back, and a streamed reply growing later must not drag it through content
  already read. Streaming, wait-mode, native, provider, and Restart playback
  all preserve the same paragraph markers. Once the response is sealed, a
  natural queue drain completes the arc; a temporary gap while more streamed
  clips can still arrive does not. Native teardown for Stop or paragraph seek
  is not a natural drain, and a superseded capture or replay session cannot
  seal the active response's reel.
- Paragraph Back and Forward restart the same reply atomically. They keep the
  rendered speaking phase and the already-primed audio session through native
  clip teardown, so the workspace does not expose an idle frame and the next
  paragraph does not begin through a fresh audio-session fade-in. Explicit Stop
  and natural drain retain the full teardown behavior.
- **Decision:** the workspace carries no status line and no session-details
  sheet. The orb states the phase visually and announces every phase change to
  assistive technology, the route byline names the response route, the
  transcript handle names only the surface it opens, and Settings owns the
  route summary — a permanent row restating all of that was chrome between the
  satellites and the transcript. Rejected alternative: moving its info control
  onto the handle or the top bar, which would have kept a surface whose content
  is available in two other places.
- The transcript remains the durable record. Streaming text may be projected as
  a temporary assistant message, but only persisted messages become history.
  It reads as one continuous script with a fixed speaker margin, provider or
  user identity, and a quiet connecting line rather than separate message
  cards. Opening an existing conversation folds every row; only a newly
  arriving row opens automatically. Edit, copy, branch, share, replay, and
  report actions remain outside the folded content and are therefore always
  reachable. Compact source, route, and duration metadata sits inside the
  foldable message content when usage details are enabled, so a folded row
  hides it and an opened row exposes one button. That button opens a scrollable
  receipt modal rather than expanding inline. Swiping a row exposes explicit
  removal.
  In portrait the transcript demotes to a peeking handle at the bottom edge
  with a grip and the translated title `Transcript`; the visible handle never
  varies with message count and does not repeat model, age, or reply content.
  Its accessible name still states the real message count. It opens over the
  workspace as one continuous canvas with an 18-point horizontal
  gutter. Its only chrome is the grip plus the stable transcript title; the
  peek and open sheet use the same centred headline typography, and the roomy
  header is the labelled tap-and-pull close action. It has no repeated
  conversation title, image or conversation-setting controls, or footer close
  action.
  Expanded turn metrics are the only raised
  surface inside the script. In landscape it stays inline in the right pane.
  Actions inside the portrait sheet that open Speaking settings dismiss the
  transcript completely before presenting the sibling modal. The same
  sequencing applies in reverse: Data & privacy closes
  its archive sheet and Settings before opening the sessions drawer at the
  expanded Archived group.
- Branching a transcript message is a non-destructive action and begins
  immediately from that row; it does not interpose a platform confirmation.
  Destructive conversation deletion remains the one action that uses the
  platform alert contract.
- Provider, model, listening, speaking, fallback, and usage labels describe the
  effective route, not merely the last picker interaction.
- A user can interrupt or cancel an active turn without a late callback
  restarting recording, playback, or another request.
- Text and image submission use the same conversation and route semantics as a
  spoken turn where their capabilities overlap.
- Pending images live in the Image satellite's fixed-size thumbnail deck and
  never add a row to the stage. Its anchored, undimmed popover shows a sideways
  scrolling list with per-image removal and Add; it closes after the native
  picker returns with new images. Persisted message images wrap into a
  transcript gallery so four or more attachments remain reachable through
  normal transcript scrolling.
- Adding an image opens an app-owned source sheet. Camera or photo-library
  presentation waits until that sheet has completed native dismissal on iOS
  and uses a bounded Android fallback, so native pickers never compete with an
  existing modal controller. A fresh image-provider recipient still requires
  explicit app-owned disclosure before the turn continues.
- Model Council first-use and high-call-count warnings are app-owned,
  non-dismissible disclosures with explicit cancel and enable actions. They
  suppress workspace toasts while visible and must preserve the exact model,
  round, and call count that the user reviewed.
- Toast feedback is presented above the active native surface, including the
  transcript drawer, settings sheets, and receipt modal; it is never queued
  invisibly behind them.
- The pager always opens on voice. The composer stays available through its
  labelled 44pt chevrons and horizontal gesture, but route readiness never
  automatically pages the workspace to text. The composer is outlined in the
  accent at rest, not only when focused. Neither a chevron nor a swipe focuses
  the composer or opens the keyboard; only a direct field action does. A layout
  remount restores focus only when the field actually held it beforehand.
- Push-to-talk alone owns press-in and press-out recording boundaries.
  Toggle-to-talk receives one completed orb press per tap; Hands free wraps
  either mode without adding a third persisted input-mode value.
- A message telling someone to type must leave typing working. This separates
  an unusable voice route from a prompt block, which stops both routes.
- Controls that cannot be used at all stay visible but disabled when they are
  part of the fixed home-stage composition: Web Search without a configured
  provider and image attachment on a route that cannot accept one. Their
  accessibility label states why, and Settings owns the remedy. Controls that
  are only briefly unavailable, such as during an active turn, also stay
  visible and disabled.
- The satellites — Image, Model Council, Web Search, and Hands free — sit in a row
  under the portrait orb. The orb or composer and that row form one vertically
  centered stage cluster with the design-system's 18-point separation; surplus
  height surrounds the cluster instead of opening a device-dependent gap or
  pushing the controls down against the transcript handle. They change how the
  next turn is answered, so they
  read as notes on that action rather than settings to pass through on the way in.
  All targets are borderless at rest. Active switches fill and accent their
  glyph and label; an accent-soft squircle appears only while pressed. During a
  turn the row never changes species because transport belongs to the orbit.
- Landscape retains Council, Web, and Hands free but omits image attachment and
  the portrait quick-settings sentence. The portrait Image satellite owns the
  attachment entry point; the composer owns only the pending-attachment preview
  and its remove action.
- **Decision:** compact iPad windows are the phone workspace wholesale. At
  regular width the conversations surface is a permanent leading sidebar —
  300pt in portrait, 336pt in undocked landscape, and 296pt in the wide
  three-pane layout — with the same rows, search, archive state, actions, and
  New control as the phone drawer. It has no backdrop, close action, or menu
  button; selection and New keep it mounted. Its header also retains the global
  Settings entry.
- Regular iPad keeps the route byline centred, the conversation-settings
  control at the trailing edge, and the voice/composer stage in the remaining
  content pane. Portrait and narrower regular landscape keep the transcript
  handle and sheet, whose body is capped at 720pt. Wide regular landscape docks
  one transcript at the trailing edge and removes every open/close affordance.
  **Decision:** docking begins at 1024pt of window width, not at every regular
  landscape orientation, because the approved sidebar and transcript widths
  otherwise consume the whole 680pt regular boundary.
- Crossing compact, regular, and docked boundaries preserves the active turn,
  composer surface and draft. A text input that actually held focus restores
  that focus after reparenting; a swipe that merely selected the text page does
  not open the keyboard. Drawer or transcript modal state that becomes
  inapplicable is retired instead of reopening after a later resize.
- Conversation, settings, status, receipt, setup, and diagnostics surfaces do
  not replace the primary workspace or mutate one another implicitly.

## Composition Rules

- `MainScreen.tsx` may connect hooks and services, but reusable persistence,
  provider, and pipeline behavior belongs below the screen layer.
- `mainScreenViewModel.ts` derives display state from runtime truth. Presentation
  components do not rediscover provider capabilities or pipeline phases.
- UI-only state lives in focused controllers such as
  `useMainScreenUiState.ts`; data ownership remains with settings and
  conversation hooks.
- Long-running actions own an abort or stale-result guard. Cleanup must be safe
  after navigation, app backgrounding, conversation switches, and unmount.
- The active conversation is snapshotted for a turn. A completion must not be
  written into a different conversation selected while work was in flight.

## Provider Readiness

The response runtime is BYOK-only. The active response mode must resolve to a
configured provider key and a currently usable provider model. Provider
readiness is derived from that route; local speech-model readiness can satisfy
listening or speaking only and can never satisfy response generation.

A missing or blocked provider route leaves the workspace geometry intact and
exposes one contextual action to Connections or Thinking. The action dismisses
its current native surface before presenting Settings. There is no first-run
wizard, local-response profile, edition projection, purchase sheet, or
entitlement gate.

**Decision:** Legacy stored local response routes and onboarding fields are
normalized away on settings load. Configured provider response modes survive
that migration, while optional local STT/TTS preferences remain intact.

## Hands Free

Hands free is an explicit session state machine around the selected manual
input mode, not a third persisted mode or repeating timer:

- every app session starts disabled;
- enabling engages the loop and immediately requests listening when idle;
- a completed reply may request one subsequent arm only while the session is
  engaged and automatic continuation remains enabled;
- disabling clears a pending arm without cancelling the current response;
- enabling during a response arms the next turn rather than interrupting it;
- Stop abandons the current turn but leaves the loop enabled and requests the
  next turn when safe;
- background suspension temporarily disengages capture while preserving the
  enabled switch for foreground re-engagement; and
- native remote controls and the on-screen car switch dispatch the same
  state-machine transition.

Acoustic cues describe state changes but never substitute for visible or
screen-reader-accessible state.

An engaged recording does not auto-submit until voice activity has confirmed
real speech and then observed ten seconds without speech. Every metering sample
participates even when consecutive samples carry the same dB value; React value
deduplication must not prevent the multi-sample speech attack or release from
completing. The acoustic profile follows the active audio route,
learns ambient and speech levels across turns, and resets when the route
changes. Countdown cues cover only the final three seconds and do not alter the
detector's deadline.

## Conversation-Level Controls

Per-conversation instructions, style, speech behavior, title,
and route overrides belong to the active conversation. Global settings remain
defaults for new conversations and existing conversations without an override
unless an explicit product rule says otherwise. The home sheet exposes only
session overrides and can remove them as a group so the session resumes
inheriting current and future defaults; the Thinking page owns the standard
length and tone.

The sessions drawer is flat and recency-first. Pinned and Archived sessions
live in collapsible groups around the everyday Earlier list; active state is a
row fill, never a branch rail. Each row shows only title, pin/lock state,
date, visible message count, and one provider mark per model. Forks retain a
small link to their root session. Search stays docked at the bottom, and the
row's quick verbs open as a menu anchored at that row's own control —
no dim — grouping organize, identity and out actions with delete last and
alone. Bottom sheets stay reserved for configuration surfaces. Data & privacy
may open the drawer with Archived already expanded; this is an explicit landing
state, not a persisted change to the user's normal drawer layout. On regular
iPad that landing state updates the already-mounted sidebar; it does not depend
on remounting a modal drawer.

A locked row remains visible in that overview with a lock mark, but selecting
it opens app-owned authentication before conversation selection. Password is
always available; Face ID or fingerprint is offered only when its authenticated
SecureStore marker exists. Failed or cancelled authentication keeps the
overview in place, does not load the conversation, and shows the localized
equivalent of “The session was not unlocked, so it was not loaded.” Locking an
active conversation first resets recording, generation, Hands-free state, and
playback, then clears it from the workspace. The setup copy explicitly states
that this access control does not encrypt the conversation database. Until the
session is unlocked, its quick menu exposes only authentication/removal and
destructive deletion; content-dependent organization and export actions remain
unavailable.

The lock setup dialog keeps its complete card and footer above the iOS keyboard
so Set lock remains reachable on compact iPhones. Once either password field
takes focus on iOS, the already-read explanatory copy collapses so both fields
and the footer fit without overlapping. Password and confirmation text use the
standard 12-point horizontal control inset for both placeholders and entered
values.

Branching creates a new conversation through the conversation hook; the screen
must not splice or overwrite the current transcript. Deleting or restoring a
conversation must select a valid remaining conversation before accepting a new
turn.

## Status and Diagnostics

- User-facing status is semantic and localized; raw provider or exception text
  belongs only in sanitized diagnostics.
- The status-details surface explains the requested and actual routes,
  fallback, context, search, speech, timing, and usage evidence retained on the
  assistant turn.
- Accessibility announcements occur on meaningful phase boundaries, not every
  animation frame, audio level, timer tick, or streamed token.
- Persisted or copied debug data must already be sanitized by the diagnostics
  boundary.

## Store-Promo Fixtures

Deterministic screenshots may inject conversations, phases, provider routes,
drawers, and settings only in the `.maestro` application identity. Fixture
state must never become a hidden production feature or be reachable in the
production package.

## Change Checklist

When changing the workspace:

1. update the relevant focused controller instead of growing presentation
   components indiscriminately;
2. trace turn cancellation, app lifecycle, and conversation-switch behavior;
3. keep visual phase, status copy, accessibility announcements, and remote
   controls consistent;
4. verify provider readiness and legacy-settings normalization;
5. add a regression test at the state-machine, hook, or presentation boundary;
6. verify compact and regular iPad resizing when layout ownership changes; and
7. update [`DESIGN.md`](./DESIGN.md) when orchestration or ownership changes.
