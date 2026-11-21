---
status: active
code_paths:
  - src/services/voicePipeline.ts
  - src/services/voicePipeline/**
dependencies:
  - src/services/llm/
  - src/services/conversationKnowledge/
  - src/services/webSearch/
  - src/services/tts/
  - src/services/whisper/
validations:
  - npm test -- --runInBand --watchman=false __tests__/services/voicePipeline.test.ts __tests__/services/voicePipelineAiSharing.test.ts __tests__/services/tts.test.ts __tests__/services/whisper.test.ts
  - npm run typecheck:app
provenance:
  intent: history-backfilled
  validation: test-backed
last_validated_sha: b33648e
---

# Voice Pipeline Specification

## Purpose

The voice pipeline executes one user turn from captured audio or submitted text
through context preparation, optional grounding/deliberation, response
generation, optional spoken playback, persistence callbacks, and cleanup.

It is the shared execution path for normal conversation, text submission, and
Drive Session. UI state remains in screen/hooks; provider and native operations
remain in services.

Retrying a transcript reply uses the current output route. Starting the retry
clears that reply’s speech error and its actions. Only a new failure restores
them. Other notices and other messages keep their own history.

## Input Contract

A pipeline run receives an immutable snapshot of:

- turn and conversation identity;
- audio URI or a transcript with its voice or keyboard origin. A completed
  System recognition remains voice input. Keyboard input has no STT route;
- the receipt names the serialized effort field, including `reasoning.effort`
  for OpenRouter and `reasoning_effort` for the corresponding DashScope route;
- current messages and optional image attachments;
- response route, model effort, and provider key;
- STT and TTS modes, models, language, voice, and explicit fallback order;
- summary and cross-session-knowledge policy;
- response style and conversation overrides;
- web-search and Model Council configuration;
- playback policy; and
- callbacks plus one abort signal.

**Decision:** Route and policy are snapshotted at turn start. Settings changes
during a long request affect the next turn, not the request already executing.

## Ordered Stages

1. Obtain the required AI sharing permissions for the selected recipients.
   Then transcribe recorded audio or normalize the submitted text.
2. Persist the user turn through `onTranscription` and resolve the effective
   conversation ID.
3. Build a bounded active-conversation context and refresh its summary when
   required and allowed.
4. Optionally retrieve source-labelled past-conversation excerpts.
5. Decide and optionally perform web search.
6. Optionally run Model Council private contributions and review rounds.
7. Stream the final provider response through the context-leak guard.
8. Queue complete paragraphs or the completed answer for optional speech.
9. Persist the final assistant response, route metadata, usage, and turn
   receipt through callbacks.
10. Record terminal state and clean temporary captured audio.

The detailed orchestration and callback flow live in [`DESIGN.md`](./DESIGN.md).

## Cancellation and Terminal State

The abort signal is checked after every asynchronous stage and propagated to
network, local inference, deliberation, and speech preparation. Once aborted,
no later stage may publish a response or mutate conversation state.

Exactly one terminal run event is recorded: complete, failed, or aborted.
Cleanup always runs.

**Decision:** Audio is retained after a non-aborted transcription failure or
empty transcription so recovery remains possible. Otherwise temporary capture
is deleted.

## AI sharing

Each turn names its reply provider, every Council recipient and the data each
would receive before a recording, image or prompt leaves the device. A Council
change requires approval for its roster and final-answer provider. A required
permission that is declined ends the turn before accepting the text or image
draft. When automatic naming is enabled, only the first eligible prompt
offers title generation to the selected final provider. Search, other
conversations and hosted speech are optional. Revoking
an active permission aborts later calls, including retries and Council rounds.

Only current attachments can enter a request. Sending a checkpoint photo again
uses the same image permission as attaching it explicitly. Text history may
include the visible text of a message previously shared with every recipient,
or text the user chose to share for that conversation. Earlier photo bytes,
signed model state and other message metadata stay out of history. On a
provider switch the new recipient receives only its permitted text. Choosing
a route alone sends nothing.

Search receives the current query when allowed. It may receive a summary only
when its own text-history permission covers the source messages. Council
receives one common set of text, summary and optional knowledge for all
participants and the final-answer provider; review drafts and fallback
synthesis inherit that same boundary. Cloud speech requires provider-specific
permission on the primary route, fallback and replay. Android System speech
lists and selects only installed voices that the active engine identifies as
offline. Playing a reply or preview verifies the engine's chosen voice again
before giving it the text. With no matching installed voice, playback reports
the normal speech error.

## Context Rules

Active-conversation compaction starts when estimated content exceeds 2,400
tokens or an eligible existing summary is active. Reuse requires a local
receipt for the exact summary and its covered source text. A summary generated
from a filtered subset can serve the current turn; only full-transcript
coverage updates the saved summary. The recent window targets 1,400 tokens
while retaining at least six and at most ten messages when available.

Historical knowledge excludes the current conversation, explicit family IDs,
locked sessions, and other caller-ineligible sources. It is kept separate from
the current-session summary.

## Optional Web Search

Search is a decision stage, not an automatic property of a response-mode label.
The heuristic receives mode, readiness, language, current query, and recent
messages. When search is requested but the provider fails, the response may
continue without search and records the fallback in the receipt. The search
service returns only a usable evidence brief; its deadline covers both headers
and response-body consumption. The resulting context is passed unchanged to
Council and final-response preparation.

Turn-owned degradation remains attached to the assistant reply. Web-search
fallback and TTS fallback are persisted as `PipelineNotices` metadata and do
not also emit global toasts; the transcript must remain the durable explanation
after the transient workspace state has passed.

## Model Council

Model Council runs independent initial contributions, then immutable shared review
snapshots. A review round converges only when every active participant returns
the explicit converged marker; a challenge, missing marker, or failed call keeps
the configured review depth.

Each private participant has a ten-minute absolute deadline. Terminally failed
participants are retired from later rounds; successful participants continue.
Participants run one after another within each immutable round. Progress names
the participant currently in flight and reports again whenever it settles, so
the workspace can truthfully pair its active model with completed and failed
counts without completion-order races.
The public progress contract counts the independent contribution batch as round
one, so `totalRounds` equals that batch plus the configured review rounds. It
separates models that returned usable responses from failed but settled calls,
and later rounds use only their active, non-retired participant count. After
deliberation it changes to an explicit synthesis stage. React state clears the
progress at the beginning and terminal cleanup of every turn.

The final synthesis retains every participant's latest successful position and
as much earlier reasoning as fits the 24,000-token estimate. Its visible
completion has a separate 32,000-character ceiling at the shared streaming
boundary; this limit is independent of provider token settings and prevents a
runaway synthesis from overwhelming rendering, leak inspection, or speech.

**Decision:** Both the round barrier and sequential participant order are
deliberate. Every reviewer sees the same snapshot, while the visible current
model and the provider-billing arithmetic correspond to exactly one in-flight
participant call.

## Response and Speech

When provider speech is used, the transport reports request start and audio
response headers for the active request. Home uses these stages and the
provider selected for that turn or replay to describe speech preparation.
A cached or local clip uses the preparation state until playback starts.

The final response uses hosted `streamChat`. Local response generation is not
part of this pipeline. Stream chunks update the transcript only after the
context-leak guard accepts them.

When playback is streaming, complete paragraphs enter the TTS queue as they
arrive. Provider/local synthesis prefetches with bounded concurrency while an
output chain preserves paragraph order, and the native audio queue serializes
its enqueue path so concurrent session preparation cannot reorder clips at the
native boundary. “Wait” playback emits synthesized results only after response
completion. Visual Markdown is deterministically rendered into listenable
speech before sentence chunking.

Every emitted clip carries what it says and whether it opens a paragraph. The
player's reel needs both: the text is the weight behind the orb's reading arc,
and the paragraph flag is where Back and Forward may land. The pipeline is the
only place that still knows either, since a synthesized clip is a bare URI by
the time playback sees it. Streaming paragraphs, a completed wait-mode answer,
and transcript Restart all pass through this same paragraph queue; none may
collapse a multi-paragraph reply into paragraph zero. Wait-mode playback retains
an explicit pause between paragraphs, including when synthesis falls back to
native speech; seek metadata alone does not create an audible pause.

Live System recognition holds a platform-completed result until the user submits
or discards the capture. File recognition allows the recording duration plus
processing headroom. A deadline failure aborts the recognizer and surfaces an
error. The microphone WAV is deleted after recognition settles, including on
failure and cancellation.

Fallback routes are normalized from the user's explicit policy. A failed
primary route may move only through that order, and diagnostics retain every
attempt.

When Council selects a different synthesis route, the final receipt and the
persisted assistant message both identify that actual provider and model. The
requested route remains unchanged in the receipt, and transport-level model
fallback further refines the actual model before persistence.

## Turn Receipt

Every completed assistant turn records:

- input source and actual STT model;
- requested and actual response route, effort, gateway, upstream, and attempts;
- summary reuse/update/fallback and message counts;
- past-knowledge request/use/source count;
- web-search decision, provider, model, use, and fallback;
- requested and actual TTS route plus fallback attempts; and
- phase and total timings.

This receipt is the user-facing audit boundary and the basis for runtime
diagnosis without logging conversation content.

## Evidence

- [`../voicePipeline.ts`](../voicePipeline.ts)
- [`types.ts`](./types.ts)
- [`context.ts`](./context.ts)
- [`response.ts`](./response.ts)
- [`ttsQueue.ts`](./ttsQueue.ts)
- [`../../../__tests__/services/voicePipeline.test.ts`](../../../__tests__/services/voicePipeline.test.ts)
