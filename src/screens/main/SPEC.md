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
reasoning, search, streaming, speech playback, persistence, Drive Session,
edition policy, and secondary surfaces.

`MainScreen.tsx` is the composition root. Focused controllers under this
directory own lifecycle and interaction behavior; presentation components
receive already-derived state and callbacks.

## User Contract

- The primary action is the voice orb, the workspace's one loud element. It
  always represents the current voice phase: idle, recording, transcribing,
  brief thinking, searching, thinking, synthesizing, or speaking. Two
  concentric rings carry two clocks — the inner one the current phase against
  itself, the outer one the whole turn against its speech-start estimate; past
  the estimate both fill with red. At rest the orb draws a plain halo, not two
  empty tracks. The orb is sized from the space the column actually leaves it,
  clamped between 96pt and its ceiling (196 portrait, 150 landscape), so the
  intro banner or a landscape split simply makes it smaller.
- In portrait, left and right 44pt chevrons flank the measured orb. They make
  the voice/text pager discoverable without competing with the voice action;
  the inactive direction is visually quiet and unavailable directions remain
  disabled. Image attach, Model Council, and Web Search stay in the satellite
  row below the stage and show their unavailable state instead of changing the
  workspace geometry.
- The orb remains in its measured slot even when a route is blocked or
  unavailable. It becomes disabled with the translated reason as its accessible
  name; an explicit notice beneath the stage is the only setup action and
  opens the owning settings page. A turn control or text submission never opens
  the introduction.
- The route byline above the stage states who answers the next turn and at
  what effort — one line at every model count, with the model list in a sheet
  opened from it. With a single configured model it becomes a credit line;
  routes without an adjustable effort read `Normal` without effort dots;
  when no route is usable it renders nothing rather than another credential or
  setup card.
  `ResponseModeToggle` and `PhaseAwareVoiceAction` remain in the codebase,
  correct anywhere a picker grid or a docked bar is wanted.
- In portrait, the conversation's quick settings read as one muted
  tone-length-voice line under the byline, with a single control opening the
  conversation style sheet. Landscape omits this line to preserve the two-pane
  stage. At accessibility-large text, portrait keeps that labelled control but
  omits the decorative sentence, uses the title-only introduction banner, and
  makes the satellite row icon-only. This preserves the complete blocked-route
  warning, status, and transcript affordance without overlap. Landscape keeps
  the same interactions and the warning's complete accessible name, but the
  constrained blocked-route card shows only its actionable label.
- The status line under the orb pairs a phase dot with what is happening and
  what the conversation is; while idle it names the conversation and its
  localized relative age. Runtimes without relative-time formatting fall back
  to a localized compact timestamp instead of failing the workspace. Its info
  control opens the session details.
- The transcript remains the durable record. Streaming text may be projected as
  a temporary assistant message, but only persisted messages become history.
  It reads as one continuous script with a fixed speaker margin, provider or
  user identity, and a quiet connecting line rather than separate message
  cards. Opening an existing conversation folds every row; only a newly
  arriving row opens automatically. Copy, branch, share, replay, and full turn
  metrics appear only on an open row, while compact metadata remains visible
  when usage details are enabled. Swiping a row exposes explicit removal.
  In portrait the transcript demotes to a peeking handle at the bottom edge
  whose metadata names the latest model and localized age, with the same safe
  timestamp fallback on runtimes without relative-time formatting. It opens
  over the workspace as one continuous canvas with an 18-point horizontal
  gutter. Its only chrome is the grip, which is also the labelled close action;
  it has no repeated conversation title, image or conversation-setting
  controls, or footer close action. Expanded turn metrics are the only raised
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
- Adding an image opens an app-owned source sheet. Camera or photo-library
  presentation waits until that sheet has completed native dismissal on iOS
  and uses a bounded Android fallback, so native pickers never compete with an
  existing modal controller. A fresh image-provider recipient still requires
  explicit app-owned disclosure before the turn continues.
- Model Council first-use and high-call-count warnings are app-owned,
  non-dismissible disclosures with explicit cancel and enable actions. They
  suppress workspace toasts while visible and must preserve the exact model,
  round, and call count that the user reviewed.
- The pager always opens on voice. The composer stays available through its
  labelled 44pt chevrons and horizontal gesture, but route readiness never
  automatically pages the workspace to text. The composer is outlined in the
  accent at rest, not only when focused. A chevron selection may focus the
  composer as an explicit text action; swiping to it preserves keyboard state
  and never opens the keyboard by itself.
- Push-to-talk alone owns press-in and press-out recording boundaries. Toggle
  and Drive modes receive one completed orb press per tap; they must not also
  start on press-in and stop on press-out.
- A message telling someone to type must leave typing working. This separates
  an unusable voice route from a prompt block, which stops both routes.
- Controls that cannot be used at all stay visible but disabled when they are
  part of the fixed home-stage composition: Web Search without a configured
  provider and image attachment on a route that cannot accept one. Their
  accessibility label states why, and Settings owns the remedy. Controls that
  are only briefly unavailable, such as during an active turn, also stay
  visible and disabled.
- The satellites — image attach, Model Council, and Web Search — sit in a row
  under the portrait orb. They change how the next turn is answered, so they
  read as notes on that action rather than settings to pass through on the way in.
  Toggles carry a round well that tints when on; momentary actions stay
  borderless. During speech the row also carries the stop and barge-in
  actions, because the orb has one press.
- Landscape retains the Council and Web toggles but omits image attachment and
  the portrait quick-settings sentence. The portrait Image satellite owns the
  attachment entry point; the composer owns only the pending-attachment preview
  and its remove action.
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

## Effective Edition Behavior

Free mode is a complete offline experience rather than Premium with random
controls disabled. `useFreeOfflineMode.ts` derives a viable local response,
listening, and speaking profile from installed and benchmarked capabilities.
The derived effective settings drive the turn and status UI without corrupting
the user's persisted Premium choices.

Premium exposes hosted providers, BYOK, configurable routes, web search, Uber
Mode, provider speech, and advanced conversation controls. Entitlement state
comes from the Premium context; the screen does not infer it from the presence
of a key or a local model.

**Decision:** Switching editions must be reversible. Free-mode adaptation is a
runtime projection, not a destructive settings migration. Completing Free
setup preserves configured provider response modes alongside the local Free
routes; the Free runtime ignores them and they return untouched with Premium.

## Onboarding

There is no blocking setup surface. A new install opens directly into the
workspace, with a dismissible intro banner above it that opens a three-step
full-screen introduction: a welcome that demonstrates instead of describing,
one setup screen with a single green path, and a live test where the user
judges the result.

**Decision:** The three steps replace the earlier seven-page wizard (design
system, owner-resolved 2026-08). Premium appears nowhere in the flow — the
first Premium surface a new user meets is the settings overview, after the
app has proven itself. The welcome step shows a stored dialogue whose crisp
final question is the question the bundled recording actually answers, in
every language; switching the language swaps the on-screen dialogue and the
audio together so the pairing holds. The manual catalogue behind the
setup step's switch renders real route state and hands acquisition to the
owning stage pages (Thinking, Listening, Speaking); the fully inline
download-test-unlock lifecycle inside the flow remains an open follow-up.

**Decision:** First-run integrity: until the introduction has been completed
once (`introCompleted`), the flow offers no close control, step two's forward
action stays disabled until a reasoning model is actually running, and step
three's Done stays disabled until one ephemeral test turn has completed. A
re-entry restores close on steps one and two and unlocks both gates; step
three never shows close — Done is the exit.

**Decision:** The test turn is ephemeral by construction: it runs one real
voice-pipeline turn on the user's configured routes with an empty history and
callbacks that hold only local state, so nothing reaches the conversation
store. The number shown is release-to-speech latency — the figure that
improves when routes change.

The automatic setup step carries the shared `AutoSetupCard` with its header
hidden — the step title and body already say what it is. The job behind it
lives above every screen that shows it (`useAutoSetupJob` at the composition
root): the introduction's step and the App & diagnostics setup group plus the
home-screen `BackgroundTaskBar` are
views of one state, so leaving the introduction mid-install keeps the download
running and reachable. Its six
states run offer → scanning → proposal → installing → done or failed; nothing
downloads before the proposal has been seen; the staged ~2.5s measurement
  reveals only real device readings; a transfer failure keeps completed models
  and retry resumes the queue rather than starting over. A persisted completed
  profile is rechecked against pinned installs and current-device benchmarks on
  the next launch; a ready profile restores the card's Ready verdict, while a
  stale benchmark proposes testing only. Completing the automatic install
  persists that same completion marker, so this revalidation path also applies
  after a later app launch. A zero-byte proposal uses neutral setup
  wording rather than claiming it will download again. When a model instead
  fails its device benchmark, retry re-runs selection so the durable result can
  propose the next viable model without discarding verified downloads. The
  outcome is announced by the card where the card is visible and by the home
  `BackgroundTaskBar` otherwise — never both. The completed home row remains
  available briefly so its destination is actionable; install failure remains
  there until the user opens setup or retries. Setup progress and outcomes do
  not use transient toasts.

**Decision:** The introduction follows the app's light or dark theme. Only the
workspace banner keeps a palette of its own -- violet, in both themes -- because
it is the one surface that has to interrupt. An earlier version made the whole
flow permanently dark so it would read as a distinct place; in a light app that
landed as two products stitched together.

**Decision:** Steps are walkable in both directions -- by swiping, from the
stepper, and from the header back control -- and the stepper draws dots with a
dash for the current position rather than a "step 4 of 6" label. A one-way flow
made the last step a dead end: someone there could neither check what they had
skipped nor revisit a decision, and a counter said where they were but nothing
about what they had passed. Back sits in the header beside the close control
because both are ways out of the flow; the footer carries only forward motion,
which becomes a labelled Done action on the last step. The final action stays
where forward motion has lived throughout the flow; removing it left an empty
gap that looked like a missing control rather than a deliberate ending.
Header controls expose 44-point touch targets around 40-point visual faces.
The welcome step's language picker isolates assistive focus and excludes its
backdrop from the accessibility tree.

**Decision:** The banner offers no dismissal until the introduction has been
opened at least once, and a completed purchase removes it outright. An exit
available before the card has ever been read makes getting rid of it the
easiest thing to do on a first launch; after a purchase the invitation has
nothing left to invite. It stays reversible from App & diagnostics.

**Decision:** Headings are centred, because each step is a single column with
nothing beside it. In the setup step's manual catalogue, each pipeline group
carries a Required or Optional tag pill on its caption — the required group is
the one hard requirement, and the optional groups say what already covers
them: the phone's own recognizer and voice. The welcome step carries the
language picker over the bundled examples, because letting someone hear the
app in their own language argues for setting it up better than a claim does.

In landscape, the workspace invitation contracts to the approved 48-point,
title-only banner so the voice stage remains stable. Portrait keeps the full
title, explanation, action, and eligible dismiss control.

Transient toasts belong only to the main workspace layer. If a sheet, drawer,
introduction, or full-screen secondary surface is open, one pending toast waits
without consuming its display interval and starts its four-second clock only
after that surface closes. Newer notices still replace older ones.

The introduction is opened from its banner, never as a side effect of attempting
a turn. The manual catalogue shows every route at a glance — the system route,
the recommended-tier on-device models with their real install and test state,
and the provider path — so the default decision is judgeable on that screen;
"More models" is the only hand-off per group. Provider keys are entered under
Connections; manual local LLM, STT, and TTS acquisition belongs to Thinking,
Listening, and Speaking respectively.
Blocked Free-runtime notices lead to the shared automatic setup under App &
diagnostics rather than duplicating setup or hijacking the introduction.

Speech-input readiness follows the selected backend. The local route reads
`localSttModelId` directly; provider picker state is not evidence that a
downloaded recognizer is selected. Completing an automatic profile must make
its verified local recognizer immediately available on the home voice surface.

**Decision:** The provider route leads to the purchase rather than to the
provider page, because provider keys are a Premium capability. The purchase
sheet opens over the introduction and leaving it without buying returns to the
step it was opened from: backing out of a purchase should not also cost someone
the introduction they were part-way through.

**Decision:** A model download holds a screen wake lock and runs under an
Android `dataSync` foreground service for its whole duration, and can be
cancelled from the control that started it. Downloads run inside the app
process, including the ones the speech runtime fetches for itself, so Doze,
battery saver, and an app switch each cut a multi-gigabyte transfer within
about a minute. The wake lock alone only answers a sleeping screen while the
app is in front. iOS needs no service: its long transfers already run on a
background URL session.

**Decision:** Every onboarding action opens the settings page that owns the
work, not settings in general. Manual response, recognition, and voice actions
open Thinking, Listening, and Speaking, where download progress, verification,
and failure remain visible. The background automatic-setup row opens App &
diagnostics, the page that owns that shared job.

**Decision:** Setup stopped being a gate. Requiring a multi-gigabyte download
before the app could be seen made the setup cost the first impression. The
trade is that a user can now reach a microphone with nothing configured, which
the contextual entry point exists to answer.

**Decision:** An install that already has provider keys starts with the banner
dismissed. It has nothing to be introduced to.

**Decision:** The audio examples are bundled, one per interface language,
roughly twenty-one megabytes in total. Store-hosted on-demand delivery was
built and removed: it cost an iOS app extension and a Play Core dependency to
save an amount nobody would notice once the content settled at one message per
language instead of six. Every install carries all nineteen.

Each clip carries a visible pre-recorded label and never plays automatically,
so it cannot be read as what the user's own configuration will produce. Every
clip is loudness-matched to -16 LUFS; the delivered recordings spanned -15.0 to
-30.3 LUFS, and without matching a listener would strain at one language and be
startled by the next.

**Dependency:** The app holds no audio session while idle, so the voice pipeline
owns the device rather than keeping it open. Example playback activates the
session on demand and holds it across a language change: releasing the previous
player would otherwise tear the session down and silence the clip the next one
was about to play, with no error surfacing anywhere.

## Drive Session

Drive Session is an explicit state machine, not a repeating timer:

- entering the mode enables automatic continuation but does not silently begin
  recording;
- engaging authorizes the active hands-free session;
- a completed reply may request one subsequent arm only while the session is
  engaged and automatic continuation remains enabled;
- pause clears a pending arm and preserves a safe stopped state;
- resume requests a new arm explicitly;
- suspend, mode exit, app lifecycle changes, cancellation, or fatal turn
  failure disengage the session; and
- remote controls and large on-screen controls dispatch the same state-machine
  events.

Acoustic cues describe state changes but never substitute for visible or
screen-reader-accessible state.

## Conversation-Level Controls

Per-conversation instructions, style, speech behavior, privacy, title, memory,
and route overrides belong to the active conversation. Global settings remain
defaults for new conversations unless an explicit product rule says otherwise.

The sessions drawer is flat and recency-first. Pinned and Archived sessions
live in collapsible groups around the everyday Earlier list; active state is a
row fill, never a branch rail. Each row shows only title, pin/privacy state,
date, visible message count, and one provider mark per model. Forks retain a
small link to their root session. Search stays docked at the bottom, and the
row action sheet owns automatic naming, archive, privacy, memory,
share/copy, and destructive actions. Data & privacy may open the drawer with
Archived already expanded; this is an explicit landing state, not a persisted
change to the user's normal drawer layout.

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

Deterministic screenshots may inject conversations, phases, edition state,
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
4. verify both Free effective settings and Premium persisted settings;
5. add a regression test at the state-machine, hook, or presentation boundary;
   and
6. update [`DESIGN.md`](./DESIGN.md) when orchestration or ownership changes.
