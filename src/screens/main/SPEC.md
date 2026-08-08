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

- The primary action always represents the current voice phase: idle,
  recording, transcribing, brief thinking, searching, thinking, synthesizing,
  or speaking.
- The transcript remains the durable record. Streaming text may be projected as
  a temporary assistant message, but only persisted messages become history.
- Provider, model, listening, speaking, fallback, and usage labels describe the
  effective route, not merely the last picker interaction.
- A user can interrupt or cancel an active turn without a late callback
  restarting recording, playback, or another request.
- Text and image submission use the same conversation and route semantics as a
  spoken turn where their capabilities overlap.
- The transcript header owns the image attachment action in both orientations;
  the composer owns only the pending-attachment preview and its remove action.
  The action stays hidden when the edition cannot attach images and disabled
  while a turn is active.
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
workspace, with a dismissible intro banner above it that opens a four-step
sheet: what the app is, the three ways to power it, an audio example, and a
choice between connecting a provider and installing on-device models.

The same sheet opens at its final step whenever a turn is attempted with no
usable route, so the microphone is never a dead end. Provider keys are entered
in the settings provider panel and local models are managed on the on-device
settings page; onboarding routes to those surfaces rather than duplicating
them.

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
