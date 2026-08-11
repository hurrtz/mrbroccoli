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
- When the voice route is blocked or unavailable, the labelled bar replaces
  the orb in its slot: a mute orb would hide the one thing worth saying there.
- The route byline above the stage states who answers the next turn and at
  what effort — one line at every model count, with the model list in a sheet
  opened from it. With a single configured model it becomes a credit line.
  `ResponseModeToggle` and `PhaseAwareVoiceAction` remain in the codebase,
  correct anywhere a picker grid or a docked bar is wanted.
- The conversation's quick settings read as one muted line under the byline,
  with a single control opening the conversation style sheet.
- The status line under the orb pairs a phase dot with what is happening and
  what the conversation is; its info control opens the session details.
- The transcript remains the durable record. Streaming text may be projected as
  a temporary assistant message, but only persisted messages become history.
  In portrait the transcript demotes to a peeking handle at the bottom edge
  and opens as a sheet over the workspace; in landscape it stays inline in the
  right pane.
- Provider, model, listening, speaking, fallback, and usage labels describe the
  effective route, not merely the last picker interaction.
- A user can interrupt or cancel an active turn without a late callback
  restarting recording, playback, or another request.
- Text and image submission use the same conversation and route semantics as a
  spoken turn where their capabilities overlap.
- When the voice control cannot be pressed -- no route at all, nothing that can
  hear the user, or a block with no action behind it -- the workspace shows the
  composer and the control retires carrying the reason. A control the user
  cannot press is not the one to land them on. Routes settle after the pager
  mounts, so this reacts to the transition rather than only seeding the initial
  surface; it moves the user once and does not fight a later swipe back. The
  idle status follows that automatic move while the user's remembered surface
  preference remains unchanged.
- The composer is outlined in the accent at rest, not only when focused. It is
  the other half of the primary action, and it carries the workspace whenever
  voice cannot.
- A message telling someone to type must leave typing working. This separates
  an unusable voice route from a prompt block, which stops both routes.
- Controls that cannot be used at all are absent rather than disabled: Web
  Search without a configured provider, and image attachment on a route that
  cannot accept one. A switch that cannot move reads as broken, and the reason
  it cannot move lives in Settings. Controls that are only briefly unavailable,
  such as during an active turn, stay visible and disabled.
- The satellites — image attach, Model Council, and Web Search — sit in a row
  under the orb. They change how the next turn is answered, so they read as
  notes on that action rather than settings to pass through on the way in.
  Toggles carry a round well that tints when on; momentary actions stay
  borderless. During speech the row also carries the stop and barge-in
  actions, because the orb has one press.
- The satellites own the image attachment entry point in both orientations;
  the composer owns only the pending-attachment preview and its remove action.
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
workspace, with a dismissible intro banner above it that opens a seven-step
full-screen introduction: the greeting, what setup actually requires, the
automatic one-tap setup, the one requirement, the two optional pieces, and
what Premium adds.

The automatic setup step carries the shared `AutoSetupCard` with its header
hidden — the step title and body already say what it is. The job behind it
lives above every screen that shows it (`useAutoSetupJob` at the composition
root): the introduction's step, the top of On-device AI settings, and the
home-screen `BackgroundTaskBar` are three views of one state, so leaving the
introduction mid-install keeps the download running and reachable. Its six
states run offer → scanning → proposal → installing → done or failed; nothing
downloads before the proposal has been seen; the staged ~2.5s measurement
reveals only real device readings; a failure keeps completed models and retry
resumes the queue rather than starting over; and the outcome is announced by
the card where the card is visible, by a toast anywhere else — never both.

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
which retires on the last step.

**Decision:** The last step ends at the close control rather than offering its
own "start using the app" action. A second exit next to the one already in the
header says the flow is something to escape.

**Decision:** The banner offers no dismissal until the introduction has been
opened at least once, and a completed purchase removes it outright. An exit
available before the card has ever been read makes getting rid of it the
easiest thing to do on a first launch; after a purchase the invitation has
nothing left to invite. It stays reversible from App & diagnostics.

**Decision:** Optional steps mark themselves with a rule carrying the word
rather than a pill above the heading. A badge competed with the heading and
read as a status on the step; a rule states the same thing in the reading order
it belongs to. Headings are centred, because each step is a single column with
nothing beside it.

**Decision:** Speech steps are marked optional and say why skipping is safe --
typing replaces listening, and the device's own voice replaces speaking. The
speaking step carries a language picker over the bundled examples, because
letting someone hear the app in their own language argues for setting it up
better than a claim does.

The same sheet opens at its final step whenever a turn is attempted with no
usable route, so the microphone is never a dead end. Provider keys are entered
in the settings provider panel and local models are managed on the on-device
settings page; onboarding routes to those surfaces rather than duplicating
them.

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
work, not settings in general. The download action in particular opens the
on-device page instead of starting a headless download: that page owns
progress, verification and failure, and a download with no visible surface
looks like a button that did nothing. A Free caller asking for a Premium page
lands on the settings overview rather than a locked screen, so the speech steps
route Free users to the on-device page.

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
